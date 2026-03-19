import Link from 'next/link';
import styles from './page.module.css';

export const metadata = {
    title: 'College Essay Support - Bugle Learn',
    description: 'Develop compelling college essays with personalized coaching from brainstorming to final polish.',
};

export default function CollegeEssays() {
    const packages = [
        { name: 'One Session', price: 295, sessions: 1, description: 'Brainstorming and topic selection' },
        { name: 'Two Sessions', price: 590, sessions: 2, description: 'Draft evaluation and organization' },
        { name: 'Three Sessions', price: 885, sessions: 3, description: 'Complete essay development' },
        { name: 'Four Sessions', price: 1180, sessions: 4, description: 'Comprehensive editing and refinement' },
        { name: 'Five Sessions', price: 1475, sessions: 5, description: 'Full process to final polish' },
    ];

    return (
        <>
            <section className={styles.hero}>
                <div className={styles.heroContent}>
                    <span className={styles.badge}>College Essays</span>
                    <h1>Tell Your Story with Impact</h1>
                    <p>
                        Your college essay is your chance to stand out. Our expert coaches help you
                        discover your unique voice, craft compelling narratives, and polish your
                        essays to perfection.
                    </p>
                    <div className={styles.heroCtas}>
                        <Link href="/forms/college-essays" className={styles.btnPrimary}>
                            Get Essay Support →
                        </Link>
                        <Link href="/consultation/schedule" className={styles.btnSecondary}>
                            Free Consultation
                        </Link>
                    </div>
                </div>
            </section>

            <section className={styles.process}>
                <div className={styles.sectionHeader}>
                    <h2>Our Essay Coaching Process</h2>
                    <p>A step-by-step approach to developing standout essays.</p>
                </div>

                <div className={styles.processGrid}>
                    <div className={styles.processCard}>
                        <div className={styles.processNumber}>1</div>
                        <h3>Brainstorming</h3>
                        <p>Explore your experiences, values, and goals to identify compelling topics.</p>
                    </div>
                    <div className={styles.processCard}>
                        <div className={styles.processNumber}>2</div>
                        <h3>Outlining</h3>
                        <p>Structure your essay for maximum impact with a clear narrative arc.</p>
                    </div>
                    <div className={styles.processCard}>
                        <div className={styles.processNumber}>3</div>
                        <h3>Drafting</h3>
                        <p>Write with guidance and feedback to bring your story to life.</p>
                    </div>
                    <div className={styles.processCard}>
                        <div className={styles.processNumber}>4</div>
                        <h3>Revision</h3>
                        <p>Refine your voice, strengthen your argument, and polish every detail.</p>
                    </div>
                    <div className={styles.processCard}>
                        <div className={styles.processNumber}>5</div>
                        <h3>Final Polish</h3>
                        <p>Perfect grammar, flow, and impact for a submission-ready essay.</p>
                    </div>
                </div>
            </section>

            <section className={styles.pricing}>
                <div className={styles.sectionHeader}>
                    <h2>Essay Support Packages</h2>
                    <p>Choose the level of support that fits your needs.</p>
                </div>

                <div className={styles.pricingGrid}>
                    {packages.map((pkg) => (
                        <div key={pkg.name} className={styles.priceCard}>
                            <h3>{pkg.name}</h3>
                            <div className={styles.priceAmount}>
                                <span className={styles.currency}>$</span>
                                <span className={styles.price}>{pkg.price}</span>
                            </div>
                            <p className={styles.priceDesc}>{pkg.description}</p>
                            <p className={styles.sessionCount}>{pkg.sessions} session{pkg.sessions > 1 ? 's' : ''}</p>
                            <Link href="/forms/college-essays" className={styles.btnPrice}>
                                Select Package
                            </Link>
                        </div>
                    ))}
                </div>
            </section>

            <section className={styles.cta}>
                <h2>Ready to Craft Your Story?</h2>
                <p>Start working with an essay coach today.</p>
                <div className={styles.ctaButtons}>
                    <Link href="/forms/college-essays" className={styles.btnCtaPrimary}>
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
