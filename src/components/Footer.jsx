import { ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import liveInAusLogo from '../assets/liveinaus-logo.png';
import { VERTICALS } from '../constants/verticals.js';

const FEATURED_VERTICAL_IDS = ['accommodation', 'migration', 'real-estate', 'healthcare', 'legal-tax', 'marketplace'];

export default function Footer({ setActivePage, onOpenVertical }) {
  const year = new Date().getFullYear();
  const featuredVerticals = VERTICALS.filter((vertical) => FEATURED_VERTICAL_IDS.includes(vertical.id));

  function go(page) {
    setActivePage?.(page);
  }

  return (
    <footer className="footer">
      <div className="footer-columns">
        <div className="footer-brand">
          <img src={liveInAusLogo} alt="LiveInAus" className="brand-logo footer-logo" />
          <p>Global jobs, freelance services, verified listings, and admin-supported communication for people settling somewhere new.</p>
          <div className="footer-trust-row">
            <span><ShieldCheck size={15} /> Admin checked</span>
            <span><Sparkles size={15} /> OTP verified</span>
          </div>
        </div>

        <nav className="footer-nav-group" aria-label="Platform">
          <strong>Platform</strong>
          <button type="button" onClick={() => go('home')}>Home</button>
          <button type="button" onClick={() => go('jobs')}>Jobs</button>
          <button type="button" onClick={() => go('freelance')}>Freelance</button>
          <button type="button" onClick={() => go('platform')}>Explore All Categories</button>
          <button type="button" onClick={() => go('profile')}>My Profile</button>
        </nav>

        <nav className="footer-nav-group" aria-label="Popular categories">
          <strong>Popular Categories</strong>
          {featuredVerticals.map((vertical) => (
            <button type="button" key={vertical.id} onClick={() => onOpenVertical?.(vertical.id)}>{vertical.name}</button>
          ))}
          <button type="button" className="footer-link-more" onClick={() => go('platform')}>View all categories <ArrowRight size={13} /></button>
        </nav>

        <nav className="footer-nav-group" aria-label="For suppliers and account">
          <strong>Suppliers & Account</strong>
          <button type="button" onClick={() => go('employer')}>Post a Job</button>
          <button type="button" onClick={() => go('freelance')}>Sell a Service</button>
          <button type="button" onClick={() => go('platform')}>List in a Category</button>
          <button type="button" onClick={() => go('login')}>Login</button>
          <button type="button" onClick={() => go('signup')}>Register</button>
        </nav>
      </div>

      <div className="footer-bottom">
        <span>&copy; {year} LiveInAus. All rights reserved.</span>
        <span className="footer-bottom-note"><ShieldCheck size={14} /> Contact details stay protected until admin checks are complete.</span>
      </div>
    </footer>
  );
}
