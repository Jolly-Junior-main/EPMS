import React from 'react';
import { usePMS } from '../../context/PMSContext';
import {
  LayoutDashboard,
  Building2,
  Users,
  CreditCard,
  Layers,
  Receipt,
  FileCheck2,
  Bell,
  LifeBuoy,
  Activity,
  Settings,
  ShieldCheck,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Globe,
  Sparkles,
  MessageSquare
} from 'lucide-react';

interface SuperAdminSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
}

export const SuperAdminSidebar: React.FC<SuperAdminSidebarProps> = ({
  activeTab,
  setActiveTab,
  isCollapsed,
  setIsCollapsed
}) => {
  const {
    currentUser,
    logout,
    language,
    setLanguage,
    t,
    platformNotifications,
    supportTickets
  } = usePMS();

  const unreadNotifs = platformNotifications.filter((n) => !n.isRead).length;
  const openTickets = supportTickets.filter((t) => t.status === 'open' || t.status === 'in_progress').length;

  const navItems = [
    { id: 'sa_dashboard', label: t('nav_sa_dashboard', 'Dashboard Overview'), icon: LayoutDashboard },
    { id: 'sa_organizations', label: t('nav_sa_organizations', 'Clients & Passwords'), icon: Building2 },
    { id: 'sa_sms_api', label: 'SMS API Gateway', icon: MessageSquare },
    { id: 'sa_subscriptions', label: t('nav_sa_subscriptions', 'Subscriptions (1M/6M/1Y)'), icon: CreditCard },
    { id: 'sa_plans', label: t('nav_sa_plans', 'Plans & Pricing'), icon: Sparkles },
    { id: 'sa_ads', label: 'Ads & Announcements', icon: Sparkles },
    { id: 'sa_billing', label: t('nav_sa_billing', 'Platform Billing'), icon: Receipt },
    { id: 'sa_health', label: t('nav_sa_health', 'System Health'), icon: Activity },
    { id: 'sa_audit_logs', label: t('nav_sa_audit_logs', 'Audit Logs'), icon: FileCheck2 },
    { id: 'sa_notifications', label: t('nav_sa_notifications', 'Notifications'), icon: Bell, badge: unreadNotifs, badgeColor: 'bg-[#FF3B30]' },
    { id: 'sa_support', label: t('nav_sa_support', 'Support Tickets'), icon: LifeBuoy, badge: openTickets, badgeColor: 'bg-[#FF9500]' },
    { id: 'sa_settings', label: t('nav_sa_settings', 'Platform Settings'), icon: Settings }
  ];

  return (
    <aside
      className={`bg-white/80 dark:bg-[#1C1C1E]/80 backdrop-blur-2xl border-r border-black/[0.06] dark:border-white/10 flex flex-col justify-between transition-all duration-300 z-30 shrink-0 ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Brand Header */}
      <div className="p-4 border-b border-black/[0.05] dark:border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#007AFF] to-[#5856D6] text-white flex items-center justify-center shrink-0 shadow-md shadow-[#007AFF]/25">
            <ShieldCheck className="w-6 h-6" />
          </div>
          {!isCollapsed && (
            <div className="overflow-hidden">
              <h1 className="font-bold text-sm text-[#1C1C1E] dark:text-white tracking-tight truncate">
                EPMS Control Plane
              </h1>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-[#007AFF]/10 text-[#007AFF]">
                SUPER ADMIN
              </span>
            </div>
          )}
        </div>

        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1.5 rounded-xl hover:bg-black/5 dark:hover:bg-white/10 text-[#8E8E93] transition-colors cursor-pointer"
          title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Navigation List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-1.5 custom-scrollbar">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-semibold transition-all duration-150 cursor-pointer active:scale-95 group relative ${
                isActive
                  ? 'bg-[#007AFF] text-white shadow-md shadow-[#007AFF]/25'
                  : 'text-[#8E8E93] hover:text-[#1C1C1E] dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5'
              }`}
              title={isCollapsed ? item.label : undefined}
            >
              <Icon className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-110 ${isActive ? 'text-white' : 'text-[#8E8E93]'}`} />
              
              {!isCollapsed && (
                <span className="truncate flex-1 text-left">{item.label}</span>
              )}

              {item.badge !== undefined && item.badge > 0 && (
                <span
                  className={`text-[10px] font-bold text-white px-2 py-0.5 rounded-full shrink-0 ${
                    item.badgeColor || 'bg-[#007AFF]'
                  } ${isCollapsed ? 'absolute top-1 right-1 px-1.5' : ''}`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Footer Profile & Actions */}
      <div className="p-3 border-t border-black/[0.05] dark:border-white/10 space-y-2">
        {/* Language Toggle */}
        <button
          onClick={() => setLanguage(language === 'en' ? 'am' : 'en')}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 text-xs font-medium text-[#1C1C1E] dark:text-white transition-all cursor-pointer"
        >
          <Globe className="w-3.5 h-3.5 text-[#007AFF]" />
          {!isCollapsed && (
            <span>{language === 'en' ? '🇪🇹 ወደ አማርኛ ቀይር' : '🇬🇧 Switch to English'}</span>
          )}
        </button>

        {/* User Card */}
        <div className="flex items-center justify-between p-2 rounded-2xl bg-black/[0.03] dark:bg-white/[0.03]">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-8 h-8 rounded-xl object-cover shrink-0 ring-2 ring-[#007AFF]/20"
            />
            {!isCollapsed && (
              <div className="overflow-hidden">
                <div className="text-xs font-bold text-[#1C1C1E] dark:text-white truncate">
                  {currentUser.name}
                </div>
                <div className="text-[10px] text-[#8E8E93] truncate">
                  {currentUser.email}
                </div>
              </div>
            )}
          </div>

          <button
            onClick={logout}
            className="p-1.5 rounded-xl hover:bg-[#FF3B30]/10 text-[#FF3B30] transition-colors cursor-pointer"
            title={t('sign_out')}
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};
