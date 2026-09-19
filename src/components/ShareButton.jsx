import { useEffect, useRef, useState } from 'react';
import { Check, Copy, MessageCircle, Share2 } from 'lucide-react';
import { SITE_URL } from '../constants/seo.js';

// Reusable share control used on job/gig/listing cards and their detail pages.
// On devices with the native Web Share API (most mobile browsers) it opens the
// system share sheet directly, which already includes WhatsApp and every other
// installed app. On desktop, where that API is usually unavailable, it falls
// back to a small menu with an explicit "Copy link" and "Share on WhatsApp"
// (wa.me, which lets the user pick any chat or group). The shared link's
// preview (title/description/image) comes from the per-page Open Graph tags
// already set by useDocumentMeta, so the WhatsApp/social preview shows the
// real LiveInAus branding and listing details, not a generic page.
export default function ShareButton({ path, title, text, className = '', iconSize = 18 }) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const wrapRef = useRef(null);
  const url = `${SITE_URL}${path || '/'}`;
  const shareText = text || title || 'Check this out on LiveInAus';

  useEffect(() => {
    if (!open) return;
    function handleOutsideClick(event) {
      if (wrapRef.current && !wrapRef.current.contains(event.target)) setOpen(false);
    }
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [open]);

  async function handleShareClick(event) {
    event.stopPropagation();
    if (navigator.share) {
      try {
        await navigator.share({ title: title || 'LiveInAus', text: shareText, url });
      } catch {
        // user dismissed the native share sheet — nothing to do
      }
      return;
    }
    setOpen((current) => !current);
  }

  async function copyLink(event) {
    event.stopPropagation();
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard access blocked — the WhatsApp option below still works
    }
  }

  function shareToWhatsApp(event) {
    event.stopPropagation();
    const encoded = encodeURIComponent(`${shareText} ${url}`);
    window.open(`https://wa.me/?text=${encoded}`, '_blank', 'noopener,noreferrer');
    setOpen(false);
  }

  return (
    <div className={`share-button-wrap ${className}`} ref={wrapRef} onClick={(event) => event.stopPropagation()}>
      <button type="button" className="job-icon-action" aria-label="Share" onClick={handleShareClick}>
        <Share2 size={iconSize} />
      </button>
      {open ? (
        <div className="share-menu" role="menu">
          <button type="button" role="menuitem" onClick={copyLink}>
            {copied ? <Check size={16} /> : <Copy size={16} />} {copied ? 'Link copied' : 'Copy link'}
          </button>
          <button type="button" role="menuitem" onClick={shareToWhatsApp}>
            <MessageCircle size={16} /> Share on WhatsApp
          </button>
        </div>
      ) : null}
    </div>
  );
}
