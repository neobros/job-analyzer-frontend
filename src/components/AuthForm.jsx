import { useEffect, useMemo, useState } from 'react';
import { AlertCircle, ArrowRight, BriefcaseBusiness, Building2, CheckCircle2, Globe2, KeyRound, LoaderCircle, Mail, MapPin, Rocket, ShieldCheck, Sparkles, User } from 'lucide-react';
import { apiRequest } from '../api.js';
import CustomSelect from './CustomSelect.jsx';
import authImage from '../assets/marketplace-slide-1.png';
import authImageTwo from '../assets/marketplace-slide-3.png';

const roleOptions = [
  { value: 'job_seeker', label: 'Job seeker', note: 'Apply for approved jobs', icon: User },
  { value: 'employer', label: 'Employer', note: 'Post vacancies for review', icon: Building2 },
  { value: 'freelancer', label: 'Freelancer', note: 'Sell services and gigs', icon: Rocket }
];

export default function AuthForm({ mode = 'signup', onAuthSuccess, onSwitchMode }) {
  const isSignup = mode === 'signup';
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    password: '',
    country: '',
    city: '',
    role: 'job_seeker'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [locations, setLocations] = useState([]);
  const [pendingOtp, setPendingOtp] = useState(false);
  const [otp, setOtp] = useState('');
  const [devOtp, setDevOtp] = useState('');

  useEffect(() => {
    if (!isSignup) return;
    apiRequest('/locations')
      .then(setLocations)
      .catch(() => setLocations([]));
  }, [isSignup]);

  const cities = useMemo(() => {
    return locations.find((location) => location.country === form.country)?.cities || [];
  }, [form.country, locations]);

  function updateField(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value, ...(name === 'country' ? { city: '' } : {}) }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const path = isSignup ? '/auth/signup' : '/auth/login';
      const payload = isSignup ? form : { email: form.email, password: form.password };
      const data = await apiRequest(path, {
        method: 'POST',
        body: JSON.stringify(payload)
      });

      if (data.token) localStorage.setItem('topjobs_token', data.token);
      if (data.user) localStorage.setItem('topjobs_user', JSON.stringify(data.user));

      if (isSignup) {
        setPendingOtp(true);
        setDevOtp(data.devOtp || '');
        setSuccess(`Account created. Enter the email OTP to activate the account.${data.devOtp ? ` Development OTP: ${data.devOtp}` : ''}`);
      } else {
        if (data.user?.isEmailVerified) {
          setSuccess('Login successful. Opening your dashboard...');
          onAuthSuccess?.(data.user);
        } else {
          setPendingOtp(true);
          setSuccess('Login successful, but email verification is required. Enter OTP or resend a new code.');
        }
      }
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  }

  async function verifyOtp() {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const data = await apiRequest('/auth/verify-otp', {
        method: 'POST',
        body: JSON.stringify({ otp })
      });
      if (data.token) localStorage.setItem('topjobs_token', data.token);
      if (data.user) localStorage.setItem('topjobs_user', JSON.stringify(data.user));
      setSuccess('Email verified. Opening your workspace...');
      onAuthSuccess?.(data.user);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  }

  async function resendOtp() {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const data = await apiRequest('/auth/resend-otp', { method: 'POST' });
      setDevOtp(data.devOtp || '');
      setSuccess(`OTP sent again.${data.devOtp ? ` Development OTP: ${data.devOtp}` : ''}`);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="auth-shell">
      <div className="auth-panel">
        <div className="auth-logo-row">
          <span className="brand-mark"><BriefcaseBusiness size={22} /></span>
          <strong>TopJobs Thejan</strong>
        </div>
        <span className="eyebrow"><ShieldCheck size={16} /> Email verification required</span>
        <h1>{isSignup ? 'Create your global work profile' : 'Welcome back'}</h1>
        <p>{isSignup ? 'Register once, verify by OTP, then post jobs, apply, or sell services.' : 'Log in to manage jobs, applications, gigs, and feedback.'}</p>
        <div className="auth-trust-row">
          <span><Globe2 size={15} /> Worldwide jobs</span>
          <span><ShieldCheck size={15} /> OTP protected</span>
          <span><Sparkles size={15} /> Admin checked</span>
        </div>
        <form className="stack-form" onSubmit={handleSubmit}>
          {isSignup ? (
            <label><User size={18} /><input name="fullName" value={form.fullName} onChange={updateField} placeholder="Full name" required /></label>
          ) : null}
          <label><Mail size={18} /><input name="email" value={form.email} onChange={updateField} type="email" placeholder="Email address" required /></label>
          <label><KeyRound size={18} /><input name="password" value={form.password} onChange={updateField} type="password" placeholder="Strong password" required /></label>
          {isSignup ? (
            <>
              <div className="two-col">
                <CustomSelect
                  icon={Globe2}
                  value={form.country}
                  placeholder="Country"
                  options={locations.map((location) => ({ value: location.country, label: location.country }))}
                  onChange={(value) => updateField({ target: { name: 'country', value } })}
                />
                <CustomSelect
                  icon={MapPin}
                  value={form.city}
                  placeholder={form.country ? 'City' : 'Choose country first'}
                  disabled={!form.country}
                  options={cities.map((city) => ({ value: city.name, label: city.name }))}
                  onChange={(value) => updateField({ target: { name: 'city', value } })}
                />
              </div>
              <div className="role-picker" role="radiogroup" aria-label="Account type">
                {roleOptions.map((option) => {
                  const Icon = option.icon;
                  return (
                    <button
                      type="button"
                      key={option.value}
                      className={form.role === option.value ? 'active' : ''}
                      aria-pressed={form.role === option.value}
                      onClick={() => updateField({ target: { name: 'role', value: option.value } })}
                    >
                      <Icon size={18} />
                      <span>
                        <strong>{option.label}</strong>
                        <small>{option.note}</small>
                      </span>
                    </button>
                  );
                })}
              </div>
            </>
          ) : null}
          {error ? <div className="auth-message error"><AlertCircle size={17} /> {error}</div> : null}
          {success ? <div className="auth-message success"><CheckCircle2 size={17} /> {success}</div> : null}
          {pendingOtp ? (
            <div className="otp-verify-box">
              <label><ShieldCheck size={18} /><input value={otp} onChange={(event) => setOtp(event.target.value)} placeholder="Enter 6-digit OTP" inputMode="numeric" /></label>
              {devOtp ? <small>Development OTP: {devOtp}</small> : null}
              <div className="otp-actions">
                <button className="primary-button" type="button" disabled={loading || otp.length < 4} onClick={verifyOtp}>Verify Email</button>
                <button className="ghost-button" type="button" disabled={loading} onClick={resendOtp}>Resend OTP</button>
              </div>
            </div>
          ) : null}
          <button className="primary-button" type="submit" disabled={loading}>
            {loading ? <LoaderCircle className="spin" size={17} /> : null}
            {loading ? 'Please wait...' : isSignup ? 'Register and Send OTP' : 'Login'}
          </button>
          {!isSignup ? <button className="link-button" type="button">Forgot password?</button> : null}
          {onSwitchMode ? (
            <button className="auth-switch-button" type="button" onClick={onSwitchMode}>
              {isSignup ? 'Already registered? Login' : 'New to TopJobs? Create account'}
              <ArrowRight size={16} />
            </button>
          ) : null}
        </form>
      </div>
      <aside className="otp-panel auth-visual-panel">
        <div className="auth-image-stack">
          <img src={authImage} alt="" />
          <img src={authImageTwo} alt="" />
        </div>
        <div className="auth-floating-card primary">
          <Sparkles size={18} />
          <div>
            <strong>Verified marketplace</strong>
            <span>Jobs, gigs, CVs and profiles</span>
          </div>
        </div>
        <div className="auth-floating-card secondary">
          <ShieldCheck size={18} />
          <div>
            <strong>OTP protected</strong>
            <span>Posting and applying require email verification</span>
          </div>
        </div>
        <div className="auth-visual-copy">
          <h2>{isSignup ? 'Join safely, work globally' : 'Continue your marketplace work'}</h2>
          <p>Admin checks keep first contact protected while users search jobs, post vacancies, sell services, and track applications.</p>
        </div>
      </aside>
    </section>
  );
}
