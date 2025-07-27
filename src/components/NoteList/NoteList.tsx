import { useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchNotes, deleteNote } from '../../services/noteService';
import type { Note } from '../../types/note';
import css from './NoteList.module.css';

interface NoteListProps {
  page: number;
  search: string;
}

const NoteList = ({ page, search }: NoteListProps) => {
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery({
    queryKey: ['notes', page, search],
    queryFn: () => fetchNotes({ page, perPage: 12, search }),
  });

  console.log('API response:', data); // Додайте це для дебагу

  const handleDelete = async (id: string) => {
    await deleteNote(id);
    queryClient.invalidateQueries({ queryKey: ['notes'] });
  };

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error loading notes.</p>;

  // Перевірка, що data і data.data існують
const notes: Note[] = Array.isArray(data?.notes) ? data.notes : [];

  return (
    <ul className={css.list}>
      {notes.length === 0 ? (
        <li>No notes found.</li>
      ) : (
        notes.map((note: Note) => (
          <li className={css.listItem} key={note.id}>
            <h2 className={css.title}>{note.title}</h2>
            <p className={css.content}>{note.content}</p>
            <div className={css.footer}>
              <span className={css.tag}>{note.tag}</span>
              <button className={css.button} onClick={() => handleDelete(note.id)}>
                Delete
              </button>
            </div>
          </li>
        ))
      )}
    </ul>
  );
};

export default NoteList;
