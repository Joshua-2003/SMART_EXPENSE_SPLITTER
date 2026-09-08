import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Expense, ExpenseSplit } from '../../types';
import { defaultExpenses } from '../../mock/expenses';

interface ExpensesState {
  expenses: Expense[];
  selectedExpense: Expense | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: ExpensesState = {
  expenses: defaultExpenses,
  selectedExpense: null,
  isLoading: false,
  error: null,
};

export const expensesSlice = createSlice({
  name: 'expenses',
  initialState,
  reducers: {
    setExpenses: (state, action: PayloadAction<Expense[]>) => {
      state.expenses = action.payload;
    },
    setSelectedExpense: (state, action: PayloadAction<Expense | null>) => {
      state.selectedExpense = action.payload;
    },
    addExpense: (state, action: PayloadAction<Expense>) => {
      state.expenses.unshift(action.payload);
    },
    markSplitCompleted: (
      state,
      action: PayloadAction<{ expenseId: string; splitId: string }>
    ) => {
      const expense = state.expenses.find((e) => e.id === action.payload.expenseId);
      if (expense) {
        const split = expense.splits.find((s) => s.splitId === action.payload.splitId);
        if (split) {
          split.paymentStatus = 'completed';
          split.paidAt = new Date().toISOString();
        }
        if (state.selectedExpense?.id === expense.id) {
          state.selectedExpense = { ...expense };
        }
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const {
  setExpenses,
  setSelectedExpense,
  addExpense,
  markSplitCompleted,
  setLoading,
  setError,
} = expensesSlice.actions;

export default expensesSlice.reducer;
