import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import css from './NoteList.module.css';
import { fetchNotes, deleteNote } from '../../services/noteService';




interface NoteListProps {
  page: number;
  search: string;
  perPage: number;
}

export default function NoteList({ page, search, perPage }: NoteListProps) {
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery({
    queryKey: ['notes', page, perPage, search],
    queryFn: () => fetchNotes({ page, search, perPage }),
  });


  const mutation = useMutation({
    mutationFn: deleteNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
    },
  });

if (isLoading) return <p>Loading...</p>;
if (isError || !data || !Array.isArray(data.results)) return <p>Error loading notes.</p>;
if (data.results.length === 0) return <p>No notes found.</p>;

return (
  <ul className={css.list}>
    {data.results.map(note => (
      <li className={css.listItem} key={note._id.toString()}>
        <h2 className={css.title}>{note.title}</h2>
        <p className={css.content}>{note.content}</p>
        <div className={css.footer}>
          <span className={css.tag}>{note.tag}</span>
          <button
            className={css.button}
            onClick={() => mutation.mutate(note._id.toString())}
          >
            Delete
          </button>
        </div>
      </li>
    ))}
  </ul>
);

}
