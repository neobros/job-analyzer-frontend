import { ChevronLeft, ChevronRight } from 'lucide-react';

function buildPageWindow(page, totalPages, windowSize = 1) {
  const pages = new Set([1, totalPages, page]);
  for (let offset = 1; offset <= windowSize; offset += 1) {
    if (page - offset >= 1) pages.add(page - offset);
    if (page + offset <= totalPages) pages.add(page + offset);
  }
  const sorted = [...pages].sort((a, b) => a - b);
  const result = [];
  let previous = 0;
  for (const value of sorted) {
    if (previous && value - previous > 1) result.push(`gap-${previous}`);
    result.push(value);
    previous = value;
  }
  return result;
}

export default function Pagination({ page, totalPages, totalItems, pageSize, onChange }) {
  if (totalPages <= 1) return null;

  const from = totalItems === 0 ? 0 : (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, totalItems);
  const pageEntries = buildPageWindow(page, totalPages);

  return (
    <nav className="pagination" aria-label="Pagination">
      <span className="pagination-summary">{from}–{to} of {totalItems}</span>
      <div className="pagination-controls">
        <button type="button" className="pagination-arrow" disabled={page === 1} onClick={() => onChange(page - 1)} aria-label="Previous page">
          <ChevronLeft size={16} />
        </button>
        {pageEntries.map((entry) => (
          typeof entry === 'number' ? (
            <button
              type="button"
              key={entry}
              className={`pagination-page ${entry === page ? 'active' : ''}`}
              aria-current={entry === page ? 'page' : undefined}
              onClick={() => onChange(entry)}
            >
              {entry}
            </button>
          ) : (
            <span className="pagination-ellipsis" key={entry}>&hellip;</span>
          )
        ))}
        <button type="button" className="pagination-arrow" disabled={page === totalPages} onClick={() => onChange(page + 1)} aria-label="Next page">
          <ChevronRight size={16} />
        </button>
      </div>
    </nav>
  );
}
