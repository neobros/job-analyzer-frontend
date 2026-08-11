import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  AlertTriangle,
  BadgeCheck,
  BriefcaseBusiness,
  CheckCircle2,
  Clock3,
  Copy,
  Globe2,
  KeyRound,
  Layers3,
  LogOut,
  MapPin,
  MapPinned,
  MessageSquare,
  Pencil,
  PlusCircle,
  RefreshCw,
  Search,
  ShieldCheck,
  Star,
  Store,
  Trash2,
  UserCheck,
  Users,
  X,
  XCircle
} from 'lucide-react';
import { apiRequest, API_BASE_URL } from '../api.js';
import AdminSidebar from './AdminSidebar.jsx';
import CustomSelect from './CustomSelect.jsx';
import Pagination from './Pagination.jsx';
import usePagination from '../hooks/usePagination.js';
import { VERTICALS, findVertical } from '../constants/verticals.js';

const ADMIN_PAGE_SIZE = 10;
const UPLOAD_ORIGIN = API_BASE_URL.replace(/\/api\/?$/, '');

function resolveUploadUrl(relativePath) {
  if (!relativePath) return '';
  return `${UPLOAD_ORIGIN}/${relativePath.replace(/\\/g, '/')}`;
}

const emptyData = { dashboard: {}, users: [], jobs: [], gigs: [], applications: [], reviews: [], locations: [], listings: [] };

const ADMIN_TABS = ['dashboard', 'users', 'sellers', 'approvals', 'listings', 'applications', 'feedback', 'locations', 'activity', 'suspicious'];

function tabFromPath(pathname) {
  const segment = pathname.replace(/^\/admin\/?/, '');
  return ADMIN_TABS.includes(segment) ? segment : 'dashboard';
}

function pathFromTab(tab) {
  return tab === 'dashboard' ? '/admin' : `/admin/${tab}`;
}

function Status({ value }) {
  const normalized = String(value || 'unknown').toLowerCase();
  const danger = ['blocked', 'rejected', 'flagged', 'unverified'].some((word) => normalized.includes(word));
  const warning = ['pending', 'review', 'submitted'].some((word) => normalized.includes(word));
  return <span className={`admin-status ${danger ? 'danger' : warning ? 'warning' : 'success'}`}>{value}</span>;
}

function normalizedStatus(value) {
  return String(value || '').toLowerCase();
}

function canApprove(value) {
  return normalizedStatus(value) !== 'approved';
}

function canReject(value) {
  return normalizedStatus(value) !== 'rejected';
}

function EmptyState({ text }) {
  return <div className="admin-empty"><ShieldCheck size={24} /><p>{text}</p></div>;
}

