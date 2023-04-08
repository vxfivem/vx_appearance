import { useGameEvent, useGameState } from './hooks/game';
import styled, { css } from 'styled-components';
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom';
import { CreatorLayout } from './components';
import { StoreSpy } from './utils';
import { BotttomClothesPage, HairPage, InheritancePage, TopClothesPage } from './pages';
import { PAGES } from './config';
import { THeadblendStore, setHeadBlend } from './store/headblend.store';
import { TCommonStore, setCommonStore } from './store/common.store';
import { useAppDispatch } from './store';
import { TConfig, setConfig } from './store/config.store';
import { FaceFeaturesPage } from './pages/FaceFeaturesPage';
import { AppearancePage } from './pages/AppearancePage';
import { TFaceFeatures, setFaceFeatures } from './store/face-features.store';
import { BodyAppearancePage } from './pages/BodyAppearancePage';
import { TApppearance, setAppearance } from './store/appearance.store';
import { THair, setHair } from './store/hair.store';

const Wrapper = styled.div<{ isPaused: boolean }>`
  width: 100vw;
  height: 100vh;
  * {
    user-select: none;
  }
  ${({ isPaused }) =>
    isPaused
      ? css`
          display: none;
        `
      : ''}
`;

const router = createBrowserRouter([
  {
    path: '/creator',
    element: <CreatorLayout />,
    children: [
      {
        path: PAGES.inheritance,
        element: <InheritancePage />,
      },
      {
        path: PAGES.faceFeatures,
        element: <FaceFeaturesPage />,
      },
      {
        path: PAGES.appearance,
        element: <AppearancePage />,
      },
      {
        path: PAGES.hair,
        element: <HairPage />,
      },
      {
        path: PAGES.body,
        element: <BodyAppearancePage />,
      },
      {
        path: PAGES.topClothers,
        element: <TopClothesPage />,
      },
      {
        path: PAGES.bottomClothes,
        element: <BotttomClothesPage />,
      },
      {
        path: '',
        element: <Navigate to={PAGES.inheritance} />,
      },
    ],
  },
  {
    path: '/',
    element: <div />,
  },
  {
    path: '*',
    element: <Navigate to={'/'} />,
  },
]);

type CreatorData = {
  config: TConfig;
  headblend: THeadblendStore;
  common: TCommonStore;
  faceFeatures: TFaceFeatures;
  appearance: TApppearance;
  hair: THair;
};

function App() {
  const isPaused = useGameState<boolean>('game:isPaused', false);
  const dispatch = useAppDispatch();
  const isActive = true;

  const update = (data: Omit<CreatorData, 'config'>) => {
    dispatch(setCommonStore(data.common));
    dispatch(setHeadBlend(data.headblend));
    dispatch(setFaceFeatures(data.faceFeatures));
    dispatch(setAppearance(data.appearance));
    dispatch(setHair(data.hair));
  };

  useGameEvent('creator:start', (data: CreatorData) => {
    dispatch(setConfig(data.config));
    update(data);
    router.navigate('/creator');
  });

  useGameEvent('creator:update', update);

  useGameEvent('creator:stop', () => {
    router.navigate('/');
  });

  if (!isActive) {
    return null;
  }

  return (
    <Wrapper isPaused={isPaused} className="app">
      <StoreSpy />
      <RouterProvider router={router} />
    </Wrapper>
  );
}

export default App;
