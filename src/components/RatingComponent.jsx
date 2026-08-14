import { Star } from 'lucide-react';

export default function RatingComponent({ value = 4.8, count, interactive = false, onChange }) {
  return (
    <div className={`rating ${interactive ? 'interactive' : ''}`}>
      {[1, 2, 3, 4, 5].map((star) =>
        onChange ? (
          <button type="button" key={star} className="rating-star-input" onClick={() => onChange(star)} aria-label={`${star} star${star > 1 ? 's' : ''}`}>
            <Star size={20} fill={star <= Math.round(value) ? 'currentColor' : 'none'} />
          </button>
        ) : (
          <Star key={star} size={16} fill={star <= Math.round(value) ? 'currentColor' : 'none'} />
        )
      )}
      {!onChange ? <strong>{value.toFixed(1)}</strong> : null}
      {count ? <span>({count})</span> : null}
    </div>
  );
}
