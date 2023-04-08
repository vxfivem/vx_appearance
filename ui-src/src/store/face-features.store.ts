import { PayloadAction, createSlice } from '@reduxjs/toolkit';

export type TFaceFeatures = number[];

const initialState: TFaceFeatures = Array.from<number>({ length: 20 }).fill(0);

const slice = createSlice({
  name: 'faceFeatures',
  initialState,
  reducers: {
    setFaceFeature(store: TFaceFeatures, action: PayloadAction<{ index: number; value: number }>): void {
      store[action.payload.index] = action.payload.value;
    },
    setFaceFeatures(store: TFaceFeatures, action: PayloadAction<TFaceFeatures>): TFaceFeatures {
      return action.payload;
    },
  },
});

export const { setFaceFeature, setFaceFeatures } = slice.actions;
export const faceFeaturesReducer = slice.reducer;
