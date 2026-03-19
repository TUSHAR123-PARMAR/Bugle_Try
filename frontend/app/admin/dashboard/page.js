'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';

export default function AdminDashboard() {
    const router = useRouter();
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('adminToken');
        if (!token) {
            router.push('/admin/login');
            return;
        }

        fetch('http://localhost:4000/api/admin/dashboard', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then(res => {
                if (res.status === 401) {
                    localStorage.removeItem('adminToken');
                    router.push('/admin/login');
                    throw new Error('Unauthorized');
                }
                return res.json();
            })
            .then(data => {
                if (data.success) {
                    setStats(data.data);
                }
                setLoading(false);
            })
            .catch(err => {
                console.error('Dashboard fetch error:', err);
                setLoading(false);
            });
    }, [router]);

    if (loading) {
        return <div className={styles.container}><div className={styles.content}>Loading dashboard...</div></div>;
    }

    return (
        <div className={styles.container}>
            <nav className={styles.sidebar}>
                <div className={styles.logo}>Bugle Admin</div>
                <ul className={styles.navLinks}>
                    <li className={styles.active}>Dashboard</li>
                    <li onClick={() => alert('Feature coming next!')}>Inquiries</li>
                    <li onClick={() => alert('Feature coming next!')}>Registrations</li>
                    <li onClick={() => {
                        localStorage.removeItem('adminToken');
                        router.push('/admin/login');
                    }}>Logout</li>
                </ul>
            </nav>

            <main className={styles.content}>
                <header className={styles.header}>
                    <h1>Dashboard</h1>
                    <div className={styles.userMenu}>Admin User</div>
                </header>

                {stats ? (
                    <div className={styles.statsGrid}>
                        <div className={styles.statCard}>
                            <h3>New Inquiries</h3>
                            <p className={styles.statValue}>{stats.inquiries?.new || 0}</p>
                            <small>Total: {stats.inquiries?.total || 0}</small>
                        </div>
                        <div className={styles.statCard}>
                            <h3>Stats</h3>
                            <p className={styles.statValue}>{stats.registrations?.total || 0}</p>
                            <small>Registrations</small>
                        </div>
                        <div className={styles.statCard}>
                            <h3>Revenue (30 Days)</h3>
                            <p className={styles.statValue}>${stats.revenue?.last30Days || 0}</p>
                        </div>
                    </div>
                ) : (
                    <p>Failed to load statistics.</p>
                )}

                <div className={styles.section}>
                    <h2>Recent Activity</h2>
                    <p>System is running. New inquiries will appear here.</p>
                </div>
            </main>
        </div>
    );
}
