import React, { useEffect, useRef, useState } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import {
  Receipt,
  LayoutDashboard,
  Users,
  Scale,
  ShieldAlert,
  FolderKanban,
  Plus,
  Bell,
  Menu,
  X,
  ChevronDown,
  Check,
  LogOut,
  FolderPlus,
  UserCog,
} from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { setCurrentUser, logout } from '../store/slices/authSlice';
import {
  setCurrentGroup,
  setGroups,
  setGroupDetails,
  setLoading,
  setError,
} from '../store/slices/groupsSlice';
import {
  setCreateExpenseOpen,
  setCreateGroupOpen,
  setAddMemberOpen,
  setMobileSidebarOpen,
  removeToast,
} from '../store/slices/uiSlice';
import {
  markNotificationRead,
  markAllNotificationsRead,
} from '../store/slices/accountabilitySlice';
import { ROUTES } from '../constants/routes';
import { CreateExpenseModal } from '../components/expenses/CreateExpenseModal';
import { CreateGroupModal } from '../components/groups/CreateGroupModal';
import { AddMemberModal } from '../components/members/AddMemberModal';
import { ToastContainer } from '../components/common/Toast';
import { getGroupDetails, listGroups } from '../services/group.service';
import { Group, User } from '../types';

export const MainLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();

  const { currentUser, allUsers } = useAppSelector((state) => state.auth);
  const { currentGroup, groups } = useAppSelector((state) => state.groups);
  const { notifications } = useAppSelector((state) => state.accountability);
  const {
    toasts,
    isCreateExpenseOpen,
    isCreateGroupOpen,
    isAddMemberOpen,
    isMobileSidebarOpen,
  } = useAppSelector((state) => state.ui);

  const [isGroupDropdownOpen, setIsGroupDropdownOpen] = useState(false);
  const [isPersonaDropdownOpen, setIsPersonaDropdownOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  const initialCurrentGroupIdRef = useRef(currentGroup.id);

  useEffect(() => {
    const loadGroups = async () => {
      dispatch(setLoading(true));
      try {
        const { groups } = await listGroups();
        dispatch(setGroups(groups));
        const initialId = initialCurrentGroupIdRef.current;
        if (groups.length > 0 && !groups.some((g) => g.id === initialId)) {
          dispatch(setCurrentGroup(groups[0]));
        }
      } catch (err) {
        dispatch(setError(err instanceof Error ? err.message : 'Failed to load groups.'));
      } finally {
        dispatch(setLoading(false));
      }
    };

    void loadGroups();
  }, [dispatch]);

  useEffect(() => {
    const loadGroupDetails = async () => {
      try {
        const details = await getGroupDetails(currentGroup.id);
        dispatch(setGroupDetails(details));
      } catch (err) {
        dispatch(setError(err instanceof Error ? err.message : 'Failed to load group details.'));
      }
    };

    void loadGroupDetails();
  }, [currentGroup.id, dispatch]);

  const unreadNotifs = notifications.filter((n) => !n.read);

  const navItems = [
    { label: 'Dashboard', path: ROUTES.DASHBOARD, icon: LayoutDashboard },
    { label: 'Expenses', path: ROUTES.EXPENSES, icon: Receipt },
    { label: 'Members & Balances', path: ROUTES.MEMBERS, icon: Users },
    { label: 'Settlement Matrix', path: ROUTES.SETTLEMENT, icon: Scale },
    {
      label: 'Accountability',
      path: ROUTES.ACCOUNTABILITY,
      icon: ShieldAlert,
      badge: 'Core',
    },
    { label: 'All Groups', path: ROUTES.GROUPS, icon: FolderKanban },
    { label: 'Profile', path: ROUTES.PROFILE, icon: UserCog },
  ];

  const handleSelectGroup = (g: Group) => {
    dispatch(setCurrentGroup(g));
    setIsGroupDropdownOpen(false);
  };

  const handleSwitchUser = (u: User) => {
    dispatch(setCurrentUser(u));
    setIsPersonaDropdownOpen(false);
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate(ROUTES.LOGIN);
  };

  const getBreadcrumb = () => {
    const p = location.pathname;
    if (p.includes('/expenses')) return 'Shared Expenses';
    if (p.includes('/members')) return 'Members & Balances';
    if (p.includes('/settlement')) return 'Settlement Matrix';
    if (p.includes('/accountability')) return 'Accountability & Overdue';
    if (p.includes('/groups')) return 'Group Spaces';
    if (p.includes('/profile')) return 'Profile Settings';
    return 'Dashboard Overview';
  };

  const sidebarContent = (
    <div className="flex flex-col h-full bg-white border-r border-slate-200">
      {/* Brand Header */}
      <div className="h-14 px-4 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-emerald-600 flex items-center justify-center text-white font-bold text-xs shadow-xs">
            <Receipt className="w-4 h-4" />
          </div>
          <div>
            <span className="font-bold text-sm tracking-tight text-slate-900 block leading-tight">
              SmartSplitter
            </span>
            <span className="text-[10px] text-slate-400 font-medium block leading-none">
              Accountability Suite
            </span>
          </div>
        </div>
      </div>

      {/* Group Switcher */}
      <div className="p-3 border-b border-slate-100">
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsGroupDropdownOpen(!isGroupDropdownOpen)}
            className="w-full flex items-center justify-between p-2 rounded-lg border border-slate-200/80 bg-slate-50 hover:bg-slate-100/80 text-left transition-colors cursor-pointer"
          >
            <div className="min-w-0 pr-2">
              <div className="text-[10px] uppercase font-semibold tracking-wider text-slate-500 leading-none">
                Active Space
              </div>
              <div className="text-xs font-semibold text-slate-900 truncate mt-1">
                {currentGroup.name}
              </div>
            </div>
            <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
          </button>

          {isGroupDropdownOpen && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-lg z-30 py-1 max-h-56 overflow-y-auto">
              <div className="px-3 py-1.5 text-[10px] font-semibold uppercase text-slate-400">
                Switch Group
              </div>
              {groups.map((g) => (
                <button
                  key={g.id}
                  type="button"
                  onClick={() => handleSelectGroup(g)}
                  className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-slate-50 transition-colors ${
                    g.id === currentGroup.id ? 'font-semibold text-emerald-700 bg-emerald-50/50' : 'text-slate-700'
                  }`}
                >
                  <span className="truncate">{g.name}</span>
                  {g.id === currentGroup.id && <Check className="w-3.5 h-3.5 text-emerald-600" />}
                </button>
              ))}
              <div className="pt-1 border-t border-slate-100 mt-1">
                <button
                  type="button"
                  onClick={() => {
                    setIsGroupDropdownOpen(false);
                    dispatch(setCreateGroupOpen(true));
                  }}
                  className="w-full text-left px-3 py-1.5 text-xs text-emerald-600 hover:bg-emerald-50 flex items-center gap-1.5"
                >
                  <FolderPlus className="w-3.5 h-3.5" />
                  <span>Create New Group</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Primary Action Button */}
      <div className="px-3 py-2.5">
        <button
          type="button"
          onClick={() => dispatch(setCreateExpenseOpen(true))}
          className="w-full py-2 px-3 text-xs font-medium text-white bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 rounded-[10px] shadow-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Shared Expense</span>
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => dispatch(setMobileSidebarOpen(false))}
              className={({ isActive }) =>
                `flex items-center justify-between px-3 py-2 text-xs rounded-lg font-medium transition-colors ${
                  isActive
                    ? 'bg-emerald-50 text-emerald-800 font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`
              }
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <Icon className="w-4 h-4 shrink-0" />
                <span className="truncate">{item.label}</span>
              </div>
              {item.badge && (
                <span className="text-[10px] uppercase font-semibold px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800">
                  {item.badge}
                </span>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* User Footer Profile */}
      <div className="p-3 border-t border-slate-100 relative">
        <div
          onClick={() => setIsPersonaDropdownOpen(!isPersonaDropdownOpen)}
          className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors"
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-xs font-bold text-slate-700 shrink-0">
              {currentUser.avatarUrl ? (
                <img
                  src={currentUser.avatarUrl}
                  alt={currentUser.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                currentUser.name.charAt(0)
              )}
            </div>
            <div className="min-w-0">
              <div className="text-xs font-semibold text-slate-900 truncate">
                {currentUser.name}
              </div>
              <div className="text-[10px] text-slate-400 truncate font-mono">
                {currentUser.email}
              </div>
            </div>
          </div>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
        </div>

        {/* Persona Switcher Dropdown */}
        {isPersonaDropdownOpen && (
          <div className="absolute bottom-full left-3 right-3 mb-1 bg-white border border-slate-200 rounded-xl shadow-lg z-30 py-1.5">
            <div className="px-3 py-1 text-[10px] font-semibold uppercase text-slate-400">
              Switch Test Persona
            </div>
            {allUsers.map((u) => (
              <button
                key={u.id}
                type="button"
                onClick={() => handleSwitchUser(u)}
                className={`w-full text-left px-3 py-1.5 text-xs flex items-center justify-between hover:bg-slate-50 ${
                  u.id === currentUser.id ? 'font-semibold text-emerald-700 bg-emerald-50/50' : 'text-slate-700'
                }`}
              >
                <span className="truncate">{u.name}</span>
                {u.id === currentUser.id && <Check className="w-3.5 h-3.5 text-emerald-600" />}
              </button>
            ))}
            <div className="pt-1.5 border-t border-slate-100 mt-1">
              <button
                type="button"
                onClick={handleLogout}
                className="w-full text-left px-3 py-1.5 text-xs text-rose-600 hover:bg-rose-50 flex items-center gap-1.5"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex font-sans antialiased">
      {/* Desktop Sidebar (Fixed) */}
      <aside className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 z-20">
        {sidebarContent}
      </aside>

      {/* Mobile Slide-over Drawer */}
      {isMobileSidebarOpen && (
        <div className="fixed inset-0 z-40 md:hidden flex">
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs"
            onClick={() => dispatch(setMobileSidebarOpen(false))}
          />
          <div className="relative w-64 max-w-xs flex-1 flex flex-col z-50">
            {sidebarContent}
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col md:pl-64 min-w-0">
        {/* Top Sticky Header */}
        <header className="sticky top-0 z-10 h-14 bg-white/95 backdrop-blur-xs border-b border-slate-200 px-4 md:px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => dispatch(setMobileSidebarOpen(true))}
              className="p-1.5 -ml-1 text-slate-600 hover:text-slate-900 rounded-lg md:hidden"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-1.5 text-xs">
              <span className="font-semibold text-slate-900">{currentGroup.name}</span>
              <span className="text-slate-400">/</span>
              <span className="text-slate-500 font-medium">{getBreadcrumb()}</span>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            {/* Notification Bell */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg relative transition-colors"
                title="Notifications & Alerts"
              >
                <Bell className="w-4 h-4" />
                {unreadNotifs.length > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white" />
                )}
              </button>

              {isNotificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white border border-slate-200 rounded-xl shadow-xl z-30 py-2">
                  <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-900">Notifications</span>
                    {unreadNotifs.length > 0 && (
                      <button
                        type="button"
                        onClick={() => dispatch(markAllNotificationsRead())}
                        className="text-[11px] text-emerald-600 hover:text-emerald-700 font-medium"
                      >
                        Mark all as read
                      </button>
                    )}
                  </div>
                  <div className="max-h-64 overflow-y-auto divide-y divide-slate-100">
                    {notifications.length === 0 ? (
                      <div className="p-4 text-center text-xs text-slate-400">
                        No notifications right now.
                      </div>
                    ) : (
                      notifications.map((n) => (
                        <div
                          key={n.notificationId}
                          onClick={() => dispatch(markNotificationRead(n.notificationId))}
                          className={`p-3 text-xs hover:bg-slate-50 cursor-pointer ${
                            !n.read ? 'bg-emerald-50/30' : ''
                          }`}
                        >
                          <div className="font-medium text-slate-800 leading-snug">{n.message}</div>
                          <div className="text-[10px] text-slate-400 mt-1 font-mono">
                            {new Date(n.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 md:p-6 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>

      {/* Global Modals */}
      <CreateExpenseModal
        isOpen={isCreateExpenseOpen}
        onClose={() => dispatch(setCreateExpenseOpen(false))}
      />

      <CreateGroupModal
        isOpen={isCreateGroupOpen}
        onClose={() => dispatch(setCreateGroupOpen(false))}
      />

      <AddMemberModal
        isOpen={isAddMemberOpen}
        onClose={() => dispatch(setAddMemberOpen(false))}
      />

      {/* Toast Notifications */}
      <ToastContainer
        toasts={toasts}
        onDismiss={(toastId) => dispatch(removeToast(toastId))}
      />
    </div>
  );
};
