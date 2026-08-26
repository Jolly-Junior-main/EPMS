import React, { useState } from 'react';
import { usePMS } from '../../context/PMSContext';
import { PlatformInvoiceStatus } from '../../types/superAdmin';
import {
  Receipt,
  Search,
  Download,
  CheckCircle2,
  Clock,
  AlertTriangle,
  FileText,
  DollarSign,
  TrendingUp
} from 'lucide-react';

export const PlatformBillingManager: React.FC = () => {
  const { platformInvoices, organizations, t } = usePMS();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | PlatformInvoiceStatus>('all');

  const filteredInvoices = platformInvoices.filter((inv) => {
    const org = organizations.find((o) => o.organizationId === inv.organizationId);
    const orgName = org ? org.name.toLowerCase() : '';
    const matches =
      inv.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      orgName.includes(searchTerm.toLowerCase()) ||
      inv.planName.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matches) return false;
    if (statusFilter !== 'all' && inv.status !== statusFilter) return false;
    return true;
  });

  const totalCollected = platformInvoices
    .filter((i) => i.status === 'paid')
    .reduce((sum, i) => sum + i.amountETB, 0);

  const totalPending = platformInvoices
    .filter((i) => i.status === 'pending' || i.status === 'delinquent')
    .reduce((sum, i) => sum + i.amountETB, 0);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header Banner */}
      <div className="bg-white dark:bg-[#1C1C1E] rounded-3xl p-6 md:p-8 border border-black/[0.04] dark:border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2.5 py-0.5 text-[11px] font-bold rounded-full bg-[#007AFF]/10 text-[#007AFF] font-mono">
              SAAS PLATFORM LEDGER &amp; INVOICE RECONCILIATION
            </span>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-[#1C1C1E] dark:text-white">
            {t('billing_title', 'Platform Invoicing &amp; Billing')}
          </h2>
          <p className="text-xs md:text-sm text-[#8E8E93] mt-0.5">
            {t('billing_subtitle', 'Platform SaaS invoices, Telebirr/EFT payment settlements, and VAT ledger.')}
          </p>
        </div>

        <div className="flex items-center gap-4 bg-[#F2F2F7] dark:bg-[#2C2C2E] p-4 rounded-2xl">
          <div>
            <div className="text-[10px] text-[#8E8E93] uppercase font-bold">Total Collected</div>
            <div className="text-lg font-bold text-[#34C759]">
              {totalCollected.toLocaleString()} ETB
            </div>
          </div>
          <div className="w-px h-8 bg-black/10 dark:bg-white/10" />
          <div>
            <div className="text-[10px] text-[#8E8E93] uppercase font-bold">Pending Collection</div>
            <div className="text-lg font-bold text-[#FF9500]">
              {totalPending.toLocaleString()} ETB
            </div>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-white dark:bg-[#1C1C1E] rounded-2xl p-3.5 border border-black/[0.04] dark:border-white/10 shadow-[0_2px_12px_rgba(0,0,0,0.03)] flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-2 w-full md:w-80 relative">
          <Search className="w-4 h-4 text-[#8E8E93] absolute left-3.5" />
          <input
            type="text"
            placeholder="Search invoice number or organization..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-black/[0.06] dark:border-white/10 bg-[#F2F2F7] dark:bg-[#2C2C2E] text-[#1C1C1E] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#007AFF]"
          />
        </div>

        <div className="flex items-center gap-1 bg-[#767680]/12 dark:bg-white/5 p-1 rounded-xl">
          {(['all', 'paid', 'pending', 'delinquent'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all cursor-pointer ${
                statusFilter === status
                  ? 'bg-white dark:bg-[#2C2C2E] text-[#1C1C1E] dark:text-white shadow-sm'
                  : 'text-[#8E8E93] hover:text-[#1C1C1E] dark:hover:text-white'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Invoices Table */}
      <div className="bg-white dark:bg-[#1C1C1E] rounded-3xl border border-black/[0.04] dark:border-white/10 shadow-[0_4px_20px_rgb(0,0,0,0.03)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-black/[0.05] dark:border-white/10 bg-black/[0.01] dark:bg-white/[0.01] text-[#8E8E93]">
                <th className="py-3.5 px-4 font-semibold uppercase tracking-wider">Invoice #</th>
                <th className="py-3.5 px-4 font-semibold uppercase tracking-wider">Client Organization</th>
                <th className="py-3.5 px-4 font-semibold uppercase tracking-wider">Plan &amp; Period</th>
                <th className="py-3.5 px-4 font-semibold uppercase tracking-wider">Amount (ETB)</th>
                <th className="py-3.5 px-4 font-semibold uppercase tracking-wider">Payment Method</th>
                <th className="py-3.5 px-4 font-semibold uppercase tracking-wider">Status</th>
                <th className="py-3.5 px-4 font-semibold uppercase tracking-wider text-right">Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/[0.03] dark:divide-white/[0.05]">
              {filteredInvoices.map((inv) => {
                const org = organizations.find((o) => o.organizationId === inv.organizationId);

                return (
                  <tr key={inv.invoiceId} className="hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-colors">
                    <td className="py-4 px-4 font-bold text-[#1C1C1E] dark:text-white font-mono">
                      {inv.invoiceNumber}
                    </td>

                    <td className="py-4 px-4 font-semibold text-[#1C1C1E] dark:text-white">
                      {org ? org.name : 'Unknown Organization'}
                    </td>

                    <td className="py-4 px-4">
                      <div className="font-medium text-[#1C1C1E] dark:text-white">
                        {inv.planName}
                      </div>
                      <div className="text-[10px] text-[#8E8E93]">
                        {inv.billingPeriod}
                      </div>
                    </td>

                    <td className="py-4 px-4 font-bold text-sm text-[#1C1C1E] dark:text-white">
                      {inv.amountETB.toLocaleString()} ETB
                    </td>

                    <td className="py-4 px-4">
                      <div className="font-medium text-[#1C1C1E] dark:text-white">
                        {inv.paymentMethod || 'Commercial Bank EFT'}
                      </div>
                      {inv.paymentRef && (
                        <div className="text-[10px] text-[#8E8E93] font-mono">
                          Ref: {inv.paymentRef}
                        </div>
                      )}
                    </td>

                    <td className="py-4 px-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase inline-flex items-center gap-1 ${
                          inv.status === 'paid'
                            ? 'bg-[#34C759]/10 text-[#34C759]'
                            : inv.status === 'pending'
                            ? 'bg-[#FF9500]/10 text-[#FF9500]'
                            : 'bg-[#FF3B30]/10 text-[#FF3B30]'
                        }`}
                      >
                        {inv.status}
                      </span>
                    </td>

                    <td className="py-4 px-4 text-right">
                      <button
                        onClick={() => alert(`Downloading Invoice PDF: ${inv.invoiceNumber}`)}
                        className="p-2 rounded-xl bg-black/5 dark:bg-white/5 hover:bg-[#007AFF] hover:text-white text-[#8E8E93] transition-all cursor-pointer inline-flex items-center gap-1 text-[11px] font-bold"
                        title="Download Tax Invoice"
                      >
                        <Download className="w-3.5 h-3.5" /> PDF
                      </button>
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
