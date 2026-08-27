import React, { useState } from 'react';
import { PMSProvider, usePMS } from './context/PMSContext';
import { Navbar } from './components/layout/Navbar';
import { LoginPage } from './components/auth/LoginPage';
import { PlatformLoginPage } from './components/auth/PlatformLoginPage';
import { OwnerExecutiveDashboard } from './components/dashboard/OwnerExecutiveDashboard';
import { ReceiptVerificationVault } from './components/vault/ReceiptVerificationVault';
import { TheRedListTracker } from './components/redlist/TheRedListTracker';
import { TenantsManager } from './components/tenants/TenantsManager';
import { InvoicesPaymentsLedger } from './components/invoices/InvoicesPaymentsLedger';
import { SMSEngineConsole } from './components/sms/SMSEngineConsole';

// Super Admin Components
import { SuperAdminImpersonationBanner } from './components/superadmin/SuperAdminImpersonationBanner';
import { SuperAdminSidebar } from './components/superadmin/SuperAdminSidebar';
import { SuperAdminDashboardView } from './components/superadmin/SuperAdminDashboardView';
import { OrganizationsManager } from './components/superadmin/OrganizationsManager';
import { SubscriptionsManager } from './components/superadmin/SubscriptionsManager';
import { PlansManager } from './components/superadmin/PlansManager';
import { PlatformBillingManager } from './components/superadmin/PlatformBillingManager';
import { GlobalBuildingsManager } from './components/superadmin/GlobalBuildingsManager';
import { GlobalUsersManager } from './components/superadmin/GlobalUsersManager';
import { SuperAdminAuditLogs } from './components/superadmin/SuperAdminAuditLogs';
import { PlatformNotificationsView } from './components/superadmin/PlatformNotificationsModal';
import { SupportTicketsManager } from './components/superadmin/SupportTicketsManager';
import { SystemHealthView } from './components/superadmin/SystemHealthView';
import { PlatformSettingsView } from './components/superadmin/PlatformSettingsView';
import { SmsApiManager } from './components/superadmin/SmsApiManager';
import { AdBannersManager } from './components/superadmin/AdBannersManager';
import { CreateOrganizationModal } from './components/superadmin/CreateOrganizationModal';
import { OrganizationDetailsModal } from './components/superadmin/OrganizationDetailsModal';

