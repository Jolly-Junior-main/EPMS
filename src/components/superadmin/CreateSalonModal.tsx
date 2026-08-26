import React, { useState } from 'react';
import { usePMS } from '../../context/PMSContext';
import {
  Sparkles,
  Scissors,
  CheckCircle2,
  Building2,
  Phone,
  User,
  DollarSign,
  Layers,
  X
} from 'lucide-react';

interface CreateSalonModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateSalonModal: React.FC<CreateSalonModalProps> = ({ isOpen, onClose }) => {
  const { organizations, createSalonForClient } = usePMS();

  const [selectedOrgId, setSelectedOrgId] = useState(organizations[0]?.organizationId || '');
  const [salonName, setSalonName] = useState('');
  const [salonCategory, setSalonCategory] = useState<'hair' | 'nails' | 'spa' | 'barber' | 'general'>('hair');
  const [unitNumber, setUnitNumber] = useState('S-101');
  const [monthlyRentETB, setMonthlyRentETB] = useState(45000);
  const [managerName, setManagerName] = useState('');
  const [managerPhone, setManagerPhone] = useState('+251 91 ');
  const [managerEmail, setManagerEmail] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!salonName.trim() || !managerName.trim()) return;

    createSalonForClient(selectedOrgId || organizations[0]?.organizationId, {
      salonName: `${salonName} (${salonCategory.toUpperCase()})`,
      unitNumber,
      monthlyRentETB: Number(monthlyRentETB),
      managerName,
      managerPhone,
      managerEmail: managerEmail || `${salonName.toLowerCase().replace(/[^a-z0-9]/g, '')}@epms.et`
    });

    setSalonName('');
    setManagerName('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white dark:bg-[#1C1C1E] rounded-3xl max-w-lg w-full border border-black/[0.08] dark:border-white/10 shadow-2xl overflow-hidden my-8">
        {/* Header */}
        <div className="p-6 border-b border-black/[0.05] dark:border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#AF52DE]/10 text-[#AF52DE] flex items-center justify-center">
              <Scissors className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-[#1C1C1E] dark:text-white">
                Provision New Salon for Client
              </h2>
              <p className="text-xs text-[#8E8E93]">
                Create a dedicated beauty salon unit, lease record, and initial invoice
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
              Client Property / Organization
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

          {/* Salon Name & Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-bold uppercase tracking-wider text-[#8E8E93] block mb-1.5">
                Salon Business Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Kaldas Beauty & Hair Studio"
                value={salonName}
                onChange={(e) => setSalonName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-black/[0.08] dark:border-white/10 bg-[#F2F2F7] dark:bg-[#2C2C2E] font-medium text-[#1C1C1E] dark:text-white outline-none"
              />
            </div>

            <div>
              <label className="font-bold uppercase tracking-wider text-[#8E8E93] block mb-1.5">
                Salon Type
              </label>
              <select
                value={salonCategory}
                onChange={(e) => setSalonCategory(e.target.value as any)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-black/[0.08] dark:border-white/10 bg-[#F2F2F7] dark:bg-[#2C2C2E] font-medium text-[#1C1C1E] dark:text-white outline-none"
              >
                <option value="hair">💇‍♀️ Hair & Braiding Salon</option>
                <option value="nails">💅 Nail Spa & Esthetics</option>
                <option value="barber">💈 Executive Barber Shop</option>
                <option value="spa">🧖‍♀️ Full Day Spa & Wellness</option>
                <option value="general">✨ General Beauty Studio</option>
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
                placeholder="e.g. S-204"
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

          {/* Salon Owner / Stylist Contact */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-bold uppercase tracking-wider text-[#8E8E93] block mb-1.5">
                Lead Stylist / Manager Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Helen Haile"
                value={managerName}
                onChange={(e) => setManagerName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-black/[0.08] dark:border-white/10 bg-[#F2F2F7] dark:bg-[#2C2C2E] font-medium text-[#1C1C1E] dark:text-white outline-none"
              />
            </div>

            <div>
              <label className="font-bold uppercase tracking-wider text-[#8E8E93] block mb-1.5">
                Manager Mobile Phone *
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
              className="px-5 py-2 rounded-2xl bg-[#AF52DE] hover:bg-[#9B30FF] text-white font-bold flex items-center gap-1.5 shadow-sm active:scale-95 transition-all"
            >
              <Scissors className="w-3.5 h-3.5" />
              Provision Salon Space
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
