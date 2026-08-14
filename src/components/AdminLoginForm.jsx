import { useState } from 'react';
import { AlertCircle, CheckCircle2, KeyRound, LoaderCircle, Mail, ShieldCheck } from 'lucide-react';
import { apiRequest } from '../api.js';
import liveInAusLogo from '../assets/liveinaus-logo.png';

export default function AdminLoginForm({ onAuthSuccess }) {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [pendingOtp, setPendingOtp] = useState(false);
  const [otp, setOtp] = useState('');

  function updateField(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  function rejectNonAdmin() {
    localStorage.removeItem('topjobs_token');
    localStorage.removeItem('topjobs_user');
    setError('This login is for administrators only. That account does not have admin access.');
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const data = await apiRequest('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email: form.email, password: form.password })
      });

      if (data.user?.role !== 'admin') {
        rejectNonAdmin();
        return;
      }

      if (data.token) localStorage.setItem('topjobs_token', data.token);
      if (data.user) localStorage.setItem('topjobs_user', JSON.stringify(data.user));

      if (data.user.isEmailVerified) {
        setSuccess('Admin login successful. Opening the moderation console...');
        onAuthSuccess?.(data.user);
      } else {
        setPendingOtp(true);
        setSuccess('Email verification is required. Enter the OTP sent to this admin account.');
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

      if (data.user?.role !== 'admin') {
        rejectNonAdmin();
        return;
      }

      if (data.token) localStorage.setItem('topjobs_token', data.token);
      if (data.user) localStorage.setItem('topjobs_user', JSON.stringify(data.user));
      setSuccess('Admin email verified. Opening the moderation console...');
      onAuthSuccess?.(data.user);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="auth-shell admin-login-shell">
      <div className="auth-panel">
        <div className="auth-logo-row">
          <img src={liveInAusLogo} alt="LiveInAus" className="brand-logo" />
          <strong>Admin</strong>
        </div>
        <span className="eyebrow"><ShieldCheck size={16} /> Restricted access</span>
        <h1>Administrator sign in</h1>
        <p>This panel is only for verified administrator accounts. Job seekers, employers, and freelancers should use the regular login.</p>
        <form className="stack-form" onSubmit={handleSubmit}>
          <label><Mail size={18} /><input name="email" value={form.email} onChange={updateField} type="email" placeholder="Admin email address" required /></label>
          <label><KeyRound size={18} /><input name="password" value={form.password} onChange={updateField} type="password" placeholder="Password" required /></label>
          {error ? <div className="auth-message error"><AlertCircle size={17} /> {error}</div> : null}
          {success ? <div className="auth-message success"><CheckCircle2 size={17} /> {success}</div> : null}
          {pendingOtp ? (
            <div className="otp-verify-box">
              <label><ShieldCheck size={18} /><input value={otp} onChange={(event) => setOtp(event.target.value)} placeholder="Enter 6-digit OTP" inputMode="numeric" /></label>
              <div className="otp-actions">
                <button className="primary-button" type="button" disabled={loading || otp.length < 4} onClick={verifyOtp}>Verify Email</button>
              </div>
            </div>
          ) : null}
          <button className="primary-button" type="submit" disabled={loading}>
            {loading ? <LoaderCircle className="spin" size={17} /> : null}
            {loading ? 'Please wait...' : 'Login to Admin Console'}
          </button>
        </form>
      </div>
    </section>
  );
}
