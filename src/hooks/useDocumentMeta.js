import { useEffect } from 'react';
import { DEFAULT_DESCRIPTION, DEFAULT_TITLE, SITE_URL } from '../constants/seo.js';

function setMetaTag(attr, key, content) {
  let el = document.head.querySelector(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function setCanonical(href) {
  let el = document.head.querySelector('link[rel="canonical"]');
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', 'canonical');
    document.head.appendChild(el);
  }
  el.setAttribute('href', href);
}

// Keeps the document <title>, meta description, canonical link, and social
// preview tags in sync with the SPA's client-side route. Safe to call from
// multiple components on the same route (e.g. a detail page overriding the
// generic title App.jsx set once its own data has loaded) — the last call
// to actually run wins, same as any other DOM-effect ordering in React.
export function useDocumentMeta({ title, description, path } = {}) {
  useEffect(() => {
    const fullTitle = title ? `${title} | LiveInAus` : DEFAULT_TITLE;
    const desc = description || DEFAULT_DESCRIPTION;
    const url = `${SITE_URL}${path || '/'}`;

    document.title = fullTitle;
    setMetaTag('name', 'description', desc);
    setMetaTag('property', 'og:title', fullTitle);
    setMetaTag('property', 'og:description', desc);
    setMetaTag('property', 'og:url', url);
    setMetaTag('name', 'twitter:title', fullTitle);
    setMetaTag('name', 'twitter:description', desc);
    setCanonical(url);
  }, [title, description, path]);
}
