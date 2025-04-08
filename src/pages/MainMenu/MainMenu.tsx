import {siteConfig} from "@/constants/siteConfig/siteConfig";
import { Button } from '@/shared/ui/button';
import { usePageController } from '@/helpers/contexts/PageController/usePageController';

export const MainMenu = () => {
  const { setCurrentPage } = usePageController();

  return (
    <div>
      <div className={'flex flex-col gap-10 items-center mt-[30vh]'}>
        <p className={'text-5xl uppercase font-bold'}>{siteConfig.projectName}</p>
        <div className={'flex flex-col gap-2  items-stretch w-full max-w-[300px]'}>
          <Button onClick={()=>setCurrentPage('table-settings')}>Новая таблица</Button>
          <Button onClick={() =>setCurrentPage('tables-list')}>Загрузить таблицу</Button>
        </div>
      </div>
    </div>
  )
}
