import { useContext } from 'react';
import { PageControllerContext } from '@/helpers/contexts/PageController/pageControllerContext';

export const usePageController = () => {
  const context = useContext(PageControllerContext);
  if(!context) throw new Error('usePageController must be used within usePageController');
  return context;
}
