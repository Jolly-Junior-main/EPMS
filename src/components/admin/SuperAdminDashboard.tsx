import React, { useState } from 'react';
import { usePMS } from '../../context/PMSContext';
import {
  ShieldAlert,
  Server,
  Database,
  Cpu,
  Terminal,
  Activity,
  CheckCircle2,
  AlertTriangle,
  Users,
  KeyRound,
  RefreshCw,
  Play,
  Layers,
  Clock,
  Send,
  Zap,
  Lock,
  Smartphone,
  Copy,
  Check
} from 'lucide-react';
import { MOCK_USERS } from '../../data/mockData';
import { UserRole } from '../../types/pms';

interface SuperAdminDashboardProps {
  onNavigateToTab?: (tab: string) => void;
}

export const SuperAdminDashboard: React.FC<SuperAdminDashboardProps> = ({ onNavigateToTab }) => {
  const {
    currentUser,
    tenants,
    units,
    invoices,
    payments,
    smsLogs,
    auditLogs,
    runAutomatedSMSEngine,
    resetToSampleData
  } = usePMS();

  const [activeAdminSection, setActiveAdminSection] = useState<'monitoring' | 'apilogs' | 'claims' | 'config'>('monitoring');
  const [isTriggeringJob, setIsTriggeringJob] = useState(false);
  const [selectedUserForClaim, setSelectedUserForClaim] = useState<UserRole>('manager');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const handleManualCronExecution = async () => {
    setIsTriggeringJob(true);
    await runAutomatedSMSEngine();
    setIsTriggeringJob(false);
  };

  // Mock API Logs
  const apiLogs = [
    {
      id: 'log_01',
      timestamp: '2026-08-14 08:00:01 UTC',
      method: 'POST',
      endpoint: '/functions/v2/dailyRentReminderEngine',
      caller: 'Google Cloud Scheduler',
      status: 200,
      latency: '142ms',
      payload: '{ "scheduledTime": "2026-08-14T08:00:00Z" }'
    },
    {
      id: 'log_02',
      timestamp: '2026-08-14 07:45:12 UTC',
      method: 'GET',
      endpoint: '/firestore/v1/projects/enterprise-pms/databases/(default)/documents/tenants',
      caller: 'hanna.tadesse@boleplaza.et (manager)',
      status: 200,
      latency: '34ms',
      payload: 'Query: status == "active"'
    },
    {
      id: 'log_03',
      timestamp: '2026-08-14 07:30:44 UTC',
      method: 'PATCH',
      endpoint: '/firestore/v1/projects/enterprise-pms/databases/(default)/documents/payments/pay_2026_004',
      caller: 'abebe.mengesha@boleplaza.et (owner)',
      status: 200,
      latency: '89ms',
      payload: '{ "verificationStatus": "verified" }'
    },
    {
      id: 'log_04',
      timestamp: '2026-08-14 06:12:05 UTC',
      method: 'POST',
      endpoint: '/api/v1/sms/ethio-telecom/send',
      caller: 'Cloud Functions v2 Service Account',
      status: 200,
      latency: '210ms',
      payload: '{ "recipient": "+251911445566", "type": "7_day_reminder" }'
    },
    {
      id: 'log_05',
      timestamp: '2026-08-14 05:22:18 UTC',
      method: 'POST',
      endpoint: '/auth/v1/accounts:signInWithPassword',
      caller: 'admin@boleplaza.et',
      status: 200,
      latency: '62ms',
      payload: '{ "role": "admin", "customClaimsApplied": true }'
    }
  ];

  return (
    <div id="super-admin-dashboard" className="space-y-6">
      {/* iOS System Header Banner */}
      <div className="bg-[#1C1C1E] border border-white/10 rounded-3xl p-6 md:p-8 text-white shadow-[0_8px_30px_rgb(0,0,0,0.12)] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2.5 py-0.5 text-xs font-bold rounded-full bg-[#5856D6]/20 text-[#AF52DE] border border-[#5856D6]/30 flex items-center gap-1.5 font-mono">
              <ShieldAlert className="w-3.5 h-3.5 text-[#AF52DE]" />
              GLOBAL SYSTEM MONITORING &amp; CONFIGURATION
            </span>
            <span className="text-xs text-[#8E8E93] font-mono hidden sm:inline">Role: Super Admin (/admin)</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-white flex items-center gap-2">
            Platform Infrastructure &amp; Security Console
          </h2>
          <p className="text-xs md:text-sm text-[#8E8E93] mt-1 max-w-2xl">
            Super Administrator overview of Firebase Firestore databases, Cloud Functions v2 workers, SMS Gateways, Custom Claims RBAC, and system audit logs.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleManualCronExecution}
            disabled={isTriggeringJob}
            className="px-4 py-2.5 rounded-2xl bg-[#007AFF] hover:bg-[#0062CC] text-white text-xs font-semibold shadow-[0_4px_12px_rgba(0,122,255,0.3)] flex items-center gap-2 active:scale-95 transition-all"
          >
            <Play className={`w-3.5 h-3.5 ${isTriggeringJob ? 'animate-spin' : ''}`} />
            {isTriggeringJob ? 'Invoking Cloud Function...' : 'Trigger SMS Cron Job'}
          </button>
          {onNavigateToTab && (
            <button
              onClick={() => onNavigateToTab('rules')}
              className="px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold border border-white/15 flex items-center gap-2 active:scale-95 transition-all"
            >
              <Terminal className="w-3.5 h-3.5 text-[#0A84FF]" />
              Rules Sandbox
            </button>
          )}
        </div>
      </div>

      {/* iOS Segmented Navigation for Admin Console */}
      <div className="flex items-center gap-1 bg-[#767680]/12 p-1 rounded-2xl max-w-md">
        <button
          onClick={() => setActiveAdminSection('monitoring')}
          className={`flex-1 py-2 rounded-xl text-xs font-semibold transition-all duration-200 active:scale-95 text-center ${
            activeAdminSection === 'monitoring'
              ? 'bg-white text-[#1C1C1E] shadow-[0_2px_8px_rgba(0,0,0,0.12)]'
              : 'text-[#8E8E93] hover:text-[#1C1C1E]'
          }`}
        >
          ⚡ Cloud Health
        </button>
        <button
          onClick={() => setActiveAdminSection('apilogs')}
          className={`flex-1 py-2 rounded-xl text-xs font-semibold transition-all duration-200 active:scale-95 text-center ${
            activeAdminSection === 'apilogs'
              ? 'bg-white text-[#1C1C1E] shadow-[0_2px_8px_rgba(0,0,0,0.12)]'
              : 'text-[#8E8E93] hover:text-[#1C1C1E]'
          }`}
        >
          📜 API Logs
        </button>
        <button
          onClick={() => setActiveAdminSection('claims')}
          className={`flex-1 py-2 rounded-xl text-xs font-semibold transition-all duration-200 active:scale-95 text-center ${
            activeAdminSection === 'claims'
              ? 'bg-white text-[#1C1C1E] shadow-[0_2px_8px_rgba(0,0,0,0.12)]'
              : 'text-[#8E8E93] hover:text-[#1C1C1E]'
          }`}
        >
          🛡️ Custom Claims
        </button>
      </div>

      {/* SECTION 1: System Monitoring & Microservices */}
      {activeAdminSection === 'monitoring' && (
        <div className="space-y-6">
          {/* Status Metrics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-3xl p-5 border border-black/[0.04] shadow-[0_8px_30px_rgb(0,0,0,0.04)] space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-[#8E8E93]">Firestore DB Engine</span>
                <span className="w-2.5 h-2.5 rounded-full bg-[#34C759] animate-pulse" />
              </div>
              <div className="text-2xl font-bold text-[#1C1C1E]">Online (100%)</div>
              <div className="text-[11px] text-[#34C759] font-medium flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Multi-region replication active
              </div>
            </div>

            <div className="bg-white rounded-3xl p-5 border border-black/[0.04] shadow-[0_8px_30px_rgb(0,0,0,0.04)] space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-[#8E8E93]">Cloud Functions v2</span>
                <span className="w-2.5 h-2.5 rounded-full bg-[#34C759]" />
              </div>
              <div className="text-2xl font-bold text-[#1C1C1E]">2nd Gen Ready</div>
              <div className="text-[11px] text-[#8E8E93] font-medium">
                Daily Cron: 08:00 EAT (europe-west1)
              </div>
            </div>

            <div className="bg-white rounded-3xl p-5 border border-black/[0.04] shadow-[0_8px_30px_rgb(0,0,0,0.04)] space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-[#8E8E93]">SMS Gateway Status</span>
                <span className="w-2.5 h-2.5 rounded-full bg-[#34C759]" />
              </div>
              <div className="text-2xl font-bold text-[#1C1C1E]">{smsLogs.length} Dispatched</div>
              <div className="text-[11px] text-[#007AFF] font-medium">
                EthioTelecom &amp; Twilio Live
              </div>
            </div>

            <div className="bg-white rounded-3xl p-5 border border-black/[0.04] shadow-[0_8px_30px_rgb(0,0,0,0.04)] space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-[#8E8E93]">Security Audit Trail</span>
                <span className="w-2.5 h-2.5 rounded-full bg-[#5856D6]" />
              </div>
              <div className="text-2xl font-bold text-[#1C1C1E]">{auditLogs.length} Events</div>
              <div className="text-[11px] text-[#5856D6] font-medium">
                Cryptographic RBAC Verified
              </div>
            </div>
          </div>

          {/* Infrastructure Nodes Table */}
          <div className="bg-white rounded-3xl p-6 border border-black/[0.04] shadow-[0_8px_30px_rgb(0,0,0,0.04)] space-y-4">
            <h3 className="text-base font-bold text-[#1C1C1E] flex items-center gap-2">
              <Server className="w-4 h-4 text-[#007AFF]" />
              Cloud Infrastructure Services &amp; Endpoints
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-black/[0.06] text-[#8E8E93]">
                    <th className="py-2.5 px-3 font-semibold">Service Name</th>
                    <th className="py-2.5 px-3 font-semibold">Type</th>
                    <th className="py-2.5 px-3 font-semibold">Region / Cluster</th>
                    <th className="py-2.5 px-3 font-semibold">Status</th>
                    <th className="py-2.5 px-3 font-semibold">Security Rule</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/[0.04] text-[#1C1C1E]">
                  <tr className="hover:bg-black/[0.01]">
                    <td className="py-3 px-3 font-semibold flex items-center gap-2">
                      <Database className="w-4 h-4 text-[#FF9500]" />
                      Firestore Database (Default)
                    </td>
                    <td className="py-3 px-3 text-[#8E8E93]">NoSQL Documents</td>
                    <td className="py-3 px-3 font-mono">europe-west1</td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded-full bg-[#34C759]/10 text-[#34C759] font-semibold text-[10px]">
                        HEALTHY
                      </span>
                    </td>
                    <td className="py-3 px-3 font-mono text-[11px] text-[#007AFF]">
                      firestore.rules (RBAC)
                    </td>
                  </tr>

                  <tr className="hover:bg-black/[0.01]">
                    <td className="py-3 px-3 font-semibold flex items-center gap-2">
                      <Cpu className="w-4 h-4 text-[#007AFF]" />
                      dailyRentReminderEngine
                    </td>
                    <td className="py-3 px-3 text-[#8E8E93]">Cloud Functions v2 (Pub/Sub)</td>
                    <td className="py-3 px-3 font-mono">europe-west1 (Node 20)</td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded-full bg-[#34C759]/10 text-[#34C759] font-semibold text-[10px]">
                        ACTIVE CRON
                      </span>
                    </td>
                    <td className="py-3 px-3 font-mono text-[11px] text-[#8E8E93]">
                      Service Account Token
                    </td>
                  </tr>

                  <tr className="hover:bg-black/[0.01]">
                    <td className="py-3 px-3 font-semibold flex items-center gap-2">
                      <Layers className="w-4 h-4 text-[#5856D6]" />
                      Firebase Cloud Storage
                    </td>
                    <td className="py-3 px-3 text-[#8E8E93]">Object Storage (Leases &amp; Slips)</td>
                    <td className="py-3 px-3 font-mono">gs://enterprise-pms.appspot.com</td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded-full bg-[#34C759]/10 text-[#34C759] font-semibold text-[10px]">
                        HEALTHY
                      </span>
                    </td>
                    <td className="py-3 px-3 font-mono text-[11px] text-[#007AFF]">
                      storage.rules (10MB Cap)
                    </td>
                  </tr>

                  <tr className="hover:bg-black/[0.01]">
                    <td className="py-3 px-3 font-semibold flex items-center gap-2">
                      <Smartphone className="w-4 h-4 text-[#34C759]" />
                      EthioTelecom SMS REST API
                    </td>
                    <td className="py-3 px-3 text-[#8E8E93]">Telecom Gateway (Shortcode)</td>
                    <td className="py-3 px-3 font-mono">api.ethiotelecom.et/v1</td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded-full bg-[#34C759]/10 text-[#34C759] font-semibold text-[10px]">
                        CONNECTED
                      </span>
                    </td>
                    <td className="py-3 px-3 font-mono text-[11px] text-[#8E8E93]">
                      Bearer API Key Secret
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 2: Live API Logs */}
      {activeAdminSection === 'apilogs' && (
        <div className="bg-[#1C1C1E] rounded-3xl border border-white/10 p-6 text-white shadow-[0_8px_30px_rgb(0,0,0,0.12)] space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Terminal className="w-4 h-4 text-[#0A84FF]" />
                Cloud Run &amp; Firebase API Audit Log Stream
              </h3>
              <p className="text-xs text-[#8E8E93] mt-0.5">Real-time HTTP ingress requests and Firestore operations</p>
            </div>
            <button
              onClick={() => copyToClipboard(JSON.stringify(apiLogs, null, 2), 'logs')}
              className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 border border-white/15 transition-all active:scale-95"
            >
              {copiedKey === 'logs' ? <Check className="w-3.5 h-3.5 text-[#30D158]" /> : <Copy className="w-3.5 h-3.5" />}
              {copiedKey === 'logs' ? 'Copied' : 'Export Logs'}
            </button>
          </div>

          <div className="space-y-2 font-mono text-xs max-h-[500px] overflow-y-auto">
            {apiLogs.map((log) => (
              <div
                key={log.id}
                className="p-3 bg-black/40 rounded-2xl border border-white/10 space-y-1.5 hover:border-white/20 transition-all"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 text-[11px]">
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-0.5 rounded-md font-bold text-[10px] ${
                        log.method === 'POST'
                          ? 'bg-[#007AFF]/20 text-[#0A84FF]'
                          : log.method === 'PATCH'
                          ? 'bg-[#FF9500]/20 text-[#FF9F0A]'
                          : 'bg-[#34C759]/20 text-[#30D158]'
                      }`}
                    >
                      {log.method}
                    </span>
                    <span className="text-white font-semibold">{log.endpoint}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[#8E8E93]">
                    <span>{log.latency}</span>
                    <span className="px-1.5 py-0.2 rounded bg-[#30D158]/20 text-[#30D158] font-bold">
                      {log.status}
                    </span>
                    <span>{log.timestamp}</span>
                  </div>
                </div>
                <div className="text-[11px] text-[#8E8E93]">Caller: <span className="text-slate-300">{log.caller}</span></div>
                <div className="text-[11px] text-[#30D158] bg-black/50 p-2 rounded-xl border border-white/5 overflow-x-auto">
                  {log.payload}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION 3: Custom Claims & RBAC Inspector */}
      {activeAdminSection === 'claims' && (
        <div className="bg-white rounded-3xl p-6 md:p-8 border border-black/[0.04] shadow-[0_8px_30px_rgb(0,0,0,0.04)] space-y-6">
          <div className="border-b border-black/[0.05] pb-4">
            <h3 className="text-base font-bold text-[#1C1C1E] flex items-center gap-2">
              <KeyRound className="w-5 h-5 text-[#5856D6]" />
              Firebase Auth Custom Claims &amp; Security Token Inspector
            </h3>
            <p className="text-xs text-[#8E8E93] mt-0.5">
              Inspect how the Firebase Admin SDK writes custom user claims and how they are read by Security Rules.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {(['admin', 'owner', 'manager'] as UserRole[]).map((r) => {
              const u = MOCK_USERS[r];
              const isSelected = selectedUserForClaim === r;
              return (
                <button
                  key={r}
                  onClick={() => setSelectedUserForClaim(r)}
                  className={`p-4 rounded-2xl border text-left transition-all duration-200 active:scale-95 ${
                    isSelected
                      ? 'border-[#007AFF] bg-[#007AFF]/5 shadow-sm'
                      : 'border-black/[0.06] bg-[#F2F2F7] hover:bg-black/[0.03]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <img src={u.avatar} alt={u.name} className="w-10 h-10 rounded-full object-cover shadow-xs" />
                    <div>
                      <div className="text-xs font-bold text-[#1C1C1E]">{u.name}</div>
                      <div className="text-[10px] text-[#8E8E93] uppercase font-bold">{r}</div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Token JSON display */}
          <div className="p-4 bg-[#1C1C1E] rounded-2xl border border-white/10 text-white font-mono text-xs space-y-2">
            <div className="flex items-center justify-between text-[#8E8E93] text-[11px] pb-2 border-b border-white/10">
              <span>// Decoded ID Token Payload (request.auth.token):</span>
              <span className="text-[#30D158]">Algorithm: RS256</span>
            </div>
            <pre className="text-[#30D158] overflow-x-auto">
{JSON.stringify({
  iss: "https://securetoken.google.com/enterprise-pms",
  aud: "enterprise-pms",
  auth_time: 1786689600,
  user_id: MOCK_USERS[selectedUserForClaim].uid,
  sub: MOCK_USERS[selectedUserForClaim].uid,
  email: MOCK_USERS[selectedUserForClaim].email,
  email_verified: true,
  name: MOCK_USERS[selectedUserForClaim].name,
  picture: MOCK_USERS[selectedUserForClaim].avatar,
  role: MOCK_USERS[selectedUserForClaim].role,
  complexAccess: MOCK_USERS[selectedUserForClaim].complexAccess,
  firebase: {
    identities: { email: [MOCK_USERS[selectedUserForClaim].email] },
    sign_in_provider: "password"
  }
}, null, 2)}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};
