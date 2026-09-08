import React from 'react';
import {
  LayoutDashboard,
  Receipt,
  Users,
  Scale,
  ShieldAlert,
  FolderKanban,
  ChevronDown,
  Plus,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export type ActiveTab =
  | 'dashboard'
  | 'expenses'
  | 'members'
  | 'settlement'
  | 'accountability'
  | 'groups';

interface SidebarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  onOpenNewExpense: () => void;
  onOpenNewGroup: () => void;
  isOpenMobile: boolean;
  setIsOpenMobile: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  onOpenNewExpense,
  onOpenNewGroup,
  isOpenMobile,
  setIsOpenMobile,
}) => {
  const { currentGroup, groups, setCurrentGroup, isCurrentUserAdmin, getOverdueSplits } = useApp();
  const overdueCount = getOverdueSplits().length;

  const navItems = [
    {
      id: 'dashboard' as ActiveTab,
      label: 'Dashboard',
      icon: LayoutDashboard,
      badge: null,
    },
    {
      id: 'expenses' as ActiveTab,
      label: 'Expenses',
      icon: Receipt,
      badge: null,
    },
    {
      id: 'members' as ActiveTab,
      label: 'Members & Balances',
      icon: Users,
      badge: currentGroup.memberCount ? String(currentGroup.memberCount) : null,
    },
    {
      id: 'settlement' as ActiveTab,
      label: 'Settlement Matrix',
      icon: Scale,
      badge: null,
    },
    {
      id: 'accountability' as ActiveTab,
      label: 'Accountability & Overdue',
      icon: ShieldAlert,
      badge: overdueCount > 0 ? String(overdueCount) : null,
      badgeVariant: 'warning',
    },
    {
      id: 'groups' as ActiveTab,
      label: 'All Groups',
      icon: FolderKanban,
      badge: null,
    },
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {isOpenMobile && (
        <div
          onClick={() => setIsOpenMobile(false)}
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-xs md:hidden"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-slate-900 text-slate-200 flex flex-col border-r border-slate-800 transition-transform duration-200 ease-in-out md:translate-x-0 ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="h-14 flex items-center px-4 border-b border-slate-800/80 gap-2.5 shrink-0">
          <div className="w-7 h-7 rounded-lg bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold text-sm">
            S
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-semibold text-white tracking-tight">Smart Expense Splitter</span>
            <span className="text-[10px] text-slate-400 font-mono">Groups with Accountability</span>
          </div>
        </div>

        {/* Group Selector / Dropdown Pill */}
        <div className="p-3 border-b border-slate-800/60">
          <div className="text-[10px] uppercase tracking-wider font-semibold text-slate-500 px-2 mb-1.5 flex items-center justify-between">
            <span>Active Group</span>
            <button
              type="button"
              onClick={onOpenNewGroup}
              className="text-slate-400 hover:text-emerald-400 transition-colors"
              title="Create new group"
            >
              <Plus className="w-3 h-3" />
            </button>
          </div>
          <div className="relative">
            <select
              value={currentGroup.id}
              onChange={(e) => {
                const target = groups.find((g) => g.id === e.target.value);
                if (target) setCurrentGroup(target);
              }}
              className="w-full appearance-none bg-slate-800/90 hover:bg-slate-800 text-white text-xs font-medium rounded-lg px-2.5 py-2 pr-7 border border-slate-700/80 cursor-pointer focus:outline-none focus:border-emerald-500/80 transition-colors"
            >
              {groups.map((g) => (
                <option key={g.id} value={g.id} className="bg-slate-900 text-white">
                  {g.name}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          <div className="flex items-center justify-between px-1 mt-2 text-[11px] text-slate-400">
            <span className="truncate max-w-[140px] text-slate-300 font-medium">
              {currentGroup.name}
            </span>
            <span
              className={`text-[10px] px-1.5 py-0.2 rounded font-medium ${
                isCurrentUserAdmin
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                  : 'bg-slate-800 text-slate-400'
              }`}
            >
              {isCurrentUserAdmin ? 'Admin Role' : 'Member Role'}
            </span>
          </div>
        </div>

        {/* Quick Add Expense Action */}
        <div className="px-3 pt-3">
          <button
            type="button"
            onClick={() => {
              onOpenNewExpense();
              setIsOpenMobile(false);
            }}
            className="w-full inline-flex items-center justify-center gap-2 px-3 py-2 text-xs font-medium text-white bg-emerald-600 hover:bg-emerald-500 rounded-[10px] shadow-sm transition-all focus:outline-none"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Shared Expense</span>
          </button>
        </div>

        {/* Navigation items */}
        <nav className="flex-1 px-3 py-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  setActiveTab(item.id);
                  setIsOpenMobile(false);
                }}
                className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs font-medium transition-colors ${
                  isActive
                    ? 'bg-slate-800 text-white font-semibold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <Icon
                    className={`w-4 h-4 shrink-0 ${
                      isActive ? 'text-emerald-400' : 'text-slate-500'
                    }`}
                  />
                  <span className="truncate">{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono font-medium ${
                      item.badgeVariant === 'warning'
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        : 'bg-slate-800 text-slate-300'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Footer / System Info */}
        <div className="p-3 border-t border-slate-800/80 text-[11px] text-slate-400 flex flex-col gap-1">
          <div className="flex items-center justify-between text-slate-500 text-[10px]">
            <span>REST API v1.0 Ready</span>
            <span className="inline-flex items-center gap-1 text-emerald-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              Mock State
            </span>
          </div>
          <div className="text-[10px] text-slate-500 leading-tight">
            Encouraging timely splits through accountability & transparent history.
          </div>
        </div>
      </aside>
    </>
  );
};
