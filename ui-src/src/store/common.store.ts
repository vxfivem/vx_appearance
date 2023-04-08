import { PayloadAction, createSlice } from '@reduxjs/toolkit';

export type TGender = 'male' | 'female';
export type TCommonStore = { gender: TGender; eyeColor: number };
const initialState: TCommonStore = {
  gender: 'male',
  eyeColor: 0,
};

const slice = createSlice({
  name: 'common',
  initialState,
  reducers: {
    setGender(store: TCommonStore, action: PayloadAction<TGender>): void {
      store.gender = action.payload;
    },
    setEyeColor(store: TCommonStore, action: PayloadAction<number>): void {
      store.eyeColor = action.payload;
    },
    setCommonStore(store: TCommonStore, action: PayloadAction<TCommonStore>): TCommonStore {
      return action.payload;
    },
  },
});

export const commonReducer = slice.reducer;
export const { setGender, setEyeColor, setCommonStore } = slice.actions;
