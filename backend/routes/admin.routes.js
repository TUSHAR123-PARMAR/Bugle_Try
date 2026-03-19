// Admin Routes
// API endpoints for admin panel

const express = require('express');
const bcrypt = require('bcrypt');
const { PrismaClient } = require('@prisma/client');
const { verifyToken, generateToken, requireSuperAdmin } = require('../middleware/auth');
const { validateSaturdayDate } = require('../middleware/validation');

const router = express.Router();
const prisma = new PrismaClient();

// ============================================
// POST /api/admin/login
// Admin authentication
// ============================================
router.post('/login', async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                error: 'Email and password are required'
            });
        }

        const admin = await prisma.adminUser.findUnique({
            where: { email: email.toLowerCase() }
        });

        if (!admin) {
            // Log failed attempt
            console.log(`❌ Failed login attempt for: ${email}`);
            return res.status(401).json({
                success: false,
                error: 'Invalid email or password'
            });
        }

        if (!admin.isActive) {
            return res.status(401).json({
                success: false,
                error: 'Account is deactivated'
            });
        }

        const passwordMatch = await bcrypt.compare(password, admin.passwordHash);

        if (!passwordMatch) {
            console.log(`❌ Failed login attempt for: ${email} (wrong password)`);
            return res.status(401).json({
                success: false,
                error: 'Invalid email or password'
            });
        }

        // Update last login
        await prisma.adminUser.update({
            where: { id: admin.id },
            data: { lastLoginAt: new Date() }
        });

        const token = generateToken(admin);

        console.log(`✅ Admin logged in: ${email}`);

        res.json({
            success: true,
            data: {
                token,
                admin: {
                    id: admin.id,
                    email: admin.email,
                    role: admin.role
                }
            }
        });
    } catch (error) {
        next(error);
    }
});

// ============================================
// All routes below require authentication
// ============================================

// GET /api/admin/dashboard
// Get dashboard statistics
router.get('/dashboard', verifyToken, async (req, res, next) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const thirtyDaysAgo = new Date(today);
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        // Get counts
        const [
            totalInquiries,
            newInquiries,
            totalRegistrations,
            pendingPayments,
            completedPayments,
            recentPaymentsSum
        ] = await Promise.all([
            prisma.inquiry.count(),
            prisma.inquiry.count({ where: { status: 'new' } }),
            prisma.registration.count(),
            prisma.registration.count({ where: { registrationStatus: 'pending_payment' } }),
            prisma.registration.count({ where: { registrationStatus: 'completed' } }),
            prisma.payment.aggregate({
                where: {
                    paymentStatus: 'succeeded',
                    createdAt: { gte: thirtyDaysAgo }
                },
                _sum: { amount: true }
            })
        ]);

        res.json({
            success: true,
            data: {
                inquiries: {
                    total: totalInquiries,
                    new: newInquiries
                },
                registrations: {
                    total: totalRegistrations,
                    pendingPayment: pendingPayments,
                    completed: completedPayments
                },
                revenue: {
                    last30Days: parseFloat(recentPaymentsSum._sum.amount || 0)
                }
            }
        });
    } catch (error) {
        next(error);
    }
});

// ============================================
// INQUIRY MANAGEMENT
// ============================================

// GET /api/admin/inquiries
router.get('/inquiries', verifyToken, async (req, res, next) => {
    try {
        const { status, page = 1, limit = 20 } = req.query;

        const where = status ? { status } : {};

        const [inquiries, total] = await Promise.all([
            prisma.inquiry.findMany({
                where,
                orderBy: { createdAt: 'desc' },
                skip: (page - 1) * limit,
                take: parseInt(limit)
            }),
            prisma.inquiry.count({ where })
        ]);

        res.json({
            success: true,
            data: {
                inquiries,
                pagination: {
                    page: parseInt(page),
                    limit: parseInt(limit),
                    total,
                    pages: Math.ceil(total / limit)
                }
            }
        });
    } catch (error) {
        next(error);
    }
});

// PATCH /api/admin/inquiries/:id
router.patch('/inquiries/:id', verifyToken, async (req, res, next) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const validStatuses = ['new', 'contacted', 'converted', 'closed'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                error: `Status must be one of: ${validStatuses.join(', ')}`
            });
        }

        const inquiry = await prisma.inquiry.update({
            where: { id },
            data: { status }
        });

        res.json({
            success: true,
            data: inquiry
        });
    } catch (error) {
        next(error);
    }
});

// ============================================
// REGISTRATION MANAGEMENT
// ============================================

// GET /api/admin/registrations
router.get('/registrations', verifyToken, async (req, res, next) => {
    try {
        const { status, serviceType, page = 1, limit = 20 } = req.query;

        const where = {};
        if (status) where.registrationStatus = status;
        if (serviceType) where.service = { serviceType };

        const [registrations, total] = await Promise.all([
            prisma.registration.findMany({
                where,
                include: {
                    parent: true,
                    student: true,
                    service: true,
                    package: true
                },
                orderBy: { createdAt: 'desc' },
                skip: (page - 1) * limit,
                take: parseInt(limit)
            }),
            prisma.registration.count({ where })
        ]);

        res.json({
            success: true,
            data: {
                registrations: registrations.map(r => ({
                    id: r.id,
                    confirmationNumber: `REG-${r.id.substring(0, 8).toUpperCase()}`,
                    parent: {
                        name: `${r.parent.firstName} ${r.parent.lastName}`,
                        email: r.parent.email,
                        phone: r.parent.phone
                    },
                    student: {
                        name: `${r.student.firstName} ${r.student.lastName}`,
                        school: r.student.school,
                        grade: r.student.grade
                    },
                    service: r.service.serviceName,
                    package: r.package.packageName,
                    price: parseFloat(r.packagePrice),
                    status: r.registrationStatus,
                    createdAt: r.createdAt
                })),
                pagination: {
                    page: parseInt(page),
                    limit: parseInt(limit),
                    total,
                    pages: Math.ceil(total / limit)
                }
            }
        });
    } catch (error) {
        next(error);
    }
});

