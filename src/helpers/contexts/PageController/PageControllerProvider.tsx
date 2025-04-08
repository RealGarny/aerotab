import { PageControllerContext } from '@/helpers/contexts/PageController/pageControllerContext';
import { useState, ReactNode, FC } from 'react';

interface PageControllerProviderProps {
  pages: Record<string, ReactNode>;
  defaultPage?: string;
}

export const PageControllerProvider:FC<PageControllerProviderProps> = ({pages, defaultPage}) => {
  const [currentPage, setCurrentPage] = useState<string>(defaultPage || Object.keys(pages)[0]);

  const values = {
    setCurrentPage,
    currentPage
  }

  return(
    <PageControllerContext.Provider value={values}>
      {pages[currentPage]}
    </PageControllerContext.Provider>
  )
}
