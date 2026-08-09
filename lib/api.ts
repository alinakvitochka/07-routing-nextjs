import axios from 'axios';
import type { Note } from '../types/note';

const API_BASE_URL = 'https://notehub-public.goit.study/api';

const noteApi = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    Authorization: `Bearer ${process.env.NEXT_PUBLIC_NOTEHUB_TOKEN}`,
  },
});

export interface FetchNotesParams {
  page: number;
  perPage: number;
  search?: string;
  tag?: string;
}

export interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

export interface CreateNoteParams {
  title: string;
  content: string;
  tag: string;
}

export interface DeleteNoteResponse {
  id: string;
  title: string;
  content: string;
  tag: string;
}

export const fetchNotes = async (
  params: FetchNotesParams,
): Promise<FetchNotesResponse> => {
  const { tag, ...rest } = params;
  const queryParams = tag && tag !== 'all' ? { ...rest, tag } : rest;
  const response = await noteApi.get<FetchNotesResponse>('/notes', {
    params: queryParams,
  });
  return response.data;
};

export const createNote = async (
  params: CreateNoteParams,
): Promise<Note> => {
  const response = await noteApi.post<Note>('/notes', params);
  return response.data;
};

export const deleteNote = async (
  noteId: string,
): Promise<DeleteNoteResponse> => {
  const response = await noteApi.delete<DeleteNoteResponse>(`/notes/${noteId}`);
  return response.data;
};

export const fetchNoteById = async (noteId: string): Promise<Note> => {
  const response = await noteApi.get<Note>(`/notes/${noteId}`);
  return response.data;
};