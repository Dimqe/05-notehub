import ReactPaginate from 'react-paginate';
import { useQuery } from '@tanstack/react-query';
import { fetchNotes } from '../../services/noteService';
import css from './Pagination.module.css';

interface PaginationProps {
  page: number;
  onPageChange: (page: number) => void;
  search: string;
  perPage: number;
}

export default function Pagination({
  page,
  onPageChange,
  search,
  perPage,
}: PaginationProps) {
  const { data } = useQuery({
    queryKey: ['notes', page, search],
    queryFn: () => fetchNotes({ page, search, perPage }),
  });

  const { total = 0 } = data || {};
  const pageCount = Math.ceil(total / perPage);

  if (!data || pageCount <= 1) return null;

  return (
    <ReactPaginate
      className={css.pagination}
      activeClassName={css.active}
      previousLabel="<"
      nextLabel=">"
      pageCount={pageCount}
      forcePage={page - 1}
      onPageChange={({ selected }) => onPageChange(selected + 1)}
    />
  );
}
