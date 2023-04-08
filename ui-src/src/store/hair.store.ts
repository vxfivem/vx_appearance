import { PayloadAction, createSlice } from '@reduxjs/toolkit';

export type THair = {
  primaryColor: number;
  secondaryColor: number;
  variation: number;
  max: number;
};
const initialState: THair = {
  primaryColor: 0,
  secondaryColor: 0,
  variation: 0,
  max: 0,
};

const slice = createSlice({
  name: 'hair',
  initialState,
  reducers: {
    setHair(store: THair, action: PayloadAction<THair>): THair {
      return action.payload;
    },
    setHairPrimaryColor(store: THair, action: PayloadAction<number>): void {
      store.primaryColor = action.payload;
    },
    setHairSecondaryColor(store: THair, action: PayloadAction<number>): void {
      store.secondaryColor = action.payload;
    },
    setHairVariation(store: THair, action: PayloadAction<number>): void {
      store.variation = action.payload;
    },
  },
});

export const hairReducer = slice.reducer;
export const { setHair, setHairPrimaryColor, setHairSecondaryColor, setHairVariation } = slice.actions;
