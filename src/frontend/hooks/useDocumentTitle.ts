import { useEffect } from 'react';

export const useDocumentTitle = (title: string) => {
  const baseTitle = 'Tasky |';

  useEffect(() => {
    document.title = `${baseTitle} ${title}`;
  }, [title]);
};
