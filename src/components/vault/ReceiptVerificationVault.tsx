import React, { useState } from 'react';
import { usePMS } from '../../context/PMSContext';
import {
  FileCheck2,
  CheckCircle2,
  ZoomIn,
  ZoomOut,
  RotateCw,
  Search,
  CreditCard,
  Hash,
  Bot,
  Copy,
  ShieldCheck
} from 'lucide-react';

export const ReceiptVerificationVault: React.FC = () => {
  const {
    clientTheme,
    payments,
    invoices,
    tenants,
    units
  } = usePMS();

  const [selectedPaymentId, setSelectedPaymentId] = useState<string>(() => {
    return payments[0]?.paymentId || '';
  });

  const [searchTerm, setSearchTerm] = useState<string>('');
  const [bankFilter, setBankFilter] = useState<'all' | 'cbe' | 'telebirr' | 'awash' | 'dashen'>('all');
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [rotation, setRotation] = useState<number>(0);
  const [copiedRef, setCopiedRef] = useState<boolean>(false);

  const filteredPayments = payments.filter((p) => {
    const tenant = tenants.find((t) => t.tenantId === p.tenantId);
    const unit = units.find((u) => u.unitId === p.unitId);
    
    if (bankFilter === 'cbe' && !p.paymentMethod.includes('cbe')) return false;
    if (bankFilter === 'telebirr' && !p.paymentMethod.includes('telebirr')) return false;
    if (bankFilter === 'awash' && !p.paymentMethod.includes('awash')) return false;
    if (bankFilter === 'dashen' && !p.paymentMethod.includes('dashen')) return false;

    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      const matchRef = p.referenceNumber.toLowerCase().includes(q);
      const matchTenant = tenant?.legalName.toLowerCase().includes(q) || tenant?.businessTradeName?.toLowerCase().includes(q);
      const matchUnit = unit?.unitNumber.toLowerCase().includes(q);
      return matchRef || matchTenant || matchUnit;
    }

    return true;
  });

  const selectedPayment = payments.find((p) => p.paymentId === selectedPaymentId) || filteredPayments[0];
  const relatedInvoice = selectedPayment ? invoices.find((inv) => inv.invoiceId === selectedPayment.invoiceId) : null;
  const relatedTenant = selectedPayment ? tenants.find((t) => t.tenantId === selectedPayment.tenantId) : null;
  const relatedUnit = selectedPayment ? units.find((u) => u.unitId === selectedPayment.unitId) : null;

  const handleZoomIn = () => setZoomLevel((prev) => Math.min(prev + 25, 250));
  const handleZoomOut = () => setZoomLevel((prev) => Math.max(prev - 25, 50));
  const handleResetZoom = () => {
    setZoomLevel(100);
    setRotation(0);
  };
  const handleRotate = () => setRotation((prev) => (prev + 90) % 360);

  const handleCopyRef = (ref: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(ref);
      setCopiedRef(true);
      setTimeout(() => setCopiedRef(false), 2000);
    }
  };

  return (
    <div id="receipt-gallery-vault" className="space-y-6">
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-black/[0.04] shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="space-y-1.5 z-10">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 text-[11px] font-bold rounded-full bg-[#007AFF]/10 text-[#007AFF] flex items-center gap-1.5">
              <FileCheck2 className="w-3.5 h-3.5" />
              Receipt Gallery
            </span>
            <span className="text-xs text-[#8E8E93] font-mono">Auto-Verified Storage</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-[#1C1C1E] flex items-center gap-2">
            Digital Bank Slips &amp; Advice Gallery
          </h2>
          <p className="text-xs md:text-sm text-[#8E8E93] max-w-2xl">
            High-resolution deposit vouchers, mobile banking screenshots, and EFT payment advices for <strong className="text-[#1C1C1E]">{clientTheme.propertyName}</strong>.
          </p>
        </div>

        <div className="flex items-center gap-3 z-10">
          <div className="bg-[#34C759]/10 border border-[#34C759]/20 px-4 py-3 rounded-2xl text-[#34C759] text-xs flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-[#34C759] text-white flex items-center justify-center font-bold shrink-0 shadow-sm">
              <Bot className="w-4 h-4" />
            </div>
            <div>
              <div className="font-bold flex items-center gap-1.5">
                <span>Telegram Bot OCR Active</span>
                <span className="w-2 h-2 rounded-full bg-[#34C759] animate-pulse" />
              </div>
              <div className="text-[11px] opacity-80 mt-0.5">
                Receipts automatically imported &amp; verified via @epms_receipt_bot.
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-3 border border-black/[0.04] shadow-[0_2px_12px_rgba(0,0,0,0.03)] flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-1 bg-[#767680]/12 p-1 rounded-xl overflow-x-auto scrollbar-none">
          <button
            onClick={() => setBankFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all duration-200 active:scale-95 cursor-pointer ${
              bankFilter === 'all'
                ? 'bg-white text-[#007AFF] shadow-[0_2px_6px_rgba(0,0,0,0.12)]'
                : 'text-[#8E8E93] hover:text-[#1C1C1E]'
            }`}
          >
            All Receipts ({payments.length})
          </button>
          <button
            onClick={() => setBankFilter('cbe')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all duration-200 active:scale-95 cursor-pointer ${
              bankFilter === 'cbe'
                ? 'bg-white text-[#5856D6] shadow-[0_2px_6px_rgba(0,0,0,0.12)]'
                : 'text-[#8E8E93] hover:text-[#1C1C1E]'
            }`}
          >
            CBE Direct / CBE Birr
          </button>
          <button
            onClick={() => setBankFilter('telebirr')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all duration-200 active:scale-95 cursor-pointer ${
              bankFilter === 'telebirr'
                ? 'bg-white text-[#34C759] shadow-[0_2px_6px_rgba(0,0,0,0.12)]'
                : 'text-[#8E8E93] hover:text-[#1C1C1E]'
            }`}
          >
            Telebirr SuperApp
          </button>
          <button
            onClick={() => setBankFilter('awash')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all duration-200 active:scale-95 cursor-pointer ${
              bankFilter === 'awash'
                ? 'bg-white text-[#FF9500] shadow-[0_2px_6px_rgba(0,0,0,0.12)]'
                : 'text-[#8E8E93] hover:text-[#1C1C1E]'
            }`}
          >
            Awash / RTGS
          </button>
          <button
            onClick={() => setBankFilter('dashen')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all duration-200 active:scale-95 cursor-pointer ${
              bankFilter === 'dashen'
                ? 'bg-white text-[#007AFF] shadow-[0_2px_6px_rgba(0,0,0,0.12)]'
                : 'text-[#8E8E93] hover:text-[#1C1C1E]'
            }`}
          >
            Dashen / Amole
          </button>
        </div>

        <div className="relative min-w-[240px]">
          <Search className="w-3.5 h-3.5 text-[#8E8E93] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search tenant, unit, or bank ref..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-[#F2F2F7] border border-transparent focus:border-[#007AFF] text-xs text-[#1C1C1E] focus:outline-none transition-all"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-3xl p-5 border border-black/[0.04] shadow-[0_4px_20px_rgb(0,0,0,0.03)] space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-[#8E8E93] uppercase tracking-wider block">
                Ingested Bank Receipts ({filteredPayments.length})
              </label>
              <span className="text-[11px] text-[#34C759] font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Auto-Verified
              </span>
            </div>

            <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
              {filteredPayments.map((p) => {
                const tenant = tenants.find((t) => t.tenantId === p.tenantId);
                const isSelected = selectedPayment?.paymentId === p.paymentId;

                return (
                  <button
                    key={p.paymentId}
                    onClick={() => setSelectedPaymentId(p.paymentId)}
                    className={`w-full text-left p-3 rounded-2xl border transition-all duration-200 flex items-center justify-between gap-3 active:scale-[0.98] cursor-pointer ${
                      isSelected
                        ? 'border-[#007AFF] bg-[#007AFF]/5 shadow-sm ring-1 ring-[#007AFF]'
                        : 'border-black/[0.04] bg-[#F2F2F7]/60 hover:bg-[#F2F2F7]'
                    }`}
                  >
                    <div>
                      <div className="text-xs font-bold text-[#1C1C1E]">{tenant?.legalName || 'Tenant'}</div>
                      <div className="text-[11px] text-[#8E8E93] flex items-center gap-1 mt-0.5 font-mono">
                        <Hash className="w-3 h-3 text-[#8E8E93]" />
                        {p.referenceNumber} • <strong className="text-[#1C1C1E]">{p.amountPaid.toLocaleString()} ETB</strong>
                      </div>
                    </div>

                    <span className="text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full bg-[#34C759]/15 text-[#34C759] flex items-center gap-1">
                      <CheckCircle2 className="w-2.5 h-2.5" />
                      Verified
                    </span>
                  </button>
                );
              })}

              {filteredPayments.length === 0 && (
                <div className="p-6 text-center text-xs text-[#8E8E93] bg-[#F2F2F7] rounded-2xl">
                  No payment receipts match your search or filter.
                </div>
              )}
            </div>
          </div>

          {selectedPayment ? (
            <div className="bg-white rounded-3xl p-6 border border-black/[0.04] shadow-[0_4px_20px_rgb(0,0,0,0.03)] space-y-5">
              <div className="flex items-center justify-between border-b border-black/[0.05] pb-3">
                <h3 className="text-base font-bold text-[#1C1C1E] flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-[#007AFF]" />
                  Receipt Specifications
                </h3>
                <span className="text-xs font-mono font-bold text-[#8E8E93]">ID: {selectedPayment.paymentId}</span>
              </div>

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

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3.5 rounded-2xl bg-[#F2F2F7]">
                  <span className="text-[#8E8E93] font-medium block mb-0.5">Tenant Entity</span>
                  <span className="font-bold text-[#1C1C1E] block truncate">{relatedTenant?.legalName || 'N/A'}</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-[#F2F2F7]">
                  <span className="text-[#8E8E93] font-medium block mb-0.5">Assigned Unit</span>
                  <span className="font-bold text-[#1C1C1E] block">{relatedUnit?.unitNumber || 'N/A'}</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-[#F2F2F7]">
                  <div className="flex items-center justify-between">
                    <span className="text-[#8E8E93] font-medium block mb-0.5">Bank Ref / Swift</span>
                    <button
                      onClick={() => handleCopyRef(selectedPayment.referenceNumber)}
                      className="text-[10px] text-[#007AFF] font-bold hover:underline cursor-pointer"
                    >
                      {copiedRef ? 'Copied!' : 'Copy'}
                    </button>
                  </div>
                  <span className="font-mono font-bold text-[#007AFF] block truncate">{selectedPayment.referenceNumber}</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-[#F2F2F7]">
                  <span className="text-[#8E8E93] font-medium block mb-0.5">Ingested Source</span>
                  <span className="font-bold text-[#1C1C1E] block truncate">{selectedPayment.submittedBy}</span>
                </div>
              </div>

              {relatedInvoice && (
                <div className="p-4 rounded-2xl bg-[#F2F2F7] text-xs space-y-1.5">
                  <div className="flex justify-between text-[#1C1C1E] font-bold">
                    <span>Invoice #{relatedInvoice.invoiceNumber}</span>
                    <span className="font-bold text-[#34C759]">{relatedInvoice.amountDue.toLocaleString()} ETB (Settled)</span>
                  </div>
                  <div className="text-[11px] text-[#8E8E93]">
                    Period: {relatedInvoice.billingPeriod} • Due: {new Date(relatedInvoice.dueDate).toLocaleDateString()}
                  </div>
                </div>
              )}

              <div className="text-xs text-[#34C759] bg-[#34C759]/10 p-3.5 rounded-2xl border border-[#34C759]/20 flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#34C759] shrink-0" />
                <div>
                  Auto-verified &amp; ledger reconciled via <strong className="text-[#1C1C1E]">Telegram Bot Integration</strong>.
                </div>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center text-[#8E8E93] bg-white rounded-3xl border border-black/[0.04]">
              No bank slip selected.
            </div>
          )}
        </div>

        <div className="lg:col-span-7 space-y-4">
          <div className="bg-[#1C1C1E] rounded-3xl p-5 md:p-6 shadow-xl space-y-4 border border-white/10">
            <div className="flex items-center justify-between border-b border-white/10 pb-3.5 text-white flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#34C759]" />
                <span className="text-xs font-semibold tracking-wide text-white/80 font-mono">
                  Slip: {selectedPayment ? selectedPayment.referenceNumber : 'None'}
                </span>
              </div>

              <div className="flex items-center gap-1 bg-[#2C2C2E] p-1 rounded-xl border border-white/10">
                <button
                  onClick={handleZoomOut}
                  title="Zoom Out"
                  className="p-1.5 rounded-lg hover:bg-white/10 text-white/80 hover:text-white transition-colors active:scale-95 cursor-pointer"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>
                <span className="text-xs font-mono px-2 text-white font-bold">{zoomLevel}%</span>
                <button
                  onClick={handleZoomIn}
                  title="Zoom In"
                  className="p-1.5 rounded-lg hover:bg-white/10 text-white/80 hover:text-white transition-colors active:scale-95 cursor-pointer"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
                <button
                  onClick={handleRotate}
                  title="Rotate 90°"
                  className="p-1.5 rounded-lg hover:bg-white/10 text-white/80 hover:text-white transition-colors border-l border-white/10 ml-1 active:scale-95 cursor-pointer"
                >
                  <RotateCw className="w-4 h-4" />
                </button>
                <button
                  onClick={handleResetZoom}
                  title="Reset Zoom & Orientation"
                  className="px-2.5 py-1 text-[11px] rounded-lg hover:bg-white/10 text-white/80 hover:text-white transition-colors active:scale-95 font-medium cursor-pointer"
                >
                  Reset
                </button>
              </div>
            </div>

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

              <div className="absolute bottom-3 left-3 bg-[#1C1C1E]/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10 text-[10px] text-white/80 font-mono">
                Storage: gs://epms-cloud.et/receipts/{selectedPayment?.referenceNumber}.svg
              </div>
            </div>

            <div className="flex items-center justify-between text-[11px] text-white/60 px-1">
              <span className="flex items-center gap-1 text-[#34C759]">
                <ShieldCheck className="w-3.5 h-3.5" /> Telegram Bot Verified &amp; Cryptographically Sealed
              </span>
              <button
                onClick={() => selectedPayment && handleCopyRef(selectedPayment.referenceNumber)}
                className="text-xs text-[#007AFF] hover:text-[#389BFF] font-semibold flex items-center gap-1 cursor-pointer"
              >
                <Copy className="w-3 h-3" /> Copy Reference Number
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
