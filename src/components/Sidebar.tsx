import React, { useMemo, useState } from 'react';
import { AppView } from '../types';
import {
  LayoutDashboard, Eye, Users, Shield, BookOpen, Heart, Activity,
  FileText, ClipboardList, AlertTriangle, Star, Settings, ChevronDown,
  ChevronRight, Home, Calendar, DollarSign, Leaf, Megaphone,
  MessageSquare, Lightbulb, Baby, Utensils, Moon, Package,
  Building2, Globe, GraduationCap, Wrench, Zap, BarChart2,
  UserCheck, HelpCircle, Map, LogOut, Menu, X, Search, Layers, Clock
} from 'lucide-react';

interface SidebarProps {
  currentView: AppView;
  onNavigate: (view: AppView) => void;
  user: any;
  onSignOut?: () => void;
  onLogout?: () => void;
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}

type UserRole = 'Admin' | 'Director' | 'DirectorGeneral' | 'Educator' | 'Parent';

interface NavItem {
  label: string;
  view: AppView;
  icon: React.ReactNode;
  roles?: UserRole[];
}

interface NavGroup {
  title: string;
  icon: React.ReactNode;
  items: NavItem[];
  roles?: UserRole[];
}

const ALL_ROLES: UserRole[] = ['Admin', 'Director', 'DirectorGeneral', 'Educator', 'Parent'];
const MANAGEMENT: UserRole[] = ['Admin', 'Director', 'DirectorGeneral'];

