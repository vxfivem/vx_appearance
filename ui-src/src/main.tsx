import React, { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { GlobalStyles } from './styles';
import { Provider } from 'react-redux';
import { appStore } from './store';
import { StoreSpy } from './utils';
import './assets/fonts/exo2/stylesheet.css';

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import Backend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';
import { gameConfig } from './config';
/// <reference types="vite-plugin-svgr/client" />

Promise.all([
  fetch(`https://cfx-nui-${GetParentResourceName()}/configs/eyes.json`).then((r) => r.json()),
  fetch(`https://cfx-nui-${GetParentResourceName()}/configs/parents.json`).then((r) => r.json()),
  i18n
    .use(Backend)
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
      fallbackLng: 'en',
      debug: false,
      interpolation: {
        escapeValue: false, // not needed for react as it escapes by default
      },
      backend: {
        loadPath: `https://cfx-nui-${GetParentResourceName()}/configs/locales.json`,
      },
    }),
])
  .then(([eyes, parents]) => {
    gameConfig.eyes = eyes;
    gameConfig.fathers = parents.fathers;
    gameConfig.mothers = parents.mothers;
  })
  .then(() => {
    ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
      <>
        <Provider store={appStore}>
          <GlobalStyles />
          <StoreSpy />
          <Suspense fallback={''}>
            <App />
          </Suspense>
        </Provider>
      </>
    );
  });
