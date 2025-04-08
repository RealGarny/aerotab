import { MainMenu } from '@/pages/MainMenu/MainMenu';
import { TableSettings } from '@/pages/TableSettings/TableSettings';
import { TableEditor } from '@/pages/TableEditor/TableEditor';
import { TablesList } from '@/pages/TablesList/TablesList';

const PAGES = {
  'main-menu': <MainMenu />,
  'table-settings':<TableSettings />,
  'table-editor': <TableEditor/>,
  'tables-list': <TablesList/>,
}

export default  PAGES;
