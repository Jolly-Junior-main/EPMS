import React, { useState } from 'react';
import { usePMS } from '../../context/PMSContext';
import {
  AlertOctagon,
  PhoneCall,
  Send,
  FileWarning,
  Clock,
  Printer,
  Search,
  Building,
  User,
  ShieldAlert,
  ArrowRight,
  CheckCircle,
  X,
  AlertTriangle
} from 'lucide-react';

export const TheRedListTracker: React.FC = () => {
  const {
    getRedList,
    sendCustomSMS,
    currentUser,
    properties,
    selectedPropertyId,
    setSelectedPropertyId
  } = usePMS();

  const redListItems = getRedList();
  const [searchTerm, setSearchTerm] = useState('');
  const [agingFilter, setAgingFilter] = useState<'all' | '30' | '60' | '90'>('all');
  const [activeNoticeModal, setActiveNoticeModal] = useState<any | null>(null);
  const [smsSuccessMsg, setSmsSuccessMsg] = useState<string | null>(null);

  // Filter items
  const filteredItems = redListItems.filter((item) => {
    const matchesSearch =
      item.tenantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.unitNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;

    if (agingFilter === '30') return item.agingDays >= 30 && item.agingDays < 60;
    if (agingFilter === '60') return item.agingDays >= 60 && item.agingDays < 90;
    if (agingFilter === '90') return item.agingDays >= 90;

    return true;
  });

  const totalDelinquentSum = filteredItems.reduce((acc, curr) => acc + curr.totalWithLateFee, 0);

  const handleSendUrgentSMS = async (item: any) => {
    const text = `URGENT MANAGEMENT NOTICE: Dear ${item.tenantName}, your rent for ${item.unitNumber} is ${item.agingDays} days overdue. Total balance due: ${item.totalWithLateFee.toLocaleString()} ETB (includes late penalty). Remit payment immediately to avoid legal escalations.`;
    await sendCustomSMS(item.phone, item.tenantName, text, item.tenantId);
    setSmsSuccessMsg(`Delinquency notice dispatched to ${item.phone}`);
    setTimeout(() => setSmsSuccessMsg(null), 4000);
  };

  return (
    <div id="red-list-view" className="space-y-6">
      {/* iOS Header Banner Card */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-black/[0.04] shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="space-y-1.5 z-10">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 text-[11px] font-bold rounded-full bg-[#FF3B30]/10 text-[#FF3B30] flex items-center gap-1.5">
              <AlertOctagon className="w-3.5 h-3.5" />
              CRITICAL RECOVERY ENCLAVE
            </span>
            <span className="text-xs text-[#8E8E93] font-mono">Overdue Aging Query: status == 'delinquent'</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-[#1C1C1E] flex items-center gap-2">
            The Red List: Delinquency &amp; Aging Tracker
          </h2>
          <p className="text-xs md:text-sm text-[#8E8E93] max-w-2xl">
            Real-time isolation of overdue commercial &amp; residential tenants with automatic aging calculations, statutory late fee compounding, and direct SMS debt recovery workflows.
          </p>
        </div>

        {/* Aggregate Delinquent Widget Counter */}
        <div className="bg-[#1C1C1E] text-white p-5 rounded-3xl text-right shadow-md border border-white/10 shrink-0">
          <div className="text-[11px] font-medium text-white/60 uppercase">Capital At Risk on Red List</div>
          <div className="text-2xl font-bold text-[#FF453A] tracking-tight">
            {totalDelinquentSum.toLocaleString('en-US', { minimumFractionDigits: 2 })}{' '}
            <span className="text-xs font-bold text-white/90 ml-1">ETB</span>
          </div>
          <div className="text-[11px] text-white/60 mt-0.5">{filteredItems.length} accounts flagged</div>
        </div>
      </div>

      {smsSuccessMsg && (
        <div className="bg-[#34C759]/10 border border-[#34C759]/20 text-[#34C759] px-4 py-3 rounded-2xl text-xs font-semibold flex items-center gap-2 animate-in fade-in duration-200">
          <CheckCircle className="w-4 h-4 text-[#34C759]" />
          {smsSuccessMsg}
        </div>
      )}

      {/* iOS Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-3 border border-black/[0.04] shadow-[0_2px_12px_rgba(0,0,0,0.03)] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 w-full sm:w-80 relative">
          <Search className="w-4 h-4 text-[#8E8E93] absolute left-3.5" />
          <input
            type="text"
            placeholder="Search tenant, unit, or invoice..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-black/[0.06] bg-[#F2F2F7] text-[#1C1C1E] focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#007AFF] font-medium"
          />
        </div>

        {/* Aging Threshold Tabs */}
        <div className="flex items-center gap-1 bg-[#767680]/12 p-1 rounded-xl">
          <button
            onClick={() => setAgingFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 active:scale-95 ${
              agingFilter === 'all'
                ? 'bg-white text-[#1C1C1E] shadow-[0_2px_6px_rgba(0,0,0,0.12)]'
                : 'text-[#8E8E93] hover:text-[#1C1C1E]'
            }`}
          >
            All Delinquent ({redListItems.length})
          </button>
          <button
            onClick={() => setAgingFilter('30')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 active:scale-95 ${
              agingFilter === '30'
                ? 'bg-white text-[#FF9500] shadow-[0_2px_6px_rgba(0,0,0,0.12)]'
                : 'text-[#8E8E93] hover:text-[#1C1C1E]'
            }`}
          >
            30-59 Days
          </button>
          <button
            onClick={() => setAgingFilter('60')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 active:scale-95 ${
              agingFilter === '60'
                ? 'bg-white text-[#FF9500] shadow-[0_2px_6px_rgba(0,0,0,0.12)]'
                : 'text-[#8E8E93] hover:text-[#1C1C1E]'
            }`}
          >
            60-89 Days
          </button>
          <button
            onClick={() => setAgingFilter('90')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 active:scale-95 ${
              agingFilter === '90'
                ? 'bg-white text-[#FF3B30] shadow-[0_2px_6px_rgba(0,0,0,0.12)]'
                : 'text-[#8E8E93] hover:text-[#1C1C1E]'
            }`}
          >
            90+ Days
          </button>
        </div>
      </div>

      {/* iOS Red List Table */}
      <div className="bg-white rounded-3xl border border-black/[0.04] shadow-[0_4px_20px_rgb(0,0,0,0.03)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-[#1C1C1E]">
            <thead className="bg-[#F2F2F7] text-[#8E8E93] uppercase text-[10px] font-bold tracking-wider border-b border-black/[0.05]">
              <tr>
                <th className="px-5 py-4">Tenant Entity</th>
                <th className="px-5 py-4">Unit / Complex</th>
                <th className="px-5 py-4">Due Date</th>
                <th className="px-5 py-4">Aging Overdue</th>
                <th className="px-5 py-4">Base Rent</th>
                <th className="px-5 py-4">Late Penalty (5%)</th>
                <th className="px-5 py-4">Total Claim</th>
                <th className="px-5 py-4 text-right">Recovery Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/[0.04] font-medium">
              {filteredItems.map((item) => {
                const agingSeverity =
                  item.agingDays >= 60
                    ? 'bg-[#FF3B30]/15 text-[#FF3B30]'
                    : item.agingDays >= 30
                    ? 'bg-[#FF9500]/15 text-[#FF9500]'
                    : 'bg-[#8E8E93]/15 text-[#8E8E93]';

                return (
                  <tr key={item.invoiceId} className="hover:bg-[#FF3B30]/[0.03] transition-colors">
                    <td className="px-5 py-4">
                      <div className="font-bold text-[#1C1C1E] text-sm">{item.tenantName}</div>
                      <div className="text-[11px] text-[#8E8E93] font-mono flex items-center gap-1 mt-0.5">
                        <PhoneCall className="w-3 h-3 text-[#8E8E93]" />
                        {item.phone}
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <div className="font-semibold text-[#1C1C1E]">{item.unitNumber}</div>
                      <div className="text-[11px] text-[#8E8E93] font-mono">Inv #{item.invoiceNumber}</div>
                    </td>

                    <td className="px-5 py-4 font-mono text-[#8E8E93]">
                      {new Date(item.dueDate).toLocaleDateString('en-CA')}
                    </td>

                    <td className="px-5 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${agingSeverity}`}>
                        {item.agingDays} Days Overdue
                      </span>
                    </td>

                    <td className="px-5 py-4 font-bold text-[#1C1C1E]">
                      {item.amountDue.toLocaleString()} ETB
                    </td>

                    <td className="px-5 py-4 font-bold text-[#FF3B30]">
                      +{(item.lateFeeApplied || Math.round(item.amountDue * 0.05)).toLocaleString()} ETB
                    </td>

                    <td className="px-5 py-4 font-bold text-[#FF3B30] text-sm">
                      {item.totalWithLateFee.toLocaleString()} ETB
                    </td>

                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleSendUrgentSMS(item)}
                          title="Transmit SMS Notice via EthioTelecom Gateway"
                          className="px-3.5 py-1.5 rounded-xl bg-[#007AFF] hover:bg-[#0062CC] text-white font-semibold text-xs flex items-center gap-1.5 shadow-[0_2px_8px_rgba(0,122,255,0.3)] transition-all active:scale-95"
                        >
                          <Send className="w-3.5 h-3.5" />
                          SMS Notice
                        </button>
                        <button
                          onClick={() => setActiveNoticeModal(item)}
                          title="Generate Formal Demand / Eviction Letter"
                          className="px-3.5 py-1.5 rounded-xl border border-black/[0.08] bg-[#F2F2F7] hover:bg-[#E5E5EA] text-[#1C1C1E] font-semibold text-xs flex items-center gap-1.5 transition-all active:scale-95"
                        >
                          <Printer className="w-3.5 h-3.5 text-[#007AFF]" />
                          Demand Letter
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {filteredItems.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-5 py-12 text-center text-[#8E8E93] text-xs">
                    No delinquent accounts found matching the current criteria. Excellent recovery health!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Formal Legal Demand / Eviction Notice Modal */}
      {activeNoticeModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 md:p-8 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto border border-black/[0.06] animate-in fade-in zoom-in-95 duration-200">
            {/* Grabber Bar */}
            <div className="w-10 h-1 rounded-full bg-gray-300 mx-auto -mt-2 mb-2" />

            <div className="flex items-center justify-between border-b border-black/[0.05] pb-3.5">
              <div className="flex items-center gap-3 text-[#FF3B30]">
                <div className="w-10 h-10 rounded-2xl bg-[#FF3B30]/10 flex items-center justify-center">
                  <ShieldAlert className="w-6 h-6 text-[#FF3B30]" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-[#1C1C1E]">
                    Statutory Demand for Payment &amp; Cure Notice
                  </h3>
                  <p className="text-xs text-[#8E8E93]">Commercial Code of Ethiopia &amp; Lease Enforcement</p>
                </div>
              </div>
              <button
                onClick={() => setActiveNoticeModal(null)}
                className="p-2 rounded-full hover:bg-[#F2F2F7] text-[#8E8E93] hover:text-[#1C1C1E] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Formal Letter Template */}
            <div className="p-6 bg-[#F2F2F7] rounded-2xl text-xs space-y-4 text-[#1C1C1E] font-serif leading-relaxed border border-black/[0.04]">
              <div className="text-right text-[11px] font-sans text-[#8E8E93]">
                Date: {new Date().toLocaleDateString('en-US', { dateStyle: 'full' })}<br />
                Ref No: DEMAND-ET-{activeNoticeModal.invoiceNumber}
              </div>

              <div>
                <strong>TO:</strong> {activeNoticeModal.tenantName}<br />
                <strong>UNIT:</strong> {activeNoticeModal.unitNumber}<br />
                <strong>CONTACT:</strong> {activeNoticeModal.phone}
              </div>

              <div className="font-sans font-bold text-xs text-center uppercase tracking-wide py-2 bg-white rounded-xl text-[#1C1C1E] shadow-sm">
                RE: FINAL FORMAL DEMAND TO CURE RENTAL ARREARS ({activeNoticeModal.agingDays} DAYS OVERDUE)
              </div>

              <p>
                Dear Tenant,
              </p>
              <p>
                Please take formal notice that as of the date of this instrument, your rental account for <strong>{activeNoticeModal.unitNumber}</strong> remains in substantial default under the executed Lease Agreement.
              </p>

              <div className="p-4 bg-white rounded-2xl text-xs space-y-1.5 shadow-sm">
                <div className="flex justify-between">
                  <span>Base Outstanding Rent:</span>
                  <strong className="font-sans font-bold">{activeNoticeModal.amountDue.toLocaleString()} ETB</strong>
                </div>
                <div className="flex justify-between text-[#FF3B30]">
                  <span>Compounded Late Fees (5%):</span>
                  <strong className="font-sans font-bold">+{(activeNoticeModal.lateFeeApplied || Math.round(activeNoticeModal.amountDue * 0.05)).toLocaleString()} ETB</strong>
                </div>
                <div className="flex justify-between border-t border-black/[0.05] pt-1.5 font-bold text-[#1C1C1E]">
                  <span>Total Liquidated Balance:</span>
                  <span className="text-[#FF3B30] font-sans font-bold">{activeNoticeModal.totalWithLateFee.toLocaleString()} ETB</span>
                </div>
              </div>

              <p>
                You are hereby commanded to remit the full liquidated amount of <strong>{activeNoticeModal.totalWithLateFee.toLocaleString()} ETB</strong> directly to the Escrow Account within <strong>three (3) business days</strong> of receipt. Failure to comply will result in immediate lease termination, locking of premises, and filing of summary recovery proceedings before the High Court of Addis Ababa.
              </p>

              <div className="pt-4 border-t border-black/[0.05] text-right font-sans text-xs">
                <strong>Property Operations Management &amp; Legal Department</strong><br />
                Abebe Mengesha, Managing Director &amp; Owner
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => {
                  window.print();
                }}
                className="px-4 py-2.5 bg-[#1C1C1E] hover:bg-black text-white rounded-2xl text-xs font-semibold flex items-center gap-1.5 shadow-md active:scale-95 transition-all"
              >
                <Printer className="w-4 h-4" /> Print Notice
              </button>
              <button
                onClick={() => setActiveNoticeModal(null)}
                className="px-4 py-2.5 bg-[#F2F2F7] hover:bg-[#E5E5EA] text-[#1C1C1E] rounded-2xl text-xs font-semibold active:scale-95 transition-all"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
