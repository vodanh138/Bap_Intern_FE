import React, { Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import App from './App';
import setupInterceptors from './services/setupInterceptors';
import './i18n';
import { store } from './store/store';
import './index.css';
import { LoadingProvider } from './contexts/LoadingContext';
import { PopupProvider } from './contexts/PopupContext';
import { NotificationProvider } from './contexts/NotificationContext';


const root = createRoot(document.getElementById('root'));
root.render(
  <Provider store={store}>
    <BrowserRouter>
      <NotificationProvider>
        <LoadingProvider>
          <PopupProvider>
            {/* <App /> */}
            <Suspense fallback="loading">
              <App />
            </Suspense>
          </PopupProvider>
        </LoadingProvider>
      </NotificationProvider>
    </BrowserRouter>
  </Provider>
);

setupInterceptors(store);
