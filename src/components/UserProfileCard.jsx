import { BadgeCheck, MapPin, ShieldCheck } from 'lucide-react';
import RatingComponent from './RatingComponent.jsx';

const ROLE_LABELS = { user: 'Community member', supplier: 'Verified supplier', admin: 'Admin' };

export default function UserProfileCard({ user }) {
  const name = user.name || user.fullName || 'Verified worker';
  const role = ROLE_LABELS[user.role || user.user?.role] || 'Marketplace user';
  const country = user.country || 'Worldwide';
  const skills = user.skills?.length ? user.skills : ['Verified profile'];
  const rating = user.ratingAverage || user.rating || 0;
  const avatar = user.avatar || user.profilePhoto || `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=2f73f2&color=fff`;
  const hasPriorityBadge = Boolean(user.hasPriorityBadge || user.user?.hasPriorityBadge);

  return (
    <article className={`profile-card ${hasPriorityBadge ? 'gold-card' : ''}`}>
      {hasPriorityBadge ? <span className="gold-badge"><BadgeCheck size={14} /> Gold Verified</span> : null}
      <img src={avatar} alt={`${name} profile`} />
      <div>
        <h3>{name}</h3>
        <p>{role}</p>
        <span className="location"><MapPin size={15} /> {country}</span>
      </div>
      <RatingComponent value={rating} count={user.ratingCount} />
      <div className="skill-row">
        {skills.map((skill) => <span key={skill}>{skill}</span>)}
      </div>
      <button className="ghost-button"><ShieldCheck size={16} /> Request protected contact</button>
    </article>
  );
}
