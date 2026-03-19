import { Inter } from 'next/font/google';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Bugle Learn - College Test Prep & Admissions Counseling',
  description: 'Expert SAT/ACT prep, college admissions counseling, and essay support. 500+ students placed, 98% satisfaction, 150+ point average improvement.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
