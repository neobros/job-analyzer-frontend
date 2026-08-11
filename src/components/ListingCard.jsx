import { MapPin, ShieldCheck } from 'lucide-react';
import { findVertical } from '../constants/verticals.js';
import { API_BASE_URL } from '../api.js';

const UPLOAD_ORIGIN = API_BASE_URL.replace(/\/api\/?$/, '');

function resolveListingImage(relativePath) {
  if (!relativePath) return '';
  return `${UPLOAD_ORIGIN}/${relativePath.replace(/\\/g, '/')}`;
}

export default function ListingCard({ listing, onOpen, showStatus = false }) {
  const vertical = findVertical(listing.vertical);
  const VerticalIcon = vertical?.icon || ShieldCheck;
  const clickable = Boolean(onOpen);
  const priceLabel = Number(listing.price) ? `$${Number(listing.price).toLocaleString()}` : null;
  const location = [listing.city, listing.country].filter(Boolean).join(', ') || 'Worldwide';
  const image = listing.images?.[0];

  function openDetails() {
    onOpen?.(listing);
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
      className={`gig-card listing-card ${clickable ? 'gig-card-clickable listing-card-clickable' : ''}`}
      onClick={clickable ? openDetails : undefined}
      onKeyDown={handleKeyDown}
      tabIndex={clickable ? 0 : undefined}
      aria-label={clickable ? `Open details for ${listing.title}` : undefined}
    >
      <div className="gig-image listing-image">
        {image ? <img src={resolveListingImage(image)} alt="" /> : <VerticalIcon size={26} />}
        {showStatus ? <span className={`listing-status-pill ${listing.status}`}>{listing.status}</span> : null}
      </div>
      <div className="listing-tags">
        <span className="listing-vertical-tag"><VerticalIcon size={13} /> {vertical?.name || listing.vertical}</span>
        {listing.category ? <span className="listing-category-tag">{listing.category}</span> : null}
      </div>
      <h3>{listing.title}</h3>
      <p className="listing-description">{listing.description}</p>
      <div className="listing-bottom">
        <span className="listing-location"><MapPin size={14} /> {location}</span>
        {priceLabel ? <strong className="listing-price">{priceLabel}</strong> : null}
      </div>
    </article>
  );
}
