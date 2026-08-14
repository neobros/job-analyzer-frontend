import liveInAusLogo from '../assets/liveinaus-logo.png';

export default function Footer() {
  return (
    <footer className="footer">
      <div>
        <img src={liveInAusLogo} alt="LiveInAus" className="brand-logo footer-logo" />
        <p>Global jobs, freelance services, verified profiles, and admin-supported communication.</p>
      </div>
      <div className="footer-grid">
        <span>Jobs</span>
        <span>Freelance</span>
        <span>Employers</span>
        <span>Admin Safety</span>
      </div>
    </footer>
  );
}