// GET /api/admin/registrations/:id
router.get('/registrations/:id', verifyToken, async (req, res, next) => {
    try {
        const { id } = req.params;

        const registration = await prisma.registration.findUnique({
            where: { id },
            include: {
                parent: true,
                student: true,
                service: true,
                package: true,
                payments: {
                    orderBy: { createdAt: 'desc' }
                }
            }
        });

        if (!registration) {
            return res.status(404).json({
                success: false,
                error: 'Registration not found'
            });
        }

        res.json({
            success: true,
            data: registration
        });
    } catch (error) {
        next(error);
    }
});

// ============================================
// PAYMENT MANAGEMENT
// ============================================

// GET /api/admin/payments
router.get('/payments', verifyToken, async (req, res, next) => {
    try {
        const { status, page = 1, limit = 20 } = req.query;

        const where = status ? { paymentStatus: status } : {};

        const [payments, total] = await Promise.all([
            prisma.payment.findMany({
                where,
                include: {
                    registration: {
                        include: {
                            service: true,
                            package: true
                        }
                    },
                    inquiry: true
                },
                orderBy: { createdAt: 'desc' },
                skip: (page - 1) * limit,
                take: parseInt(limit)
            }),
            prisma.payment.count({ where })
        ]);

        res.json({
            success: true,
            data: {
                payments: payments.map(p => ({
                    id: p.id,
                    stripePaymentIntentId: p.stripePaymentIntentId,
                    amount: parseFloat(p.amount),
                    status: p.paymentStatus,
                    type: p.registrationId ? 'registration' : 'consultation',
                    serviceName: p.registration?.service?.serviceName || 'Consultation',
                    billingEmail: p.billingEmail,
                    createdAt: p.createdAt
                })),
                pagination: {
                    page: parseInt(page),
                    limit: parseInt(limit),
                    total,
                    pages: Math.ceil(total / limit)
                }
            }
        });
    } catch (error) {
        next(error);
    }
});

// ============================================
// BLOCKED DATE MANAGEMENT
// ============================================

// GET /api/admin/blocked-dates
router.get('/blocked-dates', verifyToken, async (req, res, next) => {
    try {
        const blockedDates = await prisma.blockedDate.findMany({
            where: { isActive: true },
            orderBy: { blockedDate: 'asc' }
        });

        res.json({
            success: true,
            data: blockedDates.map(bd => ({
                id: bd.id,
                date: bd.blockedDate.toISOString().split('T')[0],
                reason: bd.reason,
                createdAt: bd.createdAt
            }))
        });
    } catch (error) {
        next(error);
    }
});

// POST /api/admin/blocked-dates
router.post('/blocked-dates', verifyToken, async (req, res, next) => {
    try {
        const { date, reason } = req.body;

        // Validate it's a Saturday
        const dateCheck = validateSaturdayDate(date);
        if (!dateCheck.valid) {
            return res.status(400).json({
                success: false,
                error: dateCheck.error
            });
        }

        // Check if already blocked
        const existing = await prisma.blockedDate.findFirst({
            where: {
                blockedDate: new Date(date),
                isActive: true
            }
        });

        if (existing) {
            return res.status(400).json({
                success: false,
                error: 'This date is already blocked'
            });
        }

        const blockedDate = await prisma.blockedDate.create({
            data: {
                blockedDate: new Date(date),
                reason: reason || null,
                createdBy: req.admin.id
            }
        });

        res.status(201).json({
            success: true,
            data: {
                id: blockedDate.id,
                date: blockedDate.blockedDate.toISOString().split('T')[0],
                reason: blockedDate.reason
            }
        });
    } catch (error) {
        next(error);
    }
});

// DELETE /api/admin/blocked-dates/:id
router.delete('/blocked-dates/:id', verifyToken, async (req, res, next) => {
    try {
        const { id } = req.params;

        await prisma.blockedDate.update({
            where: { id },
            data: { isActive: false }
        });

        res.json({
            success: true,
            message: 'Blocked date removed'
        });
    } catch (error) {
        next(error);
    }
});

// ============================================
// SERVICE & PACKAGE MANAGEMENT
// ============================================

// GET /api/admin/services
router.get('/services', verifyToken, async (req, res, next) => {
    try {
        const services = await prisma.service.findMany({
            include: {
                packages: {
                    orderBy: { displayOrder: 'asc' }
                }
            },
            orderBy: { displayOrder: 'asc' }
        });

        res.json({
            success: true,
            data: services
        });
    } catch (error) {
        next(error);
    }
});

// PATCH /api/admin/packages/:id
router.patch('/packages/:id', verifyToken, requireSuperAdmin, async (req, res, next) => {
    try {
        const { id } = req.params;
        const { price, isActive, description } = req.body;

        const updateData = {};
        if (price !== undefined) updateData.price = parseFloat(price);
        if (isActive !== undefined) updateData.isActive = isActive;
        if (description !== undefined) updateData.description = description;

        const pkg = await prisma.package.update({
            where: { id },
            data: updateData
        });

        console.log(`📦 Package ${id} updated by admin ${req.admin.email}`);

        res.json({
            success: true,
            data: pkg
        });
    } catch (error) {
        next(error);
    }
});

module.exports = router;
