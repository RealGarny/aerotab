import { useAppSelector } from '@/store/hooks/useAppSelector';
import { ChangeEvent, ComponentProps, FC, ReactNode, useCallback, useEffect, useRef, useState } from 'react';
import { TCell } from '@/entities/table/table.types';
import { CB_RES, TableContextProvider } from '@/helpers/contexts/TableContext/TableContextProvider';
import { useTable } from '@/helpers/contexts/TableContext/useTable';
import { Button } from '@/shared/ui/button';
import { usePageController } from '@/helpers/contexts/PageController/usePageController';
import { useDebounce } from '@/helpers/hooks/useDebounce';
import { TDataTable, updateTable } from '@/store/slices/tableSlice/tableSlice';
import { useDispatch } from 'react-redux';

export const TableEditor = () => {
  const { activeTable, tables } = useAppSelector(state => state.table);
  const { setCurrentPage } = usePageController();
  const selectedTable = tables[activeTable];
  const dispatch = useDispatch();

  const handleTableChange = (changes: TDataTable) => {
    console.log({changes})
    dispatch(updateTable(changes));
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
  const { saveChanges, pushCol, pushRow } = useTable();
  return(
    <div className='flex gap-3'>
      <Button onClick={() => pushRow()}>Добавить строку</Button>
      <Button onClick={() => pushCol()}>Добавить столбец</Button>
      <Button onClick={() => saveChanges()}>Сохранить</Button>
    </div>
  )
}

const Table = () => {
  const {table} = useTable();
  const selectedHeaders = useRef({rows:[], cols:[]});

  const Rows = useCallback(()=> {
    const onCellClick = (cell:TUICellInstance) => {
      selectedHeaders.current.rows.push()
      cell.setActive(!cell.active);
    }
    return(<EnumeratedRow onCellClick={onCellClick} count={table.rows}/>)
  }, [table.rows]);

  const Cols = useCallback(()=> {
    const onCellClick = (cell:TUICellInstance) => {
      cell.setActive(!cell.active);
    }
    return(
      <div className={'relative'}>
        <div className='flex'>
        <Cell/>
        <EnumeratedRow
          onCellClick={onCellClick}
          className={'flex'}
          count={table.cols}
        />
        </div>
      </div>
  )}, [table.cols]);

  return (
    <div>
      <Cols/>
      <div className={"flex"}>
        <Rows/>
        <div>
        {table.cells.map((rowData, index) => (
          <CellRow
            key={index}
            rowData={rowData}
          />
        ))}
        </div>
      </div>
    </div>
  )
}

const EnumeratedRow:FC<{onCellClick?:(cell:TUICellInstance)=>void; count:number}& ComponentProps<'div'>> = ({count, onCellClick, ...otherProps}) => {
  return(
    <div {...otherProps}>
      {
        new Array(count)
          .fill('')
          .map((_, i)=> (
            <Cell onClick={onCellClick} key={i}>{i + 1}</Cell>
          ))
      }
    </div>
  )
}

const CellRow:FC<{rowData:TCell[]}> = ({ rowData }) => {
  return(
    <div className={'flex'}>
      {rowData.map((cellData,) => (
        <TableCell key={`${cellData.row}-${cellData.col}`} data={cellData}/>
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

type TUICellInstance = {
  active: boolean,
  setActive: (state:boolean)=>void,
}

const Cell:FC<{onClick?:(i:TUICellInstance)=>void, children?:ReactNode; isActive?:boolean}> = ({
  children,
  isActive = false,
  onClick,
  ...props
}) => {
  const [localIsActive, setLocalIsActive] = useState<boolean>(isActive);

  const cellInstance = useRef<TUICellInstance>({
    active: localIsActive,
    setActive: (state:boolean)=>setLocalIsActive(state),
  })

  useEffect(() => {
    cellInstance.current.active = localIsActive;
  }, [localIsActive]);

  return (
    <div
    onClick={() => {
      if(onClick) onClick(cellInstance.current)
    }}
    {...props} className={`w-16 h-10 ${!localIsActive ? 'border-gray-200 bg-white' : 'bg-blue-200 border-blue-300'} border  flex items-center justify-center`}>
      {children}
    </div>
  )
}
