import { configureStore } from '@reduxjs/toolkit';
import { TableReducer } from '@/store/slices/tableSlice/tableSlice';

export const store = configureStore({
  reducer: {
    table: TableReducer,
  }
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
