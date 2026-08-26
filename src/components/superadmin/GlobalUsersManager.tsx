import React, { useState } from 'react';
import { usePMS } from '../../context/PMSContext';
import { UserRole } from '../../types/pms';
import {
  Users,
  Search,
  ShieldCheck,
  Building2,
  Mail,
  Phone,
  Filter,
  CheckCircle2,
  ExternalLink
} from 'lucide-react';

export const GlobalUsersManager: React.FC = () => {
  const { organizations, tenants, startImpersonation, t } = usePMS();

  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | UserRole>('all');
  const [orgFilter, setOrgFilter] = useState<string>('all');

  // Synthesize users from organizations + tenants + superadmin
  const allUsers = [
    {
      uid: 'usr_super_01',
      name: 'Super Administrator',
      email: 'superadmin@epms.cloud.et',
      role: 'super_admin' as UserRole,
      organizationId: 'all',
      organizationName: 'EPMS Platform Control Plane',
      phone: '+251 91 100 0000',
      status: 'active'
    },
    ...organizations.map((org) => ({
      uid: org.primaryAdminUid,
      name: org.primaryAdminName,
      email: org.primaryAdminEmail,
      role: 'owner' as UserRole,
      organizationId: org.organizationId,
      organizationName: org.name,
      phone: org.contactPhone,
      status: org.status
    })),
    ...tenants.map((ten) => ({
      uid: ten.tenantId,
      name: ten.legalName,
      email: ten.email,
      role: 'tenant' as UserRole,
      organizationId: ten.organizationId || 'org_bole_plaza',
      organizationName: 'Bole Medhanialem Commercial Center',
      phone: ten.phone,
      status: ten.status === 'active' ? 'active' : 'suspended'
    }))
  ];

  const filteredUsers = allUsers.filter((u) => {
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      u.name.toLowerCase().includes(term) ||
      u.email.toLowerCase().includes(term) ||
      u.organizationName.toLowerCase().includes(term);

    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    const matchesOrg = orgFilter === 'all' || u.organizationId === orgFilter;

    return matchesSearch && matchesRole && matchesOrg;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header Banner */}
      <div className="bg-white dark:bg-[#1C1C1E] rounded-3xl p-6 md:p-8 border border-black/[0.04] dark:border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2.5 py-0.5 text-[11px] font-bold rounded-full bg-[#007AFF]/10 text-[#007AFF] font-mono">
              PLATFORM-WIDE IDENTITY &amp; ACCESS DIRECTORY
            </span>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-[#1C1C1E] dark:text-white">
            {t('global_users_title', 'Global Users Directory')}
          </h2>
          <p className="text-xs md:text-sm text-[#8E8E93] mt-0.5">
            {t('global_users_subtitle', 'Audit all client administrators, property managers, building owners, and tenants.')}
          </p>
        </div>

        <div className="text-right">
          <div className="text-2xl font-bold text-[#1C1C1E] dark:text-white">
            {allUsers.length}
          </div>
          <div className="text-[10px] text-[#8E8E93] uppercase font-bold">Total Platform Identities</div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-white dark:bg-[#1C1C1E] rounded-2xl p-3.5 border border-black/[0.04] dark:border-white/10 shadow-[0_2px_12px_rgba(0,0,0,0.03)] flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-2 w-full md:w-80 relative">
          <Search className="w-4 h-4 text-[#8E8E93] absolute left-3.5" />
          <input
            type="text"
            placeholder="Search users by name, email, organization..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-black/[0.06] dark:border-white/10 bg-[#F2F2F7] dark:bg-[#2C2C2E] text-[#1C1C1E] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#007AFF]"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Role Filter */}
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value as any)}
            className="px-3 py-2 text-xs rounded-xl border border-black/[0.06] dark:border-white/10 bg-[#F2F2F7] dark:bg-[#2C2C2E] text-[#1C1C1E] dark:text-white font-semibold focus:outline-none cursor-pointer"
          >
            <option value="all">All Roles</option>
            <option value="super_admin">Super Admin</option>
            <option value="owner">Owner / Executive</option>
            <option value="manager">Property Manager</option>
            <option value="admin">Administrator</option>
            <option value="tenant">Commercial Tenant</option>
          </select>

          {/* Org Filter */}
          <select
            value={orgFilter}
            onChange={(e) => setOrgFilter(e.target.value)}
            className="px-3 py-2 text-xs rounded-xl border border-black/[0.06] dark:border-white/10 bg-[#F2F2F7] dark:bg-[#2C2C2E] text-[#1C1C1E] dark:text-white font-semibold focus:outline-none cursor-pointer"
          >
            <option value="all">All Organizations</option>
            {organizations.map((org) => (
              <option key={org.organizationId} value={org.organizationId}>
                {org.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white dark:bg-[#1C1C1E] rounded-3xl border border-black/[0.04] dark:border-white/10 shadow-[0_4px_20px_rgb(0,0,0,0.03)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-black/[0.05] dark:border-white/10 bg-black/[0.01] dark:bg-white/[0.01] text-[#8E8E93]">
                <th className="py-3.5 px-4 font-semibold uppercase tracking-wider">User Identity</th>
                <th className="py-3.5 px-4 font-semibold uppercase tracking-wider">Assigned Role</th>
                <th className="py-3.5 px-4 font-semibold uppercase tracking-wider">Client Organization</th>
                <th className="py-3.5 px-4 font-semibold uppercase tracking-wider">Contact Phone</th>
                <th className="py-3.5 px-4 font-semibold uppercase tracking-wider">Status</th>
                <th className="py-3.5 px-4 font-semibold uppercase tracking-wider text-right">Access</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/[0.03] dark:divide-white/[0.05]">
              {filteredUsers.map((user) => (
                <tr key={user.uid} className="hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-colors">
                  <td className="py-4 px-4">
                    <div className="font-bold text-[#1C1C1E] dark:text-white text-sm">
                      {user.name}
                    </div>
                    <div className="text-[11px] text-[#8E8E93] font-mono">
                      {user.email}
                    </div>
                  </td>

                  <td className="py-4 px-4">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        user.role === 'super_admin'
                          ? 'bg-[#5856D6]/10 text-[#5856D6]'
                          : user.role === 'owner'
                          ? 'bg-[#007AFF]/10 text-[#007AFF]'
                          : user.role === 'manager'
                          ? 'bg-[#34C759]/10 text-[#34C759]'
                          : 'bg-black/5 dark:bg-white/10 text-[#8E8E93]'
                      }`}
                    >
                      {user.role}
                    </span>
                  </td>

                  <td className="py-4 px-4">
                    <div className="font-medium text-[#1C1C1E] dark:text-white">
                      {user.organizationName}
                    </div>
                  </td>

                  <td className="py-4 px-4 text-[#8E8E93] font-medium">
                    {user.phone}
                  </td>

                  <td className="py-4 px-4">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase inline-flex items-center gap-1 ${
                        user.status === 'active'
                          ? 'bg-[#34C759]/10 text-[#34C759]'
                          : 'bg-[#FF3B30]/10 text-[#FF3B30]'
                      }`}
                    >
                      {user.status}
                    </span>
                  </td>

                  <td className="py-4 px-4 text-right">
                    {user.organizationId !== 'all' && (
                      <button
                        onClick={() => startImpersonation(user.organizationId)}
                        className="px-2.5 py-1.5 rounded-xl bg-[#007AFF]/10 hover:bg-[#007AFF] hover:text-white text-[#007AFF] text-[11px] font-bold transition-all inline-flex items-center gap-1 cursor-pointer"
                        title="Impersonate & Open Client Workspace"
                      >
                        <ExternalLink className="w-3 h-3" />
                        Enter Scope
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
