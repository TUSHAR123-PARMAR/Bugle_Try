'use client';

import { useState } from 'react';
import styles from './page.module.css';

export default function Contact() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
    });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        // Simulate form submission
        await new Promise(resolve => setTimeout(resolve, 1000));
        setSuccess(true);
        setLoading(false);
    };

    if (success) {
        return (
            <div className={styles.page}>
                <div className={styles.successBox}>
                    <div className={styles.successIcon}>✓</div>
                    <h2>Message Sent!</h2>
                    <p>Thank you for contacting us. We&apos;ll get back to you within 24 hours.</p>
                    <button onClick={() => setSuccess(false)} className={styles.resetBtn}>
                        Send Another Message
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.page}>
            <div className={styles.container}>
                <div className={styles.header}>
                    <span className={styles.badge}>Get in Touch</span>
                    <h1>Contact Us</h1>
                    <p>
                        Have questions? We&apos;d love to hear from you. Reach out and we&apos;ll
                        respond within 24 hours.
                    </p>
                </div>

                <div className={styles.content}>
                    <div className={styles.contactInfo}>
                        <div className={styles.infoCard}>
                            <div className={styles.infoIcon}>📞</div>
                            <h3>Phone</h3>
                            <p className={styles.infoValue}>914.462.7797</p>
                            <p className={styles.infoDesc}>Mon-Fri 9am-7pm EST</p>
                        </div>

                        <div className={styles.infoCard}>
                            <div className={styles.infoIcon}>✉️</div>
                            <h3>Email</h3>
                            <p className={styles.infoValue}>info@buglelearn.com</p>
                            <p className={styles.infoDesc}>We respond within 24 hours</p>
                        </div>

                        <div className={styles.infoCard}>
                            <div className={styles.infoIcon}>📍</div>
                            <h3>Service Area</h3>
                            <p className={styles.infoValue}>Westchester County, NY</p>
                            <p className={styles.infoDesc}>Online sessions available nationwide</p>
                        </div>
                    </div>

                    <div className={styles.formSection}>
                        <h2>Send Us a Message</h2>

                        {error && <div className={styles.errorAlert}>{error}</div>}

                        <form onSubmit={handleSubmit} className={styles.form}>
                            <div className={styles.formGroup}>
                                <label>Full Name *</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className={styles.formRow}>
                                <div className={styles.formGroup}>
                                    <label>Email *</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div className={styles.formGroup}>
                                    <label>Phone</label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        placeholder="(555) 555-5555"
                                    />
                                </div>
                            </div>

                            <div className={styles.formGroup}>
                                <label>Subject *</label>
                                <select
                                    name="subject"
                                    value={formData.subject}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">Select a subject</option>
                                    <option value="General Inquiry">General Inquiry</option>
                                    <option value="SAT/ACT Preparation">SAT/ACT Preparation</option>
                                    <option value="College Admissions">College Admissions</option>
                                    <option value="Essay Support">Essay Support</option>
                                    <option value="Executive Coaching">Executive Coaching</option>
                                    <option value="Scheduling">Scheduling</option>
                                    <option value="Billing">Billing</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>

                            <div className={styles.formGroup}>
                                <label>Message *</label>
                                <textarea
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    rows={5}
                                    required
                                    placeholder="How can we help you?"
                                />
                            </div>

                            <button type="submit" className={styles.submitBtn} disabled={loading}>
                                {loading ? 'Sending...' : 'Send Message'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
