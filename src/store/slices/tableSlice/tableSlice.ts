import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TCell, TTable } from '@/entities/table/table.types';

export type TDataTable = {
   name: string;
   rows: number;
   cols: number;
   cells: TCell[];
}
interface InitialState {
  tables: Record<string, TDataTable>;
  activeTable: string;
  loading: boolean;
}

const initialState:InitialState = {
  tables: {},
  activeTable:'',
  loading: true,
}

export const tableSlice = createSlice({
  name:'tableSlice',
  initialState,
  reducers: {
    addTable: (state, action:PayloadAction<TDataTable>) => {
      state.tables = {
        ...state.tables,
        [action.payload.name]: action.payload
      };
      return state;
    },
    deleteTable: (state, action:PayloadAction<string>) => {
      delete state.tables[action.payload];
      return state;
    },
    updateTable: (state, action:PayloadAction<TDataTable>) => {
      state.tables[action.payload.name] = action.payload;
      return state;
    },
    setActiveTable: (state, action:PayloadAction<string>) => {
      state.activeTable = action.payload;
      return state;
    }
  }
})
export const TableReducer = tableSlice.reducer;
export const { addTable, deleteTable, updateTable, setActiveTable } = tableSlice.actions;

