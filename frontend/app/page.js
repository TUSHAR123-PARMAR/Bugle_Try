import Link from 'next/link';
import styles from './page.module.css';

export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <span className={styles.trustBadge}>
            🎓 Trusted by 500+ Families
          </span>

          <h1>
            Your Path to <span className={styles.highlight}>College Success</span><br />
            Starts Here
          </h1>

          <p className={styles.heroSubtitle}>
            Expert guidance for SAT/ACT preparation, college admissions, essay writing,
            and executive function coaching. Personalized support to help your student
            achieve their college dreams.
          </p>

          <div className={styles.heroCtas}>
            <Link href="/consultation/schedule" className={styles.btnPrimary}>
              Schedule a Consultation →
            </Link>
            <Link href="/service-selection" className={styles.btnSecondary}>
              Explore Services
            </Link>
          </div>
        </div>

        <div className={styles.heroVisual}>
          <div className={styles.successCard}>
            <div className={styles.cardHeader}>
              <span className={styles.cardIcon}>✓</span>
              <h3>Your Success Journey</h3>
            </div>
            <ul className={styles.journeySteps}>
              <li className={styles.completed}>✓ Initial Consultation</li>
              <li className={styles.completed}>✓ Personalized Plan</li>
              <li className={styles.inProgress}>○ Expert Instruction</li>
              <li className={styles.pending}>○ College Acceptance</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Stats Section */}
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
          <div className={styles.statLabel}>Average Score Improvement</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statNumber}>15+</div>
          <div className={styles.statLabel}>Years Experience</div>
        </div>
      </section>

      {/* Services Section */}
      <section className={styles.services}>
        <div className={styles.sectionHeader}>
          <span className={styles.sectionTag}>Our Services</span>
          <h2>Comprehensive College Prep Support</h2>
          <p className={styles.sectionSubtitle}>
            From test preparation to admissions counseling, we provide the expert
            guidance your student needs to succeed.
          </p>
        </div>

        <div className={styles.servicesGrid}>
          <div className={styles.serviceCard}>
            <div className={styles.serviceIcon}>📚</div>
            <h3>SAT/ACT Instruction</h3>
            <p>One-on-one personalized test preparation with expert instructors to maximize your score potential.</p>
            <Link href="/forms/sat-act-course" className={styles.btnService}>
              Start Your Test Prep Journey
            </Link>
            <Link href="/programs/sat-act-preparation" className={styles.learnMore}>
              Learn More →
            </Link>
          </div>

          <div className={styles.serviceCard}>
            <div className={styles.serviceIcon}>📊</div>
            <h3>SAT/ACT Diagnostic Tests</h3>
            <p>Comprehensive diagnostic assessments to identify strengths and target areas for improvement.</p>
            <Link href="/forms/sat-act-diagnostic" className={styles.btnService}>
              Schedule Your Diagnostic
            </Link>
            <Link href="/programs/sat-act-preparation" className={styles.learnMore}>
              Learn More →
            </Link>
          </div>

          <div className={styles.serviceCard}>
            <div className={styles.serviceIcon}>✏️</div>
            <h3>SAT/ACT Practice Tests</h3>
            <p>Full-length proctored practice exams with detailed analysis to track your progress.</p>
            <Link href="/forms/sat-act-practice-test" className={styles.btnService}>
              Take a Practice Test
            </Link>
            <Link href="/sat-act-practice-tests" className={styles.learnMore}>
              Learn More →
            </Link>
          </div>

          <div className={styles.serviceCard}>
            <div className={styles.serviceIcon}>🎓</div>
            <h3>College Admissions Counseling</h3>
            <p>Expert guidance through every step of the college application process.</p>
            <Link href="/forms/college-admissions" className={styles.btnService}>
              Begin Your College Journey
            </Link>
            <Link href="/college-admissions" className={styles.learnMore}>
              Learn More →
            </Link>
          </div>

          <div className={styles.serviceCard}>
            <div className={styles.serviceIcon}>📝</div>
            <h3>College Essay Support</h3>
            <p>Develop compelling essays that showcase your unique voice and experiences.</p>
            <Link href="/forms/college-essays" className={styles.btnService}>
              Get Essay Support
            </Link>
            <Link href="/college-essays" className={styles.learnMore}>
              Learn More →
            </Link>
          </div>

          <div className={styles.serviceCard}>
            <div className={styles.serviceIcon}>🕐</div>
            <h3>Executive Function Coaching</h3>
            <p>Build essential skills for academic success: organization, time management, and focus.</p>
            <Link href="/forms/executive-function" className={styles.btnService}>
              Enhance Your Skills
            </Link>
            <Link href="/executive-coaching" className={styles.learnMore}>
              Learn More →
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className={styles.howItWorks}>
        <div className={styles.sectionHeader}>
          <span className={styles.sectionTag}>How It Works</span>
          <h2>Your Journey to Success</h2>
          <p className={styles.sectionSubtitle}>
            A simple, proven process to help your student reach their college goals.
          </p>
        </div>

        <div className={styles.stepsGrid}>
          <div className={styles.stepCard}>
            <div className={styles.stepNumber}>1</div>
            <h3>Schedule Consultation</h3>
            <p>Meet with our team to discuss your student&apos;s goals, strengths, and areas for growth.</p>
          </div>

          <div className={styles.stepArrow}>→</div>

          <div className={styles.stepCard}>
            <div className={styles.stepNumber}>2</div>
            <h3>Personalized Plan</h3>
            <p>We create a customized roadmap tailored to your student&apos;s unique needs and timeline.</p>
          </div>

          <div className={styles.stepArrow}>→</div>

          <div className={styles.stepCard}>
            <div className={styles.stepNumber}>3</div>
            <h3>Expert Instruction</h3>
            <p>Work one-on-one with our expert instructors and counselors to build skills and confidence.</p>
          </div>

          <div className={styles.stepArrow}>→</div>

          <div className={styles.stepCard}>
            <div className={styles.stepNumber}>4</div>
            <h3>College Acceptance</h3>
            <p>Celebrate as your student achieves their goals and gains admission to their dream school.</p>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className={styles.testimonials}>
        <div className={styles.sectionHeader}>
          <span className={styles.sectionTag}>Testimonials</span>
          <h2>What Families Say</h2>
          <p className={styles.sectionSubtitle}>
            Hear from the families we&apos;ve helped on their college journey.
          </p>
        </div>

        <div className={styles.testimonialsGrid}>
          <div className={styles.testimonialCard}>
            <div className={styles.quoteIcon}>&ldquo;</div>
            <p className={styles.testimonialText}>
              The SAT prep program was incredible. My daughter&apos;s score improved by 200 points,
              and she got into her dream school!
            </p>
            <div className={styles.testimonialAuthor}>
              <div className={styles.authorInitial}>J</div>
              <div className={styles.authorInfo}>
                <div className={styles.authorName}>Jennifer M.</div>
                <div className={styles.authorDetail}>Parent of Columbia Freshman</div>
              </div>
            </div>
          </div>

          <div className={styles.testimonialCard}>
            <div className={styles.quoteIcon}>&ldquo;</div>
            <p className={styles.testimonialText}>
              The essay coaching helped me find my authentic voice. I felt confident submitting
              my applications.
            </p>
            <div className={styles.testimonialAuthor}>
              <div className={styles.authorInitial}>M</div>
              <div className={styles.authorInfo}>
                <div className={styles.authorName}>Michael T.</div>
                <div className={styles.authorDetail}>Student, Class of 2025</div>
              </div>
            </div>
          </div>

          <div className={styles.testimonialCard}>
            <div className={styles.quoteIcon}>&ldquo;</div>
            <p className={styles.testimonialText}>
              The admissions counseling took the stress out of the college process. We had a
              clear roadmap from day one.
            </p>
            <div className={styles.testimonialAuthor}>
              <div className={styles.authorInitial}>R</div>
              <div className={styles.authorInfo}>
                <div className={styles.authorName}>Robert & Susan K.</div>
                <div className={styles.authorDetail}>Parents of NYU Student</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className={styles.finalCta}>
        <div className={styles.ctaContent}>
          <h2>Ready to Start Your College Journey?</h2>
          <p>
            Schedule a consultation today and discover how we can help your student
            achieve their college dreams.
          </p>
          <div className={styles.ctaButtons}>
            <Link href="/consultation/schedule" className={styles.btnCtaPrimary}>
              Schedule a Consultation
            </Link>
            <Link href="/contact" className={styles.btnCtaSecondary}>
              Contact Us
            </Link>
          </div>
        </div>

        <div className={styles.ctaContact}>
          <div className={styles.contactItem}>
            <span className={styles.contactIcon}>📞</span>
            <span className={styles.contactText}>914.462.7797</span>
          </div>
          <div className={styles.contactItem}>
            <span className={styles.contactIcon}>✉️</span>
            <span className={styles.contactText}>info@buglelearn.com</span>
          </div>
        </div>
      </section>
    </>
  );
}
