// Payment Routes
// API endpoints for Stripe payment processing

const express = require('express');
const { PrismaClient } = require('@prisma/client');
const Stripe = require('stripe');

const router = express.Router();
const prisma = new PrismaClient();

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2023-10-16'
});

// ============================================
// POST /api/payments/create-payment-intent
// Create a Stripe payment intent
// ============================================
router.post('/create-payment-intent', async (req, res, next) => {
    try {
        const { registrationId, inquiryId, email } = req.body;

        // Validate: one of registrationId or inquiryId must be provided
        if (!registrationId && !inquiryId) {
            return res.status(400).json({
                success: false,
                error: 'Either registrationId or inquiryId is required'
            });
        }

        if (registrationId && inquiryId) {
            return res.status(400).json({
                success: false,
                error: 'Cannot provide both registrationId and inquiryId'
            });
        }

        let amount;
        let description;
        let metadata;
        let customerEmail = email;

        if (registrationId) {
            // Get registration details
            const registration = await prisma.registration.findUnique({
                where: { id: registrationId },
                include: {
                    parent: true,
                    service: true,
                    package: true
                }
            });

            if (!registration) {
                return res.status(404).json({
                    success: false,
                    error: 'Registration not found'
                });
            }

            // Check if already paid
            const existingPayment = await prisma.payment.findFirst({
                where: {
                    registrationId,
                    paymentStatus: 'succeeded'
                }
            });

            if (existingPayment) {
                return res.status(400).json({
                    success: false,
                    error: 'This registration has already been paid'
                });
            }

            amount = Math.round(parseFloat(registration.packagePrice) * 100); // Convert to cents
            description = `Bugle Learn - ${registration.service.serviceName}: ${registration.package.packageName}`;
            metadata = {
                registrationId,
                serviceType: registration.service.serviceType,
                packageName: registration.package.packageName
            };
            customerEmail = email || registration.parent.email;

        } else {
            // Get inquiry details (consultation)
            const inquiry = await prisma.inquiry.findUnique({
                where: { id: inquiryId }
            });

            if (!inquiry) {
                return res.status(404).json({
                    success: false,
                    error: 'Inquiry not found'
                });
            }

            // Check if already paid
            const existingPayment = await prisma.payment.findFirst({
                where: {
                    inquiryId,
                    paymentStatus: 'succeeded'
                }
            });

            if (existingPayment) {
                return res.status(400).json({
                    success: false,
                    error: 'This consultation has already been paid'
                });
            }

            // Get consultation price from database
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
            amount = Math.round(parseFloat(consultationPrice) * 100); // Convert to cents
            description = 'Bugle Learn - 45-Minute Consultation';
            metadata = {
                inquiryId,
                serviceType: 'CONSULTATION'
            };
            customerEmail = email || inquiry.email;
        }

        // Create Stripe payment intent
        const paymentIntent = await stripe.paymentIntents.create({
            amount,
            currency: 'usd',
            description,
            metadata,
            receipt_email: customerEmail,
            automatic_payment_methods: {
                enabled: true
            }
        });

        // Create payment record
        await prisma.payment.create({
            data: {
                registrationId: registrationId || null,
                inquiryId: inquiryId || null,
                stripePaymentIntentId: paymentIntent.id,
                amount: amount / 100, // Store in dollars
                currency: 'USD',
                paymentStatus: 'pending',
                billingEmail: customerEmail
            }
        });

        console.log(`💳 Payment intent created: ${paymentIntent.id} for $${amount / 100}`);

        res.json({
            success: true,
            data: {
                clientSecret: paymentIntent.client_secret,
                paymentIntentId: paymentIntent.id,
                amount: amount / 100
            }
        });
    } catch (error) {
        next(error);
    }
});

