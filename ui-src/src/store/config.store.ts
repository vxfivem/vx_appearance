import { PayloadAction, createSlice } from '@reduxjs/toolkit';

export type TConfig = {
  allowExit: boolean;
  displayClothes: boolean;
  hairColors: [number, number, number][];
  makeupColors: [number, number, number][];
};

const initialState: TConfig = {
  allowExit: true,
  displayClothes: true,
  hairColors: [],
  makeupColors: [],
};

const configSlice = createSlice({
  name: 'config',
  initialState,
  reducers: {
    setConfig(store: TConfig, action: PayloadAction<TConfig>): TConfig {
      return action.payload;
    },
  },
});

export const configReducer = configSlice.reducer;
export const { setConfig } = configSlice.actions;
