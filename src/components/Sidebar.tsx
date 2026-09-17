import React from 'react';
import {
  LayoutDashboard,
  Users,
  UserPlus,
  CheckSquare,
  BookOpen,
  Code2,
  Database,
  Server,
  Activity,
  ChevronRight
} from 'lucide-react';

interface SidebarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  employeeCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  setCurrentTab,
  employeeCount,
}) => {
  const navItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      badge: null,
      description: 'Overview & Statistics',
    },
    {
      id: 'employees',
      label: 'Employees',
      icon: Users,
      badge: employeeCount.toString(),
      description: 'Directory & CRUD Actions',
    },
    {
      id: 'add',
      label: 'Add Employee',
      icon: UserPlus,
      badge: null,
      description: 'Register New Staff',
    },
    {
      id: 'tests',
      label: 'Postman Tests',
      icon: CheckSquare,
      badge: '14 Tests',
      description: 'API Validation Suite',
    },
    {
      id: 'report',
      label: 'Project Documentation',
      icon: BookOpen,
      badge: '26 Sections',
      description: 'College Report & Viva Prep',
    },
    {
      id: 'code',
      label: 'Django Source Code',
      icon: Code2,
      badge: 'Backend',
      description: 'Inspect Files & Settings',
    },
  ];

  return (
    <aside className="w-full lg:w-64 shrink-0 bg-white border-r border-slate-200 flex flex-col justify-between p-4">
      <div className="space-y-6">
        <div>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-3 mb-2">
            Main Navigation
          </p>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`sidebar-link-${item.id}`}
                  onClick={() => setCurrentTab(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all text-left ${
                    isActive
                      ? 'bg-indigo-50 text-indigo-700 font-semibold shadow-xs'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <Icon
                      className={`w-4 h-4 shrink-0 ${
                        isActive ? 'text-indigo-600' : 'text-slate-400'
                      }`}
                    />
                    <span className="truncate">{item.label}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-medium shrink-0 ${
                        isActive
                          ? 'bg-indigo-100 text-indigo-700'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Architecture Status Panel */}
        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-emerald-600" />
              Stack Status
            </span>
            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
              HEALTHY
            </span>
          </div>

          <div className="text-xs space-y-1.5 text-slate-600">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-slate-500">
                <Server className="w-3 h-3 text-indigo-500" /> Backend
              </span>
              <span className="font-mono text-slate-700 font-medium text-[11px]">Django REST 4.2</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-slate-500">
                <Database className="w-3 h-3 text-amber-500" /> Database
              </span>
              <span className="font-mono text-slate-700 font-medium text-[11px]">SQLite3 ORM</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-slate-500">
                <Users className="w-3 h-3 text-cyan-500" /> Client
              </span>
              <span className="font-mono text-slate-700 font-medium text-[11px]">React 19 + Tailwind</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer System Info */}
      <div className="pt-4 border-t border-slate-200 text-xs text-slate-500 flex items-center justify-between">
        <span className="font-medium text-slate-600">Enterprise HR</span>
        <span className="font-mono text-[11px] text-slate-400">v2.4</span>
      </div>
    </aside>
  );
};
