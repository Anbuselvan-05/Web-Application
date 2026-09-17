import React, { useState, useMemo } from 'react';
import {
  Users,
  UserCheck,
  UserX,
  CreditCard,
  Plus,
  ArrowRight,
  Building2,
  Briefcase,
  Calendar,
  Sparkles,
  TrendingUp,
  Search,
  Download,
  Filter,
  Eye,
  Edit3,
  X,
  Phone,
  Mail,
  MapPin,
  Clock,
  ArrowUpRight,
  Layers,
  Award,
  DollarSign,
  CheckCircle2,
} from 'lucide-react';
import { Employee, DashboardStats } from '../types';

interface DashboardProps {
  stats: DashboardStats | null;
  employees: Employee[];
  isLoading: boolean;
  onNavigate: (tab: string) => void;
  onSelectEmployee: (emp: Employee) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  stats,
  employees,
  isLoading,
  onNavigate,
  onSelectEmployee,
}) => {
  const [selectedDept, setSelectedDept] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'Active' | 'Inactive'>('all');
  const [previewEmployee, setPreviewEmployee] = useState<Employee | null>(null);
  const [copyFeedback, setCopyFeedback] = useState<string | null>(null);

  // Overall statistics
  const totalEmployees = stats?.totalEmployees ?? employees.length;
  const activeEmployees = stats?.activeEmployees ?? employees.filter((e) => e.status === 'Active').length;
  const inactiveEmployees = stats?.inactiveEmployees ?? employees.filter((e) => e.status === 'Inactive').length;
  const totalPayroll = stats?.totalSalary ?? employees.reduce((sum, e) => sum + Number(e.salary || 0), 0);
  const avgSalary = totalEmployees > 0 ? Math.round(totalPayroll / totalEmployees) : 0;
  const activeRate = totalEmployees > 0 ? Math.round((activeEmployees / totalEmployees) * 100) : 0;
  const annualPayroll = totalPayroll * 12;

  // Department list with counts and payroll
  const departments = useMemo(() => {
    const map = new Map<string, { count: number; activeCount: number; totalSalary: number }>();
    for (const e of employees) {
      const dept = e.department || 'General';
      const curr = map.get(dept) || { count: 0, activeCount: 0, totalSalary: 0 };
      curr.count += 1;
      if (e.status === 'Active') curr.activeCount += 1;
      curr.totalSalary += Number(e.salary || 0);
      map.set(dept, curr);
    }
    return Array.from(map.entries())
      .map(([name, data]) => ({
        name,
        count: data.count,
        activeCount: data.activeCount,
        avgSalary: data.count > 0 ? Math.round(data.totalSalary / data.count) : 0,
        totalSalary: data.totalSalary,
      }))
      .sort((a, b) => b.count - a.count);
  }, [employees]);

  // Unique list of department names
  const allDeptNames = useMemo(() => {
    return Array.from(new Set(employees.map((e) => e.department).filter(Boolean)));
  }, [employees]);

  // Salary Tiers Matrix
  const salaryTiers = useMemo(() => {
    const tiers = [
      { label: 'Entry Level (< ₹40k)', min: 0, max: 39999, color: 'bg-sky-500' },
      { label: 'Mid Tier (₹40k - ₹75k)', min: 40000, max: 74999, color: 'bg-indigo-600' },
      { label: 'Senior Tier (₹75k - ₹1.2L)', min: 75000, max: 120000, color: 'bg-violet-600' },
      { label: 'Leadership (> ₹1.2L)', min: 120001, max: Infinity, color: 'bg-emerald-600' },
    ];

    return tiers.map((tier) => {
      const matching = employees.filter((e) => {
        const s = Number(e.salary || 0);
        return s >= tier.min && s <= tier.max;
      });
      const pct = totalEmployees > 0 ? Math.round((matching.length / totalEmployees) * 100) : 0;
      return {
        ...tier,
        count: matching.length,
        percentage: pct,
      };
    });
  }, [employees, totalEmployees]);

  // Employment Types breakdown
  const employmentTypes = useMemo(() => {
    const counts: Record<string, number> = {
      'Full-time': 0,
      'Part-time': 0,
      Intern: 0,
    };
    employees.forEach((e) => {
      const type = e.employment_type || 'Full-time';
      counts[type] = (counts[type] || 0) + 1;
    });
    return [
      { type: 'Full-time', count: counts['Full-time'] || 0, color: 'bg-indigo-600', textColor: 'text-indigo-700', bgLight: 'bg-indigo-50' },
      { type: 'Part-time', count: counts['Part-time'] || 0, color: 'bg-sky-500', textColor: 'text-sky-700', bgLight: 'bg-sky-50' },
      { type: 'Intern', count: counts['Intern'] || 0, color: 'bg-amber-500', textColor: 'text-amber-700', bgLight: 'bg-amber-50' },
    ];
  }, [employees]);

  // Filtered employees for the quick roster widget
  const filteredEmployees = useMemo(() => {
    return employees.filter((emp) => {
      // Dept filter
      if (selectedDept !== 'all' && emp.department !== selectedDept) return false;
      // Status filter
      if (statusFilter !== 'all' && emp.status !== statusFilter) return false;
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = emp.full_name?.toLowerCase().includes(q);
        const matchesId = emp.employee_id?.toLowerCase().includes(q);
        const matchesRole = emp.designation?.toLowerCase().includes(q);
        const matchesEmail = emp.email?.toLowerCase().includes(q);
        return matchesName || matchesId || matchesRole || matchesEmail;
      }
      return true;
    });
  }, [employees, selectedDept, statusFilter, searchQuery]);

  // Top department by headcount
  const topDept = departments.length > 0 ? departments[0] : null;

  // Export CSV summary
  const handleExportCSV = () => {
    if (employees.length === 0) return;
    const headers = ['ID', 'Employee Code', 'Full Name', 'Email', 'Phone', 'Department', 'Designation', 'Salary', 'Employment Type', 'Date of Joining', 'Status'];
    const rows = employees.map((e) => [
      e.id,
      `"${e.employee_id}"`,
      `"${e.full_name}"`,
      `"${e.email}"`,
      `"${e.phone}"`,
      `"${e.department}"`,
      `"${e.designation}"`,
      e.salary,
      `"${e.employment_type}"`,
      `"${e.date_of_joining}"`,
      `"${e.status}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `workforce_roster_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setCopyFeedback('Roster CSV downloaded!');
    setTimeout(() => setCopyFeedback(null), 3000);
  };

  const getInitials = (name: string) => {
    if (!name) return 'EM';
    const parts = name.trim().split(' ');
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const getAvatarBg = (name: string) => {
    const colors = [
      'bg-indigo-100 text-indigo-700',
      'bg-sky-100 text-sky-700',
      'bg-emerald-100 text-emerald-700',
      'bg-amber-100 text-amber-700',
      'bg-rose-100 text-rose-700',
      'bg-violet-100 text-violet-700',
    ];
    let hash = 0;
    for (let i = 0; i < name.length; i++) hash += name.charCodeAt(i);
    return colors[Math.abs(hash) % colors.length];
  };

  if (isLoading && !stats) {
    return (
      <div className="p-16 flex flex-col items-center justify-center min-h-[440px] bg-white rounded-2xl border border-slate-200 shadow-xs">
        <div className="w-10 h-10 border-3 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
        <p className="mt-4 text-sm font-medium text-slate-600">Loading live workforce analytics...</p>
        <p className="text-xs text-slate-400 mt-1">Connecting to SQLite & REST endpoints</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Dashboard Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white px-5 py-3.5 rounded-2xl border border-slate-200/90 shadow-xs">
        <div className="flex items-center gap-3 flex-wrap">
          <h1 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
            Employee Management System
          </h1>
          <span className="text-xs text-slate-300 hidden sm:inline">•</span>
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            Live Sync
          </span>
          <span className="text-xs text-slate-300 hidden md:inline">•</span>
          <span className="text-xs font-medium text-slate-500 hidden md:inline">
            {totalEmployees} Staff Members
          </span>
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto flex-wrap sm:flex-nowrap">
          {copyFeedback && (
            <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 animate-in fade-in">
              {copyFeedback}
            </span>
          )}
          <button
            id="dash-export-csv-btn"
            onClick={handleExportCSV}
            title="Download full CSV roster"
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Export CSV</span>
          </button>
          <button
            id="dash-open-directory-btn"
            onClick={() => onNavigate('employees')}
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-colors"
          >
            <span>Directory</span>
            <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
          </button>
          <button
            id="dash-add-employee-btn"
            onClick={() => onNavigate('add')}
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Employee</span>
          </button>
        </div>
      </div>

      {/* 4 Core Primary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Workforce */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Total Workforce</span>
            <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold tracking-tight text-slate-900">{totalEmployees}</span>
            <span className="text-xs text-slate-500 font-medium">personnel</span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Departments</span>
            <span className="font-semibold text-slate-700">{departments.length} units</span>
          </div>
        </div>

        {/* Active Staff */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Active Staff</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <UserCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold tracking-tight text-slate-900">{activeEmployees}</span>
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              {activeRate}% active
            </span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>On-Duty Ratio</span>
            <span className="font-semibold text-emerald-600">Operational</span>
          </div>
        </div>

        {/* Inactive / On Leave */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">On Leave / Inactive</span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <UserX className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold tracking-tight text-slate-900">{inactiveEmployees}</span>
            <span className="text-xs text-slate-400 font-medium">
              ({totalEmployees > 0 ? 100 - activeRate : 0}%)
            </span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Separations / Leaves</span>
            <span className="font-semibold text-slate-600">Pending review</span>
          </div>
        </div>

        {/* Monthly Payroll */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Monthly Payroll</span>
            <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
              ₹{totalPayroll.toLocaleString('en-IN')}
            </span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Avg / Employee</span>
            <span className="font-semibold text-slate-700">₹{avgSalary.toLocaleString('en-IN')}</span>
          </div>
        </div>
      </div>

      {/* Interactive Department Filter Pills Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-xs flex items-center gap-2 overflow-x-auto">
        <div className="text-xs font-semibold text-slate-500 whitespace-nowrap px-1 flex items-center gap-1.5">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <span>Department Focus:</span>
        </div>
        <button
          id="dash-filter-dept-all"
          onClick={() => setSelectedDept('all')}
          className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all shrink-0 ${
            selectedDept === 'all'
              ? 'bg-indigo-600 text-white shadow-xs font-semibold'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          All Departments ({totalEmployees})
        </button>
        {allDeptNames.map((dept) => {
          const count = employees.filter((e) => e.department === dept).length;
          const isSelected = selectedDept === dept;
          return (
            <button
              key={dept}
              id={`dash-filter-dept-${dept.toLowerCase().replace(/\s+/g, '-')}`}
              onClick={() => setSelectedDept(isSelected ? 'all' : dept)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all shrink-0 flex items-center gap-1.5 ${
                isSelected
                  ? 'bg-indigo-600 text-white shadow-xs font-semibold'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <span>{dept}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  isSelected ? 'bg-indigo-700 text-indigo-100' : 'bg-slate-200 text-slate-600'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Middle Grid: Department Analytics & Salary / Contract Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Department Breakdown (2 cols) */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <Building2 className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-slate-900">Department Workforce & Remuneration</h2>
                <p className="text-xs text-slate-500">Distribution of headcount and average compensation</p>
              </div>
            </div>
            {topDept && (
              <span className="text-xs font-medium text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full border border-indigo-100 hidden sm:inline-flex items-center gap-1">
                <Award className="w-3 h-3 text-indigo-500" />
                Largest: {topDept.name} ({topDept.count})
              </span>
            )}
          </div>

          {departments.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-400">No departments configured yet.</div>
          ) : (
            <div className="space-y-4">
              {departments.map((dept) => {
                const percentage = totalEmployees > 0 ? Math.round((dept.count / totalEmployees) * 100) : 0;
                const isSelected = selectedDept === dept.name;

                return (
                  <div
                    key={dept.name}
                    onClick={() => setSelectedDept(isSelected ? 'all' : dept.name)}
                    className={`p-3 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-indigo-50/50 border-indigo-300 shadow-xs ring-1 ring-indigo-200'
                        : 'bg-white border-slate-200/70 hover:border-indigo-200 hover:bg-slate-50/50'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900">{dept.name}</span>
                        <span className="text-slate-500">
                          {dept.count} {dept.count === 1 ? 'member' : 'members'}
                        </span>
                        <span className="text-[11px] text-emerald-600 font-medium">
                          ({dept.activeCount} active)
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-slate-500 hidden sm:inline font-mono">
                          Avg ₹{dept.avgSalary.toLocaleString('en-IN')}
                        </span>
                        <span className="font-bold text-indigo-600 w-10 text-right">{percentage}%</span>
                      </div>
                    </div>
                    {/* Proportional Bar */}
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-indigo-600 h-full rounded-full transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Column: Salary Tiers & Contract Types */}
        <div className="space-y-6">
          {/* Salary Tiers Matrix */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <DollarSign className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-slate-900">Salary Tier Breakdown</h2>
                <p className="text-xs text-slate-500">Distribution across compensation brackets</p>
              </div>
            </div>

            <div className="space-y-3 mt-3">
              {salaryTiers.map((tier) => (
                <div key={tier.label} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-slate-700">{tier.label}</span>
                    <span className="text-slate-500 font-mono">
                      {tier.count} ({tier.percentage}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                    <div
                      className={`${tier.color} h-full rounded-full transition-all duration-500`}
                      style={{ width: `${tier.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-500 flex justify-between">
              <span>Annual Payroll Estimate</span>
              <span className="font-bold text-slate-900 font-mono">₹{annualPayroll.toLocaleString('en-IN')}</span>
            </div>
          </div>

          {/* Contract Types Card */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center">
                <Briefcase className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-slate-900">Contract Types</h2>
                <p className="text-xs text-slate-500">Workforce contract composition</p>
              </div>
            </div>

            <div className="space-y-2.5">
              {employmentTypes.map((item) => {
                const pct = totalEmployees > 0 ? Math.round((item.count / totalEmployees) * 100) : 0;
                return (
                  <div
                    key={item.type}
                    className="p-3 rounded-xl bg-slate-50 border border-slate-200/70 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className={`w-2.5 h-2.5 rounded-full ${item.color}`}></span>
                      <span className="text-xs font-semibold text-slate-700">{item.type}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900">{item.count}</span>
                      <span className="text-[11px] text-slate-400">({pct}%)</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section: Interactive Employee Roster Widget */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
        {/* Header & Quick Search Controls */}
        <div className="p-5 sm:p-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-sm font-bold text-slate-900">
              Personnel Roster
              {selectedDept !== 'all' && (
                <span className="ml-2 font-normal text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md text-xs">
                  {selectedDept} ({filteredEmployees.length})
                </span>
              )}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Instant search, profile inspection, and record management
            </p>
          </div>

          <div className="flex items-center gap-3 flex-wrap sm:flex-nowrap">
            {/* Quick Search */}
            <div className="relative flex-1 sm:w-64">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                id="dash-roster-search-input"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search staff, role, ID..."
                className="w-full pl-9 pr-7 py-1.5 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>

            {/* Status Filter */}
            <select
              id="dash-roster-status-filter"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="py-1.5 px-3 text-xs rounded-xl bg-slate-50 border border-slate-200 text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            >
              <option value="all">All Status</option>
              <option value="Active">Active Only</option>
              <option value="Inactive">Inactive Only</option>
            </select>

            <button
              id="dash-view-full-directory-link"
              onClick={() => onNavigate('employees')}
              className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition-colors whitespace-nowrap"
            >
              <span>Full Directory ({totalEmployees})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Table Content */}
        {filteredEmployees.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
              <Users className="w-5 h-5" />
            </div>
            <p className="text-xs text-slate-500 font-medium">No matching employees found.</p>
            {(searchQuery || statusFilter !== 'all' || selectedDept !== 'all') && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setStatusFilter('all');
                  setSelectedDept('all');
                }}
                className="mt-2 text-xs text-indigo-600 hover:underline font-semibold"
              >
                Clear all active filters
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-slate-50/75 text-slate-500 uppercase font-semibold border-b border-slate-200/80">
                <tr>
                  <th className="px-5 py-3">Employee</th>
                  <th className="px-5 py-3">Department & Role</th>
                  <th className="px-5 py-3">Contract</th>
                  <th className="px-5 py-3">Compensation</th>
                  <th className="px-5 py-3">Joining Date</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-sans">
                {filteredEmployees.slice(0, 8).map((emp) => (
                  <tr
                    key={emp.id}
                    className="hover:bg-slate-50/70 transition-colors group"
                  >
                    {/* Employee Identity with Avatar */}
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${getAvatarBg(
                            emp.full_name
                          )}`}
                        >
                          {getInitials(emp.full_name)}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900">{emp.full_name}</div>
                          <div className="text-[11px] text-slate-500 font-mono flex items-center gap-1">
                            <span>{emp.employee_id}</span>
                            <span>•</span>
                            <span className="truncate max-w-[130px]">{emp.email}</span>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Department & Role */}
                    <td className="px-5 py-3.5">
                      <div className="font-medium text-slate-800">{emp.designation}</div>
                      <div className="text-[11px] text-slate-500">{emp.department}</div>
                    </td>

                    {/* Employment Type */}
                    <td className="px-5 py-3.5">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-100 text-slate-700">
                        {emp.employment_type}
                      </span>
                    </td>

                    {/* Salary */}
                    <td className="px-5 py-3.5 font-semibold text-slate-900 font-mono">
                      ₹{Number(emp.salary).toLocaleString('en-IN')}
                    </td>

                    {/* Joining Date */}
                    <td className="px-5 py-3.5 text-slate-500 font-mono text-[11px]">
                      {emp.date_of_joining}
                    </td>

                    {/* Status Pill */}
                    <td className="px-5 py-3.5">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${
                          emp.status === 'Active'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : 'bg-rose-50 text-rose-700 border-rose-200'
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            emp.status === 'Active' ? 'bg-emerald-500' : 'bg-rose-500'
                          }`}
                        ></span>
                        {emp.status}
                      </span>
                    </td>

                    {/* Action Buttons */}
                    <td className="px-5 py-3.5 text-right">
                      <div className="inline-flex items-center gap-1">
                        <button
                          id={`dash-preview-emp-${emp.id}`}
                          onClick={() => setPreviewEmployee(emp)}
                          title="Quick View Profile"
                          className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          id={`dash-edit-emp-${emp.id}`}
                          onClick={() => onSelectEmployee(emp)}
                          title="Edit Employee"
                          className="px-2.5 py-1 text-[11px] font-semibold text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 rounded-lg transition-colors inline-flex items-center gap-1"
                        >
                          <span>Edit</span>
                          <ArrowUpRight className="w-3 h-3 text-indigo-400 group-hover:text-indigo-600" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {filteredEmployees.length > 8 && (
          <div className="p-3 bg-slate-50/80 border-t border-slate-100 text-center text-xs text-slate-500">
            Showing 8 of {filteredEmployees.length} filtered employees.{' '}
            <button
              onClick={() => onNavigate('employees')}
              className="text-indigo-600 font-semibold hover:underline"
            >
              Open Complete Directory
            </button>
          </div>
        )}
      </div>

      {/* Quick Profile Modal */}
      {previewEmployee && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-lg w-full border border-slate-200 shadow-xl overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-100 flex items-start justify-between bg-slate-50/50">
              <div className="flex items-center gap-3.5">
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-sm shadow-xs ${getAvatarBg(
                    previewEmployee.full_name
                  )}`}
                >
                  {getInitials(previewEmployee.full_name)}
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">{previewEmployee.full_name}</h3>
                  <p className="text-xs text-slate-500 font-mono">{previewEmployee.employee_id}</p>
                </div>
              </div>
              <button
                id="dash-close-preview-modal-btn"
                onClick={() => setPreviewEmployee(null)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                  <span className="text-slate-400 font-medium block mb-1">Designation & Team</span>
                  <div className="font-bold text-slate-800">{previewEmployee.designation}</div>
                  <div className="text-slate-500">{previewEmployee.department}</div>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                  <span className="text-slate-400 font-medium block mb-1">Employment Status</span>
                  <div className="flex items-center gap-2">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold border ${
                        previewEmployee.status === 'Active'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : 'bg-rose-50 text-rose-700 border-rose-200'
                      }`}
                    >
                      {previewEmployee.status}
                    </span>
                    <span className="text-slate-600 font-medium">({previewEmployee.employment_type})</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                  <span className="text-slate-400 font-medium block mb-1">Monthly Salary</span>
                  <div className="text-base font-bold text-slate-900 font-mono">
                    ₹{Number(previewEmployee.salary).toLocaleString('en-IN')}
                  </div>
                  <span className="text-slate-400 text-[10px]">Tax deductable base</span>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                  <span className="text-slate-400 font-medium block mb-1">Date of Joining</span>
                  <div className="font-bold text-slate-800 font-mono">{previewEmployee.date_of_joining}</div>
                  <span className="text-slate-400 text-[10px]">Official start date</span>
                </div>
              </div>

              {/* Contact Information */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <div className="flex items-center gap-2.5 text-slate-700">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  <span className="font-mono">{previewEmployee.email}</span>
                </div>
                <div className="flex items-center gap-2.5 text-slate-700">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <span className="font-mono">{previewEmployee.phone || 'Not provided'}</span>
                </div>
                <div className="flex items-center gap-2.5 text-slate-700">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>{previewEmployee.address || 'Address not registered'}</span>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-50/80 border-t border-slate-100 flex items-center justify-end gap-2.5">
              <button
                onClick={() => setPreviewEmployee(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-200/70 transition-colors"
              >
                Close
              </button>
              <button
                onClick={() => {
                  const emp = previewEmployee;
                  setPreviewEmployee(null);
                  onSelectEmployee(emp);
                }}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-xs transition-colors inline-flex items-center gap-1.5"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit Full Record</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
