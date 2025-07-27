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
    isFetching,
  } = useQuery({
    queryKey: ['notes', debouncedSearch, page],
    queryFn: () => fetchNotes({ search: debouncedSearch, page }),
    placeholderData: (previousData) => previousData,
  });

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1);
  };



  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox value={search} onChange={handleSearchChange} />

{!isLoading && !isError && data?.totalPages !== undefined && data.totalPages > 1 && (
  <Pagination
    page={page}
    onPageChange={setPage}
    totalPages={data.totalPages}
  />
)}
        <button className={css.button} onClick={() => setIsModalOpen(true)}>
          Створити нотатку +
        </button>
      </header>

      
 {isLoading || isFetching ? (
  <p>Завантаження нотаток...</p>
) : isError ? (
  <p>Не вдалося завантажити нотатки.</p>
) : !data ? null : data.notes.length > 0 ? (
  <NoteList notes={data.notes} />
) : (
  <p>Нотаток не знайдено.</p>
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