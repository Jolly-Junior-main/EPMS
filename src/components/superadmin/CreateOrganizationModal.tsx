import React, { useState } from 'react';
import { usePMS } from '../../context/PMSContext';
import { PlanTier, OrganizationStatus, SubscriptionBillingCycle } from '../../types/superAdmin';
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
  FileText,
  AlertCircle,
  Layers,
  Calendar,
  DollarSign
} from 'lucide-react';

interface CreateOrgModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateOrganizationModal: React.FC<CreateOrgModalProps> = ({ isOpen, onClose }) => {
  const { createOrganization, plans, organizations, t } = usePMS();

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

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

  // Plan, Buildings & Billing Cycle Selection
  const [selectedPlanTier, setSelectedPlanTier] = useState<PlanTier>('professional');
  const [billingCycle, setBillingCycle] = useState<SubscriptionBillingCycle>('monthly');
  const [buildingsCount, setBuildingsCount] = useState<number>(1);
  const [unitsPerBuilding, setUnitsPerBuilding] = useState<number>(8);
  const [status, setStatus] = useState<OrganizationStatus>('active');

  if (!isOpen) return null;

  const checkDuplicate = (): string | null => {
    const trimmedName = name.trim().toLowerCase();
    const trimmedTin = tinNumber.trim();
    const trimmedContactEmail = contactEmail.trim().toLowerCase();
    const targetAdminEmail = (adminEmail || contactEmail).trim().toLowerCase();

    for (const org of organizations) {
      if (org.name.trim().toLowerCase() === trimmedName) {
        return `An organization named "${org.name}" is already registered.`;
      }
      if (trimmedTin && org.tinNumber && org.tinNumber.trim() === trimmedTin) {
        return `TIN number "${trimmedTin}" is already registered to ${org.name}.`;
      }
      if (org.contactEmail.trim().toLowerCase() === trimmedContactEmail) {
        return `Contact email "${trimmedContactEmail}" is already registered to ${org.name}.`;
      }
      if (org.primaryAdminEmail.trim().toLowerCase() === targetAdminEmail) {
        return `Admin email "${targetAdminEmail}" is already registered to ${org.name}.`;
      }
    }
    return null;
  };