// ============================================
// POST /api/payments/confirm
// Confirm payment completion (called after Stripe success)
// ============================================
router.post('/confirm', async (req, res, next) => {
    try {
        const { paymentIntentId } = req.body;

        if (!paymentIntentId) {
            return res.status(400).json({
                success: false,
                error: 'paymentIntentId is required'
            });
        }

        // Retrieve payment intent from Stripe to verify status
        const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

        // Find our payment record
        const payment = await prisma.payment.findUnique({
            where: { stripePaymentIntentId: paymentIntentId }
        });

        if (!payment) {
            return res.status(404).json({
                success: false,
                error: 'Payment record not found'
            });
        }

        // Update payment status based on Stripe status
        const paymentStatus = paymentIntent.status === 'succeeded' ? 'succeeded' :
            paymentIntent.status === 'canceled' ? 'cancelled' :
                paymentIntent.status === 'requires_payment_method' ? 'failed' :
                    'pending';

        const updatedPayment = await prisma.payment.update({
            where: { id: payment.id },
            data: {
                paymentStatus,
                paymentMethodType: paymentIntent.payment_method_types?.[0] || null
            }
        });

        // If payment succeeded, update registration/inquiry status
        if (paymentStatus === 'succeeded') {
            if (payment.registrationId) {
                await prisma.registration.update({
                    where: { id: payment.registrationId },
                    data: { registrationStatus: 'completed' }
                });
                console.log(`✅ Registration ${payment.registrationId} marked as completed`);
            }

            if (payment.inquiryId) {
                await prisma.inquiry.update({
                    where: { id: payment.inquiryId },
                    data: { status: 'converted' }
                });
                console.log(`✅ Inquiry ${payment.inquiryId} marked as converted`);
            }
        }

        res.json({
            success: true,
            data: {
                paymentId: updatedPayment.id,
                status: paymentStatus,
                amount: parseFloat(updatedPayment.amount),
                registrationId: payment.registrationId,
                inquiryId: payment.inquiryId
            }
        });
    } catch (error) {
        next(error);
    }
});

// ============================================
// POST /api/payments/webhook
// Stripe webhook handler
// ============================================
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
    const sig = req.headers['stripe-signature'];
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    let event;

    try {
        event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
    } catch (err) {
        console.error('Webhook signature verification failed:', err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the event
    switch (event.type) {
        case 'payment_intent.succeeded':
            const paymentIntent = event.data.object;
            console.log(`Webhook: PaymentIntent ${paymentIntent.id} succeeded`);

            // Update our records
            await prisma.payment.updateMany({
                where: { stripePaymentIntentId: paymentIntent.id },
                data: {
                    paymentStatus: 'succeeded',
                    paymentMethodType: paymentIntent.payment_method_types?.[0]
                }
            });

            // Get payment to update registration/inquiry
            const payment = await prisma.payment.findUnique({
                where: { stripePaymentIntentId: paymentIntent.id }
            });

            if (payment?.registrationId) {
                await prisma.registration.update({
                    where: { id: payment.registrationId },
                    data: { registrationStatus: 'completed' }
                });
            }

            if (payment?.inquiryId) {
                await prisma.inquiry.update({
                    where: { id: payment.inquiryId },
                    data: { status: 'converted' }
                });
            }
            break;

        case 'payment_intent.payment_failed':
            const failedIntent = event.data.object;
            console.log(`Webhook: PaymentIntent ${failedIntent.id} failed`);

            await prisma.payment.updateMany({
                where: { stripePaymentIntentId: failedIntent.id },
                data: {
                    paymentStatus: 'failed',
                    errorMessage: failedIntent.last_payment_error?.message || 'Payment failed'
                }
            });
            break;

        default:
            console.log(`Unhandled event type: ${event.type}`);
    }

    res.json({ received: true });
});

// ============================================
// GET /api/payments/:id
// Get payment details
// ============================================
router.get('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;

        const payment = await prisma.payment.findUnique({
            where: { id },
            include: {
                registration: {
                    include: {
                        service: true,
                        package: true
                    }
                },
                inquiry: true
            }
        });

        if (!payment) {
            return res.status(404).json({
                success: false,
                error: 'Payment not found'
            });
        }

        res.json({
            success: true,
            data: {
                id: payment.id,
                stripePaymentIntentId: payment.stripePaymentIntentId,
                amount: parseFloat(payment.amount),
                currency: payment.currency,
                status: payment.paymentStatus,
                paymentMethodType: payment.paymentMethodType,
                billingEmail: payment.billingEmail,
                registration: payment.registration ? {
                    id: payment.registration.id,
                    serviceName: payment.registration.service.serviceName,
                    packageName: payment.registration.package.packageName
                } : null,
                inquiry: payment.inquiry ? {
                    id: payment.inquiry.id,
                    type: 'Consultation'
                } : null,
                createdAt: payment.createdAt
            }
        });
    } catch (error) {
        next(error);
    }
});

module.exports = router;
