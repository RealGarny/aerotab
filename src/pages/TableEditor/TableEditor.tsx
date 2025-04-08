import { useAppSelector } from '@/store/hooks/useAppSelector';
import { ChangeEvent, ComponentProps, FC, ReactNode, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { TCell, TTable } from '@/entities/table/table.types';
import { CB_RES, TableContextProvider } from '@/helpers/contexts/TableContext/TableContextProvider';
import { useTable } from '@/helpers/contexts/TableContext/useTable';
import { Button } from '@/shared/ui/button';
import { usePageController } from '@/helpers/contexts/PageController/usePageController';
import { useDebounce } from '@/helpers/hooks/useDebounce';
import { updateTable } from '@/store/slices/tableSlice/tableSlice';
import { useDispatch } from 'react-redux';

export const TableEditor = () => {
  const { activeTable, tables } = useAppSelector(state => state.table);
  const { setCurrentPage } = usePageController();
  const selectedTable = tables[activeTable];
  const dispatch = useDispatch();

  const handleTableChange = (changes: {[k:string]: TCell}) => {
    const newTable = structuredClone(selectedTable);
    for(const change of Object.entries(changes)) {
      newTable.cells.push(change[1]);
    }
    dispatch(updateTable(newTable));
    return CB_RES.OVERRIDE;
  }

  return(
    <div className={"p-10 flex flex-col gap-10 items-start"}>
      <Button onClick={() => setCurrentPage('main-menu')}>На главную</Button>
      <p className={'font-bold text-5xl'}>Таблица: {selectedTable.name}</p>
      <TableContextProvider table={selectedTable} onSave={handleTableChange}>
        <TableTools/>
        <Table />
      </TableContextProvider>
    </div>
  )
}

const TableTools = () => {
  const {saveChanges} = useTable();
  return(
    <div>
      <Button onClick={() => saveChanges()}>Сохранить</Button>
    </div>
  )
}

const Table = () => {
  const {table} = useTable();
  const Rows = useCallback(()=> <EnumeratedRow count={table.cols}/>, [table.cols]);
  const Cols = useCallback(()=> <div className={'flex'}>
    <Cell/>
    <EnumeratedRow className={'flex'} count={table.rows}/>
  </div>, [table.rows]);

  return (
    <div>
      <Cols/>
      <div className={"flex"}>
        <Rows/>
        <div>
        {table.cells.map((rowData, index) => (
          <CellRow key={index} rowData={rowData} />
        ))}
        </div>
      </div>
    </div>
  )
}

const EnumeratedRow:FC<{count:number}& ComponentProps<'div'>> = ({count, ...otherProps}) => (
  <div {...otherProps}>
    {
      new Array(count)
        .fill('')
        .map((_, i)=> (
          <Cell key={i}>{i + 1}</Cell>
        ))
    }
  </div>
)

const CellRow:FC<{rowData:TCell[]}> = ({ rowData }) => {
  return(
    <div className={'flex'}>
      {rowData.map((cellData,) => (
        <TableCell key={`${cellData.row}${cellData.col}`} data={cellData}/>
      ))}
    </div>
  )
}

const TableCell:FC<{data:TCell}> = ({ data }) => {
  const { updateCell } = useTable();
  const changeCb = useDebounce((value) => {
    const newCell: TCell = {
      ...data,
      data: value,
    }
    updateCell(newCell);
  },200)

  const handleChange = (e:ChangeEvent<HTMLInputElement>) => {
    changeCb(e.target.value);
  }

  return (
    <Cell>
      <input
        onChange={handleChange}
        className={'ring-0 w-full h-full'}
        defaultValue={data.data}
      />
    </Cell>
  )
}

const Cell:FC<{children?:ReactNode; isActive?:boolean}> = ({ children, isActive = false }) => {
  const [localIsActive, setLocalIsActive] = useState<boolean>(isActive);

  const cellInstance = useRef({
    active:isActive,
    setIsActive: setLocalIsActive,
  })

  useEffect(() => {
    cellInstance.current.active = localIsActive;
  }, [localIsActive]);

  return (
    <div className={"w-16 h-10 bg-white border border-gray-200 flex items-center justify-center"}>
      {children}
    </div>
  )
}
