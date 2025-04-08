'use client';
import { PageControllerProvider } from '@/helpers/contexts/PageController/PageControllerProvider';
import PAGES from '@/constants/siteConfig/pages';
import { Provider } from 'react-redux';
import { store } from '@/store/store';

export default function Home() {
  return (
    <Provider store={store}>
      <PageControllerProvider pages={PAGES} defaultPage={'main-menu'} />
    </Provider>
  );
}