import {
  CheckCircle2,
  AlertCircle,
  Info,
  X,
  Lock
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
    switchUser,
    t
  } = usePMS();

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isCreateOrgModalOpen, setIsCreateOrgModalOpen] = useState(false);
  const [selectedOrgDetailsId, setSelectedOrgDetailsId] = useState<string | null>(null);

  // If not authenticated, route to dedicated platform access portal or client PMS login
  if (!isAuthenticated) {
    const rawPath =
      typeof window !== 'undefined'
        ? window.location.pathname.toLowerCase().replace(/\/$/, '') || '/'
        : '/';

    const isPlatformPath =
      rawPath === '/platform-login' ||
      rawPath === '/system-access' ||
      rawPath === '/platform-admin' ||
      rawPath === '/superadmin' ||
      rawPath.startsWith('/superadmin/') ||
      rawPath === '/admin' ||
      rawPath.startsWith('/platform-login') ||
      rawPath.startsWith('/system-access');

    if (isPlatformPath) {
      return <PlatformLoginPage />;
    }

    return <LoginPage />;
  }

  const isSuperAdminView = currentUser.role === 'super_admin';

  return (
    <div className={`bg-[#F2F2F7] text-[#1C1C1E] flex flex-col font-sans selection:bg-[#007AFF] selection:text-white ${isSuperAdminView ? 'dark h-screen max-h-screen overflow-hidden' : 'min-h-screen'}`}>
      {/* Impersonation Banner (Visible whenever Super Admin is impersonating a tenant) */}
      <SuperAdminImpersonationBanner />

      {/* Global iOS Toast Notification */}
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

      {/* Route Guard Error Modal */}
      {guardError && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-[#1C1C1E] rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-[0_20px_60px_rgba(0,0,0,0.2)] border border-black/[0.06] dark:border-white/10 space-y-4 animate-in zoom-in-95 duration-150">
            <div className="w-12 h-12 rounded-2xl bg-[#FF3B30]/10 text-[#FF3B30] flex items-center justify-center mx-auto shadow-sm">
              <Lock className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1.5">
              <h3 className="text-lg font-bold text-[#1C1C1E] dark:text-white">
                Access Denied (HTTP 403)
              </h3>
              <p className="text-xs text-[#8E8E93]">
                Firebase RBAC Middleware Route Guard Protection
              </p>
            </div>

            <div className="p-4 bg-[#F2F2F7] dark:bg-[#2C2C2E] rounded-2xl text-xs space-y-2 text-[#3A3A3C] dark:text-white">
              <div className="flex justify-between">
                <span className="text-[#8E8E93] font-medium">Attempted Route:</span>
                <span className="font-mono font-bold text-[#1C1C1E] dark:text-white">{guardError.attemptedRoute}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#8E8E93] font-medium">Required Identity:</span>
                <span className="font-semibold text-[#007AFF]">{guardError.requiredRole}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#8E8E93] font-medium">Current Session:</span>
                <span className="font-semibold text-[#FF3B30]">{guardError.currentRole}</span>
              </div>
              <p className="pt-2 border-t border-black/[0.05] dark:border-white/10 text-[11px] leading-relaxed text-[#1C1C1E] dark:text-white">
                {guardError.message}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 pt-2">
              <button
                onClick={dismissGuardError}
                className="flex-1 py-3 px-4 rounded-xl bg-[#007AFF] text-white text-xs font-semibold hover:bg-[#0062CC] active:scale-95 transition-all shadow-md shadow-blue-500/20 text-center cursor-pointer"
              >
                Return to Safe Portal
              </button>
            </div>
          </div>
        </div>
      )}

      {/* RENDER SUPER ADMIN CONTROL PLANE */}
      {isSuperAdminView ? (
        <div className="dark flex-1 flex overflow-hidden bg-[#000000] text-white">
          {/* Super Admin Collapsible Sidebar */}
          <SuperAdminSidebar
            activeTab={activeTab.startsWith('sa_') ? activeTab : 'sa_dashboard'}
            setActiveTab={setActiveTab}
            isCollapsed={isSidebarCollapsed}
            setIsCollapsed={setIsSidebarCollapsed}
          />

          {/* Super Admin Main Content Stage */}
          <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 custom-scrollbar">
            <div className="max-w-7xl mx-auto space-y-6">
              {(activeTab === 'sa_dashboard' || !activeTab.startsWith('sa_')) && (
                <SuperAdminDashboardView
                  onNavigate={setActiveTab}
                  onOpenCreateOrg={() => setIsCreateOrgModalOpen(true)}
                  onSelectOrgForDetails={(orgId) => setSelectedOrgDetailsId(orgId)}
                />
              )}

              {activeTab === 'sa_organizations' && (
                <OrganizationsManager
                  onOpenCreateModal={() => setIsCreateOrgModalOpen(true)}
                  onSelectOrgForDetails={(orgId) => setSelectedOrgDetailsId(orgId)}
                />
              )}

              {activeTab === 'sa_sms_api' && <SmsApiManager />}
              {activeTab === 'sa_buildings' && <GlobalBuildingsManager />}
              {activeTab === 'sa_users' && <GlobalUsersManager />}
              {activeTab === 'sa_subscriptions' && <SubscriptionsManager />}
              {activeTab === 'sa_plans' && <PlansManager />}
              {activeTab === 'sa_ads' && <AdBannersManager />}
              {activeTab === 'sa_billing' && <PlatformBillingManager />}
              {activeTab === 'sa_audit_logs' && <SuperAdminAuditLogs />}
              {activeTab === 'sa_notifications' && <PlatformNotificationsView />}
              {activeTab === 'sa_support' && <SupportTicketsManager />}
              {activeTab === 'sa_health' && <SystemHealthView />}
              {activeTab === 'sa_settings' && <PlatformSettingsView />}
            </div>
          </main>
        </div>
      ) : (
        /* STANDARD EPMS CLIENT TENANT WORKSPACE (STRICTLY LIGHT MODE) */
        <div className="flex-1 flex flex-col bg-[#F2F2F7] text-[#1C1C1E]">
          {/* Top Navbar */}
          <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

          {/* Main Applet Content */}
          <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
            {(activeTab === 'dashboard' || (currentUser.role === 'owner' && !['vault', 'invoices', 'owner_ledger'].includes(activeTab))) && (
              <OwnerExecutiveDashboard onNavigate={setActiveTab} />
            )}

            {activeTab === 'vault' && <ReceiptVerificationVault />}
            {activeTab === 'redlist' && <TheRedListTracker />}
            {(activeTab === 'tenants' || activeTab === 'documents' || (currentUser.role === 'manager' && !['vault', 'redlist', 'invoices', 'sms', 'dashboard'].includes(activeTab))) && (
              <TenantsManager />
            )}
            {(activeTab === 'invoices' || activeTab === 'owner_ledger') && (
              <InvoicesPaymentsLedger onNavigateToVault={() => setActiveTab('vault')} />
            )}
            {activeTab === 'sms' && <SMSEngineConsole />}
          </main>

          {/* Standard Footer */}
          <footer className="bg-white/80 backdrop-blur-xl border-t border-black/[0.05] py-4 px-6 text-center text-xs text-[#8E8E93]">
            <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
              <span className="font-medium text-[#3A3A3C] flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#34C759]" />
                {t('footer_role_active')} [{currentUser.role.toUpperCase()}]
                {currentUser.organizationName && ` • ${currentUser.organizationName}`}
              </span>
              <span className="text-[11px] font-medium text-[#8E8E93]">
                EPMS Multi-Tenant SaaS Isolation • Firebase Custom Claims
              </span>
            </div>
          </footer>
        </div>
      )}

      {/* Global Modals for Super Admin Operations */}
      <CreateOrganizationModal
        isOpen={isCreateOrgModalOpen}
        onClose={() => setIsCreateOrgModalOpen(false)}
      />

      <OrganizationDetailsModal
        organizationId={selectedOrgDetailsId}
        onClose={() => setSelectedOrgDetailsId(null)}
      />
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