  const handleNextStep = () => {
    setErrorMessage(null);
    if (step === 1) {
      if (!name.trim()) {
        setErrorMessage('Please enter the Organization Legal Name.');
        return;
      }
      if (!contactEmail.trim()) {
        setErrorMessage('Please enter the Official Contact Email.');
        return;
      }
      const duplicateError = checkDuplicate();
      if (duplicateError) {
        setErrorMessage(duplicateError);
        return;
      }
      setStep(2);
    } else if (step === 2) {
      if (!adminName.trim() && !contactPerson.trim()) {
        setErrorMessage('Please enter the Administrator Full Name.');
        return;
      }
      const targetAdminEmail = (adminEmail || contactEmail).trim();
      if (!targetAdminEmail) {
        setErrorMessage('Please enter the Administrator Email.');
        return;
      }
      const duplicateError = checkDuplicate();
      if (duplicateError) {
        setErrorMessage(duplicateError);
        return;
      }
      setStep(3);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const duplicateError = checkDuplicate();
    if (duplicateError) {
      setErrorMessage(duplicateError);
      setStep(1);
      return;
    }

    const selectedPlanObj = plans.find((p) => p.tier === selectedPlanTier) || plans[0];

    const result = await createOrganization({
      name: name.trim(),
      tradeName: tradeName.trim() || undefined,
      tinNumber: tinNumber.trim() || '00' + Math.floor(10000000 + Math.random() * 90000000),
      contactPerson: contactPerson.trim() || adminName.trim(),
      contactEmail: contactEmail.trim(),
      contactPhone: contactPhone.trim(),
      address: address.trim() || 'Bole Road, Addis Ababa',
      city: city.trim(),
      country: country.trim(),
      website: website.trim() || undefined,
      logoUrl: logoUrl.trim() || 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=120&auto=format&fit=crop&q=80',
      status,
      planTier: selectedPlanTier,
      planId: selectedPlanObj.planId,
      subscriptionId: '',
      primaryAdminUid: '',
      primaryAdminName: adminName.trim() || contactPerson.trim(),
      primaryAdminEmail: adminEmail.trim() || contactEmail.trim(),
      tempPassword: tempPassword.trim() || '123',
      billingCycle,
      buildingsCount: Math.max(1, buildingsCount),
      unitsPerBuilding: Math.max(1, unitsPerBuilding)
    });

    if (result.success) {
      onClose();
    } else if (result.error) {
      setErrorMessage(result.error);
    }
  };

  const selectedPlanObj = plans.find((p) => p.tier === selectedPlanTier) || plans[0];
  const maxBuildingsAllowed = selectedPlanObj.limits.maxBuildings;
  const totalUnitsCalculated = buildingsCount * unitsPerBuilding;

  const cyclePrice =
    billingCycle === 'monthly'
      ? selectedPlanObj.monthlyPriceETB
      : billingCycle === 'semi_annually'
      ? selectedPlanObj.sixMonthPriceETB || Math.round(selectedPlanObj.monthlyPriceETB * 6 * 0.95)
      : selectedPlanObj.annualPriceETB || Math.round(selectedPlanObj.monthlyPriceETB * 12 * 0.85);

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
                Dedicated workspace with accurate building registration, payment cycles &amp; unique profile check
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

        {/* Error Alert Callout */}
        {errorMessage && (
          <div className="mx-6 mt-4 p-3.5 rounded-2xl bg-[#FF3B30]/10 border border-[#FF3B30]/25 text-[#FF3B30] text-xs font-semibold flex items-center gap-2.5 animate-in fade-in">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Step Indicator */}
        <div className="px-6 pt-4 pb-2 flex items-center justify-between border-b border-black/[0.03] dark:border-white/5 bg-black/[0.01]">
          {[
            { num: 1, label: '1. Organization Info' },
            { num: 2, label: '2. Primary Admin' },
            { num: 3, label: '3. Buildings & Billing' }
          ].map((s) => (
            <div
              key={s.num}
              onClick={() => {
                if (s.num < step) setStep(s.num as any);
              }}
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
                    <label className="text-xs font-semibold text-[#1C1C1E] dark:text-white flex items-center justify-between">
                      <span>Organization Legal Name *</span>
                      <span className="text-[10px] text-[#8E8E93]">Must be unique</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Kaldas Property Management PLC"
                      value={name}
                      onChange={(e) => {
                        setName(e.target.value);
                        if (errorMessage) setErrorMessage(null);
                      }}
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
                      onChange={(e) => {
                        setTinNumber(e.target.value);
                        if (errorMessage) setErrorMessage(null);
                      }}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-black/[0.08] dark:border-white/10 bg-[#F2F2F7] dark:bg-[#2C2C2E] text-xs font-medium text-[#1C1C1E] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#007AFF]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-[#1C1C1E] dark:text-white">
                      Official Contact Email *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="contact@kaldasproperties.et"
                      value={contactEmail}
                      onChange={(e) => {
                        setContactEmail(e.target.value);
                        if (errorMessage) setErrorMessage(null);
                      }}
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
                    onChange={(e) => {
                      setAdminName(e.target.value);
                      if (errorMessage) setErrorMessage(null);
                    }}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-black/[0.08] dark:border-white/10 bg-[#F2F2F7] dark:bg-[#2C2C2E] text-xs font-medium text-[#1C1C1E] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#007AFF]"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-[#1C1C1E] dark:text-white flex items-center justify-between">
                      <span>Admin Login Email *</span>
                      <span className="text-[10px] text-[#8E8E93]">Unique login ID</span>
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="admin@kaldasproperties.et"
                      value={adminEmail}
                      onChange={(e) => {
                        setAdminEmail(e.target.value);
                        if (errorMessage) setErrorMessage(null);
                      }}
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

            {/* Step 3: Plan, Buildings Portfolio & Payment Billing Cycle */}
            {step === 3 && (
              <div className="space-y-5 animate-in fade-in duration-150">
                {/* Plan Selection */}
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-[#1C1C1E] dark:text-white block mb-2">
                    Select Platform Plan Tier
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {plans.map((plan) => (
                      <div
                        key={plan.planId}
                        onClick={() => {
                          setSelectedPlanTier(plan.tier);
                          if (buildingsCount > plan.limits.maxBuildings) {
                            setBuildingsCount(plan.limits.maxBuildings);
                          }
                        }}
                        className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
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
                        <div className="text-sm font-bold text-[#007AFF]">
                          {plan.monthlyPriceETB.toLocaleString()}{' '}
                          <span className="text-[10px] text-[#8E8E93]">ETB / mo</span>
                        </div>
                        <div className="text-[10px] text-[#8E8E93] mt-1.5 space-y-0.5">
                          <div>• Max {plan.limits.maxBuildings} Buildings</div>
                          <div>• Max {plan.limits.maxUnits} Units • {plan.limits.maxUsers} Users</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Billing Month / Payment Cycle Selection */}
                <div className="p-4 rounded-2xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200/60 dark:border-blue-900/40 space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold uppercase tracking-wider text-blue-900 dark:text-blue-300 flex items-center gap-1.5">
                      <Calendar className="w-4 h-4 text-[#007AFF]" />
                      Payment Billing Cycle / Month Selection
                    </label>
                    <span className="text-xs font-bold text-[#007AFF]">
                      {cyclePrice.toLocaleString()} ETB Total
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    {[
                      {
                        cycle: 'monthly' as SubscriptionBillingCycle,
                        label: 'Every Month',
                        subtext: 'Monthly settlement',
                        discount: null
                      },
                      {
                        cycle: 'semi_annually' as SubscriptionBillingCycle,
                        label: 'Every 6 Months',
                        subtext: 'Semi-annual cycle',
                        discount: 'Save 5%'
                      },
                      {
                        cycle: 'annually' as SubscriptionBillingCycle,
                        label: 'Every 12 Months',
                        subtext: 'Annual prepayment',
                        discount: 'Save 15%'
                      }
                    ].map((item) => (
                      <button
                        key={item.cycle}
                        type="button"
                        onClick={() => setBillingCycle(item.cycle)}
                        className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center ${
                          billingCycle === item.cycle
                            ? 'bg-white dark:bg-[#2C2C2E] border-[#007AFF] text-[#007AFF] shadow-sm font-bold ring-2 ring-[#007AFF]/20'
                            : 'bg-white/60 dark:bg-white/5 border-transparent text-[#1C1C1E] dark:text-white/80 hover:bg-white'
                        }`}
                      >
                        <span className="text-xs font-bold">{item.label}</span>
                        <span className="text-[10px] text-[#8E8E93] mt-0.5">{item.subtext}</span>
                        {item.discount && (
                          <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-green-100 text-green-700 mt-1">
                            {item.discount}
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Number of Buildings & Units Configuration */}
                <div className="p-4 rounded-2xl bg-[#F2F2F7] dark:bg-[#2C2C2E] border border-black/[0.04] dark:border-white/5 space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold uppercase tracking-wider text-[#1C1C1E] dark:text-white flex items-center gap-1.5">
                      <Layers className="w-4 h-4 text-[#FF9500]" />
                      Building Portfolio Registration
                    </label>
                    <span className="text-[11px] font-bold text-[#FF9500] px-2 py-0.5 rounded-full bg-amber-500/10">
                      Accurate Usage Status
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    {/* Number of Buildings */}
                    <div className="space-y-1">
                      <label className="font-semibold text-[#1C1C1E] dark:text-white">
                        Number of Buildings (Max: {maxBuildingsAllowed})
                      </label>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setBuildingsCount((prev) => Math.max(1, prev - 1))}
                          className="w-8 h-8 rounded-xl bg-white dark:bg-[#1C1C1E] border border-black/[0.08] font-bold text-sm hover:bg-black/5"
                        >
                          -
                        </button>
                        <input
                          type="number"
                          min={1}
                          max={maxBuildingsAllowed}
                          value={buildingsCount}
                          onChange={(e) => {
                            const val = parseInt(e.target.value) || 1;
                            setBuildingsCount(Math.min(maxBuildingsAllowed, Math.max(1, val)));
                          }}
                          className="w-full text-center py-1.5 rounded-xl bg-white dark:bg-[#1C1C1E] font-bold border border-black/[0.08] dark:border-white/10"
                        />
                        <button
                          type="button"
                          onClick={() => setBuildingsCount((prev) => Math.min(maxBuildingsAllowed, prev + 1))}
                          className="w-8 h-8 rounded-xl bg-white dark:bg-[#1C1C1E] border border-black/[0.08] font-bold text-sm hover:bg-black/5"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    {/* Units Per Building */}
                    <div className="space-y-1">
                      <label className="font-semibold text-[#1C1C1E] dark:text-white">
                        Units Per Building
                      </label>
                      <input
                        type="number"
                        min={2}
                        max={50}
                        value={unitsPerBuilding}
                        onChange={(e) => setUnitsPerBuilding(Math.max(2, parseInt(e.target.value) || 8))}
                        className="w-full px-3 py-1.5 rounded-xl bg-white dark:bg-[#1C1C1E] font-bold border border-black/[0.08] dark:border-white/10"
                      />
                    </div>
                  </div>

                  {/* Real-Time Portfolio Calculation Summary */}
                  <div className="p-2.5 rounded-xl bg-white dark:bg-[#1C1C1E] border border-black/[0.04] text-[11px] text-[#8E8E93] flex items-center justify-between">
                    <span>Portfolio Total:</span>
                    <span className="font-bold text-[#1C1C1E] dark:text-white">
                      {buildingsCount} {buildingsCount === 1 ? 'Building' : 'Buildings'} • {totalUnitsCalculated} Commercial Units Total
                    </span>
                  </div>
                </div>

                {/* Subscription Status Mode */}
                <div>
                  <label className="text-xs font-semibold text-[#1C1C1E] dark:text-white block mb-1.5">
                    Initial License Status
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
                      Evaluation Trial Mode
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
                onClick={() => {
                  setErrorMessage(null);
                  setStep((prev) => (prev - 1) as any);
                }}
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
                onClick={handleNextStep}
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
