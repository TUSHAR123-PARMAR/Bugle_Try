'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';

export default function CollegeEssaysForm() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [packages, setPackages] = useState([]);
    const [loadingPackages, setLoadingPackages] = useState(true);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        fetch('http://localhost:4000/api/services/ESSAYS')
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
        if (!formData.parentFirstName.trim()) newErrors.parentFirstName = 'Required';
        if (!formData.parentLastName.trim()) newErrors.parentLastName = 'Required';
        if (!formData.parentEmail.trim()) newErrors.parentEmail = 'Required';
        if (!formData.parentPhone.trim()) newErrors.parentPhone = 'Required';
        if (!formData.studentFirstName.trim()) newErrors.studentFirstName = 'Required';
        if (!formData.studentLastName.trim()) newErrors.studentLastName = 'Required';
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
                    serviceType: 'ESSAYS',
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
                    <span className={styles.badge}>College Essays</span>
                    <h1>College Essay Support</h1>
                    <p>Register for expert essay coaching sessions.</p>
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
                        <div className={styles.formRow}>
                            <div className={styles.formGroup}>
                                <label>Student Email (Optional)</label>
                                <input name="studentEmail" type="email" value={formData.studentEmail} onChange={handleChange} />
                            </div>
                            <div className={styles.formGroup}>
                                <label>Student Grade</label>
                                <select name="studentGrade" value={formData.studentGrade} onChange={handleChange}>
                                    <option value="">Select Grade</option>
                                    <option value="11th">11th Grade</option>
                                    <option value="12th">12th Grade</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className={styles.formSection}>
                        <h2>Select Package</h2>
                        {loadingPackages ? <p>Loading options...</p> : (
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
                        <h2>Detailed Notes</h2>
                        <textarea name="parentNotes" value={formData.parentNotes} onChange={handleChange} rows={3} placeholder="Tell us which essays you need help with..." />
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
