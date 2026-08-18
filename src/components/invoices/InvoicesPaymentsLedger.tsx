import React, { useState } from 'react';
import { usePMS } from '../../context/PMSContext';
import { Invoice, PaymentStatus, BillingFrequency } from '../../types/pms';
import { generateBankReceiptSvg } from '../../data/mockData';
import {
  FileText,
  Plus,
  Search,
  Filter,
  CreditCard,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Upload,
  Building,
  User,
  ArrowRight,
  Trash2,
  X
} from 'lucide-react';

export const InvoicesPaymentsLedger: React.FC<{ onNavigateToVault?: () => void }> = ({ onNavigateToVault }) => {
  const {
    invoices,
    payments,
    tenants,
    units,
    currentUser,
    createInvoice,
    deleteInvoice,
    logPayment
  } = usePMS();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | PaymentStatus>('all');
  const [isCreateInvoiceModalOpen, setIsCreateInvoiceModalOpen] = useState(false);
  const [isLogPaymentModalOpen, setIsLogPaymentModalOpen] = useState(false);

  // Invoice Form State
  const [invoiceForm, setInvoiceForm] = useState({
    tenantId: tenants[0]?.tenantId || '',
    unitId: tenants[0]?.assignedUnitId || '',
    propertyId: tenants[0]?.propertyId || '',
    amountDue: 140000,
    dueDate: '2026-09-05',
    issuedDate: '2026-08-14',
    billingFrequency: 'monthly' as BillingFrequency,
    paymentStatus: 'pending' as PaymentStatus,
    billingPeriod: 'September 2026',
    description: 'Monthly Commercial Unit Lease'
  });

  // Payment Form State
  const [paymentForm, setPaymentForm] = useState({
    invoiceId: invoices[0]?.invoiceId || '',
    amountPaid: invoices[0]?.amountDue || 125000,
    paymentMethod: 'cbe_birr' as any,
    referenceNumber: 'CBE-FT-' + Math.floor(10000000 + Math.random() * 90000000),
    notes: 'Paid via direct bank transfer to escrow account.'
  });

  const filteredInvoices = invoices.filter((inv) => {
    const tenant = tenants.find((t) => t.tenantId === inv.tenantId);
    const unit = units.find((u) => u.unitId === inv.unitId);

    const matchesSearch =
      inv.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (tenant && tenant.legalName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (unit && unit.unitNumber.toLowerCase().includes(searchTerm.toLowerCase()));

    if (!matchesSearch) return false;
    if (statusFilter !== 'all' && inv.paymentStatus !== statusFilter) return false;

    return true;
  });

  const handleCreateInvoiceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createInvoice({
      ...invoiceForm,
      dueDate: new Date(invoiceForm.dueDate).toISOString(),
      issuedDate: new Date(invoiceForm.issuedDate).toISOString()
    });
    setIsCreateInvoiceModalOpen(false);
  };

  const handleLogPaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const targetInvoice = invoices.find((i) => i.invoiceId === paymentForm.invoiceId);
    if (!targetInvoice) return;

    const tenant = tenants.find((t) => t.tenantId === targetInvoice.tenantId);
    const unit = units.find((u) => u.unitId === targetInvoice.unitId);

    const receiptSvg = generateBankReceiptSvg({
      bankName:
        paymentForm.paymentMethod === 'cbe_birr'
          ? 'Commercial Bank of Ethiopia (CBE)'
          : paymentForm.paymentMethod === 'telebirr'
          ? 'Telebirr Merchant Gateway'
          : paymentForm.paymentMethod === 'awash_bank'
          ? 'Awash International Bank S.C.'
          : 'Dashen Bank / Amole Corporate',
      payerName: tenant?.legalName || 'Tenant Entity',
      amountETB: paymentForm.amountPaid,
      refNumber: paymentForm.referenceNumber,
      date: new Date().toLocaleString() + ' EAT',
      paymentType: paymentForm.paymentMethod.toUpperCase().replace('_', ' '),
      roomNumber: unit?.unitNumber || 'Unit'
    });

    logPayment({
      invoiceId: paymentForm.invoiceId,
      tenantId: targetInvoice.tenantId,
      unitId: targetInvoice.unitId,
      amountPaid: paymentForm.amountPaid,
      paymentMethod: paymentForm.paymentMethod,
      referenceNumber: paymentForm.referenceNumber,
      receiptImageUrl: receiptSvg,
      notes: paymentForm.notes
    });

    setIsLogPaymentModalOpen(false);
  };

  return (
    <div id="invoices-payments-ledger-view" className="space-y-6">
      {/* iOS Header Banner */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-black/[0.04] shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2.5 py-0.5 text-[11px] font-bold rounded-full bg-[#007AFF]/10 text-[#007AFF] font-mono">
              FIRESTORE /invoices &amp; /payments
            </span>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-[#1C1C1E]">Invoices &amp; Financial Ledger</h2>
          <p className="text-xs md:text-sm text-[#8E8E93] mt-0.5">
            Issue billing notices, record bank transfer advice, and track clearance states.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setIsLogPaymentModalOpen(true)}
            className="px-4 py-2.5 bg-[#34C759] hover:bg-[#2EB150] text-white rounded-2xl text-xs font-semibold transition-all shadow-[0_4px_12px_rgba(52,199,89,0.3)] flex items-center gap-2 active:scale-95"
          >
            <CreditCard className="w-4 h-4" />
            Log Payment Slip
          </button>
          <button
            onClick={() => setIsCreateInvoiceModalOpen(true)}
            className="px-4 py-2.5 bg-[#007AFF] hover:bg-[#0062CC] text-white rounded-2xl text-xs font-semibold transition-all shadow-[0_4px_12px_rgba(0,122,255,0.3)] flex items-center gap-2 active:scale-95"
          >
            <Plus className="w-4 h-4" />
            Issue New Invoice
          </button>
        </div>
      </div>

      {/* iOS Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-3 border border-black/[0.04] shadow-[0_2px_12px_rgba(0,0,0,0.03)] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 w-full sm:w-80 relative">
          <Search className="w-4 h-4 text-[#8E8E93] absolute left-3.5" />
          <input
            type="text"
            placeholder="Search invoice number, tenant, unit..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-black/[0.06] bg-[#F2F2F7] text-[#1C1C1E] focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#007AFF] font-medium"
          />
        </div>

        <div className="flex items-center gap-1 bg-[#767680]/12 p-1 rounded-xl overflow-x-auto">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 active:scale-95 whitespace-nowrap ${
              statusFilter === 'all' ? 'bg-white text-[#1C1C1E] shadow-[0_2px_6px_rgba(0,0,0,0.12)]' : 'text-[#8E8E93] hover:text-[#1C1C1E]'
            }`}
          >
            All ({invoices.length})
          </button>
          <button
            onClick={() => setStatusFilter('submitted_for_verification')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 active:scale-95 whitespace-nowrap ${
              statusFilter === 'submitted_for_verification'
                ? 'bg-white text-[#FF9500] shadow-[0_2px_6px_rgba(0,0,0,0.12)]'
                : 'text-[#8E8E93] hover:text-[#1C1C1E]'
            }`}
          >
            Under Review ({invoices.filter((i) => i.paymentStatus === 'submitted_for_verification').length})
          </button>
          <button
            onClick={() => setStatusFilter('pending')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 active:scale-95 whitespace-nowrap ${
              statusFilter === 'pending' ? 'bg-white text-[#007AFF] shadow-[0_2px_6px_rgba(0,0,0,0.12)]' : 'text-[#8E8E93] hover:text-[#1C1C1E]'
            }`}
          >
            Pending ({invoices.filter((i) => i.paymentStatus === 'pending').length})
          </button>
          <button
            onClick={() => setStatusFilter('paid')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 active:scale-95 whitespace-nowrap ${
              statusFilter === 'paid' ? 'bg-white text-[#34C759] shadow-[0_2px_6px_rgba(0,0,0,0.12)]' : 'text-[#8E8E93] hover:text-[#1C1C1E]'
            }`}
          >
            Paid ({invoices.filter((i) => i.paymentStatus === 'paid').length})
          </button>
          <button
            onClick={() => setStatusFilter('delinquent')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 active:scale-95 whitespace-nowrap ${
              statusFilter === 'delinquent' ? 'bg-white text-[#FF3B30] shadow-[0_2px_6px_rgba(0,0,0,0.12)]' : 'text-[#8E8E93] hover:text-[#1C1C1E]'
            }`}
          >
            Delinquent ({invoices.filter((i) => i.paymentStatus === 'delinquent').length})
          </button>
        </div>
      </div>

      {/* iOS Styled Invoices Table */}
      <div className="bg-white rounded-3xl border border-black/[0.04] shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-[#1C1C1E]">
            <thead className="bg-[#F2F2F7] uppercase text-[10px] font-bold text-[#8E8E93] border-b border-black/[0.04]">
              <tr>
                <th className="px-5 py-4">Invoice Ref</th>
                <th className="px-5 py-4">Tenant Entity</th>
                <th className="px-5 py-4">Unit</th>
                <th className="px-5 py-4">Billing Period</th>
                <th className="px-5 py-4">Due Date</th>
                <th className="px-5 py-4">Amount (ETB)</th>
                <th className="px-5 py-4">Status</th>
                <th className="px-5 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/[0.04] font-medium">
              {filteredInvoices.map((inv) => {
                const tenant = tenants.find((t) => t.tenantId === inv.tenantId);
                const unit = units.find((u) => u.unitId === inv.unitId);

                return (
                  <tr key={inv.invoiceId} className="hover:bg-[#F2F2F7]/50 transition-colors">
                    <td className="px-5 py-4 font-mono font-bold text-[#1C1C1E]">
                      {inv.invoiceNumber}
                    </td>

                    <td className="px-5 py-4">
                      <div className="font-bold text-[#1C1C1E]">{tenant?.legalName || 'N/A'}</div>
                      <div className="text-[11px] text-[#8E8E93] font-mono">{tenant?.phone}</div>
                    </td>

                    <td className="px-5 py-4 text-[#1C1C1E]">
                      {unit?.unitNumber || 'N/A'}
                    </td>

                    <td className="px-5 py-4 text-[#3A3A3C]">
                      {inv.billingPeriod}
                    </td>

                    <td className="px-5 py-4 font-mono text-[#3A3A3C]">
                      {new Date(inv.dueDate).toLocaleDateString('en-CA')}
                    </td>

                    <td className="px-5 py-4 font-bold text-[#1C1C1E] text-sm">
                      {inv.amountDue.toLocaleString()} ETB
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                          inv.paymentStatus === 'paid'
                            ? 'bg-[#34C759]/15 text-[#34C759]'
                            : inv.paymentStatus === 'submitted_for_verification'
                            ? 'bg-[#FF9500]/15 text-[#FF9500]'
                            : inv.paymentStatus === 'delinquent'
                            ? 'bg-[#FF3B30]/15 text-[#FF3B30]'
                            : 'bg-[#F2F2F7] text-[#8E8E93]'
                        }`}
                      >
                        {inv.paymentStatus.replace(/_/g, ' ')}
                      </span>
                    </td>

                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {inv.paymentStatus === 'submitted_for_verification' && onNavigateToVault ? (
                          <button
                            onClick={onNavigateToVault}
                            className="px-3.5 py-1.5 bg-[#FF9500] hover:bg-[#E08500] text-white rounded-xl text-xs font-semibold flex items-center gap-1 shadow-[0_2px_8px_rgba(255,149,0,0.3)] active:scale-95 transition-all"
                          >
                            Verify in Vault <ArrowRight className="w-3 h-3" />
                          </button>
                        ) : inv.paymentStatus === 'pending' ? (
                          <button
                            onClick={() => {
                              setPaymentForm({
                                ...paymentForm,
                                invoiceId: inv.invoiceId,
                                amountPaid: inv.amountDue
                              });
                              setIsLogPaymentModalOpen(true);
                            }}
                            className="px-3 py-1.5 bg-[#F2F2F7] hover:bg-[#E5E5EA] text-[#007AFF] rounded-xl text-xs font-semibold active:scale-95 transition-all"
                          >
                            Log Payment
                          </button>
                        ) : (
                          <span className="text-[#8E8E93] text-xs font-mono">Reconciled</span>
                        )}

                        <button
                          onClick={() => {
                            if (window.confirm(`Are you sure you want to delete invoice ${inv.invoiceNumber}? This will be deleted live in Firestore across all browsers.`)) {
                              deleteInvoice(inv.invoiceId);
                            }
                          }}
                          title="Delete Invoice"
                          className="p-1.5 text-[#8E8E93] hover:text-[#FF3B30] hover:bg-[#FF3B30]/10 rounded-lg transition-colors active:scale-95"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Issue Invoice Modal Sheet */}
      {isCreateInvoiceModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <form
            onSubmit={handleCreateInvoiceSubmit}
            className="bg-white rounded-3xl max-w-lg w-full p-6 md:p-8 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto border border-black/[0.06] animate-in fade-in zoom-in-95 duration-200"
          >
            {/* Grabber Bar */}
            <div className="w-10 h-1 rounded-full bg-gray-300 mx-auto -mt-2 mb-2" />

            <div className="flex items-center justify-between border-b border-black/[0.05] pb-3.5">
              <h3 className="font-bold text-base text-[#1C1C1E]">Issue New Invoice (Firestore Document)</h3>
              <button
                type="button"
                onClick={() => setIsCreateInvoiceModalOpen(false)}
                className="p-2 rounded-full hover:bg-[#F2F2F7] text-[#8E8E93] hover:text-[#1C1C1E] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-[#1C1C1E] block mb-1">Select Tenant</label>
                <select
                  value={invoiceForm.tenantId}
                  onChange={(e) => {
                    const tenant = tenants.find((t) => t.tenantId === e.target.value);
                    if (tenant) {
                      setInvoiceForm({
                        ...invoiceForm,
                        tenantId: tenant.tenantId,
                        unitId: tenant.assignedUnitId,
                        propertyId: tenant.propertyId,
                        amountDue: tenant.monthlyRentETB
                      });
                    }
                  }}
                  className="w-full p-2.5 rounded-xl border border-black/[0.06] bg-[#F2F2F7] text-[#1C1C1E] focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#007AFF] font-medium"
                >
                  {tenants.map((t) => (
                    <option key={t.tenantId} value={t.tenantId}>
                      {t.legalName} ({t.monthlyRentETB.toLocaleString()} ETB)
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-[#1C1C1E] block mb-1">Amount Due (ETB)</label>
                  <input
                    type="number"
                    value={invoiceForm.amountDue}
                    onChange={(e) => setInvoiceForm({ ...invoiceForm, amountDue: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-xl border border-black/[0.06] bg-[#F2F2F7] text-[#1C1C1E] focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#007AFF] font-mono font-bold"
                    required
                  />
                </div>

                <div>
                  <label className="font-semibold text-[#1C1C1E] block mb-1">Billing Period</label>
                  <input
                    type="text"
                    value={invoiceForm.billingPeriod}
                    onChange={(e) => setInvoiceForm({ ...invoiceForm, billingPeriod: e.target.value })}
                    placeholder="e.g. September 2026"
                    className="w-full p-2.5 rounded-xl border border-black/[0.06] bg-[#F2F2F7] text-[#1C1C1E] focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#007AFF]"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-[#1C1C1E] block mb-1">Due Date</label>
                  <input
                    type="date"
                    value={invoiceForm.dueDate}
                    onChange={(e) => setInvoiceForm({ ...invoiceForm, dueDate: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-black/[0.06] bg-[#F2F2F7] text-[#1C1C1E] focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#007AFF] font-mono"
                    required
                  />
                </div>

                <div>
                  <label className="font-semibold text-[#1C1C1E] block mb-1">Billing Frequency</label>
                  <select
                    value={invoiceForm.billingFrequency}
                    onChange={(e) => setInvoiceForm({ ...invoiceForm, billingFrequency: e.target.value as any })}
                    className="w-full p-2.5 rounded-xl border border-black/[0.06] bg-[#F2F2F7] text-[#1C1C1E] focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#007AFF]"
                  >
                    <option value="monthly">Monthly</option>
                    <option value="quarterly">Quarterly</option>
                    <option value="bi-annually">Bi-Annually</option>
                    <option value="annually">Annually</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-semibold text-[#1C1C1E] block mb-1">Description / Memo</label>
                <input
                  type="text"
                  value={invoiceForm.description}
                  onChange={(e) => setInvoiceForm({ ...invoiceForm, description: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-black/[0.06] bg-[#F2F2F7] text-[#1C1C1E] focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#007AFF]"
                  required
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-black/[0.05]">
              <button
                type="button"
                onClick={() => setIsCreateInvoiceModalOpen(false)}
                className="px-4 py-2.5 rounded-xl text-xs font-semibold text-[#8E8E93] hover:bg-[#F2F2F7] active:scale-95 transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-[#007AFF] hover:bg-[#0062CC] text-white shadow-md active:scale-95 transition-all"
              >
                Generate &amp; Dispatch Invoice
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Log Payment Modal (Manager Submission) */}
      {isLogPaymentModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <form
            onSubmit={handleLogPaymentSubmit}
            className="bg-white rounded-3xl max-w-lg w-full p-6 md:p-8 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto border border-black/[0.06] animate-in fade-in zoom-in-95 duration-200"
          >
            {/* Grabber Bar */}
            <div className="w-10 h-1 rounded-full bg-gray-300 mx-auto -mt-2 mb-2" />

            <div className="flex items-center justify-between border-b border-black/[0.05] pb-3.5">
              <div>
                <span className="text-[10px] font-bold text-[#34C759] uppercase font-mono">Manager Slip Logging Workflow</span>
                <h3 className="font-bold text-base text-[#1C1C1E]">Record Bank Deposit Advice</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsLogPaymentModalOpen(false)}
                className="p-2 rounded-full hover:bg-[#F2F2F7] text-[#8E8E93] hover:text-[#1C1C1E] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-[#1C1C1E] block mb-1">Target Invoice</label>
                <select
                  value={paymentForm.invoiceId}
                  onChange={(e) => {
                    const inv = invoices.find((i) => i.invoiceId === e.target.value);
                    setPaymentForm({
                      ...paymentForm,
                      invoiceId: e.target.value,
                      amountPaid: inv ? inv.amountDue : paymentForm.amountPaid
                    });
                  }}
                  className="w-full p-2.5 rounded-xl border border-black/[0.06] bg-[#F2F2F7] text-[#1C1C1E] focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#007AFF] font-medium"
                >
                  {invoices
                    .filter((i) => i.paymentStatus !== 'paid')
                    .map((i) => {
                      const t = tenants.find((ten) => ten.tenantId === i.tenantId);
                      return (
                        <option key={i.invoiceId} value={i.invoiceId}>
                          {i.invoiceNumber} - {t?.legalName} ({i.amountDue.toLocaleString()} ETB)
                        </option>
                      );
                    })}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-[#1C1C1E] block mb-1">Amount Paid (ETB)</label>
                  <input
                    type="number"
                    value={paymentForm.amountPaid}
                    onChange={(e) => setPaymentForm({ ...paymentForm, amountPaid: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-xl border border-black/[0.06] bg-[#F2F2F7] text-[#1C1C1E] focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#007AFF] font-mono font-bold"
                    required
                  />
                </div>

                <div>
                  <label className="font-semibold text-[#1C1C1E] block mb-1">Bank Payment Channel</label>
                  <select
                    value={paymentForm.paymentMethod}
                    onChange={(e) => setPaymentForm({ ...paymentForm, paymentMethod: e.target.value as any })}
                    className="w-full p-2.5 rounded-xl border border-black/[0.06] bg-[#F2F2F7] text-[#1C1C1E] focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#007AFF]"
                  >
                    <option value="cbe_birr">Commercial Bank of Ethiopia (CBE)</option>
                    <option value="telebirr">Telebirr Merchant</option>
                    <option value="awash_bank">Awash International Bank</option>
                    <option value="dashen_bank">Dashen Bank / Amole</option>
                    <option value="bank_of_abyssinia">Bank of Abyssinia (BOA)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-semibold text-[#1C1C1E] block mb-1">Bank Ref / Transaction Reference</label>
                <input
                  type="text"
                  value={paymentForm.referenceNumber}
                  onChange={(e) => setPaymentForm({ ...paymentForm, referenceNumber: e.target.value })}
                  placeholder="e.g. CBE-FT-98442145"
                  className="w-full p-2.5 rounded-xl border border-black/[0.06] bg-[#F2F2F7] text-[#1C1C1E] focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#007AFF] font-mono"
                  required
                />
              </div>

              <div>
                <label className="font-semibold text-[#1C1C1E] block mb-1">Manager Reconciliation Notes</label>
                <textarea
                  value={paymentForm.notes}
                  onChange={(e) => setPaymentForm({ ...paymentForm, notes: e.target.value })}
                  rows={2}
                  className="w-full p-2.5 rounded-xl border border-black/[0.06] bg-[#F2F2F7] text-[#1C1C1E] focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#007AFF]"
                />
              </div>

              <div className="p-3.5 bg-[#34C759]/10 rounded-2xl border border-[#34C759]/20 text-[11px] text-[#34C759] flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#34C759] shrink-0 mt-0.5" />
                <span className="text-[#1C1C1E]">
                  This will generate the digital bank advice slip and submit it to <code>/payments</code> in <strong className="text-[#FF9500]">unverified</strong> status for Owner inspection in the Vault.
                </span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-black/[0.05]">
              <button
                type="button"
                onClick={() => setIsLogPaymentModalOpen(false)}
                className="px-4 py-2.5 rounded-xl text-xs font-semibold text-[#8E8E93] hover:bg-[#F2F2F7] active:scale-95 transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-[#34C759] hover:bg-[#2EB150] text-white shadow-md flex items-center gap-1.5 active:scale-95 transition-all"
              >
                <Upload className="w-3.5 h-3.5" />
                Submit to Verification Vault
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
