import Link from 'next/link';
import styles from './page.module.css';

export const metadata = {
    title: 'Book a Session - Bugle Learn',
    description: 'Choose from our range of college prep services including SAT/ACT preparation, admissions counseling, essay support, and executive function coaching.',
};

export default function ServiceSelection() {
    const services = [
        {
            icon: '📚',
            title: 'SAT/ACT Instruction',
            description: 'One-on-one personalized test preparation with expert instructors.',
            price: 'From $1,475',
            href: '/forms/sat-act-course',
            infoHref: '/programs/sat-act-preparation',
        },
        {
            icon: '📊',
            title: 'SAT/ACT Diagnostic',
            description: 'Comprehensive diagnostic assessment to identify strengths and focus areas.',
            price: 'From $100',
            href: '/forms/sat-act-diagnostic',
            infoHref: '/programs/sat-act-preparation',
        },
        {
            icon: '✏️',
            title: 'Practice Tests',
            description: 'Full-length proctored practice exams with detailed score analysis.',
            price: 'From $125',
            href: '/forms/sat-act-practice-test',
            infoHref: '/sat-act-practice-tests',
        },
        {
            icon: '🎓',
            title: 'College Admissions',
            description: 'Expert guidance through every step of the college application process.',
            price: 'From $500',
            href: '/forms/college-admissions',
            infoHref: '/college-admissions',
        },
        {
            icon: '📝',
            title: 'College Essays',
            description: 'Develop compelling essays that showcase your unique voice.',
            price: 'From $295',
            href: '/forms/college-essays',
            infoHref: '/college-essays',
        },
        {
            icon: '🕐',
            title: 'Executive Function',
            description: 'Build essential skills: organization, time management, and focus.',
            price: 'From $150',
            href: '/forms/executive-function',
            infoHref: '/executive-coaching',
        },
    ];

    return (
        <div className={styles.page}>
            <div className={styles.container}>
                <div className={styles.header}>
                    <span className={styles.badge}>Select a Service</span>
                    <h1>Choose Your Path to Success</h1>
                    <p>
                        Select the service that best fits your needs. Not sure where to start?
                        <Link href="/consultation/schedule" className={styles.consultLink}> Schedule a free consultation</Link>.
                    </p>
                </div>

                <div className={styles.grid}>
                    {services.map((service) => (
                        <div key={service.title} className={styles.card}>
                            <div className={styles.cardIcon}>{service.icon}</div>
                            <h2>{service.title}</h2>
                            <p>{service.description}</p>
                            <div className={styles.cardPrice}>{service.price}</div>
                            <div className={styles.cardActions}>
                                <Link href={service.href} className={styles.btnPrimary}>
                                    Register Now
                                </Link>
                                <Link href={service.infoHref} className={styles.btnSecondary}>
                                    Learn More
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>

                <div className={styles.cta}>
                    <h3>Not sure which service is right for you?</h3>
                    <p>Schedule a free consultation and we&apos;ll help create a personalized plan.</p>
                    <Link href="/consultation/schedule" className={styles.ctaBtn}>
                        Schedule Free Consultation
                    </Link>
                </div>
            </div>
        </div>
    );
}
