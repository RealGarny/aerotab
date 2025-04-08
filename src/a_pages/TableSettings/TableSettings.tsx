import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { addTable, setActiveTable, TDataTable } from '@/store/slices/tableSlice/tableSlice';
import { usePageController } from '@/helpers/contexts/PageController/usePageController';

const TableSettings = () => {
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm();
  const dispatch = useDispatch();
  const { setCurrentPage } = usePageController();

  const handleCreateTable = (values: Record<string, string>) => {
    const table: TDataTable = {
      rows: Number(values.rows),
      cols: Number(values.cols),
      name: values.name,
      cells: [],
    };
    dispatch(addTable(table));
    dispatch(setActiveTable(table.name));
    setCurrentPage('table-editor');
  };
  return (
    <div>
      <div className={'flex flex-col gap-10 items-center mt-[30vh]'}>
        <p className={'text-5xl font-bold'}>Создание таблицы</p>
        <form
          className={'flex flex-col gap-5  items-stretch w-full max-w-[300px]'}
          onSubmit={handleSubmit(handleCreateTable)}
        >
          <div className={'flex flex-col gap-2'}>
            <Input
              {...register('name', { required: true })}
              type='text'
              error={!!errors.name}
              placeholder={'Название'}
            />
            <Input
              {...register('rows', { required: true })}
              type={'number'}
              error={!!errors.rows}
              placeholder={'кол-во строк'}
            />
            <Input
              {...register('cols', { required: true })}
              type={'number'}
              error={!!errors.cols}
              placeholder={'кол-во столбцов'}
            />
          </div>
          <Button>Создать</Button>
        </form>
      </div>
    </div>
  );
};

export default TableSettings;
