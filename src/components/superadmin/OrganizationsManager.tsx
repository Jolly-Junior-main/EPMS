import React, { useState } from 'react';
import { usePMS } from '../../context/PMSContext';
import { Organization, OrganizationStatus, PlanTier } from '../../types/superAdmin';
import {
  Building2,
  Search,
  Plus,
  Download,
  ExternalLink,
  MoreVertical,
  ShieldAlert,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Users,
  Layers,
  HardDrive,
  CreditCard,
  Edit,
  Eye,
  Trash2,
  Filter,
  KeyRound,
  Lock,
  Clock,
  Store
} from 'lucide-react';
import { CreateCommercialUnitModal } from './CreateCommercialUnitModal';

interface OrganizationsManagerProps {
  onOpenCreateModal: () => void;
  onSelectOrgForDetails: (orgId: string) => void;
}

export const OrganizationsManager: React.FC<OrganizationsManagerProps> = ({
  onOpenCreateModal,
  onSelectOrgForDetails
}) => {
  const {
    organizations,
    plans,
    suspendOrganization,
    activateOrganization,
    deleteOrganization,
    startImpersonation,
    resetClientPassword,
    t
  } = usePMS();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | OrganizationStatus>('all');
  const [planFilter, setPlanFilter] = useState<'all' | PlanTier>('all');
  const [activeMenuOrgId, setActiveMenuOrgId] = useState<string | null>(null);
  const [resetModalOrg, setResetModalOrg] = useState<Organization | null>(null);
  const [newPasswordInput, setNewPasswordInput] = useState('123');
  const [isCreateSalonOpen, setIsCreateSalonOpen] = useState(false);

  // Filtered & Searched Organizations
  const filteredOrgs = organizations.filter((org) => {
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      org.name.toLowerCase().includes(term) ||
      org.tinNumber.includes(term) ||
      org.contactEmail.toLowerCase().includes(term) ||
      org.contactPerson.toLowerCase().includes(term) ||
      org.organizationId.toLowerCase().includes(term);

    if (!matchesSearch) return false;
    if (statusFilter !== 'all' && org.status !== statusFilter) return false;
    if (planFilter !== 'all' && org.planTier !== planFilter) return false;

    return true;
  });

  // Export to CSV
  const handleExportCSV = () => {
    const headers = ['Organization ID', 'Name', 'TIN', 'Contact Person', 'Email', 'Phone', 'Plan', 'Status', 'Buildings', 'Units', 'Users', 'Created Date'];
    const rows = filteredOrgs.map((o) => [
      o.organizationId,
      `"${o.name}"`,
      o.tinNumber,
      `"${o.contactPerson}"`,
      o.contactEmail,
      o.contactPhone,
      o.planTier,
      o.status,
      o.usage.buildingsCount,
      o.usage.unitsCount,
      o.usage.usersCount,
      o.createdAt
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `epms_organizations_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Helper for Usage Percent and Color
  const getUsageMetrics = (org: Organization) => {
    const plan = plans.find((p) => p.tier === org.planTier) || plans[0];
    const maxUnits = plan.limits.maxUnits;
    const currentUnits = org.usage.unitsCount || 0;
    const unitPercent = Math.round((currentUnits / maxUnits) * 100);

    let badgeColor = 'text-[#34C759] bg-[#34C759]/10';
    if (unitPercent >= 95) badgeColor = 'text-[#FF3B30] bg-[#FF3B30]/10';
    else if (unitPercent >= 85) badgeColor = 'text-[#FF9500] bg-[#FF9500]/10';
    else if (unitPercent >= 70) badgeColor = 'text-[#FFCC00] bg-[#FFCC00]/10';

    return { unitPercent, maxUnits, badgeColor };
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header Banner */}
      <div className="bg-white dark:bg-[#1C1C1E] rounded-3xl p-6 md:p-8 border border-black/[0.04] dark:border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2.5 py-0.5 text-[11px] font-bold rounded-full bg-[#007AFF]/10 text-[#007AFF] font-mono">
              TENANT MANAGEMENT &amp; RBAC SCOPES
            </span>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-[#1C1C1E] dark:text-white">
            {t('org_title', 'Client Organizations Directory')}
          </h2>
          <p className="text-xs md:text-sm text-[#8E8E93] mt-0.5">
            {t('org_subtitle', 'Centrally manage all onboarded real estate firms, lease scopes, and usage tiers.')}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setIsCreateSalonOpen(true)}
            className="px-3.5 py-2.5 bg-[#007AFF]/10 hover:bg-[#007AFF] hover:text-white text-[#007AFF] rounded-2xl text-xs font-bold transition-all flex items-center gap-1.5 active:scale-95 cursor-pointer shadow-sm border border-[#007AFF]/20"
            title="Provision a new Commercial Shop / Office unit for a client"
          >
            <Store className="w-4 h-4" />
            + Provision Commercial Space
          </button>
          <button
            onClick={handleExportCSV}
            className="px-3.5 py-2.5 bg-black/5 dark:bg-white/5 hover:bg-black/10 text-[#1C1C1E] dark:text-white rounded-2xl text-xs font-semibold transition-all flex items-center gap-2 active:scale-95 cursor-pointer"
          >
            <Download className="w-4 h-4 text-[#8E8E93]" />
            Export CSV
          </button>
          <button
            onClick={onOpenCreateModal}
            className="px-4 py-2.5 bg-[#007AFF] hover:bg-[#0062CC] text-white rounded-2xl text-xs font-semibold transition-all shadow-[0_4px_12px_rgba(0,122,255,0.3)] flex items-center gap-2 active:scale-95 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            {t('org_create_btn', 'Onboard Client')}
          </button>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="bg-white dark:bg-[#1C1C1E] rounded-2xl p-3.5 border border-black/[0.04] dark:border-white/10 shadow-[0_2px_12px_rgba(0,0,0,0.03)] flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-2 w-full md:w-96 relative">
          <Search className="w-4 h-4 text-[#8E8E93] absolute left-3.5" />
          <input
            type="text"
            placeholder={t('org_search_placeholder', 'Search by organization name, TIN, or admin email...')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-black/[0.06] dark:border-white/10 bg-[#F2F2F7] dark:bg-[#2C2C2E] text-[#1C1C1E] dark:text-white focus:outline-none focus:bg-white dark:focus:bg-[#1C1C1E] focus:ring-2 focus:ring-[#007AFF] font-medium"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Status Filter */}
          <div className="flex items-center gap-1 bg-[#767680]/12 dark:bg-white/5 p-1 rounded-xl">
            {(['all', 'active', 'trial', 'suspended'] as const).map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all cursor-pointer ${
                  statusFilter === status
                    ? 'bg-white dark:bg-[#2C2C2E] text-[#1C1C1E] dark:text-white shadow-sm'
                    : 'text-[#8E8E93] hover:text-[#1C1C1E] dark:hover:text-white'
                }`}
              >
                {status} ({status === 'all' ? organizations.length : organizations.filter((o) => o.status === status).length})
              </button>
            ))}
          </div>

          {/* Plan Filter */}
          <select
            value={planFilter}
            onChange={(e) => setPlanFilter(e.target.value as any)}
            className="px-3 py-2 text-xs rounded-xl border border-black/[0.06] dark:border-white/10 bg-[#F2F2F7] dark:bg-[#2C2C2E] text-[#1C1C1E] dark:text-white font-semibold focus:outline-none cursor-pointer"
          >
            <option value="all">All Plans</option>
            <option value="starter">Starter</option>
            <option value="professional">Professional</option>
            <option value="business">Business</option>
            <option value="enterprise">Enterprise</option>
          </select>
        </div>
      </div>

      {/* Organizations Table Card */}
      <div className="bg-white dark:bg-[#1C1C1E] rounded-3xl border border-black/[0.04] dark:border-white/10 shadow-[0_4px_20px_rgb(0,0,0,0.03)] overflow-hidden">
        {filteredOrgs.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-black/5 dark:bg-white/5 text-[#8E8E93] flex items-center justify-center mx-auto">
              <Building2 className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-[#1C1C1E] dark:text-white">
              No Organizations Found
            </h3>
            <p className="text-xs text-[#8E8E93] max-w-sm mx-auto">
              No client organizations match your current search query or filter parameters.
            </p>
            <button
              onClick={onOpenCreateModal}
              className="mt-2 px-4 py-2 bg-[#007AFF] hover:bg-[#0062CC] text-white rounded-xl text-xs font-bold transition-all inline-flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              Onboard Organization Now
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-black/[0.05] dark:border-white/10 bg-black/[0.01] dark:bg-white/[0.01] text-[#8E8E93]">
                  <th className="py-3.5 px-4 font-semibold uppercase tracking-wider">Organization Entity</th>
                  <th className="py-3.5 px-4 font-semibold uppercase tracking-wider">Contact &amp; Admin</th>
                  <th className="py-3.5 px-4 font-semibold uppercase tracking-wider">Plan Tier</th>
                  <th className="py-3.5 px-4 font-semibold uppercase tracking-wider">Usage &amp; Quota</th>
                  <th className="py-3.5 px-4 font-semibold uppercase tracking-wider">Status</th>
                  <th className="py-3.5 px-4 font-semibold uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/[0.03] dark:divide-white/[0.05]">
                {filteredOrgs.map((org) => {
                  const { unitPercent, maxUnits, badgeColor } = getUsageMetrics(org);

                  return (
                    <tr
                      key={org.organizationId}
                      className="hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-colors"
                    >
                      {/* Organization Entity */}
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={org.logoUrl || 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=120&auto=format&fit=crop&q=80'}
                            alt={org.name}
                            className="w-10 h-10 rounded-2xl object-cover ring-1 ring-black/10 shrink-0"
                          />
                          <div>
                            <div
                              onClick={() => onSelectOrgForDetails(org.organizationId)}
                              className="font-bold text-[#1C1C1E] dark:text-white hover:text-[#007AFF] cursor-pointer text-sm"
                            >
                              {org.name}
                            </div>
                            <div className="text-[11px] text-[#8E8E93] flex items-center gap-2 mt-0.5">
                              <span className="font-mono">{org.organizationId}</span>
                              <span>•</span>
                              <span>TIN: {org.tinNumber}</span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Contact & Admin */}
                      <td className="py-4 px-4">
                        <div className="font-semibold text-[#1C1C1E] dark:text-white">
                          {org.contactPerson}
                        </div>
                        <div className="text-[11px] text-[#8E8E93]">
                          {org.contactEmail}
                        </div>
                        <div className="text-[10px] text-[#8E8E93]">
                          {org.contactPhone}
                        </div>
                      </td>

                      {/* Plan Tier */}
                      <td className="py-4 px-4">
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#007AFF]/10 text-[#007AFF] inline-flex items-center gap-1">
                          <CreditCard className="w-3 h-3" />
                          {org.planTier}
                        </span>
                        <div className="text-[10px] text-[#8E8E93] mt-1 font-medium">
                          Created {new Date(org.createdAt).toLocaleDateString()}
                        </div>
                      </td>

                      {/* Usage & Quota Gauge */}
                      <td className="py-4 px-4">
                        <div className="space-y-1.5 w-44">
                          <div className="flex items-center justify-between text-[11px]">
                            <span className="font-medium text-[#1C1C1E] dark:text-white">
                              {org.usage.unitsCount} / {maxUnits} Units
                            </span>
                            <span className={`font-bold px-1.5 py-0.2 rounded ${badgeColor}`}>
                              {unitPercent}%
                            </span>
                          </div>
                          <div className="w-full bg-black/5 dark:bg-white/10 h-1.5 rounded-full overflow-hidden">
                            <div
                              style={{ width: `${Math.min(unitPercent, 100)}%` }}
                              className={`h-full rounded-full ${
                                unitPercent >= 95
                                  ? 'bg-[#FF3B30]'
                                  : unitPercent >= 85
                                  ? 'bg-[#FF9500]'
                                  : 'bg-[#34C759]'
                              }`}
                            />
                          </div>
                          <div className="text-[10px] text-[#8E8E93] flex items-center justify-between">
                            <span>{org.usage.buildingsCount} Buildings</span>
                            <span>{org.usage.usersCount} Users</span>
                          </div>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-4 px-4">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase inline-flex items-center gap-1 ${
                            org.status === 'active'
                              ? 'bg-[#34C759]/10 text-[#34C759]'
                              : org.status === 'trial'
                              ? 'bg-[#007AFF]/10 text-[#007AFF]'
                              : 'bg-[#FF3B30]/10 text-[#FF3B30]'
                          }`}
                        >
                          {org.status === 'active' && <CheckCircle2 className="w-3 h-3" />}
                          {org.status === 'trial' && <Clock className="w-3 h-3" />}
                          {org.status === 'suspended' && <XCircle className="w-3 h-3" />}
                          {org.status}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Impersonation Button */}
                          <button
                            onClick={() => startImpersonation(org.organizationId)}
                            className="px-3 py-1.5 rounded-xl bg-[#007AFF]/10 hover:bg-[#007AFF] hover:text-white text-[#007AFF] text-[11px] font-bold transition-all flex items-center gap-1 cursor-pointer active:scale-95 shadow-sm"
                            title="Enter client environment as Super Admin"
                          >
                            <ExternalLink className="w-3 h-3" />
                            Open
                          </button>

                          {/* Reset Password Button */}
                          <button
                            onClick={() => {
                              setResetModalOrg(org);
                              setNewPasswordInput('123');
                            }}
                            className="px-2.5 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 text-[11px] font-bold transition-all flex items-center gap-1 cursor-pointer active:scale-95"
                            title="Reset Client Admin / Manager Password"
                          >
                            <KeyRound className="w-3 h-3" />
                            Reset Pass
                          </button>

                          {/* Profile Button */}
                          <button
                            onClick={() => onSelectOrgForDetails(org.organizationId)}
                            className="p-1.5 rounded-xl bg-black/5 dark:bg-white/5 hover:bg-black/10 text-[#1C1C1E] dark:text-white transition-all cursor-pointer"
                            title="View full organization profile"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          {/* Suspend / Activate Toggle */}
                          {org.status === 'suspended' ? (
                            <button
                              onClick={() => activateOrganization(org.organizationId)}
                              className="p-1.5 rounded-xl hover:bg-[#34C759]/10 text-[#34C759] transition-all cursor-pointer"
                              title="Reactivate Organization"
                            >
                              <CheckCircle2 className="w-4 h-4" />
                            </button>
                          ) : (
                            <button
                              onClick={() => suspendOrganization(org.organizationId)}
                              className="p-1.5 rounded-xl hover:bg-[#FF3B30]/10 text-[#FF3B30] transition-all cursor-pointer"
                              title="Suspend Organization"
                            >
                              <ShieldAlert className="w-4 h-4" />
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
        )}
      </div>

      {/* Reset Password Modal */}
      {resetModalOrg && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-black/[0.08] space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-black/[0.06]">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-amber-500/10 text-amber-600">
                  <KeyRound className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-[#1C1C1E]">Reset Client Password</h3>
                  <p className="text-xs text-[#8E8E93]">{resetModalOrg.name}</p>
                </div>
              </div>
              <button
                onClick={() => setResetModalOrg(null)}
                className="text-[#8E8E93] hover:text-[#1C1C1E] text-xs font-bold"
              >
                ✕
              </button>
            </div>

            <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200/60 text-xs text-amber-900 space-y-1">
              <p className="font-bold">Target Account:</p>
              <p className="font-medium">Administrator: <strong>{resetModalOrg.primaryAdminName}</strong> ({resetModalOrg.primaryAdminEmail})</p>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#1C1C1E] mb-1.5">
                New Temporary Password
              </label>
              <input
                type="text"
                value={newPasswordInput}
                onChange={(e) => setNewPasswordInput(e.target.value)}
                placeholder="123"
                className="w-full bg-[#F2F2F7] rounded-2xl px-4 py-2.5 text-sm font-mono font-bold text-[#1C1C1E] border border-transparent focus:bg-white focus:border-[#007AFF] outline-none"
              />
              <p className="text-[11px] text-[#8E8E93] mt-1">Default temporary password for Ethiopian property managers is standard <strong>123</strong>.</p>
            </div>

            <div className="pt-3 flex justify-end gap-2 border-t border-black/[0.06]">
              <button
                type="button"
                onClick={() => setResetModalOrg(null)}
                className="px-4 py-2 rounded-2xl bg-[#F2F2F7] text-[#1C1C1E] text-xs font-bold hover:bg-[#E5E5EA]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  resetClientPassword(resetModalOrg.organizationId, resetModalOrg.primaryAdminUid, newPasswordInput);
                  setResetModalOrg(null);
                }}
                className="px-5 py-2 rounded-2xl bg-[#007AFF] hover:bg-[#0062CC] text-white text-xs font-bold flex items-center gap-1.5 shadow-sm active:scale-95"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                Confirm Reset
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Commercial Unit for Client Modal */}
      <CreateCommercialUnitModal
        isOpen={isCreateSalonOpen}
        onClose={() => setIsCreateSalonOpen(false)}
      />
    </div>
  );
};
