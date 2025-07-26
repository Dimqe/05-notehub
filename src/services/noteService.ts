import axios from 'axios';
import type { Note } from '../types/note';

const BASE_URL = 'https://notehub-public.goit.study/api';
const token = import.meta.env.VITE_NOTEHUB_TOKEN;

const instance = axios.create({
  baseURL: BASE_URL,
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

export interface FetchNotesParams {
  page: number;
  perPage: number;
  search: string;
}

export interface FetchNotesResponse {
  results: Note[]; 
  total: number;
  page: number;
  perPage: number;
}


export const fetchNotes = async ({
  page,
  perPage,
  search,
}: FetchNotesParams): Promise<FetchNotesResponse> => {
  try {
    const params: Record<string, string | number> = { page, perPage };
    const cleanedSearch = search.trim();

    if (cleanedSearch && cleanedSearch !== ':' && cleanedSearch !== 'undefined') {
      params.search = cleanedSearch;
    }

    const { data } = await instance.get('/notes', { params });
    return data;
  } catch (error) {
    console.error('Failed to fetch notes:', error);
    throw error;
  }
};

// export const fetchNotes = async ({
//   page,
//   perPage,
//   search,
// }: FetchNotesParams): Promise<FetchNotesResponse> => {
//   const params: Record<string, string | number> = {
//     page,
//     perPage,
//   };

//   const cleanedSearch = search.trim();

//   // Уникаємо порожніх і некоректних значень
//   if (cleanedSearch && cleanedSearch !== ':' && cleanedSearch !== 'undefined') {
//     params.search = cleanedSearch;
//   }

//   const { data } = await instance.get('/notes', { params });
//   return data;
// };



export const createNote = async (note: {
  title: string;
  content: string;
  tag: Note['tag'];
}): Promise<Note> => {
  const { data } = await instance.post('/notes', note);
  return data;
};



export const deleteNote = async (id: string): Promise<Note> => {
  const { data } = await instance.delete(`/notes/${id}`);
  return data;
};