function Modal({ title, subtitle, onClose, children }) {
  useEffect(() => {
    function onKeyDown(event) {
      if (event.key === 'Escape') onClose();
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [onClose]);

  return (
    <div className="admin-modal-overlay" onClick={onClose}>
      <div className="admin-modal" role="dialog" aria-modal="true" aria-label={title} onClick={(event) => event.stopPropagation()}>
        <div className="admin-modal-header">
          <div>
            <h2>{title}</h2>
            {subtitle ? <p>{subtitle}</p> : null}
          </div>
          <button type="button" className="icon-button" aria-label="Close" onClick={onClose}><X size={18} /></button>
        </div>
        {children}
      </div>
    </div>
  );
}

function pickCharacter(characters) {
  const cryptoApi = globalThis.crypto;
  if (cryptoApi?.getRandomValues) {
    const value = new Uint32Array(1);
    cryptoApi.getRandomValues(value);
    return characters[value[0] % characters.length];
  }
  return characters[Math.floor(Math.random() * characters.length)];
}

function makeTemporaryPassword() {
  const lowercase = 'abcdefghijkmnopqrstuvwxyz';
  const uppercase = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
  const numbers = '23456789';
  const symbols = '!@#$%^&*';
  const all = `${lowercase}${uppercase}${numbers}${symbols}`;
  const characters = [
    pickCharacter(uppercase),
    pickCharacter(lowercase),
    pickCharacter(numbers),
    pickCharacter(symbols),
    ...Array.from({ length: 8 }, () => pickCharacter(all))
  ];
  return characters.sort(() => Math.random() - 0.5).join('');
}

export default function AdminDashboard({ onLogout }) {
  const storedUser = useMemo(() => {
    try { return JSON.parse(localStorage.getItem('topjobs_user')); } catch { return null; }
  }, []);
  const [active, setActive] = useState(() => tabFromPath(window.location.pathname));
  const [data, setData] = useState(emptyData);
  const [loading, setLoading] = useState(true);
  const [workingId, setWorkingId] = useState('');
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [query, setQuery] = useState('');
  const [activity, setActivity] = useState([]);
  const [locationForm, setLocationForm] = useState({ country: '', iso2: '', cities: '' });
  const [cityForms, setCityForms] = useState({});
  const [userForm, setUserForm] = useState({ fullName: '', email: '', password: '', role: 'job_seeker', country: '', city: '', hasPriorityBadge: false });
  const [showAddUser, setShowAddUser] = useState(false);
  const [resetPasswordUser, setResetPasswordUser] = useState(null);
  const [passwordForm, setPasswordForm] = useState({ password: '' });
  const [passwordCopied, setPasswordCopied] = useState(false);
  const [editingReview, setEditingReview] = useState(null);
  const [reviewForm, setReviewForm] = useState({ rating: 5, feedback: '' });
  const [listingVerticalFilter, setListingVerticalFilter] = useState('');
  const [viewingListing, setViewingListing] = useState(null);
  const [listingNotes, setListingNotes] = useState('');
  const [viewingApproval, setViewingApproval] = useState(null);
  const [approvalNotes, setApprovalNotes] = useState('');

  useEffect(() => {
    const path = pathFromTab(active);
    if (window.location.pathname !== path) {
      window.history.replaceState(null, '', path);
    }
  }, [active]);

  useEffect(() => {
    function onPopState() {
      setActive(tabFromPath(window.location.pathname));
    }
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  const loadAdminData = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [dashboard, users, jobs, gigs, applications, reviews, locations, listings] = await Promise.all([
        apiRequest('/admin/dashboard'),
        apiRequest('/admin/users'),
        apiRequest('/admin/jobs'),
        apiRequest('/admin/gigs'),
        apiRequest('/admin/applications'),
        apiRequest('/admin/reviews'),
        apiRequest('/admin/locations'),
        apiRequest('/admin/listings')
      ]);
      setData({ dashboard, users, jobs, gigs, applications, reviews, locations, listings });
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (storedUser?.role === 'admin') loadAdminData();
    else setLoading(false);
  }, [loadAdminData, storedUser]);

  function record(message) {
    setNotice(message);
    setActivity((items) => [{ message, time: new Date().toLocaleTimeString() }, ...items].slice(0, 30));
  }

  async function runAction(id, request, message) {
    setWorkingId(id);
    setError('');
    setNotice('');
    try {
      await request();
      record(message);
      await loadAdminData();
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setWorkingId('');
    }
  }

  function updateUserForm(name, value) {
    setUserForm((current) => ({ ...current, [name]: value, ...(name === 'country' ? { city: '' } : {}) }));
  }

  const activeLocations = useMemo(() => data.locations.filter((location) => location.isActive), [data.locations]);
  const userFormCities = useMemo(
    () => activeLocations.find((location) => location.country === userForm.country)?.cities.filter((city) => city.isActive) || [],
    [activeLocations, userForm.country]
  );

  async function createUser(event) {
    event.preventDefault();
    setWorkingId('new-user');
    setError('');
    setNotice('');
    try {
      await apiRequest('/admin/users', { method: 'POST', body: JSON.stringify(userForm) });
      record(`${userForm.email} added as ${userForm.role.replace('_', ' ')}`);
      setUserForm({ fullName: '', email: '', password: '', role: 'job_seeker', country: '', city: '', hasPriorityBadge: false });
      setShowAddUser(false);
      await loadAdminData();
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setWorkingId('');
    }
  }

  function deleteWithConfirm(id, confirmMessage, request, successMessage) {
    if (!window.confirm(confirmMessage)) return;
    runAction(id, request, successMessage);
  }

  function openPasswordReset(user) {
    setResetPasswordUser(user);
    setPasswordForm({ password: makeTemporaryPassword() });
    setPasswordCopied(false);
  }

  function updateTemporaryPassword(value) {
    setPasswordForm({ password: value });
    setPasswordCopied(false);
  }

  function generatePassword() {
    setPasswordForm({ password: makeTemporaryPassword() });
    setPasswordCopied(false);
  }

  async function copyTemporaryPassword() {
    if (!passwordForm.password) return;
    setError('');
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(passwordForm.password);
      } else {
        const textArea = document.createElement('textarea');
        textArea.value = passwordForm.password;
        textArea.setAttribute('readonly', '');
        textArea.style.position = 'fixed';
        textArea.style.left = '-9999px';
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }
      setPasswordCopied(true);
      window.setTimeout(() => setPasswordCopied(false), 1800);
    } catch {
      setError('Could not copy password. Select the password text and copy it manually.');
    }
  }

  async function savePasswordReset(event) {
    event.preventDefault();
    setWorkingId(`password-${resetPasswordUser._id}`);
    setError('');
    setNotice('');
    try {
      await apiRequest(`/admin/users/${resetPasswordUser._id}/password`, {
        method: 'PATCH',
        body: JSON.stringify({ password: passwordForm.password })
      });
      record(`Password reset for ${resetPasswordUser.email}`);
      setResetPasswordUser(null);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setWorkingId('');
    }
  }

  function openReviewEdit(review) {
    setEditingReview(review);
    setReviewForm({ rating: review.rating, feedback: review.feedback });
  }

  async function saveReviewEdit(event) {
    event.preventDefault();
    setWorkingId(editingReview._id);
    setError('');
    setNotice('');
    try {
      await apiRequest(`/admin/reviews/${editingReview._id}`, {
        method: 'PUT',
        body: JSON.stringify({ rating: Number(reviewForm.rating), feedback: reviewForm.feedback })
      });
      record(`Feedback from ${editingReview.reviewer?.email || 'unknown reviewer'} updated`);
      setEditingReview(null);
      await loadAdminData();
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setWorkingId('');
    }
  }

  function openListingDetails(listing) {
    setViewingListing(listing);
    setListingNotes(listing.adminNotes || '');
  }

  async function saveListingNotes(event) {
    event.preventDefault();
    setWorkingId(`notes-${viewingListing._id}`);
    setError('');
    setNotice('');
    try {
      await apiRequest(`/admin/listings/${viewingListing._id}/moderate`, {
        method: 'PATCH',
        body: JSON.stringify({ status: viewingListing.status, adminNotes: listingNotes })
      });
      record(`Notes saved for ${viewingListing.title}`);
      setViewingListing(null);
      await loadAdminData();
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setWorkingId('');
    }
  }

  function openApprovalDetails(item, kind) {
    setViewingApproval({ item, kind });
    setApprovalNotes(item.adminNotes || '');
  }

  async function saveApprovalNotes(event) {
    event.preventDefault();
    const { item, kind } = viewingApproval;
    const endpoint = kind === 'job' ? `/admin/jobs/${item._id}/moderate` : `/admin/gigs/${item._id}/moderate`;
    const body = kind === 'job'
      ? { status: item.status, adminNotes: approvalNotes, isFeatured: item.isFeatured }
      : { status: item.status, adminNotes: approvalNotes };
    setWorkingId(`notes-${item._id}`);
    setError('');
    setNotice('');
    try {
      await apiRequest(endpoint, { method: 'PATCH', body: JSON.stringify(body) });
      record(`Notes saved for ${item.title}`);
      setViewingApproval(null);
      await loadAdminData();
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setWorkingId('');
    }
  }

  function logout() {
    localStorage.removeItem('topjobs_token');
    localStorage.removeItem('topjobs_user');
    onLogout?.();
  }

  if (storedUser?.role !== 'admin') {
    return (
      <section className="admin-access-denied">
        <AlertTriangle size={34} />
        <h1>Admin access required</h1>
        <p>Log in with a verified administrator account to open this area.</p>
        <button className="primary-button" onClick={logout}>Go to Login</button>
      </section>
    );
  }

  const counts = {
    users: data.users.length,
    sellers: data.users.filter((user) => user.role === 'freelancer').length,
    approvals: data.jobs.filter((job) => job.status === 'pending').length + data.gigs.filter((gig) => gig.status === 'pending').length,
    listings: data.listings.filter((item) => item.status === 'pending').length,
    applications: data.applications.length,
    feedback: data.reviews.filter((review) => review.status === 'pending').length,
    locations: data.locations.length,
    suspicious: data.users.filter((user) => user.isBlocked || !user.isEmailVerified).length
  };

  const filter = (value) => String(value || '').toLowerCase().includes(query.toLowerCase());
  const filteredUsers = data.users.filter((user) => filter(user.email) || filter(user.role));
  const sellers = filteredUsers.filter((user) => user.role === 'freelancer');
  const suspicious = filteredUsers.filter((user) => user.isBlocked || !user.isEmailVerified || !user.isVerifiedByAdmin);

  const headerTitles = {
    dashboard: ['Operations overview', 'Live marketplace totals and moderation workload.'],
    users: ['User management', 'Verify, restrict, unblock, and inspect registered accounts.'],
    sellers: ['Seller management', 'Control freelancer verification and account access.'],
    approvals: ['Post approvals', 'Review jobs and service gigs before publication.'],
    listings: ['Listing management', 'Review and moderate listings across all 15 marketplace verticals.'],
    applications: ['Application monitoring', 'Track applications without exposing direct contact details.'],
    feedback: ['Feedback moderation', 'Approve valid ratings and reject reported or fake feedback.'],
    locations: ['Location management', 'Control the countries and cities shown in signup and job search.'],
    activity: ['Activity log', 'Actions completed during this admin session.'],
    suspicious: ['Risk monitoring', 'Accounts requiring identity, email, or behavior checks.']
  };

  const [title, subtitle] = headerTitles[active];

  return (
    <section className="admin-console">
      <AdminSidebar active={active} onChange={setActive} counts={counts} />
      <main className="admin-workspace">
        <header className="admin-topbar">
          <div><span>Administration</span><h1>{title}</h1><p>{subtitle}</p></div>
          <div className="admin-top-actions">
            <button className="icon-button" title="Refresh data" onClick={loadAdminData}><RefreshCw size={18} className={loading ? 'spin' : ''} /></button>
            <button className="ghost-button" onClick={logout}><LogOut size={17} /> Logout</button>
          </div>
        </header>

        {error ? <div className="admin-alert error"><AlertTriangle size={18} /> {error}</div> : null}
        {notice ? <div className="admin-alert success"><CheckCircle2 size={18} /> {notice}</div> : null}

        {active !== 'dashboard' && active !== 'activity' ? (
          <div className="admin-toolbar">
            <label className="admin-search">
              <Search size={18} />
              <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search this view" />
              {query ? (
                <button type="button" className="admin-search-clear" aria-label="Clear search" onClick={() => setQuery('')}>
                  <X size={14} />
                </button>
              ) : null}
            </label>
            {active === 'listings' ? (
              <CustomSelect
                icon={Layers3}
                value={listingVerticalFilter}
                placeholder="All verticals"
                options={[{ value: '', label: 'All verticals' }, ...VERTICALS.map((vertical) => ({ value: vertical.id, label: vertical.name }))]}
                onChange={setListingVerticalFilter}
              />
            ) : null}
            {active === 'users' ? (
              <button type="button" className="primary-button" onClick={() => setShowAddUser(true)}>
                <PlusCircle size={17} /> Add User
              </button>
            ) : null}
          </div>
        ) : null}

        {loading ? <div className="admin-loading"><RefreshCw className="spin" size={24} /> Loading admin data...</div> : null}

        {!loading && active === 'dashboard' ? (
          <div className="admin-dashboard-content">
            <div className="admin-metrics">
              {[
                ['Users', data.dashboard.users || 0, Users],
                ['Jobs', data.dashboard.jobs || 0, BriefcaseBusiness],
                ['Gigs', data.dashboard.gigs || 0, Store],
                ['Listings', data.dashboard.listings || 0, Layers3],
                ['Applications', data.dashboard.applications || 0, MessageSquare],
                ['Reviews', data.dashboard.reviews || 0, Star],
                ['Locations', data.dashboard.locations || 0, MapPinned]
              ].map(([label, value, Icon]) => <article key={label}><Icon size={20} /><strong>{value}</strong><span>{label}</span></article>)}
            </div>
            <div className="admin-overview-grid">
              <section className="admin-data-panel"><h2>Moderation queue</h2><div className="queue-metric"><span>Pending jobs</span><strong>{data.jobs.filter((item) => item.status === 'pending').length}</strong></div><div className="queue-metric"><span>Pending gigs</span><strong>{data.gigs.filter((item) => item.status === 'pending').length}</strong></div><div className="queue-metric"><span>Pending listings</span><strong>{counts.listings}</strong></div><div className="queue-metric"><span>Pending reviews</span><strong>{counts.feedback}</strong></div></section>
              <section className="admin-data-panel"><h2>Account health</h2><div className="queue-metric"><span>Verified users</span><strong>{data.users.filter((item) => item.isVerifiedByAdmin).length}</strong></div><div className="queue-metric"><span>Priority badge users</span><strong>{data.users.filter((item) => item.hasPriorityBadge).length}</strong></div><div className="queue-metric"><span>Email unverified</span><strong>{data.users.filter((item) => !item.isEmailVerified).length}</strong></div><div className="queue-metric"><span>Blocked users</span><strong>{data.users.filter((item) => item.isBlocked).length}</strong></div></section>
            </div>
          </div>
        ) : null}

        {showAddUser ? (
          <Modal title="Add user" subtitle="Creates an already-verified account with optional priority badge" onClose={() => setShowAddUser(false)}>
            <form className="admin-create-form modal-form" onSubmit={createUser}>
              <input name="fullName" value={userForm.fullName} onChange={(event) => updateUserForm('fullName', event.target.value)} placeholder="Full name" required autoFocus />
              <input name="email" type="email" value={userForm.email} onChange={(event) => updateUserForm('email', event.target.value)} placeholder="Email address" required />
              <input name="password" type="password" value={userForm.password} onChange={(event) => updateUserForm('password', event.target.value)} placeholder="Temporary password" required />
              <select name="role" value={userForm.role} onChange={(event) => updateUserForm('role', event.target.value)}>
                <option value="job_seeker">Job seeker</option>
                <option value="employer">Employer</option>
                <option value="freelancer">Freelancer</option>
                <option value="admin">Admin</option>
              </select>
              <label className="admin-check-row">
                <input
                  type="checkbox"
                  checked={userForm.hasPriorityBadge}
                  onChange={(event) => updateUserForm('hasPriorityBadge', event.target.checked)}
                />
                <span><BadgeCheck size={16} /> Priority badge user</span>
              </label>
              <CustomSelect
                icon={Globe2}
                value={userForm.country}
                placeholder="Country (optional)"
                options={activeLocations.map((location) => ({ value: location.country, label: location.country }))}
                onChange={(value) => updateUserForm('country', value)}
              />
              <CustomSelect
                icon={MapPin}
                value={userForm.city}
                placeholder={userForm.country ? 'City (optional)' : 'Choose country first'}
                disabled={!userForm.country}
                options={userFormCities.map((city) => ({ value: city.name, label: city.name }))}
                onChange={(value) => updateUserForm('city', value)}
              />
              <div className="admin-modal-actions">
                <button type="button" className="ghost-button" onClick={() => setShowAddUser(false)}>Cancel</button>
                <button className="primary-button" type="submit" disabled={workingId === 'new-user'}><PlusCircle size={17} /> Add User</button>
              </div>
            </form>
          </Modal>
        ) : null}

        {editingReview ? (
          <Modal title="Edit feedback" subtitle={editingReview.reviewer?.email || 'Unknown reviewer'} onClose={() => setEditingReview(null)}>
            <form className="admin-create-form modal-form" onSubmit={saveReviewEdit}>
              <select value={reviewForm.rating} onChange={(event) => setReviewForm((current) => ({ ...current, rating: event.target.value }))}>
                {[5, 4, 3, 2, 1].map((value) => <option key={value} value={value}>{value} star{value === 1 ? '' : 's'}</option>)}
              </select>
              <textarea
                value={reviewForm.feedback}
                onChange={(event) => setReviewForm((current) => ({ ...current, feedback: event.target.value }))}
                placeholder="Feedback text"
                rows={4}
                required
              />
              <div className="admin-modal-actions">
                <button type="button" className="ghost-button" onClick={() => setEditingReview(null)}>Cancel</button>
                <button className="primary-button" type="submit" disabled={workingId === editingReview._id}>Save Changes</button>
              </div>
            </form>
          </Modal>
        ) : null}

        {resetPasswordUser ? (
          <Modal title="Reset password" subtitle={resetPasswordUser.email} onClose={() => setResetPasswordUser(null)}>
            <form className="admin-create-form modal-form" onSubmit={savePasswordReset}>
              <p className="admin-security-note">Current password cannot be viewed. Set a new temporary password here, copy it, then share it with the user.</p>
              <input
                name="password"
                type="text"
                value={passwordForm.password}
                onChange={(event) => updateTemporaryPassword(event.target.value)}
                placeholder="New temporary password"
                required
                autoFocus
              />
              <div className="admin-password-actions">
                <button type="button" className="ghost-button" onClick={generatePassword}>
                  <RefreshCw size={16} /> Generate Password
                </button>
                <button type="button" className="ghost-button" onClick={copyTemporaryPassword}>
                  {passwordCopied ? <CheckCircle2 size={16} /> : <Copy size={16} />}
                  {passwordCopied ? 'Copied' : 'Copy Password'}
                </button>
              </div>
              <div className="admin-modal-actions">
                <button type="button" className="ghost-button" onClick={() => setResetPasswordUser(null)}>Cancel</button>
                <button className="primary-button" type="submit" disabled={workingId === `password-${resetPasswordUser._id}`}>
                  <KeyRound size={17} /> Save Password
                </button>
              </div>
            </form>
          </Modal>
        ) : null}

        {viewingListing ? (
          <Modal title={viewingListing.title} subtitle={findVertical(viewingListing.vertical)?.name || viewingListing.vertical} onClose={() => setViewingListing(null)}>
            <form className="admin-create-form modal-form" onSubmit={saveListingNotes}>
              <p className="admin-security-note">{viewingListing.description}</p>
              <div className="listing-detail-list">
                <div><span>Owner</span><strong>{viewingListing.owner?.email || 'Unknown'}</strong></div>
                <div><span>Category</span><strong>{viewingListing.category || '—'}</strong></div>
                <div><span>Price</span><strong>{Number(viewingListing.price) ? `$${Number(viewingListing.price).toLocaleString()}` : '—'}</strong></div>
                <div><span>Location</span><strong>{[viewingListing.city, viewingListing.country].filter(Boolean).join(', ') || '—'}</strong></div>
                {Object.entries(viewingListing.details || {}).map(([key, value]) => (
                  <div key={key}><span>{key}</span><strong>{String(value)}</strong></div>
                ))}
              </div>
              <textarea
                value={listingNotes}
                onChange={(event) => setListingNotes(event.target.value)}
                placeholder="Admin notes (not visible to the public)"
                rows={3}
              />
              <div className="admin-modal-actions">
                <button type="button" className="ghost-button" onClick={() => setViewingListing(null)}>Close</button>
                <button className="primary-button" type="submit" disabled={workingId === `notes-${viewingListing._id}`}>Save Notes</button>
              </div>
            </form>
          </Modal>
        ) : null}

        {viewingApproval ? (
          <ApprovalDetailsModal
            item={viewingApproval.item}
            kind={viewingApproval.kind}
            notes={approvalNotes}
            onNotesChange={setApprovalNotes}
            onClose={() => setViewingApproval(null)}
            onSubmit={saveApprovalNotes}
            saving={workingId === `notes-${viewingApproval.item._id}`}
          />
        ) : null}

        {!loading && ['users', 'sellers', 'suspicious'].includes(active) ? (
          <UserTable key={`${active}-${query}`} users={active === 'sellers' ? sellers : active === 'suspicious' ? suspicious : filteredUsers} workingId={workingId} onAction={runAction} onDelete={deleteWithConfirm} onResetPassword={openPasswordReset} />
        ) : null}

        {!loading && active === 'approvals' ? (
          <ApprovalTables key={query} data={data} query={query} filter={filter} workingId={workingId} onAction={runAction} onDelete={deleteWithConfirm} onView={openApprovalDetails} />
        ) : null}

        {!loading && active === 'listings' ? (
          <ListingsModerationTable
            key={`${query}-${listingVerticalFilter}`}
            items={data.listings.filter((item) => (!listingVerticalFilter || item.vertical === listingVerticalFilter) && (filter(item.title) || filter(item.owner?.email) || filter(item.category)))}
            workingId={workingId}
            onAction={runAction}
            onDelete={deleteWithConfirm}
            onView={openListingDetails}
          />
        ) : null}

        {!loading && active === 'applications' ? (
          <ApplicationTable key={query} applications={data.applications.filter((item) => filter(item.job?.title) || filter(item.applicant?.email))} workingId={workingId} onAction={runAction} />
        ) : null}

        {!loading && active === 'feedback' ? (
          <ReviewTable
            key={query}
            reviews={data.reviews.filter((item) => filter(item.feedback) || filter(item.reviewer?.email))}
            workingId={workingId}
            onAction={runAction}
            onDelete={deleteWithConfirm}
            onEdit={openReviewEdit}
          />
        ) : null}

        {!loading && active === 'locations' ? (
          <LocationManager
            key={query}
            locations={data.locations.filter((item) => filter(item.country) || filter(item.iso2) || item.cities.some((city) => filter(city.name)))}
            form={locationForm}
            setForm={setLocationForm}
            cityForms={cityForms}
            setCityForms={setCityForms}
            workingId={workingId}
            onAction={runAction}
          />
        ) : null}

        {!loading && active === 'activity' ? (
          <ActivityLog activity={activity} />
        ) : null}
      </main>
    </section>
  );
}

