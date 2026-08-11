import { Star } from 'lucide-react';

export default function RatingComponent({ value = 4.8, count, interactive = false }) {
  return (
    <div className={`rating ${interactive ? 'interactive' : ''}`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <Star key={star} size={16} fill={star <= Math.round(value) ? 'currentColor' : 'none'} />
      ))}
      <strong>{value.toFixed(1)}</strong>
      {count ? <span>({count})</span> : null}
    </div>
  );
}
