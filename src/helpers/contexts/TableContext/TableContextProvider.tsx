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
  onSave?:(table:TDataTable)=>CB_RES;
}
export const TableContextProvider:FC<TableContextProviderProps> = ({table, children, onSave}) => {
  const [tableData, setTableData] = useState<TTable>(EMPTY_TABLE);
  const updatedCells = useRef<Map<string, TCell>>(new Map<string, TCell>());

  useEffect(() => {
    setTableData(initTableData());
  }, [table]);

  const createEmptyCellData = (cols:number, rows:number) => {
    const newCells:TCell[][] = [];
    for(let i = 0; i < rows; i++) {
      newCells[i] = [];
      for(let j = 0; j < cols; j++) {
        newCells[i][j] = {col: j, row: i, data:''}
      }
    }
    return newCells;
  }

  const initTableData = ():TTable => {
    const newData = structuredClone(table);
    let cells:TCell[][] = [];
    cells = createEmptyCellData(newData.cols, newData.rows);
    if(newData.cells && newData.cells.length > 0) {
      newData.cells.map((cellData) => {
        cells[cellData.row][cellData.col] = cellData;
      })
    }
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
    const newTable:TTable = structuredClone(tableData);
    newTable.cells.push(new Array(tableData.cols)
    .fill('')
    .map((_,i) => ({col: i + 1, row: tableData.rows, data:''})))
    newTable.rows++;
    setTableData(newTable);
  }

  const pushCol = () => {
    const newTable:TTable = structuredClone(tableData);
    newTable.cells.map((tableRow, i) => (
      tableRow.push({col: tableData.cols + 1, row: i, data:''})
    ))
    newTable.cols++;
    setTableData(newTable);
  }

  const updateCell = (cell:TCell) => {
    updatedCells.current.set(`${cell.row}-${cell.col}`, cell);
  }

  const clearChanges = () => {
    updatedCells.current.clear();
  }

  const saveChanges = () => {
    if(onSave) {
      const newTableData:TDataTable = {...structuredClone(tableData), cells:[]};
      for(const cell of updatedCells.current.entries()) {
        newTableData.cells.push(cell[1]);
      }

      if(onSave(newTableData) === CB_RES.OVERRIDE) {
        clearChanges();
        return;
      }
    };
    const newTableData:TTable = structuredClone(tableData);
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
