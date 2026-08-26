import React from 'react';
import { usePMS } from '../../context/PMSContext';
import { UserRole } from '../../types/pms';
import {
  Building2,
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
    selectedPropertyId,
    setSelectedPropertyId,
    getRevenueMetrics,
    resetToSampleData,
    adBanners
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

    // Owner: Strictly restricted to Revenue, Who Paid/Not Paid, and Verification Vault
    if (currentUser.role === 'owner') {
      return [
        { id: 'dashboard', label: t('nav_dashboard', 'Revenue Analytics'), icon: LayoutDashboard, route: '/owner' },
        { id: 'invoices', label: t('nav_invoices', 'Who Paid & Not Paid'), icon: Receipt, route: '/owner/ledger' },
        { id: 'vault', label: t('nav_vault', 'Receipt Verification Vault'), icon: ShieldCheck, count: metrics.pendingVerificationCount, countColor: 'bg-[#007AFF]', route: '/owner/vault' },
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
    <header id="main-header" className="sticky top-0 z-40 backdrop-blur-2xl bg-white/80 border-b border-black/[0.06] shadow-[0_2px_15px_rgba(0,0,0,0.03)]">
      {/* Top iOS Status Bar / Ticker */}
      <div className="bg-[#1C1C1E] px-4 py-1.5 text-[11px] text-white/80 flex flex-wrap items-center justify-between gap-2 border-b border-white/[0.06]">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 text-[#34C759] font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-[#34C759] animate-pulse" />
            Authenticated Session Active
          </span>
          <span className="text-white/30">•</span>
          <span className="flex items-center gap-1.5 text-[10px] font-mono px-2 py-0.2 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <span className={`w-1.5 h-1.5 rounded-full ${syncStatus === 'synced' ? 'bg-emerald-400' : syncStatus === 'syncing' ? 'bg-amber-400 animate-ping' : 'bg-red-400'}`} />
            Firestore: {syncStatus === 'synced' ? 'Live Synced' : syncStatus === 'syncing' ? 'Connecting...' : 'Cached Local'}
          </span>
          <span className="text-white/30">•</span>
          <span className="font-mono text-[#0A84FF] text-[10px] px-2 py-0.2 rounded-full bg-[#007AFF]/20 border border-[#007AFF]/30">
            Route: {activeRoleRoute}
          </span>
          <span className="hidden md:inline text-white/30">•</span>
          <span className="hidden md:flex items-center gap-1 text-white/90">
            <Building2 className="w-3 h-3 text-white/60" />
            <span>{properties.find(p => p.propertyId === selectedPropertyId)?.name || 'Addis Ababa Portfolio (All Complexes)'}</span>
          </span>
        </div>

        <div className="flex items-center gap-2.5">
          {metrics.pendingVerificationCount > 0 && currentUser.role !== 'manager' && currentUser.role !== 'tenant' && (
            <button
              id="header-vault-badge"
              onClick={() => handleTabClick({ id: 'vault', route: '/owner/vault' })}
              className="px-2 py-0.5 rounded-full bg-[#007AFF]/20 text-[#0A84FF] border border-[#007AFF]/30 text-[10px] font-bold flex items-center gap-1 hover:bg-[#007AFF]/30 transition-all active:scale-95"
            >
              <FileCheck2 className="w-3 h-3" />
              {metrics.pendingVerificationCount} Slips Pending
            </button>
          )}

          {metrics.redListCount > 0 && currentUser.role !== 'tenant' && (
            <button
              id="header-redlist-badge"
              onClick={() => handleTabClick({ id: 'redlist', route: '/owner/redlist' })}
              className="px-2 py-0.5 rounded-full bg-[#FF3B30]/20 text-[#FF453A] border border-[#FF3B30]/30 text-[10px] font-bold flex items-center gap-1 hover:bg-[#FF3B30]/30 transition-all active:scale-95"
            >
              <AlertTriangle className="w-3 h-3" />
              {metrics.redListCount} Overdue
            </button>
          )}

          {currentUser.role !== 'tenant' && (
            <button
              id="header-reset-btn"
              onClick={resetToSampleData}
              title="Reset database to initial enterprise state"
              className="text-white/60 hover:text-white transition-colors flex items-center gap-1 text-[10px] font-medium ml-1 active:scale-95"
            >
              <RotateCcw className="w-2.5 h-2.5" />
              {t('reset_data')}
            </button>
          )}

          {/* Language Toggle Button */}
          <button
            id="lang-toggle-top-btn"
            onClick={() => setLanguage(language === 'en' ? 'am' : 'en')}
            className="px-2 py-0.5 rounded-full bg-white/10 hover:bg-white/20 text-white text-[10px] font-semibold flex items-center gap-1 transition-all border border-white/10 active:scale-95 cursor-pointer ml-1"
          >
            <Globe className="w-3 h-3 text-[#0A84FF]" />
            <span>{language === 'en' ? '🇪🇹 አማርኛ' : '🇬🇧 EN'}</span>
          </button>
        </div>
      </div>

      {/* Super Admin Announcement / Ad Banner */}
      {adBanners && adBanners.filter(ad => ad.isActive && (ad.targetAudience === 'all' || ad.targetAudience === currentUser.role)).slice(0, 1).map(ad => (
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
        {/* Brand & Complex Selector */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#007AFF] to-[#5856D6] text-white flex items-center justify-center font-bold text-lg shadow-[0_4px_12px_rgba(0,122,255,0.3)]">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-bold text-lg tracking-tight text-[#1C1C1E] leading-none">
                {t('app_title')}
              </h1>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#007AFF]/10 text-[#007AFF] border border-[#007AFF]/20">
                {currentUser.role === 'owner' ? t('portal_owner', 'Executive Owner') : t('portal_manager', 'Building Manager')}
              </span>
            </div>
            <p className="text-[11px] text-[#8E8E93] font-medium tracking-tight mt-0.5">
              {t('app_subtitle')}
            </p>
          </div>

          {/* Complex Filter Dropdown (Hidden for tenants; Locked to 1 building for managers) */}
          {currentUser.role === 'manager' ? (
            <div className="hidden lg:flex items-center ml-3 pl-3 border-l border-black/[0.08] text-xs font-semibold text-[#1C1C1E] bg-[#34C759]/10 border border-[#34C759]/20 px-3 py-1.5 rounded-xl">
              <Building2 className="w-3.5 h-3.5 text-[#34C759] mr-1.5" />
              <span>Managing: {currentUser.assignedPropertyName || 'Bole Medhanialem Commercial Center'} (1 Building Scope)</span>
            </div>
          ) : currentUser.role !== 'tenant' && (
            <div className="hidden lg:flex items-center ml-3 pl-3 border-l border-black/[0.08]">
              <select
                id="property-selector"
                value={selectedPropertyId}
                onChange={(e) => setSelectedPropertyId(e.target.value)}
                className="bg-[#767680]/10 text-[#1C1C1E] text-xs rounded-xl px-3 py-1.5 border border-transparent focus:bg-white focus:border-[#007AFF] focus:ring-2 focus:ring-[#007AFF]/20 font-medium transition-all outline-none cursor-pointer"
              >
                <option value="all">{t('all_complexes')}</option>
                {properties.map((prop) => (
                  <option key={prop.propertyId} value={prop.propertyId}>
                    {prop.name} ({prop.type})
                  </option>
                ))}
              </select>
            </div>
          )}
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

          {/* Quick Super Admin Switch Button */}
          {currentUser.role !== 'super_admin' && (
            <button
              onClick={() => switchUser('super_admin')}
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-[#007AFF]/10 hover:bg-[#007AFF] hover:text-white text-[#007AFF] text-xs font-bold border border-[#007AFF]/20 transition-all active:scale-95 cursor-pointer shadow-sm"
              title="Switch to Super Admin Control Plane"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>⚡ Super Admin</span>
            </button>
          )}

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
