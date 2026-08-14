import React, { useState } from 'react';
import { usePMS } from '../../context/PMSContext';
import {
  Send,
  Play,
  CheckCircle2,
  Clock,
  Radio,
  Server,
  Code2,
  Phone,
  MessageSquare,
  Sparkles,
  RefreshCw,
  Search,
  Filter,
  Check,
  AlertCircle,
  X
} from 'lucide-react';

export const SMSEngineConsole: React.FC = () => {
  const {
    smsLogs,
    runAutomatedSMSEngine,
    sendCustomSMS,
    tenants,
    invoices,
    units
  } = usePMS();

  const [isRunningCron, setIsRunningCron] = useState(false);
  const [cronResult, setCronResult] = useState<{ query1Sent: number; query2Sent: number } | null>(null);
  const [selectedLogForInspect, setSelectedLogForInspect] = useState(smsLogs[0] || null);
  const [isManualModalOpen, setIsManualModalOpen] = useState(false);
  const [manualPhone, setManualPhone] = useState('+251911445566');
  const [manualName, setManualName] = useState('Abyssinia Specialty Coffee');
  const [manualMessage, setManualMessage] = useState('Dear Tenant, kindly note that maintenance on the central generator will occur on Saturday from 09:00 to 12:00. Thank you.');
  const [searchTerm, setSearchTerm] = useState('');

  const handleTriggerDailyCron = async () => {
    setIsRunningCron(true);
    setCronResult(null);

    // Simulate Cloud Function invocation latency
    setTimeout(async () => {
      const result = await runAutomatedSMSEngine();
      setCronResult({ query1Sent: result.query1Sent, query2Sent: result.query2Sent });
      setIsRunningCron(false);
    }, 1200);
  };

  const handleSendManual = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualPhone || !manualMessage) return;
    await sendCustomSMS(manualPhone, manualName, manualMessage);
    setIsManualModalOpen(false);
  };

  const filteredLogs = smsLogs.filter(
    (log) =>
      log.recipientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.recipientPhone.includes(searchTerm) ||
      log.messageText.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div id="sms-engine-console" className="space-y-6">
      {/* iOS Dark Header Card */}
      <div className="bg-[#1C1C1E] border border-white/10 rounded-3xl p-6 md:p-8 text-white shadow-[0_8px_30px_rgb(0,0,0,0.12)] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2.5 py-0.5 text-xs font-bold rounded-full bg-[#007AFF]/20 text-[#0A84FF] border border-[#007AFF]/30 flex items-center gap-1.5 font-mono">
              <Radio className="w-3.5 h-3.5 animate-pulse text-[#0A84FF]" />
              FIREBASE CLOUD FUNCTIONS v2 CRON ENGINE
            </span>
            <span className="text-xs text-[#8E8E93] font-mono hidden sm:inline">Trigger: onSchedule('every day 08:00') EAT</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-white flex items-center gap-2">
            Automated SMS Rent Reminder Engine
          </h2>
          <p className="text-xs md:text-sm text-[#8E8E93] mt-1 max-w-2xl">
            Executes multi-query daily reminder workflows: 7-day advance notices (Query 1) and due-today settlement warnings (Query 2) over Telecom REST API channels.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            id="sms-run-cron-btn"
            onClick={handleTriggerDailyCron}
            disabled={isRunningCron}
            className={`px-4 py-2.5 rounded-2xl text-xs font-semibold transition-all shadow-md flex items-center gap-2 active:scale-95 ${
              isRunningCron
                ? 'bg-white/10 text-white/70 cursor-wait'
                : 'bg-[#007AFF] hover:bg-[#0062CC] text-white shadow-[0_4px_12px_rgba(0,122,255,0.3)]'
            }`}
          >
            {isRunningCron ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                Executing Queries in Cloud Function...
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-white" />
                Trigger Daily 08:00 Cycle Now
              </>
            )}
          </button>

          <button
            id="sms-manual-dispatch-btn"
            onClick={() => setIsManualModalOpen(true)}
            className="px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold border border-white/15 flex items-center gap-2 transition-all active:scale-95"
          >
            <Send className="w-4 h-4" />
            Manual Broadcast
          </button>
        </div>
      </div>

      {/* Cloud Function Query Architecture Breakdown Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Query 1: 7-Day Reminder */}
        <div className="bg-white rounded-3xl p-6 border border-black/[0.04] shadow-[0_4px_20px_rgb(0,0,0,0.03)] space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="w-7 h-7 rounded-xl bg-[#007AFF]/10 text-[#007AFF] font-bold text-xs flex items-center justify-center font-mono">
                Q1
              </span>
              <h3 className="font-bold text-sm text-[#1C1C1E]">Query 1: Invoices Due in Exactly 7 Days</h3>
            </div>
            <span className="text-[11px] font-semibold text-[#8E8E93] font-mono">dueDate == today + 7d</span>
          </div>

          <div className="p-4 bg-[#F2F2F7] rounded-2xl text-xs text-[#1C1C1E] font-mono leading-relaxed">
            "Dear [Tenant Name], this is a friendly reminder from management that your rent for [Room Number] is due in 7 days on [Due Date]. Amount Due: [Amount] ETB. Thank you."
          </div>

          <div className="flex items-center justify-between text-xs text-[#8E8E93] pt-1">
            <span>Filters: <code className="font-mono text-[#007AFF]">paymentStatus != 'paid'</code></span>
            <span className="text-[#007AFF] font-semibold">Advance Courtesy Stage</span>
          </div>
        </div>

        {/* Query 2: Due Today Reminder */}
        <div className="bg-white rounded-3xl p-6 border border-black/[0.04] shadow-[0_4px_20px_rgb(0,0,0,0.03)] space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="w-7 h-7 rounded-xl bg-[#FF3B30]/10 text-[#FF3B30] font-bold text-xs flex items-center justify-center font-mono">
                Q2
              </span>
              <h3 className="font-bold text-sm text-[#1C1C1E]">Query 2: Invoices Due TODAY</h3>
            </div>
            <span className="text-[11px] font-semibold text-[#8E8E93] font-mono">dueDate == today</span>
          </div>

          <div className="p-4 bg-[#F2F2F7] rounded-2xl text-xs text-[#1C1C1E] font-mono leading-relaxed">
            "Dear [Tenant Name], your rent for [Room Number] is due today, [Due Date]. Please clear the balance of [Amount] ETB to prevent account delinquency and late fees."
          </div>

          <div className="flex items-center justify-between text-xs text-[#8E8E93] pt-1">
            <span>Filters: <code className="font-mono text-[#FF3B30]">paymentStatus != 'paid'</code></span>
            <span className="text-[#FF3B30] font-semibold">Delinquency Prevention Stage</span>
          </div>
        </div>
      </div>

      {cronResult && (
        <div className="bg-[#34C759]/10 border border-[#34C759]/20 p-4 rounded-2xl text-[#34C759] text-xs flex items-center justify-between gap-3 shadow-xs animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-[#34C759] shrink-0" />
            <div className="text-[#1C1C1E]">
              <strong className="font-bold text-[#34C759]">Cloud Function Cycle Finished:</strong> Dispatched{' '}
              <strong className="text-[#007AFF]">{cronResult.query1Sent}</strong> 7-day reminders (Q1) and{' '}
              <strong className="text-[#FF3B30]">{cronResult.query2Sent}</strong> due-today notices (Q2) over EthioTelecom gateway.
            </div>
          </div>
          <span className="font-mono text-[#34C759] text-[11px] font-bold">Status: 200 OK</span>
        </div>
      )}

      {/* Main Console Layout: Logs Table + Gateway Payload Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 8 Cols: SMS Dispatch History */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-white rounded-3xl border border-black/[0.04] shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
            <div className="p-5 border-b border-black/[0.04] flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="font-bold text-sm text-[#1C1C1E]">SMS Dispatch Transaction Ledger</h3>
                <p className="text-xs text-[#8E8E93]">Live delivery records from telecom REST webhook</p>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Filter by tenant or phone..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="px-3 py-1.5 text-xs rounded-xl border border-black/[0.06] bg-[#F2F2F7] text-[#1C1C1E] focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#007AFF] w-48"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-[#1C1C1E]">
                <thead className="bg-[#F2F2F7] uppercase text-[10px] font-bold text-[#8E8E93] border-b border-black/[0.04]">
                  <tr>
                    <th className="px-5 py-4">Recipient &amp; Phone</th>
                    <th className="px-5 py-4">Unit / Inv</th>
                    <th className="px-5 py-4">Trigger Type</th>
                    <th className="px-5 py-4">Gateway</th>
                    <th className="px-5 py-4">Dispatched At</th>
                    <th className="px-5 py-4 text-right">Inspect</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/[0.04] font-medium">
                  {filteredLogs.map((log) => {
                    const isSelected = selectedLogForInspect?.id === log.id;
                    return (
                      <tr
                        key={log.id}
                        onClick={() => setSelectedLogForInspect(log)}
                        className={`cursor-pointer transition-colors ${
                          isSelected ? 'bg-[#007AFF]/10 font-semibold' : 'hover:bg-[#F2F2F7]/50'
                        }`}
                      >
                        <td className="px-5 py-4">
                          <div className="font-bold text-[#1C1C1E]">{log.recipientName}</div>
                          <div className="text-[11px] text-[#8E8E93] font-mono">{log.recipientPhone}</div>
                        </td>

                        <td className="px-5 py-4">
                          <div className="text-[#1C1C1E]">{log.unitNumber}</div>
                          <div className="text-[10px] text-[#8E8E93] font-mono">{log.invoiceId}</div>
                        </td>

                        <td className="px-5 py-4">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                              log.messageType === '7_day_reminder'
                                ? 'bg-[#007AFF]/15 text-[#007AFF]'
                                : log.messageType === 'due_today_reminder'
                                ? 'bg-[#FF3B30]/15 text-[#FF3B30]'
                                : 'bg-[#F2F2F7] text-[#8E8E93]'
                            }`}
                          >
                            {log.messageType.replace(/_/g, ' ')}
                          </span>
                        </td>

                        <td className="px-5 py-4">
                          <span className="px-2.5 py-0.5 rounded-full bg-[#34C759]/15 text-[#34C759] text-[10px] font-bold">
                            {log.gateway}
                          </span>
                        </td>

                        <td className="px-5 py-4 text-[#8E8E93] text-[11px] font-mono">
                          {new Date(log.dispatchedAt).toLocaleTimeString()}
                        </td>

                        <td className="px-5 py-4 text-right">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedLogForInspect(log);
                            }}
                            className="text-xs text-[#007AFF] hover:underline font-semibold"
                          >
                            JSON
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

        {/* Right 4 Cols: Live Gateway REST Payload Inspector */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-[#1C1C1E] rounded-3xl border border-white/10 p-6 text-white shadow-[0_8px_30px_rgb(0,0,0,0.12)] space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3.5">
              <div className="flex items-center gap-2">
                <Code2 className="w-4 h-4 text-[#0A84FF]" />
                <h3 className="font-bold text-xs uppercase tracking-wider text-slate-200">
                  HTTP REST Payload Inspector
                </h3>
              </div>
              <span className="text-[11px] font-mono text-[#30D158] font-bold">200 OK</span>
            </div>

            {selectedLogForInspect ? (
              <div className="space-y-3">
                <div className="text-xs text-[#8E8E93] font-mono">
                  <span className="text-[#0A84FF] font-bold">POST</span> https://api.gateway.et/v1/sms/send
                </div>

                {/* Message Preview bubble */}
                <div className="bg-black/40 p-4 rounded-2xl border border-white/10 text-xs text-slate-200 leading-relaxed font-sans">
                  <div className="text-[10px] text-[#8E8E93] font-bold uppercase mb-1">Decoded SMS Body</div>
                  {selectedLogForInspect.messageText}
                </div>

                {/* Raw JSON payload representation */}
                <div className="bg-black/40 p-4 rounded-2xl border border-white/10 text-[11px] font-mono text-[#30D158] overflow-x-auto max-h-56">
                  <pre>
{JSON.stringify(
  {
    gateway: selectedLogForInspect.gateway,
    senderId: "BOLE-PLAZA-PMS",
    recipient: selectedLogForInspect.recipientPhone,
    recipientName: selectedLogForInspect.recipientName,
    messageType: selectedLogForInspect.messageType,
    amountDueETB: selectedLogForInspect.amountETB,
    deliveryStatus: selectedLogForInspect.status,
    gatewayMsgId: selectedLogForInspect.gatewayMessageId,
    timestamp: selectedLogForInspect.dispatchedAt
  },
  null,
  2
)}
                  </pre>
                </div>

                <div className="text-[11px] text-[#8E8E93] flex items-center justify-between pt-1">
                  <span>Network: EthioTelecom / Twilio v2</span>
                  <span className="text-[#30D158] font-bold">● Authenticated</span>
                </div>
              </div>
            ) : (
              <div className="text-center text-[#8E8E93] text-xs py-8">
                Select an SMS log to inspect the HTTP REST gateway dispatch payload.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Manual Broadcast Modal Sheet */}
      {isManualModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <form
            onSubmit={handleSendManual}
            className="bg-white rounded-3xl max-w-md w-full p-6 md:p-8 shadow-2xl space-y-4 border border-black/[0.06] animate-in fade-in zoom-in-95 duration-200"
          >
            {/* Grabber Bar */}
            <div className="w-10 h-1 rounded-full bg-gray-300 mx-auto -mt-2 mb-2" />

            <div className="flex items-center gap-3 border-b border-black/[0.05] pb-3.5">
              <div className="w-10 h-10 rounded-2xl bg-[#007AFF]/10 text-[#007AFF] flex items-center justify-center">
                <Send className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-base text-[#1C1C1E]">Direct SMS Broadcast</h3>
                <p className="text-xs text-[#8E8E93]">Dispatch message via EthioTelecom REST Gateway</p>
              </div>
              <button
                type="button"
                onClick={() => setIsManualModalOpen(false)}
                className="p-2 rounded-full hover:bg-[#F2F2F7] text-[#8E8E93] hover:text-[#1C1C1E] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-[#1C1C1E] block mb-1">Recipient Name / Tenant</label>
                <input
                  type="text"
                  value={manualName}
                  onChange={(e) => setManualName(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-black/[0.06] bg-[#F2F2F7] text-[#1C1C1E] focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#007AFF] font-medium"
                  required
                />
              </div>

              <div>
                <label className="font-semibold text-[#1C1C1E] block mb-1">Phone Number (+251 format)</label>
                <input
                  type="text"
                  value={manualPhone}
                  onChange={(e) => setManualPhone(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-black/[0.06] bg-[#F2F2F7] text-[#1C1C1E] focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#007AFF] font-mono"
                  required
                />
              </div>

              <div>
                <label className="font-semibold text-[#1C1C1E] block mb-1">Message Text (Max 160 chars recommended)</label>
                <textarea
                  value={manualMessage}
                  onChange={(e) => setManualMessage(e.target.value)}
                  rows={4}
                  className="w-full p-2.5 rounded-xl border border-black/[0.06] bg-[#F2F2F7] text-[#1C1C1E] focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#007AFF]"
                  required
                />
                <div className="text-[11px] text-[#8E8E93] text-right mt-1 font-mono">
                  {manualMessage.length} characters
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-black/[0.05]">
              <button
                type="button"
                onClick={() => setIsManualModalOpen(false)}
                className="px-4 py-2.5 rounded-xl text-xs font-semibold text-[#8E8E93] hover:bg-[#F2F2F7] active:scale-95 transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-[#007AFF] hover:bg-[#0062CC] text-white shadow-md flex items-center gap-1.5 active:scale-95 transition-all"
              >
                <Send className="w-3.5 h-3.5" /> Dispatch SMS
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
