import { PayloadAction, createSlice } from '@reduxjs/toolkit';

export type TAppearanceItem = {
  color: number;
  opacity: number;
  value: number;
};

export type TApppearance = TAppearanceItem[];

const initialState: TApppearance = Array.from<TAppearanceItem>({ length: 13 }).fill({
  color: 0,
  opacity: 100,
  value: -1,
});

const configSlice = createSlice({
  name: 'appearance',
  initialState,
  reducers: {
    setAppearance(store: TApppearance, action: PayloadAction<TApppearance>): TApppearance {
      return action.payload;
    },
    setAppearanceValue(store: TApppearance, action: PayloadAction<{ index: number; value: number }>): void {
      store[action.payload.index].value = action.payload.value;
    },
    setAppearanceColor(store: TApppearance, action: PayloadAction<{ index: number; value: number }>): void {
      store[action.payload.index].color = action.payload.value;
    },
    setAppearanceOpacity(store: TApppearance, action: PayloadAction<{ index: number; value: number }>): void {
      store[action.payload.index].opacity = action.payload.value;
    },
    setAppearanceItem(store: TApppearance, action: PayloadAction<{ index: number; value: TAppearanceItem }>): void {
      store[action.payload.index] = action.payload.value;
    },
  },
});

export const appearanceReducer = configSlice.reducer;
export const { setAppearance, setAppearanceItem, setAppearanceColor, setAppearanceOpacity, setAppearanceValue } =
  configSlice.actions;
