// Bugle Learn - Express Backend Server
// Main entry point for the API

require('dotenv').config();

const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');

// Initialize Prisma
const prisma = new PrismaClient();

// Initialize Express
const app = express();
const PORT = process.env.PORT || 3001;

// ============================================
// MIDDLEWARE
// ============================================

// CORS configuration
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true
}));

// JSON body parser
app.use(express.json());

// Request logging
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} | ${req.method} ${req.path}`);
    next();
});

// ============================================
// ROUTES
// ============================================

// Health check
app.get('/api/health', (req, res) => {
    res.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        service: 'Bugle Learn API'
    });
});

// Import route modules
const serviceRoutes = require('./routes/service.routes');
const inquiryRoutes = require('./routes/inquiry.routes');
const registrationRoutes = require('./routes/registration.routes');
const paymentRoutes = require('./routes/payment.routes');
const adminRoutes = require('./routes/admin.routes');

// Mount routes
app.use('/api/services', serviceRoutes);
app.use('/api/inquiries', inquiryRoutes);
app.use('/api/registrations', registrationRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/admin', adminRoutes);

// ============================================
// ERROR HANDLING
// ============================================

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        error: 'Not Found',
        message: `Cannot ${req.method} ${req.path}`
    });
});

// Global error handler
app.use((err, req, res, next) => {
    console.error('Error:', err);

    // Handle Prisma errors
    if (err.code === 'P2002') {
        return res.status(409).json({
            error: 'Conflict',
            message: 'A record with this data already exists'
        });
    }

    if (err.code === 'P2025') {
        return res.status(404).json({
            error: 'Not Found',
            message: 'Record not found'
        });
    }

    // Handle validation errors
    if (err.name === 'ValidationError') {
        return res.status(400).json({
            error: 'Validation Error',
            message: err.message,
            details: err.details || null
        });
    }

    // Handle JWT errors
    if (err.name === 'JsonWebTokenError') {
        return res.status(401).json({
            error: 'Unauthorized',
            message: 'Invalid token'
        });
    }

    if (err.name === 'TokenExpiredError') {
        return res.status(401).json({
            error: 'Unauthorized',
            message: 'Token expired'
        });
    }

    // Default error response
    res.status(err.status || 500).json({
        error: err.name || 'Internal Server Error',
        message: process.env.NODE_ENV === 'production'
            ? 'An unexpected error occurred'
            : err.message
    });
});

// ============================================
// SERVER START
// ============================================

// Graceful shutdown
process.on('SIGTERM', async () => {
    console.log('SIGTERM received. Closing server...');
    await prisma.$disconnect();
    process.exit(0);
});

// Start server
app.listen(PORT, () => {
    console.log(`
╔══════════════════════════════════════════════════════╗
║           🎓 BUGLE LEARN API SERVER 🎓               ║
╠══════════════════════════════════════════════════════╣
║  Status:     Running                                 ║
║  Port:       ${String(PORT).padEnd(40)}║
║  Env:        ${String(process.env.NODE_ENV || 'development').padEnd(40)}║
║  Time:       ${new Date().toISOString().padEnd(40)}║
╚══════════════════════════════════════════════════════╝
  `);
});

// Export for testing
module.exports = { app, prisma };
