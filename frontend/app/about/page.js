import Link from 'next/link';
import styles from './page.module.css';

export const metadata = {
    title: 'About Bugle Learn - Expert College Prep',
    description: 'Learn about Bugle Learn\'s 15+ years of experience helping students achieve their college dreams through expert instruction and personalized guidance.',
};

export default function About() {
    return (
        <>
            <section className={styles.hero}>
                <div className={styles.heroContent}>
                    <span className={styles.badge}>About Us</span>
                    <h1>Empowering Students to Achieve Their College Dreams</h1>
                    <p>
                        For over 15 years, Bugle Learn has been the trusted partner for families
                        navigating the college preparation journey. Our personalized approach and
                        expert instruction have helped hundreds of students gain admission to their dream schools.
                    </p>
                </div>
            </section>

            <section className={styles.stats}>
                <div className={styles.statCard}>
                    <div className={styles.statNumber}>500+</div>
                    <div className={styles.statLabel}>Students Placed</div>
                </div>
                <div className={styles.statCard}>
                    <div className={styles.statNumber}>98%</div>
                    <div className={styles.statLabel}>Satisfaction Rate</div>
                </div>
                <div className={styles.statCard}>
                    <div className={styles.statNumber}>150+</div>
                    <div className={styles.statLabel}>Avg Score Improvement</div>
                </div>
                <div className={styles.statCard}>
                    <div className={styles.statNumber}>15+</div>
                    <div className={styles.statLabel}>Years Experience</div>
                </div>
            </section>

            <section className={styles.mission}>
                <div className={styles.missionContent}>
                    <h2>Our Mission</h2>
                    <p>
                        &quot;Empowering students to achieve their college dreams through personalized
                        guidance, expert instruction, and comprehensive support throughout the
                        admissions journey.&quot;
                    </p>
                </div>
            </section>

            <section className={styles.approach}>
                <div className={styles.sectionHeader}>
                    <h2>Our Approach</h2>
                    <p>What sets Bugle Learn apart from other test prep and admissions services.</p>
                </div>

                <div className={styles.approachGrid}>
                    <div className={styles.approachCard}>
                        <div className={styles.approachIcon}>👤</div>
                        <h3>Personalized Attention</h3>
                        <p>Every student is unique. We create customized plans based on individual strengths, goals, and learning styles.</p>
                    </div>
                    <div className={styles.approachCard}>
                        <div className={styles.approachIcon}>🎓</div>
                        <h3>Expert Instructors</h3>
                        <p>Our team consists of experienced educators who are passionate about helping students succeed.</p>
                    </div>
                    <div className={styles.approachCard}>
                        <div className={styles.approachIcon}>📈</div>
                        <h3>Proven Results</h3>
                        <p>Our track record speaks for itself - 500+ students placed and an average 150+ point score improvement.</p>
                    </div>
                    <div className={styles.approachCard}>
                        <div className={styles.approachIcon}>🤝</div>
                        <h3>Family Partnership</h3>
                        <p>We work closely with parents to ensure everyone is aligned and informed throughout the process.</p>
                    </div>
                </div>
            </section>

            <section className={styles.cta}>
                <h2>Ready to Start Your Journey?</h2>
                <p>Schedule a consultation and discover how we can help your student succeed.</p>
                <div className={styles.ctaButtons}>
                    <Link href="/consultation/schedule" className={styles.btnPrimary}>
                        Schedule Consultation
                    </Link>
                    <Link href="/service-selection" className={styles.btnSecondary}>
                        Explore Services
                    </Link>
                </div>
            </section>
        </>
    );
}
