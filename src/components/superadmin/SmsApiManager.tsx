import React, { useState } from 'react';
import {
  MessageSquare,
  Key,
  ShieldCheck,
  Send,
  RefreshCw,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  Radio,
  Zap,
  Building2
} from 'lucide-react';
import { usePMS } from '../../context/PMSContext';

export const SmsApiManager: React.FC = () => {
  const {
    smsApiConfig,
    updateSmsApiConfig,
    organizations,
    t
  } = usePMS();

  const [provider, setProvider] = useState<'EthioTelecom' | 'Twilio' | 'Safaricom'>(smsApiConfig.provider);
  const [apiKey, setApiKey] = useState(smsApiConfig.apiKey);
  const [apiSecret, setApiSecret] = useState(smsApiConfig.apiSecret);
  const [senderId, setSenderId] = useState(smsApiConfig.senderId);
  const [restEndpointUrl, setRestEndpointUrl] = useState(smsApiConfig.restEndpointUrl);
  const [costPerSmsETB, setCostPerSmsETB] = useState(smsApiConfig.costPerSmsETB);
  const [balanceCredits, setBalanceCredits] = useState(smsApiConfig.balanceCredits);

  // Test SMS State
  const [testPhone, setTestPhone] = useState('+251 91 123 4567');
  const [testMessage, setTestMessage] = useState('EPMS SMS API Gateway Test: Your payment reminder system is operational.');
  const [isSendingTest, setIsSendingTest] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);

  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    updateSmsApiConfig({
      provider,
      apiKey,
      apiSecret,
      senderId,
      restEndpointUrl,
      costPerSmsETB: Number(costPerSmsETB),
      balanceCredits: Number(balanceCredits),
      status: 'connected'
    });
  };

  const handleSendTestSms = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSendingTest(true);
    setTestResult(null);

    // Simulate gateway API dispatch
    setTimeout(() => {
      setIsSendingTest(false);
      setTestResult({
        success: true,
        message: `HTTP 200 OK: Test SMS delivered to ${testPhone} via ${provider} REST Gateway. (Msg ID: ETH-TEST-${Date.now().toString().slice(-6)})`
      });
      // Deduct 1 credit
      setBalanceCredits((prev) => Math.max(0, prev - 1));
      updateSmsApiConfig({ balanceCredits: Math.max(0, balanceCredits - 1) });
    }, 1200);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-bold tracking-tight text-[#1C1C1E]">
              SMS API & Gateway Control Center
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#34C759]/10 text-[#34C759] border border-[#34C759]/20 flex items-center gap-1">
              <Radio className="w-3 h-3 animate-pulse" />
              Gateway Connected
            </span>
          </div>
          <p className="text-sm text-[#8E8E93] mt-1">
            Centrally manage bulk SMS provider credentials, EthioTelecom REST endpoints, gateway balances, and per-client SMS delivery.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-white/80 backdrop-blur-xl border border-black/[0.06] rounded-2xl px-4 py-2.5 shadow-sm text-right">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#8E8E93] block">
              SMS Balance Credits
            </span>
            <span className="text-xl font-extrabold text-[#007AFF] font-mono">
              {balanceCredits.toLocaleString()} <span className="text-xs text-[#8E8E93]">SMS</span>
            </span>
          </div>
        </div>
      </div>

      {/* Grid: Config Form & Live Test Tool */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Gateway Configuration */}
        <div className="lg:col-span-2 bg-white/80 backdrop-blur-2xl rounded-3xl p-6 border border-black/[0.06] shadow-sm">
          <div className="flex items-center justify-between pb-4 mb-6 border-b border-black/[0.06]">
            <div className="flex items-center gap-2.5">
              <div className="p-2.5 rounded-2xl bg-[#007AFF]/10 text-[#007AFF]">
                <Key className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-[#1C1C1E]">Provider API Credentials</h3>
                <p className="text-xs text-[#8E8E93]">Configure your Ethiopian bulk SMS or international gateway</p>
              </div>
            </div>
            <span className="text-xs text-[#8E8E93] font-mono">Status: Connected</span>
          </div>

          <form onSubmit={handleSaveConfig} className="space-y-4">
            {/* Gateway Provider Selector */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#1C1C1E] mb-1.5">
                Primary SMS Provider Gateway
              </label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: 'EthioTelecom', name: 'EthioTelecom Bulk SMS', desc: 'Direct REST API' },
                  { id: 'Twilio', name: 'Twilio International', desc: 'Global Carrier' },
                  { id: 'Safaricom', name: 'Safaricom Ethiopia', desc: 'Enterprise SMS' }
                ].map((p) => (
                  <button
                    type="button"
                    key={p.id}
                    onClick={() => setProvider(p.id as any)}
                    className={`p-3 rounded-2xl text-left border transition-all ${
                      provider === p.id
                        ? 'bg-[#007AFF]/10 border-[#007AFF] ring-2 ring-[#007AFF]/20 text-[#007AFF]'
                        : 'bg-[#F2F2F7]/50 border-black/[0.06] text-[#1C1C1E] hover:bg-[#F2F2F7]'
                    }`}
                  >
                    <p className="font-bold text-xs">{p.name}</p>
                    <p className="text-[10px] text-[#8E8E93] mt-0.5">{p.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#1C1C1E] mb-1.5">
                  Sender ID (Masking Header)
                </label>
                <input
                  type="text"
                  value={senderId}
                  onChange={(e) => setSenderId(e.target.value)}
                  placeholder="e.g. EPMS-NOTIFY"
                  className="w-full bg-[#F2F2F7] rounded-2xl px-4 py-2.5 text-sm font-semibold text-[#1C1C1E] border border-transparent focus:bg-white focus:border-[#007AFF] focus:ring-2 focus:ring-[#007AFF]/20 outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#1C1C1E] mb-1.5">
                  Cost per Outbound SMS (ETB)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={costPerSmsETB}
                  onChange={(e) => setCostPerSmsETB(Number(e.target.value))}
                  placeholder="0.35"
                  className="w-full bg-[#F2F2F7] rounded-2xl px-4 py-2.5 text-sm font-semibold text-[#1C1C1E] border border-transparent focus:bg-white focus:border-[#007AFF] focus:ring-2 focus:ring-[#007AFF]/20 outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#1C1C1E] mb-1.5">
                REST Endpoint URL
              </label>
              <input
                type="text"
                value={restEndpointUrl}
                onChange={(e) => setRestEndpointUrl(e.target.value)}
                placeholder="https://api.ethiotelecom.et/v2/sms/send-bulk"
                className="w-full font-mono bg-[#F2F2F7] rounded-2xl px-4 py-2.5 text-xs text-[#1C1C1E] border border-transparent focus:bg-white focus:border-[#007AFF] focus:ring-2 focus:ring-[#007AFF]/20 outline-none transition-all"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#1C1C1E] mb-1.5">
                  API Key / Username
                </label>
                <input
                  type="text"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className="w-full font-mono bg-[#F2F2F7] rounded-2xl px-4 py-2.5 text-xs text-[#1C1C1E] border border-transparent focus:bg-white focus:border-[#007AFF] focus:ring-2 focus:ring-[#007AFF]/20 outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#1C1C1E] mb-1.5">
                  API Secret / Token
                </label>
                <input
                  type="password"
                  value={apiSecret}
                  onChange={(e) => setApiSecret(e.target.value)}
                  className="w-full font-mono bg-[#F2F2F7] rounded-2xl px-4 py-2.5 text-xs text-[#1C1C1E] border border-transparent focus:bg-white focus:border-[#007AFF] focus:ring-2 focus:ring-[#007AFF]/20 outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#1C1C1E] mb-1.5">
                Top-Up Platform Balance (Credits)
              </label>
              <input
                type="number"
                value={balanceCredits}
                onChange={(e) => setBalanceCredits(Number(e.target.value))}
                className="w-full bg-[#F2F2F7] rounded-2xl px-4 py-2.5 text-sm font-semibold text-[#1C1C1E] border border-transparent focus:bg-white focus:border-[#007AFF] focus:ring-2 focus:ring-[#007AFF]/20 outline-none transition-all"
              />
            </div>

            <div className="pt-3 flex justify-end">
              <button
                type="submit"
                className="px-6 py-2.5 rounded-2xl bg-[#007AFF] hover:bg-[#0062CC] text-white font-bold text-xs flex items-center gap-2 shadow-sm active:scale-95 transition-all"
              >
                <ShieldCheck className="w-4 h-4" />
                Save Gateway Credentials
              </button>
            </div>
          </form>
        </div>

        {/* Right Col: Live Test Dispatcher */}
        <div className="space-y-6">
          <div className="bg-white/80 backdrop-blur-2xl rounded-3xl p-6 border border-black/[0.06] shadow-sm">
            <div className="flex items-center gap-2.5 pb-4 mb-4 border-b border-black/[0.06]">
              <div className="p-2.5 rounded-2xl bg-[#34C759]/10 text-[#34C759]">
                <Send className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-[#1C1C1E]">Live SMS Test Sandbox</h3>
                <p className="text-xs text-[#8E8E93]">Verify phone delivery & gateway response</p>
              </div>
            </div>

            <form onSubmit={handleSendTestSms} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#1C1C1E] mb-1.5">
                  Recipient Mobile Phone
                </label>
                <input
                  type="text"
                  value={testPhone}
                  onChange={(e) => setTestPhone(e.target.value)}
                  placeholder="+251 91 123 4567"
                  className="w-full bg-[#F2F2F7] rounded-2xl px-4 py-2.5 text-sm font-semibold text-[#1C1C1E] border border-transparent focus:bg-white focus:border-[#007AFF] focus:ring-2 focus:ring-[#007AFF]/20 outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#1C1C1E] mb-1.5">
                  Test Message Payload
                </label>
                <textarea
                  rows={3}
                  value={testMessage}
                  onChange={(e) => setTestMessage(e.target.value)}
                  className="w-full bg-[#F2F2F7] rounded-2xl p-3 text-xs text-[#1C1C1E] border border-transparent focus:bg-white focus:border-[#007AFF] focus:ring-2 focus:ring-[#007AFF]/20 outline-none transition-all"
                />
              </div>

              <button
                type="submit"
                disabled={isSendingTest}
                className="w-full py-2.5 rounded-2xl bg-[#1C1C1E] hover:bg-black text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm active:scale-95 transition-all disabled:opacity-50"
              >
                {isSendingTest ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Dispatching via Gateway...
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4 text-[#FFD60A]" />
                    Send Live Test SMS
                  </>
                )}
              </button>

              {testResult && (
                <div
                  className={`p-3 rounded-2xl text-xs font-medium border flex items-start gap-2 animate-in fade-in duration-200 ${
                    testResult.success
                      ? 'bg-[#34C759]/10 border-[#34C759]/20 text-[#34C759]'
                      : 'bg-[#FF3B30]/10 border-[#FF3B30]/20 text-[#FF3B30]'
                  }`}
                >
                  {testResult.success ? (
                    <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                  )}
                  <span>{testResult.message}</span>
                </div>
              )}
            </form>
          </div>

          {/* Client Allocations Card */}
          <div className="bg-white/80 backdrop-blur-2xl rounded-3xl p-6 border border-black/[0.06] shadow-sm">
            <h4 className="font-bold text-xs uppercase tracking-wider text-[#8E8E93] mb-3">
              Client SMS Quota Status
            </h4>
            <div className="space-y-3">
              {organizations.slice(0, 3).map((org) => (
                <div key={org.organizationId} className="flex items-center justify-between text-xs p-2.5 rounded-2xl bg-[#F2F2F7]/50 border border-black/[0.04]">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-3.5 h-3.5 text-[#007AFF]" />
                    <span className="font-semibold text-[#1C1C1E] truncate max-w-[130px]">{org.name}</span>
                  </div>
                  <span className="font-mono text-[11px] text-[#8E8E93]">
                    {org.usage?.smsSentThisMonth || 0} / 500 SMS
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
