import React from 'react';
import { PMSProvider, usePMS } from './context/PMSContext';
import { Navbar } from './components/layout/Navbar';
import { LoginPage } from './components/auth/LoginPage';
import { SuperAdminDashboard } from './components/admin/SuperAdminDashboard';
import { OwnerExecutiveDashboard } from './components/dashboard/OwnerExecutiveDashboard';
import { ReceiptVerificationVault } from './components/vault/ReceiptVerificationVault';
import { TheRedListTracker } from './components/redlist/TheRedListTracker';
import { TenantsManager } from './components/tenants/TenantsManager';
import { InvoicesPaymentsLedger } from './components/invoices/InvoicesPaymentsLedger';
import { SMSEngineConsole } from './components/sms/SMSEngineConsole';
import { FirebaseArchitectureViewer } from './components/architecture/FirebaseArchitectureViewer';
import {
  CheckCircle2,
  AlertCircle,
  Info,
  X,
  ShieldAlert,
  Lock,
  ArrowLeft
} from 'lucide-react';

function PMSAppContent() {
  const {
    isAuthenticated,
    currentUser,
    activeTab,
    setActiveTab,
    notification,
    clearNotification,
    guardError,
    dismissGuardError,
    switchUser
  } = usePMS();

  // If not authenticated, render the iOS-themed Login Page
  if (!isAuthenticated) {
    return <LoginPage />;
  }

  return (
    <div className="min-h-screen bg-[#F2F2F7] text-[#1C1C1E] flex flex-col font-sans selection:bg-[#007AFF] selection:text-white">
      {/* Top Navigation Bar with iPadOS / iOS Style */}
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Global iOS Dynamic Island / Capsule Toast Notification */}
      {notification && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-top-4 duration-200">
          <div
            className={`px-4 py-2.5 rounded-full shadow-[0_8px_30px_rgba(0,0,0,0.18)] backdrop-blur-2xl text-xs font-semibold flex items-center gap-2.5 border transition-all ${
              notification.type === 'success'
                ? 'bg-[#1C1C1E]/90 text-white border-white/10'
                : notification.type === 'error'
                ? 'bg-[#FF3B30]/95 text-white border-[#FF3B30]'
                : 'bg-[#1C1C1E]/90 text-white border-white/10'
            }`}
          >
            {notification.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-[#34C759] shrink-0" />
            ) : notification.type === 'error' ? (
              <AlertCircle className="w-4 h-4 text-white shrink-0" />
            ) : (
              <Info className="w-4 h-4 text-[#007AFF] shrink-0" />
            )}
            <span className="tracking-tight">{notification.message}</span>
            <button
              onClick={clearNotification}
              className="p-0.5 hover:bg-white/20 rounded-full transition-colors ml-1 text-white/70 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* iOS Route Protection / Middleware Security Dialog */}
      {guardError && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-[0_20px_60px_rgba(0,0,0,0.2)] border border-black/[0.06] space-y-4 animate-in zoom-in-95 duration-150">
            <div className="w-12 h-12 rounded-2xl bg-[#FF3B30]/10 text-[#FF3B30] flex items-center justify-center mx-auto shadow-sm">
              <Lock className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1.5">
              <h3 className="text-lg font-bold text-[#1C1C1E]">
                Access Denied (HTTP 403)
              </h3>
              <p className="text-xs text-[#8E8E93]">
                Firebase RBAC Middleware Route Guard Protection
              </p>
            </div>

            <div className="p-4 bg-[#F2F2F7] rounded-2xl text-xs space-y-2 text-[#3A3A3C]">
              <div className="flex justify-between">
                <span className="text-[#8E8E93] font-medium">Attempted Route:</span>
                <span className="font-mono font-bold text-[#1C1C1E]">{guardError.attemptedRoute}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#8E8E93] font-medium">Required Identity:</span>
                <span className="font-semibold text-[#007AFF]">{guardError.requiredRole}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#8E8E93] font-medium">Current Session:</span>
                <span className="font-semibold text-[#FF3B30]">{guardError.currentRole}</span>
              </div>
              <p className="pt-2 border-t border-black/[0.05] text-[11px] leading-relaxed text-[#1C1C1E]">
                {guardError.message}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 pt-2">
              <button
                onClick={dismissGuardError}
                className="flex-1 py-3 px-4 rounded-xl bg-[#007AFF] text-white text-xs font-semibold hover:bg-[#0062CC] active:scale-95 transition-all shadow-md shadow-blue-500/20 text-center"
              >
                Return to Safe Portal
              </button>
              {guardError.requiredRole.includes('Owner') && (
                <button
                  onClick={() => {
                    switchUser('owner');
                    dismissGuardError();
                  }}
                  className="py-3 px-4 rounded-xl bg-black/[0.05] hover:bg-black/[0.1] text-[#1C1C1E] text-xs font-semibold active:scale-95 transition-all"
                >
                  Switch to Owner
                </button>
              )}
              {guardError.requiredRole.includes('Admin') && (
                <button
                  onClick={() => {
                    switchUser('admin');
                    dismissGuardError();
                  }}
                  className="py-3 px-4 rounded-xl bg-black/[0.05] hover:bg-black/[0.1] text-[#1C1C1E] text-xs font-semibold active:scale-95 transition-all"
                >
                  Switch to Admin
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Main Applet Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Super Admin Dashboard */}
        {activeTab === 'admin_monitoring' && (
          <SuperAdminDashboard onNavigateToTab={setActiveTab} />
        )}

        {/* Owner Executive Dashboard */}
        {activeTab === 'dashboard' && (
          <OwnerExecutiveDashboard onNavigate={setActiveTab} />
        )}

        {/* Receipt Verification Vault */}
        {activeTab === 'vault' && <ReceiptVerificationVault />}

        {/* The Red List Delinquent Tracker */}
        {activeTab === 'redlist' && <TheRedListTracker />}

        {/* Tenants & Lease Management */}
        {activeTab === 'tenants' && <TenantsManager />}

        {/* Invoices & Ledger */}
        {activeTab === 'invoices' && (
          <InvoicesPaymentsLedger onNavigateToVault={() => setActiveTab('vault')} />
        )}

        {/* SMS Scheduled Reminder Engine */}
        {activeTab === 'sms' && <SMSEngineConsole />}

        {/* Firebase Security Rules & Cloud Functions Architecture */}
        {activeTab === 'rules' && <FirebaseArchitectureViewer />}
      </main>

      {/* iOS Apple Styled Footer */}
      <footer className="bg-white/70 backdrop-blur-xl border-t border-black/[0.05] py-4 px-6 text-center text-xs text-[#8E8E93]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span className="font-medium text-[#3A3A3C] flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#34C759]" />
            Enterprise PMS • Multi-Role Authentication Active [{currentUser.role.toUpperCase()}]
          </span>
          <span className="text-[11px] font-medium text-[#8E8E93]">
            Firebase Auth &amp; Custom Claims RBAC • Protected Routes (/admin, /owner, /manager)
          </span>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <PMSProvider>
      <PMSAppContent />
    </PMSProvider>
  );
}
