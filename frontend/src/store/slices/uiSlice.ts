import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface ToastItem {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
}

interface UiState {
  toasts: ToastItem[];
  isCreateExpenseOpen: boolean;
  isCreateGroupOpen: boolean;
  isAddMemberOpen: boolean;
  isMobileSidebarOpen: boolean;
}

const initialState: UiState = {
  toasts: [],
  isCreateExpenseOpen: false,
  isCreateGroupOpen: false,
  isAddMemberOpen: false,
  isMobileSidebarOpen: false,
};

export const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    addToast: (state, action: PayloadAction<Omit<ToastItem, 'id'>>) => {
      state.toasts.push({
        ...action.payload,
        id: `toast-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      });
    },
    removeToast: (state, action: PayloadAction<string>) => {
      state.toasts = state.toasts.filter((t) => t.id !== action.payload);
    },
    setCreateExpenseOpen: (state, action: PayloadAction<boolean>) => {
      state.isCreateExpenseOpen = action.payload;
    },
    setCreateGroupOpen: (state, action: PayloadAction<boolean>) => {
      state.isCreateGroupOpen = action.payload;
    },
    setAddMemberOpen: (state, action: PayloadAction<boolean>) => {
      state.isAddMemberOpen = action.payload;
    },
    setMobileSidebarOpen: (state, action: PayloadAction<boolean>) => {
      state.isMobileSidebarOpen = action.payload;
    },
  },
});

export const {
  addToast,
  removeToast,
  setCreateExpenseOpen,
  setCreateGroupOpen,
  setAddMemberOpen,
  setMobileSidebarOpen,
} = uiSlice.actions;

export default uiSlice.reducer;
