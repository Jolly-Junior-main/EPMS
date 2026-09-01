import React, { useState } from 'react';
import { usePMS } from '../../context/PMSContext';
import { PlanTier } from '../../types/superAdmin';
import {
  X,
  Building2,
  Users,
  CreditCard,
  Layers,
  Receipt,
  FileCheck2,
  ShieldCheck,
  ShieldAlert,
  ExternalLink,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Settings,
  Edit,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Sparkles
} from 'lucide-react';

interface OrgDetailsModalProps {
  organizationId: string | null;
  onClose: () => void;
}

export const OrganizationDetailsModal: React.FC<OrgDetailsModalProps> = ({
  organizationId,
  onClose
}) => {
  const {
    organizations,
    plans,
    subscriptions,
    platformInvoices,
    superAdminAuditLogs,
    extendSubscription,
    updateSubscriptionPlan,
    suspendOrganization,
    activateOrganization,
    startImpersonation,
    t
  } = usePMS();

  const [activeTab, setActiveTab] = useState<'overview' | 'subscription' | 'billing' | 'audit' | 'settings'>('overview');
  const [selectedUpgradeTier, setSelectedUpgradeTier] = useState<PlanTier>('business');

  if (!organizationId) return null;

  const org = organizations.find((o) => o.organizationId === organizationId);
  if (!org) return null;

  const currentSub = subscriptions.find((s) => s.organizationId === org.organizationId);
  const currentPlan = plans.find((p) => p.tier === org.planTier) || plans[0];
  const orgInvoices = platformInvoices.filter((i) => i.organizationId === org.organizationId);
  const orgLogs = superAdminAuditLogs.filter((l) => l.organizationId === org.organizationId);

  const unitPercent = Math.round(((org.usage?.unitsCount || 0) / currentPlan.limits.maxUnits) * 100);

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white dark:bg-[#1C1C1E] rounded-3xl max-w-3xl w-full border border-black/[0.08] dark:border-white/10 shadow-2xl overflow-hidden my-8 flex flex-col max-h-[90vh]">
        {/* Header Profile Banner */}
        <div className="p-6 bg-gradient-to-r from-[#007AFF]/10 via-[#5856D6]/5 to-transparent border-b border-black/[0.05] dark:border-white/10 flex items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <img
              src={org.logoUrl || 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=120&auto=format&fit=crop&q=80'}
              alt={org.name}
              className="w-16 h-16 rounded-2xl object-cover ring-2 ring-black/10 shrink-0"
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-[#007AFF] text-white">
                  {org.planTier}
                </span>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                    org.status === 'active'
                      ? 'bg-[#34C759]/10 text-[#34C759]'
                      : org.status === 'trial'
                      ? 'bg-[#007AFF]/10 text-[#007AFF]'
                      : org.status === 'departed'
                      ? 'bg-purple-500/10 text-purple-600 border border-purple-500/20'
                      : 'bg-[#FF3B30]/10 text-[#FF3B30]'
                  }`}
                >
                  {org.status === 'departed' ? 'Departed / Vacated' : org.status}
                </span>
              </div>
              <h2 className="text-xl font-bold text-[#1C1C1E] dark:text-white mt-1">
                {org.name}
              </h2>
              <div className="text-xs text-[#8E8E93] flex flex-wrap items-center gap-3 mt-1 font-medium">
                <span>TIN: {org.tinNumber}</span>
                <span>•</span>
                <span>ID: {org.organizationId}</span>
                <span>•</span>
                <span>Joined {new Date(org.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onClose();
                startImpersonation(org.organizationId);
              }}
              className="px-3.5 py-2 rounded-xl bg-[#007AFF] hover:bg-[#0062CC] text-white text-xs font-bold transition-all shadow-md flex items-center gap-1.5 active:scale-95 cursor-pointer"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              Open Dashboard
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl hover:bg-black/5 dark:hover:bg-white/10 text-[#8E8E93] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1 px-6 pt-3 border-b border-black/[0.05] dark:border-white/10 bg-black/[0.01]">
          {[
            { id: 'overview', label: 'Overview', icon: Building2 },
            { id: 'subscription', label: 'Subscription & Tier', icon: CreditCard },
            { id: 'billing', label: `Billing (${orgInvoices.length})`, icon: Receipt },
            { id: 'audit', label: 'Audit Trail', icon: FileCheck2 },
            { id: 'settings', label: 'Settings', icon: Settings }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 transition-all cursor-pointer ${
                  activeTab === tab.id
                    ? 'border-[#007AFF] text-[#007AFF]'
                    : 'border-transparent text-[#8E8E93] hover:text-[#1C1C1E] dark:hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab Body */}
        <div className="p-6 overflow-y-auto custom-scrollbar flex-1 space-y-6">
          {/* OVERVIEW TAB */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Quota Usage Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-[#F2F2F7] dark:bg-[#2C2C2E] p-4 rounded-2xl space-y-2">
                  <div className="text-xs text-[#8E8E93] font-semibold uppercase">
                    Buildings Quota
                  </div>
                  <div className="text-xl font-bold text-[#1C1C1E] dark:text-white">
                    {org.usage.buildingsCount} / {currentPlan.limits.maxBuildings}
                  </div>
                  <div className="text-[10px] text-[#34C759] font-medium">
                    Commercial &amp; Residential
                  </div>
                </div>

                <div className="bg-[#F2F2F7] dark:bg-[#2C2C2E] p-4 rounded-2xl space-y-2">
                  <div className="text-xs text-[#8E8E93] font-semibold uppercase">
                    Units Portfolio
                  </div>
                  <div className="text-xl font-bold text-[#1C1C1E] dark:text-white">
                    {org.usage.unitsCount} / {currentPlan.limits.maxUnits}
                  </div>
                  <div className="text-[10px] text-[#8E8E93]">
                    {org.usage.occupiedUnitsCount} Occupied ({unitPercent}% utilization)
                  </div>
                </div>

                <div className="bg-[#F2F2F7] dark:bg-[#2C2C2E] p-4 rounded-2xl space-y-2">
                  <div className="text-xs text-[#8E8E93] font-semibold uppercase">
                    Users &amp; Staff
                  </div>
                  <div className="text-xl font-bold text-[#1C1C1E] dark:text-white">
                    {org.usage.usersCount} / {currentPlan.limits.maxUsers}
                  </div>
                  <div className="text-[10px] text-[#8E8E93]">
                    Admins, Managers &amp; Staff
                  </div>
                </div>
              </div>

              {/* Contact & Administrative Details */}
              <div className="bg-black/[0.02] dark:bg-white/[0.02] border border-black/[0.05] dark:border-white/10 rounded-2xl p-4 space-y-3">
                <h4 className="text-xs font-bold text-[#1C1C1E] dark:text-white uppercase tracking-wider text-[#8E8E93]">
                  Primary Contact &amp; Governance
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-[#8E8E93] block">Primary Administrator:</span>
                    <span className="font-semibold text-[#1C1C1E] dark:text-white">
                      {org.primaryAdminName}
                    </span>
                  </div>
                  <div>
                    <span className="text-[#8E8E93] block">Admin Email:</span>
                    <span className="font-semibold text-[#1C1C1E] dark:text-white font-mono">
                      {org.primaryAdminEmail}
                    </span>
                  </div>
                  <div>
                    <span className="text-[#8E8E93] block">Phone Contact:</span>
                    <span className="font-semibold text-[#1C1C1E] dark:text-white">
                      {org.contactPhone}
                    </span>
                  </div>
                  <div>
                    <span className="text-[#8E8E93] block">Head Office Address:</span>
                    <span className="font-semibold text-[#1C1C1E] dark:text-white">
                      {org.address}, {org.city}, {org.country}
                    </span>
                  </div>
                </div>

                {/* Departure & Handover Certificate Card */}
                {(org.status === 'departed' || org.departureRecord) && (
                  <div className="bg-purple-50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-900/40 rounded-2xl p-5 space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-purple-900 dark:text-purple-300 uppercase tracking-wider flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-purple-600"></span>
                        Official Building Exit & Handover Certificate
                      </h4>
                      <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-purple-200 dark:bg-purple-900/50 text-purple-800 dark:text-purple-200 uppercase">
                        Departed Property
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
                      <div>
                        <span className="text-purple-700/70 dark:text-purple-300/70 block text-[11px]">Departure Date:</span>
                        <span className="font-bold text-purple-950 dark:text-purple-100">
                          {org.departureRecord ? new Date(org.departureRecord.departedAt).toLocaleDateString() : 'Recorded'}
                        </span>
                      </div>
                      <div>
                        <span className="text-purple-700/70 dark:text-purple-300/70 block text-[11px]">Reason:</span>
                        <span className="font-bold text-purple-950 dark:text-purple-100 capitalize">
                          {org.departureRecord?.departureReason.replace('_', ' ') || 'Lease Expired'}
                        </span>
                      </div>
                      <div>
                        <span className="text-purple-700/70 dark:text-purple-300/70 block text-[11px]">Vacated Units:</span>
                        <span className="font-bold text-purple-950 dark:text-purple-100">
                          {org.departureRecord?.vacatedUnitsCount ?? 'All'} Units Vacated
                        </span>
                      </div>
                      <div>
                        <span className="text-purple-700/70 dark:text-purple-300/70 block text-[11px]">Facility Keys Returned:</span>
                        <span className="font-bold text-purple-950 dark:text-purple-100">
                          {org.departureRecord?.keysReturned ? '✓ Verified & Handed Over' : 'Pending'}
                        </span>
                      </div>
                      <div>
                        <span className="text-purple-700/70 dark:text-purple-300/70 block text-[11px]">Deposit &amp; Utilities Settled:</span>
                        <span className="font-bold text-purple-950 dark:text-purple-100">
                          {org.departureRecord?.depositSettled ? '✓ Reconciled & Settled' : 'Pending'}
                        </span>
                      </div>
                      <div>
                        <span className="text-purple-700/70 dark:text-purple-300/70 block text-[11px]">Handover Officer:</span>
                        <span className="font-bold text-purple-950 dark:text-purple-100">
                          {org.departureRecord?.processedByAdminName || 'Super Administrator'}
                        </span>
                      </div>
                    </div>

                    {org.departureRecord?.departureNotes && (
                      <div className="pt-2 border-t border-purple-200/50 dark:border-purple-900/30 text-xs">
                        <span className="text-purple-700/70 dark:text-purple-300/70 block text-[11px] font-semibold">Inspection Notes:</span>
                        <p className="text-purple-950 dark:text-purple-100 italic mt-0.5">
                          "{org.departureRecord.departureNotes}"
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* SUBSCRIPTION TAB */}
          {activeTab === 'subscription' && currentSub && (
            <div className="space-y-6">
              <div className="bg-[#007AFF]/5 dark:bg-[#007AFF]/10 border border-[#007AFF]/20 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#007AFF] bg-[#007AFF]/10 px-2 py-0.5 rounded-full">
                    ACTIVE LICENSE
                  </span>
                  <h3 className="text-lg font-bold text-[#1C1C1E] dark:text-white mt-1">
                    {currentPlan.name} ({currentSub.billingCycle})
                  </h3>
                  <div className="text-xs text-[#8E8E93] mt-1">
                    Expires on <span className="font-bold text-[#1C1C1E] dark:text-white">{currentSub.expiryDate}</span> ({currentSub.daysRemaining} days remaining)
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-2xl font-bold text-[#007AFF]">
                    {currentSub.amountETB.toLocaleString()} ETB
                  </div>
                  <span className="text-[10px] text-[#8E8E93]">Billing Cycle Amount</span>
                </div>
              </div>

              {/* Extend / Upgrade Actions */}
              <div className="border border-black/[0.06] dark:border-white/10 rounded-2xl p-5 space-y-4">
                <h4 className="text-xs font-bold uppercase text-[#8E8E93] tracking-wider">
                  Subscription Lifecycle Actions
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    onClick={() => extendSubscription(currentSub.subscriptionId, 12)}
                    className="p-3 bg-black/5 dark:bg-white/5 hover:bg-black/10 rounded-xl text-xs font-bold text-left transition-all cursor-pointer flex items-center justify-between"
                  >
                    <div>
                      <div className="text-[#1C1C1E] dark:text-white">Extend 1 Year (12 Mo)</div>
                      <div className="text-[10px] text-[#8E8E93] font-normal">Add 365 days to active license</div>
                    </div>
                    <Calendar className="w-4 h-4 text-[#007AFF]" />
                  </button>

                  <button
                    onClick={() => extendSubscription(currentSub.subscriptionId, 1)}
                    className="p-3 bg-black/5 dark:bg-white/5 hover:bg-black/10 rounded-xl text-xs font-bold text-left transition-all cursor-pointer flex items-center justify-between"
                  >
                    <div>
                      <div className="text-[#1C1C1E] dark:text-white">Extend 1 Month</div>
                      <div className="text-[10px] text-[#8E8E93] font-normal">Add 30 days to active license</div>
                    </div>
                    <Clock className="w-4 h-4 text-[#007AFF]" />
                  </button>
                </div>

                <div className="pt-3 border-t border-black/[0.05] dark:border-white/10 space-y-3">
                  <div className="text-xs font-bold text-[#1C1C1E] dark:text-white">
                    Upgrade / Downgrade Plan Tier
                  </div>
                  <div className="flex items-center gap-2">
                    <select
                      value={selectedUpgradeTier}
                      onChange={(e) => setSelectedUpgradeTier(e.target.value as any)}
                      className="flex-1 px-3.5 py-2 text-xs rounded-xl border border-black/[0.08] dark:border-white/10 bg-[#F2F2F7] dark:bg-[#2C2C2E] text-[#1C1C1E] dark:text-white font-medium cursor-pointer"
                    >
                      <option value="starter">Starter Plan (35,000 ETB/mo)</option>
                      <option value="professional">Professional Plan (85,000 ETB/mo)</option>
                      <option value="business">Business Enterprise (165,000 ETB/mo)</option>
                      <option value="enterprise">Custom Enterprise (320,000 ETB/mo)</option>
                    </select>

                    <button
                      onClick={() => updateSubscriptionPlan(currentSub.subscriptionId, selectedUpgradeTier)}
                      className="px-4 py-2 bg-[#007AFF] hover:bg-[#0062CC] text-white text-xs font-bold rounded-xl transition-all shadow-sm cursor-pointer"
                    >
                      Update Tier
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* BILLING TAB */}
          {activeTab === 'billing' && (
            <div className="space-y-4">
              {orgInvoices.length === 0 ? (
                <div className="p-8 text-center text-xs text-[#8E8E93]">
                  No platform invoices issued for this client yet.
                </div>
              ) : (
                <div className="divide-y divide-black/[0.05] dark:divide-white/10 border border-black/[0.05] dark:border-white/10 rounded-2xl overflow-hidden">
                  {orgInvoices.map((inv) => (
                    <div key={inv.invoiceId} className="p-4 flex items-center justify-between gap-4 text-xs">
                      <div>
                        <div className="font-bold text-[#1C1C1E] dark:text-white">
                          {inv.invoiceNumber} • {inv.planName}
                        </div>
                        <div className="text-[11px] text-[#8E8E93]">
                          Period: {inv.billingPeriod} • Issued: {inv.issuedDate}
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="font-bold text-sm text-[#1C1C1E] dark:text-white">
                          {inv.amountETB.toLocaleString()} ETB
                        </div>
                        <span
                          className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full inline-block mt-1 ${
                            inv.status === 'paid'
                              ? 'bg-[#34C759]/10 text-[#34C759]'
                              : 'bg-[#FF3B30]/10 text-[#FF3B30]'
                          }`}
                        >
                          {inv.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* AUDIT LOG TAB */}
          {activeTab === 'audit' && (
            <div className="space-y-3">
              {orgLogs.length === 0 ? (
                <div className="p-8 text-center text-xs text-[#8E8E93]">
                  No audit operations recorded for this organization yet.
                </div>
              ) : (
                <div className="divide-y divide-black/[0.05] dark:divide-white/10 border border-black/[0.05] dark:border-white/10 rounded-2xl overflow-hidden">
                  {orgLogs.map((log) => (
                    <div key={log.logId} className="p-3.5 text-xs space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-[#007AFF] uppercase text-[11px]">
                          {log.action}
                        </span>
                        <span className="text-[10px] text-[#8E8E93] font-mono">
                          {new Date(log.timestamp).toLocaleString()}
                        </span>
                      </div>
                      <div className="text-[#1C1C1E] dark:text-white text-[11px]">
                        {log.details}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* SETTINGS TAB */}
          {activeTab === 'settings' && (
            <div className="space-y-4">
              <div className="border border-[#FF3B30]/20 bg-[#FF3B30]/5 rounded-2xl p-4 space-y-3">
                <h4 className="text-xs font-bold text-[#FF3B30] uppercase tracking-wider">
                  Organization Suspension &amp; Tenant Access Lock
                </h4>
                <p className="text-xs text-[#8E8E93]">
                  Suspending this organization will block all its associated owners, property managers, and tenants from authenticating or accessing EPMS workspaces.
                </p>
                {org.status === 'suspended' ? (
                  <button
                    onClick={() => activateOrganization(org.organizationId)}
                    className="px-4 py-2 bg-[#34C759] hover:bg-[#2EB150] text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
                  >
                    Reactivate Organization
                  </button>
                ) : (
                  <button
                    onClick={() => suspendOrganization(org.organizationId)}
                    className="px-4 py-2 bg-[#FF3B30] hover:bg-[#E02E24] text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
                  >
                    Suspend Organization Access
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
