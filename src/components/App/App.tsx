import { useState } from 'react';
import css from './App.module.css';
import SearchBox from '../SearchBox/SearchBox';
import Pagination from '../Pagination/Pagination';
import NoteList from '../NoteList/NoteList';
import Modal from '../Modal/Modal';
import NoteForm from '../NoteForm/NoteForm';
import { useDebouncedValue } from '../../hooks/useDebouncedValue';

const PER_PAGE = 12;

export default function App() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const debouncedSearch = useDebouncedValue(search, 300);

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox value={search} onChange={setSearch} />
        <Pagination
          page={page}
          onPageChange={setPage}
          search={debouncedSearch}
          perPage={PER_PAGE}
        />
        <button
          className={css.button}
          onClick={() => setIsModalOpen(true)}
        >
          Create note +
        </button>
      </header>

      <NoteList page={page} search={debouncedSearch} perPage={PER_PAGE} />

      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)}>
          <NoteForm onSuccess={() => setIsModalOpen(false)} />
        </Modal>
      )}
    </div>
  );
}
