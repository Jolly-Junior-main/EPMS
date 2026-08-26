import React from 'react';
import { usePMS } from '../../context/PMSContext';
import {
  TrendingUp,
  DollarSign,
  AlertOctagon,
  CheckCircle2,
  Clock,
  Building,
  ShieldCheck,
  FileText,
  Send,
  ArrowUpRight,
  ArrowRight,
  PieChart,
  Activity,
  Layers,
  Sparkles
} from 'lucide-react';

interface DashboardProps {
  onNavigate: (tab: string) => void;
}

export const OwnerExecutiveDashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  const {
    currentUser,
    clientTheme,
    getRevenueMetrics,
    properties,
    invoices,
    payments,
    getRedList,
    t
  } = usePMS();

  const metrics = getRevenueMetrics();
  const redListItems = getRedList();
  const unverifiedPayments = payments.filter((p) => p.verificationStatus === 'unverified');

  return (
    <div id="executive-dashboard-view" className="space-y-6">
      {/* iOS Hero Header Card */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-black/[0.04] shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="space-y-1.5 z-10">
          <div className="flex items-center gap-2">
            <span className={`px-2.5 py-0.5 text-[11px] font-bold rounded-full ${clientTheme.badgeBgClass} ${clientTheme.badgeTextClass} flex items-center gap-1.5 border ${clientTheme.badgeBorderClass}`}>
              <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: clientTheme.primaryColor }} />
              {t('live_aggregates', 'Live Property Financials')}
            </span>
            <span className="text-xs text-[#8E8E93] font-medium">{clientTheme.citySubcity}</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-[#1C1C1E]">
            {currentUser.role === 'owner' ? t('dash_title_owner', 'Executive Revenue Intelligence') : t('dash_title_manager', 'Building Operations')}
          </h2>
          <p className="text-xs md:text-sm text-[#8E8E93] max-w-2xl">
            <strong className="text-[#1C1C1E]">{clientTheme.propertyName}</strong> &bull; {clientTheme.tagline}
          </p>
        </div>

        {/* Quick iOS Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5 z-10">
          <button
            id="dash-open-vault-btn"
            onClick={() => onNavigate('vault')}
            className="px-4 py-2.5 rounded-2xl bg-[#007AFF] hover:bg-[#0071E3] text-white text-xs font-semibold transition-all shadow-[0_4px_12px_rgba(0,122,255,0.25)] flex items-center gap-2 active:scale-95 cursor-pointer"
          >
            <ShieldCheck className="w-4 h-4 text-white" />
            {t('dash_verify_slips_btn')} ({metrics.pendingVerificationCount})
          </button>
          <button
            id="dash-open-redlist-btn"
            onClick={() => onNavigate('redlist')}
            className="px-4 py-2.5 rounded-2xl bg-[#FF3B30] hover:bg-[#E02E24] text-white text-xs font-semibold transition-all shadow-[0_4px_12px_rgba(255,59,48,0.25)] flex items-center gap-2 active:scale-95 cursor-pointer"
          >
            <AlertOctagon className="w-4 h-4 text-white" />
            {t('dash_red_list_btn')} ({metrics.redListCount})
          </button>
        </div>
      </div>

      {/* iOS Action Alert Banner for Pending Slips */}
      {unverifiedPayments.length > 0 && (
        <div className="bg-[#FF9500]/10 border border-[#FF9500]/30 rounded-3xl p-4 md:p-5 flex items-center justify-between gap-4 text-[#C97700]">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-2xl bg-[#FF9500] text-white flex items-center justify-center shrink-0 shadow-[0_4px_12px_rgba(255,149,0,0.3)]">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-[#1C1C1E]">
                {unverifiedPayments.length} {t('dash_pending_alert_title')}
              </div>
              <div className="text-xs text-[#8E8E93] mt-0.5">
                {t('dash_pending_alert_sub')}
              </div>
            </div>
          </div>
          <button
            onClick={() => onNavigate('vault')}
            className="px-4 py-2 bg-[#FF9500] hover:bg-[#E08500] text-white rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 shadow-[0_2px_8px_rgba(255,149,0,0.3)] active:scale-95 cursor-pointer"
          >
            {t('dash_review_now')} <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Apple Health / iOS Widget-Style Financial Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Expected Revenue (System Blue) */}
        <div className="bg-white rounded-3xl p-5 border border-black/[0.04] shadow-[0_4px_20px_rgb(0,0,0,0.03)] relative overflow-hidden flex flex-col justify-between">
          <div className="flex items-center justify-between text-[#8E8E93] mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#8E8E93]">{t('dash_metric_expected')}</span>
            <div className="w-9 h-9 rounded-2xl bg-[#007AFF]/10 text-[#007AFF] flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl md:text-3xl font-bold text-[#1C1C1E] tracking-tight">
              {metrics.totalExpectedETB.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              <span className="text-xs font-medium text-[#8E8E93] ml-1">ETB</span>
            </div>
            <div className="text-xs text-[#8E8E93] mt-1.5 flex items-center gap-1 font-medium">
              <span>{metrics.totalTenantsCount} {t('dash_metric_active_tenants')}</span>
            </div>
          </div>
        </div>

        {/* Gross Collected Capital (System Green) */}
        <div className="bg-white rounded-3xl p-5 border border-black/[0.04] shadow-[0_4px_20px_rgb(0,0,0,0.03)] relative overflow-hidden flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#8E8E93]">{t('dash_metric_collected')}</span>
            <div className="w-9 h-9 rounded-2xl bg-[#34C759]/10 text-[#34C759] flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl md:text-3xl font-bold text-[#34C759] tracking-tight">
              {metrics.grossCollectedETB.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              <span className="text-xs font-medium text-[#34C759] ml-1">ETB</span>
            </div>
            <div className="text-xs text-[#34C759] mt-1.5 flex items-center gap-1 font-semibold">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>{metrics.collectionRatePercent}% {t('dash_metric_collection_rate')}</span>
            </div>
          </div>
        </div>

        {/* Net Outstanding Balance (System Orange) */}
        <div className="bg-white rounded-3xl p-5 border border-black/[0.04] shadow-[0_4px_20px_rgb(0,0,0,0.03)] relative overflow-hidden flex flex-col justify-between">
          <div className="flex items-center justify-between text-[#8E8E93] mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#8E8E93]">{t('dash_metric_uncollected')}</span>
            <div className="w-9 h-9 rounded-2xl bg-[#FF9500]/10 text-[#FF9500] flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl md:text-3xl font-bold text-[#FF9500] tracking-tight">
              {metrics.netOutstandingETB.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              <span className="text-xs font-medium text-[#8E8E93] ml-1">ETB</span>
            </div>
            <div className="text-xs text-[#8E8E93] mt-1.5 flex items-center gap-1 font-medium">
              <span>{metrics.portfolioOccupancyPercent}% {t('dash_metric_occupancy')}</span>
            </div>
          </div>
        </div>

        {/* Delinquent Capital on Red List (System Red) */}
        <div className="bg-white rounded-3xl p-5 border border-black/[0.04] shadow-[0_4px_20px_rgb(0,0,0,0.03)] relative overflow-hidden flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#8E8E93]">{t('nav_redlist')}</span>
            <div className="w-9 h-9 rounded-2xl bg-[#FF3B30]/10 text-[#FF3B30] flex items-center justify-center">
              <AlertOctagon className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl md:text-3xl font-bold text-[#FF3B30] tracking-tight">
              {metrics.delinquentETB.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              <span className="text-xs font-medium text-[#FF3B30] ml-1">ETB</span>
            </div>
            <div className="text-xs text-[#FF3B30] mt-1.5 flex items-center gap-1 font-semibold">
              <span>{redListItems.length} accounts on Red List</span>
            </div>
          </div>
        </div>
      </div>

      {/* Two-Column Analytics Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Revenue Health & Breakdown */}
        <div className="lg:col-span-2 space-y-6">
          {/* Collection Progress & Portfolio Occupancy */}
          <div className="bg-white rounded-3xl p-6 md:p-8 border border-black/[0.04] shadow-[0_4px_20px_rgb(0,0,0,0.03)] space-y-6">
            <div className="flex items-center justify-between border-b border-black/[0.05] pb-4">
              <div>
                <h3 className="text-base font-bold text-[#1C1C1E]">Capital Flow &amp; Collection Health</h3>
                <p className="text-xs text-[#8E8E93]">Reconciliation ratio across commercial &amp; residential leases</p>
              </div>
              <span className="px-3 py-1 bg-[#34C759]/10 text-[#34C759] text-xs font-bold rounded-full">
                Portfolio Occupancy: {metrics.occupancyRatePercent}%
              </span>
            </div>

            {/* Apple Style Segmented Activity Bar */}
            <div>
              <div className="flex justify-between text-xs font-semibold text-[#1C1C1E] mb-2">
                <span>Revenue Reconciliation Ratio</span>
                <span className="font-bold text-[#34C759]">{metrics.collectionRatePercent}% Complete</span>
              </div>
              <div className="w-full bg-[#E5E5EA] rounded-full h-3.5 overflow-hidden flex">
                <div
                  className="bg-[#34C759] h-full transition-all duration-500 rounded-l-full"
                  style={{ width: `${Math.min(metrics.collectionRatePercent, 100)}%` }}
                  title={`Collected: ${metrics.grossCollectedETB.toLocaleString()} ETB`}
                />
                <div
                  className="bg-[#FF9500] h-full transition-all duration-500"
                  style={{ width: `${Math.min(100 - metrics.collectionRatePercent, 35)}%` }}
                  title="Pending Verification"
                />
                <div
                  className="bg-[#FF3B30] h-full transition-all duration-500 rounded-r-full"
                  style={{ width: `15%` }}
                  title="Delinquent Overdue"
                />
              </div>
              <div className="flex items-center justify-between text-[11px] text-[#8E8E93] mt-3">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#34C759]" /> Verified Paid ({metrics.grossCollectedETB.toLocaleString()} ETB)
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#FF9500]" /> Pending Invoices
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#FF3B30]" /> Overdue Delinquent
                </span>
              </div>
            </div>

            {/* Payment Channel Share Breakdown in iOS Widgets */}
            <div className="pt-4 border-t border-black/[0.05] grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              <div className="bg-[#F2F2F7] rounded-2xl p-3">
                <div className="text-[11px] font-semibold text-[#8E8E93]">CBE Birr / Direct</div>
                <div className="text-sm font-bold text-[#1C1C1E] mt-0.5">38% share</div>
              </div>
              <div className="bg-[#F2F2F7] rounded-2xl p-3">
                <div className="text-[11px] font-semibold text-[#8E8E93]">Telebirr Merchant</div>
                <div className="text-sm font-bold text-[#1C1C1E] mt-0.5">26% share</div>
              </div>
              <div className="bg-[#F2F2F7] rounded-2xl p-3">
                <div className="text-[11px] font-semibold text-[#8E8E93]">Awash / RTGS</div>
                <div className="text-sm font-bold text-[#1C1C1E] mt-0.5">22% share</div>
              </div>
              <div className="bg-[#F2F2F7] rounded-2xl p-3">
                <div className="text-[11px] font-semibold text-[#8E8E93]">Dashen / Amole</div>
                <div className="text-sm font-bold text-[#1C1C1E] mt-0.5">14% share</div>
              </div>
            </div>
          </div>

          {/* Properties Overview List */}
          <div className="bg-white rounded-3xl p-6 md:p-8 border border-black/[0.04] shadow-[0_4px_20px_rgb(0,0,0,0.03)] space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-[#1C1C1E]">Complex Performance Index</h3>
              <span className="text-xs text-[#8E8E93]">Addis Ababa Metropolitan Portfolio</span>
            </div>

            <div className="space-y-2.5">
              {properties
                .filter((p) =>
                  currentUser.role === 'super_admin'
                    ? true
                    : p.propertyId === (currentUser.assignedPropertyId || currentUser.complexAccess?.[0] || 'prop_bole_01')
                )
                .map((prop) => {
                const propInvoices = invoices.filter((i) => i.propertyId === prop.propertyId);
                const propTotal = propInvoices.reduce((acc, i) => acc + i.amountDue, 0);
                const propPaid = propInvoices.filter((i) => i.paymentStatus === 'paid').reduce((acc, i) => acc + i.amountDue, 0);
                const propDelinquent = propInvoices.filter((i) => i.paymentStatus === 'delinquent').length;

                return (
                  <div
                    key={prop.propertyId}
                    className="p-4 rounded-2xl bg-[#F2F2F7]/70 hover:bg-[#F2F2F7] transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-white text-[#007AFF] border border-black/[0.04] flex items-center justify-center font-bold shrink-0 shadow-sm">
                        <Building className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="font-bold text-[#1C1C1E] text-sm">{prop.name}</div>
                        <div className="text-xs text-[#8E8E93]">{prop.location} • {prop.totalUnits} Units</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-right">
                      <div>
                        <div className="text-[11px] text-[#8E8E93] font-medium">Expected Billing</div>
                        <div className="text-sm font-bold text-[#1C1C1E]">{propTotal.toLocaleString()} ETB</div>
                      </div>
                      {propDelinquent > 0 ? (
                        <span className="px-2.5 py-1 bg-[#FF3B30]/10 text-[#FF3B30] rounded-full text-xs font-bold">
                          {propDelinquent} Overdue
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 bg-[#34C759]/10 text-[#34C759] rounded-full text-xs font-bold">
                          Good Standing
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Col: Top Overdue Delinquencies from The Red List */}
        <div className="space-y-6">
          <div className="bg-[#1C1C1E] rounded-3xl p-6 text-white shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <AlertOctagon className="w-5 h-5 text-[#FF3B30]" />
                <h3 className="font-bold text-sm text-white">The Red List (Overdue Aging)</h3>
              </div>
              <button
                onClick={() => onNavigate('redlist')}
                className="text-xs text-[#007AFF] hover:text-[#389BFF] font-semibold flex items-center gap-1"
              >
                Full List <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <p className="text-xs text-white/70">
              Accounts with active delinquency (<code>dueDate &lt; now</code>).
            </p>

            <div className="space-y-2.5">
              {redListItems.slice(0, 3).map((item) => (
                <div
                  key={item.invoiceId}
                  className="bg-[#2C2C2E] rounded-2xl p-3.5 space-y-2 border border-white/5"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="font-bold text-sm text-white">{item.tenantName}</div>
                      <div className="text-xs text-white/60">{item.unitNumber}</div>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-[#FF3B30]/20 text-[#FF3B30] text-[11px] font-bold border border-[#FF3B30]/30">
                      {item.agingDays}d Overdue
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs pt-1.5 border-t border-white/10">
                    <span className="text-white/60">Total with 5% Late Fee:</span>
                    <span className="font-bold text-[#FF3B30]">{item.totalWithLateFee.toLocaleString()} ETB</span>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => onNavigate('redlist')}
              className="w-full py-2.5 rounded-2xl bg-[#FF3B30] hover:bg-[#E02E24] text-white text-xs font-semibold transition-all shadow-[0_4px_12px_rgba(255,59,48,0.3)] flex items-center justify-center gap-2 active:scale-95"
            >
              Open Red List Control &amp; Dispatch SMS
            </button>
          </div>

          {/* Quick SMS Trigger Snapshot */}
          <div className="bg-white rounded-3xl p-6 border border-black/[0.04] shadow-[0_4px_20px_rgb(0,0,0,0.03)] space-y-3">
            <div className="flex items-center gap-2 text-[#1C1C1E] font-bold text-sm">
              <Send className="w-4 h-4 text-[#007AFF]" />
              Automated SMS Cron Status
            </div>
            <p className="text-xs text-[#8E8E93]">
              Cloud Function <code>every day 08:00</code> executes D-7 and D-0 reminder queries.
            </p>
            <div className="p-3 bg-[#F2F2F7] rounded-2xl flex items-center justify-between text-xs">
              <span className="text-[#8E8E93] font-medium">Gateway Status:</span>
              <span className="text-[#34C759] font-bold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#34C759]" />
                EthioTelecom &amp; Twilio Live
              </span>
            </div>
            <button
              onClick={() => onNavigate('sms')}
              className="w-full py-2.5 bg-[#007AFF] hover:bg-[#0071E3] text-white rounded-2xl text-xs font-semibold transition-all shadow-[0_4px_12px_rgba(0,122,255,0.25)] active:scale-95"
            >
              View SMS Console &amp; Test Triggers
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

