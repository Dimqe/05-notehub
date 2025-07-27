import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchNotes } from '../../services/noteService';
import { useDebouncedValue } from '../../hooks/useDebouncedValue';
import SearchBox from '../SearchBox/SearchBox';
import Pagination from '../Pagination/Pagination';
import NoteList from '../NoteList/NoteList';
import Modal from '../Modal/Modal';
import NoteForm from '../NoteForm/NoteForm';

import css from './App.module.css';

const App = () => {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const debouncedSearch = useDebouncedValue(search, 500);

  
const {
  data,
  isLoading,
  isError,
} = useQuery({
  queryKey: ['notes', debouncedSearch, page],
  queryFn: () => fetchNotes({ search: debouncedSearch, page }),
  initialData: { notes: [], totalPages: 1 }, 
});


  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1); 
  };

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox value={search} onChange={handleSearchChange} />

        <Pagination
          page={page}
          onPageChange={setPage}
          totalPages={data?.totalPages || 1}
        />

        <button className={css.button} onClick={() => setIsModalOpen(true)}>
          Create note +
        </button>
      </header>

      {isLoading ? (
        <p>Loading notes...</p>
      ) : isError ? (
        <p>Failed to load notes.</p>
      ) : (
        <NoteList notes={data.notes} />
      )}

      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)}>
          <NoteForm onClose={() => setIsModalOpen(false)} />
        </Modal>
      )}
    </div>
  );
};

export default App;
