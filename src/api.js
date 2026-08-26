const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const SESSION_EXPIRED_EVENT = 'liveinaus:session-expired';

export async function apiRequest(path, options = {}) {
  const token = localStorage.getItem('topjobs_token');
  const isFormData = options.body instanceof FormData;
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers
    }
  });

  const data = await response.json().catch(() => ({}));

  // A logged-in client (we sent a token) got rejected as unauthenticated —
  // the token expired, the account was blocked, or the user no longer
  // exists. The stored session is no longer valid, so clear it and let the
  // app react instead of leaving the UI stuck in a half-logged-in state.
  if (response.status === 401 && token) {
    localStorage.removeItem('topjobs_token');
    localStorage.removeItem('topjobs_user');
    window.dispatchEvent(new Event(SESSION_EXPIRED_EVENT));
  }

  if (!response.ok) {
    throw new Error(data.message || 'Request failed. Please try again.');
  }

  return data;
}

export { API_BASE_URL, SESSION_EXPIRED_EVENT };
