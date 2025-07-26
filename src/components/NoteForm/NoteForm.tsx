import { useFormik } from 'formik';
import * as Yup from 'yup';
import css from './NoteForm.module.css';
import { createNote } from '../../services/noteService';
import { useMutation, useQueryClient } from '@tanstack/react-query';

interface NoteFormProps {
  onSuccess: () => void;
}

const validationSchema = Yup.object({
  title: Yup.string().min(3).max(50).required('Title is required'),
  content: Yup.string().max(500),
  tag: Yup.string()
    .oneOf(['Todo', 'Work', 'Personal', 'Meeting', 'Shopping'])
    .required('Tag is required'),
});

export default function NoteForm({ onSuccess }: NoteFormProps) {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: createNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      onSuccess();
    },
  });

  const formik = useFormik({
    initialValues: { title: '', content: '', tag: '' },
    validationSchema,
   onSubmit: values => {
  mutation.mutate({
    ...values,
    tag: values.tag as 'Todo' | 'Work' | 'Personal' | 'Meeting' | 'Shopping',
  });
}
  });

  return (
<form className={css.form} onSubmit={formik.handleSubmit}>
  <div className={css.formGroup}>
    <label htmlFor="title">Title</label>
    <input
      id="title"
      className={css.input}
      {...formik.getFieldProps('title')}
    />
    {formik.touched.title && formik.errors.title && (
      <span className={css.error}>{formik.errors.title}</span>
    )}
  </div>

  <div className={css.formGroup}>
    <label htmlFor="content">Content</label>
    <textarea
      id="content"
    className={css.textarea}
    rows={8}
    {...formik.getFieldProps('content')}
  />
  {formik.touched.content && formik.errors.content && (
    <span className={css.error}>{formik.errors.content}</span>
  )}
</div>

<div className={css.formGroup}>
  <label htmlFor="tag">Tag</label>
  <select
    id="tag"
    className={css.select}
    {...formik.getFieldProps('tag')}
  >
    <option value="">Select</option>
    <option value="Todo">Todo</option>
    <option value="Work">Work</option>
    <option value="Personal">Personal</option>
    <option value="Meeting">Meeting</option>
    <option value="Shopping">Shopping</option>
  </select>
  {formik.touched.tag && formik.errors.tag && (
    <span className={css.error}>{formik.errors.tag}</span>
  )}
</div>

      <div className={css.actions}>
        <button type="button" className={css.cancelButton} onClick={onSuccess}>
          Cancel
        </button>
        <button type="submit" className={css.submitButton} disabled={mutation.isPending}>
          Create note
        </button>
      </div>
    </form>
  );
}