function ActivityLog({ activity }) {
  const pagination = usePagination(activity, ADMIN_PAGE_SIZE);
  if (!activity.length) return <EmptyState text="No actions recorded in this session yet." />;
  return (
    <section className="admin-data-panel">
      {pagination.pageItems.map((item) => (
        <div className="admin-log" key={`${item.time}-${item.message}`}>
          <CheckCircle2 size={17} /><span>{item.message}</span><time>{item.time}</time>
        </div>
      ))}
      <Pagination {...pagination} onChange={pagination.setPage} />
    </section>
  );
}

function UserTable({ users, workingId, onAction, onDelete, onResetPassword }) {
  const pagination = usePagination(users, ADMIN_PAGE_SIZE);
  if (!users.length) return <EmptyState text="No users match this view." />;
  return (
    <section className="admin-data-panel table-panel">
      <div className="admin-data-row admin-data-head users">
        <span>Account</span><span>Role</span><span>Email</span><span>Admin check</span><span>Badge</span><span>Access</span><span>Password</span><span>Actions</span>
      </div>
      {pagination.pageItems.map((user) => {
        const isWorking = workingId === user._id || workingId === `password-${user._id}`;
        return (
          <div className="admin-data-row users" key={user._id}>
            <span><strong>{user.email}</strong><small>Joined {new Date(user.createdAt).toLocaleDateString()}</small></span>
            <span>{user.role}</span>
            <span><Status value={user.isEmailVerified ? 'Verified' : 'Unverified'} /></span>
            <span><Status value={user.isVerifiedByAdmin ? 'Approved' : 'Pending'} /></span>
            <span><Status value={user.hasPriorityBadge ? 'Priority' : 'Normal'} /></span>
            <span><Status value={user.isBlocked ? 'Blocked' : 'Active'} /></span>
            <span className="admin-password-cell">
              <strong>Protected</strong>
              <button className="compact-button" disabled={isWorking} onClick={() => onResetPassword(user)}>
                <KeyRound size={15} />Reset
              </button>
            </span>
            <span className="admin-row-actions">
              <button className="compact-button approve" disabled={isWorking} onClick={() => onAction(user._id, () => apiRequest(`/admin/users/${user._id}`, { method: 'PATCH', body: JSON.stringify({ isVerifiedByAdmin: !user.isVerifiedByAdmin, isBlocked: user.isBlocked, role: user.role, hasPriorityBadge: user.hasPriorityBadge }) }), user.isVerifiedByAdmin ? `Verification removed for ${user.email}` : `${user.email} verified`)}>
                <UserCheck size={15} />{user.isVerifiedByAdmin ? 'Unverify' : 'Verify'}
              </button>
              <button className={`compact-button ${user.hasPriorityBadge ? 'danger' : 'approve'}`} disabled={isWorking} onClick={() => onAction(user._id, () => apiRequest(`/admin/users/${user._id}`, { method: 'PATCH', body: JSON.stringify({ hasPriorityBadge: !user.hasPriorityBadge, isBlocked: user.isBlocked, isVerifiedByAdmin: user.isVerifiedByAdmin, role: user.role }) }), user.hasPriorityBadge ? `Priority badge removed for ${user.email}` : `${user.email} marked as priority badge user`)}>
                <BadgeCheck size={15} />{user.hasPriorityBadge ? 'Unbadge' : 'Badge'}
              </button>
              <button className="compact-button danger" disabled={isWorking} onClick={() => onAction(user._id, () => apiRequest(`/admin/users/${user._id}`, { method: 'PATCH', body: JSON.stringify({ isBlocked: !user.isBlocked, isVerifiedByAdmin: user.isVerifiedByAdmin, role: user.role, hasPriorityBadge: user.hasPriorityBadge }) }), user.isBlocked ? `${user.email} unblocked` : `${user.email} blocked`)}>
                {user.isBlocked ? <CheckCircle2 size={15} /> : <XCircle size={15} />}{user.isBlocked ? 'Unblock' : 'Block'}
              </button>
              <button className="compact-button danger" disabled={isWorking} onClick={() => onDelete(user._id, `Delete ${user.email}? This cannot be undone.`, () => apiRequest(`/admin/users/${user._id}`, { method: 'DELETE' }), `${user.email} deleted`)}>
                <Trash2 size={15} />Delete
              </button>
            </span>
          </div>
        );
      })}
      <Pagination {...pagination} onChange={pagination.setPage} />
    </section>
  );
}

