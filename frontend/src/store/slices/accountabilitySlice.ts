import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  PaymentHistoryRecord,
  MemberReliability,
  InAppNotification,
} from '../../types';
import { mockPaymentHistory, mockMemberReliability } from '../../mock/history';
import { mockNotifications } from '../../mock/notifications';

interface AccountabilityState {
  paymentHistory: PaymentHistoryRecord[];
  reliabilityScores: Record<string, MemberReliability>;
  notifications: InAppNotification[];
  overdueThresholdDays: number;
  isLoading: boolean;
  error: string | null;
}

const initialState: AccountabilityState = {
  paymentHistory: mockPaymentHistory,
  reliabilityScores: mockMemberReliability,
  notifications: mockNotifications,
  overdueThresholdDays: 7,
  isLoading: false,
  error: null,
};

export const accountabilitySlice = createSlice({
  name: 'accountability',
  initialState,
  reducers: {
    setOverdueThreshold: (state, action: PayloadAction<number>) => {
      state.overdueThresholdDays = action.payload;
    },
    addPaymentHistoryRecord: (state, action: PayloadAction<PaymentHistoryRecord>) => {
      state.paymentHistory.unshift(action.payload);
    },
    addNotification: (state, action: PayloadAction<InAppNotification>) => {
      state.notifications.unshift(action.payload);
    },
    markNotificationRead: (state, action: PayloadAction<string>) => {
      const notif = state.notifications.find((n) => n.notificationId === action.payload);
      if (notif) notif.read = true;
    },
    markAllNotificationsRead: (state) => {
      state.notifications.forEach((n) => {
        n.read = true;
      });
    },
    updateMemberReliability: (
      state,
      action: PayloadAction<{ userId: string; reliability: MemberReliability }>
    ) => {
      state.reliabilityScores[action.payload.userId] = action.payload.reliability;
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
  setOverdueThreshold,
  addPaymentHistoryRecord,
  addNotification,
  markNotificationRead,
  markAllNotificationsRead,
  updateMemberReliability,
  setLoading,
  setError,
} = accountabilitySlice.actions;

export default accountabilitySlice.reducer;
