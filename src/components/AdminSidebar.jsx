import { Activity, BarChart3, BriefcaseBusiness, Layers3, MapPinned, MessageSquare, ShieldAlert, Star, Store, Users } from 'lucide-react';

export default function AdminSidebar({ active = 'dashboard', onChange, counts = {} }) {
  const items = [
    ['dashboard', BarChart3, 'Dashboard'],
    ['users', Users, 'Users'],
    ['sellers', Store, 'Sellers'],
    ['approvals', BriefcaseBusiness, 'Post Approvals'],
    ['listings', Layers3, 'Listings'],
    ['applications', MessageSquare, 'Applications'],
    ['feedback', Star, 'Feedback'],
    ['locations', MapPinned, 'Locations'],
    ['activity', Activity, 'Activity Logs'],
    ['suspicious', ShieldAlert, 'Suspicious Accounts']
  ];

  return (
    <aside className="admin-sidebar">
      <strong>Admin Panel</strong>
      {items.map(([id, Icon, label]) => (
        <button key={id} className={active === id ? 'active' : ''} onClick={() => onChange?.(id)}>
          <Icon size={18} /> <span>{label}</span>
          {counts[id] ? <small>{counts[id]}</small> : null}
        </button>
      ))}
    </aside>
  );
}
