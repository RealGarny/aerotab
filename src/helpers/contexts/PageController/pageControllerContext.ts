import { createContext } from 'react'

interface PageControllerContextProps {
  setCurrentPage: (page:string) => void;
  currentPage: string;
}

export const PageControllerContext = createContext<PageControllerContextProps | null>(null);
