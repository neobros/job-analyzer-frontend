import { BadgeCheck, Banknote, BriefcaseBusiness, CheckCircle2, Clock3, Heart, MapPin, Send, Share2, ShieldCheck } from 'lucide-react';

export default function JobCard({ job, onApply, onOpen, applying = false, hasApplied = false }) {
  const company = job.company || 'Verified employer';
  const status = job.status || 'approved';
  const statusLabel = status === 'approved' ? 'Live' : status.replace(/_/g, ' ');
  const skills = job.skills?.length ? job.skills : [job.category].filter(Boolean);
  const typeLabel = (job.type || 'full_time').replace(/_/g, ' ').replace(/\b\w/g, (letter) => letter.toUpperCase());
  const postedDate = job.createdAt ? new Date(job.createdAt) : new Date();
  const postedLabel = postedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  const daysLeft = Math.max(1, 30 - Math.floor((Date.now() - postedDate.getTime()) / 86400000));
  const location = [job.city, job.country].filter(Boolean).join(' | ') || 'Worldwide';
  const requirements = job.experience || (/year|yrs|experience/i.test(job.requirements || '') && (job.requirements || '').length < 32 ? job.requirements : '2 - 5 years');
  const skillLine = skills.slice(0, 3);
  const hiddenSkillCount = Math.max(skills.length - skillLine.length, 0);
  const tagLine = [job.category, ...skills.filter((skill) => skill !== job.category)].slice(0, 3);
  const hasPriorityBadge = Boolean(job.hasPriorityBadge || job.employer?.hasPriorityBadge);
  const companyInitials = company
    .split(/[@\s.-]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('') || 'TJ';
  const clickable = Boolean(onOpen);

  function openDetails() {
    onOpen?.(job);
  }

  function handleKeyDown(event) {
    if (!clickable) return;
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      openDetails();
    }
  }

  function stopCardOpen(event) {
    event.stopPropagation();
  }

  return (
    <article
      className={`job-card ${hasPriorityBadge ? 'gold-card' : ''} ${clickable ? 'job-card-clickable' : ''}`}
      onClick={clickable ? openDetails : undefined}
      onKeyDown={handleKeyDown}
      tabIndex={clickable ? 0 : undefined}
      aria-label={clickable ? `Open details for ${job.title}` : undefined}
    >
      <div className="job-listing-main">
        <div className="job-listing-content">
          <div className="job-status-line">
            <span className="status-pill">{statusLabel}</span>
            {hasPriorityBadge ? <span className="gold-badge"><BadgeCheck size={14} /> Gold Verified</span> : null}
          </div>
          <h3>{job.title}</h3>
          <p className="job-company">{company}</p>

          <div className="job-detail-row">
            <span><BriefcaseBusiness size={15} /> {requirements}</span>
            <span><Clock3 size={15} /> {typeLabel}</span>
            <span><MapPin size={15} /> {location}</span>
          </div>

          <div className="job-skill-line">
            {skillLine.map((skill) => <span key={skill}>{skill}</span>)}
            {hiddenSkillCount ? <span>+{hiddenSkillCount}</span> : null}
          </div>

          <div className="job-tag-row">
            {tagLine.map((tag) => <span key={tag}>{tag}</span>)}
          </div>
        </div>

        <div className="job-logo-box">
          <strong>{companyInitials}</strong>
          <small>{company}</small>
        </div>
      </div>

      <div className="job-listing-footer">
        <div className="job-posted-row">
          <span>Posted {postedLabel}</span>
          <span><Clock3 size={14} /> {daysLeft} days left</span>
        </div>
        <div className="job-listing-actions">
          <span className="job-salary-pill"><Banknote size={15} /> {job.salary || 'Negotiable'}</span>
          <button className="job-icon-action" type="button" aria-label="Share job" onClick={stopCardOpen}><Share2 size={18} /></button>
          <button className="job-icon-action" type="button" aria-label="Save job" onClick={stopCardOpen}><Heart size={19} /></button>
          <button className={`job-apply-button ${hasApplied ? 'applied-button' : ''}`} disabled={applying || hasApplied} onClick={(event) => { stopCardOpen(event); onApply?.(job); }}>
            {hasApplied ? 'Applied' : applying ? 'Applying...' : 'Apply'} {hasApplied ? <CheckCircle2 size={15} /> : <Send size={15} />}
          </button>
        </div>
      </div>

      <span className="job-protected-note"><ShieldCheck size={14} /> Protected contact after review</span>
    </article>
  );
}
