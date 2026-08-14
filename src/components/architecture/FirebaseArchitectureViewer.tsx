import React, { useState } from 'react';
import {
  FIRESTORE_SECURITY_RULES,
  FIREBASE_STORAGE_RULES,
  CLOUD_FUNCTIONS_V2_SMS_CODE
} from '../../data/firebaseArchitecture';
import {
  ShieldCheck,
  Code2,
  Lock,
  Play,
  Copy,
  Check,
  Terminal,
  Server,
  Database,
  Cpu,
  Layers
} from 'lucide-react';

export const FirebaseArchitectureViewer: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'tester' | 'firestore_rules' | 'storage_rules' | 'cloud_functions'>('tester');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Security Sandbox State
  const [testActor, setTestActor] = useState<'manager' | 'owner' | 'admin' | 'unauth'>('manager');
  const [testAction, setTestAction] = useState<string>('verify_payment');
  const [simulationResult, setSimulationResult] = useState<{
    allowed: boolean;
    ruleSnippet: string;
    explanation: string;
  } | null>(null);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const evaluateRule = () => {
    if (testActor === 'unauth') {
      setSimulationResult({
        allowed: false,
        ruleSnippet: "function isAuthenticated() { return request.auth != null; }",
        explanation: "DENIED: Request lacks authentication credentials (request.auth is null)."
      });
      return;
    }

    switch (testAction) {
      case 'verify_payment':
        if (testActor === 'owner' || testActor === 'admin') {
          setSimulationResult({
            allowed: true,
            ruleSnippet: "match /payments/{paymentId} { allow update: if isOwner() && request.resource.data.diff(resource.data).affectedKeys().hasOnly(['verificationStatus', 'verifiedBy', 'verifiedAt', 'rejectionReason', 'notes']); }",
            explanation: `PASS: request.auth.token.role == '${testActor}' satisfies isOwner() check. Verification status update permitted.`
          });
        } else {
          setSimulationResult({
            allowed: false,
            ruleSnippet: "match /payments/{paymentId} { allow update: if isOwner(); }",
            explanation: `DENIED: Manager role attempted to modify payment verificationStatus or mark invoice as 'paid'. Requires Owner or Admin custom claims.`
          });
        }
        break;

      case 'delete_tenant':
        if (testActor === 'owner' || testActor === 'admin') {
          setSimulationResult({
            allowed: true,
            ruleSnippet: "match /tenants/{tenantId} { allow delete: if isOwner(); }",
            explanation: `PASS: request.auth.token.role == '${testActor}' authorized to delete tenant documents.`
          });
        } else {
          setSimulationResult({
            allowed: false,
            ruleSnippet: "match /tenants/{tenantId} { allow delete: if isOwner(); }",
            explanation: "DENIED: Operational Managers cannot delete tenant contracts. Restricted to Owner / Admin."
          });
        }
        break;

      case 'log_payment':
        setSimulationResult({
          allowed: true,
          ruleSnippet: "match /payments/{paymentId} { allow create: if isManager() && request.resource.data.verificationStatus == 'unverified'; }",
          explanation: `PASS: ${testActor.toUpperCase()} role permits logging new unverified payment slips into Firestore.`
        });
        break;

      case 'upload_lease':
        setSimulationResult({
          allowed: true,
          ruleSnippet: "match /tenants/{tenantId}/documents/{fileName} { allow write: if isManager() && request.resource.size < 25 * 1024 * 1024; }",
          explanation: `PASS: Document upload authorized for ${testActor} role with size validation.`
        });
        break;

      case 'query_analytics':
        if (testActor === 'owner' || testActor === 'admin') {
          setSimulationResult({
            allowed: true,
            ruleSnippet: "match /analytics/{docId} { allow read: if isOwner(); }",
            explanation: `PASS: Owner/Admin custom claims permit reading aggregated revenue indices.`
          });
        } else {
          setSimulationResult({
            allowed: false,
            ruleSnippet: "match /analytics/{docId} { allow read: if isOwner(); }",
            explanation: "DENIED: Manager cannot query high-level executive revenue aggregates directly."
          });
        }
        break;

      default:
        break;
    }
  };

  return (
    <div id="firebase-architecture-view" className="space-y-6">
      {/* iOS Header Banner */}
      <div className="bg-[#1C1C1E] border border-white/10 rounded-3xl p-6 md:p-8 text-white shadow-[0_8px_30px_rgb(0,0,0,0.12)] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2.5 py-0.5 text-xs font-bold rounded-full bg-[#007AFF]/20 text-[#0A84FF] border border-[#007AFF]/30 flex items-center gap-1.5 font-mono">
              <Layers className="w-3.5 h-3.5 text-[#0A84FF]" />
              FIREBASE ARCHITECTURE SPECIFICATIONS
            </span>
            <span className="text-xs text-[#8E8E93] font-mono hidden sm:inline">Security Rules &amp; Cloud Functions v2</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-white flex items-center gap-2">
            Enterprise RBAC &amp; Cloud Blueprint
          </h2>
          <p className="text-xs md:text-sm text-[#8E8E93] mt-1 max-w-2xl">
            Inspect production Firestore Security Rules, Firebase Storage policies, Cloud Functions v2 scheduled triggers, and test custom claim evaluations live.
          </p>
        </div>

        {/* Tab Switcher - iOS Segmented Control */}
        <div className="flex flex-wrap items-center gap-1 bg-white/10 p-1.5 rounded-2xl border border-white/10">
          <button
            onClick={() => setActiveTab('tester')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 active:scale-95 ${
              activeTab === 'tester' ? 'bg-[#007AFF] text-white shadow-[0_2px_8px_rgba(0,122,255,0.3)]' : 'text-[#8E8E93] hover:text-white'
            }`}
          >
            ⚡ Rules Sandbox
          </button>
          <button
            onClick={() => setActiveTab('firestore_rules')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 active:scale-95 ${
              activeTab === 'firestore_rules' ? 'bg-[#007AFF] text-white shadow-[0_2px_8px_rgba(0,122,255,0.3)]' : 'text-[#8E8E93] hover:text-white'
            }`}
          >
            firestore.rules
          </button>
          <button
            onClick={() => setActiveTab('storage_rules')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 active:scale-95 ${
              activeTab === 'storage_rules' ? 'bg-[#007AFF] text-white shadow-[0_2px_8px_rgba(0,122,255,0.3)]' : 'text-[#8E8E93] hover:text-white'
            }`}
          >
            storage.rules
          </button>
          <button
            onClick={() => setActiveTab('cloud_functions')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 active:scale-95 ${
              activeTab === 'cloud_functions' ? 'bg-[#007AFF] text-white shadow-[0_2px_8px_rgba(0,122,255,0.3)]' : 'text-[#8E8E93] hover:text-white'
            }`}
          >
            Cloud Functions v2
          </button>
        </div>
      </div>

      {/* TAB 1: Live Interactive RBAC Test Bench */}
      {activeTab === 'tester' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 md:p-8 border border-black/[0.04] shadow-[0_8px_30px_rgb(0,0,0,0.04)] space-y-6">
            <div className="border-b border-black/[0.05] pb-4">
              <h3 className="text-base font-bold text-[#1C1C1E] flex items-center gap-2">
                <Terminal className="w-5 h-5 text-[#007AFF]" />
                Live Firestore Security Rules &amp; Custom Claims Test Bench
              </h3>
              <p className="text-xs text-[#8E8E93] mt-0.5">
                Simulate how Firebase evaluates incoming requests against <code className="font-mono text-[#007AFF]">request.auth.token.role</code> and security declarations.
              </p>
            </div>

            {/* Test Configuration Controls */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5 text-xs">
                <label className="font-semibold text-[#1C1C1E] block">1. Select Requesting Identity (Custom Claim)</label>
                <select
                  value={testActor}
                  onChange={(e) => setTestActor(e.target.value as any)}
                  className="w-full p-2.5 rounded-xl border border-black/[0.06] bg-[#F2F2F7] text-[#1C1C1E] focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#007AFF] font-medium"
                >
                  <option value="manager">Manager (request.auth.token.role == 'manager')</option>
                  <option value="owner">Owner (request.auth.token.role == 'owner')</option>
                  <option value="admin">Admin (request.auth.token.role == 'admin')</option>
                  <option value="unauth">Unauthenticated (request.auth == null)</option>
                </select>
              </div>

              <div className="space-y-1.5 text-xs">
                <label className="font-semibold text-[#1C1C1E] block">2. Select Target Operation</label>
                <select
                  value={testAction}
                  onChange={(e) => setTestAction(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-black/[0.06] bg-[#F2F2F7] text-[#1C1C1E] focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#007AFF] font-medium"
                >
                  <option value="verify_payment">Verify &amp; Approve Payment Slip (Update /payments &amp; /invoices)</option>
                  <option value="delete_tenant">Delete Tenant Document (/tenants/{'{tenantId}'})</option>
                  <option value="log_payment">Log New Payment Slip (Create /payments with unverified)</option>
                  <option value="upload_lease">Upload Lease Document to Storage Bucket</option>
                  <option value="query_analytics">Query Total Portfolio Revenue Aggregates (/analytics)</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={evaluateRule}
                className="px-4 py-2.5 rounded-2xl bg-[#007AFF] hover:bg-[#0062CC] text-white text-xs font-semibold shadow-[0_4px_12px_rgba(0,122,255,0.3)] flex items-center gap-2 active:scale-95 transition-all"
              >
                <Play className="w-4 h-4 fill-white" />
                Evaluate Security Rule
              </button>
            </div>

            {/* Test Result Output Box */}
            {simulationResult && (
              <div
                className={`p-5 rounded-2xl border text-xs space-y-3 transition-all ${
                  simulationResult.allowed
                    ? 'bg-[#34C759]/10 border-[#34C759]/20 text-[#34C759]'
                    : 'bg-[#FF3B30]/10 border-[#FF3B30]/20 text-[#FF3B30]'
                }`}
              >
                <div className="flex items-center justify-between font-bold">
                  <span className="flex items-center gap-2 text-sm">
                    {simulationResult.allowed ? (
                      <>
                        <ShieldCheck className="w-5 h-5 text-[#34C759]" />
                        PERMISSION GRANTED (HTTP 200)
                      </>
                    ) : (
                      <>
                        <Lock className="w-5 h-5 text-[#FF3B30]" />
                        PERMISSION DENIED (HTTP 403: Missing or insufficient permissions)
                      </>
                    )}
                  </span>
                  <span className="font-mono text-[11px] uppercase">
                    Actor: {testActor}
                  </span>
                </div>

                <p className="font-semibold leading-relaxed text-[#1C1C1E]">
                  {simulationResult.explanation}
                </p>

                <div className="p-3 bg-[#1C1C1E] text-slate-100 rounded-xl font-mono text-[11px] overflow-x-auto border border-white/10">
                  <span className="text-[#8E8E93] block mb-1">// Matching Security Rule Evaluated:</span>
                  {simulationResult.ruleSnippet}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: firestore.rules */}
      {activeTab === 'firestore_rules' && (
        <div className="bg-[#1C1C1E] rounded-3xl border border-white/10 p-6 text-white shadow-[0_8px_30px_rgb(0,0,0,0.12)] space-y-3">
          <div className="flex items-center justify-between border-b border-white/10 pb-3.5">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-200">
              <Database className="w-4 h-4 text-[#0A84FF]" />
              firestore.rules (Role-Based Access Control)
            </div>
            <button
              onClick={() => handleCopy(FIRESTORE_SECURITY_RULES, 'firestore')}
              className="px-3.5 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 border border-white/15 transition-all active:scale-95"
            >
              {copiedKey === 'firestore' ? <Check className="w-3.5 h-3.5 text-[#30D158]" /> : <Copy className="w-3.5 h-3.5" />}
              {copiedKey === 'firestore' ? 'Copied!' : 'Copy Rules'}
            </button>
          </div>
          <pre className="p-4 bg-black/40 rounded-2xl font-mono text-xs text-[#30D158] overflow-x-auto max-h-[550px] leading-relaxed border border-white/10">
            {FIRESTORE_SECURITY_RULES}
          </pre>
        </div>
      )}

      {/* TAB 3: storage.rules */}
      {activeTab === 'storage_rules' && (
        <div className="bg-[#1C1C1E] rounded-3xl border border-white/10 p-6 text-white shadow-[0_8px_30px_rgb(0,0,0,0.12)] space-y-3">
          <div className="flex items-center justify-between border-b border-white/10 pb-3.5">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-200">
              <Server className="w-4 h-4 text-[#0A84FF]" />
              storage.rules (File Size &amp; MIME Enforcement)
            </div>
            <button
              onClick={() => handleCopy(FIREBASE_STORAGE_RULES, 'storage')}
              className="px-3.5 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 border border-white/15 transition-all active:scale-95"
            >
              {copiedKey === 'storage' ? <Check className="w-3.5 h-3.5 text-[#30D158]" /> : <Copy className="w-3.5 h-3.5" />}
              {copiedKey === 'storage' ? 'Copied!' : 'Copy Rules'}
            </button>
          </div>
          <pre className="p-4 bg-black/40 rounded-2xl font-mono text-xs text-[#30D158] overflow-x-auto max-h-[550px] leading-relaxed border border-white/10">
            {FIREBASE_STORAGE_RULES}
          </pre>
        </div>
      )}

      {/* TAB 4: Cloud Functions v2 */}
      {activeTab === 'cloud_functions' && (
        <div className="bg-[#1C1C1E] rounded-3xl border border-white/10 p-6 text-white shadow-[0_8px_30px_rgb(0,0,0,0.12)] space-y-3">
          <div className="flex items-center justify-between border-b border-white/10 pb-3.5">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-200">
              <Cpu className="w-4 h-4 text-[#0A84FF]" />
              functions/src/scheduled/dailyRentReminderEngine.ts (Cloud Functions v2)
            </div>
            <button
              onClick={() => handleCopy(CLOUD_FUNCTIONS_V2_SMS_CODE, 'functions')}
              className="px-3.5 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 border border-white/15 transition-all active:scale-95"
            >
              {copiedKey === 'functions' ? <Check className="w-3.5 h-3.5 text-[#30D158]" /> : <Copy className="w-3.5 h-3.5" />}
              {copiedKey === 'functions' ? 'Copied!' : 'Copy TypeScript Code'}
            </button>
          </div>
          <pre className="p-4 bg-black/40 rounded-2xl font-mono text-xs text-[#30D158] overflow-x-auto max-h-[550px] leading-relaxed border border-white/10">
            {CLOUD_FUNCTIONS_V2_SMS_CODE}
          </pre>
        </div>
      )}
    </div>
  );
};
