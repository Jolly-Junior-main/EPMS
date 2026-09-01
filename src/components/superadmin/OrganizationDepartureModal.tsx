import React, { useState } from 'react';
import { Organization, OrganizationDepartureReason } from '../../types/superAdmin';
import { usePMS } from '../../context/PMSContext';
import {
  LogOut,
  Building2,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Key,
  DollarSign,
  Layers,
  X,
  ShieldAlert
} from 'lucide-react';

interface OrganizationDepartureModalProps {
  organization: Organization | null;
  isOpen: boolean;
  onClose: () => void;
}

export const OrganizationDepartureModal: React.FC<OrganizationDepartureModalProps> = ({
  organization,
  isOpen,
  onClose
}) => {
  const { departOrganization, units } = usePMS();

  const [reason, setReason] = useState<OrganizationDepartureReason>('lease_expired');
  const [notes, setNotes] = useState('');
  const [keysReturned, setKeysReturned] = useState(true);
  const [depositSettled, setDepositSettled] = useState(true);
  const [vacateUnits, setVacateUnits] = useState(true);
  const [revokeAccess, setRevokeAccess] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !organization) return null;

  const orgUnits = units.filter(
    (u) => u.organizationId === organization.organizationId || u.propertyId === `prop_${organization.organizationId}`
  );
  const occupiedUnits = orgUnits.filter((u) => u.status === 'occupied');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    departOrganization(organization.organizationId, {
      reason,
      notes: notes.trim() || 'Official building exit and handover recorded.',
      keysReturned,
      depositSettled,
      vacateUnits,
      revokeAccess
    });

    setIsSubmitting(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white dark:bg-[#1C1C1E] rounded-3xl max-w-xl w-full border border-black/[0.08] dark:border-white/10 shadow-2xl overflow-hidden my-8">
        {/* Header */}
        <div className="p-6 border-b border-black/[0.05] dark:border-white/10 flex items-center justify-between bg-gradient-to-r from-red-500/10 via-amber-500/5 to-transparent">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#FF3B30]/10 text-[#FF3B30] flex items-center justify-center font-bold">
              <LogOut className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-[#1C1C1E] dark:text-white flex items-center gap-2">
                <span>Building Departure & Handover</span>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-red-100 text-red-700">
                  Exit Workflow
                </span>
              </h2>
              <p className="text-xs text-[#8E8E93]">
                Officially record {organization.name} leaving totally from the building
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-black/5 dark:hover:bg-white/10 text-[#8E8E93] hover:text-[#1C1C1E] dark:hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Target Organization Info Banner */}
          <div className="p-4 rounded-2xl bg-black/[0.02] dark:bg-white/[0.02] border border-black/[0.05] dark:border-white/10 flex items-center justify-between text-xs">
            <div className="flex items-center gap-3">
              <img
                src={organization.logoUrl || 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=120&auto=format&fit=crop&q=80'}
                alt={organization.name}
                className="w-10 h-10 rounded-xl object-cover ring-1 ring-black/10"
              />
              <div>
                <h4 className="font-bold text-sm text-[#1C1C1E] dark:text-white">
                  {organization.name}
                </h4>
                <p className="text-[11px] text-[#8E8E93]">
                  Admin: {organization.primaryAdminName} ({organization.primaryAdminEmail})
                </p>
              </div>
            </div>

            <div className="text-right">
              <span className="font-bold text-[#1C1C1E] dark:text-white block">
                {occupiedUnits.length} Occupied Units
              </span>
              <span className="text-[11px] text-[#8E8E93]">
                {organization.address || 'Central Sub-City'}
              </span>
            </div>
          </div>

          {/* Reason for Departure */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#1C1C1E] dark:text-white mb-2">
              Departure Reason
            </label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value as OrganizationDepartureReason)}
              className="w-full bg-[#F2F2F7] dark:bg-[#2C2C2E] rounded-2xl px-4 py-3 text-xs font-medium text-[#1C1C1E] dark:text-white border border-transparent focus:border-[#007AFF] outline-none cursor-pointer"
            >
              <option value="lease_expired">Lease Term Expired & Non-Renewed</option>
              <option value="relocation">Relocated to Another Building / City</option>
              <option value="early_termination">Early Lease Termination by Mutual Agreement</option>
              <option value="eviction">Eviction / Default on Rent Obligations</option>
              <option value="business_closure">Business Dissolution / Liquidation</option>
              <option value="other">Other Operational Departure</option>
            </select>
          </div>

          {/* Critical Handover Checklist Options */}
          <div className="space-y-3 pt-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-[#1C1C1E] dark:text-white">
              Building Handover & Clearance Checklist
            </label>

            <div className="space-y-2 text-xs">
              {/* Vacate Units */}
              <label className="flex items-start gap-3 p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={vacateUnits}
                  onChange={(e) => setVacateUnits(e.target.checked)}
                  className="w-4 h-4 rounded text-[#FF9500] mt-0.5"
                />
                <div>
                  <span className="font-bold text-[#1C1C1E] dark:text-white block flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-amber-600" />
                    Vacate all assigned commercial units
                  </span>
                  <span className="text-[11px] text-[#8E8E93]">
                    Automatically updates all {occupiedUnits.length} occupied units to "Vacant" so new tenants can lease them.
                  </span>
                </div>
              </label>

              {/* Revoke Login Access */}
              <label className="flex items-start gap-3 p-3 rounded-2xl bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/40 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={revokeAccess}
                  onChange={(e) => setRevokeAccess(e.target.checked)}
                  className="w-4 h-4 rounded text-[#FF3B30] mt-0.5"
                />
                <div>
                  <span className="font-bold text-[#1C1C1E] dark:text-white block flex items-center gap-1.5">
                    <ShieldAlert className="w-3.5 h-3.5 text-red-600" />
                    Immediately revoke client portal login credentials
                  </span>
                  <span className="text-[11px] text-[#8E8E93]">
                    Locks out former admin ({organization.primaryAdminEmail}) and manager accounts from the EPMS client portal.
                  </span>
                </div>
              </label>

              {/* Keys Returned */}
              <label className="flex items-center gap-3 p-3 rounded-2xl bg-[#F2F2F7] dark:bg-[#2C2C2E] border border-black/[0.04] dark:border-white/5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={keysReturned}
                  onChange={(e) => setKeysReturned(e.target.checked)}
                  className="w-4 h-4 rounded text-[#007AFF]"
                />
                <span className="font-medium text-[#1C1C1E] dark:text-white flex items-center gap-1.5">
                  <Key className="w-3.5 h-3.5 text-[#007AFF]" />
                  Facility keys returned and physical unit inspection verified
                </span>
              </label>

              {/* Deposit Settled */}
              <label className="flex items-center gap-3 p-3 rounded-2xl bg-[#F2F2F7] dark:bg-[#2C2C2E] border border-black/[0.04] dark:border-white/5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={depositSettled}
                  onChange={(e) => setDepositSettled(e.target.checked)}
                  className="w-4 h-4 rounded text-[#34C759]"
                />
                <span className="font-medium text-[#1C1C1E] dark:text-white flex items-center gap-1.5">
                  <DollarSign className="w-3.5 h-3.5 text-[#34C759]" />
                  Security deposit and final utility bill reconciliation settled
                </span>
              </label>
            </div>
          </div>

          {/* Departure Notes */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#1C1C1E] dark:text-white mb-1.5">
              Exit Inspection & Handover Notes
            </label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g., Final electricity and water meter readings verified. Space cleaned and keys handed to building management."
              className="w-full bg-[#F2F2F7] dark:bg-[#2C2C2E] rounded-2xl p-3 text-xs text-[#1C1C1E] dark:text-white border border-transparent focus:border-[#007AFF] outline-none resize-none"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-black/[0.05] dark:border-white/10">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-black/5 dark:bg-white/10 hover:bg-black/10 text-xs font-bold text-[#8E8E93] hover:text-[#1C1C1E] dark:hover:text-white transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 rounded-xl bg-[#FF3B30] hover:bg-[#D70015] text-white text-xs font-bold flex items-center gap-2 shadow-md shadow-red-500/25 active:scale-95 transition-all cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>Confirm Building Exit & Handover</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
