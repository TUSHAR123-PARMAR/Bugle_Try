import Link from 'next/link';
import styles from './page.module.css';

export const metadata = {
    title: 'Executive Function Coaching - Bugle Learn',
    description: 'Build essential skills for academic success: organization, time management, study habits, and focus.',
};

export default function ExecutiveCoaching() {
    return (
        <>
            <section className={styles.hero}>
                <div className={styles.heroContent}>
                    <span className={styles.badge}>Executive Function</span>
                    <h1>Build Skills for Academic Success</h1>
                    <p>
                        Our executive function coaching helps students develop essential skills
                        for organization, time management, focus, and study habits that last a lifetime.
                    </p>
                    <div className={styles.heroCtas}>
                        <Link href="/forms/executive-function" className={styles.btnPrimary}>
                            Start Coaching →
                        </Link>
                        <Link href="/consultation/schedule" className={styles.btnSecondary}>
                            Free Consultation
                        </Link>
                    </div>
                </div>
            </section>

            <section className={styles.skills}>
                <div className={styles.sectionHeader}>
                    <h2>Skills We Develop</h2>
                    <p>Comprehensive coaching for lasting academic success.</p>
                </div>

                <div className={styles.skillsGrid}>
                    <div className={styles.skillCard}>
                        <div className={styles.skillIcon}>📅</div>
                        <h3>Time Management</h3>
                        <p>Learn to prioritize tasks, meet deadlines, and balance academics with extracurriculars.</p>
                    </div>
                    <div className={styles.skillCard}>
                        <div className={styles.skillIcon}>📁</div>
                        <h3>Organization</h3>
                        <p>Develop systems for managing assignments, notes, and materials effectively.</p>
                    </div>
                    <div className={styles.skillCard}>
                        <div className={styles.skillIcon}>🎯</div>
                        <h3>Focus & Attention</h3>
                        <p>Build strategies to minimize distractions and maintain concentration during study time.</p>
                    </div>
                    <div className={styles.skillCard}>
                        <div className={styles.skillIcon}>📚</div>
                        <h3>Study Habits</h3>
                        <p>Create effective study routines and learn techniques for better retention.</p>
                    </div>
                    <div className={styles.skillCard}>
                        <div className={styles.skillIcon}>📝</div>
                        <h3>Planning</h3>
                        <p>Break down large projects into manageable steps and plan ahead for success.</p>
                    </div>
                    <div className={styles.skillCard}>
                        <div className={styles.skillIcon}>💪</div>
                        <h3>Self-Advocacy</h3>
                        <p>Learn to communicate needs and seek appropriate support when needed.</p>
                    </div>
                </div>
            </section>

            <section className={styles.pricing}>
                <div className={styles.sectionHeader}>
                    <h2>Coaching Packages</h2>
                    <p>Personalized 30-minute coaching sessions tailored to your student&apos;s needs.</p>
                </div>

                <div className={styles.pricingGrid}>
                    <div className={styles.priceCard}>
                        <h3>Five Sessions Package</h3>
                        <div className={styles.priceAmount}>
                            <span className={styles.currency}>$</span>
                            <span className={styles.price}>750</span>
                        </div>
                        <p className={styles.priceDesc}>5 personalized 30-minute coaching sessions</p>
                        <p className={styles.savings}>Save $50 vs. individual sessions</p>
                        <Link href="/forms/executive-function" className={styles.btnPrice}>
                            Select Package
                        </Link>
                    </div>

                    <div className={styles.priceCard}>
                        <h3>Individual Session</h3>
                        <div className={styles.priceAmount}>
                            <span className={styles.currency}>$</span>
                            <span className={styles.price}>150</span>
                        </div>
                        <p className={styles.priceDesc}>Single 30-minute coaching session</p>
                        <p className={styles.perSession}>Perfect for trying out our coaching</p>
                        <Link href="/forms/executive-function" className={styles.btnPrice}>
                            Book Session
                        </Link>
                    </div>
                </div>
            </section>

            <section className={styles.cta}>
                <h2>Ready to Build Lasting Skills?</h2>
                <p>Start with a free consultation to discuss your student&apos;s needs.</p>
                <div className={styles.ctaButtons}>
                    <Link href="/forms/executive-function" className={styles.btnCtaPrimary}>
                        Start Coaching
                    </Link>
                    <Link href="/consultation/schedule" className={styles.btnCtaSecondary}>
                        Free Consultation
                    </Link>
                </div>
            </section>
        </>
    );
}