function ApprovalDetailsModal({ item, kind, notes, onNotesChange, onClose, onSubmit, saving }) {
  const isJob = kind === 'job';
  const ownerEmail = isJob ? item.employer?.email : item.seller?.email;

  return (
    <Modal title={item.title} subtitle={isJob ? 'Job post' : 'Service gig'} onClose={onClose}>
      <form className="admin-create-form modal-form" onSubmit={onSubmit}>
        <p className="admin-security-note">{item.description}</p>
        <div className="listing-detail-list">
          <div><span>Owner</span><strong>{ownerEmail || 'Unknown'}</strong></div>
          <div><span>Category</span><strong>{item.category || '—'}</strong></div>
          <div><span>Status</span><strong>{item.status}</strong></div>
          <div><span>Posted</span><strong>{new Date(item.createdAt).toLocaleDateString()}</strong></div>
          {isJob ? (
            <>
              <div><span>Job type</span><strong>{(item.type || '—').replace('_', ' ')}</strong></div>
              <div><span>Salary</span><strong>{item.salary || '—'}</strong></div>
              <div><span>Location</span><strong>{[item.city, item.country].filter(Boolean).join(', ') || '—'}</strong></div>
              <div><span>Featured</span><strong>{item.isFeatured ? 'Yes' : 'No'}</strong></div>
              {item.skills?.length ? <div><span>Skills</span><strong>{item.skills.join(', ')}</strong></div> : null}
            </>
          ) : (
            <>
              <div><span>Price</span><strong>{Number(item.price) ? `$${Number(item.price).toLocaleString()}` : '—'}</strong></div>
              <div><span>Delivery time</span><strong>{item.deliveryTime || '—'}</strong></div>
              <div><span>Rating</span><strong>{item.ratingCount ? `${Number(item.ratingAverage || 0).toFixed(1)} / 5 (${item.ratingCount})` : 'No ratings yet'}</strong></div>
            </>
          )}
        </div>
        {isJob && item.requirements ? (
          <p className="admin-security-note"><strong>Requirements: </strong>{item.requirements}</p>
        ) : null}
        {!isJob && item.portfolioImages?.length ? (
          <div className="gig-detail-portfolio">
            {item.portfolioImages.map((image) => <img key={image} src={resolveUploadUrl(image)} alt="" />)}
          </div>
        ) : null}
        <textarea
          value={notes}
          onChange={(event) => onNotesChange(event.target.value)}
          placeholder="Admin notes (not visible to the public)"
          rows={3}
        />
        <div className="admin-modal-actions">
          <button type="button" className="ghost-button" onClick={onClose}>Close</button>
          <button className="primary-button" type="submit" disabled={saving}>Save Notes</button>
        </div>
      </form>
    </Modal>
  );
}

