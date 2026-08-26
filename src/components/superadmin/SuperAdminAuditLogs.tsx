import React, { useState } from 'react';
import { usePMS } from '../../context/PMSContext';
import { SuperAdminAuditAction } from '../../types/superAdmin';
import {
  FileCheck2,
  Search,
  Download,
  Filter,
  Activity,
  ShieldAlert,
  Building2,
  Users,
  CreditCard,
  Settings
} from 'lucide-react';

export const SuperAdminAuditLogs: React.FC = () => {
  const { superAdminAuditLogs, organizations, t } = usePMS();

  const [searchTerm, setSearchTerm] = useState('');
  const [actionFilter, setActionFilter] = useState<string>('all');
  const [orgFilter, setOrgFilter] = useState<string>('all');

  const filteredLogs = superAdminAuditLogs.filter((log) => {
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      log.action.toLowerCase().includes(term) ||
      log.details.toLowerCase().includes(term) ||
      (log.organizationName || '').toLowerCase().includes(term) ||
      log.actorName.toLowerCase().includes(term);

    const matchesAction = actionFilter === 'all' || log.action === actionFilter;
    const matchesOrg = orgFilter === 'all' || log.organizationId === orgFilter;

    return matchesSearch && matchesAction && matchesOrg;
  });

  const handleExportCSV = () => {
    const headers = ['Log ID', 'Timestamp', 'Actor Name', 'Actor Role', 'Action', 'Resource', 'Organization', 'IP Address', 'Details'];
    const rows = filteredLogs.map((l) => [
      l.logId,
      l.timestamp,
      `"${l.actorName}"`,
      l.actorRole,
      l.action,
      l.resource,
      `"${l.organizationName || 'Global'}"`,
      l.ipAddress || '197.156.103.42',
      `"${l.details.replace(/"/g, '""')}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `epms_audit_trail_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header Banner */}
      <div className="bg-white dark:bg-[#1C1C1E] rounded-3xl p-6 md:p-8 border border-black/[0.04] dark:border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2.5 py-0.5 text-[11px] font-bold rounded-full bg-[#007AFF]/10 text-[#007AFF] font-mono">
              SECURITY AUDITING &amp; REGULATORY COMPLIANCE
            </span>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-[#1C1C1E] dark:text-white">
            {t('audit_title', 'Platform Audit Logs')}
          </h2>
          <p className="text-xs md:text-sm text-[#8E8E93] mt-0.5">
            {t('audit_subtitle', 'Immutable records of all super administrative changes, client onboarding, tier modifications, and impersonation sessions.')}
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="px-4 py-2.5 bg-black/5 dark:bg-white/5 hover:bg-black/10 text-[#1C1C1E] dark:text-white rounded-2xl text-xs font-semibold transition-all flex items-center gap-2 active:scale-95 cursor-pointer"
        >
          <Download className="w-4 h-4 text-[#8E8E93]" />
          Export Audit CSV
        </button>
      </div>

      {/* Toolbar */}
      <div className="bg-white dark:bg-[#1C1C1E] rounded-2xl p-3.5 border border-black/[0.04] dark:border-white/10 shadow-[0_2px_12px_rgba(0,0,0,0.03)] flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-2 w-full md:w-80 relative">
          <Search className="w-4 h-4 text-[#8E8E93] absolute left-3.5" />
          <input
            type="text"
            placeholder="Search action, details, actor, or org..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-black/[0.06] dark:border-white/10 bg-[#F2F2F7] dark:bg-[#2C2C2E] text-[#1C1C1E] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#007AFF]"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Action Filter */}
          <select
            value={actionFilter}
            onChange={(e) => setActionFilter(e.target.value)}
            className="px-3 py-2 text-xs rounded-xl border border-black/[0.06] dark:border-white/10 bg-[#F2F2F7] dark:bg-[#2C2C2E] text-[#1C1C1E] dark:text-white font-semibold focus:outline-none cursor-pointer"
          >
            <option value="all">All Action Types</option>
            <option value="CREATE_ORGANIZATION">CREATE_ORGANIZATION</option>
            <option value="UPDATE_ORGANIZATION">UPDATE_ORGANIZATION</option>
            <option value="SUSPEND_ORGANIZATION">SUSPEND_ORGANIZATION</option>
            <option value="ACTIVATE_ORGANIZATION">ACTIVATE_ORGANIZATION</option>
            <option value="START_IMPERSONATION">START_IMPERSONATION</option>
            <option value="EXIT_IMPERSONATION">EXIT_IMPERSONATION</option>
            <option value="EXTEND_SUBSCRIPTION">EXTEND_SUBSCRIPTION</option>
            <option value="CHANGE_SUBSCRIPTION_PLAN">CHANGE_SUBSCRIPTION_PLAN</option>
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

      {/* Logs Table */}
      <div className="bg-white dark:bg-[#1C1C1E] rounded-3xl border border-black/[0.04] dark:border-white/10 shadow-[0_4px_20px_rgb(0,0,0,0.03)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-black/[0.05] dark:border-white/10 bg-black/[0.01] dark:bg-white/[0.01] text-[#8E8E93]">
                <th className="py-3.5 px-4 font-semibold uppercase tracking-wider">Timestamp</th>
                <th className="py-3.5 px-4 font-semibold uppercase tracking-wider">Actor</th>
                <th className="py-3.5 px-4 font-semibold uppercase tracking-wider">Action Type</th>
                <th className="py-3.5 px-4 font-semibold uppercase tracking-wider">Target Scope</th>
                <th className="py-3.5 px-4 font-semibold uppercase tracking-wider">Details &amp; Audit Payload</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/[0.03] dark:divide-white/[0.05]">
              {filteredLogs.map((log) => (
                <tr key={log.logId} className="hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-colors">
                  <td className="py-4 px-4 font-mono text-[11px] text-[#8E8E93] whitespace-nowrap">
                    {new Date(log.timestamp).toLocaleString()}
                  </td>

                  <td className="py-4 px-4 whitespace-nowrap">
                    <div className="font-bold text-[#1C1C1E] dark:text-white">
                      {log.actorName}
                    </div>
                    <div className="text-[10px] text-[#8E8E93] font-mono">
                      {log.actorRole.toUpperCase()}
                    </div>
                  </td>

                  <td className="py-4 px-4 whitespace-nowrap">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-[#007AFF]/10 text-[#007AFF] font-mono">
                      {log.action}
                    </span>
                  </td>

                  <td className="py-4 px-4">
                    <div className="font-semibold text-[#1C1C1E] dark:text-white">
                      {log.organizationName || 'Global Platform'}
                    </div>
                    <div className="text-[10px] text-[#8E8E93] font-mono">
                      {log.resource}: {log.resourceId || 'N/A'}
                    </div>
                  </td>

                  <td className="py-4 px-4 max-w-md">
                    <div className="text-[#1C1C1E] dark:text-white font-medium">
                      {log.details}
                    </div>
                    {(log.previousValue || log.newValue) && (
                      <div className="text-[10px] text-[#8E8E93] mt-0.5 flex items-center gap-2 font-mono">
                        {log.previousValue && <span className="text-[#FF3B30]">From: {log.previousValue}</span>}
                        {log.newValue && <span className="text-[#34C759]">To: {log.newValue}</span>}
                      </div>
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
