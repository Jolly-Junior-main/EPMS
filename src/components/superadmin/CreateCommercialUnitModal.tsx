import React, { useState } from 'react';
import { usePMS } from '../../context/PMSContext';
import {
  Sparkles,
  Building2,
  Phone,
  User,
  DollarSign,
  Layers,
  X,
  Store,
  Briefcase
} from 'lucide-react';

interface CreateCommercialUnitModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateCommercialUnitModal: React.FC<CreateCommercialUnitModalProps> = ({ isOpen, onClose }) => {
  const { organizations, createCommercialUnitForClient } = usePMS();

  const [selectedOrgId, setSelectedOrgId] = useState(organizations[0]?.organizationId || '');
  const [businessName, setBusinessName] = useState('');
  const [spaceType, setSpaceType] = useState<'retail' | 'office' | 'restaurant' | 'clinic' | 'general'>('retail');
  const [unitNumber, setUnitNumber] = useState('U-101');
  const [monthlyRentETB, setMonthlyRentETB] = useState(55000);
  const [managerName, setManagerName] = useState('');
  const [managerPhone, setManagerPhone] = useState('+251 91 ');
  const [managerEmail, setManagerEmail] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!businessName.trim() || !managerName.trim()) return;

    createCommercialUnitForClient(selectedOrgId || organizations[0]?.organizationId, {
      businessName: `${businessName} (${spaceType.toUpperCase()})`,
      unitNumber,
      monthlyRentETB: Number(monthlyRentETB),
      managerName,
      managerPhone,
      managerEmail: managerEmail || `${businessName.toLowerCase().replace(/[^a-z0-9]/g, '')}@epms.et`
    });

    setBusinessName('');
    setManagerName('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white dark:bg-[#1C1C1E] rounded-3xl max-w-lg w-full border border-black/[0.08] dark:border-white/10 shadow-2xl overflow-hidden my-8">
        {/* Header */}
        <div className="p-6 border-b border-black/[0.05] dark:border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#007AFF]/10 text-[#007AFF] flex items-center justify-center">
              <Store className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-[#1C1C1E] dark:text-white">
                Provision New Commercial Space for Client
              </h2>
              <p className="text-xs text-[#8E8E93]">
                Add commercial shop, office, or retail lease into client property
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-black/5 dark:hover:bg-white/10 text-[#8E8E93]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          {/* Target Client Organization */}
          <div>
            <label className="font-bold uppercase tracking-wider text-[#8E8E93] block mb-1.5">
              Target Property / Client Organization
            </label>
            <select
              value={selectedOrgId}
              onChange={(e) => setSelectedOrgId(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-black/[0.08] dark:border-white/10 bg-[#F2F2F7] dark:bg-[#2C2C2E] font-semibold text-[#1C1C1E] dark:text-white outline-none"
            >
              {organizations.map((org) => (
                <option key={org.organizationId} value={org.organizationId}>
                  {org.name} ({org.planTier.toUpperCase()} Plan)
                </option>
              ))}
            </select>
          </div>

          {/* Business Name & Space Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-bold uppercase tracking-wider text-[#8E8E93] block mb-1.5">
                Business Trade Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Abyssinia Pharmacy PLC"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-black/[0.08] dark:border-white/10 bg-[#F2F2F7] dark:bg-[#2C2C2E] font-medium text-[#1C1C1E] dark:text-white outline-none"
              />
            </div>

            <div>
              <label className="font-bold uppercase tracking-wider text-[#8E8E93] block mb-1.5">
                Commercial Space Type
              </label>
              <select
                value={spaceType}
                onChange={(e) => setSpaceType(e.target.value as any)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-black/[0.08] dark:border-white/10 bg-[#F2F2F7] dark:bg-[#2C2C2E] font-medium text-[#1C1C1E] dark:text-white outline-none"
              >
                <option value="retail">🛍️ Retail & Commercial Shop</option>
                <option value="office">💼 Corporate / Office Suite</option>
                <option value="restaurant">☕ Cafe & Restaurant</option>
                <option value="clinic">🏥 Medical Clinic & Pharmacy</option>
                <option value="general">🏢 General Commercial Space</option>
              </select>
            </div>
          </div>

          {/* Unit Number & Monthly Rent */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-bold uppercase tracking-wider text-[#8E8E93] block mb-1.5">
                Commercial Unit Code
              </label>
              <input
                type="text"
                required
                placeholder="e.g. B-104"
                value={unitNumber}
                onChange={(e) => setUnitNumber(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-black/[0.08] dark:border-white/10 bg-[#F2F2F7] dark:bg-[#2C2C2E] font-medium text-[#1C1C1E] dark:text-white outline-none"
              />
            </div>

            <div>
              <label className="font-bold uppercase tracking-wider text-[#8E8E93] block mb-1.5">
                Monthly Rent (ETB)
              </label>
              <input
                type="number"
                required
                value={monthlyRentETB}
                onChange={(e) => setMonthlyRentETB(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-black/[0.08] dark:border-white/10 bg-[#F2F2F7] dark:bg-[#2C2C2E] font-bold text-[#007AFF] outline-none"
              />
            </div>
          </div>

          {/* Tenant Contact */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-bold uppercase tracking-wider text-[#8E8E93] block mb-1.5">
                Authorized Tenant Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Yohannes Girma"
                value={managerName}
                onChange={(e) => setManagerName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-black/[0.08] dark:border-white/10 bg-[#F2F2F7] dark:bg-[#2C2C2E] font-medium text-[#1C1C1E] dark:text-white outline-none"
              />
            </div>

            <div>
              <label className="font-bold uppercase tracking-wider text-[#8E8E93] block mb-1.5">
                Tenant Mobile Phone *
              </label>
              <input
                type="text"
                required
                placeholder="+251 91 123 4567"
                value={managerPhone}
                onChange={(e) => setManagerPhone(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-black/[0.08] dark:border-white/10 bg-[#F2F2F7] dark:bg-[#2C2C2E] font-medium text-[#1C1C1E] dark:text-white outline-none"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-3 flex justify-end gap-2 border-t border-black/[0.06] dark:border-white/10">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-2xl bg-[#F2F2F7] dark:bg-[#2C2C2E] text-[#1C1C1E] dark:text-white font-bold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-2xl bg-[#007AFF] hover:bg-[#0062CC] text-white font-bold flex items-center gap-1.5 shadow-sm active:scale-95 transition-all"
            >
              <Store className="w-3.5 h-3.5" />
              Provision Commercial Unit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