function ApprovalTables({ data, filter, workingId, onAction, onDelete, onView }) {
  const jobs = data.jobs.filter((item) => filter(item.title) || filter(item.employer?.email));
  const gigs = data.gigs.filter((item) => filter(item.title) || filter(item.seller?.email));
  return (
    <div className="admin-stack">
      <ModerationTable
        title="Job posts"
        items={jobs}
        ownerKey="employer"
        workingId={workingId}
        onAction={(item, status) => onAction(item._id, () => apiRequest(`/admin/jobs/${item._id}/moderate`, { method: 'PATCH', body: JSON.stringify({ status, isFeatured: item.isFeatured }) }), `${item.title} ${status}`)}
        onDelete={(item) => onDelete(item._id, `Delete "${item.title}"? This cannot be undone.`, () => apiRequest(`/admin/jobs/${item._id}`, { method: 'DELETE' }), `${item.title} deleted`)}
        onView={(item) => onView(item, 'job')}
      />
      <ModerationTable
        title="Service gigs"
        items={gigs}
        ownerKey="seller"
        workingId={workingId}
        onAction={(item, status) => onAction(item._id, () => apiRequest(`/admin/gigs/${item._id}/moderate`, { method: 'PATCH', body: JSON.stringify({ status }) }), `${item.title} ${status}`)}
        onDelete={(item) => onDelete(item._id, `Delete "${item.title}"? This cannot be undone.`, () => apiRequest(`/admin/gigs/${item._id}`, { method: 'DELETE' }), `${item.title} deleted`)}
        onView={(item) => onView(item, 'gig')}
      />
    </div>
  );
}

