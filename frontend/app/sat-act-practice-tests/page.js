import Link from 'next/link';
import styles from './page.module.css';

export const metadata = {
    title: 'SAT/ACT Practice Tests - Bugle Learn',
    description: 'Full-length proctored SAT and ACT practice tests with detailed score analysis. Regular and extended time options available.',
};

export default function PracticeTests() {
    const tests = [
        { name: 'Diagnostic SAT/ACT - Regular Time', price: 250, description: 'Full diagnostic with standard timing. Requires 2 Saturday dates.' },
        { name: 'Diagnostic SAT/ACT - 50% Extended', price: 250, description: 'Full diagnostic with 50% extended time. Requires 2 Saturday dates.' },
        { name: 'Practice SAT - Regular Time', price: 125, description: 'One Saturday session' },
        { name: 'Practice SAT - 50% Extended', price: 125, description: 'One Saturday session' },
        { name: 'Practice ACT - Regular Time', price: 125, description: 'One Saturday session' },
        { name: 'Practice ACT - 50% Extended', price: 125, description: 'One Saturday session' },
    ];

    return (
        <>
            <section className={styles.hero}>
                <div className={styles.heroContent}>
                    <span className={styles.badge}>Practice Tests</span>
                    <h1>Full-Length SAT & ACT Practice Tests</h1>
                    <p>
                        Experience realistic test conditions with our proctored practice exams.
                        Get detailed score analysis and identify areas for improvement.
                    </p>
                    <div className={styles.heroCtas}>
                        <Link href="/forms/sat-act-practice-test" className={styles.btnPrimary}>
                            Register for a Test →
                        </Link>
                        <Link href="/forms/sat-act-diagnostic" className={styles.btnSecondary}>
                            Take Diagnostic First
                        </Link>
                    </div>
                </div>
            </section>

            <section className={styles.features}>
                <div className={styles.sectionHeader}>
                    <h2>Why Take Practice Tests?</h2>
                    <p>Build confidence and improve your score with realistic test experience.</p>
                </div>

                <div className={styles.featuresGrid}>
                    <div className={styles.featureCard}>
                        <div className={styles.featureIcon}>⏱️</div>
                        <h3>Realistic Timing</h3>
                        <p>Experience actual test conditions with proper timing and breaks.</p>
                    </div>
                    <div className={styles.featureCard}>
                        <div className={styles.featureIcon}>📊</div>
                        <h3>Detailed Analysis</h3>
                        <p>Receive comprehensive score reports identifying strengths and weaknesses.</p>
                    </div>
                    <div className={styles.featureCard}>
                        <div className={styles.featureIcon}>📈</div>
                        <h3>Track Progress</h3>
                        <p>Monitor improvement over time with consistent scoring methodology.</p>
                    </div>
                    <div className={styles.featureCard}>
                        <div className={styles.featureIcon}>♿</div>
                        <h3>Extended Time</h3>
                        <p>50% and 100% extended time options available for eligible students.</p>
                    </div>
                </div>
            </section>

            <section className={styles.pricing}>
                <div className={styles.sectionHeader}>
                    <h2>Test Options & Pricing</h2>
                    <p>All tests held on Saturdays with professional proctoring.</p>
                </div>

                <div className={styles.pricingGrid}>
                    {tests.map((test) => (
                        <div key={test.name} className={styles.priceCard}>
                            <h3>{test.name}</h3>
                            <div className={styles.priceAmount}>
                                <span className={styles.currency}>$</span>
                                <span className={styles.price}>{test.price}</span>
                            </div>
                            <p className={styles.priceDesc}>{test.description}</p>
                            <Link href="/forms/sat-act-practice-test" className={styles.btnPrice}>
                                Register
                            </Link>
                        </div>
                    ))}
                </div>
            </section>

            <section className={styles.cta}>
                <h2>Ready to Test Your Knowledge?</h2>
                <p>Register for a practice test and see where you stand.</p>
                <Link href="/forms/sat-act-practice-test" className={styles.ctaBtn}>
                    Register Now
                </Link>
            </section>
        </>
    );
}
