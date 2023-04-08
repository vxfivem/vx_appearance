import { faceFeaturesReducer } from './face-features.store';
import { configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { headblendReducer } from './headblend.store';
import { commonReducer } from './common.store';
import { configReducer } from './config.store';
import { appearanceReducer } from './appearance.store';
import { hairReducer } from './hair.store';

export const appStore = configureStore({
  reducer: {
    headblend: headblendReducer,
    common: commonReducer,
    config: configReducer,
    faceFeatures: faceFeaturesReducer,
    appearance: appearanceReducer,
    hair: hairReducer,
  },
});

export type RootState = ReturnType<typeof appStore.getState>;
export type AppDispatch = typeof appStore.dispatch;

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export const useHeadblend = () => useAppSelector((x) => x.headblend);
export const useGender = () => useAppSelector((x) => x.common.gender);
export const useEyeColor = () => useAppSelector((x) => x.common.eyeColor);
export const useConfig = () => useAppSelector((x) => x.config);
export const useFaceFeatures = () => useAppSelector((x) => x.faceFeatures);
export const useAppearance = () => useAppSelector((x) => x.appearance);
export const useHair = () => useAppSelector((x) => x.hair);
