import React, { useState } from 'react';
import { usePMS } from '../../context/PMSContext';
import { SubscriptionStatus, PlanTier } from '../../types/superAdmin';
import {
  CreditCard,
  Search,
  CheckCircle2,
  AlertTriangle,
  Clock,
  XCircle,
  Calendar,
  Sparkles,
  Download,
  Plus,
  RefreshCw,
  ExternalLink
} from 'lucide-react';

export const SubscriptionsManager: React.FC = () => {
  const {
    subscriptions,
    organizations,
    plans,
    extendSubscription,
    updateSubscriptionPlan,
    addTrialDays,
    t
  } = usePMS();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | SubscriptionStatus>('all');
  const [selectedSubForAction, setSelectedSubForAction] = useState<string | null>(null);

  const filteredSubs = subscriptions.filter((sub) => {
    const org = organizations.find((o) => o.organizationId === sub.organizationId);
    const orgName = org ? org.name.toLowerCase() : '';
    const matchesSearch =
      orgName.includes(searchTerm.toLowerCase()) ||
      sub.subscriptionId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sub.tier.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;
    if (statusFilter !== 'all' && sub.status !== statusFilter) return false;
    return true;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header Banner */}
      <div className="bg-white dark:bg-[#1C1C1E] rounded-3xl p-6 md:p-8 border border-black/[0.04] dark:border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2.5 py-0.5 text-[11px] font-bold rounded-full bg-[#007AFF]/10 text-[#007AFF] font-mono">
              SAAS LICENSING &amp; BILLING CYCLES
            </span>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-[#1C1C1E] dark:text-white">
            {t('sub_title', 'Subscriptions Management')}
          </h2>
          <p className="text-xs md:text-sm text-[#8E8E93] mt-0.5">
            {t('sub_subtitle', 'Monitor active SaaS licenses, automated renewal dates, trial extensions, and tier changes.')}
          </p>
        </div>

        <div className="flex items-center gap-2 bg-[#F2F2F7] dark:bg-[#2C2C2E] p-1.5 rounded-2xl">
          <span className="text-xs font-bold text-[#1C1C1E] dark:text-white px-3">
            {subscriptions.filter((s) => s.status === 'active').length} Active Licenses
          </span>
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-white dark:bg-[#1C1C1E] rounded-2xl p-3.5 border border-black/[0.04] dark:border-white/10 shadow-[0_2px_12px_rgba(0,0,0,0.03)] flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-2 w-full md:w-80 relative">
          <Search className="w-4 h-4 text-[#8E8E93] absolute left-3.5" />
          <input
            type="text"
            placeholder="Search subscriptions by client or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-black/[0.06] dark:border-white/10 bg-[#F2F2F7] dark:bg-[#2C2C2E] text-[#1C1C1E] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#007AFF]"
          />
        </div>

        <div className="flex flex-wrap items-center gap-1 bg-[#767680]/12 dark:bg-white/5 p-1 rounded-xl">
          {(['all', 'active', 'trial', 'expiring_soon', 'suspended'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all cursor-pointer ${
                statusFilter === status
                  ? 'bg-white dark:bg-[#2C2C2E] text-[#1C1C1E] dark:text-white shadow-sm'
                  : 'text-[#8E8E93] hover:text-[#1C1C1E] dark:hover:text-white'
              }`}
            >
              {status.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Subscriptions Table */}
      <div className="bg-white dark:bg-[#1C1C1E] rounded-3xl border border-black/[0.04] dark:border-white/10 shadow-[0_4px_20px_rgb(0,0,0,0.03)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-black/[0.05] dark:border-white/10 bg-black/[0.01] dark:bg-white/[0.01] text-[#8E8E93]">
                <th className="py-3.5 px-4 font-semibold uppercase tracking-wider">Client Organization</th>
                <th className="py-3.5 px-4 font-semibold uppercase tracking-wider">Plan &amp; Billing</th>
                <th className="py-3.5 px-4 font-semibold uppercase tracking-wider">Status</th>
                <th className="py-3.5 px-4 font-semibold uppercase tracking-wider">Expiry / Renewal</th>
                <th className="py-3.5 px-4 font-semibold uppercase tracking-wider">Recurring Amount</th>
                <th className="py-3.5 px-4 font-semibold uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/[0.03] dark:divide-white/[0.05]">
              {filteredSubs.map((sub) => {
                const org = organizations.find((o) => o.organizationId === sub.organizationId);
                const plan = plans.find((p) => p.tier === sub.tier) || plans[0];

                return (
                  <tr key={sub.subscriptionId} className="hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-colors">
                    <td className="py-4 px-4">
                      <div className="font-bold text-[#1C1C1E] dark:text-white text-sm">
                        {org ? org.name : 'Unknown Organization'}
                      </div>
                      <div className="text-[10px] text-[#8E8E93] font-mono">
                        Sub ID: {sub.subscriptionId}
                      </div>
                    </td>

                    <td className="py-4 px-4">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-[#007AFF]/10 text-[#007AFF] inline-block">
                        {sub.tier} ({sub.billingCycle})
                      </span>
                    </td>

                    <td className="py-4 px-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase inline-flex items-center gap-1 ${
                          sub.status === 'active'
                            ? 'bg-[#34C759]/10 text-[#34C759]'
                            : sub.status === 'trial'
                            ? 'bg-[#007AFF]/10 text-[#007AFF]'
                            : sub.status === 'expiring_soon'
                            ? 'bg-[#FF9500]/10 text-[#FF9500]'
                            : 'bg-[#FF3B30]/10 text-[#FF3B30]'
                        }`}
                      >
                        {sub.status.replace('_', ' ')}
                      </span>
                    </td>

                    <td className="py-4 px-4">
                      <div className="font-semibold text-[#1C1C1E] dark:text-white">
                        {sub.expiryDate}
                      </div>
                      <div className="text-[11px] text-[#8E8E93]">
                        {sub.daysRemaining} days remaining
                      </div>
                    </td>

                    <td className="py-4 px-4">
                      <div className="font-bold text-sm text-[#1C1C1E] dark:text-white">
                        {sub.amountETB.toLocaleString()} ETB
                      </div>
                      <div className="text-[10px] text-[#8E8E93]">
                        {sub.billingCycle === 'annually' ? 'Annual Cycle' : 'Monthly Cycle'}
                      </div>
                    </td>

                    <td className="py-4 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => extendSubscription(sub.subscriptionId, 1)}
                          className="px-2.5 py-1.5 rounded-xl bg-black/5 dark:bg-white/5 hover:bg-[#007AFF] hover:text-white text-xs font-semibold transition-all cursor-pointer"
                          title="Extend 1 month"
                        >
                          +1 Mo
                        </button>
                        <button
                          onClick={() => extendSubscription(sub.subscriptionId, 12)}
                          className="px-2.5 py-1.5 rounded-xl bg-[#007AFF]/10 hover:bg-[#007AFF] hover:text-white text-[#007AFF] text-xs font-semibold transition-all cursor-pointer"
                          title="Extend 1 year"
                        >
                          +1 Yr
                        </button>
                        {sub.status === 'trial' && (
                          <button
                            onClick={() => addTrialDays(sub.subscriptionId, 14)}
                            className="px-2.5 py-1.5 rounded-xl bg-[#34C759]/10 text-[#34C759] hover:bg-[#34C759] hover:text-white text-xs font-semibold transition-all cursor-pointer"
                            title="Add 14 Trial Days"
                          >
                            +14D Trial
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