function ModerationTable({ title, items, ownerKey, workingId, onAction, onDelete, onView }) {
  const pagination = usePagination(items, ADMIN_PAGE_SIZE);
  return (
    <section className="admin-data-panel table-panel">
      <div className="panel-title"><h2>{title}</h2><span>{items.length} records</span></div>
      {items.length ? (
        <>
          <div className="admin-data-row admin-data-head posts"><span>Post</span><span>Owner</span><span>Category</span><span>Status</span><span>Actions</span></div>
          {pagination.pageItems.map((item) => (
            <div className="admin-data-row posts" key={item._id}>
              <span><strong>{item.title}</strong><small>{new Date(item.createdAt).toLocaleDateString()}</small></span>
              <span>{item[ownerKey]?.email || 'Unknown'}</span>
              <span>{item.category}</span>
              <span><Status value={item.status} /></span>
              <span className="admin-row-actions">
                <button className="compact-button" disabled={workingId === item._id} onClick={() => onView(item)}>
                  <Search size={15} />Details
                </button>
                {canApprove(item.status) ? (
                  <button className="compact-button approve" disabled={workingId === item._id} onClick={() => onAction(item, 'approved')}>
                    <CheckCircle2 size={15} />Approve
                  </button>
                ) : null}
                {canReject(item.status) ? (
                  <button className="compact-button danger" disabled={workingId === item._id} onClick={() => onAction(item, 'rejected')}>
                    <XCircle size={15} />Reject
                  </button>
                ) : null}
                <button className="compact-button danger" disabled={workingId === item._id} onClick={() => onDelete(item)}>
                  <Trash2 size={15} />Delete
                </button>
              </span>
            </div>
          ))}
          <Pagination {...pagination} onChange={pagination.setPage} />
        </>
      ) : <EmptyState text={`No ${title.toLowerCase()} found.`} />}
    </section>
  );
}

