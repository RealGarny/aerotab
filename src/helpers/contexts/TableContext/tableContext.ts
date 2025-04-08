import { createContext } from 'react';
import { TCell, TTable } from '@/entities/table/table.types';

interface TableContextProps {
  table: TTable;
  updateCell: (cell: TCell) => void;
  deleteRow:(rowId: number) => void;
  pushRow: () => void;
  pushCol: () => void;
  saveChanges: () => void;
}

export const TableContext = createContext<TableContextProps | null>(null);
