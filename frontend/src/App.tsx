import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { store } from './store';
import { AppRoutes } from './routes';
import { setupAxiosInterceptors } from './services/interceptors';

export default function App() {
  useEffect(() => {
    // Initialize Axios client interceptors
    setupAxiosInterceptors();
  }, []);

  return (
    <Provider store={store}>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </Provider>
  );
}
