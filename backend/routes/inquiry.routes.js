// Inquiry Routes
// API endpoints for consultation/inquiry requests

const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { validateInquiryData } = require('../middleware/validation');

const router = express.Router();
const prisma = new PrismaClient();

// ============================================
// POST /api/inquiries
// Create a new consultation inquiry
// ============================================
router.post('/', validateInquiryData, async (req, res, next) => {
    try {
        const {
            fullName,
            email,
            phone,
            inquiryType,
            preferredDate,
            preferredTime,
            primaryInterest,
            message
        } = req.body;

        // Check if parent exists with this email
        let parentId = null;
        const existingParent = await prisma.parent.findUnique({
            where: { email: email.toLowerCase() }
        });

        if (existingParent) {
            parentId = existingParent.id;
        }

        // Create inquiry
        const inquiry = await prisma.inquiry.create({
            data: {
                parentId,
                fullName: fullName.trim(),
                email: email.toLowerCase(),
                phone: phone.trim(),
                inquiryType: inquiryType || 'consultation',
                preferredDate: preferredDate ? new Date(preferredDate) : null,
                preferredTime: preferredTime || null,
                primaryInterest: primaryInterest || null,
                message: message ? message.trim() : null,
                status: 'new'
            }
        });

        console.log(`✅ New inquiry created: ${inquiry.id} from ${email}`);

        res.status(201).json({
            success: true,
            message: 'Consultation request submitted successfully',
            data: {
                inquiryId: inquiry.id,
                confirmationNumber: `INQ-${inquiry.id.substring(0, 8).toUpperCase()}`
            }
        });
    } catch (error) {
        next(error);
    }
});

// ============================================
// GET /api/inquiries/:id
// Get inquiry details (for payment flow)
// ============================================
router.get('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;

        const inquiry = await prisma.inquiry.findUnique({
            where: { id },
            include: {
                payments: {
                    orderBy: { createdAt: 'desc' },
                    take: 1
                }
            }
        });

        if (!inquiry) {
            return res.status(404).json({
                success: false,
                error: 'Inquiry not found'
            });
        }

        // Get consultation package for price
        const consultationService = await prisma.service.findUnique({
            where: { serviceType: 'CONSULTATION' },
            include: {
                packages: {
                    where: { isActive: true },
                    take: 1
                }
            }
        });

        const consultationPrice = consultationService?.packages[0]?.price || 199.00;

        res.json({
            success: true,
            data: {
                id: inquiry.id,
                fullName: inquiry.fullName,
                email: inquiry.email,
                phone: inquiry.phone,
                inquiryType: inquiry.inquiryType,
                preferredDate: inquiry.preferredDate,
                preferredTime: inquiry.preferredTime,
                primaryInterest: inquiry.primaryInterest,
                message: inquiry.message,
                status: inquiry.status,
                price: parseFloat(consultationPrice),
                createdAt: inquiry.createdAt,
                paymentStatus: inquiry.payments[0]?.paymentStatus || null
            }
        });
    } catch (error) {
        next(error);
    }
});

module.exports = router;
