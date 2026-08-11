import { useState } from 'react';

export default function usePagination(items, pageSize = 10) {
  const [page, setPage] = useState(1);
  const totalItems = items.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const safePage = Math.min(Math.max(page, 1), totalPages);
  const start = (safePage - 1) * pageSize;
  const pageItems = items.slice(start, start + pageSize);

  return { page: safePage, setPage, totalPages, totalItems, pageItems, pageSize };
}
