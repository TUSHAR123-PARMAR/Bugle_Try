import Link from 'next/link';
import styles from './page.module.css';

export const metadata = {
    title: 'College Admissions Counseling - Bugle Learn',
    description: 'Expert college admissions counseling to guide you through every step of the application process.',
};

export default function CollegeAdmissions() {
    const packages = [
        { name: 'College List Creation', price: 600, description: '1-hour consultation + personalized college list', sessions: 1 },
        { name: 'Five Session Package', price: 2000, description: '5 comprehensive counseling sessions', sessions: 5 },
        { name: 'Ten Session Package', price: 4000, description: '10 comprehensive counseling sessions', sessions: 10 },
        { name: 'Strategic One-Hour Consultation', price: 500, description: 'Focused strategic guidance', sessions: 1 },
    ];

    return (
        <>
            <section className={styles.hero}>
                <div className={styles.heroContent}>
                    <span className={styles.badge}>College Admissions</span>
                    <h1>Navigate Your Path to the Perfect College</h1>
                    <p>
                        Expert guidance through every step of the college application process.
                        From building your college list to submitting your final applications,
                        we&apos;re with you every step of the way.
                    </p>
                    <div className={styles.heroCtas}>
                        <Link href="/forms/college-admissions" className={styles.btnPrimary}>
                            Start Your Journey →
                        </Link>
                        <Link href="/consultation/schedule" className={styles.btnSecondary}>
                            Free Consultation
                        </Link>
                    </div>
                </div>
            </section>

            <section className={styles.features}>
                <div className={styles.sectionHeader}>
                    <h2>Comprehensive Admissions Support</h2>
                    <p>Everything you need for a successful college application journey.</p>
                </div>

                <div className={styles.featuresGrid}>
                    <div className={styles.featureCard}>
                        <div className={styles.featureIcon}>📋</div>
                        <h3>College List Development</h3>
                        <p>Strategic selection of reach, match, and safety schools based on your profile and goals.</p>
                    </div>

                    <div className={styles.featureCard}>
                        <div className={styles.featureIcon}>📝</div>
                        <h3>Application Strategy</h3>
                        <p>Develop a compelling narrative that showcases your unique strengths and experiences.</p>
                    </div>

                    <div className={styles.featureCard}>
                        <div className={styles.featureIcon}>📅</div>
                        <h3>Timeline Management</h3>
                        <p>Stay on track with personalized deadlines and milestone tracking throughout the process.</p>
                    </div>

                    <div className={styles.featureCard}>
                        <div className={styles.featureIcon}>🎯</div>
                        <h3>Interview Preparation</h3>
                        <p>Build confidence with mock interviews and strategic question preparation.</p>
                    </div>
                </div>
            </section>

            <section className={styles.pricing}>
                <div className={styles.sectionHeader}>
                    <h2>Admissions Counseling Packages</h2>
                    <p>Choose the support level that fits your needs.</p>
                </div>

                <div className={styles.pricingGrid}>
                    {packages.map((pkg) => (
                        <div key={pkg.name} className={styles.priceCard}>
                            <h3>{pkg.name}</h3>
                            <div className={styles.priceAmount}>
                                <span className={styles.currency}>$</span>
                                <span className={styles.price}>{pkg.price.toLocaleString()}</span>
                            </div>
                            <p className={styles.priceDesc}>{pkg.description}</p>
                            <Link href="/forms/college-admissions" className={styles.btnPrice}>
                                Select Package
                            </Link>
                        </div>
                    ))}
                </div>
            </section>

            <section className={styles.cta}>
                <h2>Ready to Start Your College Journey?</h2>
                <p>Schedule a consultation to discuss your goals and create a personalized plan.</p>
                <div className={styles.ctaButtons}>
                    <Link href="/forms/college-admissions" className={styles.btnCtaPrimary}>
                        Get Started
                    </Link>
                    <Link href="/consultation/schedule" className={styles.btnCtaSecondary}>
                        Free Consultation
                    </Link>
                </div>
            </section>
        </>
    );
}
