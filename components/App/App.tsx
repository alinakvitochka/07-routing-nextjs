'use client';

import css from './App.module.css';

export interface AppProps {
  searchBox: React.ReactNode;
  pagination: React.ReactNode;
  onCreateClick: () => void;
  noteList: React.ReactNode;
  modal: React.ReactNode;
  isLoading: boolean;
  error: Error | null;
}

export default function App({
  searchBox,
  pagination,
  onCreateClick,
  noteList,
  modal,
  isLoading,
  error,
}: AppProps) {
  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <div className={css.toolbarLeft}>{searchBox}</div>
        <div className={css.toolbarCenter}>{pagination}</div>
        <div className={css.toolbarRight}>
          <button className={css.button} onClick={onCreateClick}>
            Create note +
          </button>
        </div>
      </header>

      {noteList}
      {isLoading && <p className={css.loading}>Loading...</p>}
      {error && <p>Error: {error.message}</p>}

      {modal}
    </div>
  );
}