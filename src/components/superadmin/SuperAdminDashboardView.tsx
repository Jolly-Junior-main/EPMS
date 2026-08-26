import React, { useState } from 'react';
import { usePMS } from '../../context/PMSContext';
import {
  Building2,
  Users,
  CreditCard,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Layers,
  Sparkles,
  ArrowUpRight,
  ShieldAlert,
  ArrowRight,
  Activity,
  Plus,
  ExternalLink,
  ChevronRight,
  Calendar
} from 'lucide-react';

interface DashboardViewProps {
  onNavigate: (tab: string) => void;
  onOpenCreateOrg: () => void;
  onSelectOrgForDetails: (orgId: string) => void;
}

export const SuperAdminDashboardView: React.FC<DashboardViewProps> = ({
  onNavigate,
  onOpenCreateOrg,
  onSelectOrgForDetails
}) => {
  const {
    getSuperAdminMetrics,
    organizations,
    subscriptions,
    plans,
    superAdminAuditLogs,
    platformNotifications,
    startImpersonation,
    t
  } = usePMS();

  const [revenueRange, setRevenueRange] = useState<'7d' | '30d' | '3m' | '6m' | '12m'>('30d');

  const metrics = getSuperAdminMetrics();
  const recentLogs = superAdminAuditLogs.slice(0, 5);
  const urgentNotifs = platformNotifications.filter((n) => !n.isRead).slice(0, 3);

  // Revenue Trend Mock Series based on range
  const revenuePoints =
    revenueRange === '7d'
      ? [240, 265, 290, 310, 315, 330, 345]
      : revenueRange === '30d'
      ? [180, 210, 240, 275, 290, 310, 345]
      : revenueRange === '3m'
      ? [150, 195, 240, 285, 315, 345]
      : revenueRange === '6m'
      ? [95, 140, 190, 240, 300, 345]
      : [60, 110, 160, 210, 270, 345];

  const maxPoint = Math.max(...revenuePoints);
  const minPoint = Math.min(...revenuePoints);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Hero Header Card */}
      <div className="bg-white dark:bg-[#1C1C1E] rounded-3xl p-6 md:p-8 border border-black/[0.04] dark:border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="space-y-1.5 z-10">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 text-[11px] font-bold rounded-full bg-[#007AFF]/10 text-[#007AFF] flex items-center gap-1.5 font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-[#007AFF] animate-pulse" />
              MULTI-TENANT SAAS CONTROL PLANE
            </span>
            <span className="text-xs text-[#8E8E93] font-medium">Addis Ababa Cluster</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-[#1C1C1E] dark:text-white">
            {t('super_admin_title', 'EPMS Cloud Control Plane')}
          </h2>
          <p className="text-xs md:text-sm text-[#8E8E93] max-w-2xl">
            {t('super_admin_subtitle', 'Centralized multi-tenant management across all commercial organizations, lease scopes, and subscriptions.')}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 z-10">
          <button
            onClick={onOpenCreateOrg}
            className="px-4 py-2.5 rounded-2xl bg-[#007AFF] hover:bg-[#0071E3] text-white text-xs font-semibold transition-all shadow-[0_4px_12px_rgba(0,122,255,0.25)] flex items-center gap-2 active:scale-95 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            {t('org_create_btn', 'Onboard Organization')}
          </button>
          <button
            onClick={() => onNavigate('sa_subscriptions')}
            className="px-4 py-2.5 rounded-2xl bg-black/5 dark:bg-white/10 hover:bg-black/10 text-[#1C1C1E] dark:text-white text-xs font-semibold transition-all flex items-center gap-2 active:scale-95 cursor-pointer"
          >
            <CreditCard className="w-4 h-4 text-[#007AFF]" />
            {t('sub_title', 'Subscriptions')} ({metrics.activeSubscriptions})
          </button>
        </div>
      </div>

      {/* Urgent Platform Alerts Banner */}
      {urgentNotifs.length > 0 && (
        <div className="bg-[#FF9500]/10 border border-[#FF9500]/25 rounded-3xl p-4 md:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-[#C97700] dark:text-[#FF9F0A]">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-2xl bg-[#FF9500] text-white flex items-center justify-center shrink-0 shadow-sm shadow-[#FF9500]/30">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-[#1C1C1E] dark:text-white">
                {urgentNotifs[0].title}
              </div>
              <div className="text-xs text-[#8E8E93] dark:text-white/70 mt-0.5">
                {urgentNotifs[0].message}
              </div>
            </div>
          </div>
          <button
            onClick={() => onNavigate('sa_notifications')}
            className="px-4 py-2 bg-[#FF9500] hover:bg-[#E08500] text-white rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 shadow-sm active:scale-95 cursor-pointer"
          >
            View All ({metrics.unreadNotificationsCount}) <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Executive KPI Stat Cards (Apple Health / Linear Style) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Organizations */}
        <div
          onClick={() => onNavigate('sa_organizations')}
          className="bg-white dark:bg-[#1C1C1E] rounded-3xl p-5 border border-black/[0.04] dark:border-white/10 shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:border-[#007AFF]/40 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-[#8E8E93] mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#8E8E93]">
              {t('super_admin_kpi_total_orgs', 'Total Client Orgs')}
            </span>
            <div className="w-9 h-9 rounded-2xl bg-[#007AFF]/10 text-[#007AFF] flex items-center justify-center group-hover:scale-110 transition-transform">
              <Building2 className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl md:text-3xl font-bold text-[#1C1C1E] dark:text-white tracking-tight">
              {metrics.totalOrganizations}
            </div>
            <div className="text-xs text-[#34C759] mt-1.5 flex items-center gap-1 font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{metrics.activeOrganizations} active clients</span>
            </div>
          </div>
        </div>

        {/* Managed Buildings & Occupancy */}
        <div
          onClick={() => onNavigate('sa_buildings')}
          className="bg-white dark:bg-[#1C1C1E] rounded-3xl p-5 border border-black/[0.04] dark:border-white/10 shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:border-[#34C759]/40 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-[#8E8E93] mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#8E8E93]">
              {t('super_admin_kpi_total_bldgs', 'Total Buildings')}
            </span>
            <div className="w-9 h-9 rounded-2xl bg-[#34C759]/10 text-[#34C759] flex items-center justify-center group-hover:scale-110 transition-transform">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl md:text-3xl font-bold text-[#1C1C1E] dark:text-white tracking-tight">
              {metrics.totalBuildings}
            </div>
            <div className="text-xs text-[#34C759] mt-1.5 flex items-center gap-1 font-semibold">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>{metrics.occupiedUnits} / {metrics.totalUnits} Units Occupied</span>
            </div>
          </div>
        </div>

        {/* Active System Users */}
        <div
          onClick={() => onNavigate('sa_users')}
          className="bg-white dark:bg-[#1C1C1E] rounded-3xl p-5 border border-black/[0.04] dark:border-white/10 shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:border-[#5856D6]/40 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-[#8E8E93] mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#8E8E93]">
              {t('super_admin_kpi_total_users', 'Total Platform Users')}
            </span>
            <div className="w-9 h-9 rounded-2xl bg-[#5856D6]/10 text-[#5856D6] flex items-center justify-center group-hover:scale-110 transition-transform">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl md:text-3xl font-bold text-[#1C1C1E] dark:text-white tracking-tight">
              {metrics.totalUsers}
            </div>
            <div className="text-xs text-[#8E8E93] mt-1.5 flex items-center gap-1 font-medium">
              <span>Tenant managers & staff</span>
            </div>
          </div>
        </div>

        {/* Platform MRR (SaaS Recurring Revenue) */}
        <div
          onClick={() => onNavigate('sa_billing')}
          className="bg-white dark:bg-[#1C1C1E] rounded-3xl p-5 border border-black/[0.04] dark:border-white/10 shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:border-[#FF9500]/40 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-[#8E8E93] mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#8E8E93]">
              {t('super_admin_kpi_mrr', 'Monthly Recurring Revenue')}
            </span>
            <div className="w-9 h-9 rounded-2xl bg-[#FF9500]/10 text-[#FF9500] flex items-center justify-center group-hover:scale-110 transition-transform">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl md:text-3xl font-bold text-[#FF9500] tracking-tight">
              {metrics.monthlyRecurringRevenueETB.toLocaleString()}
              <span className="text-xs font-medium text-[#8E8E93] ml-1">ETB</span>
            </div>
            <div className="text-xs text-[#8E8E93] mt-1.5 flex items-center gap-1 font-medium">
              <span>{metrics.expiringSubscriptions} renewal notices pending</span>
            </div>
          </div>
        </div>
      </div>

      {/* Analytics Chart & Client Distribution Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Interactive Revenue Growth Chart */}
        <div className="lg:col-span-2 bg-white dark:bg-[#1C1C1E] rounded-3xl p-6 border border-black/[0.04] dark:border-white/10 shadow-[0_4px_20px_rgb(0,0,0,0.03)] flex flex-col justify-between">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#007AFF] bg-[#007AFF]/10 px-2 py-0.5 rounded-full">
                  FINANCIAL PERFORMANCE
                </span>
              </div>
              <h3 className="text-lg font-bold text-[#1C1C1E] dark:text-white mt-1">
                Platform SaaS Revenue Trend (ETB)
              </h3>
              <p className="text-xs text-[#8E8E93]">
                Aggregated subscription billings across all client organizations
              </p>
            </div>

            {/* Timeframe Pill Selector */}
            <div className="flex items-center gap-1 bg-[#767680]/12 dark:bg-white/10 p-1 rounded-xl">
              {(['7d', '30d', '3m', '6m', '12m'] as const).map((range) => (
                <button
                  key={range}
                  onClick={() => setRevenueRange(range)}
                  className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition-all cursor-pointer ${
                    revenueRange === range
                      ? 'bg-white dark:bg-[#2C2C2E] text-[#007AFF] shadow-sm'
                      : 'text-[#8E8E93] hover:text-[#1C1C1E] dark:hover:text-white'
                  }`}
                >
                  {range.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          {/* SVG Line / Bar Visualizer */}
          <div className="h-48 w-full flex items-end gap-3 pt-6 pb-2 px-2 border-b border-black/[0.05] dark:border-white/10">
            {revenuePoints.map((val, idx) => {
              const heightPct = Math.round(((val - minPoint * 0.7) / (maxPoint - minPoint * 0.7)) * 100);
              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group relative">
                  <div className="absolute -top-7 opacity-0 group-hover:opacity-100 transition-opacity bg-black text-white text-[10px] font-bold px-2 py-0.5 rounded-md whitespace-nowrap pointer-events-none z-20">
                    {val},000 ETB
                  </div>
                  <div
                    style={{ height: `${heightPct}%` }}
                    className="w-full max-w-[36px] bg-gradient-to-t from-[#007AFF] to-[#5856D6] rounded-xl group-hover:brightness-110 transition-all shadow-sm"
                  />
                  <span className="text-[10px] text-[#8E8E93] font-medium">P{idx + 1}</span>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between text-xs text-[#8E8E93] pt-4">
            <div className="flex items-center gap-2 font-medium">
              <span className="w-2 h-2 rounded-full bg-[#007AFF]" />
              <span>Current MRR: {metrics.monthlyRecurringRevenueETB.toLocaleString()} ETB</span>
            </div>
            <div className="font-semibold text-[#34C759] flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" />
              +28.4% YoY Platform Growth
            </div>
          </div>
        </div>

        {/* Right 1 Col: Subscription Tier Breakdown */}
        <div className="bg-white dark:bg-[#1C1C1E] rounded-3xl p-6 border border-black/[0.04] dark:border-white/10 shadow-[0_4px_20px_rgb(0,0,0,0.03)] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-[#1C1C1E] dark:text-white uppercase tracking-wider text-[#8E8E93]">
                Plan Distribution
              </h3>
              <span className="text-xs text-[#007AFF] font-semibold cursor-pointer" onClick={() => onNavigate('sa_plans')}>
                View Tiers
              </span>
            </div>

            <div className="space-y-3">
              {plans.map((plan) => {
                const count = organizations.filter((o) => o.planTier === plan.tier).length;
                const pct = organizations.length > 0 ? Math.round((count / organizations.length) * 100) : 0;

                return (
                  <div key={plan.planId} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-semibold">
                      <span className="text-[#1C1C1E] dark:text-white flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-[#007AFF]" />
                        {plan.name}
                      </span>
                      <span className="text-[#8E8E93]">
                        {count} ({pct}%)
                      </span>
                    </div>
                    <div className="w-full bg-black/5 dark:bg-white/10 h-2 rounded-full overflow-hidden">
                      <div
                        style={{ width: `${pct}%` }}
                        className="h-full bg-gradient-to-r from-[#007AFF] to-[#5856D6] rounded-full"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pt-6 border-t border-black/[0.05] dark:border-white/10 mt-6">
            <button
              onClick={onOpenCreateOrg}
              className="w-full py-2.5 rounded-2xl bg-black/[0.03] dark:bg-white/[0.05] hover:bg-black/[0.06] text-xs font-bold text-[#1C1C1E] dark:text-white transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4 text-[#007AFF]" />
              Assign New Organization Plan
            </button>
          </div>
        </div>
      </div>

      {/* Client Organizations Table Overview */}
      <div className="bg-white dark:bg-[#1C1C1E] rounded-3xl p-6 border border-black/[0.04] dark:border-white/10 shadow-[0_4px_20px_rgb(0,0,0,0.03)] space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-[#1C1C1E] dark:text-white tracking-tight">
              Active Client Organizations
            </h3>
            <p className="text-xs text-[#8E8E93]">
              Real-time lease occupancy, usage limits, and impersonation shortcuts
            </p>
          </div>
          <button
            onClick={() => onNavigate('sa_organizations')}
            className="text-xs text-[#007AFF] font-bold flex items-center gap-1 hover:underline cursor-pointer self-start sm:self-auto"
          >
            View All ({organizations.length}) <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-black/[0.05] dark:border-white/10 text-[#8E8E93]">
                <th className="py-3 px-4 font-semibold uppercase tracking-wider">Organization</th>
                <th className="py-3 px-4 font-semibold uppercase tracking-wider">Tier</th>
                <th className="py-3 px-4 font-semibold uppercase tracking-wider">Status</th>
                <th className="py-3 px-4 font-semibold uppercase tracking-wider">Buildings / Units</th>
                <th className="py-3 px-4 font-semibold uppercase tracking-wider">Primary Admin</th>
                <th className="py-3 px-4 font-semibold uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/[0.03] dark:divide-white/[0.05]">
              {organizations.map((org) => (
                <tr key={org.organizationId} className="hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={org.logoUrl || 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=120&auto=format&fit=crop&q=80'}
                        alt={org.name}
                        className="w-9 h-9 rounded-xl object-cover ring-1 ring-black/10 shrink-0"
                      />
                      <div>
                        <div
                          onClick={() => onSelectOrgForDetails(org.organizationId)}
                          className="font-bold text-[#1C1C1E] dark:text-white hover:text-[#007AFF] cursor-pointer"
                        >
                          {org.name}
                        </div>
                        <div className="text-[10px] text-[#8E8E93] font-mono">
                          ID: {org.organizationId} • TIN: {org.tinNumber}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-[#007AFF]/10 text-[#007AFF]">
                      {org.planTier}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        org.status === 'active'
                          ? 'bg-[#34C759]/10 text-[#34C759]'
                          : org.status === 'trial'
                          ? 'bg-[#007AFF]/10 text-[#007AFF]'
                          : 'bg-[#FF3B30]/10 text-[#FF3B30]'
                      }`}
                    >
                      {org.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-[#1C1C1E] dark:text-white">
                      {org.usage?.buildingsCount || 0} Buildings
                    </div>
                    <div className="text-[10px] text-[#8E8E93]">
                      {org.usage?.occupiedUnitsCount || 0} / {org.usage?.unitsCount || 0} units occupied
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-medium text-[#1C1C1E] dark:text-white">
                      {org.primaryAdminName}
                    </div>
                    <div className="text-[10px] text-[#8E8E93]">
                      {org.primaryAdminEmail}
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => startImpersonation(org.organizationId)}
                        className="px-3 py-1.5 rounded-xl bg-[#007AFF]/10 hover:bg-[#007AFF] hover:text-white text-[#007AFF] text-[11px] font-bold transition-all flex items-center gap-1 cursor-pointer active:scale-95"
                        title="Enter client dashboard in Super Admin access mode"
                      >
                        <ExternalLink className="w-3 h-3" />
                        Open Dashboard
                      </button>
                      <button
                        onClick={() => onSelectOrgForDetails(org.organizationId)}
                        className="px-2.5 py-1.5 rounded-xl bg-black/5 dark:bg-white/5 hover:bg-black/10 text-xs font-semibold transition-all cursor-pointer"
                      >
                        Profile
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Platform Audit Trail */}
      <div className="bg-white dark:bg-[#1C1C1E] rounded-3xl p-6 border border-black/[0.04] dark:border-white/10 shadow-[0_4px_20px_rgb(0,0,0,0.03)] space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-[#1C1C1E] dark:text-white">
              Recent System &amp; Administrative Activity
            </h3>
            <p className="text-xs text-[#8E8E93]">
              Immutable audit records for compliance, subscriptions, and RBAC operations
            </p>
          </div>
          <button
            onClick={() => onNavigate('sa_audit_logs')}
            className="text-xs text-[#007AFF] font-bold flex items-center gap-1 hover:underline cursor-pointer"
          >
            All Logs <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="divide-y divide-black/[0.03] dark:divide-white/[0.05]">
          {recentLogs.map((log) => (
            <div key={log.logId} className="py-3 flex items-start justify-between gap-4 text-xs">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-[#007AFF]/10 text-[#007AFF] flex items-center justify-center shrink-0 mt-0.5">
                  <Activity className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-[#1C1C1E] dark:text-white flex items-center gap-2">
                    <span>{log.action}</span>
                    {log.organizationName && (
                      <span className="text-[10px] font-normal text-[#8E8E93]">
                        • {log.organizationName}
                      </span>
                    )}
                  </div>
                  <div className="text-[#8E8E93] text-[11px] mt-0.5">
                    {log.details}
                  </div>
                </div>
              </div>
              <div className="text-right text-[10px] text-[#8E8E93] shrink-0 font-mono">
                {new Date(log.timestamp).toLocaleTimeString()}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
