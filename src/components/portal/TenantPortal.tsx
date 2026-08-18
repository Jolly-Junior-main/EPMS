import React, { useState } from 'react';
import { usePMS } from '../../context/PMSContext';
import {
  Building2,
  Calendar,
  CreditCard,
  FileCheck2,
  FileText,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Send,
  Upload,
  ShieldCheck,
  Wrench,
  Sparkles,
  Phone,
  Mail,
  ChevronRight,
  Printer,
  Download,
  QrCode,
  DollarSign,
  PlusCircle,
  HelpCircle,
  X,
  ArrowUpRight,
  Eye
} from 'lucide-react';
import { MaintenanceCategory, MaintenancePriority, Payment } from '../../types/pms';
import { generateBankReceiptSvg } from '../../data/mockData';

export const TenantPortal: React.FC = () => {
  const {
    currentUser,
    tenants,
    units,
    properties,
    invoices,
    payments,
    maintenanceRequests,
    renewalRequests,
    logPayment,
    createMaintenanceRequest,
    submitRenewalRequest
  } = usePMS();

  // Find tenant data (defaults to first tenant if logged in as admin/manager previewing)
  const currentTenant = tenants.find((t) => t.tenantId === currentUser.uid) || tenants[0];
  const assignedUnit = units.find((u) => u.unitId === currentTenant?.assignedUnitId) || units[0];
  const assignedProperty = properties.find((p) => p.propertyId === currentTenant?.propertyId) || properties[0];

  // Active view tab inside portal
  const [portalTab, setPortalTab] = useState<'overview' | 'invoices' | 'maintenance' | 'lease'>('overview');

  // Payment Slip Upload Modal state
  const [isPayModalOpen, setIsPayModalOpen] = useState(false);
  const [selectedInvoiceId, setSelectedInvoiceId] = useState<string>('');
  const [payAmount, setPayAmount] = useState<number>(0);
  const [payMethod, setPayMethod] = useState<Payment['paymentMethod']>('telebirr');
  const [payRef, setPayRef] = useState<string>('');
  const [payNotes, setPayNotes] = useState<string>('');

  // Maintenance Ticket Modal state
  const [isMaintModalOpen, setIsMaintModalOpen] = useState(false);
  const [maintTitle, setMaintTitle] = useState('');
  const [maintCategory, setMaintCategory] = useState<MaintenanceCategory>('plumbing');
  const [maintPriority, setMaintPriority] = useState<MaintenancePriority>('medium');
  const [maintDesc, setMaintDesc] = useState('');

  // Lease Renewal Modal state
  const [isRenewalModalOpen, setIsRenewalModalOpen] = useState(false);
  const [renewalMonths, setRenewalMonths] = useState(12);
  const [renewalNotes, setRenewalNotes] = useState('');

  // Digital Receipt Viewer Modal state
  const [viewingPayment, setViewingPayment] = useState<Payment | null>(null);

  if (!currentTenant) {
    return (
      <div className="p-8 text-center bg-white rounded-3xl border border-black/[0.06] shadow-sm">
        <p className="text-sm font-semibold text-[#8E8E93]">No active tenant record linked to this account.</p>
      </div>
    );
  }

  // Filter tenant-specific data
  const tenantInvoices = invoices.filter((i) => i.tenantId === currentTenant.tenantId);
  const tenantPayments = payments.filter((p) => p.tenantId === currentTenant.tenantId);
  const tenantMaintRequests = maintenanceRequests.filter((m) => m.tenantId === currentTenant.tenantId);
  const tenantRenewals = renewalRequests.filter((r) => r.tenantId === currentTenant.tenantId);

  // Financial calculations
  const unpaidInvoices = tenantInvoices.filter((i) => i.paymentStatus !== 'paid');
  const totalOutstanding = unpaidInvoices.reduce((sum, i) => sum + i.amountDue, 0);

  // Lease time calculation
  const leaseEndDate = new Date(currentTenant.leaseEndDate);
  const today = new Date('2026-08-18T00:00:00Z');
  const daysRemaining = Math.max(0, Math.ceil((leaseEndDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)));

  // Open Payment modal for specific invoice
  const handleOpenPay = (invId?: string, amount?: number) => {
    const targetInv = invId ? tenantInvoices.find((i) => i.invoiceId === invId) : unpaidInvoices[0];
    if (targetInv) {
      setSelectedInvoiceId(targetInv.invoiceId);
      setPayAmount(amount || targetInv.amountDue);
      setPayRef(`REF-${Date.now().toString().slice(-6)}`);
      setIsPayModalOpen(true);
    }
  };

  const handlePaySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedInvoiceId || payAmount <= 0 || !payRef.trim()) return;

    const receiptSvg = generateBankReceiptSvg({
      referenceNumber: payRef.trim(),
      amountPaid: payAmount,
      tenantName: currentTenant.legalName,
      unitNumber: assignedUnit.unitNumber,
      paymentMethod: payMethod,
      timestamp: new Date().toISOString()
    });

    logPayment({
      invoiceId: selectedInvoiceId,
      tenantId: currentTenant.tenantId,
      unitId: assignedUnit.unitId,
      amountPaid: payAmount,
      paymentMethod: payMethod,
      referenceNumber: payRef.trim(),
      receiptImageUrl: receiptSvg,
      notes: payNotes || `Direct submission via Tenant Self-Service Portal (${payMethod.toUpperCase()})`
    });

    setIsPayModalOpen(false);
    setPayNotes('');
  };

  const handleMaintSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!maintTitle.trim() || !maintDesc.trim()) return;

    createMaintenanceRequest({
      tenantId: currentTenant.tenantId,
      tenantName: currentTenant.legalName,
      unitId: assignedUnit.unitId,
      unitNumber: assignedUnit.unitNumber,
      propertyId: currentTenant.propertyId,
      category: maintCategory,
      priority: maintPriority,
      status: 'reported',
      title: maintTitle.trim(),
      description: maintDesc.trim()
    });

    setIsMaintModalOpen(false);
    setMaintTitle('');
    setMaintDesc('');
  };

  const handleRenewalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitRenewalRequest({
      tenantId: currentTenant.tenantId,
      tenantName: currentTenant.legalName,
      unitNumber: assignedUnit.unitNumber,
      currentLeaseEndDate: currentTenant.leaseEndDate,
      requestedExtensionMonths: renewalMonths,
      notes: renewalNotes
    });

    setIsRenewalModalOpen(false);
    setRenewalNotes('');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-12">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#1C1C1E] via-[#2C2C2E] to-[#1C1C1E] text-white p-6 sm:p-8 shadow-[0_12px_40px_rgba(0,0,0,0.15)] border border-white/10">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 rounded-full bg-[#007AFF]/15 blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2.5">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#007AFF]/25 text-[#0A84FF] border border-[#007AFF]/40 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5" />
                Verified Commercial Leaseholder
              </span>
              <span className="text-xs text-white/50">•</span>
              <span className="text-xs text-white/70 font-mono">TIN: {currentTenant.tinNumber || '0098442109'}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              {currentTenant.legalName}
            </h1>
            {currentTenant.businessTradeName && (
              <p className="text-sm font-medium text-white/70 flex items-center gap-2">
                <span>Trade: {currentTenant.businessTradeName}</span>
              </p>
            )}
            <p className="text-xs text-white/60 flex flex-wrap items-center gap-3 pt-1">
              <span className="flex items-center gap-1">
                <Building2 className="w-3.5 h-3.5 text-[#0A84FF]" />
                {assignedProperty.name}
              </span>
              <span>•</span>
              <span className="font-semibold text-white/90">Unit: {assignedUnit.unitNumber}</span>
              <span>•</span>
              <span>Floor: {assignedUnit.floor} ({assignedUnit.areaSqMeters} m²)</span>
            </p>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap gap-2.5 sm:self-center">
            {unpaidInvoices.length > 0 && (
              <button
                onClick={() => handleOpenPay()}
                className="px-4 py-2.5 rounded-2xl bg-[#34C759] text-white text-xs font-bold hover:bg-[#2EB14F] active:scale-95 transition-all shadow-lg shadow-emerald-500/25 flex items-center gap-2 cursor-pointer"
              >
                <Upload className="w-4 h-4" />
                Upload Payment Slip
              </button>
            )}
            <button
              onClick={() => setIsMaintModalOpen(true)}
              className="px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold backdrop-blur-md active:scale-95 transition-all flex items-center gap-2 border border-white/10 cursor-pointer"
            >
              <Wrench className="w-4 h-4 text-[#FF9500]" />
              Report Issue
            </button>
            <button
              onClick={() => setIsRenewalModalOpen(true)}
              className="px-4 py-2.5 rounded-2xl bg-[#007AFF] hover:bg-[#0062CC] text-white text-xs font-semibold active:scale-95 transition-all shadow-md shadow-blue-500/20 flex items-center gap-2 cursor-pointer"
            >
              <Calendar className="w-4 h-4" />
              Request Renewal
            </button>
          </div>
        </div>

        {/* Quick Highlights Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-white/10 text-xs">
          <div className="bg-white/5 rounded-2xl p-3.5 backdrop-blur-sm border border-white/5">
            <span className="text-white/60 block text-[11px] font-medium">Monthly Rent</span>
            <span className="text-base font-bold text-white tracking-tight mt-0.5 block">
              {currentTenant.monthlyRentETB.toLocaleString()} ETB
            </span>
          </div>
          <div className="bg-white/5 rounded-2xl p-3.5 backdrop-blur-sm border border-white/5">
            <span className="text-white/60 block text-[11px] font-medium">Security Deposit</span>
            <span className="text-base font-bold text-emerald-400 tracking-tight mt-0.5 block">
              {currentTenant.securityDepositETB.toLocaleString()} ETB
            </span>
          </div>
          <div className="bg-white/5 rounded-2xl p-3.5 backdrop-blur-sm border border-white/5">
            <span className="text-white/60 block text-[11px] font-medium">Lease Expiry</span>
            <span className="text-base font-bold text-white tracking-tight mt-0.5 block">
              {currentTenant.leaseEndDate}
            </span>
            <span className="text-[10px] text-amber-400 font-medium">
              {daysRemaining} days remaining
            </span>
          </div>
          <div className="bg-white/5 rounded-2xl p-3.5 backdrop-blur-sm border border-white/5">
            <span className="text-white/60 block text-[11px] font-medium">Payment Status</span>
            <span
              className={`text-base font-bold tracking-tight mt-0.5 block ${
                totalOutstanding > 0 ? 'text-[#FF3B30]' : 'text-[#34C759]'
              }`}
            >
              {totalOutstanding > 0 ? `${totalOutstanding.toLocaleString()} ETB Due` : 'Current & Settled'}
            </span>
          </div>
        </div>
      </div>

      {/* Segmented Navigation */}
      <div className="flex items-center gap-2 p-1.5 bg-[#E5E5EA] rounded-2xl max-w-xl">
        <button
          onClick={() => setPortalTab('overview')}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold transition-all ${
            portalTab === 'overview'
              ? 'bg-white text-[#1C1C1E] shadow-sm'
              : 'text-[#8E8E93] hover:text-[#1C1C1E]'
          }`}
        >
          Portal Overview
        </button>
        <button
          onClick={() => setPortalTab('invoices')}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-1.5 ${
            portalTab === 'invoices'
              ? 'bg-white text-[#1C1C1E] shadow-sm'
              : 'text-[#8E8E93] hover:text-[#1C1C1E]'
          }`}
        >
          <span>Rent &amp; Slips</span>
          {unpaidInvoices.length > 0 && (
            <span className="px-1.5 py-0.2 rounded-full bg-[#FF3B30] text-white text-[10px] font-bold">
              {unpaidInvoices.length}
            </span>
          )}
        </button>
        <button
          onClick={() => setPortalTab('maintenance')}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-1.5 ${
            portalTab === 'maintenance'
              ? 'bg-white text-[#1C1C1E] shadow-sm'
              : 'text-[#8E8E93] hover:text-[#1C1C1E]'
          }`}
        >
          <span>Maintenance</span>
          {tenantMaintRequests.filter((m) => m.status !== 'completed').length > 0 && (
            <span className="px-1.5 py-0.2 rounded-full bg-[#007AFF] text-white text-[10px] font-bold">
              {tenantMaintRequests.filter((m) => m.status !== 'completed').length}
            </span>
          )}
        </button>
        <button
          onClick={() => setPortalTab('lease')}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold transition-all ${
            portalTab === 'lease'
              ? 'bg-white text-[#1C1C1E] shadow-sm'
              : 'text-[#8E8E93] hover:text-[#1C1C1E]'
          }`}
        >
          Lease &amp; Vault
        </button>
      </div>

      {/* TAB 1: OVERVIEW */}
      {portalTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left 2 Cols: Invoices Action & Active Service Tickets */}
          <div className="lg:col-span-2 space-y-6">
            {/* Outstanding Balance Banner if any */}
            {totalOutstanding > 0 ? (
              <div className="p-6 rounded-3xl bg-gradient-to-br from-[#FF3B30]/10 via-[#FF3B30]/5 to-transparent border border-[#FF3B30]/20 space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-[#FF3B30]/20 text-[#FF3B30] flex items-center justify-center shrink-0">
                      <AlertTriangle className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-[#1C1C1E]">
                        Pending Rent Remittance: {totalOutstanding.toLocaleString()} ETB
                      </h3>
                      <p className="text-xs text-[#8E8E93]">
                        {unpaidInvoices.length} invoice(s) currently awaiting bank advice slip or owner verification.
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleOpenPay()}
                    className="px-4 py-2 bg-[#FF3B30] text-white text-xs font-bold rounded-xl hover:bg-[#D70015] active:scale-95 transition-all shadow-md shadow-red-500/20 shrink-0 cursor-pointer"
                  >
                    Pay / Submit Slip
                  </button>
                </div>

                <div className="space-y-2">
                  {unpaidInvoices.map((inv) => (
                    <div
                      key={inv.invoiceId}
                      className="p-3.5 bg-white rounded-2xl border border-black/[0.04] flex items-center justify-between gap-3 text-xs shadow-sm"
                    >
                      <div>
                        <div className="font-semibold text-[#1C1C1E]">{inv.billingPeriod} • {inv.invoiceNumber}</div>
                        <div className="text-[11px] text-[#8E8E93]">Due: {inv.dueDate}</div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-mono font-bold text-[#1C1C1E]">
                          {inv.amountDue.toLocaleString()} ETB
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            inv.paymentStatus === 'submitted_for_verification'
                              ? 'bg-amber-500/10 text-amber-600 border border-amber-500/20'
                              : 'bg-red-500/10 text-red-600 border border-red-500/20'
                          }`}
                        >
                          {inv.paymentStatus === 'submitted_for_verification' ? 'Slip In Vault' : 'Unpaid'}
                        </span>
                        {inv.paymentStatus !== 'submitted_for_verification' && (
                          <button
                            onClick={() => handleOpenPay(inv.invoiceId, inv.amountDue)}
                            className="px-2.5 py-1 rounded-lg bg-[#007AFF] text-white text-[11px] font-semibold hover:bg-[#0062CC] transition-all cursor-pointer"
                          >
                            Submit Slip
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="p-6 rounded-3xl bg-emerald-50 border border-emerald-200/60 flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-emerald-950">Account in Good Standing</h3>
                  <p className="text-xs text-emerald-800/80">
                    All monthly rent invoices have been paid and verified. Thank you for your on-time remittances!
                  </p>
                </div>
              </div>
            )}

            {/* Active Facility Maintenance Tickets */}
            <div className="bg-white rounded-3xl p-6 border border-black/[0.06] shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Wrench className="w-4 h-4 text-[#007AFF]" />
                  <h3 className="text-sm font-bold text-[#1C1C1E]">Unit Maintenance &amp; Work Orders</h3>
                </div>
                <button
                  onClick={() => setIsMaintModalOpen(true)}
                  className="text-xs text-[#007AFF] hover:underline font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  New Request
                </button>
              </div>

              {tenantMaintRequests.length === 0 ? (
                <div className="text-center py-6 text-xs text-[#8E8E93]">
                  No maintenance requests reported for Unit {assignedUnit.unitNumber}.
                </div>
              ) : (
                <div className="space-y-3">
                  {tenantMaintRequests.map((req) => (
                    <div
                      key={req.requestId}
                      className="p-4 rounded-2xl bg-[#F2F2F7] border border-black/[0.04] space-y-2"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded-full bg-black/10 text-[#1C1C1E]">
                            {req.ticketNumber}
                          </span>
                          <span className="font-bold text-xs text-[#1C1C1E]">{req.title}</span>
                        </div>
                        <span
                          className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                            req.status === 'completed'
                              ? 'bg-emerald-500/15 text-emerald-700'
                              : req.status === 'in_progress'
                              ? 'bg-blue-500/15 text-blue-700'
                              : req.status === 'scheduled'
                              ? 'bg-amber-500/15 text-amber-700'
                              : 'bg-zinc-500/15 text-zinc-700'
                          }`}
                        >
                          {req.status.replace('_', ' ')}
                        </span>
                      </div>
                      <p className="text-xs text-[#3A3A3C] leading-relaxed">{req.description}</p>
                      <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-black/[0.05] text-[11px] text-[#8E8E93]">
                        <span>Reported: {req.reportedDate.split('T')[0]}</span>
                        {req.assignedTechnician && (
                          <span className="text-[#007AFF] font-medium flex items-center gap-1">
                            <span>Technician: {req.assignedTechnician}</span>
                            {req.technicianPhone && <span>({req.technicianPhone})</span>}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Property Manager Contact & Lease Brief */}
          <div className="space-y-6">
            {/* Property Operations Manager Card */}
            <div className="bg-white rounded-3xl p-6 border border-black/[0.06] shadow-sm space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#8E8E93]">
                Assigned Property Management
              </h3>
              <div className="flex items-center gap-3">
                <img
                  src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80"
                  alt="Manager"
                  className="w-12 h-12 rounded-2xl object-cover ring-2 ring-black/5"
                />
                <div>
                  <div className="text-xs font-bold text-[#1C1C1E]">Hanna Tadesse</div>
                  <div className="text-[11px] text-[#8E8E93]">Property Operations Desk</div>
                  <div className="text-[10px] text-[#007AFF] font-medium">{assignedProperty.name}</div>
                </div>
              </div>

              <div className="p-3 bg-[#F2F2F7] rounded-2xl space-y-2 text-xs">
                <div className="flex items-center gap-2 text-[#3A3A3C]">
                  <Phone className="w-3.5 h-3.5 text-[#007AFF]" />
                  <span>+251 91 234 5678 (Direct / WhatsApp)</span>
                </div>
                <div className="flex items-center gap-2 text-[#3A3A3C]">
                  <Mail className="w-3.5 h-3.5 text-[#007AFF]" />
                  <span>hanna.tadesse@boleplaza.et</span>
                </div>
                <div className="flex items-center gap-2 text-[#3A3A3C]">
                  <Clock className="w-3.5 h-3.5 text-[#007AFF]" />
                  <span>Office: Mon–Sat 8:30 AM – 6:00 PM</span>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-[11px] text-amber-900 leading-relaxed">
                🚨 <strong>24/7 Security &amp; Facilities Emergency:</strong> Dial +251 91 999 0000 for immediate response.
              </div>
            </div>

            {/* Lease Renewal Widget */}
            <div className="bg-white rounded-3xl p-6 border border-black/[0.06] shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#8E8E93]">Lease Agreement</h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700">
                  Active
                </span>
              </div>
              <div className="space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-[#8E8E93]">Term:</span>
                  <span className="font-semibold text-[#1C1C1E]">
                    {currentTenant.leaseStartDate} &rarr; {currentTenant.leaseEndDate}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#8E8E93]">Renewal Status:</span>
                  <span className="font-semibold text-[#007AFF]">
                    {tenantRenewals.length > 0 ? `${tenantRenewals[0].requestedExtensionMonths} Mo Requested (${tenantRenewals[0].status})` : 'Eligible for Extension'}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setIsRenewalModalOpen(true)}
                className="w-full py-2.5 rounded-xl bg-[#007AFF]/10 text-[#007AFF] hover:bg-[#007AFF]/20 text-xs font-semibold transition-all cursor-pointer"
              >
                Apply for Lease Extension
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: INVOICES & VERIFIED RECEIPTS */}
      {portalTab === 'invoices' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-black/[0.06] shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-bold text-[#1C1C1E]">Rent Invoices &amp; Verified Payment Slips</h3>
                <p className="text-xs text-[#8E8E93]">
                  All remittances submitted here are digitally signed and routed to the Owner's Receipt Verification Vault.
                </p>
              </div>
              <button
                onClick={() => handleOpenPay()}
                className="px-4 py-2 rounded-xl bg-[#34C759] text-white text-xs font-bold hover:bg-[#2EB14F] active:scale-95 transition-all shadow-md shadow-emerald-500/20 flex items-center gap-2 cursor-pointer"
              >
                <PlusCircle className="w-4 h-4" />
                Submit New Bank Slip
              </button>
            </div>

            {/* Invoices Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-black/[0.06] text-[#8E8E93] font-medium">
                    <th className="py-3 px-3">Invoice #</th>
                    <th className="py-3 px-3">Period</th>
                    <th className="py-3 px-3">Due Date</th>
                    <th className="py-3 px-3">Amount Due</th>
                    <th className="py-3 px-3">Status</th>
                    <th className="py-3 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/[0.04]">
                  {tenantInvoices.map((inv) => (
                    <tr key={inv.invoiceId} className="hover:bg-black/[0.02] transition-colors">
                      <td className="py-3.5 px-3 font-mono font-bold text-[#1C1C1E]">{inv.invoiceNumber}</td>
                      <td className="py-3.5 px-3 text-[#3A3A3C]">{inv.billingPeriod}</td>
                      <td className="py-3.5 px-3 text-[#8E8E93]">{inv.dueDate}</td>
                      <td className="py-3.5 px-3 font-mono font-bold text-[#1C1C1E]">
                        {inv.amountDue.toLocaleString()} ETB
                      </td>
                      <td className="py-3.5 px-3">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            inv.paymentStatus === 'paid'
                              ? 'bg-emerald-500/10 text-emerald-700'
                              : inv.paymentStatus === 'submitted_for_verification'
                              ? 'bg-blue-500/10 text-blue-700'
                              : 'bg-red-500/10 text-red-700'
                          }`}
                        >
                          {inv.paymentStatus === 'submitted_for_verification'
                            ? 'Submitted (In Vault)'
                            : inv.paymentStatus.toUpperCase()}
                        </span>
                      </td>
                      <td className="py-3.5 px-3 text-right">
                        {inv.paymentStatus === 'paid' ? (
                          <span className="text-emerald-600 font-semibold flex items-center justify-end gap-1 text-[11px]">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Verified
                          </span>
                        ) : (
                          <button
                            onClick={() => handleOpenPay(inv.invoiceId, inv.amountDue)}
                            className="px-3 py-1.5 rounded-xl bg-[#007AFF] text-white text-[11px] font-semibold hover:bg-[#0062CC] active:scale-95 transition-all shadow-sm cursor-pointer"
                          >
                            Submit Slip
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Past Payments & Digital Receipts */}
          <div className="bg-white rounded-3xl p-6 border border-black/[0.06] shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-[#1C1C1E]">Official Payment Receipts &amp; Bank Advices</h3>
            {tenantPayments.length === 0 ? (
              <div className="text-center py-6 text-xs text-[#8E8E93]">No payment records found.</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {tenantPayments.map((pay) => (
                  <div
                    key={pay.paymentId}
                    className="p-4 rounded-2xl bg-[#F2F2F7] border border-black/[0.04] space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <CreditCard className="w-4 h-4 text-[#007AFF]" />
                        <span className="font-mono text-xs font-bold text-[#1C1C1E]">
                          Ref: {pay.referenceNumber}
                        </span>
                      </div>
                      <span
                        className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                          pay.verificationStatus === 'verified'
                            ? 'bg-emerald-500/15 text-emerald-700'
                            : pay.verificationStatus === 'rejected'
                            ? 'bg-red-500/15 text-red-700'
                            : 'bg-amber-500/15 text-amber-700'
                        }`}
                      >
                        {pay.verificationStatus}
                      </span>
                    </div>

                    <div className="flex justify-between items-center text-xs">
                      <div>
                        <span className="text-[#8E8E93] text-[11px] block">Channel / Gateway</span>
                        <span className="font-semibold text-[#1C1C1E] uppercase">{pay.paymentMethod.replace('_', ' ')}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-[#8E8E93] text-[11px] block">Amount Credited</span>
                        <span className="font-mono font-bold text-sm text-[#1C1C1E]">
                          {pay.amountPaid.toLocaleString()} ETB
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-black/[0.05] text-[11px]">
                      <span className="text-[#8E8E93]">Submitted: {pay.submittedAt.split('T')[0]}</span>
                      <button
                        onClick={() => setViewingPayment(pay)}
                        className="px-2.5 py-1 rounded-lg bg-white border border-black/[0.08] text-[#007AFF] hover:bg-blue-50 font-semibold flex items-center gap-1 transition-all cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        View Receipt
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: MAINTENANCE */}
      {portalTab === 'maintenance' && (
        <div className="bg-white rounded-3xl p-6 border border-black/[0.06] shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-black/[0.06]">
            <div>
              <h3 className="text-base font-bold text-[#1C1C1E]">Facilities Maintenance &amp; Work Order Tracker</h3>
              <p className="text-xs text-[#8E8E93]">
                Report plumbing, electrical, HVAC, or structural issues directly to our facilities dispatch team.
              </p>
            </div>
            <button
              onClick={() => setIsMaintModalOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-[#007AFF] text-white text-xs font-bold hover:bg-[#0062CC] active:scale-95 transition-all shadow-md shadow-blue-500/20 flex items-center gap-2 cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              Report New Issue
            </button>
          </div>

          <div className="space-y-4">
            {tenantMaintRequests.length === 0 ? (
              <div className="text-center py-12 text-xs text-[#8E8E93] space-y-2">
                <Wrench className="w-8 h-8 text-[#8E8E93]/40 mx-auto" />
                <p>No maintenance tickets found for Unit {assignedUnit.unitNumber}.</p>
              </div>
            ) : (
              tenantMaintRequests.map((req) => (
                <div
                  key={req.requestId}
                  className="p-5 rounded-2xl bg-[#F2F2F7] border border-black/[0.05] space-y-3 hover:border-black/[0.1] transition-all"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <span className="font-mono text-xs font-bold px-2.5 py-0.5 rounded-lg bg-black/10 text-[#1C1C1E]">
                        {req.ticketNumber}
                      </span>
                      <span
                        className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                          req.priority === 'emergency'
                            ? 'bg-red-500 text-white'
                            : req.priority === 'high'
                            ? 'bg-orange-500 text-white'
                            : req.priority === 'medium'
                            ? 'bg-amber-500 text-white'
                            : 'bg-zinc-500 text-white'
                        }`}
                      >
                        {req.priority}
                      </span>
                      <span className="text-xs font-bold text-[#1C1C1E]">{req.title}</span>
                    </div>
                    <span
                      className={`text-xs font-bold uppercase px-3 py-1 rounded-xl self-start sm:self-auto ${
                        req.status === 'completed'
                          ? 'bg-emerald-500 text-white'
                          : req.status === 'in_progress'
                          ? 'bg-[#007AFF] text-white'
                          : 'bg-amber-500 text-white'
                      }`}
                    >
                      {req.status.replace('_', ' ')}
                    </span>
                  </div>

                  <p className="text-xs text-[#3A3A3C] leading-relaxed">{req.description}</p>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-3 border-t border-black/[0.05] text-[11px] text-[#8E8E93]">
                    <div>
                      <span className="block text-[10px]">Category:</span>
                      <span className="font-semibold text-[#1C1C1E] capitalize">{req.category}</span>
                    </div>
                    <div>
                      <span className="block text-[10px]">Reported Date:</span>
                      <span className="font-semibold text-[#1C1C1E]">{req.reportedDate.split('T')[0]}</span>
                    </div>
                    <div>
                      <span className="block text-[10px]">Assigned Specialist:</span>
                      <span className="font-semibold text-[#007AFF]">
                        {req.assignedTechnician || 'Dispatching Technician...'}
                      </span>
                    </div>
                  </div>
                  {req.resolutionNotes && (
                    <div className="p-3 bg-white rounded-xl text-xs text-[#1C1C1E] border border-black/[0.05]">
                      <span className="font-bold text-[#34C759] block mb-0.5">Technician Resolution:</span>
                      {req.resolutionNotes}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* TAB 4: LEASE CONTRACT & VAULT */}
      {portalTab === 'lease' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-black/[0.06] shadow-sm space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-black/[0.06]">
              <div>
                <h3 className="text-base font-bold text-[#1C1C1E]">Commercial Lease Terms Summary</h3>
                <p className="text-xs text-[#8E8E93]">Registered under Addis Ababa City Administration Registry</p>
              </div>
              <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-700 text-xs font-bold">
                Contract In Effect
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-2xl bg-[#F2F2F7] space-y-1">
                <span className="text-[#8E8E93] text-[11px] block">Premises Designation</span>
                <span className="font-bold text-sm text-[#1C1C1E]">Unit {assignedUnit.unitNumber}</span>
                <span className="text-[#8E8E93] block">{assignedProperty.name}</span>
              </div>
              <div className="p-4 rounded-2xl bg-[#F2F2F7] space-y-1">
                <span className="text-[#8E8E93] text-[11px] block">Leased Floor Area</span>
                <span className="font-bold text-sm text-[#1C1C1E]">{assignedUnit.areaSqMeters} m² (Net Leasable)</span>
                <span className="text-[#8E8E93] block">Floor {assignedUnit.floor}</span>
              </div>
              <div className="p-4 rounded-2xl bg-[#F2F2F7] space-y-1">
                <span className="text-[#8E8E93] text-[11px] block">Monthly Base Rental</span>
                <span className="font-bold text-sm text-[#1C1C1E] font-mono">
                  {currentTenant.monthlyRentETB.toLocaleString()} ETB / Month
                </span>
                <span className="text-[#8E8E93] block">Payable in advance by 1st of each month</span>
              </div>
              <div className="p-4 rounded-2xl bg-[#F2F2F7] space-y-1">
                <span className="text-[#8E8E93] text-[11px] block">Security Deposit in Escrow</span>
                <span className="font-bold text-sm text-emerald-600 font-mono">
                  {currentTenant.securityDepositETB.toLocaleString()} ETB
                </span>
                <span className="text-[#8E8E93] block">Refundable at end of lease term</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#007AFF]/5 border border-[#007AFF]/15 space-y-2 text-xs">
              <h4 className="font-bold text-[#007AFF]">Commercial Lease Covenants &amp; Terms</h4>
              <ul className="list-disc list-inside space-y-1 text-[#3A3A3C] text-[11px] leading-relaxed">
                <li>Usage permitted strictly for approved commercial trade (Cafe, Bistro &amp; Roastery).</li>
                <li>Annual escalation capped at 5% upon mutual extension request.</li>
                <li>Utility consumption (Water &amp; Sub-metered Electricity) billed monthly as per actual readings.</li>
              </ul>
            </div>
          </div>

          {/* Stored Lease Documents */}
          <div className="bg-white rounded-3xl p-6 border border-black/[0.06] shadow-sm space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#8E8E93]">Document Vault</h3>
            <div className="space-y-3">
              <div className="p-3.5 rounded-2xl bg-[#F2F2F7] flex items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-2.5">
                  <FileText className="w-4 h-4 text-[#007AFF]" />
                  <div>
                    <div className="font-semibold text-[#1C1C1E]">Signed_Lease_Agreement_2026.pdf</div>
                    <div className="text-[10px] text-[#8E8E93]">Official Notarized PDF • 2.4 MB</div>
                  </div>
                </div>
                <button
                  onClick={() => alert('Downloading official signed lease agreement...')}
                  className="p-1.5 rounded-lg hover:bg-white text-[#007AFF] transition-colors cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                </button>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#F2F2F7] flex items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-2.5">
                  <FileText className="w-4 h-4 text-emerald-600" />
                  <div>
                    <div className="font-semibold text-[#1C1C1E]">Business_License_TIN_Auth.pdf</div>
                    <div className="text-[10px] text-[#8E8E93]">Ministry of Trade &amp; Industry • 1.1 MB</div>
                  </div>
                </div>
                <button
                  onClick={() => alert('Downloading certified business license...')}
                  className="p-1.5 rounded-lg hover:bg-white text-[#007AFF] transition-colors cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </div>

            <button
              onClick={() => setIsRenewalModalOpen(true)}
              className="w-full py-3 rounded-2xl bg-[#007AFF] text-white text-xs font-bold hover:bg-[#0062CC] active:scale-95 transition-all shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 cursor-pointer mt-4"
            >
              <Calendar className="w-4 h-4" />
              Request Lease Extension
            </button>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 1: UPLOAD PAYMENT SLIP */}
      {/* ========================================================= */}
      {isPayModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-black/[0.06] space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-[#34C759]/15 text-[#34C759] flex items-center justify-center">
                  <Upload className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold text-[#1C1C1E]">Upload Bank Payment Advice</h3>
              </div>
              <button
                onClick={() => setIsPayModalOpen(false)}
                className="p-1 rounded-full text-[#8E8E93] hover:bg-black/5"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handlePaySubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-[#3A3A3C] mb-1">Target Invoice</label>
                <select
                  value={selectedInvoiceId}
                  onChange={(e) => {
                    setSelectedInvoiceId(e.target.value);
                    const inv = tenantInvoices.find((i) => i.invoiceId === e.target.value);
                    if (inv) setPayAmount(inv.amountDue);
                  }}
                  className="w-full p-2.5 rounded-xl bg-[#F2F2F7] border border-black/[0.05] font-semibold text-[#1C1C1E] outline-none focus:bg-white focus:border-[#007AFF]"
                >
                  {tenantInvoices.map((inv) => (
                    <option key={inv.invoiceId} value={inv.invoiceId}>
                      {inv.billingPeriod} • {inv.invoiceNumber} ({inv.amountDue.toLocaleString()} ETB)
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#3A3A3C] mb-1">Payment Method</label>
                  <select
                    value={payMethod}
                    onChange={(e) => setPayMethod(e.target.value as Payment['paymentMethod'])}
                    className="w-full p-2.5 rounded-xl bg-[#F2F2F7] border border-black/[0.05] font-semibold text-[#1C1C1E] outline-none focus:bg-white focus:border-[#007AFF]"
                  >
                    <option value="telebirr">Telebirr SuperApp</option>
                    <option value="cbe_birr">CBE Birr / Commercial Bank</option>
                    <option value="awash_bank">Awash Bank Mobile</option>
                    <option value="dashen_bank">Dashen Bank / Amole</option>
                    <option value="bank_of_abyssinia">Bank of Abyssinia (BoA)</option>
                    <option value="bank_transfer">Direct Bank Wire (EFT)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-[#3A3A3C] mb-1">Amount Paid (ETB)</label>
                  <input
                    type="number"
                    value={payAmount}
                    onChange={(e) => setPayAmount(Number(e.target.value))}
                    required
                    className="w-full p-2.5 rounded-xl bg-[#F2F2F7] border border-black/[0.05] font-mono font-bold text-[#1C1C1E] outline-none focus:bg-white focus:border-[#007AFF]"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="font-semibold text-[#3A3A3C]">Bank Transaction Reference / FT Number</label>
                  <button
                    type="button"
                    onClick={() => setPayRef(`TX-${Math.floor(100000 + Math.random() * 900000)}`)}
                    className="text-[10px] text-[#007AFF] font-medium hover:underline"
                  >
                    Generate Test Ref
                  </button>
                </div>
                <input
                  type="text"
                  placeholder="e.g. FT262287491002"
                  value={payRef}
                  onChange={(e) => setPayRef(e.target.value)}
                  required
                  className="w-full p-2.5 rounded-xl bg-[#F2F2F7] border border-black/[0.05] font-mono font-bold text-[#1C1C1E] outline-none focus:bg-white focus:border-[#007AFF]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#3A3A3C] mb-1">Remarks / Note to Owner (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Cleared via Bole Medhanialem branch counter"
                  value={payNotes}
                  onChange={(e) => setPayNotes(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-[#F2F2F7] border border-black/[0.05] text-[#1C1C1E] outline-none focus:bg-white focus:border-[#007AFF]"
                />
              </div>

              <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200/60 text-[11px] text-emerald-900 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Submitted slip generates an SVG bank advice and queues in Owner Receipt Vault.</span>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsPayModalOpen(false)}
                  className="flex-1 py-3 rounded-xl bg-[#F2F2F7] text-[#1C1C1E] font-semibold hover:bg-[#E5E5EA] transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl bg-[#34C759] text-white font-bold hover:bg-[#2EB14F] active:scale-95 transition-all shadow-md shadow-emerald-500/25 cursor-pointer"
                >
                  Submit Payment Advice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 2: REPORT MAINTENANCE ISSUE */}
      {/* ========================================================= */}
      {isMaintModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-black/[0.06] space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-[#FF9500]/15 text-[#FF9500] flex items-center justify-center">
                  <Wrench className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold text-[#1C1C1E]">Report Unit Maintenance Issue</h3>
              </div>
              <button
                onClick={() => setIsMaintModalOpen(false)}
                className="p-1 rounded-full text-[#8E8E93] hover:bg-black/5"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleMaintSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-[#3A3A3C] mb-1">Issue Title</label>
                <input
                  type="text"
                  placeholder="e.g. Main water supply pressure drop"
                  value={maintTitle}
                  onChange={(e) => setMaintTitle(e.target.value)}
                  required
                  className="w-full p-2.5 rounded-xl bg-[#F2F2F7] border border-black/[0.05] font-semibold text-[#1C1C1E] outline-none focus:bg-white focus:border-[#007AFF]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#3A3A3C] mb-1">Category</label>
                  <select
                    value={maintCategory}
                    onChange={(e) => setMaintCategory(e.target.value as MaintenanceCategory)}
                    className="w-full p-2.5 rounded-xl bg-[#F2F2F7] border border-black/[0.05] font-semibold text-[#1C1C1E] outline-none focus:bg-white focus:border-[#007AFF]"
                  >
                    <option value="plumbing">Plumbing &amp; Water</option>
                    <option value="electrical">Electrical &amp; Lighting</option>
                    <option value="hvac">HVAC &amp; Ventilation</option>
                    <option value="structural">Structural &amp; Glass</option>
                    <option value="cleaning">Facilities / Cleaning</option>
                    <option value="general">General Repair</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-[#3A3A3C] mb-1">Priority Urgency</label>
                  <select
                    value={maintPriority}
                    onChange={(e) => setMaintPriority(e.target.value as MaintenancePriority)}
                    className="w-full p-2.5 rounded-xl bg-[#F2F2F7] border border-black/[0.05] font-semibold text-[#1C1C1E] outline-none focus:bg-white focus:border-[#007AFF]"
                  >
                    <option value="low">Low (Routine maintenance)</option>
                    <option value="medium">Medium (Requires attention)</option>
                    <option value="high">High (Impacting business)</option>
                    <option value="emergency">Emergency (Immediate hazard)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[#3A3A3C] mb-1">Detailed Description &amp; Location</label>
                <textarea
                  rows={3}
                  placeholder="Describe the issue, exact room/fixture, and best time for technician visit..."
                  value={maintDesc}
                  onChange={(e) => setMaintDesc(e.target.value)}
                  required
                  className="w-full p-2.5 rounded-xl bg-[#F2F2F7] border border-black/[0.05] text-[#1C1C1E] outline-none focus:bg-white focus:border-[#007AFF] resize-none"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsMaintModalOpen(false)}
                  className="flex-1 py-3 rounded-xl bg-[#F2F2F7] text-[#1C1C1E] font-semibold hover:bg-[#E5E5EA] transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl bg-[#007AFF] text-white font-bold hover:bg-[#0062CC] active:scale-95 transition-all shadow-md shadow-blue-500/25 cursor-pointer"
                >
                  Submit Ticket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 3: LEASE RENEWAL REQUEST */}
      {/* ========================================================= */}
      {isRenewalModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-black/[0.06] space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-[#007AFF]/15 text-[#007AFF] flex items-center justify-center">
                  <Calendar className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold text-[#1C1C1E]">Commercial Lease Extension</h3>
              </div>
              <button
                onClick={() => setIsRenewalModalOpen(false)}
                className="p-1 rounded-full text-[#8E8E93] hover:bg-black/5"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleRenewalSubmit} className="space-y-4 text-xs">
              <div className="p-3 bg-[#F2F2F7] rounded-2xl space-y-1">
                <div className="flex justify-between">
                  <span className="text-[#8E8E93]">Current Expiration:</span>
                  <span className="font-bold text-[#1C1C1E]">{currentTenant.leaseEndDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#8E8E93]">Current Monthly Base:</span>
                  <span className="font-mono font-bold text-[#1C1C1E]">
                    {currentTenant.monthlyRentETB.toLocaleString()} ETB
                  </span>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[#3A3A3C] mb-1">Requested Extension Duration</label>
                <select
                  value={renewalMonths}
                  onChange={(e) => setRenewalMonths(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl bg-[#F2F2F7] border border-black/[0.05] font-semibold text-[#1C1C1E] outline-none focus:bg-white focus:border-[#007AFF]"
                >
                  <option value={6}>6 Months Extension (Short-Term)</option>
                  <option value={12}>12 Months Extension (1 Year Standard)</option>
                  <option value={24}>24 Months Extension (2 Years Long-Term)</option>
                  <option value={36}>36 Months Extension (3 Years Commercial Lease)</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-[#3A3A3C] mb-1">Business Comments &amp; Notes</label>
                <textarea
                  rows={3}
                  placeholder="Specify any required unit modifications, signage updates, or commercial terms..."
                  value={renewalNotes}
                  onChange={(e) => setRenewalNotes(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-[#F2F2F7] border border-black/[0.05] text-[#1C1C1E] outline-none focus:bg-white focus:border-[#007AFF] resize-none"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsRenewalModalOpen(false)}
                  className="flex-1 py-3 rounded-xl bg-[#F2F2F7] text-[#1C1C1E] font-semibold hover:bg-[#E5E5EA] transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl bg-[#007AFF] text-white font-bold hover:bg-[#0062CC] active:scale-95 transition-all shadow-md shadow-blue-500/25 cursor-pointer"
                >
                  Submit Extension Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 4: DIGITAL RECEIPT VIEWER */}
      {/* ========================================================= */}
      {viewingPayment && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl border border-black/[0.06] space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-[#007AFF]/15 text-[#007AFF] flex items-center justify-center">
                  <QrCode className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold text-[#1C1C1E]">Official Payment Receipt</h3>
              </div>
              <button
                onClick={() => setViewingPayment(null)}
                className="p-1 rounded-full text-[#8E8E93] hover:bg-black/5"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 bg-[#F2F2F7] rounded-2xl flex items-center justify-center overflow-hidden">
              {viewingPayment.receiptImageUrl.startsWith('data:image/svg+xml') ? (
                <img
                  src={viewingPayment.receiptImageUrl}
                  alt="Bank Advice"
                  className="max-h-72 rounded-xl shadow-md"
                />
              ) : (
                <div className="text-center p-6 text-xs text-[#8E8E93]">Digital advice preview active</div>
              )}
            </div>

            <div className="p-3 bg-[#F2F2F7] rounded-xl text-xs space-y-1.5 font-mono">
              <div className="flex justify-between">
                <span className="text-[#8E8E93]">Reference:</span>
                <span className="font-bold text-[#1C1C1E]">{viewingPayment.referenceNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#8E8E93]">Amount:</span>
                <span className="font-bold text-emerald-600">{viewingPayment.amountPaid.toLocaleString()} ETB</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#8E8E93]">Status:</span>
                <span className="font-bold uppercase text-[#007AFF]">{viewingPayment.verificationStatus}</span>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => window.print()}
                className="flex-1 py-2.5 rounded-xl bg-black/5 hover:bg-black/10 text-[#1C1C1E] text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                Print Receipt
              </button>
              <button
                onClick={() => setViewingPayment(null)}
                className="flex-1 py-2.5 rounded-xl bg-[#007AFF] text-white text-xs font-bold hover:bg-[#0062CC] transition-all cursor-pointer"
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
