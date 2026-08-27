import React from 'react';
import { usePMS } from '../../context/PMSContext';
import { UserRole } from '../../types/pms';
import {
  Building2,
  Store,
  Briefcase,
  ShieldCheck,
  UserCheck,
  AlertTriangle,
  FileCheck2,
  RotateCcw,
  Sparkles,
  ChevronDown,
  LayoutDashboard,
  Users,
  Receipt,
  MessageSquare,
  Cpu,
  LogOut,
  ShieldAlert,
  Lock,
  ExternalLink,
  Globe
} from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab }) => {
  const {
    currentUser,
    clientTheme,
    switchUser,
    logout,
    language,
    setLanguage,
    t,
    activeRoleRoute,
    navigateRoleRoute,
    isFirestoreConnected,
    syncStatus,
    properties,
    getRevenueMetrics,
    resetToSampleData,
    adBanners,
    isAdBannerGlobalEnabled
  } = usePMS();

  const metrics = getRevenueMetrics();

  // Role-Specific Navigation Tabs with Multilingual Amharic Support
  const getNavTabsForRole = () => {
    if (currentUser.role === 'super_admin') {
      return [
        { id: 'sa_dashboard', label: t('nav_sa_dashboard', 'Control Plane'), icon: LayoutDashboard, route: '/superadmin' },
        { id: 'sa_organizations', label: t('nav_sa_organizations', 'Organizations & Passwords'), icon: Building2, route: '/superadmin/orgs' },
        { id: 'sa_sms_api', label: 'SMS API Gateway', icon: MessageSquare, route: '/superadmin/sms' },
        { id: 'sa_subscriptions', label: t('nav_sa_subscriptions', 'Subscriptions (1M/6M/1Y)'), icon: Sparkles, route: '/superadmin/subs' },
        { id: 'sa_plans', label: t('nav_sa_plans', 'Plans & Pricing'), icon: Receipt, route: '/superadmin/plans' },
        { id: 'sa_ads', label: 'Ads & Banners', icon: Sparkles, route: '/superadmin/ads' },
      ];
    }

    // Owner: Strictly restricted to Revenue, Who Paid/Not Paid, and Telegram Auto-Verified Receipt Gallery
    if (currentUser.role === 'owner') {
      return [
        { id: 'dashboard', label: t('nav_dashboard', 'Revenue Analytics'), icon: LayoutDashboard, route: '/owner' },
        { id: 'invoices', label: t('nav_invoices', 'Who Paid & Not Paid'), icon: Receipt, route: '/owner/ledger' },
        { id: 'vault', label: t('nav_vault', 'Receipt Gallery'), icon: FileCheck2, route: '/owner/vault' },
      ];
    }

    // Manager: 1 Building Operations
    return [
      { id: 'tenants', label: t('nav_tenants', 'Tenants Directory'), icon: Users, route: '/manager/tenants' },
      { id: 'invoices', label: t('nav_invoices', 'Rent Invoices & Payments'), icon: Receipt, route: '/manager/invoices' },
      { id: 'sms', label: t('nav_sms', 'SMS Reminders'), icon: MessageSquare, route: '/manager/sms' },
      { id: 'redlist', label: t('nav_redlist', 'Overdue Red List'), icon: AlertTriangle, count: metrics.redListCount, countColor: 'bg-[#FF3B30]', route: '/manager/redlist' },
      { id: 'dashboard', label: t('nav_occupancy', 'Building Occupancy'), icon: LayoutDashboard, route: '/manager/overview' },
    ];
  };

  const navTabs = getNavTabsForRole();

  const handleTabClick = (tab: { id: string; route: string }) => {
    const isAllowed = navigateRoleRoute(tab.route);
    if (isAllowed) {
      setActiveTab(tab.id);
    }
  };

  return (
    <header id="main-header" className="sticky top-0 z-40 backdrop-blur-2xl bg-white/95 border-b border-black/[0.06] shadow-[0_2px_15px_rgba(0,0,0,0.03)]">
      {/* Super Admin Announcement / Ad Banner (Only displayed when turned ON) */}
      {isAdBannerGlobalEnabled && adBanners && adBanners.filter(ad => ad.isActive && (ad.targetAudience === 'all' || ad.targetAudience === currentUser.role)).slice(0, 1).map(ad => (
        <div key={ad.adId} className="bg-gradient-to-r from-[#007AFF]/10 via-[#5856D6]/10 to-[#007AFF]/10 border-b border-[#007AFF]/20 px-4 py-2 text-xs flex items-center justify-between gap-4 animate-in fade-in duration-200">
          <div className="flex items-center gap-2 overflow-hidden">
            {ad.badgeText && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold text-white uppercase shrink-0" style={{ backgroundColor: ad.badgeColor || '#007AFF' }}>
                {ad.badgeText}
              </span>
            )}
            <span className="font-bold text-[#1C1C1E] truncate">{ad.title}</span>
            <span className="text-[#8E8E93] hidden md:inline truncate">• {ad.subtitle}</span>
          </div>
          {ad.ctaText && (
            <a href={ad.ctaUrl || '#'} className="px-3 py-1 bg-[#007AFF] hover:bg-[#0062CC] text-white rounded-xl text-[11px] font-bold shrink-0 transition-all active:scale-95 shadow-sm">
              {ad.ctaText}
            </a>
          )}
        </div>
      ))}

      {/* Main Header Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-wrap items-center justify-between gap-4">
        {/* Client Brand Logo & Property Identity */}
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-2xl bg-gradient-to-tr ${clientTheme.gradientClass} text-white flex items-center justify-center font-bold text-lg shadow-md`}>
            {clientTheme.logoIconName === 'Store' ? (
              <Store className="w-5 h-5" />
            ) : clientTheme.logoIconName === 'Briefcase' ? (
              <Briefcase className="w-5 h-5" />
            ) : (
              <Building2 className="w-5 h-5" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-bold text-base sm:text-lg tracking-tight text-[#1C1C1E] leading-none">
                {clientTheme.propertyName}
              </h1>
              <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${clientTheme.badgeBgClass} ${clientTheme.badgeTextClass} border ${clientTheme.badgeBorderClass}`}>
                {currentUser.role === 'owner' ? t('portal_owner', 'Executive Owner') : t('portal_manager', 'Building Manager')}
              </span>
            </div>
            <p className="text-[11px] text-[#8E8E93] font-medium tracking-tight mt-0.5 flex items-center gap-1.5">
              <span className="font-semibold text-[#3A3A3C]">{clientTheme.organizationName}</span>
              <span>&bull;</span>
              <span>{clientTheme.citySubcity}</span>
            </p>
          </div>
        </div>

        {/* User Profile & Logout */}
        <div className="flex items-center gap-3">
          {/* Main Language Switcher Pill */}
          <button
            id="header-lang-switcher"
            onClick={() => setLanguage(language === 'en' ? 'am' : 'en')}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-[#767680]/10 hover:bg-[#767680]/20 text-[#1C1C1E] text-xs font-semibold border border-black/[0.04] transition-all active:scale-95 cursor-pointer"
          >
            <Globe className="w-3.5 h-3.5 text-[#007AFF]" />
            <span>{language === 'en' ? '🇪🇹 አማርኛ' : '🇬🇧 English'}</span>
          </button>

          {/* Reset Data Button */}
          <button
            id="header-reset-btn"
            onClick={resetToSampleData}
            title="Reset database to initial enterprise state"
            className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-[#767680]/10 hover:bg-[#767680]/20 text-[#8E8E93] hover:text-[#1C1C1E] text-xs font-semibold border border-black/[0.04] transition-all active:scale-95 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{t('reset_data', 'Reset Data')}</span>
          </button>

          <div className="bg-[#767680]/10 p-1.5 rounded-2xl border border-black/[0.04] flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full ring-2 ring-white overflow-hidden shrink-0 shadow-sm ml-1">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="hidden sm:block text-left pr-2">
              <div className="text-xs font-semibold text-[#1C1C1E] flex items-center gap-1.5">
                {currentUser.name}
                <span
                  className={`text-[9px] uppercase font-bold px-1.5 py-0.5 rounded-md ${
                    currentUser.role === 'owner'
                      ? 'bg-[#007AFF] text-white'
                      : currentUser.role === 'manager'
                      ? 'bg-[#34C759] text-white'
                      : currentUser.role === 'tenant'
                      ? 'bg-[#FF9500] text-white'
                      : 'bg-[#5856D6] text-white'
                  }`}
                >
                  {currentUser.role === 'owner' ? 'Owner' : currentUser.role === 'tenant' ? 'Tenant' : currentUser.role}
                </span>
              </div>
              <div className="text-[10px] text-[#8E8E93] truncate max-w-[150px]">{currentUser.email}</div>
            </div>

            {/* Sign Out Button */}
            <button
              id="header-logout-btn"
              onClick={logout}
              title="Sign Out / Lock Session"
              className="p-1.5 px-2.5 rounded-xl text-[#FF3B30] bg-[#FF3B30]/5 hover:bg-[#FF3B30]/10 border border-[#FF3B30]/15 transition-all active:scale-95 flex items-center gap-1.5 text-xs font-semibold cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>{t('sign_out')}</span>
            </button>
          </div>
        </div>
      </div>

      {/* iPadOS / iOS Segmented Navigation Bar */}
      <nav className="bg-[#F2F2F7]/80 border-t border-black/[0.04] px-4 sm:px-6 lg:px-8 py-2 overflow-x-auto scrollbar-none">
        <div className="max-w-7xl mx-auto flex items-center space-x-1.5">
          {navTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                id={`nav-tab-${tab.id}`}
                onClick={() => handleTabClick(tab)}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-200 flex items-center gap-2 active:scale-95 ${
                  isActive
                    ? 'bg-[#007AFF] text-white shadow-[0_2px_10px_rgba(0,122,255,0.3)]'
                    : 'text-[#636366] hover:text-[#1C1C1E] hover:bg-black/[0.04]'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-[#8E8E93]'}`} />
                <span>{tab.label}</span>
                {tab.count !== undefined && tab.count > 0 && (
                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full ${
                      isActive ? 'bg-white text-[#007AFF]' : `${tab.countColor} text-white`
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </nav>
    </header>
  );
};
