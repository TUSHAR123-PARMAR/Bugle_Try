'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';

export default function ConsultationSchedule() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [success, setSuccess] = useState(false);

    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        preferredDate: '',
        preferredTime: '',
        primaryInterest: '',
        message: '',
    });

    const timeSlots = [
        'Morning: 9:00 AM – 12:00 PM',
        'Afternoon: 12:00 PM – 4:00 PM',
        'Evening: 4:00 PM – 7:00 PM',
    ];

    const interests = [
        'College Application Support',
        'Essay Coaching',
        'SAT/ACT Test Preparation',
        'One-on-One Mentorship',
        'Summer Programs',
        'Other',
    ];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: null }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.fullName.trim()) newErrors.fullName = 'Name is required';
        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Invalid email format';
        }
        if (!formData.phone.trim()) {
            newErrors.phone = 'Phone is required';
        } else if (formData.phone.replace(/\D/g, '').length < 10) {
            newErrors.phone = 'Phone must have at least 10 digits';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        setLoading(true);

        try {
            const response = await fetch('http://localhost:3001/api/inquiries', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    inquiryType: 'consultation',
                }),
            });

            const data = await response.json();

            if (data.success) {
                // Redirect to checkout
                router.push(`/checkout?inquiryId=${data.data.inquiryId}`);
            } else {
                setErrors({ submit: data.error || 'Submission failed' });
            }
        } catch (error) {
            setErrors({ submit: 'Network error. Please try again.' });
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className={styles.formPage}>
                <div className={styles.successContainer}>
                    <div className={styles.successIcon}>✓</div>
                    <h1>Thank You!</h1>
                    <p>
                        Your consultation request has been submitted successfully.
                        We will contact you within 24 hours to schedule your consultation.
                    </p>
                    <button onClick={() => router.push('/')} className={styles.homeBtn}>
                        Return Home
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.formPage}>
            <div className={styles.formContainer}>
                <div className={styles.formHeader}>
                    <span className={styles.badge}>Free Consultation</span>
                    <h1>Schedule Your Consultation</h1>
                    <p>
                        Book a 45-minute consultation to discuss your student&apos;s goals
                        and learn how we can help them succeed.
                    </p>
                </div>

                {errors.submit && (
                    <div className={styles.errorAlert}>{errors.submit}</div>
                )}

                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.formGroup}>
                        <label className={styles.required}>Full Name</label>
                        <input
                            type="text"
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleChange}
                            className={errors.fullName ? styles.inputError : ''}
                        />
                        {errors.fullName && <span className={styles.error}>{errors.fullName}</span>}
                    </div>

                    <div className={styles.formRow}>
                        <div className={styles.formGroup}>
                            <label className={styles.required}>Email</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className={errors.email ? styles.inputError : ''}
                            />
                            {errors.email && <span className={styles.error}>{errors.email}</span>}
                        </div>

                        <div className={styles.formGroup}>
                            <label className={styles.required}>Phone</label>
                            <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                placeholder="(555) 555-5555"
                                className={errors.phone ? styles.inputError : ''}
                            />
                            {errors.phone && <span className={styles.error}>{errors.phone}</span>}
                        </div>
                    </div>

                    <div className={styles.formRow}>
                        <div className={styles.formGroup}>
                            <label>Preferred Date (Optional)</label>
                            <input
                                type="date"
                                name="preferredDate"
                                value={formData.preferredDate}
                                onChange={handleChange}
                                min={new Date().toISOString().split('T')[0]}
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label>Preferred Time (Optional)</label>
                            <select
                                name="preferredTime"
                                value={formData.preferredTime}
                                onChange={handleChange}
                            >
                                <option value="">Select a time slot</option>
                                {timeSlots.map(slot => (
                                    <option key={slot} value={slot}>{slot}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className={styles.formGroup}>
                        <label>Primary Interest (Optional)</label>
                        <select
                            name="primaryInterest"
                            value={formData.primaryInterest}
                            onChange={handleChange}
                        >
                            <option value="">What are you interested in?</option>
                            {interests.map(interest => (
                                <option key={interest} value={interest}>{interest}</option>
                            ))}
                        </select>
                    </div>

                    <div className={styles.formGroup}>
                        <label>Message (Optional)</label>
                        <textarea
                            name="message"
                            value={formData.message}
                            onChange={handleChange}
                            rows={4}
                            placeholder="Tell us about your student's goals and any questions you have..."
                        />
                    </div>

                    <button
                        type="submit"
                        className={styles.submitBtn}
                        disabled={loading}
                    >
                        {loading ? 'Submitting...' : 'Request Consultation'}
                    </button>

                    <p className={styles.disclaimer}>
                        We&apos;ll contact you within 24 hours to confirm your consultation.
                    </p>
                </form>
            </div>
        </div>
    );
}
