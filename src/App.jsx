import { useEffect, useMemo, useRef, useState } from 'react';
import { Activity, AlertTriangle, ArrowRight, BadgeCheck, BriefcaseBusiness, Calculator, CheckCircle2, ClipboardList, Clock3, Code2, Compass, ExternalLink, Eye, FileUp, Globe2, Handshake, Headphones, ImagePlus, Keyboard, Link, LockKeyhole, Mail, MapPin, Megaphone, MessageSquareMore, Newspaper, Palette, PenLine, Phone, PlusCircle, Search, ShieldCheck, Sparkles, Star, Store, Trash2, UploadCloud, User, UserCheck, Users, Wifi, Wrench, X } from 'lucide-react';
import Navbar from './components/Navbar.jsx';
import ChatWidget from './components/ChatWidget.jsx';
import Footer from './components/Footer.jsx';
import SearchFilter from './components/SearchFilter.jsx';
import JobCard from './components/JobCard.jsx';
import ListingCard from './components/ListingCard.jsx';
import Pagination from './components/Pagination.jsx';
import usePagination from './hooks/usePagination.js';
import AuthForm from './components/AuthForm.jsx';
import AdminLoginForm from './components/AdminLoginForm.jsx';
import CustomSelect from './components/CustomSelect.jsx';
import AdminSidebar from './components/AdminSidebar.jsx';
import AdminDashboard from './components/AdminDashboard.jsx';
import RatingComponent from './components/RatingComponent.jsx';
import { apiRequest, API_BASE_URL } from './api.js';
import { VERTICALS, VERTICAL_DETAIL_FIELDS, findVertical } from './constants/verticals.js';
import heroImage from './assets/hero-ai-marketplace.png';

const RESULTS_PAGE_SIZE = 9;
import marketplaceSlide1 from './assets/marketplace-slide-1.png';
import marketplaceSlide2 from './assets/marketplace-slide-2.jpg';
import marketplaceSlide3 from './assets/marketplace-slide-3.png';
import marketplaceSlide4 from './assets/marketplace-slide-4.jpg';
import driftingLeaves from './assets/drifting-leaves.svg';
import floatingParticles from './assets/floating-particles.svg';
import flowingLines from './assets/flowing-lines.svg';
import logoSweetTamarind from './assets/partners/sweet-tamarind.jpeg';
import logoNirosKitchen from './assets/partners/niros-kitchen.jpeg';
import logoPartnerBowl from './assets/partners/partner-bowl-icon.jpeg';
import logoZeylonTv from './assets/partners/zeylon-tv.jpeg';
import logoMelbourneNilame from './assets/partners/melbourne-nilame.jpeg';
import logoSamsulCreation from './assets/partners/samsul-creation.jpeg';
import logoPixelBooth from './assets/partners/pixel-booth.png';
import logoTenthCarVan from './assets/partners/tenth-car-van-rental.png';
import logoSkillCityRecruitment from './assets/partners/skill-city-recruitment.jpeg';
import logoMelbourneTv from './assets/partners/melbourne-tv.png';
import logoAutoglenDetailing from './assets/partners/autoglen-detailing.png';
import logoStudioAmazingPlus from './assets/partners/studio-amazing-plus.png';
import logoKandyCrown from './assets/partners/kandy-crown.png';
import logoSkillCityFacility from './assets/partners/skill-city-facility-solutions.jpeg';
import logoSkillCitySecurity from './assets/partners/skill-city-security.png';
import logoSkillsyncAustralia from './assets/partners/skillsync-australia.jpeg';

const PARTNER_LOGOS = [
  { src: logoStudioAmazingPlus, name: 'Studio Amazing Plus' },
  { src: logoAutoglenDetailing, name: 'AutoGlen Detailing' },
  { src: logoSkillsyncAustralia, name: 'SkillSync Australia' },
  { src: logoSkillCityFacility, name: 'Skill City Facility Solutions' },
  { src: logoSkillCitySecurity, name: 'Skill City Security Services' },
  { src: logoKandyCrown, name: 'Kandy Crown', dark: true },
  { src: logoTenthCarVan, name: 'Tenth Car & Van Rental' },
  { src: logoSkillCityRecruitment, name: 'Skill City Recruitment' },
  { src: logoMelbourneTv, name: 'Melbourne TV' },
  { src: logoPixelBooth, name: 'Pixel Booth' },
  { src: logoMelbourneNilame, name: 'Melbourne Nilame' },
  { src: logoSamsulCreation, name: 'Samsul Creation' },
  { src: logoZeylonTv, name: 'Zeylon TV' },
  { src: logoSweetTamarind, name: 'Sweet Tamarind' },
  { src: logoNirosKitchen, name: "Niro's Kitchen" },
  { src: logoPartnerBowl, name: 'Partner' }
];

function useMarketplaceData() {
  const [data, setData] = useState({ stats: {}, previousYearHighlights: {}, flow: {}, jobs: [], gigs: [], profiles: [], categories: [], allCategories: [], locations: [], loading: true, error: '' });

  async function loadData() {
    setData((current) => ({ ...current, loading: true, error: '' }));
    try {
      const [home, allCategories] = await Promise.all([apiRequest('/marketplace/home'), apiRequest('/categories')]);
      setData({ ...home, allCategories, loading: false, error: '' });
    } catch (error) {
      setData({ stats: {}, previousYearHighlights: {}, flow: {}, jobs: [], gigs: [], profiles: [], categories: [], allCategories: [], locations: [], loading: false, error: error.message });
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  return { ...data, reload: loadData };
}

function useLocationOptions() {
  const [locations, setLocations] = useState([]);

  useEffect(() => {
    apiRequest('/locations').then(setLocations).catch(() => setLocations([]));
  }, []);

  return locations;
}

function FeedbackNotice({ type = 'success', children }) {
  if (!children) return null;
  return <div className={`auth-message ${type}`}>{children}</div>;
}

function IconOrbit({ children }) {
  return (
    <span className="icon-orbit">
      <svg className="icon-orbit-ring" viewBox="0 0 64 64" aria-hidden="true">
        <circle cx="32" cy="32" r="29" />
      </svg>
      {children}
    </span>
  );
}

const COMMUNITY_AVATAR_COLORS = ['#2f73f2', '#46c4ff', '#0f9d6e', '#f59e0b', '#a855f7', '#ef4444', '#10b981', '#0ea5e9'];

function CommunityGlobe() {
  const avatarCount = COMMUNITY_AVATAR_COLORS.length;
  const center = 190;
  const orbitRadius = 150;
  const globeRadius = 72;

  return (
    <svg className="community-globe" viewBox="0 0 380 380" role="img" aria-label="Illustration of people from many backgrounds connected around a globe">
      <defs>
        <linearGradient id="communityGlobeGradient" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="var(--blue)" />
          <stop offset="100%" stopColor="var(--aqua)" />
        </linearGradient>
      </defs>
      <circle className="community-globe-orbit-ring" cx={center} cy={center} r={orbitRadius} />
      <circle className="community-globe-core" cx={center} cy={center} r={globeRadius} fill="url(#communityGlobeGradient)" />
      <ellipse className="community-globe-meridian" cx={center} cy={center} rx={globeRadius * 0.42} ry={globeRadius} />
      <ellipse className="community-globe-meridian" cx={center} cy={center} rx={globeRadius} ry={globeRadius * 0.42} />
      {Array.from({ length: avatarCount }, (_, index) => {
        const angle = (index / avatarCount) * Math.PI * 2 - Math.PI / 2;
        const x = center + orbitRadius * Math.cos(angle);
        const y = center + orbitRadius * Math.sin(angle);
        const color = COMMUNITY_AVATAR_COLORS[index];
        return (
          <g key={index} className="community-avatar" style={{ '--avatar-delay': `${index * 90}ms` }}>
            <line x1={center} y1={center} x2={x} y2={y} className="community-avatar-spoke" />
            <circle cx={x} cy={y} r="22" fill={color} className="community-avatar-badge" />
            <circle cx={x} cy={y - 6} r="6" fill="#fff" className="community-avatar-glyph" />
            <path d={`M ${x - 9} ${y + 11} a 9 9 0 0 1 18 0 Z`} fill="#fff" className="community-avatar-glyph" />
          </g>
        );
      })}
    </svg>
  );
}

function MarqueeRow({ logos, direction = 'left' }) {
  const track = [...logos, ...logos];
  const dragState = useRef(null);
  const [dragging, setDragging] = useState(false);

  function handleWheel(event) {
    if (Math.abs(event.deltaY) <= Math.abs(event.deltaX)) return;
    event.currentTarget.scrollLeft += event.deltaY;
    event.preventDefault();
  }

  function handleMouseDown(event) {
    dragState.current = { startX: event.pageX, startScroll: event.currentTarget.scrollLeft };
    setDragging(true);
  }

  function handleMouseMove(event) {
    if (!dragState.current) return;
    event.currentTarget.scrollLeft = dragState.current.startScroll - (event.pageX - dragState.current.startX);
  }

  function stopDragging() {
    dragState.current = null;
    setDragging(false);
  }

  return (
    <div
      className={`marquee-row ${dragging ? 'dragging' : ''}`}
      onWheel={handleWheel}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={stopDragging}
      onMouseLeave={stopDragging}
    >
      <div className={`marquee-track marquee-${direction}`}>
        {track.map((logo, index) => (
          <div className={`marquee-logo ${logo.dark ? 'marquee-logo-dark' : ''}`} key={`${logo.name}-${index}`}>
            <img src={logo.src} alt={logo.name} draggable="false" />
          </div>
        ))}
      </div>
    </div>
  );
}

function PartnerMarquee({ logos }) {
  const half = Math.ceil(logos.length / 2);
  const rowOne = logos.slice(0, half);
  const rowTwo = logos.slice(half);
  return (
    <div className="marquee-stack">
      <MarqueeRow logos={rowOne} direction="left" />
      <MarqueeRow logos={rowTwo} direction="right" />
    </div>
  );
}

function ScrollPlayVideo({ src }) {
  const videoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          video.muted = false;
          video.play().catch(() => {
            // Most browsers block autoplay with sound until the visitor has
            // interacted with the site; fall back to a muted autoplay so the
            // video still starts instead of sitting frozen on scroll.
            video.muted = true;
            video.play().catch(() => {});
          });
        } else {
          video.pause();
        }
      },
      { threshold: 0.4 }
    );

    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  return <video ref={videoRef} className="news-demo-video" src={src} playsInline controls preload="metadata" />;
}

function useScrollReveal(activePage) {
  useEffect(() => {
    const targets = document.querySelectorAll([
      '.hero',
      '.search-filter',
      '.website-intro',
      '.home-insights',
      '.marketplace-feature-band',
      '.previous-highlight-section',
      '.section',
      '.split-section',
      '.marketplace-flow',
      '.page',
      '.auth-shell'
    ].join(','));

    targets.forEach((target, index) => {
      target.classList.add('scroll-reveal');
      target.style.setProperty('--reveal-delay', `${Math.min(index * 70, 360)}ms`);
    });

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -12% 0px', threshold: 0.14 });

    targets.forEach((target) => observer.observe(target));
    return () => observer.disconnect();
  }, [activePage]);
}

function GigCard({ gig, onOpen }) {
  const hasPriorityBadge = Boolean(gig.hasPriorityBadge || gig.seller?.hasPriorityBadge);
  const clickable = Boolean(onOpen);
  const priceLabel = Number(gig.price) ? `$${Number(gig.price).toLocaleString()}` : 'Custom';

  function openDetails() {
    onOpen?.(gig);
  }

  function handleKeyDown(event) {
    if (!clickable) return;
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      openDetails();
    }
  }

  return (
    <article
      className={`gig-card ${hasPriorityBadge ? 'priority-card' : ''} ${clickable ? 'gig-card-clickable' : ''}`}
      onClick={clickable ? openDetails : undefined}
      onKeyDown={handleKeyDown}
      tabIndex={clickable ? 0 : undefined}
      aria-label={clickable ? `Open details for ${gig.title}` : undefined}
    >
      {hasPriorityBadge ? <span className="priority-badge"><BadgeCheck size={14} /> Priority seller</span> : null}
      <div className="gig-image">
        {gig.portfolioImages?.[0] ? <img src={resolveUploadUrl(gig.portfolioImages[0])} alt="" /> : <FileUp size={26} />}
      </div>
      <span>{gig.category || 'Service'}</span>
      <h3>{gig.title}</h3>
      <RatingComponent value={gig.ratingAverage || gig.rating || 0} count={gig.ratingCount} />
      <div className="gig-bottom">
        <p>From <strong>{priceLabel}</strong></p>
        <p>{gig.deliveryTime || gig.delivery || 'Delivery agreed with admin'}</p>
      </div>
    </article>
  );
}

function FlowDetailCard({ number, title, description, items }) {
  const total = items.reduce((sum, item) => sum + Number(item.value || 0), 0);

  return (
    <article className="management-card flow-detail-card">
      <div className="flow-card-head">
        <span>{number}</span>
        <div>
          <h3>{title}</h3>
          <p>{description}</p>
        </div>
      </div>
      <div className="flow-live-list">
        {items.map((item) => (
          <div className="flow-live-row" key={item.label}>
            <div>
              <strong>{item.value || 0}</strong>
              <span>{item.label}</span>
            </div>
            <meter min="0" max={Math.max(total, 1)} value={item.value || 0} />
          </div>
        ))}
      </div>
    </article>
  );
}

