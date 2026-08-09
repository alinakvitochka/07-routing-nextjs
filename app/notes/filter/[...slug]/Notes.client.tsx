'use client';

import { useState, useRef, useEffect } from 'react';
import { useDebouncedCallback } from 'use-debounce';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchNotes, type FetchNotesParams, type FetchNotesResponse } from '../../../../lib/api';
import App from '../../../../components/App/App';
import NoteList from '../../../../components/NoteList/NoteList';
import Modal from '../../../../components/Modal/Modal';
import NoteForm from '../../../../components/NoteForm/NoteForm';
import Pagination from '../../../../components/Pagination/Pagination';
import SearchBox from '../../../../components/SearchBox/SearchBox';

interface NotesClientProps {
  tag: string;
}

export default function NotesClient({ tag }: NotesClientProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const queryClient = useQueryClient();

  const lastKnownDataRef = useRef<FetchNotesResponse | null>(null);

  const debouncedSearch = useDebouncedCallback((value: string) => {
    setSearchQuery(value);
    setPage(1);
  }, 500);

  const fetchParams: FetchNotesParams = {
    page,
    perPage: 12,
    search: searchQuery || undefined,
    ...(tag !== 'all' ? { tag } : {}),
  };

  const { data, isFetching, error } = useQuery({
    queryKey: ['notes', page, searchQuery, tag],
    queryFn: () => fetchNotes(fetchParams),
    placeholderData: (previousData) => previousData,
    refetchOnMount: false,
  });

  useEffect(() => {
    if (data) lastKnownDataRef.current = data;
  }, [data]);

  const displayData = data ?? lastKnownDataRef.current;

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    debouncedSearch(e.target.value);
  };

  const handlePageChange = (selectedPage: number) => {
    setPage(selectedPage);
  };

  return (
    <App
      searchBox={<SearchBox value={searchQuery} onChange={handleSearchChange} />}
      pagination={
        displayData && displayData.totalPages > 1 ? (
          <Pagination
            totalPages={displayData.totalPages}
            currentPage={page}
            onPageChange={handlePageChange}
          />
        ) : null
      }
      onCreateClick={() => setIsModalOpen(true)}
      noteList={
        displayData && displayData.notes.length > 0 ? (
          <NoteList notes={displayData.notes} />
        ) : null
      }
      modal={
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
          <NoteForm onCancel={() => setIsModalOpen(false)} />
        </Modal>
      }
      isLoading={isFetching}
      error={error}
    />
  );
}