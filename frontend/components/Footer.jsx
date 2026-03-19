import Link from 'next/link';
import styles from './Footer.module.css';

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className={styles.footer}>
            <div className={styles.footerContent}>
                {/* Brand Section */}
                <div className={styles.footerSection}>
                    <div className={styles.footerLogo}>
                        <span className={styles.checkmark}>✓</span>
                        <span className={styles.brandName}>Bugle Learn</span>
                    </div>
                    <p className={styles.tagline}>
                        Empowering students to achieve their college dreams through personalized
                        guidance, expert instruction, and comprehensive support throughout the
                        admissions journey.
                    </p>
                    <div className={styles.contact}>
                        <div className={styles.contactItem}>
                            <span>📞</span>
                            <span>914.462.7797</span>
                        </div>
                        <div className={styles.contactItem}>
                            <span>✉️</span>
                            <span>info@buglelearn.com</span>
                        </div>
                    </div>
                </div>

                {/* Services Section */}
                <div className={styles.footerSection}>
                    <h4>Services</h4>
                    <ul>
                        <li><Link href="/programs/sat-act-preparation">SAT/ACT Instruction</Link></li>
                        <li><Link href="/sat-act-practice-tests">Practice Tests</Link></li>
                        <li><Link href="/college-admissions">Admissions Counseling</Link></li>
                        <li><Link href="/college-essays">Essay Support</Link></li>
                        <li><Link href="/executive-coaching">Executive Function</Link></li>
                    </ul>
                </div>

                {/* Company Section */}
                <div className={styles.footerSection}>
                    <h4>Company</h4>
                    <ul>
                        <li><Link href="/about">About Us</Link></li>
                        <li><Link href="/contact">Contact</Link></li>
                        <li><Link href="/testimonials">Testimonials</Link></li>
                        <li><Link href="/faq">FAQ</Link></li>
                    </ul>
                </div>

                {/* Support Section */}
                <div className={styles.footerSection}>
                    <h4>Support</h4>
                    <ul>
                        <li><Link href="/online-payment">Make a Payment</Link></li>
                        <li><Link href="/service-selection">Book a Session</Link></li>
                        <li><Link href="/privacy">Privacy Policy</Link></li>
                        <li><Link href="/terms">Terms of Service</Link></li>
                    </ul>
                </div>
            </div>

            <div className={styles.footerBottom}>
                <div className={styles.copyright}>
                    © {currentYear} Bugle Learn. All rights reserved.
                </div>
                <div className={styles.socialIcons}>
                    <a href="#" aria-label="LinkedIn">in</a>
                    <a href="#" aria-label="Facebook">f</a>
                    <a href="#" aria-label="Instagram">📷</a>
                </div>
            </div>
        </footer>
    );
}
