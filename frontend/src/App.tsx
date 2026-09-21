import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { store } from './store';
import { AppRoutes } from './routes';
import { setupAxiosInterceptors } from './services/interceptors';
import { getProfile } from './services/user.service';
import { loginSuccess, logout, setHydrated } from './store/slices/authSlice';

const TOKEN_STORAGE_KEY = 'smart_splitter_token';

// Attach Axios interceptors at module load, before the app renders and before
// any startup data request can run. This guarantees the bearer token is
// injected on the first request and that a 401 clears the session.
setupAxiosInterceptors(() => {
  store.dispatch(logout());
});

export default function App() {
  useEffect(() => {
    const token = localStorage.getItem(TOKEN_STORAGE_KEY);

    if (!token) {
      store.dispatch(setHydrated());
      return;
    }

    let cancelled = false;

    getProfile()
      .then((profile) => {
        if (cancelled) return;
        store.dispatch(
          loginSuccess({
            user: {
              id: profile.userId,
              email: profile.email,
              name: profile.name,
              createdAt: profile.createdAt,
            },
            token,
          })
        );
      })
      .catch(() => {
        // Invalid or expired tokens are cleared by the response interceptor,
        // which also dispatches logout() so the guards route back to login.
      })
      .finally(() => {
        if (cancelled) return;
        store.dispatch(setHydrated());
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <Provider store={store}>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </Provider>
  );
}
