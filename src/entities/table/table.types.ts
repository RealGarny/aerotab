type TCell = {
  row: number;
  col: number;
  data: string;
}

type TTable = {
  name: string;
  rows: number;
  cols: number;
  cells: TCell[][],
}

export type { TTable, TCell };
