// Seed script for Bugle Learn database
// EXACT prices as specified - DO NOT MODIFY

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

// ============================================
// SERVICE TYPES (canonical identifiers)
// ============================================
const SERVICE_TYPES = {
    SAT_ACT_COURSE: 'SAT_ACT_COURSE',
    SAT_ACT_DIAGNOSTIC: 'SAT_ACT_DIAGNOSTIC',
    PRACTICE_TEST: 'PRACTICE_TEST',
    ADMISSIONS: 'ADMISSIONS',
    ESSAYS: 'ESSAYS',
    EXECUTIVE_FUNCTION: 'EXECUTIVE_FUNCTION',
    CONSULTATION: 'CONSULTATION'
};

// ============================================
// SERVICES DATA
// ============================================
const servicesData = [
    {
        serviceName: 'SAT/ACT Instruction',
        serviceType: SERVICE_TYPES.SAT_ACT_COURSE,
        description: 'One-on-one personalized SAT/ACT test preparation with expert instructors.',
        displayOrder: 1
    },
    {
        serviceName: 'SAT/ACT Diagnostic Tests',
        serviceType: SERVICE_TYPES.SAT_ACT_DIAGNOSTIC,
        description: 'Comprehensive diagnostic assessments to identify strengths and target areas for improvement.',
        displayOrder: 2
    },
    {
        serviceName: 'SAT/ACT Practice Tests',
        serviceType: SERVICE_TYPES.PRACTICE_TEST,
        description: 'Full-length proctored practice exams with detailed analysis.',
        displayOrder: 3
    },
    {
        serviceName: 'College Admissions Counseling',
        serviceType: SERVICE_TYPES.ADMISSIONS,
        description: 'Expert guidance through every step of the college application process.',
        displayOrder: 4
    },
    {
        serviceName: 'College Essay Support',
        serviceType: SERVICE_TYPES.ESSAYS,
        description: 'Develop compelling essays that showcase your unique voice and experiences.',
        displayOrder: 5
    },
    {
        serviceName: 'Executive Function Coaching',
        serviceType: SERVICE_TYPES.EXECUTIVE_FUNCTION,
        description: 'Build essential skills for academic success: organization, time management, and focus.',
        displayOrder: 6
    },
    {
        serviceName: 'Initial Consultation',
        serviceType: SERVICE_TYPES.CONSULTATION,
        description: 'Meet with our team to discuss your student\'s goals and create a personalized plan.',
        displayOrder: 7
    }
];

// ============================================
// PACKAGES DATA (EXACT PRICES - DO NOT MODIFY)
// ============================================
const packagesData = {
    // SAT/ACT Instruction Packages
    [SERVICE_TYPES.SAT_ACT_COURSE]: [
        {
            packageName: '20 Session Package',
            price: 5900.00,
            description: '20 one-on-one sessions • $295/session • Best value',
            sessionCount: 20,
            displayOrder: 1
        },
        {
            packageName: '15 Session Package',
            price: 4425.00,
            description: '15 one-on-one sessions • $295/session',
            sessionCount: 15,
            displayOrder: 2
        },
        {
            packageName: '10 Session Package',
            price: 2950.00,
            description: '10 one-on-one sessions • $295/session',
            sessionCount: 10,
            displayOrder: 3
        },
        {
            packageName: '5 Session Package',
            price: 1475.00,
            description: '5 one-on-one sessions • $295/session',
            sessionCount: 5,
            displayOrder: 4
        }
    ],

    // SAT/ACT Diagnostic Packages
    [SERVICE_TYPES.SAT_ACT_DIAGNOSTIC]: [
        {
            packageName: 'Diagnostic SAT/ACT - Regular Time',
            price: 250.00,
            description: 'Full diagnostic with standard timing. Requires 2 Saturday dates.',
            sessionCount: null,
            displayOrder: 1
        },
        {
            packageName: 'Diagnostic SAT/ACT - 50% Extended Time',
            price: 250.00,
            description: 'Full diagnostic with 50% extended time. Requires 2 Saturday dates.',
            sessionCount: null,
            displayOrder: 2
        },
        {
            packageName: 'Diagnostic SAT/ACT - 100% Extended Time',
            price: 100.00,
            description: 'Full diagnostic with 100% extended time. Requires 2 Saturday dates.',
            sessionCount: null,
            displayOrder: 3
        }
    ],

    // Practice Test Packages
    [SERVICE_TYPES.PRACTICE_TEST]: [
        {
            packageName: 'Diagnostic SAT/ACT - Regular Time',
            price: 250.00,
            description: 'Requires 2 Saturdays',
            sessionCount: null,
            displayOrder: 1
        },
        {
            packageName: 'Diagnostic SAT/ACT - 50% Extended',
            price: 250.00,
            description: 'Requires 2 Saturdays',
            sessionCount: null,
            displayOrder: 2
        },
        {
            packageName: 'Practice SAT - Regular Time',
            price: 125.00,
            description: 'One Saturday',
            sessionCount: null,
            displayOrder: 3
        },
        {
            packageName: 'Practice SAT - 50% Extended',
            price: 125.00,
            description: 'One Saturday',
            sessionCount: null,
            displayOrder: 4
        },
        {
            packageName: 'Practice ACT - Regular Time',
            price: 125.00,
            description: 'One Saturday',
            sessionCount: null,
            displayOrder: 5
        },
        {
            packageName: 'Practice ACT - 50% Extended',
            price: 125.00,
            description: 'One Saturday',
            sessionCount: null,
            displayOrder: 6
        }
    ],

    // College Admissions Packages
    [SERVICE_TYPES.ADMISSIONS]: [
        {
            packageName: 'College List Creation',
            price: 600.00,
            description: '1-hour consultation + personalized college list',
            sessionCount: 1,
            displayOrder: 1
        },
        {
            packageName: 'Five Session Package',
            price: 2000.00,
            description: '5 comprehensive counseling sessions',
            sessionCount: 5,
            displayOrder: 2
        },
        {
            packageName: 'Ten Session Package',
            price: 4000.00,
            description: '10 comprehensive counseling sessions',
            sessionCount: 10,
            displayOrder: 3
        },
        {
            packageName: 'Strategic One-Hour Consultation',
            price: 500.00,
            description: 'Focused strategic guidance',
            sessionCount: 1,
            displayOrder: 4
        }
    ],

    // College Essay Packages
    [SERVICE_TYPES.ESSAYS]: [
        {
            packageName: 'One Session',
            price: 295.00,
            description: 'Brainstorming and topic selection',
            sessionCount: 1,
            displayOrder: 1
        },
        {
            packageName: 'Two Sessions',
            price: 590.00,
            description: 'Draft evaluation and organization',
            sessionCount: 2,
            displayOrder: 2
        },
        {
            packageName: 'Three Sessions',
            price: 885.00,
            description: 'Complete essay development',
            sessionCount: 3,
            displayOrder: 3
        },
        {
            packageName: 'Four Sessions',
            price: 1180.00,
            description: 'Comprehensive editing and refinement',
            sessionCount: 4,
            displayOrder: 4
        },
        {
            packageName: 'Five Sessions',
            price: 1475.00,
            description: 'Full process to final polish',
            sessionCount: 5,
            displayOrder: 5
        }
    ],

    // Executive Function Packages
    [SERVICE_TYPES.EXECUTIVE_FUNCTION]: [
        {
            packageName: 'Five Sessions Package',
            price: 750.00,
            description: '5 personalized 30-min coaching sessions',
            sessionCount: 5,
            displayOrder: 1
        },
        {
            packageName: 'Individual Session',
            price: 150.00,
            description: 'Single 30-min coaching session',
            sessionCount: 1,
            displayOrder: 2
        }
    ],

    // Consultation Package
    [SERVICE_TYPES.CONSULTATION]: [
        {
            packageName: '45-Minute Consultation',
            price: 199.00,
            description: 'Initial consultation session',
            sessionCount: null,
            displayOrder: 1
        }
    ]
};

