import React, { useState } from 'react';
import { usePMS } from '../../context/PMSContext';
import { PlatformPlan } from '../../types/superAdmin';
import {
  Sparkles,
  CheckCircle2,
  Edit,
  Save,
  X,
  Layers,
  Building2,
  Users,
  HardDrive,
  MessageSquare,
  ShieldCheck
} from 'lucide-react';

export const PlansManager: React.FC = () => {
  const { plans, updatePlatformPlan, t } = usePMS();

  const [editingPlan, setEditingPlan] = useState<PlatformPlan | null>(null);

  const handleSavePlan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPlan) return;

    updatePlatformPlan(editingPlan.planId, editingPlan);
    setEditingPlan(null);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header Banner */}
      <div className="bg-white dark:bg-[#1C1C1E] rounded-3xl p-6 md:p-8 border border-black/[0.04] dark:border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2.5 py-0.5 text-[11px] font-bold rounded-full bg-[#007AFF]/10 text-[#007AFF] font-mono">
              SAAS PRICING MATRIX &amp; TIER ENFORCEMENT
            </span>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-[#1C1C1E] dark:text-white">
            {t('plan_title', 'Platform Plans & Pricing')}
          </h2>
          <p className="text-xs md:text-sm text-[#8E8E93] mt-0.5">
            {t('plan_subtitle', 'Configure subscription tiers, feature flags, storage allocations, and ETB pricing rates.')}
          </p>
        </div>
      </div>

      {/* Plan Tiers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {plans.map((plan) => (
          <div
            key={plan.planId}
            className="bg-white dark:bg-[#1C1C1E] rounded-3xl p-6 border border-black/[0.04] dark:border-white/10 shadow-[0_4px_20px_rgb(0,0,0,0.03)] flex flex-col justify-between relative group hover:border-[#007AFF]/30 transition-all"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#007AFF]/10 text-[#007AFF]">
                  {plan.tier}
                </span>
                <button
                  onClick={() => setEditingPlan(plan)}
                  className="p-1.5 rounded-xl hover:bg-black/5 dark:hover:bg-white/10 text-[#8E8E93] transition-colors cursor-pointer"
                  title="Edit Plan Limits"
                >
                  <Edit className="w-3.5 h-3.5" />
                </button>
              </div>

              <h3 className="text-lg font-bold text-[#1C1C1E] dark:text-white">
                {plan.name}
              </h3>
              <p className="text-xs text-[#8E8E93] mt-1 line-clamp-2">
                {plan.description}
              </p>

              {/* Pricing in ETB: 1 Month / 6 Months / 1 Year */}
              <div className="my-4 space-y-1.5 p-3 rounded-2xl bg-[#F2F2F7] dark:bg-white/5">
                <div className="flex items-baseline justify-between">
                  <span className="text-[11px] font-bold uppercase text-[#8E8E93]">1 Month</span>
                  <span className="text-lg font-extrabold text-[#007AFF]">
                    {(plan.monthlyPriceETB || 0).toLocaleString()} <span className="text-[10px] font-normal text-[#8E8E93]">ETB</span>
                  </span>
                </div>
                <div className="flex items-baseline justify-between text-xs">
                  <span className="text-[11px] font-bold uppercase text-[#8E8E93]">6 Months <span className="text-[#FF9500]">(10% off)</span></span>
                  <span className="font-bold text-[#1C1C1E] dark:text-white">
                    {(plan.sixMonthPriceETB || Math.round((plan.monthlyPriceETB || 0) * 6 * 0.9)).toLocaleString()} <span className="text-[10px] font-normal text-[#8E8E93]">ETB</span>
                  </span>
                </div>
                <div className="flex items-baseline justify-between text-xs">
                  <span className="text-[11px] font-bold uppercase text-[#8E8E93]">1 Year <span className="text-[#34C759]">(20% off)</span></span>
                  <span className="font-bold text-[#34C759]">
                    {(plan.annualPriceETB || Math.round((plan.monthlyPriceETB || 0) * 12 * 0.8)).toLocaleString()} <span className="text-[10px] font-normal text-[#8E8E93]">ETB</span>
                  </span>
                </div>
              </div>

              {/* Limits */}
              <div className="space-y-2 py-4 border-t border-b border-black/[0.05] dark:border-white/10 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-[#8E8E93] flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5" /> Max Buildings
                  </span>
                  <span className="font-bold text-[#1C1C1E] dark:text-white">
                    {plan.limits?.maxBuildings ?? 10}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#8E8E93] flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5" /> Max Units
                  </span>
                  <span className="font-bold text-[#1C1C1E] dark:text-white">
                    {plan.limits?.maxUnits ?? 100}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#8E8E93] flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5" /> Max Users
                  </span>
                  <span className="font-bold text-[#1C1C1E] dark:text-white">
                    {plan.limits?.maxUsers ?? 20}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#8E8E93] flex items-center gap-1.5">
                    <HardDrive className="w-3.5 h-3.5" /> Storage Quota
                  </span>
                  <span className="font-bold text-[#1C1C1E] dark:text-white">
                    {plan.limits?.storageGB ?? 50} GB
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#8E8E93] flex items-center gap-1.5">
                    <MessageSquare className="w-3.5 h-3.5" /> SMS Gateway
                  </span>
                  <span className="font-bold text-[#1C1C1E] dark:text-white">
                    {plan.limits?.hasSmsIntegration ? 'Included (REST API)' : 'Standard Only'}
                  </span>
                </div>
              </div>

              {/* Feature Highlights */}
              <div className="pt-4 space-y-1.5">
                <span className="text-[10px] font-bold text-[#8E8E93] uppercase tracking-wider">
                  Included Features
                </span>
                {(plan.limits?.features || ['Automated Invoicing', 'EFT Verification', 'SMS Reminders']).slice(0, 4).map((f, i) => (
                  <div key={i} className="text-[11px] text-[#1C1C1E] dark:text-white flex items-center gap-1.5">
                    <CheckCircle2 className="w-3 h-3 text-[#34C759] shrink-0" />
                    <span className="truncate">{f}</span>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => setEditingPlan(plan)}
              className="mt-6 w-full py-2 bg-black/5 dark:bg-white/5 hover:bg-[#007AFF] hover:text-white text-[#1C1C1E] dark:text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
            >
              Configure Plan Tier
            </button>
          </div>
        ))}
      </div>

      {/* Edit Plan Modal */}
      {editingPlan && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#1C1C1E] rounded-3xl max-w-lg w-full p-6 border border-black/[0.08] dark:border-white/10 shadow-2xl space-y-4 animate-in fade-in duration-150">
            <div className="flex items-center justify-between border-b border-black/[0.05] dark:border-white/10 pb-3">
              <h3 className="font-bold text-base text-[#1C1C1E] dark:text-white">
                Edit {editingPlan.name} Tier
              </h3>
              <button
                onClick={() => setEditingPlan(null)}
                className="p-1.5 rounded-xl hover:bg-black/5 dark:hover:bg-white/10 text-[#8E8E93]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSavePlan} className="space-y-3 text-xs">
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-semibold block mb-1">1-Month Price (ETB)</label>
                  <input
                    type="number"
                    value={editingPlan.monthlyPriceETB}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      setEditingPlan({
                        ...editingPlan,
                        monthlyPriceETB: val,
                        sixMonthPriceETB: Math.round(val * 6 * 0.9),
                        annualPriceETB: Math.round(val * 12 * 0.8)
                      });
                    }}
                    className="w-full px-3 py-2 rounded-xl border border-black/[0.08] dark:border-white/10 bg-[#F2F2F7] dark:bg-[#2C2C2E]"
                  />
                </div>
                <div>
                  <label className="font-semibold block mb-1">6-Month Price (ETB)</label>
                  <input
                    type="number"
                    value={editingPlan.sixMonthPriceETB || Math.round(editingPlan.monthlyPriceETB * 6 * 0.9)}
                    onChange={(e) =>
                      setEditingPlan({
                        ...editingPlan,
                        sixMonthPriceETB: Number(e.target.value)
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-black/[0.08] dark:border-white/10 bg-[#F2F2F7] dark:bg-[#2C2C2E]"
                  />
                </div>
                <div>
                  <label className="font-semibold block mb-1">1-Year Price (ETB)</label>
                  <input
                    type="number"
                    value={editingPlan.annualPriceETB}
                    onChange={(e) =>
                      setEditingPlan({
                        ...editingPlan,
                        annualPriceETB: Number(e.target.value)
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-black/[0.08] dark:border-white/10 bg-[#F2F2F7] dark:bg-[#2C2C2E]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold block mb-1">Max Buildings</label>
                  <input
                    type="number"
                    value={editingPlan.limits.maxBuildings}
                    onChange={(e) =>
                      setEditingPlan({
                        ...editingPlan,
                        limits: { ...editingPlan.limits, maxBuildings: Number(e.target.value) }
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-black/[0.08] dark:border-white/10 bg-[#F2F2F7] dark:bg-[#2C2C2E]"
                  />
                </div>
                <div>
                  <label className="font-semibold block mb-1">Max Units</label>
                  <input
                    type="number"
                    value={editingPlan.limits.maxUnits}
                    onChange={(e) =>
                      setEditingPlan({
                        ...editingPlan,
                        limits: { ...editingPlan.limits, maxUnits: Number(e.target.value) }
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-black/[0.08] dark:border-white/10 bg-[#F2F2F7] dark:bg-[#2C2C2E]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold block mb-1">Max Users</label>
                  <input
                    type="number"
                    value={editingPlan.limits.maxUsers}
                    onChange={(e) =>
                      setEditingPlan({
                        ...editingPlan,
                        limits: { ...editingPlan.limits, maxUsers: Number(e.target.value) }
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-black/[0.08] dark:border-white/10 bg-[#F2F2F7] dark:bg-[#2C2C2E]"
                  />
                </div>
                <div>
                  <label className="font-semibold block mb-1">Storage (GB)</label>
                  <input
                    type="number"
                    value={editingPlan.limits.storageGB}
                    onChange={(e) =>
                      setEditingPlan({
                        ...editingPlan,
                        limits: { ...editingPlan.limits, storageGB: Number(e.target.value) }
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-black/[0.08] dark:border-white/10 bg-[#F2F2F7] dark:bg-[#2C2C2E]"
                  />
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingPlan(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-[#8E8E93]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#007AFF] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-md"
                >
                  <Save className="w-3.5 h-3.5" /> Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
