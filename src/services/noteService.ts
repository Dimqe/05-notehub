import axios from 'axios';
import type { AxiosResponse } from 'axios';
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
  page?: number;
  perPage?: number;
  search?: string;
}

export interface FetchNotesResponse {
  data: Note[];
  total: number;
  page: number;
  perPage: number;
}

export const fetchNotes = async ({ page, perPage, search }: FetchNotesParams) => {
  const params: FetchNotesParams = {};
  if (page !== undefined) params.page = page;
  if (perPage !== undefined) params.perPage = perPage;
  if (search && search.trim() !== '') params.search = search;
  const response = await instance.get('/notes', { params });
  return response.data;
};

export const createNote = async (noteData: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>): Promise<Note> => {
  const { data }: AxiosResponse<Note> = await instance.post('/notes', noteData);
  return data;
};

export const deleteNote = async (id: string): Promise<Note> => {
  const { data }: AxiosResponse<Note> = await instance.delete(`/notes/${id}`);
  return data;
};
