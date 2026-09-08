import React, { useState, useRef, useEffect } from 'react';
import {
  Menu,
  Bell,
  Check,
  Plus,
  UserCheck,
  Shield,
  ChevronDown,
  AlertTriangle,
  Receipt,
  Calendar,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ActiveTab } from './Sidebar';

interface HeaderProps {
  activeTab: ActiveTab;
  onOpenNewExpense: () => void;
  onToggleMobileMenu: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onOpenNewExpense,
  onToggleMobileMenu,
}) => {
  const {
    currentUser,
    setCurrentUser,
    allUsers,
    currentGroup,
    notifications,
    unreadNotificationCount,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    isCurrentUserAdmin,
  } = useApp();

  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isUserSwitcherOpen, setIsUserSwitcherOpen] = useState(false);

  const notifRef = useRef<HTMLDivElement>(null);
  const userRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setIsNotifOpen(false);
      }
      if (userRef.current && !userRef.current.contains(e.target as Node)) {
        setIsUserSwitcherOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getPageTitle = () => {
    switch (activeTab) {
      case 'dashboard':
        return 'Overview Dashboard';
      case 'expenses':
        return 'Group Shared Expenses';
      case 'members':
        return 'Group Members & Balances';
      case 'settlement':
        return 'Settlement Matrix & Payouts';
      case 'accountability':
        return 'Accountability & Overdue Log';
      case 'groups':
        return 'Group Directories';
      default:
        return 'Overview';
    }
  };

  return (
    <header className="sticky top-0 z-30 h-14 bg-white/95 backdrop-blur-xs border-b border-slate-200 px-4 md:px-6 flex items-center justify-between gap-4">
      {/* Left: Mobile hamburger + Page Title */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          type="button"
          onClick={onToggleMobileMenu}
          className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 md:hidden focus:outline-none"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 min-w-0">
          <span className="text-xs font-medium text-slate-400 hidden sm:inline">
            {currentGroup.name}
          </span>
          <span className="text-xs text-slate-300 hidden sm:inline">/</span>
          <h1 className="text-sm font-semibold text-slate-900 tracking-tight truncate">
            {getPageTitle()}
          </h1>
        </div>
      </div>

      {/* Right: Actions, Notifications, User Switcher */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Quick Add Expense button */}
        <button
          type="button"
          onClick={onOpenNewExpense}
          className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-[10px] shadow-xs transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Expense</span>
        </button>

        {/* Notification Bell Dropdown */}
        <div className="relative" ref={notifRef}>
          <button
            type="button"
            onClick={() => setIsNotifOpen(!isNotifOpen)}
            className="relative p-2 rounded-[10px] text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors focus:outline-none"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadNotificationCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-600 ring-2 ring-white" />
            )}
          </button>

          {isNotifOpen && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl border border-slate-200 shadow-xl py-2 z-50 animate-in fade-in zoom-in-95">
              <div className="px-3.5 py-2 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-semibold text-slate-900">Notifications</span>
                  {unreadNotificationCount > 0 && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-medium">
                      {unreadNotificationCount} unread
                    </span>
                  )}
                </div>
                {unreadNotificationCount > 0 && (
                  <button
                    type="button"
                    onClick={markAllNotificationsAsRead}
                    className="text-[11px] text-emerald-600 hover:text-emerald-700 font-medium transition-colors"
                  >
                    Mark all read
                  </button>
                )}
              </div>

              <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                {notifications.length === 0 ? (
                  <div className="p-6 text-center text-xs text-slate-400">
                    No notifications yet.
                  </div>
                ) : (
                  notifications.map((notif) => (
                    <div
                      key={notif.notificationId}
                      onClick={() => markNotificationAsRead(notif.notificationId)}
                      className={`p-3 text-xs transition-colors cursor-pointer hover:bg-slate-50 flex items-start gap-2.5 ${
                        !notif.read ? 'bg-emerald-50/30' : ''
                      }`}
                    >
                      <div className="mt-0.5 shrink-0">
                        {notif.type === 'overdue_alert' ? (
                          <div className="p-1 rounded-md bg-rose-100 text-rose-600">
                            <AlertTriangle className="w-3.5 h-3.5" />
                          </div>
                        ) : notif.type === 'payment_reminder' ? (
                          <div className="p-1 rounded-md bg-amber-100 text-amber-700">
                            <Calendar className="w-3.5 h-3.5" />
                          </div>
                        ) : (
                          <div className="p-1 rounded-md bg-emerald-100 text-emerald-700">
                            <Receipt className="w-3.5 h-3.5" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1 mb-0.5">
                          <span className="text-[10px] font-semibold text-slate-500 uppercase">
                            {notif.groupName}
                          </span>
                          {!notif.read && (
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 shrink-0" />
                          )}
                        </div>
                        <p className="text-slate-700 leading-snug">{notif.message}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Role & Persona Switcher (For viewing as Admin vs Member vs At Risk) */}
        <div className="relative" ref={userRef}>
          <button
            type="button"
            onClick={() => setIsUserSwitcherOpen(!isUserSwitcherOpen)}
            className="flex items-center gap-2 pl-2 pr-2.5 py-1 rounded-[10px] border border-slate-200 hover:border-slate-300 hover:bg-slate-50/80 transition-colors focus:outline-none"
            title="Switch Simulated User Perspective"
          >
            <div className="relative">
              {currentUser.avatarUrl ? (
                <img
                  src={currentUser.avatarUrl}
                  alt={currentUser.name}
                  referrerPolicy="no-referrer"
                  className="w-6 h-6 rounded-full object-cover border border-slate-200"
                />
              ) : (
                <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-xs font-semibold text-slate-700">
                  {currentUser.name.charAt(0)}
                </div>
              )}
              {isCurrentUserAdmin && (
                <span
                  className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-slate-900 border-2 border-white flex items-center justify-center text-[7px] text-white"
                  title="Group Admin"
                >
                  ★
                </span>
              )}
            </div>

            <div className="text-left hidden lg:block">
              <div className="text-xs font-semibold text-slate-900 leading-tight flex items-center gap-1">
                <span>{currentUser.name}</span>
              </div>
              <div className="text-[10px] text-slate-500 font-mono">
                {isCurrentUserAdmin ? 'Admin Role' : 'Member Role'}
              </div>
            </div>

            <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-0.5" />
          </button>

          {isUserSwitcherOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl border border-slate-200 shadow-xl py-2 z-50 animate-in fade-in zoom-in-95">
              <div className="px-3.5 py-1.5 border-b border-slate-100">
                <div className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider">
                  Switch Active Persona
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5">
                  Test permissions & accountability views as different group members.
                </div>
              </div>

              <div className="py-1">
                {allUsers.map((user) => {
                  const isSelected = user.id === currentUser.id;
                  const isGroupAdmin = user.id === currentGroup.adminId;
                  return (
                    <button
                      key={user.id}
                      type="button"
                      onClick={() => {
                        setCurrentUser(user);
                        setIsUserSwitcherOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3.5 py-2 text-xs text-left transition-colors hover:bg-slate-50 ${
                        isSelected ? 'bg-emerald-50/40 text-emerald-950 font-medium' : 'text-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <img
                          src={user.avatarUrl}
                          alt={user.name}
                          referrerPolicy="no-referrer"
                          className="w-5 h-5 rounded-full object-cover shrink-0"
                        />
                        <div className="min-w-0">
                          <div className="truncate font-medium">{user.name}</div>
                          <div className="text-[10px] text-slate-400 truncate font-mono">
                            {isGroupAdmin ? 'Group Admin' : 'Member'}
                          </div>
                        </div>
                      </div>
                      {isSelected && <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
