// Registration Routes
// API endpoints for service registrations

const express = require('express');
const { PrismaClient } = require('@prisma/client');
const {
    validateParentData,
    validateStudentData,
    validatePackagePrice,
    validateSaturdayDate,
    validateNotBlockedDate
} = require('../middleware/validation');

const router = express.Router();
const prisma = new PrismaClient();

// ============================================
// HELPER: Find or create parent
// ============================================
async function findOrCreateParent(parentData) {
    const email = parentData.email.toLowerCase();

    let parent = await prisma.parent.findUnique({
        where: { email }
    });

    if (parent) {
        // Update existing parent with new info
        parent = await prisma.parent.update({
            where: { email },
            data: {
                firstName: parentData.firstName,
                lastName: parentData.lastName,
                phone: parentData.phone
            }
        });
    } else {
        // Create new parent
        parent = await prisma.parent.create({
            data: {
                firstName: parentData.firstName,
                lastName: parentData.lastName,
                email,
                phone: parentData.phone
            }
        });
    }

    return parent;
}

// ============================================
// HELPER: Find or create student
// ============================================
async function findOrCreateStudent(parentId, studentData) {
    const email = studentData.email.toLowerCase();

    // Check for existing student with same parent + name + email
    let student = await prisma.student.findFirst({
        where: {
            parentId,
            firstName: studentData.firstName,
            lastName: studentData.lastName,
            email
        }
    });

    if (student) {
        // Update existing student
        student = await prisma.student.update({
            where: { id: student.id },
            data: {
                school: studentData.school,
                grade: studentData.grade
            }
        });
    } else {
        // Create new student
        student = await prisma.student.create({
            data: {
                parentId,
                firstName: studentData.firstName,
                lastName: studentData.lastName,
                email,
                school: studentData.school,
                grade: studentData.grade
            }
        });
    }

    return student;
}

