import { TableContext } from '@/helpers/contexts/TableContext/tableContext';
import { FC, PropsWithChildren, useEffect, useRef, useState } from 'react';
import { TCell, TTable } from '@/entities/table/table.types';
import { TDataTable } from '@/store/slices/tableSlice/tableSlice';

const EMPTY_TABLE:TTable = {
  name:'',
  rows:0,
  cols:0,
  cells:[]
}
export enum CB_RES {
  ERR = -1,
  OK,
  OVERRIDE,
}

interface  TableContextProviderProps extends PropsWithChildren {
  table:TDataTable;
  onSave?:(updatedCells: { [k: string]: TCell })=>CB_RES;
}
export const TableContextProvider:FC<TableContextProviderProps> = ({table, children, onSave}) => {
  const [tableData, setTableData] = useState<TTable>(EMPTY_TABLE);
  const updatedCells = useRef<Map<string, TCell>>(new Map<string, TCell>());

  useEffect(() => {
    setTableData(initTableData());
  }, [table]);

  const createEmptyCellData = (rows:number, cols:number) => {
    const newCells:TCell[][] = [];
    for(let i = 0; i < cols; i++) {
      newCells[i] = [];
      for(let j = 0; j < rows; j++) {
        newCells[i][j] = {col: j, row: i, data:''}
      }
    }
    return newCells;
  }

  const initTableData = ():TTable => {
    const newData = structuredClone(table);
    let cells:TCell[][] = [];
    cells = createEmptyCellData(newData.rows, newData.cols);
    if(newData.cells && newData.cells.length) {
      newData.cells.map((cellData) => {
        cells[cellData.row][cellData.col] = cellData;
      })
    }
    console.log(cells);
    return {...newData, cells};
  }

  const deleteRow = (rowId:number) => {
    setTableData(prev => {
      if(rowId === table.rows - 1) {
        prev.cells.pop();
      } else {
        prev.cells = prev.cells.filter((_,id) => rowId !== id);
      }
      prev.rows--;
      return prev;
    })
  }

  const deleteCol = (colId: number) => {
    setTableData(prev => {
      prev.cells = tableData.cells
        .map(col => col.filter((_,id) => colId !== id))
      prev.rows--;
      return prev;
    })
  }

  const pushRow = () => {
    setTableData(prev => {
      const newRowCount = prev.rows + 1;
        prev.cells
        .push(new Array(prev.cols).fill('').map((_,i) => ({row:newRowCount, col:i, data:''})))
      return prev;
    })
  }

  const pushCol = () => {

  }

  const updateCell = (cell:TCell) => {
    updatedCells.current.set(`${cell.row}-${cell.col}`, cell);
    console.log(updatedCells);
  }

  const clearChanges = () => {
    updatedCells.current.clear();
  }

  const saveChanges = () => {
    if(onSave && onSave(Object.fromEntries(updatedCells.current)) === CB_RES.OVERRIDE) {
      clearChanges();
      return;
    };
    const newTableData = structuredClone(tableData);
    for(const [hash, val] of updatedCells.current.entries()) {
      const [row, col] = hash.split('-');

      newTableData.cells[Number(row)][Number(col)] = val;
    }
    setTableData(newTableData);
    clearChanges();
  }

  const values = {
    table: tableData,
    deleteCol,
    deleteRow,
    pushRow,
    pushCol,
    updateCell,
    saveChanges,
  }

  return(
    <TableContext.Provider value={values}>
      {children}
    </TableContext.Provider>
  )
}