const navGroups: NavGroup[] = [
  {
    title: 'Home',
    icon: <Home size={14} />,
    items: [
      { label: 'Dashboard', view: AppView.DASHBOARD, icon: <LayoutDashboard size={14} /> },
      { label: 'Reception Kiosk', view: AppView.RECEPTION, icon: <Building2 size={14} />, roles: MANAGEMENT },
      { label: 'Director Office', view: AppView.DIRECTOR_OFFICE, icon: <UserCheck size={14} />, roles: MANAGEMENT },
      { label: 'Director General', view: AppView.DIRECTOR_GENERAL_DASHBOARD, icon: <Globe size={14} />, roles: ['Admin', 'DirectorGeneral'] },
    ],
  },
  {
    title: 'Children & Families',
    icon: <Baby size={14} />,
    items: [
      { label: 'Daily Care', view: AppView.DAILY_CARE, icon: <Heart size={14} /> },
      { label: 'Child Portfolio', view: AppView.CHILD_PORTFOLIO, icon: <Star size={14} /> },
      { label: 'Medical Manager', view: AppView.MEDICAL_MANAGER, icon: <Activity size={14} /> },
      { label: 'Medication Log', view: AppView.MEDICATION_LOG, icon: <ClipboardList size={14} /> },
      { label: 'Sleep Tracker', view: AppView.SLEEP_TRACKER, icon: <Moon size={14} /> },
      { label: 'Child Protection', view: AppView.CHILD_PROTECTION, icon: <Shield size={14} />, roles: MANAGEMENT },
      { label: 'Inclusion Support', view: AppView.INCLUSION_SUPPORT, icon: <HelpCircle size={14} /> },
      { label: 'School Readiness', view: AppView.SCHOOL_READINESS, icon: <GraduationCap size={14} /> },
      { label: 'Transition Statements', view: AppView.TRANSITION_STATEMENTS, icon: <FileText size={14} /> },
      { label: 'Waitlist Manager', view: AppView.WAITLIST_MANAGER, icon: <Users size={14} />, roles: MANAGEMENT },
      { label: 'Enrolment Manager', view: AppView.ENROLMENT_MANAGER, icon: <UserCheck size={14} />, roles: MANAGEMENT },
      { label: 'Parent Portal', view: AppView.PARENT_PORTAL, icon: <MessageSquare size={14} /> },
      { label: 'Parent Messages', view: AppView.PARENT_MESSAGES, icon: <MessageSquare size={14} /> },
      { label: 'Family Audit Log', view: AppView.FAMILY_AUDIT_LOG, icon: <ClipboardList size={14} />, roles: MANAGEMENT },
    ],
  },
  {
    title: 'Curriculum & Learning',
    icon: <BookOpen size={14} />,
    items: [
      { label: 'Observations', view: AppView.OBSERVATION, icon: <Eye size={14} /> },
      { label: 'Digital Journal', view: AppView.DIGITAL_JOURNAL, icon: <Star size={14} /> },
      { label: 'Activity Planner', view: AppView.ACTIVITY_PLANNER, icon: <Calendar size={14} /> },
      { label: 'Activity Library', view: AppView.ACTIVITY_LIBRARY, icon: <BookOpen size={14} /> },
      { label: 'Planning Cycle', view: AppView.PLANNING_CYCLE, icon: <ClipboardList size={14} /> },
      { label: 'Curriculum Board', view: AppView.CURRICULUM_BOARD, icon: <Lightbulb size={14} /> },
      { label: 'EYLF Reference', view: AppView.EYLF_REFERENCE, icon: <BookOpen size={14} /> },
      { label: 'Development Report', view: AppView.DEVELOPMENT_REPORT, icon: <FileText size={14} /> },
      { label: 'Goal Planner (QIP)', view: AppView.QIP_PLANNER, icon: <Star size={14} />, roles: MANAGEMENT },
      { label: 'Critical Reflection', view: AppView.CRITICAL_REFLECTION, icon: <Lightbulb size={14} /> },
      { label: 'Philosophy Builder', view: AppView.PHILOSOPHY, icon: <Globe size={14} />, roles: MANAGEMENT },
      { label: 'Montessori Curriculum', view: AppView.MONTESSORI_CURRICULUM, icon: <Layers size={14} /> },
      { label: 'Routine Manager', view: AppView.ROUTINE_MANAGER, icon: <Calendar size={14} /> },
    ],
  },
  {
    title: 'Staff & HR',
    icon: <Users size={14} />,
    roles: MANAGEMENT,
    items: [
      { label: 'Staff Timesheet', view: AppView.STAFF_TIMESHEET, icon: <Clock size={14} /> },
      { label: 'Staff Roster', view: AppView.STAFF_ROSTER, icon: <Calendar size={14} /> },
      { label: 'Staff Qualifications', view: AppView.STAFF_QUALIFICATIONS, icon: <GraduationCap size={14} /> },
      { label: 'Staff Onboarding', view: AppView.STAFF_ONBOARDING, icon: <UserCheck size={14} /> },
      { label: 'PD Portfolio', view: AppView.PD_PORTFOLIO, icon: <Star size={14} /> },
      { label: 'Required Training', view: AppView.REQUIRED_TRAINING, icon: <BookOpen size={14} /> },
      { label: 'Wellbeing Trends', view: AppView.WELLBEING_TRENDS, icon: <Heart size={14} /> },
      { label: 'Professional Standards', view: AppView.PROFESSIONAL_STANDARDS, icon: <Shield size={14} /> },
      { label: 'Code of Conduct', view: AppView.CODE_OF_CONDUCT, icon: <FileText size={14} /> },
    ],
  },
  {
    title: 'Compliance & Safety',
    icon: <Shield size={14} />,
    roles: MANAGEMENT,
    items: [
      { label: 'NQS Overview', view: AppView.NQS_OVERVIEW, icon: <BarChart2 size={14} /> },
      { label: 'Assessment Rating', view: AppView.ASSESSMENT_RATING, icon: <ClipboardList size={14} /> },
      { label: 'Compliance Alerts', view: AppView.COMPLIANCE_ALERTS, icon: <AlertTriangle size={14} /> },
      { label: 'Health Compliance', view: AppView.HEALTH_COMPLIANCE, icon: <Activity size={14} /> },
      { label: 'Safety Center', view: AppView.SAFETY_CENTER, icon: <Shield size={14} /> },
      { label: 'Walkthrough Checklist', view: AppView.WALKTHROUGH_CHECKLIST, icon: <ClipboardList size={14} /> },
      { label: 'Risk Assessment', view: AppView.RISK_ASSESSMENT, icon: <AlertTriangle size={14} /> },
      { label: 'Incident Reports', view: AppView.INCIDENT_REPORTS, icon: <FileText size={14} /> },
      { label: 'Emergency Hub', view: AppView.EMERGENCY_HUB, icon: <Zap size={14} /> },
      { label: 'Policy Portal', view: AppView.POLICY_PORTAL, icon: <FileText size={14} /> },
      { label: 'Legal', view: AppView.LEGAL, icon: <Shield size={14} /> },
    ],
  },
  {
    title: 'Operations',
    icon: <Building2 size={14} />,
    roles: MANAGEMENT,
    items: [
      { label: 'Room Manager', view: AppView.ROOM_MANAGER, icon: <Map size={14} /> },
      { label: 'Floor Plan', view: AppView.FLOOR_PLAN, icon: <Map size={14} /> },
      { label: 'Operational Log', view: AppView.OPERATIONAL_LOG, icon: <ClipboardList size={14} /> },
      { label: 'Maintenance Log', view: AppView.MAINTENANCE_LOG, icon: <Wrench size={14} /> },
      { label: 'Excursion Manager', view: AppView.EXCURSION_MANAGER, icon: <Map size={14} /> },
      { label: 'Resource Booking', view: AppView.RESOURCE_BOOKING, icon: <Calendar size={14} /> },
      { label: 'Occupancy Analytics', view: AppView.OCCUPANCY_ANALYTICS, icon: <BarChart2 size={14} /> },
      { label: 'Occupancy Dashboard', view: AppView.OCCUPANCY_DASHBOARD, icon: <BarChart2 size={14} /> },
      { label: 'Chef Station', view: AppView.CHEF_STATION, icon: <Utensils size={14} /> },
      { label: 'Inventory Manager', view: AppView.INVENTORY, icon: <Package size={14} /> },
      { label: 'Asset Register', view: AppView.ASSET_REGISTER, icon: <Package size={14} /> },
    ],
  },
  {
    title: 'Finance',
    icon: <DollarSign size={14} />,
    roles: MANAGEMENT,
    items: [
      { label: 'Invoicing System', view: AppView.INVOICING_SYSTEM, icon: <FileText size={14} /> },
      { label: 'Expense Tracker', view: AppView.EXPENSE_TRACKER, icon: <DollarSign size={14} /> },
      { label: 'CCS Estimator', view: AppView.CCS_ESTIMATOR, icon: <BarChart2 size={14} /> },
      { label: 'Revenue Forecasting', view: AppView.REVENUE_FORECASTING, icon: <BarChart2 size={14} /> },
    ],
  },
  {
    title: 'Community & Marketing',
    icon: <Megaphone size={14} />,
    roles: MANAGEMENT,
    items: [
      { label: 'Newsletter', view: AppView.NEWSLETTER, icon: <FileText size={14} /> },
      { label: 'Marketing Studio', view: AppView.MARKETING_STUDIO, icon: <Megaphone size={14} /> },
      { label: 'Community Hub', view: AppView.COMMUNITY_HUB, icon: <Globe size={14} /> },
      { label: 'Cultural Audit', view: AppView.CULTURAL_AUDIT, icon: <Globe size={14} /> },
      { label: 'Green Audit', view: AppView.GREEN_AUDIT, icon: <Leaf size={14} /> },
      { label: 'Sustainability Tracker', view: AppView.SUSTAINABILITY_TRACKER, icon: <Leaf size={14} /> },
    ],
  },
  {
    title: 'AI & Tools',
    icon: <Lightbulb size={14} />,
    items: [
      { label: 'AI Assistant', view: AppView.ASSISTANT, icon: <Lightbulb size={14} /> },
      { label: 'Media Studio', view: AppView.STUDIO, icon: <Star size={14} /> },
    ],
  },
  {
    title: 'Admin',
    icon: <Settings size={14} />,
    items: [
      { label: 'User Settings', view: AppView.USER_SETTINGS, icon: <Settings size={14} /> },
      { label: 'System Audit Log', view: AppView.SYSTEM_AUDIT_LOG, icon: <ClipboardList size={14} />, roles: MANAGEMENT },
      { label: 'Terms of Service', view: AppView.TERMS_OF_SERVICE, icon: <FileText size={14} /> },
      { label: 'Privacy Policy', view: AppView.PRIVACY_POLICY, icon: <Shield size={14} /> },
    ],
  },
];

