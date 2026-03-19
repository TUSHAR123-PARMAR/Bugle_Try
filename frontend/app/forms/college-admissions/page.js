'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';

export default function CollegeAdmissionsForm() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [packages, setPackages] = useState([]);
    const [loadingPackages, setLoadingPackages] = useState(true);
    const [errors, setErrors] = useState({});

    // Fetch packages on mount
    useEffect(() => {
        fetch('http://localhost:4000/api/services/ADMISSIONS')
            .then(res => res.json())
            .then(data => {
                if (data.success && data.data?.packages) {
                    setPackages(data.data.packages);
                }
                setLoadingPackages(false);
            })
            .catch(err => {
                console.error('Failed to load packages', err);
                setLoadingPackages(false);
            });
    }, []);

    const [formData, setFormData] = useState({
        parentFirstName: '',
        parentLastName: '',
        parentEmail: '',
        parentPhone: '',
        studentFirstName: '',
        studentLastName: '',
        studentEmail: '',
        studentSchool: '',
        studentGrade: '',
        packageId: '',
        parentNotes: '',
    });

    const selectedPackage = packages.find(p => p.id === formData.packageId);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: null }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.parentFirstName.trim()) newErrors.parentFirstName = 'First name is required';
        if (!formData.parentLastName.trim()) newErrors.parentLastName = 'Last name is required';
        if (!formData.parentEmail.trim()) {
            newErrors.parentEmail = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.parentEmail)) {
            newErrors.parentEmail = 'Invalid email format';
        }
        if (!formData.parentPhone.trim()) {
            newErrors.parentPhone = 'Phone is required';
        }

        if (!formData.studentFirstName.trim()) newErrors.studentFirstName = 'First name is required';
        if (!formData.studentLastName.trim()) newErrors.studentLastName = 'Last name is required';
        if (!formData.studentEmail.trim()) {
            newErrors.studentEmail = 'Email is required';
        }
        if (!formData.studentGrade) newErrors.studentGrade = 'Grade is required';

        if (!formData.packageId) newErrors.packageId = 'Please select a package';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        setLoading(true);

        try {
            const response = await fetch('http://localhost:4000/api/registrations', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    serviceType: 'ADMISSIONS',
                    packagePrice: selectedPackage.price,
                }),
            });

            const data = await response.json();

            if (data.success) {
                router.push(`/checkout?registrationId=${data.data.registrationId}`);
            } else {
                setErrors({ submit: data.error || 'Registration failed' });
            }
        } catch (error) {
            setErrors({ submit: 'Network error. Please try again.' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.page}>
            <div className={styles.formContainer}>
                <div className={styles.formHeader}>
                    <span className={styles.badge}>College Admissions</span>
                    <h1>College Counseling Registration</h1>
                    <p>Expert guidance for your college application journey.</p>
                </div>

                {errors.submit && (
                    <div className={styles.errorAlert}>
                        {errors.submit}
                    </div>
                )}

                <form onSubmit={handleSubmit} className={styles.form}>
                    {/* Parent Info */}
                    <div className={styles.formSection}>
                        <h2>Parent/Guardian Information</h2>
                        <div className={styles.formRow}>
                            <div className={styles.formGroup}>
                                <label className={styles.required}>First Name</label>
                                <input
                                    type="text"
                                    name="parentFirstName"
                                    value={formData.parentFirstName}
                                    onChange={handleChange}
                                    className={errors.parentFirstName ? styles.inputError : ''}
                                />
                                {errors.parentFirstName && <span className={styles.error}>{errors.parentFirstName}</span>}
                            </div>
                            <div className={styles.formGroup}>
                                <label className={styles.required}>Last Name</label>
                                <input
                                    type="text"
                                    name="parentLastName"
                                    value={formData.parentLastName}
                                    onChange={handleChange}
                                    className={errors.parentLastName ? styles.inputError : ''}
                                />
                                {errors.parentLastName && <span className={styles.error}>{errors.parentLastName}</span>}
                            </div>
                        </div>
                        <div className={styles.formRow}>
                            <div className={styles.formGroup}>
                                <label className={styles.required}>Email</label>
                                <input
                                    type="email"
                                    name="parentEmail"
                                    value={formData.parentEmail}
                                    onChange={handleChange}
                                    className={errors.parentEmail ? styles.inputError : ''}
                                />
                                {errors.parentEmail && <span className={styles.error}>{errors.parentEmail}</span>}
                            </div>
                            <div className={styles.formGroup}>
                                <label className={styles.required}>Phone</label>
                                <input
                                    type="tel"
                                    name="parentPhone"
                                    value={formData.parentPhone}
                                    onChange={handleChange}
                                    className={errors.parentPhone ? styles.inputError : ''}
                                />
                                {errors.parentPhone && <span className={styles.error}>{errors.parentPhone}</span>}
                            </div>
                        </div>
                    </div>

                    {/* Student Info */}
                    <div className={styles.formSection}>
                        <h2>Student Information</h2>
                        <div className={styles.formRow}>
                            <div className={styles.formGroup}>
                                <label className={styles.required}>First Name</label>
                                <input
                                    type="text"
                                    name="studentFirstName"
                                    value={formData.studentFirstName}
                                    onChange={handleChange}
                                    className={errors.studentFirstName ? styles.inputError : ''}
                                />
                                {errors.studentFirstName && <span className={styles.error}>{errors.studentFirstName}</span>}
                            </div>
                            <div className={styles.formGroup}>
                                <label className={styles.required}>Last Name</label>
                                <input
                                    type="text"
                                    name="studentLastName"
                                    value={formData.studentLastName}
                                    onChange={handleChange}
                                    className={errors.studentLastName ? styles.inputError : ''}
                                />
                                {errors.studentLastName && <span className={styles.error}>{errors.studentLastName}</span>}
                            </div>
                        </div>
                        <div className={styles.formRow}>
                            <div className={styles.formGroup}>
                                <label className={styles.required}>Student Email</label>
                                <input
                                    type="email"
                                    name="studentEmail"
                                    value={formData.studentEmail}
                                    onChange={handleChange}
                                    className={errors.studentEmail ? styles.inputError : ''}
                                />
                                {errors.studentEmail && <span className={styles.error}>{errors.studentEmail}</span>}
                            </div>
                            <div className={styles.formGroup}>
                                <label className={styles.required}>Grade</label>
                                <select
                                    name="studentGrade"
                                    value={formData.studentGrade}
                                    onChange={handleChange}
                                    className={errors.studentGrade ? styles.inputError : ''}
                                >
                                    <option value="">Select Grade</option>
                                    <option value="9th">9th Grade</option>
                                    <option value="10th">10th Grade</option>
                                    <option value="11th">11th Grade</option>
                                    <option value="12th">12th Grade</option>
                                </select>
                                {errors.studentGrade && <span className={styles.error}>{errors.studentGrade}</span>}
                            </div>
                        </div>
                        <div className={styles.formGroup}>
                            <label>School (Optional)</label>
                            <input
                                type="text"
                                name="studentSchool"
                                value={formData.studentSchool}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    {/* Package Selection */}
                    <div className={styles.formSection}>
                        <h2>Select Package</h2>
                        {loadingPackages ? (
                            <p>Loading packages...</p>
                        ) : (
                            <div className={styles.packageGrid}>
                                {packages.map((pkg) => (
                                    <label
                                        key={pkg.id}
                                        className={`${styles.packageCard} ${formData.packageId === pkg.id ? styles.selected : ''}`}
                                    >
                                        <input
                                            type="radio"
                                            name="packageId"
                                            value={pkg.id}
                                            checked={formData.packageId === pkg.id}
                                            onChange={handleChange}
                                        />
                                        <div className={styles.packageContent}>
                                            <h3>{pkg.packageName}</h3>
                                            <div className={styles.packagePrice}>${Number(pkg.price).toLocaleString()}</div>
                                            <p>{pkg.description}</p>
                                        </div>
                                    </label>
                                ))}
                            </div>
                        )}
                        {errors.packageId && <span className={styles.error}>{errors.packageId}</span>}
                    </div>

                    {/* Notes */}
                    <div className={styles.formSection}>
                        <h2>Additional Notes</h2>
                        <div className={styles.formGroup}>
                            <textarea
                                name="parentNotes"
                                value={formData.parentNotes}
                                onChange={handleChange}
                                rows={3}
                                placeholder="Any specific goals or questions..."
                            />
                        </div>
                    </div>

                    <button type="submit" className={styles.submitBtn} disabled={loading}>
                        {loading ? 'Processing...' : 'Proceed to Payment'}
                    </button>

                    <p className={styles.disclaimer}>
                        Payments are processed securely via Stripe.
                    </p>
                </form>
            </div>
        </div>
    );
}
