import Link from 'next/link';
import styles from './page.module.css';

export const metadata = {
    title: 'SAT/ACT Preparation - Bugle Learn',
    description: 'Expert one-on-one SAT and ACT test preparation. Personalized instruction, diagnostic testing, and practice exams to maximize your score.',
};

export default function SatActPreparation() {
    const packages = [
        { sessions: 20, price: 5900, perSession: 295, label: 'Best Value' },
        { sessions: 15, price: 4425, perSession: 295, label: null },
        { sessions: 10, price: 2950, perSession: 295, label: null },
        { sessions: 5, price: 1475, perSession: 295, label: null },
    ];

    return (
        <>
            {/* Hero Section */}
            <section className={styles.hero}>
                <div className={styles.heroContent}>
                    <span className={styles.badge}>SAT/ACT Preparation</span>
                    <h1>Master Your SAT & ACT with Expert Instruction</h1>
                    <p>
                        Our personalized one-on-one sessions are designed to maximize your score potential.
                        With 15+ years of experience and 150+ average point improvement, we help students
                        achieve their target scores and gain admission to their dream schools.
                    </p>
                    <div className={styles.heroCtas}>
                        <Link href="/forms/sat-act-course" className={styles.btnPrimary}>
                            Start Your Test Prep →
                        </Link>
                        <Link href="/consultation/schedule" className={styles.btnSecondary}>
                            Free Consultation
                        </Link>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className={styles.features}>
                <div className={styles.sectionHeader}>
                    <h2>What Makes Our Program Different</h2>
                    <p>A comprehensive approach to test preparation that delivers results.</p>
                </div>

                <div className={styles.featuresGrid}>
                    <div className={styles.featureCard}>
                        <div className={styles.featureIcon}>👤</div>
                        <h3>One-on-One Instruction</h3>
                        <p>
                            Every session is personalized to your student's learning style,
                            strengths, and areas for improvement.
                        </p>
                    </div>

                    <div className={styles.featureCard}>
                        <div className={styles.featureIcon}>📊</div>
                        <h3>Diagnostic Assessment</h3>
                        <p>
                            We start with a comprehensive diagnostic to identify exactly
                            where to focus our efforts for maximum score improvement.
                        </p>
                    </div>

                    <div className={styles.featureCard}>
                        <div className={styles.featureIcon}>📈</div>
                        <h3>Progress Tracking</h3>
                        <p>
                            Regular practice tests and performance analysis to measure
                            improvement and adjust strategies as needed.
                        </p>
                    </div>

                    <div className={styles.featureCard}>
                        <div className={styles.featureIcon}>🎯</div>
                        <h3>Test-Taking Strategies</h3>
                        <p>
                            Learn proven techniques for time management, question approach,
                            and maximizing your score on test day.
                        </p>
                    </div>
                </div>
            </section>

            {/* Pricing Section */}
            <section className={styles.pricing}>
                <div className={styles.sectionHeader}>
                    <h2>SAT/ACT Instruction Packages</h2>
                    <p>Choose the package that fits your needs. All packages include personalized one-on-one sessions.</p>
                </div>

                <div className={styles.pricingGrid}>
                    {packages.map((pkg) => (
                        <div key={pkg.sessions} className={`${styles.priceCard} ${pkg.label ? styles.featured : ''}`}>
                            {pkg.label && <span className={styles.priceLabel}>{pkg.label}</span>}
                            <h3>{pkg.sessions} Session Package</h3>
                            <div className={styles.priceAmount}>
                                <span className={styles.currency}>$</span>
                                <span className={styles.price}>{pkg.price.toLocaleString()}</span>
                            </div>
                            <p className={styles.perSession}>${pkg.perSession}/session</p>
                            <ul className={styles.priceFeatures}>
                                <li>✓ {pkg.sessions} one-on-one sessions</li>
                                <li>✓ Personalized study plan</li>
                                <li>✓ Practice materials included</li>
                                <li>✓ Progress tracking</li>
                            </ul>
                            <Link href="/forms/sat-act-course" className={styles.btnPrice}>
                                Select Package
                            </Link>
                        </div>
                    ))}
                </div>
            </section>

            {/* Related Services */}
            <section className={styles.related}>
                <div className={styles.sectionHeader}>
                    <h2>Related Services</h2>
                    <p>Enhance your test preparation with these complementary services.</p>
                </div>

                <div className={styles.relatedGrid}>
                    <div className={styles.relatedCard}>
                        <h3>📊 Diagnostic Testing</h3>
                        <p>Start with a comprehensive diagnostic to establish your baseline and identify focus areas.</p>
                        <Link href="/forms/sat-act-diagnostic" className={styles.relatedLink}>
                            Schedule Diagnostic →
                        </Link>
                    </div>

                    <div className={styles.relatedCard}>
                        <h3>✏️ Practice Tests</h3>
                        <p>Full-length proctored practice exams to simulate test day conditions and track progress.</p>
                        <Link href="/forms/sat-act-practice-test" className={styles.relatedLink}>
                            Book Practice Test →
                        </Link>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className={styles.cta}>
                <h2>Ready to Improve Your Score?</h2>
                <p>
                    Schedule a free consultation to discuss your goals and create a personalized test prep plan.
                </p>
                <div className={styles.ctaButtons}>
                    <Link href="/forms/sat-act-course" className={styles.btnCtaPrimary}>
                        Start Test Prep
                    </Link>
                    <Link href="/consultation/schedule" className={styles.btnCtaSecondary}>
                        Free Consultation
                    </Link>
                </div>
            </section>
        </>
    );
}