const groupColors: Record<string, { icon: string; activeBg: string; activeText: string; activeIcon: string; dot: string }> = {
  'Home':                  { icon: 'text-indigo-500',  activeBg: 'bg-gradient-to-r from-indigo-50 to-violet-50',   activeText: 'text-indigo-700',  activeIcon: 'text-indigo-600',  dot: 'bg-indigo-500' },
  'Children & Families':   { icon: 'text-rose-500',    activeBg: 'bg-gradient-to-r from-rose-50 to-pink-50',       activeText: 'text-rose-700',    activeIcon: 'text-rose-600',    dot: 'bg-rose-500' },
  'Curriculum & Learning': { icon: 'text-amber-500',   activeBg: 'bg-gradient-to-r from-amber-50 to-yellow-50',    activeText: 'text-amber-700',   activeIcon: 'text-amber-600',   dot: 'bg-amber-500' },
  'Staff & HR':            { icon: 'text-sky-500',     activeBg: 'bg-gradient-to-r from-sky-50 to-blue-50',        activeText: 'text-sky-700',     activeIcon: 'text-sky-600',     dot: 'bg-sky-500' },
  'Compliance & Safety':   { icon: 'text-emerald-500', activeBg: 'bg-gradient-to-r from-emerald-50 to-teal-50',    activeText: 'text-emerald-700', activeIcon: 'text-emerald-600', dot: 'bg-emerald-500' },
  'Operations':            { icon: 'text-orange-500',  activeBg: 'bg-gradient-to-r from-orange-50 to-amber-50',    activeText: 'text-orange-700',  activeIcon: 'text-orange-600',  dot: 'bg-orange-500' },
  'Finance':               { icon: 'text-green-600',   activeBg: 'bg-gradient-to-r from-green-50 to-emerald-50',   activeText: 'text-green-700',   activeIcon: 'text-green-600',   dot: 'bg-green-500' },
  'Community & Marketing': { icon: 'text-fuchsia-500', activeBg: 'bg-gradient-to-r from-fuchsia-50 to-pink-50',    activeText: 'text-fuchsia-700', activeIcon: 'text-fuchsia-600', dot: 'bg-fuchsia-500' },
  'AI & Tools':            { icon: 'text-violet-500',  activeBg: 'bg-gradient-to-r from-violet-50 to-purple-50',   activeText: 'text-violet-700',  activeIcon: 'text-violet-600',  dot: 'bg-violet-500' },
  'Admin':                 { icon: 'text-slate-500',   activeBg: 'bg-gradient-to-r from-slate-100 to-slate-50',    activeText: 'text-slate-700',   activeIcon: 'text-slate-600',   dot: 'bg-slate-500' },
};
const defaultColors = groupColors['Home'];

