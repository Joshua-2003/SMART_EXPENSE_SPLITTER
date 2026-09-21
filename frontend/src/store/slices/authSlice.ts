import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User, AuthSession } from '../../types';
import { mockUsers, defaultCurrentUser } from '../../mock/users';

interface AuthState {
  currentUser: User;
  allUsers: User[];
  session: AuthSession | null;
  isAuthenticated: boolean;
  isHydrating: boolean;
  isLoading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  currentUser: defaultCurrentUser,
  allUsers: mockUsers,
  session: null,
  isAuthenticated: false,
  isHydrating: true,
  isLoading: false,
  error: null,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCurrentUser: (state, action: PayloadAction<User>) => {
      state.currentUser = action.payload;
      state.session = {
        userId: action.payload.id,
        email: action.payload.email,
        name: action.payload.name,
        token: `mock-jwt-token-${action.payload.id}`,
        expiresIn: 86400,
      };
      state.isAuthenticated = true;
    },
    updateCurrentUser: (state, action: PayloadAction<Partial<User>>) => {
      state.currentUser = {
        ...state.currentUser,
        ...action.payload,
      };
    },
    loginSuccess: (
      state,
      action: PayloadAction<{ user: User; token: string; expiresIn?: number }>
    ) => {
      state.currentUser = action.payload.user;
      state.session = {
        userId: action.payload.user.id,
        email: action.payload.user.email,
        name: action.payload.user.name,
        token: action.payload.token,
        expiresIn: action.payload.expiresIn,
      };
      state.isAuthenticated = true;
      state.isHydrating = false;
      state.error = null;
    },
    setHydrated: (state) => {
      state.isHydrating = false;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.isHydrating = false;
      state.session = null;
      state.currentUser = defaultCurrentUser;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
  },
});

export const {
  setCurrentUser,
  updateCurrentUser,
  loginSuccess,
  setHydrated,
  logout,
  setError,
  setLoading,
} = authSlice.actions;
export default authSlice.reducer;
