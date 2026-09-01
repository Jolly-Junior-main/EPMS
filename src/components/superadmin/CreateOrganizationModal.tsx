import React, { useState } from 'react';
import { usePMS } from '../../context/PMSContext';
import { PlanTier, OrganizationStatus } from '../../types/superAdmin';
import {
  X,
  Building2,
  Users,
  ShieldCheck,
  CreditCard,
  Sparkles,
  Check,
  CheckCircle2,
  Mail,
  Phone,
  MapPin,
  Globe,
  FileText
} from 'lucide-react';

interface CreateOrgModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateOrganizationModal: React.FC<CreateOrgModalProps> = ({ isOpen, onClose }) => {
  const { createOrganization, plans, t } = usePMS();

  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Form Fields
  const [name, setName] = useState('');
  const [tradeName, setTradeName] = useState('');
  const [tinNumber, setTinNumber] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('+251');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('Addis Ababa');
  const [country, setCountry] = useState('Ethiopia');
  const [website, setWebsite] = useState('');
  const [logoUrl, setLogoUrl] = useState('');

  // Primary Admin Fields
  const [adminName, setAdminName] = useState('');
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPhone, setAdminPhone] = useState('+251');
  const [tempPassword, setTempPassword] = useState('123');

  // Plan Selection
  const [selectedPlanTier, setSelectedPlanTier] = useState<PlanTier>('professional');
  const [status, setStatus] = useState<OrganizationStatus>('active');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !contactEmail.trim()) return;

    const selectedPlanObj = plans.find((p) => p.tier === selectedPlanTier) || plans[0];

    createOrganization({
      name,
      tradeName: tradeName || undefined,
      tinNumber: tinNumber || '00' + Math.floor(10000000 + Math.random() * 90000000),
      contactPerson: contactPerson || adminName,
      contactEmail,
      contactPhone,
      address: address || 'Bole Road, Addis Ababa',
      city,
      country,
      website: website || undefined,
      logoUrl: logoUrl || 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=120&auto=format&fit=crop&q=80',
      status,
      planTier: selectedPlanTier,
      planId: selectedPlanObj.planId,
      subscriptionId: '',
      primaryAdminUid: '',
      primaryAdminName: adminName || contactPerson,
      primaryAdminEmail: adminEmail || contactEmail,
      tempPassword: tempPassword.trim() || '123'
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white dark:bg-[#1C1C1E] rounded-3xl max-w-2xl w-full border border-black/[0.08] dark:border-white/10 shadow-2xl overflow-hidden my-8">
        {/* Modal Header */}
        <div className="p-6 border-b border-black/[0.05] dark:border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#007AFF]/10 text-[#007AFF] flex items-center justify-center">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-[#1C1C1E] dark:text-white">
                Onboard New Client Organization
              </h2>
              <p className="text-xs text-[#8E8E93]">
                Create a dedicated tenant workspace, assign plan limits, and provision primary admin
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-black/5 dark:hover:bg-white/10 text-[#8E8E93] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Indicator */}
        <div className="px-6 pt-4 pb-2 flex items-center justify-between border-b border-black/[0.03] dark:border-white/5 bg-black/[0.01]">
          {[
            { num: 1, label: 'Organization Info' },
            { num: 2, label: 'Primary Admin' },
            { num: 3, label: 'Plan & Tier' }
          ].map((s) => (
            <div
              key={s.num}
              onClick={() => setStep(s.num as any)}
              className={`flex items-center gap-2 cursor-pointer transition-all ${
                step === s.num
                  ? 'text-[#007AFF] font-bold'
                  : step > s.num
                  ? 'text-[#34C759] font-medium'
                  : 'text-[#8E8E93]'
              }`}
            >
              <div
                className={`w-6 h-6 rounded-full text-[11px] flex items-center justify-center font-bold ${
                  step === s.num
                    ? 'bg-[#007AFF] text-white'
                    : step > s.num
                    ? 'bg-[#34C759] text-white'
                    : 'bg-black/5 dark:bg-white/10 text-[#8E8E93]'
                }`}
              >
                {step > s.num ? <Check className="w-3.5 h-3.5" /> : s.num}
              </div>
              <span className="text-xs">{s.label}</span>
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto custom-scrollbar">
            {/* Step 1: Organization Details */}
            {step === 1 && (
              <div className="space-y-4 animate-in fade-in duration-150">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5 md:col-span-2">
                    <label className="text-xs font-semibold text-[#1C1C1E] dark:text-white">
                      Organization Legal Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Kaldas Property Management PLC"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-black/[0.08] dark:border-white/10 bg-[#F2F2F7] dark:bg-[#2C2C2E] text-xs font-medium text-[#1C1C1E] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#007AFF]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-[#1C1C1E] dark:text-white">
                      Business Trade Name
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Kaldas Real Estate"
                      value={tradeName}
                      onChange={(e) => setTradeName(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-black/[0.08] dark:border-white/10 bg-[#F2F2F7] dark:bg-[#2C2C2E] text-xs font-medium text-[#1C1C1E] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#007AFF]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-[#1C1C1E] dark:text-white">
                      Tax Identification Number (TIN) *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 0071928401"
                      value={tinNumber}
                      onChange={(e) => setTinNumber(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-black/[0.08] dark:border-white/10 bg-[#F2F2F7] dark:bg-[#2C2C2E] text-xs font-medium text-[#1C1C1E] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#007AFF]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-[#1C1C1E] dark:text-white">
                      Official Email *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="contact@kaldasproperties.et"
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-black/[0.08] dark:border-white/10 bg-[#F2F2F7] dark:bg-[#2C2C2E] text-xs font-medium text-[#1C1C1E] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#007AFF]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-[#1C1C1E] dark:text-white">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+251 91 555 7890"
                      value={contactPhone}
                      onChange={(e) => setContactPhone(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-black/[0.08] dark:border-white/10 bg-[#F2F2F7] dark:bg-[#2C2C2E] text-xs font-medium text-[#1C1C1E] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#007AFF]"
                    />
                  </div>

                  <div className="space-y-1.5 md:col-span-2">
                    <label className="text-xs font-semibold text-[#1C1C1E] dark:text-white">
                      Physical Head Office Address
                    </label>
                    <input
                      type="text"
                      placeholder="Churchill Ave, Piazza, Addis Ababa"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-black/[0.08] dark:border-white/10 bg-[#F2F2F7] dark:bg-[#2C2C2E] text-xs font-medium text-[#1C1C1E] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#007AFF]"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Primary Administrator */}
            {step === 2 && (
              <div className="space-y-4 animate-in fade-in duration-150">
                <div className="bg-[#007AFF]/10 p-3.5 rounded-2xl text-xs text-[#007AFF] flex items-center gap-2.5 font-medium">
                  <ShieldCheck className="w-5 h-5 shrink-0" />
                  <span>
                    The primary administrator will receive Owner permissions within this organization's isolated environment.
                  </span>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#1C1C1E] dark:text-white">
                    Administrator Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Yonas Kaldas"
                    value={adminName}
                    onChange={(e) => setAdminName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-black/[0.08] dark:border-white/10 bg-[#F2F2F7] dark:bg-[#2C2C2E] text-xs font-medium text-[#1C1C1E] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#007AFF]"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-[#1C1C1E] dark:text-white">
                      Admin Email *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="admin@kaldasproperties.et"
                      value={adminEmail}
                      onChange={(e) => setAdminEmail(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-black/[0.08] dark:border-white/10 bg-[#F2F2F7] dark:bg-[#2C2C2E] text-xs font-medium text-[#1C1C1E] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#007AFF]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-[#1C1C1E] dark:text-white">
                      Temporary Password (Default: 123)
                    </label>
                    <input
                      type="text"
                      value={tempPassword}
                      onChange={(e) => setTempPassword(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-black/[0.08] dark:border-white/10 bg-[#F2F2F7] dark:bg-[#2C2C2E] text-xs font-medium text-[#1C1C1E] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#007AFF]"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Plan & Subscription Assignment */}
            {step === 3 && (
              <div className="space-y-4 animate-in fade-in duration-150">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {plans.map((plan) => (
                    <div
                      key={plan.planId}
                      onClick={() => setSelectedPlanTier(plan.tier)}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                        selectedPlanTier === plan.tier
                          ? 'border-[#007AFF] bg-[#007AFF]/5 dark:bg-[#007AFF]/10 ring-2 ring-[#007AFF]/20'
                          : 'border-black/[0.08] dark:border-white/10 bg-[#F2F2F7]/50 dark:bg-white/[0.02] hover:border-black/20'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-xs text-[#1C1C1E] dark:text-white uppercase">
                          {plan.name}
                        </span>
                        {selectedPlanTier === plan.tier && (
                          <CheckCircle2 className="w-4 h-4 text-[#007AFF]" />
                        )}
                      </div>
                      <div className="text-base font-bold text-[#007AFF]">
                        {plan.monthlyPriceETB.toLocaleString()}{' '}
                        <span className="text-[10px] text-[#8E8E93]">ETB / mo</span>
                      </div>
                      <div className="text-[11px] text-[#8E8E93] mt-2 space-y-1">
                        <div>• Up to {plan.limits.maxBuildings} Buildings</div>
                        <div>• Up to {plan.limits.maxUnits} Total Units</div>
                        <div>• Up to {plan.limits.maxUsers} System Users</div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-2">
                  <label className="text-xs font-semibold text-[#1C1C1E] dark:text-white block mb-1.5">
                    Subscription Status Mode
                  </label>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setStatus('active')}
                      className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        status === 'active'
                          ? 'bg-[#34C759] text-white shadow-sm'
                          : 'bg-black/5 dark:bg-white/5 text-[#8E8E93]'
                      }`}
                    >
                      Active Commercial License
                    </button>
                    <button
                      type="button"
                      onClick={() => setStatus('trial')}
                      className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        status === 'trial'
                          ? 'bg-[#007AFF] text-white shadow-sm'
                          : 'bg-black/5 dark:bg-white/5 text-[#8E8E93]'
                      }`}
                    >
                      30-Day Evaluation Trial
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="p-6 border-t border-black/[0.05] dark:border-white/10 flex items-center justify-between">
            {step > 1 ? (
              <button
                type="button"
                onClick={() => setStep((prev) => (prev - 1) as any)}
                className="px-4 py-2 text-xs font-semibold text-[#8E8E93] hover:text-[#1C1C1E] dark:hover:text-white cursor-pointer"
              >
                Back
              </button>
            ) : (
              <div />
            )}

            {step < 3 ? (
              <button
                type="button"
                onClick={() => setStep((prev) => (prev + 1) as any)}
                className="px-5 py-2.5 bg-[#007AFF] hover:bg-[#0062CC] text-white rounded-2xl text-xs font-bold transition-all shadow-md active:scale-95 cursor-pointer"
              >
                Continue Next
              </button>
            ) : (
              <button
                type="submit"
                className="px-6 py-2.5 bg-[#34C759] hover:bg-[#2EB150] text-white rounded-2xl text-xs font-bold transition-all shadow-md active:scale-95 cursor-pointer flex items-center gap-2"
              >
                <Check className="w-4 h-4" />
                Complete Organization Provisioning
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};