// ============================================
// MAIN SEED FUNCTION
// ============================================
async function main() {
    console.log('🌱 Starting Bugle Learn database seed...\n');

    // Clear existing data (in correct order due to foreign keys)
    console.log('🧹 Clearing existing data...');
    await prisma.payment.deleteMany();
    await prisma.registration.deleteMany();
    await prisma.student.deleteMany();
    await prisma.parent.deleteMany();
    await prisma.inquiry.deleteMany();
    await prisma.package.deleteMany();
    await prisma.service.deleteMany();
    await prisma.blockedDate.deleteMany();
    await prisma.coupon.deleteMany();
    await prisma.adminUser.deleteMany();
    console.log('✅ Existing data cleared\n');

    // Create services
    console.log('📦 Creating services...');
    const createdServices = {};

    for (const serviceData of servicesData) {
        const service = await prisma.service.create({
            data: serviceData
        });
        createdServices[service.serviceType] = service;
        console.log(`  ✓ Created service: ${service.serviceName}`);
    }
    console.log(`✅ Created ${Object.keys(createdServices).length} services\n`);

    // Create packages for each service
    console.log('💰 Creating packages with EXACT pricing...');
    let totalPackages = 0;

    for (const [serviceType, packages] of Object.entries(packagesData)) {
        const service = createdServices[serviceType];
        if (!service) {
            console.error(`  ❌ Service not found for type: ${serviceType}`);
            continue;
        }

        console.log(`\n  📋 ${service.serviceName}:`);

        for (const packageData of packages) {
            const pkg = await prisma.package.create({
                data: {
                    serviceId: service.id,
                    ...packageData
                }
            });
            console.log(`    ✓ ${pkg.packageName}: $${pkg.price}`);
            totalPackages++;
        }
    }
    console.log(`\n✅ Created ${totalPackages} packages\n`);

    // Create admin user
    console.log('👤 Creating admin user...');
    const adminPassword = 'BugleAdmin2026!';
    const passwordHash = await bcrypt.hash(adminPassword, 10);

    const adminUser = await prisma.adminUser.create({
        data: {
            email: 'admin@buglelearn.com',
            passwordHash: passwordHash,
            role: 'super_admin',
            isActive: true
        }
    });
    console.log(`✅ Created admin user: ${adminUser.email}`);
    console.log(`   Password: ${adminPassword} (CHANGE IN PRODUCTION!)\n`);

    // Verify pricing
    console.log('🔍 Verifying pricing integrity...');
    const allPackages = await prisma.package.findMany({
        include: { service: true },
        orderBy: [
            { service: { displayOrder: 'asc' } },
            { displayOrder: 'asc' }
        ]
    });

    console.log('\n📊 PRICING SUMMARY:');
    console.log('═══════════════════════════════════════════════════════');

    let currentService = null;
    for (const pkg of allPackages) {
        if (currentService !== pkg.service.serviceName) {
            currentService = pkg.service.serviceName;
            console.log(`\n${currentService.toUpperCase()}`);
            console.log('───────────────────────────────────────────────────────');
        }
        console.log(`  ${pkg.packageName.padEnd(40)} $${Number(pkg.price).toFixed(2).padStart(8)}`);
    }
    console.log('\n═══════════════════════════════════════════════════════');

    console.log('\n✅ Database seed completed successfully!');
}

main()
    .catch((e) => {
        console.error('❌ Seed failed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
