import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/landing.css';

const Landing = () => {
  const { user } = useAuth();
  const ctaPath = user ? '/jobs' : '/register';

  return (
    <div className="landing-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-badge">🚀 Your Career Starts Here</div>
          <h1 className="hero-title">
            Bridge the Gap Between
            <span className="hero-gradient"> Talent</span> &amp;
            <span className="hero-gradient"> Opportunity</span>
          </h1>
          <p className="hero-subtitle">
            CareerBridge connects ambitious students and professionals with top companies.
            Discover jobs and internships tailored to your goals.
          </p>
          <div className="hero-actions">
            <Link to={ctaPath} className="btn-hero-primary">
              {user ? 'Browse Jobs' : 'Get Started Free'}
            </Link>
            <Link to={user ? '/jobs' : '/login'} className="btn-hero-secondary">
              Find Opportunities →
            </Link>
          </div>
          <div className="hero-stats">
            <div className="stat-item">
              <span className="stat-number">500+</span>
              <span className="stat-label">Job Listings</span>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
              <span className="stat-number">1.2K+</span>
              <span className="stat-label">Students Hired</span>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
              <span className="stat-number">200+</span>
              <span className="stat-label">Companies</span>
            </div>
          </div>
        </div>
        <div className="hero-visual">
          <div className="hero-floating-card card1">
            <div className="floating-card-icon">💼</div>
            <div>
              <div className="floating-card-title">Senior Developer</div>
              <div className="floating-card-sub">TechNova Inc.</div>
            </div>
          </div>
          <div className="hero-floating-card card2">
            <div className="floating-card-icon">🎓</div>
            <div>
              <div className="floating-card-title">ML Intern</div>
              <div className="floating-card-sub">AI Ventures</div>
            </div>
          </div>
          <div className="hero-floating-card card3">
            <div className="floating-card-icon">✅</div>
            <div>
              <div className="floating-card-title">Offer Received!</div>
              <div className="floating-card-sub">Congratulations</div>
            </div>
          </div>
          <div className="hero-circle-bg"></div>
        </div>
      </section>

      {/* Two Audience Cards */}
      <section className="audience-section">
        <div className="section-header">
          <h2>Who Is CareerBridge For?</h2>
          <p>Whether you&apos;re just starting out or advancing your career, we have opportunities for you.</p>
        </div>
        <div className="audience-grid">
          <div className="audience-card student-card">
            <div className="audience-icon-wrap">🎓</div>
            <h3>For Students</h3>
            <p>
              Build your resume and gain the skills you need to stand out from the crowd.
              Access internships, entry-level jobs, and mentorship programs.
            </p>
            <ul className="audience-features">
              <li>✓ Internship opportunities</li>
              <li>✓ Skill-based job matching</li>
              <li>✓ Resume profile builder</li>
              <li>✓ Track your applications</li>
            </ul>
            <Link to={ctaPath} className="btn-audience">
              Find Internships
            </Link>
          </div>

          <div className="audience-card professional-card">
            <div className="audience-icon-wrap">💼</div>
            <h3>For Professionals</h3>
            <p>
              Advance your career with curated opportunities that match your professional goals.
              Connect with industry-leading companies ready to hire.
            </p>
            <ul className="audience-features">
              <li>✓ Senior &amp; mid-level roles</li>
              <li>✓ Location-based search</li>
              <li>✓ Salary transparency</li>
              <li>✓ Application tracking</li>
            </ul>
            <Link to={ctaPath} className="btn-audience professional">
              Find Jobs
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="how-it-works">
        <div className="section-header">
          <h2>How CareerBridge Works</h2>
          <p>Three simple steps to land your dream opportunity</p>
        </div>
        <div className="steps-grid">
          <div className="step-card">
            <div className="step-number">01</div>
            <div className="step-icon">📝</div>
            <h4>Create Your Profile</h4>
            <p>Sign up and build a detailed profile showcasing your skills, education, and experience.</p>
          </div>
          <div className="step-connector">→</div>
          <div className="step-card">
            <div className="step-number">02</div>
            <div className="step-icon">🔍</div>
            <h4>Discover Opportunities</h4>
            <p>Browse hundreds of curated job and internship listings filtered by location and type.</p>
          </div>
          <div className="step-connector">→</div>
          <div className="step-card">
            <div className="step-number">03</div>
            <div className="step-icon">🚀</div>
            <h4>Apply &amp; Get Hired</h4>
            <p>Apply with one click and track your application status in real time.</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-content">
          <h2>Ready to Launch Your Career?</h2>
          <p>Join thousands of students and professionals who found their dream job through CareerBridge.</p>
          <div className="cta-actions">
            <Link to={ctaPath} className="btn-cta-primary">
              {user ? 'Browse Jobs' : 'Create Free Account'}
            </Link>
            <Link to={user ? '/my-applications' : '/login'} className="btn-cta-secondary">
              {user ? 'My Applications' : 'Sign In'}
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="footer-content">
          <div className="footer-brand">
            <span>🔗</span>
            <span>CareerBridge</span>
          </div>
          <p className="footer-tagline">Connecting talent with opportunity, one bridge at a time.</p>
          <p className="footer-copy">© 2024 CareerBridge. A MERN Stack Project.</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
