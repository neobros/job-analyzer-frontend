import { BriefcaseBusiness, Home, LogIn, LogOut, Menu, Moon, PlusCircle, Rocket, ShieldCheck, Sparkles, Sun, User, UserPlus } from 'lucide-react';
import { VERTICALS } from '../constants/verticals.js';
import liveInAusLogo from '../assets/liveinaus-logo.png';

const ROLE_ICONS = {
  user: User,
  supplier: Rocket,
  admin: ShieldCheck
};

export default function Navbar({ activePage, setActivePage, currentUser, onLogout, theme = 'light', onToggleTheme, onOpenVertical }) {
  const trailingNavItems = [
    ...(currentUser ? [['profile', 'Profile', User]] : []),
    ...(currentUser?.role === 'supplier' || currentUser?.role === 'admin' ? [['employer', 'Post Job', PlusCircle]] : []),
    ...(currentUser?.role === 'admin' ? [['admin', 'Admin', ShieldCheck]] : [])
  ];
  const RoleIcon = currentUser ? ROLE_ICONS[currentUser.role] || User : null;
  const isDark = theme === 'dark';
  const isVerticalActive = activePage === 'platformVertical';

  return (
    <header className="navbar">
      <button className="brand" onClick={() => setActivePage('home')} aria-label="LiveInAus home">
        <img src={liveInAusLogo} alt="LiveInAus" className="brand-logo" />
      </button>
      <nav className="desktop-nav wrap-nav" aria-label="Primary navigation">
        <button className={activePage === 'home' ? 'active' : ''} onClick={() => setActivePage('home')}>
          <Home size={16} /> Home
        </button>
        <button className={activePage === 'jobs' ? 'active' : ''} onClick={() => setActivePage('jobs')}>
          <BriefcaseBusiness size={16} /> Jobs
        </button>
        <button className={activePage === 'freelance' ? 'active' : ''} onClick={() => setActivePage('freelance')}>
          <Sparkles size={16} /> Freelance
        </button>
        {VERTICALS.map((vertical) => {
          const Icon = vertical.icon;
          return (
            <button key={vertical.id} className={isVerticalActive && activePage === vertical.id ? 'active' : ''} onClick={() => onOpenVertical(vertical.id)}>
              <Icon size={13} /> {vertical.name}
            </button>
          );
        })}
        {trailingNavItems.map(([id, label, Icon]) => (
          <button key={id} className={activePage === id ? 'active' : ''} onClick={() => setActivePage(id)}>
            <Icon size={16} /> {label}
          </button>
        ))}
      </nav>
      <div className="nav-actions">
        <button className="icon-button theme-toggle" title={isDark ? 'Switch to white mode' : 'Switch to dark mode'} aria-label={isDark ? 'Switch to white mode' : 'Switch to dark mode'} onClick={onToggleTheme}>
          {isDark ? <Sun size={18} /> : <Moon size={18} />}
        </button>
        {currentUser ? (
          <>
            <button className="ghost-button user-chip" onClick={() => setActivePage(currentUser.role === 'admin' ? 'admin' : 'profile')}>
              <RoleIcon size={16} /> {currentUser.role.replace('_', ' ')}
            </button>
            <button className="ghost-button" onClick={onLogout}><LogOut size={17} /> Logout</button>
          </>
        ) : (
          <>
            <button className="ghost-button" onClick={() => setActivePage('login')}><LogIn size={17} /> Login</button>
            <button className="primary-button" onClick={() => setActivePage('signup')}><UserPlus size={17} /> Register</button>
          </>
        )}
        <button className="icon-button mobile-menu" title="Menu"><Menu size={20} /></button>
      </div>
      <div className="trust-chip"><ShieldCheck size={15} /> Verified-first marketplace</div>
    </header>
  );
}
