import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Group, GroupMember } from '../../types';
import { mockGroups, defaultCurrentGroup, mockGroupMembers } from '../../mock/groups';

interface GroupsState {
  groups: Group[];
  currentGroup: Group;
  members: GroupMember[];
  isLoading: boolean;
  error: string | null;
}

interface GroupDetailsPayload {
  group: Group;
  members: GroupMember[];
}

const initialState: GroupsState = {
  groups: mockGroups,
  currentGroup: defaultCurrentGroup,
  members: mockGroupMembers[defaultCurrentGroup.id] || [],
  isLoading: false,
  error: null,
};

export const groupsSlice = createSlice({
  name: 'groups',
  initialState,
  reducers: {
    setCurrentGroup: (state, action: PayloadAction<Group>) => {
      state.currentGroup = action.payload;
      state.members = mockGroupMembers[action.payload.id] || [];
    },
    addGroup: (state, action: PayloadAction<Group>) => {
      state.groups.unshift(action.payload);
      state.currentGroup = action.payload;
    },
    setGroups: (state, action: PayloadAction<Group[]>) => {
      state.groups = action.payload;
    },
    setGroupDetails: (state, action: PayloadAction<GroupDetailsPayload>) => {
      state.currentGroup = {
        ...state.currentGroup,
        ...action.payload.group,
      };
      state.members = action.payload.members;
    },
    createGroup: (state, action: PayloadAction<{ name: string; description?: string; adminId: string }>) => {
      const newGroup: Group = {
        id: `grp-${Date.now()}`,
        name: action.payload.name,
        description: action.payload.description || '',
        adminId: action.payload.adminId,
        memberCount: 1,
        currencySymbol: '₱',
        createdAt: new Date().toISOString(),
      };
      state.groups.unshift(newGroup);
      state.currentGroup = newGroup;
      state.members = [
        {
          id: `gm-${Date.now()}`,
          groupId: newGroup.id,
          userId: action.payload.adminId,
          name: 'Alex Rivera',
          email: 'alex.rivera@example.com',
          role: 'admin',
          balance: 0,
          joinedAt: new Date().toISOString(),
        },
      ];
    },
    updateGroupDetails: (state, action: PayloadAction<{ id: string; name: string; description?: string }>) => {
      const group = state.groups.find((g) => g.id === action.payload.id);
      if (group) {
        group.name = action.payload.name;
        group.description = action.payload.description;
        if (state.currentGroup.id === group.id) {
          state.currentGroup.name = action.payload.name;
          state.currentGroup.description = action.payload.description;
        }
      }
    },
    addMember: (state, action: PayloadAction<GroupMember>) => {
      state.members.push(action.payload);
      state.currentGroup.memberCount = state.members.length;
      const g = state.groups.find((grp) => grp.id === state.currentGroup.id);
      if (g) g.memberCount = state.members.length;
    },
    removeMember: (state, action: PayloadAction<string>) => {
      state.members = state.members.filter((m) => m.userId !== action.payload);
      state.currentGroup.memberCount = state.members.length;
      const g = state.groups.find((grp) => grp.id === state.currentGroup.id);
      if (g) g.memberCount = state.members.length;
    },
    updateMemberBalances: (state, action: PayloadAction<Record<string, number>>) => {
      state.members.forEach((m) => {
        if (action.payload[m.userId] !== undefined) {
          m.balance = action.payload[m.userId];
        }
      });
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
  setCurrentGroup,
  addGroup,
  setGroups,
  setGroupDetails,
  createGroup,
  updateGroupDetails,
  addMember,
  removeMember,
  updateMemberBalances,
  setLoading,
  setError,
} = groupsSlice.actions;

export default groupsSlice.reducer;
