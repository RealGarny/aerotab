import { useAppSelector } from '@/store/hooks/useAppSelector';
import { siteConfig } from '@/constants/siteConfig/siteConfig';
import { Button } from '@/shared/ui/button';
import { TTable } from '@/entities/table/table.types';
import { setActiveTable } from '@/store/slices/tableSlice/tableSlice';
import { useDispatch } from 'react-redux';
import { usePageController } from '@/helpers/contexts/PageController/usePageController';


export const TablesList = () => {
  const {tables} = useAppSelector(state => state.table);
  const dispatch = useDispatch();
  const { setCurrentPage } = usePageController();
  const tableKeys = Object.keys(tables);
  const isEmpty = !tableKeys.length;

  if(isEmpty) {
    return (<div className={'w-full h-full flex justify-center items-center'}>У вас еще нет таблиц</div>)
  }

  const handleOpenTable = (table:TTable) => {
    dispatch(setActiveTable(table.name));
    setCurrentPage('table-editor');
  }

  return(
    <div>
      <div className={'flex flex-col gap-10 items-center mt-[30vh]'}>
        {tableKeys.map(tableKey => (
          <div className={'bg-slate-100 p-4 rounded-xl min-w-[40vw] flex items-center justify-between'}>
            <div className={'flex flex-col gap-4'}>
              <p className={'font-semibold text-xl'}>Таблица: {tables[tableKey].name}</p>
              <div className={'flex gap-3'}>
                <p className={'text-sm'}>Колонок: {tables[tableKey].cols}</p>
                <p className={'text-sm'}>Рядов: {tables[tableKey].rows}</p>
              </div>
            </div>
            <Button onClick={() => handleOpenTable(tables[tableKey])}>Открыть</Button>
          </div>
        ))}
      </div>
    </div>
  )
}