function ListingsModerationTable({ items, workingId, onAction, onDelete, onView }) {
  const pagination = usePagination(items, ADMIN_PAGE_SIZE);
  return (
    <section className="admin-data-panel table-panel">
      <div className="panel-title"><h2>Listings</h2><span>{items.length} records</span></div>
      {items.length ? (
        <>
          <div className="admin-data-row admin-data-head listings"><span>Post</span><span>Owner</span><span>Vertical</span><span>Category</span><span>Status</span><span>Actions</span></div>
          {pagination.pageItems.map((item) => {
            const vertical = findVertical(item.vertical);
            const VerticalIcon = vertical?.icon;
            return (
              <div className="admin-data-row listings" key={item._id}>
                <span><strong>{item.title}</strong><small>{new Date(item.createdAt).toLocaleDateString()}</small></span>
                <span>{item.owner?.email || 'Unknown'}</span>
                <span className="listing-vertical-badge">{VerticalIcon ? <VerticalIcon size={14} /> : null} {vertical?.name || item.vertical}</span>
                <span>{item.category || '—'}</span>
                <span><Status value={item.status} /></span>
                <span className="admin-row-actions">
                  <button className="compact-button" disabled={workingId === item._id} onClick={() => onView(item)}>
                    <Search size={15} />Details
                  </button>
                  {canApprove(item.status) ? (
                    <button className="compact-button approve" disabled={workingId === item._id} onClick={() => onAction(item._id, () => apiRequest(`/admin/listings/${item._id}/moderate`, { method: 'PATCH', body: JSON.stringify({ status: 'approved', adminNotes: item.adminNotes }) }), `${item.title} approved`)}>
                      <CheckCircle2 size={15} />Approve
                    </button>
                  ) : null}
                  {canReject(item.status) ? (
                    <button className="compact-button danger" disabled={workingId === item._id} onClick={() => onAction(item._id, () => apiRequest(`/admin/listings/${item._id}/moderate`, { method: 'PATCH', body: JSON.stringify({ status: 'rejected', adminNotes: item.adminNotes }) }), `${item.title} rejected`)}>
                      <XCircle size={15} />Reject
                    </button>
                  ) : null}
                  <button className="compact-button danger" disabled={workingId === item._id} onClick={() => onDelete(item._id, `Delete "${item.title}"? This cannot be undone.`, () => apiRequest(`/admin/listings/${item._id}`, { method: 'DELETE' }), `${item.title} deleted`)}>
                    <Trash2 size={15} />Delete
                  </button>
                </span>
              </div>
            );
          })}
          <Pagination {...pagination} onChange={pagination.setPage} />
        </>
      ) : <EmptyState text="No listings found." />}
    </section>
  );
}

