import { TableContext } from '@/helpers/contexts/TableContext/tableContext';
import { useContext } from 'react';

export const useTable = () => {
  const context = useContext(TableContext);
  if(!context) throw new Error('useTable must be used within TableContext');
  return context;
}
