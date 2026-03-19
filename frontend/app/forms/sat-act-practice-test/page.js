'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';

export default function PracticeTestForm() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [packages, setPackages] = useState([]);
    const [dates, setDates] = useState([]);
    const [loadingData, setLoadingData] = useState(true);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [pkgRes, dateRes] = await Promise.all([
                    fetch('http://localhost:4000/api/services/PRACTICE_TEST'),
                    fetch('http://localhost:4000/api/services/practice-tests/available-saturdays')
                ]);

                const pkgData = await pkgRes.json();
                const dateData = await dateRes.json();

                if (pkgData.success && pkgData.data?.packages) {
                    setPackages(pkgData.data.packages);
                }
                if (dateData.success && dateData.data) {
                    setDates(dateData.data);
                }
            } catch (err) {
                console.error('Failed to load data', err);
            } finally {
                setLoadingData(false);
            }
        };
        fetchData();
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
        testDate: '',
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
        if (!formData.parentFirstName.trim()) newErrors.parentFirstName = 'Required';
        if (!formData.parentLastName.trim()) newErrors.parentLastName = 'Required';
        if (!formData.parentEmail.trim()) newErrors.parentEmail = 'Required';
        if (!formData.parentPhone.trim()) newErrors.parentPhone = 'Required';
        if (!formData.studentFirstName.trim()) newErrors.studentFirstName = 'Required';
        if (!formData.studentLastName.trim()) newErrors.studentLastName = 'Required';
        if (!formData.packageId) newErrors.packageId = 'Please select a package';
        if (!formData.testDate) newErrors.testDate = 'Required';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setLoading(true);

        // Check if package implies multiple dates (e.g. Diagnostic in practice test list??)
        // If the package says "Diagnostic", we might need 2 dates, but for now we follow simple "testDate".
        // If the user picked a "Diagnostic" package here, they might face an error if backend requires 2 dates.
        // But validation logic depends on what we send.
        // If we only send 'test_date', it's treated as a single test.
        // Let's assume Practice Tests are single date.

        try {
            const response = await fetch('http://localhost:4000/api/registrations', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    serviceType: 'PRACTICE_TEST',
                    packagePrice: selectedPackage.price,
                    serviceSpecificData: {
                        selected_tests: [{
                            test_date: formData.testDate
                        }]
                    }
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
                    <span className={styles.badge}>Practice Tests</span>
                    <h1>Practice Test Registration</h1>
                    <p>Sign up for upcoming practice SAT or ACT exams.</p>
                </div>

                {errors.submit && <div className={styles.errorAlert}>{errors.submit}</div>}

                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.formSection}>
                        <h2>Contact Information</h2>
                        <div className={styles.formRow}>
                            <div className={styles.formGroup}>
                                <label className={styles.required}>Parent Name</label>
                                <input name="parentFirstName" placeholder="First" value={formData.parentFirstName} onChange={handleChange} />
                                <input name="parentLastName" placeholder="Last" value={formData.parentLastName} onChange={handleChange} style={{ marginTop: '8px' }} />
                            </div>
                            <div className={styles.formGroup}>
                                <label className={styles.required}>Student Name</label>
                                <input name="studentFirstName" placeholder="First" value={formData.studentFirstName} onChange={handleChange} />
                                <input name="studentLastName" placeholder="Last" value={formData.studentLastName} onChange={handleChange} style={{ marginTop: '8px' }} />
                            </div>
                        </div>
                        <div className={styles.formRow}>
                            <div className={styles.formGroup}>
                                <label className={styles.required}>Email</label>
                                <input name="parentEmail" type="email" value={formData.parentEmail} onChange={handleChange} />
                            </div>
                            <div className={styles.formGroup}>
                                <label className={styles.required}>Phone</label>
                                <input name="parentPhone" type="tel" value={formData.parentPhone} onChange={handleChange} />
                            </div>
                        </div>
                    </div>

                    <div className={styles.formSection}>
                        <h2>Select Package</h2>
                        {loadingData ? <p>Loading options...</p> : (
                            <div className={styles.packageGrid}>
                                {packages.map((pkg) => (
                                    <label key={pkg.id} className={`${styles.packageCard} ${formData.packageId === pkg.id ? styles.selected : ''}`}>
                                        <input type="radio" name="packageId" value={pkg.id} checked={formData.packageId === pkg.id} onChange={handleChange} />
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

                    <div className={styles.formSection}>
                        <h2>Select Test Date</h2>
                        <div className={styles.formGroup}>
                            <label className={styles.required}>Test Date (Saturday)</label>
                            <select name="testDate" value={formData.testDate} onChange={handleChange} className={errors.testDate ? styles.inputError : ''}>
                                <option value="">Select Date</option>
                                {dates.map(date => (
                                    <option key={date} value={date}>{new Date(date).toLocaleDateString()}</option>
                                ))}
                            </select>
                            {errors.testDate && <span className={styles.error}>{errors.testDate}</span>}
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
