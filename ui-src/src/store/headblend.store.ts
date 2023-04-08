import { PayloadAction, createSlice } from '@reduxjs/toolkit';

export type THeadblendStore = {
  mother: number;
  father: number;
  ancestor: number;
  resemblance: number;
  skinMix: number;
  ancestorInfluence: number;
};
const initialState: THeadblendStore = {
  mother: 0,
  father: 0,
  ancestor: 0,
  resemblance: 0,
  skinMix: 0,
  ancestorInfluence: 0,
};

type Keys = keyof THeadblendStore;

const slice = createSlice({
  name: 'headblend',
  initialState,
  reducers: {
    setHeadBlend(store: THeadblendStore, action: PayloadAction<THeadblendStore>): THeadblendStore {
      return action.payload;
    },
    setHeadBlendValue(store: THeadblendStore, action: PayloadAction<{ index: Keys; value: number }>): void {
      store[action.payload.index] = action.payload.value;
    },
  },
});

export const headblendReducer = slice.reducer;

export const { setHeadBlend, setHeadBlendValue } = slice.actions;