function Home({ setActivePage, marketplace, onOpenVertical, currentUser }) {
  const benefitCards = [
    {
      icon: ShieldCheck,
      title: 'Safer first contact',
      text: 'Contact details stay private while profiles, job posts, gigs, and requests are checked.'
    },
    {
      icon: Star,
      title: 'Build trusted ratings',
      text: 'Completed work can receive ratings and written feedback, helping serious workers stand out.'
    },
    {
      icon: LockKeyhole,
      title: 'Verified account flow',
      text: 'Email OTP verification is required before users can post jobs, apply, or sell services.'
    },
    {
      icon: Users,
      title: 'One global marketplace',
      text: 'Job seekers, employers, freelancers, and service buyers can all work from one account.'
    }
  ];

  return (
    <>
      <section className="hero">
        <div className="hero-media" aria-hidden="true">
          <img src={heroImage} alt="" />
          <video src="/videos/hero-marketplace.mp4" autoPlay loop muted playsInline />
        </div>
        <div className="hero-content">
          <span className="eyebrow"><Sparkles size={16} /> AI powered global marketplace</span>
          <h1>Find trusted jobs, talent, and freelance services worldwide.</h1>
          <p>Search verified jobs, hire skilled workers, sell freelance services, and keep contact sharing protected until checks are complete.</p>
          <div className="hero-actions">
            <button className="primary-button" onClick={() => setActivePage('signup')}>Register <ArrowRight size={17} /></button>
            <button className="ghost-on-image" onClick={() => setActivePage('jobs')}>Search Jobs</button>
            <button className="ghost-on-image" onClick={() => setActivePage('employer')}>Post Job</button>
          </div>
        </div>
      </section>
      <SearchFilter />
      <section className="section home-categories">
        <div className="section-heading">
          <div>
            <span className="eyebrow"><Compass size={16} /> Everything for new arrivals</span>
            <h2>Browse every category in one platform</h2>
            <p>From your first night to your first year, find verified listings and services across jobs, housing, migration, finance, and more.</p>
          </div>
        </div>
        <div className="platform-grid home-platform-grid">
          <button type="button" className="platform-tile" onClick={() => setActivePage('jobs')}>
            <span className="platform-tile-icon"><BriefcaseBusiness size={22} /></span>
            <strong>Jobs & Careers</strong>
            <p>Search verified vacancies, apply safely, and track your applications.</p>
          </button>
          {VERTICALS.map((vertical) => {
            const Icon = vertical.icon;
            return (
              <button type="button" key={vertical.id} className="platform-tile" onClick={() => onOpenVertical(vertical.id)}>
                <span className="platform-tile-icon"><Icon size={22} /></span>
                <strong>{vertical.name}</strong>
                <p>{vertical.tagline}</p>
              </button>
            );
          })}
        </div>
      </section>
      <section className="section community-section">
        <div className="community-copy">
          <span className="eyebrow"><Users size={16} /> A platform for everyone arriving somewhere new</span>
          <h2>Built for people from every background</h2>
          <p>
            Wherever you are coming from, LiveInAus is designed to welcome you. Verified listings, protected
            communication, and moderation that treats every community on the platform with the same respect.
          </p>
        </div>
        <CommunityGlobe />
      </section>
      <section className="section partners-section">
        <div className="section-heading">
          <div>
            <span className="eyebrow"><Handshake size={16} /> Trusted local partners</span>
            <h2>Businesses our community already trusts</h2>
            <p>Local partners across Melbourne and beyond who work with LiveInAus members.</p>
          </div>
        </div>
        <PartnerMarquee logos={PARTNER_LOGOS} />
      </section>
      <section className="section news-video-section">
        <div className="section-heading">
          <div>
            <span className="eyebrow"><Newspaper size={16} /> Media & News</span>
            <h2>See LiveInAus news and community stories in action</h2>
            <p>A quick look at how members stay updated with local news, classifieds, and community stories.</p>
          </div>
        </div>
        <ScrollPlayVideo src="/videos/news-demo.mp4" />
      </section>
      <section className="website-intro">
        <div>
          <span className="eyebrow">About LiveInAus</span>
          <h2>A trusted worldwide marketplace for jobs, talent, and freelance services</h2>
          <p>
            LiveInAus gives job seekers, employers, freelancers, and service buyers one clear place to work.
            Create a verified profile, search real opportunities, post vacancies, sell services, upload CVs, and build
            ratings while private contact details stay protected.
          </p>
        </div>
        <div className="intro-flow-panel" aria-label="LiveInAus verified work flow">
          {[
            [UserCheck, 'Verified profile', 'Create account and confirm email OTP'],
            [FileUp, 'CV and skills', 'Show experience, portfolio, and location'],
            [BriefcaseBusiness, 'Jobs and services', 'Apply, post vacancies, or sell gigs'],
            [ShieldCheck, 'Protected contact', 'Details stay private until checks complete']
          ].map(([Icon, title, text], index) => (
            <article className="intro-flow-card" style={{ '--flow-delay': `${index * 140}ms` }} key={title}>
              <IconOrbit><Icon size={20} /></IconOrbit>
              <div>
                <strong>{title}</strong>
                <span>{text}</span>
              </div>
            </article>
          ))}
        </div>
      </section>
      <section className="section home-insights">
        <div className="section-heading">
          <div>
            <span className="eyebrow">Why choose us</span>
            <h2>Designed to make online hiring safer, clearer, and faster</h2>
            <p>Users get the confidence of verification, useful profile details, CV uploads, application tracking, service listings, ratings, and protected communication.</p>
          </div>
        </div>
        <div className="benefit-grid">
          {benefitCards.map(({ icon: Icon, title, text }) => (
            <article className="benefit-card" key={title}>
              <IconOrbit><Icon size={21} /></IconOrbit>
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </section>
      <section className="marketplace-feature-band">
        <div className="marketplace-collage" aria-hidden="true">
          {[marketplaceSlide1, marketplaceSlide2, marketplaceSlide3, marketplaceSlide4].map((image, index) => (
            <div className="collage-frame" key={image}>
              <img src={image} alt="" />
              <span>{index + 1}</span>
            </div>
          ))}
        </div>
        <div className="marketplace-feature-copy">
          <span className="eyebrow">Our solution</span>
          <h2>Everything a serious job marketplace needs in one professional platform</h2>
          <p>LiveInAus helps users understand who they are working with before contact details are shared. Employers can find applicants, job seekers can apply with CVs, freelancers can publish services, and every side can earn feedback after completed work.</p>
          <div className="solution-detail-grid">
            <div><CheckCircle2 size={20} /><span>Verified signup with email OTP</span></div>
            <div><CheckCircle2 size={20} /><span>CV, skills, experience, and profile details</span></div>
            <div><CheckCircle2 size={20} /><span>Worldwide jobs, remote work, part-time jobs, and freelance gigs</span></div>
            <div><CheckCircle2 size={20} /><span>Ratings and feedback to support trusted decisions</span></div>
          </div>
          <button className="primary-button" onClick={() => setActivePage('jobs')}>Explore live jobs <ArrowRight size={17} /></button>
        </div>
      </section>
      <section className="section marketplace-flow">
        <div className="section-heading">
          <div>
            <span className="eyebrow">How LiveInAus works</span>
            <h2>Built for job seekers, employers, and freelancers</h2>
            <p>Create a verified profile, post jobs or services, apply safely, and track work status without exposing private contact details first.</p>
          </div>
        </div>
        <div className="flow-detail-grid">
          {[
            {
              number: '1',
              title: 'Job seekers',
              text: 'Register, verify email, complete your profile, upload CV, search jobs, apply, and follow application status.',
              action: 'Search Jobs',
              page: 'jobs'
            },
            {
              number: '2',
              title: 'Employers',
              text: 'Create a company profile, post vacancies, add salary/location/requirements, and manage applications after review.',
              action: 'Post Job',
              page: 'employer'
            },
            {
              number: '3',
              title: 'Freelancers',
              text: 'Create service gigs with category, price, delivery time, portfolio, ratings, and protected service requests.',
              action: 'Sell Services',
              page: 'freelance'
            },
            {
              number: '4',
              title: 'Protected contact',
              text: 'Direct first chat is hidden. Contact details are checked before sharing so applicants and posters stay protected.',
              action: 'Create Account',
              page: 'signup'
            }
          ].map((item) => (
            <article className="management-card flow-detail-card public-flow-card" key={item.number}>
              <div className="flow-card-head">
                <span>{item.number}</span>
                <div>
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </div>
              </div>
              <button className="ghost-button" onClick={() => setActivePage(item.page)}>{item.action} <ArrowRight size={16} /></button>
            </article>
          ))}
        </div>
        <div className="flow-user-summary">
          <ShieldCheck size={22} />
          <span>Email verification is required before posting or applying. Contact details stay hidden from the public marketplace.</span>
        </div>
      </section>
      <ReviewsSection currentUser={currentUser} setActivePage={setActivePage} />
      <ChatWidget />
    </>
  );
}

function ReviewsSection({ currentUser, setActivePage }) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const [rating, setRating] = useState(5);
  const [feedback, setFeedback] = useState('');
  const [notice, setNotice] = useState('');
  const [error, setError] = useState('');
  const [posting, setPosting] = useState(false);

  async function loadReviews() {
    setLoading(true);
    try {
      setReviews(await apiRequest('/reviews'));
    } catch {
      setReviews([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadReviews();
  }, []);

  useEffect(() => {
    setActiveIndex(0);
  }, [reviews.length]);

  useEffect(() => {
    if (reviews.length < 2) return;
    const timer = setInterval(() => {
      setActiveIndex((current) => (current + 1) % reviews.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [reviews.length]);

  function goTo(index) {
    setActiveIndex(index);
  }

  function goPrev() {
    setActiveIndex((current) => (current - 1 + reviews.length) % reviews.length);
  }

  function goNext() {
    setActiveIndex((current) => (current + 1) % reviews.length);
  }

  async function submitReview() {
    if (!currentUser) {
      setError('Please login before writing a review.');
      setActivePage('login');
      return;
    }

    if (!currentUser.isEmailVerified) {
      setError('Email verification is required before writing a review.');
      setActivePage('profile');
      return;
    }

    if (!feedback.trim()) {
      setError('Please write a few words about your experience.');
      return;
    }

    setNotice('');
    setError('');
    setPosting(true);
    try {
      await apiRequest('/reviews', { method: 'POST', body: JSON.stringify({ rating, feedback }) });
      setNotice('Thanks! Your review is submitted and will appear here once approved by an admin.');
      setFeedback('');
      setRating(5);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setPosting(false);
    }
  }

  const active = reviews[activeIndex];

  return (
    <section className="section reviews-section">
      <div className="section-heading">
        <div>
          <span className="eyebrow"><MessageSquareMore size={16} /> Community reviews</span>
          <h2>What LiveInAus members are saying</h2>
          <p>Real feedback from job seekers, employers, and freelancers who use the platform.</p>
        </div>
      </div>
      <div className="reviews-layout">
        <div className="reviews-slider">
          {loading ? (
            <div className="admin-loading"><Clock3 className="spin" size={22} /> Loading reviews...</div>
          ) : active ? (
            <>
              <div className="review-slide-card" key={active._id}>
                <RatingComponent value={active.rating} />
                <p className="review-slide-text">&ldquo;{active.feedback}&rdquo;</p>
                <span className="review-slide-author">{active.reviewer?.email || 'LiveInAus member'}</span>
              </div>
              {reviews.length > 1 ? (
                <div className="review-slide-controls">
                  <button type="button" className="icon-button" onClick={goPrev} aria-label="Previous review"><ArrowRight className="flip-x" size={16} /></button>
                  <div className="review-slide-dots">
                    {reviews.map((review, index) => (
                      <button
                        type="button"
                        key={review._id}
                        className={`review-slide-dot ${index === activeIndex ? 'active' : ''}`}
                        onClick={() => goTo(index)}
                        aria-label={`Show review ${index + 1}`}
                      />
                    ))}
                  </div>
                  <button type="button" className="icon-button" onClick={goNext} aria-label="Next review"><ArrowRight size={16} /></button>
                </div>
              ) : null}
            </>
          ) : (
            <EmptyHomeState text="No reviews yet. Be the first to share your experience." />
          )}
        </div>
        <div className="form-shell review-form-shell">
          <h3>Write a review</h3>
          <FeedbackNotice>{notice}</FeedbackNotice>
          <FeedbackNotice type="error">{error}</FeedbackNotice>
          {currentUser && currentUser.isEmailVerified ? (
            <>
              <RatingComponent value={rating} interactive onChange={setRating} />
              <textarea placeholder="Share your experience with LiveInAus..." value={feedback} onChange={(event) => setFeedback(event.target.value)} />
              <button className="primary-button" disabled={posting} onClick={submitReview}>{posting ? 'Submitting...' : 'Submit Review'}</button>
            </>
          ) : (
            <div className="auth-inline-card">
              <ShieldCheck size={24} />
              <p>{currentUser ? 'Verify your email to write a review.' : 'Login to write a review. Everyone can read approved reviews.'}</p>
              <button className="primary-button" onClick={() => setActivePage(currentUser ? 'profile' : 'login')}>{currentUser ? 'Verify Email' : 'Login'}</button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function EmptyHomeState({ text }) {
  return <div className="admin-empty home-empty"><ShieldCheck size={22} /><p>{text}</p></div>;
}

const JOB_CATEGORY_ICONS = [
  ['it', Code2],
  ['marketing', Megaphone],
  ['design', Palette],
  ['writing', PenLine],
  ['data entry', Keyboard],
  ['engineering', Wrench],
  ['accounting', Calculator],
  ['sales', Handshake],
  ['customer support', Headphones],
  ['remote', Wifi],
  ['part time', Clock3],
  ['freelance', Store]
];

function getJobCategoryIcon(name = '') {
  const normalized = name.toLowerCase();
  return JOB_CATEGORY_ICONS.find(([key]) => normalized.includes(key))?.[1] || BriefcaseBusiness;
}

function JobCategoryIconCard({ category, active, index, onClick, countLabel = 'live jobs' }) {
  const Icon = category.icon || getJobCategoryIcon(category.name);

  return (
    <button
      type="button"
      className={`job-category-icon-card color-${index % 8} ${active ? 'active' : ''}`}
      onClick={onClick}
    >
      <span className="job-category-icon"><Icon size={24} /></span>
      <strong>{category.name}</strong>
      <small>{category.count || 0} {countLabel}</small>
    </button>
  );
}

function AuthRequired({ currentUser, setActivePage, roles, children }) {
  if (!currentUser) {
    return (
      <section className="auth-required-panel">
        <ShieldCheck size={34} />
        <h1>Login required</h1>
        <p>Please login or register before using this workspace.</p>
        <div className="hero-actions">
          <button className="primary-button" onClick={() => setActivePage('login')}>Login</button>
          <button className="ghost-button" onClick={() => setActivePage('signup')}>Register</button>
        </div>
      </section>
    );
  }

  if (!currentUser.isEmailVerified) {
    return (
      <section className="auth-required-panel">
        <ShieldCheck size={34} />
        <h1>Email verification required</h1>
        <p>Verify your email with OTP before posting jobs, applying, or selling services.</p>
        <button className="primary-button" onClick={() => setActivePage('login')}>Verify OTP</button>
      </section>
    );
  }

  if (roles?.length && !roles.includes(currentUser.role)) {
    return (
      <section className="auth-required-panel">
        <AlertTriangle size={34} />
        <h1>Wrong account type</h1>
        <p>This area is for {roles.map((role) => role.replace('_', ' ')).join(' or ')} accounts.</p>
        <button className="primary-button" onClick={() => setActivePage('home')}>Back Home</button>
      </section>
    );
  }

  return children;
}

function JobsPage({ marketplace, currentUser, setActivePage, onOpenJob, appliedJobIds = new Set(), onJobApplied }) {
  const categoryScrollerRef = useRef(null);
  const [workingId, setWorkingId] = useState('');
  const [filters, setFilters] = useState({ keyword: '', category: '', country: '', city: '' });
  const [notice, setNotice] = useState('');
  const [error, setError] = useState('');
  const jobs = marketplace.jobs;
  const selectedCategory = filters.category;
  const jobCategories = useMemo(() => {
    const apiCategories = marketplace.allCategories?.length ? marketplace.allCategories : marketplace.categories;
    const categoryNames = apiCategories?.length
      ? apiCategories.map((category) => category.name).filter(Boolean)
      : [...new Set(jobs.map((job) => job.category).filter(Boolean))];

    return categoryNames.map((name) => ({
      name,
      count: jobs.filter((job) => job.category === name).length
    }));
  }, [jobs, marketplace.allCategories, marketplace.categories]);
  const visibleJobs = useMemo(() => {
    const keyword = filters.keyword.trim().toLowerCase();

    return jobs.filter((job) => {
      const searchableText = [
        job.title,
        job.company,
        job.employer?.email,
        job.category,
        job.description,
        job.requirements,
        ...(job.skills || [])
      ].filter(Boolean).join(' ').toLowerCase();

      const matchesKeyword = !keyword || searchableText.includes(keyword);
      const matchesCategory = !filters.category || job.category === filters.category;
      const matchesCountry = !filters.country || job.country === filters.country;
      const matchesCity = !filters.city || job.city === filters.city;

      return matchesKeyword && matchesCategory && matchesCountry && matchesCity;
    });
  }, [jobs, filters]);
  const pagination = usePagination(visibleJobs, RESULTS_PAGE_SIZE);
  const { setPage } = pagination;

  useEffect(() => {
    setPage(1);
  }, [filters.keyword, filters.category, filters.country, filters.city, setPage]);

  function updateCategory(category) {
    setFilters((current) => ({ ...current, category }));
  }

  function clearFilters() {
    setFilters({ keyword: '', category: '', country: '', city: '' });
  }

  function scrollCategories() {
    categoryScrollerRef.current?.scrollBy({ left: 420, behavior: 'smooth' });
  }

  const activeFilterLabels = [
    filters.keyword ? `Keyword: ${filters.keyword}` : '',
    filters.category ? `Category: ${filters.category}` : '',
    filters.country ? `Country: ${filters.country}` : '',
    filters.city ? `City: ${filters.city}` : ''
  ].filter(Boolean);

  async function applyForJob(job) {
    const jobId = String(job._id || '');
    if (jobId && appliedJobIds.has(jobId)) {
      setNotice('You already applied for this job.');
      return;
    }

    if (!currentUser) {
      setError('Please login or register before applying for jobs.');
      setActivePage('login');
      return;
    }

    if (!currentUser.isEmailVerified) {
      setError('Email verification is required before applying.');
      setActivePage('login');
      return;
    }

    setWorkingId(job._id || job.title);
    setNotice('');
    setError('');
    try {
      await apiRequest(`/applications/${job._id}/apply`, {
        method: 'POST',
        body: JSON.stringify({ coverLetter: 'Please review my verified profile through admin contact checking.' })
      });
      onJobApplied?.(job._id);
      setNotice('Application submitted. Contact sharing stays protected while the request is checked.');
    } catch (requestError) {
      if (/already applied/i.test(requestError.message)) {
        onJobApplied?.(job._id);
        setNotice('You already applied for this job.');
      } else {
        setError(requestError.message);
      }
    } finally {
      setWorkingId('');
    }
  }

  return (
    <section className="page">
      <div className="page-heading">
        <span className="eyebrow"><BriefcaseBusiness size={16} /> Job seeker workspace</span>
        <h1>Search and track verified opportunities</h1>
        <p>Filter roles by category, city, country, and skills. Applications stay status-based while contact sharing is checked.</p>
      </div>
      <section className="jobs-category-panel">
        <div className="jobs-category-heading">
          <div>
            <p>{selectedCategory ? `Latest jobs in ${selectedCategory}.` : 'Latest jobs by category.'}</p>
          </div>
          {selectedCategory ? <button className="link-button" onClick={() => updateCategory('')}>Show all</button> : null}
        </div>
        <div className="jobs-category-carousel">
          <div className="jobs-category-icon-grid" ref={categoryScrollerRef}>
            <JobCategoryIconCard
              category={{ name: 'All jobs', count: jobs.length, icon: BriefcaseBusiness }}
              active={!selectedCategory}
              index={0}
              onClick={() => updateCategory('')}
            />
            {jobCategories.map((category, index) => (
              <JobCategoryIconCard
                key={category.name}
                category={category}
                active={selectedCategory === category.name}
                index={index + 1}
                onClick={() => updateCategory(category.name)}
              />
            ))}
          </div>
          <button className="category-next-button" type="button" aria-label="More categories" onClick={scrollCategories}><ArrowRight size={20} /></button>
        </div>
      </section>
      <div className="jobs-browser-main">
        <SearchFilter compact filters={filters} onFiltersChange={setFilters} />
        {activeFilterLabels.length ? (
          <div className="active-job-filters">
            <span>{visibleJobs.length} matching {visibleJobs.length === 1 ? 'job' : 'jobs'}</span>
            {activeFilterLabels.map((label) => <em key={label}>{label}</em>)}
            <button className="link-button" onClick={clearFilters}>Clear filters</button>
          </div>
        ) : null}
        <FeedbackNotice>{notice}</FeedbackNotice>
        <FeedbackNotice type="error">{error}</FeedbackNotice>
        <div className="jobs-results-list">
          {visibleJobs.length ? pagination.pageItems.map((job) => <JobCard key={job._id || job.title} job={job} onOpen={job._id ? onOpenJob : undefined} onApply={job._id ? applyForJob : undefined} applying={workingId === (job._id || job.title)} hasApplied={appliedJobIds.has(String(job._id || ''))} />) : <EmptyHomeState text={selectedCategory ? `No live jobs in ${selectedCategory} yet. Try another category or check again soon.` : 'No live jobs are available yet. Verified employer posts will appear here soon.'} />}
        </div>
        <Pagination {...pagination} onChange={pagination.setPage} />
      </div>
    </section>
  );
}

function JobDetailPage({ jobId, marketplace, currentUser, setActivePage, onBack, appliedJobIds = new Set(), onJobApplied }) {
  const initialJob = useMemo(
    () => marketplace.jobs.find((item) => String(item._id) === String(jobId)),
    [jobId, marketplace.jobs]
  );
  const [job, setJob] = useState(initialJob || null);
  const [loading, setLoading] = useState(!initialJob);
  const [applying, setApplying] = useState(false);
  const [notice, setNotice] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!jobId) return;
    let cancelled = false;
    setJob(initialJob || null);
    setLoading(true);
    setError('');

    apiRequest(`/jobs/${jobId}`)
      .then((data) => {
        if (!cancelled) setJob(data);
      })
      .catch((requestError) => {
        if (!cancelled && !initialJob) setError(requestError.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [jobId, initialJob]);

  async function applyForJob() {
    if (!job) return;
    if (appliedJobIds.has(String(job._id || ''))) {
      setNotice('You already applied for this job.');
      return;
    }

    if (!currentUser) {
      setError('Please login or register before applying for jobs.');
      setActivePage('login');
      return;
    }

    if (!currentUser.isEmailVerified) {
      setError('Email verification is required before applying.');
      setActivePage('login');
      return;
    }

    setApplying(true);
    setNotice('');
    setError('');
    try {
      await apiRequest(`/applications/${job._id}/apply`, {
        method: 'POST',
        body: JSON.stringify({ coverLetter: 'Please review my verified profile through admin contact checking.' })
      });
      onJobApplied?.(job._id);
      setNotice('Application submitted. Admin contact checking stays protected.');
    } catch (requestError) {
      if (/already applied/i.test(requestError.message)) {
        onJobApplied?.(job._id);
        setNotice('You already applied for this job.');
      } else {
        setError(requestError.message);
      }
    } finally {
      setApplying(false);
    }
  }

  if (loading && !job) {
    return (
      <section className="page job-detail-page">
        <div className="admin-loading"><Clock3 className="spin" size={24} /> Loading job details...</div>
      </section>
    );
  }

  if (!job) {
    return (
      <section className="page job-detail-page">
        <button className="ghost-button" onClick={onBack}><ArrowRight className="flip-x" size={16} /> Back to Jobs</button>
        <EmptyHomeState text={error || 'This job is not available anymore.'} />
      </section>
    );
  }

  const company = job.company || job.employer?.email || 'Verified employer';
  const skills = job.skills?.length ? job.skills : [job.category].filter(Boolean);
  const typeLabel = (job.type || 'full_time').replace(/_/g, ' ').replace(/\b\w/g, (letter) => letter.toUpperCase());
  const location = [job.city, job.country].filter(Boolean).join(', ') || 'Worldwide';
  const postedDate = job.createdAt ? new Date(job.createdAt) : new Date();
  const postedLabel = postedDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  const hasPriorityBadge = Boolean(job.hasPriorityBadge || job.employer?.hasPriorityBadge);
  const hasApplied = appliedJobIds.has(String(job._id || ''));
  const companyInitials = company
    .split(/[@\s.-]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('') || 'TJ';

  return (
    <section className="page job-detail-page">
      <button className="ghost-button job-detail-back" onClick={onBack}><ArrowRight className="flip-x" size={16} /> Back to Jobs</button>

      <div className={`job-detail-hero ${hasPriorityBadge ? 'priority-card' : ''}`}>
        <div className="job-detail-main">
          <div className="job-status-line">
            <span className="status-pill">{job.status === 'approved' ? 'Live' : job.status}</span>
            {hasPriorityBadge ? <span className="priority-badge"><BadgeCheck size={14} /> Priority employer</span> : null}
          </div>
          <h1>{job.title}</h1>
          <p>{company}</p>
          <div className="job-detail-row">
            <span><BriefcaseBusiness size={16} /> {typeLabel}</span>
            <span><MapPin size={16} /> {location}</span>
            <span><Clock3 size={16} /> Posted {postedLabel}</span>
          </div>
        </div>
        <div className="job-detail-company-card">
          <div className="job-logo-box large"><strong>{companyInitials}</strong><small>{company.split('@')[0]}</small></div>
          <strong>{company}</strong>
          <span><ShieldCheck size={15} /> Contact protected by admin</span>
        </div>
      </div>

      <FeedbackNotice>{notice}</FeedbackNotice>
      <FeedbackNotice type="error">{error}</FeedbackNotice>

      <div className="job-detail-grid">
        <article className="job-detail-panel wide">
          <h2>Job description</h2>
          <p>{job.description || 'The employer has not added a full description yet.'}</p>
        </article>
        <article className="job-detail-panel">
          <h2>Job summary</h2>
          <div className="job-detail-facts">
            <span><strong>Category</strong>{job.category || 'Not specified'}</span>
            <span><strong>Salary</strong>{job.salary || 'Negotiable'}</span>
            <span><strong>Work type</strong>{typeLabel}</span>
            <span><strong>Location</strong>{location}</span>
          </div>
        </article>
        <article className="job-detail-panel wide">
          <h2>Requirements</h2>
          <p>{job.requirements || 'Requirements will be confirmed during admin-supported screening.'}</p>
        </article>
        <article className="job-detail-panel">
          <h2>Skills</h2>
          <div className="job-detail-skills">
            {skills.length ? skills.map((skill) => <span key={skill}>{skill}</span>) : <span>General</span>}
          </div>
        </article>
        <article className="job-detail-panel job-detail-apply-panel">
          <h2>Apply safely</h2>
          <p>{hasApplied ? 'You already applied for this job. Track the status from your profile applications area.' : 'Your application is sent to the platform first. Direct contact details stay hidden until admin checks are complete.'}</p>
          <button className={`primary-button ${hasApplied ? 'applied-button' : ''}`} onClick={applyForJob} disabled={applying || hasApplied}>
            {hasApplied ? 'Applied' : applying ? 'Applying...' : 'Apply for this job'} {hasApplied ? <CheckCircle2 size={17} /> : <ArrowRight size={17} />}
          </button>
        </article>
      </div>
    </section>
  );
}

function GigDetailPage({ gigId, marketplace, currentUser, setActivePage, onBack }) {
  const initialGig = useMemo(
    () => marketplace.gigs.find((item) => String(item._id) === String(gigId)),
    [gigId, marketplace.gigs]
  );
  const [gig, setGig] = useState(initialGig || null);
  const [loading, setLoading] = useState(!initialGig);
  const [requesting, setRequesting] = useState(false);
  const [notice, setNotice] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!gigId) return;
    let cancelled = false;
    setGig(initialGig || null);
    setLoading(true);
    setError('');

    apiRequest(`/gigs/${gigId}`)
      .then((data) => {
        if (!cancelled) setGig(data);
      })
      .catch((requestError) => {
        if (!cancelled && !initialGig) setError(requestError.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [gigId, initialGig]);

  async function requestContactCheck() {
    if (!gig) return;

    if (!currentUser) {
      setError('Please login or register before requesting a service.');
      setActivePage('login');
      return;
    }

    if (!currentUser.isEmailVerified) {
      setError('Email verification is required before requesting a service.');
      setActivePage('login');
      return;
    }

    setRequesting(true);
    setNotice('');
    setError('');
    try {
      const response = await apiRequest(`/gigs/${gig._id}/contact-request`, {
        method: 'POST',
        body: JSON.stringify({})
      });
      setNotice(response.message || 'Service request sent to admin for contact checking.');
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setRequesting(false);
    }
  }

  if (loading && !gig) {
    return (
      <section className="page gig-detail-page">
        <div className="admin-loading"><Clock3 className="spin" size={24} /> Loading service details...</div>
      </section>
    );
  }

  if (!gig) {
    return (
      <section className="page gig-detail-page">
        <button className="ghost-button" onClick={onBack}><ArrowRight className="flip-x" size={16} /> Back to Freelance</button>
        <EmptyHomeState text={error || 'This service is not available anymore.'} />
      </section>
    );
  }

  const seller = gig.seller?.email || 'Verified freelancer';
  const portfolioImages = gig.portfolioImages || [];
  const hasPriorityBadge = Boolean(gig.hasPriorityBadge || gig.seller?.hasPriorityBadge);
  const priceLabel = Number(gig.price) ? `$${Number(gig.price).toLocaleString()}` : 'Custom quote';
  const sellerInitials = seller
    .split(/[@\s.-]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('') || 'TJ';

  return (
    <section className="page gig-detail-page">
      <button className="ghost-button job-detail-back" onClick={onBack}><ArrowRight className="flip-x" size={16} /> Back to Freelance</button>

      <div className={`gig-detail-hero ${hasPriorityBadge ? 'priority-card' : ''}`}>
        <div className="gig-detail-main">
          <div className="job-status-line">
            <span className="status-pill">{gig.status === 'approved' ? 'Live service' : gig.status}</span>
            {hasPriorityBadge ? <span className="priority-badge"><BadgeCheck size={14} /> Priority seller</span> : null}
          </div>
          <h1>{gig.title}</h1>
          <p>{seller}</p>
          <div className="job-detail-row">
            <span><Store size={16} /> {gig.category || 'Freelance service'}</span>
            <span><Calculator size={16} /> From {priceLabel}</span>
            <span><Clock3 size={16} /> {gig.deliveryTime || 'Delivery confirmed by admin'}</span>
          </div>
        </div>
        <div className="gig-detail-price-card">
          <span>Starting at</span>
          <strong>{priceLabel}</strong>
          <p>{gig.deliveryTime || 'Delivery timeline confirmed after review'}</p>
          <button className="primary-button" onClick={requestContactCheck} disabled={requesting}>
            {requesting ? 'Sending request...' : 'Request admin contact check'} <MessageSquareMore size={17} />
          </button>
        </div>
      </div>

      <FeedbackNotice>{notice}</FeedbackNotice>
      <FeedbackNotice type="error">{error}</FeedbackNotice>

      <div className="gig-detail-grid">
        <article className="gig-detail-panel wide">
          <h2>Service description</h2>
          <p>{gig.description || 'The freelancer has not added a full description yet.'}</p>
        </article>

        <article className="gig-detail-panel seller-panel">
          <h2>Seller</h2>
          <div className="job-logo-box large"><strong>{sellerInitials}</strong><small>{seller.split('@')[0]}</small></div>
          <strong>{seller}</strong>
          <RatingComponent value={gig.ratingAverage || 0} count={gig.ratingCount} />
          <span><ShieldCheck size={15} /> Private contact hidden until admin review</span>
        </article>

        <article className="gig-detail-panel wide">
          <h2>Portfolio</h2>
          <div className="gig-detail-portfolio">
            {portfolioImages.length ? portfolioImages.map((image, index) => (
              <img key={`${image}-${index}`} src={resolveUploadUrl(image)} alt={`${gig.title} portfolio ${index + 1}`} />
            )) : (
              <div className="gig-detail-empty-media">
                <ImagePlus size={28} />
                <p>Portfolio images will appear here after the seller uploads approved work samples.</p>
              </div>
            )}
          </div>
        </article>

        <article className="gig-detail-panel">
          <h2>Safe service flow</h2>
          <div className="job-detail-facts">
            <span><strong>Step 1</strong>Buyer requests admin contact checking.</span>
            <span><strong>Step 2</strong>Admin reviews buyer, seller, and service details.</span>
            <span><strong>Step 3</strong>Contact can be shared only after the check is complete.</span>
          </div>
        </article>
      </div>
    </section>
  );
}

const UPLOAD_ORIGIN = API_BASE_URL.replace(/\/api\/?$/, '');

function resolveUploadUrl(relativePath) {
  if (!relativePath) return '';
  return `${UPLOAD_ORIGIN}/${relativePath.replace(/\\/g, '/')}`;
}

function ProfileAvatar({ src }) {
  if (src) return <img src={src} alt="Profile" className="profile-avatar" />;
  return <div className="profile-avatar profile-avatar-placeholder"><User size={40} /></div>;
}

function ProfilePage({ currentUser, setActivePage }) {
  const locations = useLocationOptions();
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({ fullName: '', skills: [], experience: '', country: '', city: '', about: '', phone: '', contactEmail: '', website: '' });
  const [skillDraft, setSkillDraft] = useState('');
  const [notice, setNotice] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [cvFile, setCvFile] = useState(null);
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState('');
  const [reviews, setReviews] = useState([]);
  const [applications, setApplications] = useState([]);
  const cvInputRef = useRef(null);
  const photoInputRef = useRef(null);
  const cities = useMemo(() => locations.find((item) => item.country === form.country)?.cities || [], [form.country, locations]);

  useEffect(() => {
    let active = true;

    async function loadProfileWorkspace() {
      setLoading(true);
      setError('');
      try {
        const [profileData, applicationData] = await Promise.all([
          apiRequest('/profiles/me'),
          apiRequest('/applications/mine').catch(() => [])
        ]);
        if (!active) return;
        applyProfile(profileData);
        setApplications(applicationData);

        const userId = profileData?.user?._id || currentUser?.id;
        if (userId) {
          const reviewData = await apiRequest(`/reviews/user/${userId}`).catch(() => []);
          if (active) setReviews(reviewData);
        }
      } catch (requestError) {
        if (active) setError(requestError.message);
      } finally {
        if (active) setLoading(false);
      }
    }

    loadProfileWorkspace();
    return () => { active = false; };
  }, [currentUser?.id]);

  useEffect(() => () => { if (photoPreview) URL.revokeObjectURL(photoPreview); }, [photoPreview]);

  function applyProfile(data) {
    setProfile(data);
    setForm({
      fullName: data?.fullName || '',
      skills: Array.isArray(data?.skills) ? data.skills : [],
      experience: data?.experience || '',
      country: data?.country || '',
      city: data?.city || '',
      about: data?.about || '',
      phone: data?.hiddenContact?.phone || '',
      contactEmail: data?.hiddenContact?.email || data?.user?.email || currentUser?.email || '',
      website: data?.hiddenContact?.website || ''
    });
  }

  function updateField(name, value) {
    setForm((current) => ({ ...current, [name]: value, ...(name === 'country' ? { city: '' } : {}) }));
  }

  function addSkillsFromDraft() {
    const nextSkills = skillDraft
      .split(',')
      .map((skill) => skill.trim())
      .filter(Boolean);
    if (!nextSkills.length) return;

    setForm((current) => ({
      ...current,
      skills: [...new Set([...current.skills, ...nextSkills])]
    }));
    setSkillDraft('');
  }

  function removeSkill(skill) {
    setForm((current) => ({ ...current, skills: current.skills.filter((item) => item !== skill) }));
  }

  function handleSkillKeyDown(event) {
    if (event.key === 'Enter' || event.key === ',') {
      event.preventDefault();
      addSkillsFromDraft();
    }
  }

  function handleCvSelect(event) {
    const file = event.target.files?.[0];
    if (file) setCvFile(file);
  }

  function handlePhotoSelect(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    setPhotoFile(file);
    setPhotoPreview(URL.createObjectURL(file));
  }

  async function saveProfile() {
    setNotice('');
    setError('');
    const draftSkills = skillDraft
      .split(',')
      .map((skill) => skill.trim())
      .filter(Boolean);
    const skillsToSave = [...new Set([...form.skills, ...draftSkills])];

    if (!form.fullName.trim()) {
      setError('Full name is required.');
      return;
    }

    setSaving(true);
    try {
      const body = new FormData();
      body.append('fullName', form.fullName.trim());
      body.append('skills', skillsToSave.join(','));
      body.append('experience', form.experience);
      body.append('country', form.country);
      body.append('city', form.city);
      body.append('about', form.about);
      body.append('phone', form.phone);
      body.append('contactEmail', form.contactEmail);
      body.append('website', form.website);
      if (cvFile) body.append('cvFile', cvFile);
      if (photoFile) body.append('profilePhoto', photoFile);
      const saved = await apiRequest('/profiles/me', { method: 'PUT', body, headers: {} });
      applyProfile(saved);
      setSkillDraft('');
      setCvFile(null);
      setPhotoFile(null);
      setPhotoPreview('');
      setNotice('Profile saved. Contact details stay hidden from public users.');
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSaving(false);
    }
  }

  const avatarSrc = photoPreview || resolveUploadUrl(profile?.profilePhoto);
  const account = profile?.user || currentUser || {};
  const roleLabel = (account.role || 'job_seeker').replace(/_/g, ' ');
  const hasPriorityBadge = Boolean(account.hasPriorityBadge || profile?.hasPriorityBadge);
  const locationText = [form.city, form.country].filter(Boolean).join(', ') || 'Location not added';
  const websiteUrl = form.website ? (form.website.startsWith('http') ? form.website : `https://${form.website}`) : '';
  const completionItems = [
    Boolean(form.fullName),
    Boolean(form.about),
    Boolean(form.experience),
    form.skills.length > 0,
    Boolean(form.country && form.city),
    Boolean(profile?.cvFile || cvFile),
    Boolean(profile?.profilePhoto || photoFile),
    Boolean(form.phone || form.contactEmail || form.website)
  ];
  const completion = Math.round((completionItems.filter(Boolean).length / completionItems.length) * 100);
  const statusLabels = {
    submitted: 'Submitted',
    under_review: 'Under review',
    shortlisted: 'Shortlisted',
    admin_contacted: 'Contact check',
    rejected: 'Rejected',
    hired: 'Hired'
  };

  return (
    <section className="page profile-workspace">
      <input ref={cvInputRef} type="file" accept=".pdf,.doc,.docx" hidden onChange={handleCvSelect} />
      <input ref={photoInputRef} type="file" accept="image/*" hidden onChange={handlePhotoSelect} />

      <div className="profile-dashboard-hero">
        <div className="profile-avatar-wrap large">
          <ProfileAvatar src={avatarSrc} />
          <button type="button" className="avatar-edit-button" onClick={() => photoInputRef.current?.click()} aria-label="Change profile photo">
            <ImagePlus size={15} />
          </button>
        </div>
        <div className="profile-identity">
          <span className="eyebrow"><BadgeCheck size={16} /> {account.isEmailVerified ? 'Email verified' : 'Email needs verification'}</span>
          <h1>{form.fullName || profile?.fullName || 'Build your work profile'}</h1>
          <p>{form.about || 'Add your skills, CV, experience, and protected contact details so employers and clients can review your profile safely.'}</p>
          <div className="profile-meta-row">
            <span><UserCheck size={15} /> {roleLabel}</span>
            {hasPriorityBadge ? <span className="priority-badge"><BadgeCheck size={15} /> Top verified badge</span> : null}
            <span><MapPin size={15} /> {locationText}</span>
            <span><ShieldCheck size={15} /> Contact hidden publicly</span>
          </div>
          <RatingComponent value={profile?.ratingAverage || 0} count={profile?.ratingCount || 0} />
        </div>
        <div className="profile-completion-card">
          <strong>{loading ? '--' : `${completion}%`}</strong>
          <span>Profile completion</span>
          <div className="completion-bar"><i style={{ width: `${completion}%` }} /></div>
          <p>{completion >= 80 ? 'Strong profile. Keep your CV and contact details current.' : 'Add CV, photo, skills, and contact details to improve profile quality.'}</p>
        </div>
      </div>

      <div className="profile-work-grid">
        <form className="profile-editor profile-editor-modern" onSubmit={(event) => { event.preventDefault(); saveProfile(); }}>
          <div className="profile-panel-heading">
            <div>
              <span className="eyebrow"><User size={16} /> Profile editor</span>
              <h2>Personal and work details</h2>
            </div>
            <button className="primary-button" type="submit" disabled={saving}>{saving ? 'Saving...' : 'Save profile'}</button>
          </div>

          <FeedbackNotice>{notice}</FeedbackNotice>
          <FeedbackNotice type="error">{error}</FeedbackNotice>

          <div className="profile-form-grid">
            <label className="profile-field">
              <span>Full name</span>
              <input placeholder="Your full name" value={form.fullName} onChange={(event) => updateField('fullName', event.target.value)} />
            </label>
            <label className="profile-field">
              <span>Experience</span>
              <input placeholder="Example: 5 years in React, support, design" value={form.experience} onChange={(event) => updateField('experience', event.target.value)} />
            </label>
            <label className="profile-field">
              <span>Country</span>
              <CustomSelect icon={Globe2} value={form.country} placeholder="Country" options={locations.map((item) => ({ value: item.country, label: item.country }))} onChange={(value) => updateField('country', value)} />
            </label>
            <label className="profile-field">
              <span>City</span>
              <CustomSelect icon={MapPin} value={form.city} placeholder={form.country ? 'City' : 'Choose country first'} disabled={!form.country} options={cities.map((city) => ({ value: city.name, label: city.name }))} onChange={(value) => updateField('city', value)} />
            </label>
            <label className="profile-field">
              <span>Private phone</span>
              <input placeholder="Hidden from public" value={form.phone} onChange={(event) => updateField('phone', event.target.value)} />
            </label>
            <label className="profile-field">
              <span>Private email</span>
              <input placeholder="Contact email" type="email" value={form.contactEmail} onChange={(event) => updateField('contactEmail', event.target.value)} />
            </label>
            <label className="profile-field">
              <span>Website or portfolio</span>
              <input placeholder="https://yourportfolio.com" value={form.website} onChange={(event) => updateField('website', event.target.value)} />
            </label>
            <label className="profile-field profile-field-wide">
              <span>About me</span>
              <textarea placeholder="Write a short professional introduction" value={form.about} onChange={(event) => updateField('about', event.target.value)} />
            </label>
          </div>

          <div className="skill-builder">
            <div className="profile-panel-heading compact">
              <div>
                <span className="eyebrow"><Sparkles size={16} /> Skills</span>
                <h3>Add skills clients and employers can search</h3>
              </div>
            </div>
            <div className="skill-input-row">
              <input value={skillDraft} onChange={(event) => setSkillDraft(event.target.value)} onKeyDown={handleSkillKeyDown} onBlur={addSkillsFromDraft} placeholder="Type a skill and press Enter" />
              <button type="button" className="ghost-button" onClick={addSkillsFromDraft}><PlusCircle size={16} /> Add</button>
            </div>
            <div className="editable-skill-row">
              {form.skills.length ? form.skills.map((skill) => (
                <button type="button" key={skill} onClick={() => removeSkill(skill)}>
                  {skill}<X size={14} />
                </button>
              )) : <span>No skills added yet</span>}
            </div>
          </div>

          <div className="profile-upload-grid">
            <button type="button" className="upload-action-card" onClick={() => cvInputRef.current?.click()}>
              <UploadCloud size={22} />
              <strong>{profile?.cvFile || cvFile ? 'Replace CV' : 'Upload CV'}</strong>
              <span>{cvFile?.name || profile?.cvFileName || 'PDF, DOC, DOCX up to 5MB'}</span>
            </button>
            <button type="button" className="upload-action-card" onClick={() => photoInputRef.current?.click()}>
              <ImagePlus size={22} />
              <strong>{profile?.profilePhoto || photoFile ? 'Replace photo' : 'Upload photo'}</strong>
              <span>{photoFile?.name || 'PNG, JPG, WEBP up to 5MB'}</span>
            </button>
          </div>
        </form>

        <aside className="profile-side-stack">
          <section className="profile-side-card contact-card">
            <div className="profile-panel-heading compact">
              <div>
                <span className="eyebrow"><LockKeyhole size={16} /> Private contact</span>
                <h3>Hidden from public users</h3>
              </div>
            </div>
            <div className="contact-list">
              <span><Mail size={16} /> {form.contactEmail || account.email || 'Add contact email'}</span>
              <span><Phone size={16} /> {form.phone || 'Add phone number'}</span>
              <span><Link size={16} /> {form.website || 'Add website'}</span>
            </div>
            {websiteUrl ? <a className="ghost-button" href={websiteUrl} target="_blank" rel="noreferrer"><ExternalLink size={16} /> Open portfolio</a> : null}
          </section>

          <section className="profile-side-card cv-card">
            <div>
              <span className="eyebrow"><FileUp size={16} /> CV file</span>
              <h3>{profile?.cvFile || cvFile ? 'CV ready for applications' : 'No CV uploaded yet'}</h3>
              <p>{profile?.cvFile || cvFile ? 'Your CV can support job applications and profile review.' : 'Upload your CV so employers can review your experience safely.'}</p>
            </div>
            {profile?.cvFile ? (
              <a className="primary-button" href={resolveUploadUrl(profile.cvFile)} target="_blank" rel="noreferrer"><FileUp size={16} /> View CV</a>
            ) : (
              <button type="button" className="primary-button" onClick={() => cvInputRef.current?.click()}><UploadCloud size={16} /> Upload CV</button>
            )}
          </section>

          <section className="profile-side-card">
            <div className="profile-panel-heading compact">
              <div>
                <span className="eyebrow"><ClipboardList size={16} /> Applications</span>
                <h3>My application status</h3>
              </div>
              <button type="button" className="ghost-button" onClick={() => setActivePage?.('jobs')}>Find jobs</button>
            </div>
            <div className="application-list">
              {applications.length ? applications.slice(0, 5).map((application) => (
                <article className="application-card" key={application._id}>
                  <div>
                    <strong>{application.job?.title || 'Deleted job'}</strong>
                    <span>{[application.job?.city, application.job?.country].filter(Boolean).join(', ') || application.job?.category || 'Worldwide'}</span>
                  </div>
                  <em>{statusLabels[application.status] || application.status}</em>
                </article>
              )) : <p className="feedback-empty">No applications yet. Apply to a verified job to track status here.</p>}
            </div>
          </section>

          <section className="profile-side-card feedback-panel">
            <div className="profile-panel-heading compact">
              <div>
                <span className="eyebrow"><Star size={16} /> Feedback</span>
                <h3>Ratings after completed work</h3>
              </div>
            </div>
            {reviews.length ? (
              <div className="feedback-list">
                {reviews.map((review) => (
                  <div className="feedback-item" key={review._id}>
                    <RatingComponent value={review.rating} />
                    <p>"{review.feedback}"</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="feedback-empty">No feedback yet. Completed work can receive ratings and written feedback here once reviewed.</p>
            )}
          </section>
        </aside>
      </div>
    </section>
  );
}

function EmployerPage({ marketplace }) {
  const locations = useLocationOptions();
  const [form, setForm] = useState({ company: '', title: '', category: '', salary: '', country: '', city: '', description: '', requirements: '', skills: '' });
  const [myJobs, setMyJobs] = useState([]);
  const [notice, setNotice] = useState('');
  const [error, setError] = useState('');
  const cities = useMemo(() => locations.find((item) => item.country === form.country)?.cities || [], [form.country, locations]);

  async function loadMine() {
    try {
      setMyJobs(await apiRequest('/jobs/mine'));
    } catch {
      setMyJobs([]);
    }
  }

  useEffect(() => {
    loadMine();
  }, []);

  function updateField(name, value) {
    setForm((current) => ({ ...current, [name]: value, ...(name === 'country' ? { city: '' } : {}) }));
  }

  async function postJob() {
    setNotice('');
    setError('');
    try {
      await apiRequest('/jobs', { method: 'POST', body: JSON.stringify(form) });
      setNotice('Job submitted for platform review.');
      setForm({ company: '', title: '', category: '', salary: '', country: '', city: '', description: '', requirements: '', skills: '' });
      await loadMine();
      await marketplace.reload();
    } catch (requestError) {
      setError(requestError.message);
    }
  }

  return (
    <section className="page">
      <div className="page-heading">
        <span className="eyebrow"><PlusCircle size={16} /> Employer tools</span>
        <h1>Post vacancies and manage applicants</h1>
        <p>Employers can create profiles, post vacancies, review status, and request applicant details through protected platform checks.</p>
      </div>
      <div className="form-shell">
        <FeedbackNotice>{notice}</FeedbackNotice>
        <FeedbackNotice type="error">{error}</FeedbackNotice>
        <div className="form-grid">
          <input placeholder="Company name" value={form.company} onChange={(event) => updateField('company', event.target.value)} />
          <input placeholder="Job title" value={form.title} onChange={(event) => updateField('title', event.target.value)} />
          <CustomSelect
            value={form.category}
            placeholder="Category"
            options={marketplace.allCategories.map((c) => ({ value: c.name, label: c.name }))}
            onChange={(value) => updateField('category', value)}
          />
          <input placeholder="Salary" value={form.salary} onChange={(event) => updateField('salary', event.target.value)} />
          <CustomSelect value={form.country} placeholder="Country" options={locations.map((item) => ({ value: item.country, label: item.country }))} onChange={(value) => updateField('country', value)} />
          <CustomSelect value={form.city} placeholder={form.country ? 'City' : 'Choose country first'} disabled={!form.country} options={cities.map((city) => ({ value: city.name, label: city.name }))} onChange={(value) => updateField('city', value)} />
          <input placeholder="Skills comma separated" value={form.skills} onChange={(event) => updateField('skills', event.target.value)} />
          <textarea placeholder="Description" value={form.description} onChange={(event) => updateField('description', event.target.value)} />
          <textarea placeholder="Requirements" value={form.requirements} onChange={(event) => updateField('requirements', event.target.value)} />
        </div>
        <button className="primary-button" onClick={postJob}><ClipboardList size={17} /> Submit for Approval</button>
      </div>
      <div className="management-grid">
        {myJobs.length ? myJobs.map((job) => (
          <article className="management-card" key={job._id || job.title}>
            <h3>{job.title}</h3>
            <p>Status: {job.status || 'demo'}. Applicants stay protected until contact details are checked.</p>
            <button className="ghost-button"><MessageSquareMore size={16} /> Ask Admin for Details</button>
          </article>
        )) : <EmptyHomeState text="No employer jobs posted from this account yet." />}
      </div>
    </section>
  );
}

function FreelancePage({ marketplace, currentUser, setActivePage, onOpenGig }) {
  const categoryScrollerRef = useRef(null);
  const portfolioInputRef = useRef(null);
  const [form, setForm] = useState({ title: '', category: '', price: '', deliveryTime: '', description: '' });
  const [portfolioFiles, setPortfolioFiles] = useState([]);
  const [filters, setFilters] = useState({ keyword: '', category: '' });
  const [notice, setNotice] = useState('');
  const [error, setError] = useState('');
  const gigs = marketplace.gigs;
  const selectedCategory = filters.category;
  const serviceCategories = useMemo(() => {
    const apiCategories = marketplace.allCategories?.length ? marketplace.allCategories : marketplace.categories;
    const categoryNames = apiCategories?.length
      ? apiCategories.map((category) => category.name).filter(Boolean)
      : [...new Set(gigs.map((gig) => gig.category).filter(Boolean))];

    return categoryNames.map((name) => ({
      name,
      count: gigs.filter((gig) => gig.category === name).length
    }));
  }, [gigs, marketplace.allCategories, marketplace.categories]);

  const visibleGigs = useMemo(() => {
    const keyword = filters.keyword.trim().toLowerCase();

    return gigs.filter((gig) => {
      const searchableText = [
        gig.title,
        gig.seller?.email,
        gig.category,
        gig.description,
        gig.deliveryTime,
        gig.price
      ].filter(Boolean).join(' ').toLowerCase();

      const matchesKeyword = !keyword || searchableText.includes(keyword);
      const matchesCategory = !filters.category || gig.category === filters.category;

      return matchesKeyword && matchesCategory;
    });
  }, [gigs, filters]);
  const pagination = usePagination(visibleGigs, RESULTS_PAGE_SIZE);
  const { setPage } = pagination;

  useEffect(() => {
    setPage(1);
  }, [filters.keyword, filters.category, setPage]);

  const activeFilterLabels = [
    filters.keyword ? `Keyword: ${filters.keyword}` : '',
    filters.category ? `Category: ${filters.category}` : ''
  ].filter(Boolean);

  function updateField(name, value) {
    setForm((current) => ({ ...current, [name]: value }));
  }

  function updateCategory(category) {
    setFilters((current) => ({ ...current, category }));
  }

  function clearFilters() {
    setFilters({ keyword: '', category: '' });
  }

  function scrollCategories() {
    categoryScrollerRef.current?.scrollBy({ left: 420, behavior: 'smooth' });
  }

  function handlePortfolioFiles(event) {
    setPortfolioFiles(Array.from(event.target.files || []).slice(0, 6));
  }

  async function postGig() {
    if (!currentUser) {
      setError('Please login as a freelancer before creating a service gig.');
      setActivePage('login');
      return;
    }

    if (!currentUser.isEmailVerified) {
      setError('Email verification is required before creating a service gig.');
      setActivePage('login');
      return;
    }

    if (!['freelancer', 'admin'].includes(currentUser.role)) {
      setError('Only freelancer accounts can create service gigs.');
      return;
    }

    setNotice('');
    setError('');
    try {
      const body = new FormData();
      Object.entries(form).forEach(([key, value]) => body.append(key, value));
      portfolioFiles.forEach((file) => body.append('portfolioImages', file));

      await apiRequest('/gigs', { method: 'POST', body });
      setNotice('Service gig submitted for platform review.');
      setForm({ title: '', category: '', price: '', deliveryTime: '', description: '' });
      setPortfolioFiles([]);
      if (portfolioInputRef.current) portfolioInputRef.current.value = '';
      await marketplace.reload();
    } catch (requestError) {
      setError(requestError.message);
    }
  }

  return (
    <section className="page">
      <div className="page-heading">
        <span className="eyebrow"><Sparkles size={16} /> Fiverr-like services</span>
        <h1>Sell and discover freelance services</h1>
        <p>Browse verified services by category, inspect full gig details, and request admin contact checks before private details are shared.</p>
      </div>

      <section className="jobs-category-panel freelance-category-panel">
        <div className="jobs-category-heading">
          <div>
            <p>{selectedCategory ? `Services in ${selectedCategory}.` : 'Browse services by category.'}</p>
          </div>
          {selectedCategory ? <button className="link-button" onClick={() => updateCategory('')}>Show all</button> : null}
        </div>
        <div className="jobs-category-carousel">
          <div className="jobs-category-icon-grid" ref={categoryScrollerRef}>
            <JobCategoryIconCard
              category={{ name: 'All services', count: gigs.length, icon: Store }}
              active={!selectedCategory}
              index={0}
              onClick={() => updateCategory('')}
              countLabel="live services"
            />
            {serviceCategories.map((category, index) => (
              <JobCategoryIconCard
                key={category.name}
                category={category}
                active={selectedCategory === category.name}
                index={index + 1}
                onClick={() => updateCategory(category.name)}
                countLabel="live services"
              />
            ))}
          </div>
          <button className="category-next-button" type="button" aria-label="More service categories" onClick={scrollCategories}><ArrowRight size={20} /></button>
        </div>
      </section>

      <div className="freelance-browser-main">
        <div className="freelance-filter-bar">
          <label>
            <Search size={17} />
            <input
              placeholder="Search service, skill, seller, or price"
              value={filters.keyword}
              onChange={(event) => setFilters((current) => ({ ...current, keyword: event.target.value }))}
            />
          </label>
          <CustomSelect
            value={filters.category}
            placeholder="Service category"
            options={serviceCategories.map((category) => ({ value: category.name, label: category.name }))}
            onChange={(value) => updateCategory(value)}
          />
          <button className="primary-button" onClick={() => setFilters((current) => ({ ...current }))}><Search size={17} /> Search</button>
        </div>

        {activeFilterLabels.length ? (
          <div className="active-job-filters">
            <span>{visibleGigs.length} matching {visibleGigs.length === 1 ? 'service' : 'services'}</span>
            {activeFilterLabels.map((label) => <em key={label}>{label}</em>)}
            <button className="link-button" onClick={clearFilters}>Clear filters</button>
          </div>
        ) : null}

        <div className="freelance-feature-strip">
          <span><ShieldCheck size={15} /> Admin contact check</span>
          <span><ImagePlus size={15} /> Portfolio supported</span>
          <span><Star size={15} /> Moderated ratings</span>
          <span><BadgeCheck size={15} /> Priority sellers first</span>
        </div>

        <div className="gig-grid freelance-results-grid">
          {visibleGigs.length ? pagination.pageItems.map((gig) => <GigCard key={gig._id || gig.title} gig={gig} onOpen={gig._id ? onOpenGig : undefined} />) : <EmptyHomeState text={selectedCategory ? `No live services in ${selectedCategory} yet. Try another category or check again soon.` : 'No live service gigs are available yet. Verified freelancer services will appear here soon.'} />}
        </div>
        <Pagination {...pagination} onChange={pagination.setPage} />
      </div>

      <div className="form-shell">
        <h2>Create a service gig</h2>
        <FeedbackNotice>{notice}</FeedbackNotice>
        <FeedbackNotice type="error">{error}</FeedbackNotice>
        {currentUser && ['freelancer', 'admin'].includes(currentUser.role) ? (
          <>
            <div className="form-grid">
              <input placeholder="Service title" value={form.title} onChange={(event) => updateField('title', event.target.value)} />
              <CustomSelect
                value={form.category}
                placeholder="Service category"
                options={marketplace.allCategories.map((c) => ({ value: c.name, label: c.name }))}
                onChange={(value) => updateField('category', value)}
              />
              <input placeholder="Price" value={form.price} onChange={(event) => updateField('price', event.target.value)} />
              <input placeholder="Delivery time" value={form.deliveryTime} onChange={(event) => updateField('deliveryTime', event.target.value)} />
              <textarea placeholder="Description" value={form.description} onChange={(event) => updateField('description', event.target.value)} />
              <input ref={portfolioInputRef} className="portfolio-file-input" type="file" accept="image/*" multiple onChange={handlePortfolioFiles} />
              <button className="ghost-button" type="button" onClick={() => portfolioInputRef.current?.click()}><ImagePlus size={17} /> {portfolioFiles.length ? `${portfolioFiles.length} images selected` : 'Add Portfolio Images'}</button>
            </div>
            {portfolioFiles.length ? (
              <div className="portfolio-file-list">
                {portfolioFiles.map((file) => <span key={`${file.name}-${file.size}`}>{file.name}</span>)}
              </div>
            ) : null}
            <button className="primary-button" onClick={postGig}>Submit Gig for Approval</button>
          </>
        ) : (
          <div className="auth-inline-card">
            <ShieldCheck size={24} />
            <p>Login with a freelancer account to create service gigs. Buyers can still browse approved services.</p>
            <button className="primary-button" onClick={() => setActivePage(currentUser ? 'profile' : 'login')}>{currentUser ? 'Open Profile' : 'Login'}</button>
          </div>
        )}
      </div>
    </section>
  );
}

function PlatformPage({ setActivePage, setActiveVertical }) {
  function openVertical(id) {
    setActiveVertical(id);
    setActivePage('platformVertical');
  }

  return (
    <section className="page platform-page">
      <div className="page-heading">
        <span className="eyebrow"><Compass size={16} /> Explore the platform</span>
        <h1>Everything you need in one trusted place</h1>
        <p>From your first night to your first year, find verified listings and services across every part of settling into a new country.</p>
      </div>
      <div className="platform-grid">
        <button type="button" className="platform-tile" onClick={() => setActivePage('jobs')}>
          <span className="platform-tile-icon"><BriefcaseBusiness size={24} /></span>
          <strong>Jobs & Careers</strong>
          <p>Search verified vacancies, apply safely, and track your applications.</p>
        </button>
        {VERTICALS.map((vertical) => {
          const Icon = vertical.icon;
          return (
            <button type="button" key={vertical.id} className="platform-tile" onClick={() => openVertical(vertical.id)}>
              <span className="platform-tile-icon"><Icon size={24} /></span>
              <strong>{vertical.name}</strong>
              <p>{vertical.tagline}</p>
            </button>
          );
        })}
      </div>
    </section>
  );
}

function VerticalListingsPage({ vertical, currentUser, setActivePage, onOpenListing }) {
  const locations = useLocationOptions();
  const verticalInfo = findVertical(vertical);
  const VerticalIcon = verticalInfo?.icon || ShieldCheck;
  const detailFields = VERTICAL_DETAIL_FIELDS[vertical] || [];
  const imageInputRef = useRef(null);

  const [listings, setListings] = useState([]);
  const [myListings, setMyListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ keyword: '', category: '', country: '', city: '' });
  const [form, setForm] = useState({ title: '', category: '', description: '', price: '', country: '', city: '' });
  const [detailValues, setDetailValues] = useState({});
  const [imageFiles, setImageFiles] = useState([]);
  const [notice, setNotice] = useState('');
  const [error, setError] = useState('');
  const [posting, setPosting] = useState(false);
  const filterCities = useMemo(() => locations.find((item) => item.country === filters.country)?.cities || [], [filters.country, locations]);
  const formCities = useMemo(() => locations.find((item) => item.country === form.country)?.cities || [], [form.country, locations]);
  const categories = useMemo(() => [...new Set(listings.map((item) => item.category).filter(Boolean))], [listings]);
  const pagination = usePagination(listings, RESULTS_PAGE_SIZE);
  const { setPage } = pagination;

  useEffect(() => {
    setPage(1);
  }, [vertical, filters.keyword, filters.category, filters.country, filters.city, setPage]);

  async function loadListings() {
    setLoading(true);
    try {
      const params = new URLSearchParams({ vertical });
      if (filters.keyword) params.set('q', filters.keyword);
      if (filters.category) params.set('category', filters.category);
      if (filters.country) params.set('country', filters.country);
      if (filters.city) params.set('city', filters.city);
      setListings(await apiRequest(`/listings?${params.toString()}`));
    } catch {
      setListings([]);
    } finally {
      setLoading(false);
    }
  }

  async function loadMine() {
    if (!currentUser) {
      setMyListings([]);
      return;
    }
    try {
      const mine = await apiRequest('/listings/mine');
      setMyListings(mine.filter((item) => item.vertical === vertical));
    } catch {
      setMyListings([]);
    }
  }

  useEffect(() => {
    setFilters({ keyword: '', category: '', country: '', city: '' });
    setForm({ title: '', category: '', description: '', price: '', country: '', city: '' });
    setDetailValues({});
    setNotice('');
    setError('');
  }, [vertical]);

  useEffect(() => {
    loadListings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vertical, filters.category, filters.country, filters.city]);

  useEffect(() => {
    loadMine();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser?.id, vertical]);

  function updateFilter(name, value) {
    setFilters((current) => ({ ...current, [name]: value, ...(name === 'country' ? { city: '' } : {}) }));
  }

  function updateField(name, value) {
    setForm((current) => ({ ...current, [name]: value, ...(name === 'country' ? { city: '' } : {}) }));
  }

  function updateDetail(key, value) {
    setDetailValues((current) => ({ ...current, [key]: value }));
  }

  function handleImageFiles(event) {
    setImageFiles(Array.from(event.target.files || []).slice(0, 8));
  }

  async function postListing() {
    if (!currentUser) {
      setError('Please login before creating a listing.');
      setActivePage('login');
      return;
    }

    if (!currentUser.isEmailVerified) {
      setError('Email verification is required before creating a listing.');
      setActivePage('login');
      return;
    }

    setNotice('');
    setError('');
    setPosting(true);
    try {
      const body = new FormData();
      body.append('vertical', vertical);
      Object.entries(form).forEach(([key, value]) => body.append(key, value));
      body.append('details', JSON.stringify(detailValues));
      imageFiles.forEach((file) => body.append('images', file));

      await apiRequest('/listings', { method: 'POST', body });
      setNotice('Listing submitted for platform review.');
      setForm({ title: '', category: '', description: '', price: '', country: '', city: '' });
      setDetailValues({});
      setImageFiles([]);
      if (imageInputRef.current) imageInputRef.current.value = '';
      await loadMine();
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setPosting(false);
    }
  }

  async function deleteListing(id) {
    if (!window.confirm('Delete this listing? This cannot be undone.')) return;
    try {
      await apiRequest(`/listings/${id}`, { method: 'DELETE' });
      await loadMine();
      await loadListings();
    } catch (requestError) {
      setError(requestError.message);
    }
  }

  return (
    <section className="page">
      <div className="page-heading">
        <span className="eyebrow"><VerticalIcon size={16} /> {verticalInfo?.name || vertical}</span>
        <h1>{verticalInfo?.tagline || 'Browse verified listings'}</h1>
        <p>Filter by category and location, or list your own to reach people who need it.</p>
      </div>

      <div className="freelance-browser-main">
        <form className="search-filter compact" onSubmit={(event) => { event.preventDefault(); loadListings(); }}>
          <label>
            <Search size={17} />
            <input placeholder="Search listings" value={filters.keyword} onChange={(event) => updateFilter('keyword', event.target.value)} />
          </label>
          <CustomSelect value={filters.category} placeholder="Category" options={categories.map((name) => ({ value: name, label: name }))} onChange={(value) => updateFilter('category', value)} />
          <CustomSelect value={filters.country} placeholder="Country" options={locations.map((item) => ({ value: item.country, label: item.country }))} onChange={(value) => updateFilter('country', value)} />
          <CustomSelect value={filters.city} placeholder={filters.country ? 'City' : 'Choose country first'} disabled={!filters.country} options={filterCities.map((city) => ({ value: city.name, label: city.name }))} onChange={(value) => updateFilter('city', value)} />
          <button className="primary-button" type="submit"><Search size={17} /> Search</button>
        </form>

        <div className="gig-grid freelance-results-grid">
          {loading ? (
            <EmptyHomeState text="Loading listings..." />
          ) : listings.length ? (
            pagination.pageItems.map((listing) => <ListingCard key={listing._id} listing={listing} onOpen={onOpenListing} />)
          ) : (
            <EmptyHomeState text={`No live ${(verticalInfo?.name || vertical).toLowerCase()} listings yet. Verified listings will appear here soon.`} />
          )}
        </div>
        {!loading ? <Pagination {...pagination} onChange={pagination.setPage} /> : null}
      </div>

      <div className="form-shell">
        <h2>List something in {verticalInfo?.name || vertical}</h2>
        <FeedbackNotice>{notice}</FeedbackNotice>
        <FeedbackNotice type="error">{error}</FeedbackNotice>
        {currentUser && currentUser.isEmailVerified ? (
          <>
            <div className="form-grid">
              <input placeholder="Title" value={form.title} onChange={(event) => updateField('title', event.target.value)} />
              <input placeholder="Category" value={form.category} onChange={(event) => updateField('category', event.target.value)} />
              <input placeholder="Price (optional)" value={form.price} onChange={(event) => updateField('price', event.target.value)} />
              <CustomSelect value={form.country} placeholder="Country" options={locations.map((item) => ({ value: item.country, label: item.country }))} onChange={(value) => updateField('country', value)} />
              <CustomSelect value={form.city} placeholder={form.country ? 'City' : 'Choose country first'} disabled={!form.country} options={formCities.map((city) => ({ value: city.name, label: city.name }))} onChange={(value) => updateField('city', value)} />
              <textarea placeholder="Description" value={form.description} onChange={(event) => updateField('description', event.target.value)} />
              {detailFields.map((field) => (
                field.type === 'checkbox' ? (
                  <label className="admin-check-row" key={field.key}>
                    <input type="checkbox" checked={Boolean(detailValues[field.key])} onChange={(event) => updateDetail(field.key, event.target.checked)} />
                    <span>{field.label}</span>
                  </label>
                ) : (
                  <input key={field.key} type={field.type === 'number' ? 'number' : 'text'} placeholder={field.label} value={detailValues[field.key] || ''} onChange={(event) => updateDetail(field.key, event.target.value)} />
                )
              ))}
              <input ref={imageInputRef} className="portfolio-file-input" type="file" accept="image/*" multiple onChange={handleImageFiles} />
              <button className="ghost-button" type="button" onClick={() => imageInputRef.current?.click()}><ImagePlus size={17} /> {imageFiles.length ? `${imageFiles.length} images selected` : 'Add Photos'}</button>
            </div>
            <button className="primary-button" disabled={posting} onClick={postListing}>{posting ? 'Submitting...' : 'Submit for Approval'}</button>
          </>
        ) : (
          <div className="auth-inline-card">
            <ShieldCheck size={24} />
            <p>{currentUser ? 'Verify your email to create a listing.' : 'Login to create a listing. Everyone can browse approved listings.'}</p>
            <button className="primary-button" onClick={() => setActivePage(currentUser ? 'profile' : 'login')}>{currentUser ? 'Verify Email' : 'Login'}</button>
          </div>
        )}
      </div>

      {currentUser ? (
        <div className="management-grid">
          {myListings.length ? myListings.map((listing) => (
            <article className="management-card" key={listing._id}>
              <h3>{listing.title}</h3>
              <p>Status: {listing.status}.</p>
              <button className="ghost-button" onClick={() => deleteListing(listing._id)}><Trash2 size={16} /> Delete</button>
            </article>
          )) : <EmptyHomeState text="You haven't listed anything in this category yet." />}
        </div>
      ) : null}
    </section>
  );
}

function ListingDetailPage({ listingId, vertical, setActivePage, onBack }) {
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    if (!listingId) return;
    let cancelled = false;
    setLoading(true);
    setError('');
    setActiveImage(0);

    apiRequest(`/listings/${listingId}`)
      .then((data) => {
        if (!cancelled) setListing(data);
      })
      .catch((requestError) => {
        if (!cancelled) setError(requestError.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [listingId]);

  const verticalInfo = findVertical(listing?.vertical || vertical);
  const VerticalIcon = verticalInfo?.icon || ShieldCheck;

  if (loading) {
    return (
      <section className="page listing-detail-page">
        <div className="admin-loading"><Clock3 className="spin" size={24} /> Loading listing details...</div>
      </section>
    );
  }

  if (!listing) {
    return (
      <section className="page listing-detail-page">
        <button className="ghost-button job-detail-back" onClick={onBack}><ArrowRight className="flip-x" size={16} /> Back</button>
        <EmptyHomeState text={error || 'This listing is not available anymore.'} />
      </section>
    );
  }

  const images = listing.images || [];
  const location = [listing.city, listing.country].filter(Boolean).join(', ') || 'Worldwide';
  const priceLabel = Number(listing.price) ? `$${Number(listing.price).toLocaleString()}` : null;
  const detailEntries = Object.entries(listing.details || {}).filter(([, value]) => value !== '' && value !== null && value !== undefined);

  return (
    <section className="page listing-detail-page">
      <button className="ghost-button job-detail-back" onClick={onBack}><ArrowRight className="flip-x" size={16} /> Back to {verticalInfo?.name || 'listings'}</button>

      <div className="gig-detail-hero">
        <div className="gig-detail-main">
          <div className="job-status-line">
            <span className="status-pill">{listing.status === 'approved' ? 'Live listing' : listing.status}</span>
          </div>
          <h1>{listing.title}</h1>
          <div className="listing-tags">
            <span className="listing-vertical-tag"><VerticalIcon size={13} /> {verticalInfo?.name || listing.vertical}</span>
            {listing.category ? <span className="listing-category-tag">{listing.category}</span> : null}
          </div>
          <div className="job-detail-row">
            <span><MapPin size={16} /> {location}</span>
            {priceLabel ? <span><Calculator size={16} /> {priceLabel}</span> : null}
          </div>
        </div>
        {priceLabel ? (
          <div className="gig-detail-price-card">
            <span>Price</span>
            <strong>{priceLabel}</strong>
            <p>Verified through platform moderation before publishing.</p>
          </div>
        ) : null}
      </div>

      <div className="gig-detail-grid">
        <article className="gig-detail-panel wide">
          <h2>Photos</h2>
          {images.length ? (
            <>
              <div className="listing-detail-hero-image">
                <img src={resolveUploadUrl(images[activeImage])} alt={`${listing.title} photo ${activeImage + 1}`} />
              </div>
              {images.length > 1 ? (
                <div className="gig-detail-portfolio listing-detail-thumbs">
                  {images.map((image, index) => (
                    <img
                      key={`${image}-${index}`}
                      src={resolveUploadUrl(image)}
                      alt={`${listing.title} thumbnail ${index + 1}`}
                      className={index === activeImage ? 'active' : ''}
                      onClick={() => setActiveImage(index)}
                    />
                  ))}
                </div>
              ) : null}
            </>
          ) : (
            <div className="gig-detail-empty-media">
              <ImagePlus size={28} />
              <p>No photos have been added to this listing yet.</p>
            </div>
          )}
        </article>

        <article className="gig-detail-panel wide">
          <h2>Description</h2>
          <p>{listing.description || 'No description provided.'}</p>
        </article>

        {detailEntries.length ? (
          <article className="gig-detail-panel wide">
            <h2>Details</h2>
            <div className="listing-detail-list">
              {detailEntries.map(([key, value]) => (
                <div key={key}><span>{key}</span><strong>{typeof value === 'boolean' ? (value ? 'Yes' : 'No') : String(value)}</strong></div>
              ))}
            </div>
          </article>
        ) : null}

        <article className="gig-detail-panel">
          <h2>Trust and safety</h2>
          <div className="job-detail-facts">
            <span><strong>Reviewed</strong>Every listing is checked by the platform team before it goes live.</span>
            <span><strong>Location</strong>{location}</span>
            <span><strong>Category</strong>{listing.category || verticalInfo?.name || 'General'}</span>
          </div>
          <span className="listing-detail-note"><ShieldCheck size={15} /> Contact the poster safely once you are logged in.</span>
        </article>
      </div>
    </section>
  );
}

function AdminPage() {
  const stats = [
    ['Total users', '24,810', Users, '+12% this month'],
    ['Verified sellers', '3,428', Store, '184 waiting'],
    ['Pending approvals', '126', ClipboardList, 'Jobs and gigs'],
    ['Open admin messages', '342', MessageSquareMore, 'Contact checks'],
    ['Feedback reports', '58', Star, 'Needs moderation'],
    ['Blocked accounts', '79', LockKeyhole, 'Fraud prevention']
  ];

  const approvalQueue = [
    { item: 'Senior React Engineer', owner: 'Northstar Labs', type: 'Job post', risk: 'Low', status: 'Pending' },
    { item: 'Business website package', owner: 'Daniel Okafor', type: 'Service gig', risk: 'Low', status: 'Pending' },
    { item: 'Remote data entry team', owner: 'BrightOps LLC', type: 'Employer', risk: 'Medium', status: 'Needs check' },
    { item: 'Duplicate marketing profile', owner: 'm.chen.work@mail.com', type: 'User', risk: 'High', status: 'Flagged' }
  ];

  const users = [
    { name: 'Ari Morgan', role: 'Job seeker', country: 'Australia', email: 'Verified', status: 'Active', lastSeen: '4 min ago' },
    { name: 'Northstar Labs', role: 'Employer', country: 'Canada', email: 'Verified', status: 'Reviewing applicants', lastSeen: '18 min ago' },
    { name: 'Maya Chen', role: 'Seller', country: 'Malaysia', email: 'Verified', status: 'Online', lastSeen: 'Now' },
    { name: 'QuickHire 88', role: 'Employer', country: 'Unknown', email: 'Unverified', status: 'Restricted', lastSeen: '2 days ago' }
  ];

  const sellerChecks = [
    { seller: 'Maya Chen', gigs: 6, rating: '4.9', orders: '42 complete', status: 'Approved' },
    { seller: 'Daniel Okafor', gigs: 3, rating: '4.8', orders: '19 complete', status: 'Approved' },
    { seller: 'DataSwift Team', gigs: 8, rating: '3.1', orders: '7 disputed', status: 'Needs review' }
  ];

  const feedbackQueue = [
    { target: 'DataSwift Team', rating: '1 star', reason: 'Buyer says delivery was copied', status: 'Reported' },
    { target: 'Northstar Labs', rating: '5 stars', reason: 'Completed hire after admin contact', status: 'Approve' },
    { target: 'Maya Chen', rating: '4 stars', reason: 'Valid design service feedback', status: 'Approve' }
  ];

  const activities = [
    'Admin approved 12 job posts in IT and Customer Support',
    'Blocked 3 duplicate email accounts from one device fingerprint',
    'Sent contact request to employer for Senior React Engineer',
    'Moved 9 applications to under review',
    'Rejected 2 gig posts with missing portfolio proof'
  ];

  return (
    <section className="admin-layout">
      <AdminSidebar />
      <main className="admin-main">
        <div className="page-heading">
          <span className="eyebrow"><ShieldCheck size={16} /> Moderation center</span>
          <h1>Monitor users, sellers, approvals, feedback, and activity</h1>
          <p>Admin can check every marketplace part, approve or reject posts, verify sellers, control feedback, and watch user usage status.</p>
        </div>
        <div className="stats-grid">
          {stats.map(([label, value, Icon, note]) => (
            <article className="stat-card" key={label}>
              <Icon size={21} />
              <strong>{value}</strong>
              <span>{label}</span>
              <small>{note}</small>
            </article>
          ))}
        </div>

        <div className="admin-section-grid">
          <section className="admin-panel wide">
            <div className="admin-panel-header">
              <div>
                <span className="eyebrow"><Clock3 size={16} /> Approval queue</span>
                <h2>Posts, sellers, and users waiting for action</h2>
              </div>
              <button className="primary-button"><CheckCircle2 size={16} /> Bulk Review</button>
            </div>
            <div className="admin-table dense">
              <div className="table-row approval heading"><span>Item</span><span>Owner</span><span>Type</span><span>Risk</span><span>Action</span></div>
              {approvalQueue.map((item) => (
                <div className="table-row approval" key={item.item}>
                  <span><strong>{item.item}</strong><small>{item.status}</small></span>
                  <span>{item.owner}</span>
                  <span>{item.type}</span>
                  <span className={`status-badge ${item.risk.toLowerCase()}`}>{item.risk}</span>
                  <span className="row-actions">
                    <button className="ghost-button"><Eye size={15} /> Check</button>
                    <button className="primary-button"><CheckCircle2 size={15} /> Approve</button>
                  </span>
                </div>
              ))}
            </div>
          </section>

          <section className="admin-panel">
            <div className="admin-panel-header">
              <div>
                <span className="eyebrow"><Users size={16} /> User status</span>
                <h2>Live account monitoring</h2>
              </div>
            </div>
            <div className="mini-list">
              {users.map((user) => (
                <article key={user.name} className="monitor-card">
                  <div>
                    <strong>{user.name}</strong>
                    <p>{user.role} - {user.country}</p>
                  </div>
                  <span className={`status-badge ${user.status === 'Restricted' ? 'high' : 'low'}`}>{user.status}</span>
                  <small>{user.email} email - {user.lastSeen}</small>
                </article>
              ))}
            </div>
          </section>

          <section className="admin-panel">
            <div className="admin-panel-header">
              <div>
                <span className="eyebrow"><Store size={16} /> Seller control</span>
                <h2>Seller and gig health</h2>
              </div>
            </div>
            <div className="mini-list">
              {sellerChecks.map((seller) => (
                <article key={seller.seller} className="monitor-card">
                  <div>
                    <strong>{seller.seller}</strong>
                    <p>{seller.gigs} gigs - {seller.orders}</p>
                  </div>
                  <span className={`status-badge ${seller.status === 'Needs review' ? 'medium' : 'low'}`}>{seller.status}</span>
                  <small>Rating {seller.rating}</small>
                </article>
              ))}
            </div>
          </section>

          <section className="admin-panel wide">
            <div className="admin-panel-header">
              <div>
                <span className="eyebrow"><Star size={16} /> Feedback control</span>
                <h2>Moderate ratings and fake reviews</h2>
              </div>
              <button className="ghost-button"><AlertTriangle size={16} /> View Reports</button>
            </div>
            <div className="admin-table dense">
              <div className="table-row feedback heading"><span>Target</span><span>Rating</span><span>Reason</span><span>Status</span><span>Action</span></div>
              {feedbackQueue.map((review) => (
                <div className="table-row feedback" key={`${review.target}-${review.reason}`}>
                  <span>{review.target}</span>
                  <span>{review.rating}</span>
                  <span>{review.reason}</span>
                  <span className={`status-badge ${review.status === 'Reported' ? 'high' : 'low'}`}>{review.status}</span>
                  <span className="row-actions">
                    <button className="ghost-button">Reject</button>
                    <button className="primary-button">Approve</button>
                  </span>
                </div>
              ))}
            </div>
          </section>

          <section className="admin-panel">
            <div className="admin-panel-header">
              <div>
                <span className="eyebrow"><Activity size={16} /> Activity</span>
                <h2>Recent admin and user actions</h2>
              </div>
            </div>
            <div className="activity-list">
              {activities.map((activity, index) => (
                <div className="activity-item" key={activity}>
                  <span>{index + 1}</span>
                  <p>{activity}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="admin-panel">
            <div className="admin-panel-header">
              <div>
                <span className="eyebrow"><UserCheck size={16} /> Usage status</span>
                <h2>Platform health today</h2>
              </div>
            </div>
            <div className="usage-grid">
              <div><strong>1,284</strong><span>Active users</span></div>
              <div><strong>412</strong><span>Applications</span></div>
              <div><strong>96</strong><span>New gigs</span></div>
              <div><strong>18</strong><span>Flagged actions</span></div>
            </div>
          </section>
        </div>
      </main>
    </section>
  );
}

function isAdminPath(path) {
  return path === '/admin' || path.startsWith('/admin/');
}

function jobIdFromPath(path) {
  const match = path.match(/^\/jobs\/([^/]+)$/);
  return match?.[1] || '';
}

function gigIdFromPath(path) {
  const match = path.match(/^\/freelance\/([^/]+)$/);
  return match?.[1] || '';
}

function verticalFromPath(path) {
  const match = path.match(/^\/platform\/([a-z0-9-]+)$/);
  return match?.[1] || '';
}

function listingDetailFromPath(path) {
  const match = path.match(/^\/platform\/([a-z0-9-]+)\/([^/]+)$/);
  return match ? { vertical: match[1], listingId: match[2] } : null;
}

const PATH_TO_PAGE = {
  '/': 'home',
  '/jobs': 'jobs',
  '/freelance': 'freelance',
  '/platform': 'platform',
  '/profile': 'profile',
  '/employer': 'employer',
  '/login': 'login',
  '/signup': 'signup',
  '/admin_login': 'adminLogin'
};

const PAGE_TO_PATH = {
  home: '/',
  jobs: '/jobs',
  freelance: '/freelance',
  platform: '/platform',
  profile: '/profile',
  employer: '/employer',
  login: '/login',
  signup: '/signup',
  adminLogin: '/admin_login',
  admin: '/admin'
};

const THEME_STORAGE_KEY = 'topjobs_theme';

function resolveInitialTheme() {
  try {
    const storedTheme = localStorage.getItem(THEME_STORAGE_KEY);
    if (storedTheme === 'dark' || storedTheme === 'light') return storedTheme;
  } catch {
    // ignore storage errors
  }

  return 'dark';
}

function resolveInitialRoute() {
  const path = window.location.pathname;
  const jobId = jobIdFromPath(path);
  const gigId = gigIdFromPath(path);
  const listingDetail = listingDetailFromPath(path);
  const vertical = verticalFromPath(path);
  if (jobId) return { page: 'jobDetail', jobId, gigId: '', vertical: '', listingId: '' };
  if (gigId) return { page: 'freelanceDetail', jobId: '', gigId, vertical: '', listingId: '' };
  if (listingDetail) return { page: 'listingDetail', jobId: '', gigId: '', vertical: listingDetail.vertical, listingId: listingDetail.listingId };
  if (vertical) return { page: 'platformVertical', jobId: '', gigId: '', vertical, listingId: '' };
  if (isAdminPath(path)) return { page: 'admin', jobId: '', gigId: '', vertical: '', listingId: '' };
  if (PATH_TO_PAGE[path]) return { page: PATH_TO_PAGE[path], jobId: '', gigId: '', vertical: '', listingId: '' };

  try {
    const storedUser = JSON.parse(localStorage.getItem('topjobs_user'));
    if (storedUser?.role === 'admin') return { page: 'admin', jobId: '', gigId: '', vertical: '', listingId: '' };
  } catch {
    // ignore malformed storage
  }

  return { page: 'home', jobId: '', gigId: '', vertical: '', listingId: '' };
}

function applicationJobId(application) {
  const job = application?.job;
  return String(job?._id || job || '');
}

export default function App() {
  const [activePage, setActivePage] = useState(() => resolveInitialRoute().page);
  const [jobDetailId, setJobDetailId] = useState(() => resolveInitialRoute().jobId);
  const [gigDetailId, setGigDetailId] = useState(() => resolveInitialRoute().gigId);
  const [activeVertical, setActiveVertical] = useState(() => resolveInitialRoute().vertical);
  const [listingDetailId, setListingDetailId] = useState(() => resolveInitialRoute().listingId);
  const [theme, setTheme] = useState(resolveInitialTheme);
  const marketplace = useMarketplaceData();

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;
    try {
      localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch {
      // ignore storage errors
    }
  }, [theme]);

  useEffect(() => {
    if (activePage === 'admin') {
      if (!isAdminPath(window.location.pathname)) {
        window.history.pushState(null, '', '/admin');
      }
      return;
    }
    if (activePage === 'jobDetail') {
      const path = jobDetailId ? `/jobs/${jobDetailId}` : '/jobs';
      if (window.location.pathname !== path) {
        window.history.pushState(null, '', path);
      }
      return;
    }
    if (activePage === 'freelanceDetail') {
      const path = gigDetailId ? `/freelance/${gigDetailId}` : '/freelance';
      if (window.location.pathname !== path) {
        window.history.pushState(null, '', path);
      }
      return;
    }
    if (activePage === 'platformVertical') {
      const path = activeVertical ? `/platform/${activeVertical}` : '/platform';
      if (window.location.pathname !== path) {
        window.history.pushState(null, '', path);
      }
      return;
    }
    if (activePage === 'listingDetail') {
      const path = listingDetailId ? `/platform/${activeVertical}/${listingDetailId}` : `/platform/${activeVertical}`;
      if (window.location.pathname !== path) {
        window.history.pushState(null, '', path);
      }
      return;
    }
    const path = PAGE_TO_PATH[activePage] || '/';
    if (window.location.pathname !== path) {
      window.history.pushState(null, '', path);
    }
  }, [activePage, jobDetailId, gigDetailId, activeVertical, listingDetailId]);

  useEffect(() => {
    function onPopState() {
      const route = resolveInitialRoute();
      setActivePage(route.page);
      setJobDetailId(route.jobId || '');
      setGigDetailId(route.gigId || '');
      setActiveVertical(route.vertical || '');
      setListingDetailId(route.listingId || '');
    }
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  useScrollReveal(activePage);
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('topjobs_user'));
    } catch {
      return null;
    }
  });
  const [appliedJobIds, setAppliedJobIds] = useState(() => new Set());

  useEffect(() => {
    let cancelled = false;

    if (!currentUser || currentUser.role === 'admin') {
      setAppliedJobIds(new Set());
      return () => {
        cancelled = true;
      };
    }

    apiRequest('/applications/mine')
      .then((applications) => {
        if (cancelled) return;
        setAppliedJobIds(new Set((applications || []).map(applicationJobId).filter(Boolean)));
      })
      .catch(() => {
        if (!cancelled) setAppliedJobIds(new Set());
      });

    return () => {
      cancelled = true;
    };
  }, [currentUser?.id, currentUser?.email, currentUser?.role]);

  // Admin and regular-user roles are fully separate: an admin account never
  // sees the public navbar or user-facing pages, only the admin console.
  useEffect(() => {
    if (currentUser?.role === 'admin' && activePage !== 'admin') {
      setActivePage('admin');
    }
  }, [currentUser, activePage]);

  function handleAuthSuccess(user) {
    setCurrentUser(user);
    if (user?.role === 'admin') setActivePage('admin');
    else if (user?.role === 'employer') setActivePage('employer');
    else if (user?.role === 'freelancer') setActivePage('freelance');
    else setActivePage('profile');
  }

  function logout() {
    localStorage.removeItem('topjobs_token');
    localStorage.removeItem('topjobs_user');
    setCurrentUser(null);
    setActivePage('home');
  }

  function openJobDetails(job) {
    if (!job?._id) return;
    setJobDetailId(job._id);
    setActivePage('jobDetail');
  }

  function openGigDetails(gig) {
    if (!gig?._id) return;
    setGigDetailId(gig._id);
    setActivePage('freelanceDetail');
  }

  function openVertical(id) {
    if (!id) return;
    setActiveVertical(id);
    setActivePage('platformVertical');
  }

  function openListingDetails(listing) {
    if (!listing?._id) return;
    setActiveVertical(listing.vertical);
    setListingDetailId(listing._id);
    setActivePage('listingDetail');
  }

  function markJobApplied(jobId) {
    if (!jobId) return;
    setAppliedJobIds((current) => {
      const next = new Set(current);
      next.add(String(jobId));
      return next;
    });
  }

  function toggleTheme() {
    setTheme((current) => current === 'dark' ? 'light' : 'dark');
  }

  const pages = {
    home: <Home setActivePage={setActivePage} marketplace={marketplace} onOpenVertical={openVertical} currentUser={currentUser} />,
    jobs: <JobsPage marketplace={marketplace} currentUser={currentUser} setActivePage={setActivePage} onOpenJob={openJobDetails} appliedJobIds={appliedJobIds} onJobApplied={markJobApplied} />,
    jobDetail: <JobDetailPage jobId={jobDetailId} marketplace={marketplace} currentUser={currentUser} setActivePage={setActivePage} onBack={() => setActivePage('jobs')} appliedJobIds={appliedJobIds} onJobApplied={markJobApplied} />,
    profile: <AuthRequired currentUser={currentUser} setActivePage={setActivePage}><ProfilePage currentUser={currentUser} setActivePage={setActivePage} /></AuthRequired>,
    employer: <AuthRequired currentUser={currentUser} setActivePage={setActivePage} roles={['employer', 'admin']}><EmployerPage marketplace={marketplace} /></AuthRequired>,
    freelance: <FreelancePage marketplace={marketplace} currentUser={currentUser} setActivePage={setActivePage} onOpenGig={openGigDetails} />,
    freelanceDetail: <GigDetailPage gigId={gigDetailId} marketplace={marketplace} currentUser={currentUser} setActivePage={setActivePage} onBack={() => setActivePage('freelance')} />,
    platform: <PlatformPage setActivePage={setActivePage} setActiveVertical={setActiveVertical} />,
    platformVertical: <VerticalListingsPage vertical={activeVertical} currentUser={currentUser} setActivePage={setActivePage} onOpenListing={openListingDetails} />,
    listingDetail: <ListingDetailPage listingId={listingDetailId} vertical={activeVertical} currentUser={currentUser} setActivePage={setActivePage} onBack={() => setActivePage('platformVertical')} />,
    admin: <AdminDashboard onLogout={logout} />,
    adminLogin: <main className="auth-page admin-page"><AdminLoginForm onAuthSuccess={handleAuthSuccess} /></main>,
    login: <main className="auth-page"><AuthForm mode="login" onAuthSuccess={handleAuthSuccess} onSwitchMode={() => setActivePage('signup')} /></main>,
    signup: <main className="auth-page"><AuthForm mode="signup" onAuthSuccess={handleAuthSuccess} onSwitchMode={() => setActivePage('login')} /></main>
  };

  const isAdminArea = activePage === 'admin' || activePage === 'adminLogin';

  if (isAdminArea) {
    return <div className={`app admin-app theme-${theme}`}>{pages[activePage]}</div>;
  }

  return (
    <div className={`app theme-${theme}`}>
      <div className="app-ambient-decor" aria-hidden="true">
        <img src={floatingParticles} className="ambient-decor-particles" alt="" />
        <img src={driftingLeaves} className="ambient-decor-leaves" alt="" />
        <img src={flowingLines} className="ambient-decor-lines" alt="" />
      </div>
      <div className="app-content">
        <Navbar activePage={activePage === 'jobDetail' ? 'jobs' : activePage === 'freelanceDetail' ? 'freelance' : activePage === 'listingDetail' ? 'platformVertical' : activePage} setActivePage={setActivePage} currentUser={currentUser} onLogout={logout} theme={theme} onToggleTheme={toggleTheme} onOpenVertical={openVertical} />
        {pages[activePage]}
        <Footer />
      </div>
    </div>
  );
}