function LocationManager({ locations, form, setForm, cityForms, setCityForms, workingId, onAction }) {
  const pagination = usePagination(locations, ADMIN_PAGE_SIZE);

  function updateForm(event) {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  }

  function addCountry(event) {
    event.preventDefault();
    onAction(
      `location-${form.country}`,
      () => apiRequest('/admin/locations', { method: 'POST', body: JSON.stringify(form) }),
      `${form.country} saved to locations`
    );
    setForm({ country: '', iso2: '', cities: '' });
  }

  function addCity(event, location) {
    event.preventDefault();
    const name = cityForms[location._id];
    onAction(
      `city-${location._id}`,
      () => apiRequest(`/admin/locations/${location._id}/cities`, { method: 'POST', body: JSON.stringify({ name }) }),
      `${name} added to ${location.country}`
    );
    setCityForms((current) => ({ ...current, [location._id]: '' }));
  }

  return (
    <div className="admin-stack">
      <section className="admin-data-panel">
        <div className="panel-title"><h2>Add country</h2><span>Saved in MongoDB</span></div>
        <form className="admin-inline-form" onSubmit={addCountry}>
          <input name="country" value={form.country} onChange={updateForm} placeholder="Country name" required />
          <input name="iso2" value={form.iso2} onChange={updateForm} placeholder="ISO code" maxLength="2" />
          <input name="cities" value={form.cities} onChange={updateForm} placeholder="Cities, comma separated" />
          <button className="primary-button" type="submit"><PlusCircle size={17} /> Save</button>
        </form>
      </section>

      <section className="admin-data-panel table-panel">
        <div className="panel-title"><h2>Countries and cities</h2><span>{locations.length} countries</span></div>
        {locations.length ? (
          <>
            <div className="admin-data-row admin-data-head locations"><span>Country</span><span>Cities</span><span>Status</span><span>Actions</span></div>
            {pagination.pageItems.map((location) => (
              <div className="admin-data-row locations" key={location._id}>
                <span><strong>{location.country}</strong><small>{location.iso2 || 'No ISO code'} · {location.cities.length} cities</small></span>
                <span className="city-chip-list">
                  {location.cities.map((city) => (
                    <button
                      key={city._id}
                      className={`city-chip ${city.isActive ? '' : 'inactive'}`}
                      disabled={workingId === city._id}
                      onClick={() => onAction(city._id, () => apiRequest(`/admin/locations/${location._id}/cities/${city._id}`, { method: 'PATCH', body: JSON.stringify({ isActive: !city.isActive }) }), `${city.name} ${city.isActive ? 'hidden' : 'shown'}`)}
                      type="button"
                    >
                      {city.name}
                    </button>
                  ))}
                </span>
                <span><Status value={location.isActive ? 'Active' : 'Hidden'} /></span>
                <span className="admin-row-actions location-actions">
                  <form onSubmit={(event) => addCity(event, location)}>
                    <input value={cityForms[location._id] || ''} onChange={(event) => setCityForms((current) => ({ ...current, [location._id]: event.target.value }))} placeholder="New city" required />
                    <button className="compact-button approve" disabled={workingId === `city-${location._id}`} type="submit"><PlusCircle size={15} />City</button>
                  </form>
                  <button className="compact-button danger" disabled={workingId === location._id} onClick={() => onAction(location._id, () => apiRequest(`/admin/locations/${location._id}`, { method: 'PATCH', body: JSON.stringify({ country: location.country, iso2: location.iso2, isActive: !location.isActive }) }), `${location.country} ${location.isActive ? 'hidden' : 'shown'}`)}>{location.isActive ? 'Hide' : 'Show'}</button>
                </span>
              </div>
            ))}
            <Pagination {...pagination} onChange={pagination.setPage} />
          </>
        ) : <EmptyState text="No locations found." />}
      </section>
    </div>
  );
}

function ApplicationTable({ applications, workingId, onAction }) {
  const pagination = usePagination(applications, ADMIN_PAGE_SIZE);
  if (!applications.length) return <EmptyState text="No applications found." />;
  return (
    <section className="admin-data-panel table-panel">
      <div className="admin-data-row admin-data-head applications"><span>Job</span><span>Applicant</span><span>Submitted</span><span>Status</span><span>Actions</span></div>
      {pagination.pageItems.map((item) => <div className="admin-data-row applications" key={item._id}><span><strong>{item.job?.title || 'Deleted job'}</strong></span><span>{item.applicant?.email || 'Unknown'}</span><span>{new Date(item.createdAt).toLocaleDateString()}</span><span><Status value={item.status} /></span><span className="admin-row-actions"><button className="compact-button approve" disabled={workingId === item._id} onClick={() => onAction(item._id, () => apiRequest(`/applications/${item._id}/status`, { method: 'PATCH', body: JSON.stringify({ status: 'under_review' }) }), 'Application moved to under review')}><Clock3 size={15} />Review</button><button className="compact-button" disabled={workingId === item._id} onClick={() => onAction(item._id, () => apiRequest(`/applications/${item._id}/status`, { method: 'PATCH', body: JSON.stringify({ status: 'admin_contacted' }) }), 'Applicant contact process started')}><MessageSquare size={15} />Contact</button></span></div>)}
      <Pagination {...pagination} onChange={pagination.setPage} />
    </section>
  );
}

function ReviewTable({ reviews, workingId, onAction, onDelete, onEdit }) {
  const pagination = usePagination(reviews, ADMIN_PAGE_SIZE);
  if (!reviews.length) return <EmptyState text="No feedback records found." />;
  return (
    <section className="admin-data-panel table-panel">
      <div className="admin-data-row admin-data-head reviews"><span>Reviewer</span><span>Feedback</span><span>Rating</span><span>Status</span><span>Actions</span></div>
      {pagination.pageItems.map((item) => (
        <div className="admin-data-row reviews" key={item._id}>
          <span>{item.reviewer?.email || 'Unknown'}</span>
          <span><strong>{item.feedback}</strong></span>
          <span>{item.rating} / 5</span>
          <span><Status value={item.status} /></span>
          <span className="admin-row-actions">
            {canApprove(item.status) ? (
              <button className="compact-button approve" disabled={workingId === item._id} onClick={() => onAction(item._id, () => apiRequest(`/reviews/${item._id}/moderate`, { method: 'PATCH', body: JSON.stringify({ status: 'approved' }) }), 'Feedback approved')}>
                <CheckCircle2 size={15} />Approve
              </button>
            ) : null}
            {canReject(item.status) ? (
              <button className="compact-button danger" disabled={workingId === item._id} onClick={() => onAction(item._id, () => apiRequest(`/reviews/${item._id}/moderate`, { method: 'PATCH', body: JSON.stringify({ status: 'rejected' }) }), 'Feedback rejected')}>
                <XCircle size={15} />Reject
              </button>
            ) : null}
            <button className="compact-button" disabled={workingId === item._id} onClick={() => onEdit(item)}>
              <Pencil size={15} />Edit
            </button>
            <button className="compact-button danger" disabled={workingId === item._id} onClick={() => onDelete(item._id, 'Delete this feedback? This cannot be undone.', () => apiRequest(`/admin/reviews/${item._id}`, { method: 'DELETE' }), 'Feedback deleted')}>
              <Trash2 size={15} />Delete
            </button>
          </span>
        </div>
      ))}
      <Pagination {...pagination} onChange={pagination.setPage} />
    </section>
  );
}
