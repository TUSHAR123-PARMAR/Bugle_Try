// Authentication Middleware
// JWT token verification and admin role checking

const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'bugle-learn-jwt-secret';
const TOKEN_EXPIRY = '4h'; // 4 hour session timeout as specified

// ============================================
// GENERATE TOKEN
// ============================================
function generateToken(adminUser) {
    return jwt.sign(
        {
            id: adminUser.id,
            email: adminUser.email,
            role: adminUser.role
        },
        JWT_SECRET,
        { expiresIn: TOKEN_EXPIRY }
    );
}

// ============================================
// VERIFY TOKEN MIDDLEWARE
// ============================================
async function verifyToken(req, res, next) {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(401).json({
                error: 'Unauthorized',
                message: 'No authorization header provided'
            });
        }

        if (!authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                error: 'Unauthorized',
                message: 'Invalid authorization format. Use: Bearer <token>'
            });
        }

        const token = authHeader.substring(7);

        // Verify token
        const decoded = jwt.verify(token, JWT_SECRET);

        // Check if admin still exists and is active
        const admin = await prisma.adminUser.findUnique({
            where: { id: decoded.id }
        });

        if (!admin) {
            return res.status(401).json({
                error: 'Unauthorized',
                message: 'Admin user not found'
            });
        }

        if (!admin.isActive) {
            return res.status(401).json({
                error: 'Unauthorized',
                message: 'Admin account is deactivated'
            });
        }

        // Attach admin to request
        req.admin = {
            id: admin.id,
            email: admin.email,
            role: admin.role
        };

        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                error: 'Unauthorized',
                message: 'Session expired. Please login again.'
            });
        }

        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({
                error: 'Unauthorized',
                message: 'Invalid token'
            });
        }

        console.error('Auth error:', error);
        return res.status(500).json({
            error: 'Internal Server Error',
            message: 'Authentication failed'
        });
    }
}

// ============================================
// REQUIRE SUPER ADMIN MIDDLEWARE
// ============================================
function requireSuperAdmin(req, res, next) {
    if (req.admin.role !== 'super_admin') {
        return res.status(403).json({
            error: 'Forbidden',
            message: 'Super admin access required'
        });
    }
    next();
}

// ============================================
// EXPORTS
// ============================================
module.exports = {
    generateToken,
    verifyToken,
    requireSuperAdmin,
    JWT_SECRET,
    TOKEN_EXPIRY
};
