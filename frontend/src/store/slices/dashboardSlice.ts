import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { DashboardData } from '../../types';
import { logout } from './authSlice';

interface DashboardState {
  data: DashboardData | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: DashboardState = {
  data: null,
  isLoading: false,
  error: null,
};

export const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    setDashboard: (state, action: PayloadAction<DashboardData | null>) => {
      state.data = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(logout, () => initialState);
  },
});

export const { setDashboard, setLoading, setError } = dashboardSlice.actions;

export default dashboardSlice.reducer;