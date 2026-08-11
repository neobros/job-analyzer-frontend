import { useEffect, useRef, useState } from 'react';
import { Briefcase, BriefcaseBusiness, Building2, ChevronDown, Compass, Home, LogIn, LogOut, Menu, Moon, PlusCircle, Rocket, ShieldCheck, Sparkles, Sun, User, UserPlus } from 'lucide-react';
import { VERTICALS } from '../constants/verticals.js';

const ROLE_ICONS = {
  job_seeker: Briefcase,
  employer: Building2,
  freelancer: Rocket,
  admin: ShieldCheck
};

function ExploreMenu({ active, setActivePage, onOpenVertical }) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    function onDocClick(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) setOpen(false);
    }
    function onKeyDown(event) {
      if (event.key === 'Escape') setOpen(false);
    }
    document.addEventListener('mousedown', onDocClick);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('mousedown', onDocClick);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, []);

  function selectJobs() {
    setOpen(false);
    setActivePage('jobs');
  }

  function selectVertical(id) {
    setOpen(false);
    onOpenVertical(id);
  }

  return (
    <div className="nav-dropdown" ref={containerRef}>
      <button className={active ? 'active' : ''} aria-haspopup="true" aria-expanded={open} onClick={() => setOpen((current) => !current)}>
        <Compass size={16} /> Explore <ChevronDown size={14} className={`nav-dropdown-caret ${open ? 'open' : ''}`} />
      </button>
      {open ? (
        <div className="nav-dropdown-menu">
          <button className="nav-dropdown-item" onClick={selectJobs}>
            <BriefcaseBusiness size={16} />
            <span>Jobs & Careers</span>
          </button>
          {VERTICALS.map((vertical) => {
            const Icon = vertical.icon;
            return (
              <button className="nav-dropdown-item" key={vertical.id} onClick={() => selectVertical(vertical.id)}>
                <Icon size={16} />
                <span>{vertical.name}</span>
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}

export default function Navbar({ activePage, setActivePage, currentUser, onLogout, theme = 'light', onToggleTheme, onOpenVertical }) {
  const trailingNavItems = [
    ...(currentUser ? [['profile', 'Profile', User]] : []),
    ...(currentUser?.role === 'employer' || currentUser?.role === 'admin' ? [['employer', 'Post Job', PlusCircle]] : []),
    ...(currentUser?.role === 'admin' ? [['admin', 'Admin', ShieldCheck]] : [])
  ];
  const RoleIcon = currentUser ? ROLE_ICONS[currentUser.role] || User : null;
  const isDark = theme === 'dark';

  return (
    <header className="navbar">
      <button className="brand" onClick={() => setActivePage('home')} aria-label="TopJobs Thejan home">
        <span className="brand-mark"><BriefcaseBusiness size={22} /></span>
        <span>TopJobs Thejan</span>
      </button>
      <nav className="desktop-nav" aria-label="Primary navigation">
        <button className={activePage === 'home' ? 'active' : ''} onClick={() => setActivePage('home')}>
          <Home size={16} /> Home
        </button>
        <button className={activePage === 'jobs' ? 'active' : ''} onClick={() => setActivePage('jobs')}>
          <BriefcaseBusiness size={16} /> Jobs
        </button>
        <button className={activePage === 'freelance' ? 'active' : ''} onClick={() => setActivePage('freelance')}>
          <Sparkles size={16} /> Freelance
        </button>
        <ExploreMenu active={activePage === 'platform' || activePage === 'platformVertical'} setActivePage={setActivePage} onOpenVertical={onOpenVertical} />
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
