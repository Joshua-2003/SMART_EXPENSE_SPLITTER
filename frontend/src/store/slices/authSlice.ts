import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User, AuthSession } from '../../types';
import { mockUsers, defaultCurrentUser } from '../../mock/users';

interface AuthState {
  currentUser: User;
  allUsers: User[];
  session: AuthSession | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  currentUser: defaultCurrentUser,
  allUsers: mockUsers,
  session: {
    userId: defaultCurrentUser.id,
    email: defaultCurrentUser.email,
    name: defaultCurrentUser.name,
    token: 'mock-jwt-token-alex-rivera',
    expiresIn: 86400,
  },
  isAuthenticated: true,
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
    loginSuccess: (state, action: PayloadAction<{ user: User; token: string }>) => {
      state.currentUser = action.payload.user;
      state.session = {
        userId: action.payload.user.id,
        email: action.payload.user.email,
        name: action.payload.user.name,
        token: action.payload.token,
      };
      state.isAuthenticated = true;
      state.error = null;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.session = null;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
  },
});

export const { setCurrentUser, loginSuccess, logout, setError, setLoading } = authSlice.actions;
export default authSlice.reducer;
