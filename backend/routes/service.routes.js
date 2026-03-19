// Service Routes
// API endpoints for services and packages

const express = require('express');
const { PrismaClient } = require('@prisma/client');

const router = express.Router();
const prisma = new PrismaClient();

// ============================================
// GET /api/services
// List all active services
// ============================================
router.get('/', async (req, res, next) => {
    try {
        const services = await prisma.service.findMany({
            where: { isActive: true },
            orderBy: { displayOrder: 'asc' },
            select: {
                id: true,
                serviceName: true,
                serviceType: true,
                description: true,
                displayOrder: true
            }
        });

        res.json({
            success: true,
            data: services
        });
    } catch (error) {
        next(error);
    }
});

// ============================================
// GET /api/services/:typeOrId
// Get single service by type or ID
// ============================================
router.get('/:typeOrId', async (req, res, next) => {
    try {
        const { typeOrId } = req.params;

        // Try to find by service type first (more common usage)
        let service = await prisma.service.findUnique({
            where: { serviceType: typeOrId },
            include: {
                packages: {
                    where: { isActive: true },
                    orderBy: { displayOrder: 'asc' },
                    select: {
                        id: true,
                        packageName: true,
                        price: true,
                        description: true,
                        sessionCount: true,
                        displayOrder: true
                    }
                }
            }
        });

        // If not found by type, try by ID
        if (!service) {
            service = await prisma.service.findUnique({
                where: { id: typeOrId },
                include: {
                    packages: {
                        where: { isActive: true },
                        orderBy: { displayOrder: 'asc' },
                        select: {
                            id: true,
                            packageName: true,
                            price: true,
                            description: true,
                            sessionCount: true,
                            displayOrder: true
                        }
                    }
                }
            });
        }

        if (!service) {
            return res.status(404).json({
                success: false,
                error: 'Service not found'
            });
        }

        res.json({
            success: true,
            data: service
        });
    } catch (error) {
        next(error);
    }
});

// ============================================
// GET /api/services/:type/packages
// Get packages for a service type
// ============================================
router.get('/:type/packages', async (req, res, next) => {
    try {
        const { type } = req.params;

        const service = await prisma.service.findUnique({
            where: { serviceType: type }
        });

        if (!service) {
            return res.status(404).json({
                success: false,
                error: 'Service type not found'
            });
        }

        const packages = await prisma.package.findMany({
            where: {
                serviceId: service.id,
                isActive: true
            },
            orderBy: { displayOrder: 'asc' },
            select: {
                id: true,
                packageName: true,
                price: true,
                description: true,
                sessionCount: true,
                displayOrder: true
            }
        });

        res.json({
            success: true,
            data: {
                service: {
                    id: service.id,
                    serviceName: service.serviceName,
                    serviceType: service.serviceType
                },
                packages: packages
            }
        });
    } catch (error) {
        next(error);
    }
});

// ============================================
// GET /api/services/blocked-dates
// Get all blocked dates for practice tests
// ============================================
router.get('/practice-tests/blocked-dates', async (req, res, next) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const blockedDates = await prisma.blockedDate.findMany({
            where: {
                isActive: true,
                blockedDate: {
                    gte: today
                }
            },
            orderBy: { blockedDate: 'asc' },
            select: {
                id: true,
                blockedDate: true,
                reason: true
            }
        });

        res.json({
            success: true,
            data: blockedDates.map(bd => ({
                id: bd.id,
                date: bd.blockedDate.toISOString().split('T')[0],
                reason: bd.reason
            }))
        });
    } catch (error) {
        next(error);
    }
});

// ============================================
// GET /api/services/practice-tests/available-saturdays
// Get available Saturdays for the next 3 months
// ============================================
router.get('/practice-tests/available-saturdays', async (req, res, next) => {
    try {
        // Get blocked dates
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const blockedDates = await prisma.blockedDate.findMany({
            where: {
                isActive: true,
                blockedDate: { gte: today }
            },
            select: { blockedDate: true }
        });

        const blockedSet = new Set(
            blockedDates.map(bd => bd.blockedDate.toISOString().split('T')[0])
        );

        // Generate next 12 Saturdays
        const saturdays = [];
        const current = new Date(today);

        // Find next Saturday
        const daysUntilSaturday = (6 - current.getDay() + 7) % 7;
        if (daysUntilSaturday === 0 && current <= today) {
            current.setDate(current.getDate() + 7);
        } else {
            current.setDate(current.getDate() + daysUntilSaturday);
        }

        // Collect 12 Saturdays
        for (let i = 0; i < 12; i++) {
            const dateStr = current.toISOString().split('T')[0];
            if (!blockedSet.has(dateStr)) {
                saturdays.push(dateStr);
            }
            current.setDate(current.getDate() + 7);
        }

        res.json({
            success: true,
            data: saturdays
        });
    } catch (error) {
        next(error);
    }
});

module.exports = router;