// ============================================
// POST /api/registrations
// Create a new service registration
// ============================================
router.post('/', validateParentData, validateStudentData, async (req, res, next) => {
    try {
        const {
            // Parent data
            parentFirstName,
            parentLastName,
            parentEmail,
            parentPhone,

            // Student data
            studentFirstName,
            studentLastName,
            studentEmail,
            studentSchool,
            studentGrade,

            // Service data
            serviceType,
            packageId,
            packagePrice,

            // Additional data
            serviceSpecificData,
            parentNotes
        } = req.body;

        // Validate service exists
        const service = await prisma.service.findUnique({
            where: { serviceType }
        });

        if (!service) {
            return res.status(400).json({
                success: false,
                error: 'Invalid service type'
            });
        }

        // Validate package and price (CRITICAL - tampering prevention)
        const priceValidation = await validatePackagePrice(prisma, packageId, packagePrice);
        if (!priceValidation.valid) {
            const status = priceValidation.isTampering ? 403 : 400;
            return res.status(status).json({
                success: false,
                error: priceValidation.error
            });
        }

        // Verify package belongs to service
        if (priceValidation.package.serviceId !== service.id) {
            return res.status(400).json({
                success: false,
                error: 'Package does not belong to selected service'
            });
        }

        // Validate practice test dates if applicable
        if (serviceType === 'PRACTICE_TEST' || serviceType === 'SAT_ACT_DIAGNOSTIC') {
            const testData = serviceSpecificData?.selected_tests || [];

            for (const test of testData) {
                // Validate each date is a Saturday
                if (test.test_date) {
                    const satCheck = validateSaturdayDate(test.test_date);
                    if (!satCheck.valid) {
                        return res.status(400).json({
                            success: false,
                            error: satCheck.error
                        });
                    }

                    // Check if date is blocked
                    const blockedCheck = await validateNotBlockedDate(prisma, test.test_date);
                    if (!blockedCheck.valid) {
                        return res.status(400).json({
                            success: false,
                            error: blockedCheck.error
                        });
                    }
                }

                // For diagnostics, validate both SAT and ACT dates
                if (test.sat_date) {
                    const satCheck = validateSaturdayDate(test.sat_date);
                    if (!satCheck.valid) {
                        return res.status(400).json({
                            success: false,
                            error: `SAT date: ${satCheck.error}`
                        });
                    }
                    const blockedCheck = await validateNotBlockedDate(prisma, test.sat_date);
                    if (!blockedCheck.valid) {
                        return res.status(400).json({
                            success: false,
                            error: `SAT date: ${blockedCheck.error}`
                        });
                    }
                }

                if (test.act_date) {
                    const actCheck = validateSaturdayDate(test.act_date);
                    if (!actCheck.valid) {
                        return res.status(400).json({
                            success: false,
                            error: `ACT date: ${actCheck.error}`
                        });
                    }
                    const blockedCheck = await validateNotBlockedDate(prisma, test.act_date);
                    if (!blockedCheck.valid) {
                        return res.status(400).json({
                            success: false,
                            error: `ACT date: ${blockedCheck.error}`
                        });
                    }
                }
            }
        }

        // Create/update parent
        const parent = await findOrCreateParent({
            firstName: parentFirstName,
            lastName: parentLastName,
            email: parentEmail,
            phone: parentPhone
        });

        // Create/update student
        const student = await findOrCreateStudent(parent.id, {
            firstName: studentFirstName,
            lastName: studentLastName,
            email: studentEmail,
            school: studentSchool,
            grade: studentGrade
        });

        // Create registration
        const registration = await prisma.registration.create({
            data: {
                parentId: parent.id,
                studentId: student.id,
                serviceId: service.id,
                packageId: packageId,
                packagePrice: priceValidation.price,
                serviceSpecificData: serviceSpecificData || null,
                parentNotes: parentNotes ? parentNotes.substring(0, 2000) : null,
                registrationStatus: 'pending_payment'
            },
            include: {
                service: true,
                package: true
            }
        });

        console.log(`✅ New registration created: ${registration.id} for ${service.serviceName}`);

        res.status(201).json({
            success: true,
            message: 'Registration created successfully',
            data: {
                registrationId: registration.id,
                confirmationNumber: `REG-${registration.id.substring(0, 8).toUpperCase()}`,
                serviceName: registration.service.serviceName,
                packageName: registration.package.packageName,
                price: parseFloat(registration.packagePrice),
                status: registration.registrationStatus
            }
        });
    } catch (error) {
        next(error);
    }
});

// ============================================
// GET /api/registrations/:id
// Get registration details (for payment flow)
// ============================================
router.get('/:id', async (req, res, next) => {
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
                    orderBy: { createdAt: 'desc' },
                    take: 1
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
            data: {
                id: registration.id,
                confirmationNumber: `REG-${registration.id.substring(0, 8).toUpperCase()}`,
                parent: {
                    firstName: registration.parent.firstName,
                    lastName: registration.parent.lastName,
                    email: registration.parent.email,
                    phone: registration.parent.phone
                },
                student: {
                    firstName: registration.student.firstName,
                    lastName: registration.student.lastName,
                    email: registration.student.email,
                    school: registration.student.school,
                    grade: registration.student.grade
                },
                service: {
                    id: registration.service.id,
                    name: registration.service.serviceName,
                    type: registration.service.serviceType
                },
                package: {
                    id: registration.package.id,
                    name: registration.package.packageName,
                    description: registration.package.description,
                    sessionCount: registration.package.sessionCount
                },
                price: parseFloat(registration.packagePrice),
                serviceSpecificData: registration.serviceSpecificData,
                parentNotes: registration.parentNotes,
                status: registration.registrationStatus,
                paymentStatus: registration.payments[0]?.paymentStatus || null,
                createdAt: registration.createdAt
            }
        });
    } catch (error) {
        next(error);
    }
});

module.exports = router;
