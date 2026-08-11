import { ArrowUpRight, Layers3 } from 'lucide-react';

const PALETTE = ['blue', 'green', 'purple', 'orange', 'pink', 'teal', 'yellow', 'red'];

export default function CategoryCard({ category, index = 0 }) {
  const count = category.count ?? ((category.jobs || 0) + (category.gigs || 0));
  const accent = category.color || PALETTE[index % PALETTE.length];

  return (
    <article className={`category-card ${accent}`}>
      <div className="category-icon"><Layers3 size={20} /></div>
      <div>
        <h3>{category.name}</h3>
        <p>{count} open roles and gigs</p>
      </div>
      <ArrowUpRight size={18} />
    </article>
  );
}
