// Validation Middleware and Utilities
// Backend-enforced validation rules as specified

// ============================================
// EMAIL VALIDATION
// ============================================
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

function validateEmail(email) {
    if (!email || typeof email !== 'string') {
        return { valid: false, error: 'Email is required' };
    }

    const trimmed = email.trim().toLowerCase();

    if (!EMAIL_REGEX.test(trimmed)) {
        return { valid: false, error: 'Invalid email format' };
    }

    if (trimmed.length > 255) {
        return { valid: false, error: 'Email must be less than 255 characters' };
    }

    return { valid: true, normalized: trimmed };
}

// ============================================
// PHONE VALIDATION
// ============================================
function validatePhone(phone) {
    if (!phone || typeof phone !== 'string') {
        return { valid: false, error: 'Phone number is required' };
    }

    // Extract digits only
    const digits = phone.replace(/\D/g, '');

    if (digits.length < 10 || digits.length > 14) {
        return { valid: false, error: 'Phone must contain 10-14 digits' };
    }

    return { valid: true, normalized: phone.trim() };
}

// ============================================
// NAME VALIDATION
// ============================================
const NAME_REGEX = /^[a-zA-Z\s\-']+$/;

function validateName(name, fieldName = 'Name') {
    if (!name || typeof name !== 'string') {
        return { valid: false, error: `${fieldName} is required` };
    }

    const trimmed = name.trim();

    if (trimmed.length < 2) {
        return { valid: false, error: `${fieldName} must be at least 2 characters` };
    }

    if (trimmed.length > 100) {
        return { valid: false, error: `${fieldName} must be less than 100 characters` };
    }

    if (!NAME_REGEX.test(trimmed)) {
        return { valid: false, error: `${fieldName} can only contain letters, spaces, hyphens, and apostrophes` };
    }

    return { valid: true, normalized: trimmed };
}

// ============================================
// GRADE VALIDATION
// ============================================
const VALID_GRADES = ['9th', '10th', '11th', '12th'];

function validateGrade(grade, required = true) {
    if (!grade) {
        if (required) {
            return { valid: false, error: 'Grade is required' };
        }
        return { valid: true, normalized: null };
    }

    const trimmed = grade.trim();

    if (!VALID_GRADES.includes(trimmed)) {
        return { valid: false, error: `Grade must be one of: ${VALID_GRADES.join(', ')}` };
    }

    return { valid: true, normalized: trimmed };
}

// ============================================
// DATE VALIDATION
// ============================================
function validateFutureDate(dateStr) {
    if (!dateStr) {
        return { valid: false, error: 'Date is required' };
    }

    const date = new Date(dateStr);

    if (isNaN(date.getTime())) {
        return { valid: false, error: 'Invalid date format' };
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (date < today) {
        return { valid: false, error: 'Date must be in the future' };
    }

    return { valid: true, normalized: date };
}

function validateSaturdayDate(dateStr) {
    const futureCheck = validateFutureDate(dateStr);
    if (!futureCheck.valid) {
        return futureCheck;
    }

    const date = futureCheck.normalized;

    if (date.getDay() !== 6) {
        return { valid: false, error: 'Practice tests are only available on Saturdays' };
    }

    return { valid: true, normalized: date };
}

// ============================================
// INQUIRY VALIDATION
// ============================================
const VALID_INQUIRY_TYPES = ['consultation', 'general', 'service_info'];
const VALID_INQUIRY_STATUSES = ['new', 'contacted', 'converted', 'closed'];
const VALID_PREFERRED_TIMES = [
    'Morning: 9:00 AM – 12:00 PM',
    'Afternoon: 12:00 PM – 4:00 PM',
    'Evening: 4:00 PM – 7:00 PM'
];
const VALID_PRIMARY_INTERESTS = [
    'College Application Support',
    'Essay Coaching',
    'SAT/ACT Test Preparation',
    'One-on-One Mentorship',
    'Summer Programs',
    'Other'
];

function validateInquiryType(type) {
    if (!type) {
        return { valid: true, normalized: 'consultation' }; // Default
    }

    if (!VALID_INQUIRY_TYPES.includes(type)) {
        return { valid: false, error: `Inquiry type must be one of: ${VALID_INQUIRY_TYPES.join(', ')}` };
    }

    return { valid: true, normalized: type };
}

function validatePreferredTime(time) {
    if (!time) {
        return { valid: true, normalized: null };
    }

    if (!VALID_PREFERRED_TIMES.includes(time)) {
        return { valid: false, error: `Preferred time must be one of: ${VALID_PREFERRED_TIMES.join(', ')}` };
    }

    return { valid: true, normalized: time };
}

function validatePrimaryInterest(interest) {
    if (!interest) {
        return { valid: true, normalized: null };
    }

    if (!VALID_PRIMARY_INTERESTS.includes(interest)) {
        return { valid: false, error: `Primary interest must be one of: ${VALID_PRIMARY_INTERESTS.join(', ')}` };
    }

    return { valid: true, normalized: interest };
}

// ============================================
// REGISTRATION VALIDATION
// ============================================
const VALID_REGISTRATION_STATUSES = ['pending_payment', 'completed', 'cancelled'];

function validateRegistrationStatus(status) {
    if (!status) {
        return { valid: true, normalized: 'pending_payment' }; // Default
    }

    if (!VALID_REGISTRATION_STATUSES.includes(status)) {
        return { valid: false, error: `Status must be one of: ${VALID_REGISTRATION_STATUSES.join(', ')}` };
    }

    return { valid: true, normalized: status };
}

// ============================================
// PRICE VALIDATION (CRITICAL - TAMPERING PREVENTION)
// ============================================
async function validatePackagePrice(prisma, packageId, submittedPrice) {
    const pkg = await prisma.package.findUnique({
        where: { id: packageId }
    });

    if (!pkg) {
        return { valid: false, error: 'Invalid package' };
    }

    // Convert to numbers for comparison
    const dbPrice = parseFloat(pkg.price);
    const clientPrice = parseFloat(submittedPrice);

    // Strict equality check
    if (Math.abs(dbPrice - clientPrice) > 0.01) {
        console.error(`PRICE TAMPERING DETECTED! Package: ${packageId}, DB: ${dbPrice}, Submitted: ${clientPrice}`);
        return {
            valid: false,
            error: 'Price tampering detected - submitted price does not match database',
            isTampering: true
        };
    }

    if (!pkg.isActive) {
        return { valid: false, error: 'This package is no longer available' };
    }

    return { valid: true, package: pkg, price: dbPrice };
}

// ============================================
// BLOCKED DATE VALIDATION
// ============================================
async function validateNotBlockedDate(prisma, dateStr) {
    const date = new Date(dateStr);

    // Format date as YYYY-MM-DD for comparison
    const dateOnly = date.toISOString().split('T')[0];

    const blocked = await prisma.blockedDate.findFirst({
        where: {
            blockedDate: new Date(dateOnly),
            isActive: true
        }
    });

    if (blocked) {
        return {
            valid: false,
            error: `This date is not available. ${blocked.reason ? 'Reason: ' + blocked.reason : 'Administrative closure.'}`
        };
    }

    return { valid: true };
}

// ============================================
// MIDDLEWARE FUNCTIONS
// ============================================

// Validate parent data middleware
function validateParentData(req, res, next) {
    const errors = [];

    const emailCheck = validateEmail(req.body.parentEmail || req.body.email);
    if (!emailCheck.valid) errors.push(emailCheck.error);
    else req.body.parentEmail = emailCheck.normalized;

    const phoneCheck = validatePhone(req.body.parentPhone || req.body.phone);
    if (!phoneCheck.valid) errors.push(phoneCheck.error);
    else req.body.parentPhone = phoneCheck.normalized;

    const firstNameCheck = validateName(req.body.parentFirstName || req.body.firstName, 'First name');
    if (!firstNameCheck.valid) errors.push(firstNameCheck.error);
    else req.body.parentFirstName = firstNameCheck.normalized;

    const lastNameCheck = validateName(req.body.parentLastName || req.body.lastName, 'Last name');
    if (!lastNameCheck.valid) errors.push(lastNameCheck.error);
    else req.body.parentLastName = lastNameCheck.normalized;

    if (errors.length > 0) {
        return res.status(400).json({
            error: 'Validation Error',
            message: 'Invalid parent data',
            details: errors
        });
    }

    next();
}

// Validate student data middleware
function validateStudentData(req, res, next) {
    const errors = [];

    const emailCheck = validateEmail(req.body.studentEmail);
    if (!emailCheck.valid) errors.push(`Student email: ${emailCheck.error}`);
    else req.body.studentEmail = emailCheck.normalized;

    const firstNameCheck = validateName(req.body.studentFirstName, 'Student first name');
    if (!firstNameCheck.valid) errors.push(firstNameCheck.error);
    else req.body.studentFirstName = firstNameCheck.normalized;

    const lastNameCheck = validateName(req.body.studentLastName, 'Student last name');
    if (!lastNameCheck.valid) errors.push(lastNameCheck.error);
    else req.body.studentLastName = lastNameCheck.normalized;

    if (!req.body.studentSchool || req.body.studentSchool.trim().length < 2) {
        errors.push('School name must be at least 2 characters');
    } else if (req.body.studentSchool.length > 200) {
        errors.push('School name must be less than 200 characters');
    }

    // Grade is required for most services but not consultations
    const gradeRequired = req.body.serviceType !== 'CONSULTATION';
    const gradeCheck = validateGrade(req.body.studentGrade, gradeRequired);
    if (!gradeCheck.valid) errors.push(gradeCheck.error);
    else req.body.studentGrade = gradeCheck.normalized;

    if (errors.length > 0) {
        return res.status(400).json({
            error: 'Validation Error',
            message: 'Invalid student data',
            details: errors
        });
    }

    next();
}

// Validate inquiry data middleware
function validateInquiryData(req, res, next) {
    const errors = [];

    // Full name
    if (!req.body.fullName || req.body.fullName.trim().length < 2) {
        errors.push('Full name must be at least 2 characters');
    } else if (req.body.fullName.length > 200) {
        errors.push('Full name must be less than 200 characters');
    }

    const emailCheck = validateEmail(req.body.email);
    if (!emailCheck.valid) errors.push(emailCheck.error);
    else req.body.email = emailCheck.normalized;

    const phoneCheck = validatePhone(req.body.phone);
    if (!phoneCheck.valid) errors.push(phoneCheck.error);
    else req.body.phone = phoneCheck.normalized;

    const typeCheck = validateInquiryType(req.body.inquiryType);
    if (!typeCheck.valid) errors.push(typeCheck.error);
    else req.body.inquiryType = typeCheck.normalized;

    if (req.body.preferredDate) {
        const dateCheck = validateFutureDate(req.body.preferredDate);
        if (!dateCheck.valid) errors.push(`Preferred date: ${dateCheck.error}`);
    }

    const timeCheck = validatePreferredTime(req.body.preferredTime);
    if (!timeCheck.valid) errors.push(timeCheck.error);
    else req.body.preferredTime = timeCheck.normalized;

    const interestCheck = validatePrimaryInterest(req.body.primaryInterest);
    if (!interestCheck.valid) errors.push(interestCheck.error);
    else req.body.primaryInterest = interestCheck.normalized;

    if (req.body.message && req.body.message.length > 2000) {
        errors.push('Message must be less than 2000 characters');
    }

    if (errors.length > 0) {
        return res.status(400).json({
            error: 'Validation Error',
            message: 'Invalid inquiry data',
            details: errors
        });
    }

    next();
}

// ============================================
// EXPORTS
// ============================================
module.exports = {
    // Validation functions
    validateEmail,
    validatePhone,
    validateName,
    validateGrade,
    validateFutureDate,
    validateSaturdayDate,
    validateInquiryType,
    validatePreferredTime,
    validatePrimaryInterest,
    validateRegistrationStatus,
    validatePackagePrice,
    validateNotBlockedDate,

    // Constants
    VALID_GRADES,
    VALID_INQUIRY_TYPES,
    VALID_INQUIRY_STATUSES,
    VALID_PREFERRED_TIMES,
    VALID_PRIMARY_INTERESTS,
    VALID_REGISTRATION_STATUSES,

    // Middleware
    validateParentData,
    validateStudentData,
    validateInquiryData
};