export const Sidebar: React.FC<SidebarProps> = ({ currentView, onNavigate, user, onSignOut, onLogout, mobileOpen = false, onMobileClose }) => {
  const handleSignOut = onLogout || onSignOut;
  const [collapsed, setCollapsed] = useState(false);
  const [query, setQuery] = useState('');
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({
    'Home': true,
    'Children & Families': true,
    'Curriculum & Learning': false,
    'Staff & HR': false,
    'Compliance & Safety': false,
    'Operations': false,
    'Finance': false,
    'Community & Marketing': false,
    'AI & Tools': false,
    'Admin': false,
  });

  const toggleGroup = (title: string) => {
    setExpandedGroups(prev => ({ ...prev, [title]: !prev[title] }));
  };

  const handleNavigate = (view: AppView) => {
    onNavigate(view);
    onMobileClose?.();
  };

  const userRole = (user?.role || 'Educator') as UserRole;

  const visibleGroups = useMemo(() => {
    const q = query.trim().toLowerCase();
    const roleFiltered = navGroups
      .filter(group => !group.roles || group.roles.includes(userRole))
      .map(group => ({
        ...group,
        items: group.items.filter(item => !item.roles || item.roles.includes(userRole)),
      }))
      .filter(group => group.items.length > 0);
    if (!q) return roleFiltered;
    return roleFiltered
      .map(group => ({ ...group, items: group.items.filter(item => item.label.toLowerCase().includes(q)) }))
      .filter(group => group.items.length > 0);
  }, [query, userRole]);

  const searching = query.trim().length > 0;

  return (
    <div
      className={`${mobileOpen ? 'flex' : 'hidden'} fixed inset-y-0 left-0 z-50 flex-col h-screen w-64 bg-white border-r border-slate-100 transition-all duration-300 flex-shrink-0 md:static md:z-auto md:flex ${
        collapsed ? 'md:w-14' : 'md:w-64'
      }`}
      style={{ overflowY: 'auto', overflowX: 'hidden' }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-3 border-b border-slate-100 flex-shrink-0">
        {!collapsed && (
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 via-violet-500 to-fuchsia-500 shadow-md shadow-violet-500/30 flex items-center justify-center flex-shrink-0">
              <span className="text-white text-xs font-bold">EY</span>
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-slate-800 truncate">EarlyYearsOS</p>
              <p className="text-[10px] text-slate-400 truncate">{user?.centreName || 'My Centre'}</p>
            </div>
          </div>
        )}
        <button
          type="button"
          aria-label="Close navigation"
          onClick={onMobileClose}
          className="p-1.5 rounded-md hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors flex-shrink-0 md:hidden"
        >
          <X size={15} />
        </button>
        <button
          type="button"
          aria-label={collapsed ? 'Expand navigation' : 'Collapse navigation'}
          onClick={() => setCollapsed(c => !c)}
          className="hidden p-1.5 rounded-md hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors flex-shrink-0 md:block"
        >
          {collapsed ? <Menu size={15} /> : <X size={15} />}
        </button>
      </div>

      {/* Search */}
      {!collapsed && (
        <div className="px-3 pt-3 pb-1 flex-shrink-0">
          <div className="relative">
            <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <input
              type="search"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Find a tool…"
              aria-label="Search navigation"
              className="w-full rounded-lg border border-slate-200 bg-slate-50 py-1.5 pl-8 pr-2 text-xs text-slate-700 placeholder:text-slate-400 focus:border-indigo-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-100 transition-colors"
            />
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav aria-label="Primary navigation" className="flex-1 overflow-y-auto py-2">
        {visibleGroups.length === 0 && !collapsed && (
          <p className="px-4 py-3 text-xs text-slate-400">No tools match “{query}”.</p>
        )}
        {visibleGroups.map(group => {
          const colors = groupColors[group.title] || defaultColors;
          return (
          <div key={group.title} className="mb-0.5">
            {/* Group header */}
            <button
              onClick={() => toggleGroup(group.title)}
              className={`w-full flex items-center gap-2 px-3 py-1.5 hover:bg-slate-50 transition-colors ${
                collapsed ? 'justify-center' : 'justify-between'
              }`}
            >
              {collapsed ? (
                <span className={colors.icon}>{group.icon}</span>
              ) : (
                <>
                  <div className="flex items-center gap-1.5">
                    <span className={colors.icon}>{group.icon}</span>
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                      {group.title}
                    </span>
                  </div>
                  <span className="text-slate-300">
                    {expandedGroups[group.title] ? <ChevronDown size={11} /> : <ChevronRight size={11} />}
                  </span>
                </>
              )}
            </button>

            {/* Items */}
            {(expandedGroups[group.title] || collapsed || searching) && (
              <div>
                {group.items.map(item => {
                  const isActive = currentView === item.view;
                  return (
                    <button
                      key={item.view}
                      onClick={() => handleNavigate(item.view)}
                      title={collapsed ? item.label : undefined}
                      aria-current={isActive ? 'page' : undefined}
                      className={`flex items-center gap-2.5 transition-all duration-150 ${
                        collapsed
                          ? 'w-full justify-center px-2 py-2'
                          : 'mx-2 w-[calc(100%-1rem)] rounded-lg px-2.5 py-2'
                      } ${
                        isActive
                          ? `${colors.activeBg} ${colors.activeText} shadow-sm`
                          : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                      }`}
                    >
                      <span className={`flex-shrink-0 ${isActive ? colors.activeIcon : 'text-slate-400'}`}>
                        {item.icon}
                      </span>
                      {!collapsed && (
                        <span className={`text-[13px] truncate ${isActive ? 'font-semibold' : 'font-medium'}`}>
                          {item.label}
                        </span>
                      )}
                      {isActive && !collapsed && (
                        <span className={`ml-auto w-1.5 h-1.5 rounded-full ${colors.dot} flex-shrink-0`} />
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
          );
        })}
      </nav>

      {/* Footer */}
      {!collapsed && user && (
        <div className="border-t border-slate-100 px-3 py-2 flex-shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-indigo-500 to-fuchsia-500 flex items-center justify-center flex-shrink-0 shadow-sm">
              <span className="text-white text-[10px] font-bold">
                {(user.name || user.email || 'U')[0].toUpperCase()}
              </span>
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[10px] font-medium text-slate-700 truncate">{user.name || user.email}</p>
              <p className="text-[10px] text-slate-400 truncate">{user.role}</p>
            </div>
            {handleSignOut && (
              <button onClick={handleSignOut} className="text-slate-300 hover:text-slate-500 transition-colors" title="Sign out">
                <LogOut size={13} />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
