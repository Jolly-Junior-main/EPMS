import React, { useState } from 'react';
import { usePMS } from '../../context/PMSContext';
import { Payment } from '../../types/pms';
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  ZoomIn,
  ZoomOut,
  RotateCw,
  Maximize2,
  Lock,
  FileCheck2,
  AlertTriangle,
  Building2,
  User,
  Calendar,
  CreditCard,
  Hash,
  Sparkles,
  Info,
  Layers,
  ArrowRight
} from 'lucide-react';

export const ReceiptVerificationVault: React.FC = () => {
  const {
    currentUser,
    payments,
    invoices,
    tenants,
    units,
    verifyPayment,
    auditLogs
  } = usePMS();

  const [selectedPaymentId, setSelectedPaymentId] = useState<string>(() => {
    const unverified = payments.find((p) => p.verificationStatus === 'unverified');
    return unverified ? unverified.paymentId : payments[0]?.paymentId || '';
  });

  const [filterTab, setFilterTab] = useState<'unverified' | 'all' | 'verified' | 'rejected'>('unverified');
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [rotation, setRotation] = useState<number>(0);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState<boolean>(false);
  const [rejectionReason, setRejectionReason] = useState<string>('');

  // Filter payments
  const filteredPayments = payments.filter((p) => {
    if (filterTab === 'unverified') return p.verificationStatus === 'unverified';
    if (filterTab === 'verified') return p.verificationStatus === 'verified';
    if (filterTab === 'rejected') return p.verificationStatus === 'rejected';
    return true;
  });

  const selectedPayment = payments.find((p) => p.paymentId === selectedPaymentId) || filteredPayments[0];
  const relatedInvoice = selectedPayment ? invoices.find((inv) => inv.invoiceId === selectedPayment.invoiceId) : null;
  const relatedTenant = selectedPayment ? tenants.find((t) => t.tenantId === selectedPayment.tenantId) : null;
  const relatedUnit = selectedPayment ? units.find((u) => u.unitId === selectedPayment.unitId) : null;

  const isOwnerOrAdmin = ['owner', 'admin'].includes(currentUser.role);

  const handleApprove = () => {
    if (!selectedPayment) return;
    verifyPayment(selectedPayment.paymentId, true);
  };

  const handleRejectConfirm = () => {
    if (!selectedPayment) return;
    verifyPayment(selectedPayment.paymentId, false, rejectionReason || 'Disputed bank advice reference');
    setIsRejectModalOpen(false);
    setRejectionReason('');
  };

  const handleZoomIn = () => setZoomLevel((prev) => Math.min(prev + 25, 250));
  const handleZoomOut = () => setZoomLevel((prev) => Math.max(prev - 25, 50));
  const handleResetZoom = () => {
    setZoomLevel(100);
    setRotation(0);
  };
  const handleRotate = () => setRotation((prev) => (prev + 90) % 360);

  return (
    <div id="receipt-verification-vault" className="space-y-6">
      {/* iOS Header Banner Card */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-black/[0.04] shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="space-y-1.5 z-10">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 text-[11px] font-bold rounded-full bg-[#007AFF]/10 text-[#007AFF] flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" />
              OWNER AUDIT VAULT
            </span>
            <span className="text-xs text-[#8E8E93] font-mono">Firebase Storage &amp; RBAC Protected</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-[#1C1C1E] flex items-center gap-2">
            Digital Receipt Verification Vault
          </h2>
          <p className="text-xs md:text-sm text-[#8E8E93] max-w-2xl">
            Side-by-side audit workspace pairing ledger records on the left with high-resolution bank vouchers on the right.
          </p>
        </div>

        {/* Security / RBAC Banner */}
        <div className="flex items-center gap-3 z-10">
          {!isOwnerOrAdmin ? (
            <div className="bg-[#FF3B30]/10 border border-[#FF3B30]/20 px-4 py-2.5 rounded-2xl text-[#FF3B30] text-xs flex items-center gap-2.5">
              <Lock className="w-4 h-4 shrink-0" />
              <div>
                <div className="font-bold">Manager Mode (Read-Only)</div>
                <div className="text-[11px] opacity-80">Approval requires Owner or Admin custom claims.</div>
              </div>
            </div>
          ) : (
            <div className="bg-[#34C759]/10 border border-[#34C759]/20 px-4 py-2.5 rounded-2xl text-[#34C759] text-xs flex items-center gap-2.5">
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <div>
                <div className="font-bold">Owner Access Active ({currentUser.name})</div>
                <div className="text-[11px] opacity-80">Full write authorization to approve/reject bank slips.</div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* iOS Segmented Filter Bar */}
      <div className="bg-white rounded-2xl p-2.5 border border-black/[0.04] shadow-[0_2px_12px_rgba(0,0,0,0.03)] flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-1 bg-[#767680]/12 p-1 rounded-xl">
          <button
            onClick={() => setFilterTab('unverified')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 active:scale-95 ${
              filterTab === 'unverified'
                ? 'bg-white text-[#1C1C1E] shadow-[0_2px_6px_rgba(0,0,0,0.12)]'
                : 'text-[#8E8E93] hover:text-[#1C1C1E]'
            }`}
          >
            Awaiting Verification ({payments.filter((p) => p.verificationStatus === 'unverified').length})
          </button>
          <button
            onClick={() => setFilterTab('verified')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 active:scale-95 ${
              filterTab === 'verified'
                ? 'bg-white text-[#34C759] shadow-[0_2px_6px_rgba(0,0,0,0.12)]'
                : 'text-[#8E8E93] hover:text-[#1C1C1E]'
            }`}
          >
            Verified ({payments.filter((p) => p.verificationStatus === 'verified').length})
          </button>
          <button
            onClick={() => setFilterTab('rejected')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 active:scale-95 ${
              filterTab === 'rejected'
                ? 'bg-white text-[#FF3B30] shadow-[0_2px_6px_rgba(0,0,0,0.12)]'
                : 'text-[#8E8E93] hover:text-[#1C1C1E]'
            }`}
          >
            Rejected ({payments.filter((p) => p.verificationStatus === 'rejected').length})
          </button>
          <button
            onClick={() => setFilterTab('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 active:scale-95 ${
              filterTab === 'all'
                ? 'bg-white text-[#1C1C1E] shadow-[0_2px_6px_rgba(0,0,0,0.12)]'
                : 'text-[#8E8E93] hover:text-[#1C1C1E]'
            }`}
          >
            All Slips ({payments.length})
          </button>
        </div>

        <div className="text-xs text-[#8E8E93] font-medium pr-2">
          Showing {filteredPayments.length} of {payments.length} total deposit vouchers
        </div>
      </div>

      {/* Main Side-by-Side Verification Vault Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Ledger Metadata & Decision Controls (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Slip Selector Dropdown / Scroll list */}
          <div className="bg-white rounded-3xl p-5 border border-black/[0.04] shadow-[0_4px_20px_rgb(0,0,0,0.03)] space-y-3">
            <label className="text-xs font-semibold text-[#8E8E93] uppercase tracking-wider block">
              Active Deposit Advice in Queue
            </label>
            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {filteredPayments.map((p) => {
                const tenant = tenants.find((t) => t.tenantId === p.tenantId);
                const isSelected = selectedPayment?.paymentId === p.paymentId;

                return (
                  <button
                    key={p.paymentId}
                    onClick={() => setSelectedPaymentId(p.paymentId)}
                    className={`w-full text-left p-3 rounded-2xl border transition-all duration-200 flex items-center justify-between gap-3 active:scale-[0.98] ${
                      isSelected
                        ? 'border-[#007AFF] bg-[#007AFF]/5 shadow-sm ring-1 ring-[#007AFF]'
                        : 'border-black/[0.04] bg-[#F2F2F7]/60 hover:bg-[#F2F2F7]'
                    }`}
                  >
                    <div>
                      <div className="text-xs font-bold text-[#1C1C1E]">{tenant?.legalName || 'Tenant'}</div>
                      <div className="text-[11px] text-[#8E8E93] flex items-center gap-1 mt-0.5">
                        <Hash className="w-3 h-3 text-[#8E8E93]" />
                        {p.referenceNumber} • {p.amountPaid.toLocaleString()} ETB
                      </div>
                    </div>

                    <span
                      className={`text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full ${
                        p.verificationStatus === 'verified'
                          ? 'bg-[#34C759]/15 text-[#34C759]'
                          : p.verificationStatus === 'rejected'
                          ? 'bg-[#FF3B30]/15 text-[#FF3B30]'
                          : 'bg-[#FF9500]/15 text-[#FF9500]'
                      }`}
                    >
                      {p.verificationStatus}
                    </span>
                  </button>
                );
              })}

              {filteredPayments.length === 0 && (
                <div className="p-4 text-center text-xs text-[#8E8E93] bg-[#F2F2F7] rounded-2xl">
                  No payment slips found under the "{filterTab}" filter.
                </div>
              )}
            </div>
          </div>

          {/* Detailed Transaction Metadata Inspector */}
          {selectedPayment ? (
            <div className="bg-white rounded-3xl p-6 border border-black/[0.04] shadow-[0_4px_20px_rgb(0,0,0,0.03)] space-y-5">
              <div className="flex items-center justify-between border-b border-black/[0.05] pb-3">
                <h3 className="text-base font-bold text-[#1C1C1E] flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-[#007AFF]" />
                  Transaction Specifications
                </h3>
                <span className="text-xs font-mono font-bold text-[#8E8E93]">ID: {selectedPayment.paymentId}</span>
              </div>

              {/* Amount Highlight */}
              <div className="bg-[#1C1C1E] text-white rounded-3xl p-5 flex items-center justify-between shadow-md">
                <div>
                  <div className="text-[11px] font-medium text-white/60 uppercase">Amount Remitted</div>
                  <div className="text-2xl font-bold text-white tracking-tight">
                    {selectedPayment.amountPaid.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    <span className="text-xs font-bold text-[#34C759] ml-1.5">ETB</span>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-[11px] font-medium text-white/60 uppercase">Channel</div>
                  <div className="text-xs font-bold text-white uppercase mt-0.5">
                    {selectedPayment.paymentMethod.replace('_', ' ')}
                  </div>
                </div>
              </div>

              {/* Key Details Grid in iOS Style */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3.5 rounded-2xl bg-[#F2F2F7]">
                  <span className="text-[#8E8E93] font-medium block mb-0.5">Tenant Entity</span>
                  <span className="font-bold text-[#1C1C1E] block">{relatedTenant?.legalName || 'N/A'}</span>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#F2F2F7]">
                  <span className="text-[#8E8E93] font-medium block mb-0.5">Assigned Unit</span>
                  <span className="font-bold text-[#1C1C1E] block">{relatedUnit?.unitNumber || 'N/A'}</span>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#F2F2F7]">
                  <span className="text-[#8E8E93] font-medium block mb-0.5">Bank Ref / Swift</span>
                  <span className="font-mono font-bold text-[#007AFF] block">{selectedPayment.referenceNumber}</span>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#F2F2F7]">
                  <span className="text-[#8E8E93] font-medium block mb-0.5">Submitted By</span>
                  <span className="font-bold text-[#1C1C1E] block">{selectedPayment.submittedBy}</span>
                </div>
              </div>

              {/* Invoiced Balance vs Paid Comparison */}
              {relatedInvoice && (
                <div className="p-4 rounded-2xl bg-[#F2F2F7] text-xs space-y-1.5">
                  <div className="flex justify-between text-[#1C1C1E] font-bold">
                    <span>Invoice #{relatedInvoice.invoiceNumber}</span>
                    <span className="font-bold text-[#007AFF]">{relatedInvoice.amountDue.toLocaleString()} ETB Due</span>
                  </div>
                  <div className="text-[11px] text-[#8E8E93]">
                    Period: {relatedInvoice.billingPeriod} • Due: {new Date(relatedInvoice.dueDate).toLocaleDateString()}
                  </div>
                </div>
              )}

              {/* Status Note or Rejection History */}
              {selectedPayment.notes && (
                <div className="text-xs text-[#1C1C1E] bg-[#F2F2F7] p-3.5 rounded-2xl">
                  <strong className="text-[#1C1C1E]">Submission Note:</strong> {selectedPayment.notes}
                </div>
              )}

              {selectedPayment.verificationStatus === 'rejected' && selectedPayment.rejectionReason && (
                <div className="text-xs text-[#FF3B30] bg-[#FF3B30]/10 p-3.5 rounded-2xl border border-[#FF3B30]/20">
                  <strong className="font-bold">Rejection Reason:</strong> {selectedPayment.rejectionReason}
                </div>
              )}

              {selectedPayment.verificationStatus === 'verified' && (
                <div className="text-xs text-[#34C759] bg-[#34C759]/10 p-3.5 rounded-2xl border border-[#34C759]/20 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#34C759] shrink-0" />
                  <div>
                    Verified by <strong className="text-[#1C1C1E]">{selectedPayment.verifiedBy}</strong> on{' '}
                    {selectedPayment.verifiedAt ? new Date(selectedPayment.verifiedAt).toLocaleString() : 'N/A'}.
                  </div>
                </div>
              )}

              {/* iOS Pill Action Buttons: System Green (#34C759) & System Red (#FF3B30) */}
              <div className="pt-3 border-t border-black/[0.05] space-y-2">
                {selectedPayment.verificationStatus === 'unverified' ? (
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      id="vault-verify-approve-btn"
                      onClick={handleApprove}
                      disabled={!isOwnerOrAdmin}
                      className={`py-3 px-4 rounded-2xl text-xs font-semibold transition-all flex items-center justify-center gap-2 active:scale-95 shadow-[0_4px_12px_rgba(52,199,89,0.3)] ${
                        isOwnerOrAdmin
                          ? 'bg-[#34C759] hover:bg-[#2EB34F] text-white'
                          : 'bg-[#E5E5EA] text-[#8E8E93] cursor-not-allowed shadow-none'
                      }`}
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      Verify &amp; Approve
                    </button>

                    <button
                      id="vault-reject-btn"
                      onClick={() => setIsRejectModalOpen(true)}
                      disabled={!isOwnerOrAdmin}
                      className={`py-3 px-4 rounded-2xl text-xs font-semibold transition-all flex items-center justify-center gap-2 active:scale-95 ${
                        isOwnerOrAdmin
                          ? 'bg-[#FF3B30]/10 hover:bg-[#FF3B30]/20 text-[#FF3B30] border border-[#FF3B30]/30'
                          : 'bg-[#F2F2F7] text-[#8E8E93] cursor-not-allowed border-transparent'
                      }`}
                    >
                      <XCircle className="w-4 h-4" />
                      Reject Payment
                    </button>
                  </div>
                ) : (
                  <div className="p-3.5 bg-[#F2F2F7] rounded-2xl text-center text-xs font-semibold text-[#1C1C1E]">
                    This deposit advice has been marked as <strong className="uppercase">{selectedPayment.verificationStatus}</strong>.
                  </div>
                )}

                {!isOwnerOrAdmin && (
                  <p className="text-[11px] text-center text-[#8E8E93]">
                    * Switch your role to <strong>Owner</strong> in the top bar to execute verification approvals.
                  </p>
                )}
              </div>
            </div>
          ) : (
            <div className="p-8 text-center text-[#8E8E93] bg-white rounded-3xl border border-black/[0.04]">
              No deposit slip selected.
            </div>
          )}
        </div>

        {/* Right Column: High-Res Zoomable iOS Photo Viewer Container (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-[#1C1C1E] rounded-3xl p-5 md:p-6 shadow-xl space-y-4 border border-white/10">
            {/* Viewer Control Toolbar */}
            <div className="flex items-center justify-between border-b border-white/10 pb-3.5 text-white">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#34C759]" />
                <span className="text-xs font-semibold tracking-wide text-white/80">
                  Photo Viewer: {selectedPayment ? selectedPayment.referenceNumber : 'No slip'}
                </span>
              </div>

              {/* iOS Photo Viewer Zoom & Rotation Controls */}
              <div className="flex items-center gap-1 bg-[#2C2C2E] p-1 rounded-xl border border-white/10">
                <button
                  onClick={handleZoomOut}
                  title="Zoom Out"
                  className="p-1.5 rounded-lg hover:bg-white/10 text-white/80 hover:text-white transition-colors active:scale-95"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>
                <span className="text-xs font-mono px-2 text-white font-bold">{zoomLevel}%</span>
                <button
                  onClick={handleZoomIn}
                  title="Zoom In"
                  className="p-1.5 rounded-lg hover:bg-white/10 text-white/80 hover:text-white transition-colors active:scale-95"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
                <button
                  onClick={handleRotate}
                  title="Rotate 90°"
                  className="p-1.5 rounded-lg hover:bg-white/10 text-white/80 hover:text-white transition-colors border-l border-white/10 ml-1 active:scale-95"
                >
                  <RotateCw className="w-4 h-4" />
                </button>
                <button
                  onClick={handleResetZoom}
                  title="Reset Zoom & Orientation"
                  className="px-2.5 py-1 text-[11px] rounded-lg hover:bg-white/10 text-white/80 hover:text-white transition-colors active:scale-95 font-medium"
                >
                  Reset
                </button>
              </div>
            </div>

            {/* Interactive iOS Photos Surface */}
            <div className="relative w-full h-[540px] bg-[#000000] rounded-2xl overflow-hidden flex items-center justify-center border border-white/10">
              {selectedPayment?.receiptImageUrl ? (
                <div
                  className="transition-transform duration-200 ease-out cursor-grab active:cursor-grabbing p-4"
                  style={{
                    transform: `scale(${zoomLevel / 100}) rotate(${rotation}deg)`,
                    transformOrigin: 'center center'
                  }}
                >
                  <img
                    src={selectedPayment.receiptImageUrl}
                    alt={`Bank Receipt ${selectedPayment.referenceNumber}`}
                    className="max-h-[480px] w-auto rounded-2xl shadow-2xl border border-white/10 select-none pointer-events-auto"
                    referrerPolicy="no-referrer"
                    draggable={false}
                  />
                </div>
              ) : (
                <div className="text-center text-white/50 text-xs">
                  No receipt image payload found for this record.
                </div>
              )}

              {/* Watermark Tag */}
              <div className="absolute bottom-3 left-3 bg-[#1C1C1E]/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10 text-[10px] text-white/80 font-mono">
                Storage: gs://enterprise-pms-et.appspot.com/receipts/{selectedPayment?.referenceNumber}.svg
              </div>
            </div>

            {/* Footnote Security Meta */}
            <div className="flex items-center justify-between text-[11px] text-white/60 px-1">
              <span className="flex items-center gap-1 text-[#34C759]">
                <ShieldCheck className="w-3.5 h-3.5" /> Official Bank Switch Cryptographic Watermark Attached
              </span>
              <span>Pinch or click controls to inspect micro-print signatures</span>
            </div>
          </div>
        </div>
      </div>

      {/* iOS Modal Action Sheet for Rejection */}
      {isRejectModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 border border-black/[0.06] animate-in fade-in zoom-in-95 duration-200">
            {/* Grabber Bar */}
            <div className="w-10 h-1 rounded-full bg-gray-300 mx-auto -mt-2 mb-2" />

            <div className="flex items-center gap-3 text-[#FF3B30]">
              <div className="w-10 h-10 rounded-2xl bg-[#FF3B30]/10 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-base text-[#1C1C1E]">Reject Deposit Advice</h3>
                <p className="text-xs text-[#8E8E93]">Ref: {selectedPayment?.referenceNumber}</p>
              </div>
            </div>

            <p className="text-xs text-[#3A3A3C] leading-relaxed">
              Rejecting this entry will flag the payment record in Firestore, keep the associated invoice in delinquent status, and log a permanent audit entry.
            </p>

            <div>
              <label className="text-xs font-semibold text-[#1C1C1E] block mb-1.5">
                Dispute Reason / Notes for Manager:
              </label>
              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="e.g. Reference number not found on CBE statement, payer entity does not match lease agreement, or duplicate advice."
                rows={3}
                className="w-full text-xs p-3 rounded-2xl border border-black/[0.08] bg-[#F2F2F7] focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#FF3B30] font-medium text-[#1C1C1E]"
              />
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-black/[0.05]">
              <button
                onClick={() => setIsRejectModalOpen(false)}
                className="px-4 py-2.5 rounded-xl text-xs font-semibold text-[#8E8E93] hover:bg-[#F2F2F7] transition-all active:scale-95"
              >
                Cancel
              </button>
              <button
                onClick={handleRejectConfirm}
                className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-[#FF3B30] hover:bg-[#E02E24] text-white shadow-md transition-all active:scale-95"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
