'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './Header.module.css';

export default function Header() {
    const pathname = usePathname();

    const navLinks = [
        { href: '/programs/sat-act-preparation', label: 'SAT/ACT' },
        { href: '/sat-act-practice-tests', label: 'Practice Tests' },
        { href: '/college-admissions', label: 'Admissions' },
        { href: '/college-essays', label: 'Essays' },
        { href: '/executive-coaching', label: 'Executive Function' },
        { href: '/about', label: 'About' },
        { href: '/online-payment', label: 'Payment' },
        { href: '/contact', label: 'Contact Us' },
    ];

    return (
        <header className={styles.header}>
            <nav className={styles.nav}>
                <Link href="/" className={styles.logo}>
                    <span className={styles.checkmark}>✓</span>
                    <span className={styles.brandName}>Bugle Learn</span>
                </Link>

                <ul className={styles.navLinks}>
                    {navLinks.map((link) => (
                        <li key={link.href}>
                            <Link
                                href={link.href}
                                className={`${styles.navLink} ${pathname === link.href ? styles.active : ''}`}
                            >
                                {link.label}
                            </Link>
                        </li>
                    ))}
                </ul>

                <Link href="/service-selection" className={styles.ctaButton}>
                    Book Session
                </Link>
            </nav>
        </header>
    );
}
