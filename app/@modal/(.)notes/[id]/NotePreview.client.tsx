'use client';

import { useQuery } from '@tanstack/react-query';
import { useParams, useRouter } from 'next/navigation';
import { fetchNoteById } from '../../../../lib/api';
import Modal from '../../../../components/Modal/Modal';
import css from './NotePreview.client.module.css';

export default function NotePreviewClient() {
  const params = useParams();
  const router = useRouter();
  const noteId = params?.id as string;

  const { data: note, isLoading, isError } = useQuery({
    queryKey: ['note', noteId],
    queryFn: () => fetchNoteById(noteId),
    refetchOnMount: false,
  });

  if (isLoading) {
    return (
      <Modal isOpen={true} onClose={() => router.back()}>
        <p>Loading, please wait...</p>
      </Modal>
    );
  }

  if (isError || !note) {
    return (
      <Modal isOpen={true} onClose={() => router.back()}>
        <p>Something went wrong.</p>
      </Modal>
    );
  }

  return (
    <Modal isOpen={true} onClose={() => router.back()}>
      <main className={css.main}>
        <div className={css.container}>
          <div className={css.item}>
            <div className={css.header}>
              <h2>{note.title}</h2>
            </div>
            <p className={css.tag}>{note.tag}</p>
            <p className={css.content}>{note.content}</p>
            <p className={css.date}>{note.createdAt}</p>
          </div>
        </div>
      </main>
    </Modal>
  );
}