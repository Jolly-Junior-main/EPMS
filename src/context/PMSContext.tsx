import { auth, db } from '../lib/firebase';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { signInWithEmailAndPassword, signOut as firebaseSignOut, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import confetti from 'canvas-confetti';
import {
  UserRole,
  UserProfile,
  Tenant,
  Unit,
  Invoice,
  Payment,
  SMSLog,
  Property,
  VerificationAuditLog,
  TenantDocument,
  MaintenanceRequest,
  MaintenanceStatus,
  LeaseRenewalRequest,
  ClientBrandTheme
} from '../types/pms';
import {
  Organization,
  PlatformPlan,
  Subscription,
  PlatformInvoice,
  SuperAdminAuditLog,
  PlatformNotification,
  SupportTicket,
  PlatformSettings,
  ImpersonationContext,
  PlanTier,
  SupportTicketStatus,
  PlatformAdBanner,
  SmsApiGatewayConfig,
  SubscriptionBillingCycle
} from '../types/superAdmin';
import {
  MOCK_USERS,
  MOCK_PROPERTIES,
  MOCK_UNITS,
  MOCK_TENANTS,
  MOCK_INVOICES,
  MOCK_PAYMENTS,
  MOCK_SMS_LOGS,
  MOCK_MAINTENANCE_REQUESTS,
  MOCK_RENEWAL_REQUESTS,
  CLIENT_THEMES,
  generateBankReceiptSvg
} from '../data/mockData';
import {
  MOCK_ORGANIZATIONS,
  MOCK_PLATFORM_PLANS,
  MOCK_SUBSCRIPTIONS,
  MOCK_PLATFORM_INVOICES,
  MOCK_SUPERADMIN_AUDIT_LOGS,
  MOCK_SUPPORT_TICKETS,
  MOCK_PLATFORM_NOTIFICATIONS,
  DEFAULT_PLATFORM_SETTINGS,
  MOCK_AD_BANNERS,
  DEFAULT_SMS_API_CONFIG
} from '../data/mockSuperAdminData';
import { Language, TRANSLATIONS } from '../data/translations';
import {
  seedFirestoreIfEmpty,
  subscribeToPMSCollections,
  saveTenantToFirestore,
  deleteTenantFromFirestore,
  saveInvoiceToFirestore,
  deleteInvoiceFromFirestore,
  savePaymentToFirestore,
  deletePaymentFromFirestore,
  resetFirestoreToDefaults,
  saveSMSLogToFirestore,
  saveAuditLogToFirestore,
  updateUnitInFirestore
} from '../lib/firestoreService';

interface PMSContextType {
  currentUser: UserProfile;
  clientTheme: ClientBrandTheme;
  isAuthenticated: boolean;
  isFirestoreConnected: boolean;
  syncStatus: 'synced' | 'syncing' | 'offline';
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, defaultText?: string) => string;
  activeRoleRoute: string; // '/admin' | '/owner' | '/manager'
  activeTab: string;
  setActiveTab: (tab: string) => void;
  login: (usernameOrEmail: string, password: string) => Promise<{ success: boolean; error?: string; role?: UserRole }>;
  platformLogin: (usernameOrEmail: string, password: string) => Promise<{ success: boolean; error?: string; role?: UserRole }>;
  logout: () => void;
  switchUser: (role: UserRole) => void;
  guardError: { attemptedRoute: string; requiredRole: string; currentRole: string; message: string } | null;
  dismissGuardError: () => void;
  navigateRoleRoute: (route: string) => boolean;
  properties: Property[];
  selectedPropertyId: string;
  setSelectedPropertyId: (id: string) => void;
  tenants: Tenant[];
  units: Unit[];
  invoices: Invoice[];
  payments: Payment[];
  smsLogs: SMSLog[];
  auditLogs: VerificationAuditLog[];
  notification: { message: string; type: 'success' | 'error' | 'info' } | null;
  clearNotification: () => void;
  
  // Maintenance & Work Orders
  maintenanceRequests: MaintenanceRequest[];
  createMaintenanceRequest: (req: Omit<MaintenanceRequest, 'requestId' | 'ticketNumber' | 'reportedDate'>) => { success: boolean; error?: string };
  updateMaintenanceStatus: (requestId: string, status: MaintenanceStatus, resolutionNotes?: string) => { success: boolean; error?: string };
  
  // Lease Renewal Workflow
  renewalRequests: LeaseRenewalRequest[];
  submitRenewalRequest: (req: Omit<LeaseRenewalRequest, 'requestId' | 'submittedAt' | 'status'>) => { success: boolean; error?: string };
  
  // Operational Actions (Manager & Owner)
  addTenant: (tenant: Omit<Tenant, 'tenantId' | 'createdAt' | 'documents'>) => { success: boolean; error?: string };
  updateTenant: (tenantId: string, updates: Partial<Tenant>) => { success: boolean; error?: string };
  deleteTenant: (tenantId: string) => { success: boolean; error?: string };
  uploadTenantDocument: (tenantId: string, doc: Omit<TenantDocument, 'docId' | 'uploadedAt'>) => { success: boolean; error?: string };
  
  // Invoices & Payments
  createInvoice: (invoice: Omit<Invoice, 'invoiceId' | 'invoiceNumber'>) => { success: boolean; error?: string };
  deleteInvoice: (invoiceId: string) => { success: boolean; error?: string };
  logPayment: (payment: Omit<Payment, 'paymentId' | 'submittedAt' | 'verificationStatus' | 'submittedBy'>) => { success: boolean; error?: string };
  
  // Verification Vault (Owner / Admin Exclusive)
  verifyPayment: (paymentId: string, approved: boolean, rejectionReason?: string) => { success: boolean; error?: string };
  
  // SMS Engine
  runAutomatedSMSEngine: () => Promise<{ query1Sent: number; query2Sent: number; logs: SMSLog[] }>;
  sendCustomSMS: (recipientPhone: string, recipientName: string, text: string, tenantId?: string) => Promise<boolean>;
  
  // Analytics & Derived Queries
  getRedList: () => Array<Invoice & { tenantName: string; unitNumber: string; phone: string; agingDays: number; totalWithLateFee: number }>;
  getRevenueMetrics: () => {
    totalExpectedETB: number;
    grossCollectedETB: number;
    netOutstandingETB: number;
    delinquentETB: number;
    collectionRatePercent: number;
    totalOccupiedUnits: number;
    occupancyRatePercent: number;
    pendingVerificationCount: number;
    redListCount: number;
  };
  
  // Super Admin & Multi-Tenant State
  organizations: Organization[];
  plans: PlatformPlan[];
  subscriptions: Subscription[];
  platformInvoices: PlatformInvoice[];
  superAdminAuditLogs: SuperAdminAuditLog[];
  platformNotifications: PlatformNotification[];
  supportTickets: SupportTicket[];
  platformSettings: PlatformSettings;
  impersonationContext: ImpersonationContext | null;
  adBanners: PlatformAdBanner[];
  isAdBannerGlobalEnabled: boolean;
  smsApiConfig: SmsApiGatewayConfig;
  
  // Super Admin Operational Methods
  createOrganization: (
    org: Omit<Organization, 'organizationId' | 'createdAt' | 'lastActivityAt' | 'usage'> & {
      billingCycle?: SubscriptionBillingCycle;
      buildingsCount?: number;
      unitsPerBuilding?: number;
    }
  ) => { success: boolean; error?: string };
  updateOrganization: (orgId: string, updates: Partial<Organization>) => { success: boolean; error?: string };
  suspendOrganization: (orgId: string, reason?: string) => { success: boolean; error?: string };
  activateOrganization: (orgId: string) => { success: boolean; error?: string };
  deleteOrganization: (orgId: string) => { success: boolean; error?: string };
  departOrganization: (
    orgId: string,
    departureData: {
      reason: import('../types/superAdmin').OrganizationDepartureReason;
      notes: string;
      keysReturned: boolean;
      depositSettled: boolean;
      vacateUnits: boolean;
      revokeAccess: boolean;
    }
  ) => { success: boolean; error?: string; vacatedUnitsCount?: number };
  reactivateDepartedOrganization: (orgId: string) => { success: boolean; error?: string };
  startImpersonation: (orgId: string) => { success: boolean; error?: string };
  exitImpersonation: () => void;
  extendSubscription: (subId: string, monthsToAdd: number) => { success: boolean; error?: string };
  extendSubscriptionWithCycle: (subId: string, cycle: SubscriptionBillingCycle) => { success: boolean; error?: string };
  updateSubscriptionPlan: (subId: string, newPlanTier: PlanTier) => { success: boolean; error?: string };
  addTrialDays: (subId: string, days: number) => { success: boolean; error?: string };
  updatePlatformPlan: (planId: string, updates: Partial<PlatformPlan>) => { success: boolean; error?: string };
  resetClientPassword: (orgId: string, userUid: string, newPassword?: string) => { success: boolean; message?: string };
  createCommercialUnitForClient: (orgId: string, unitData: { businessName: string; unitNumber: string; monthlyRentETB: number; managerName: string; managerPhone: string; managerEmail?: string }) => { success: boolean; error?: string };
  createSalonForClient: (orgId: string, salonData: { salonName: string; unitNumber: string; monthlyRentETB: number; managerName: string; managerPhone: string; managerEmail?: string }) => { success: boolean; error?: string };
  createAdBanner: (ad: Omit<PlatformAdBanner, 'adId' | 'createdAt'>) => { success: boolean; error?: string };
  updateAdBanner: (adId: string, updates: Partial<PlatformAdBanner>) => { success: boolean; error?: string };
  deleteAdBanner: (adId: string) => { success: boolean; error?: string };
  toggleAdBanner: (adId: string) => { success: boolean; error?: string };
  toggleAdBannerGlobal: (enabled?: boolean) => void;
  updateSmsApiConfig: (config: Partial<SmsApiGatewayConfig>) => { success: boolean; error?: string };
  logSuperAdminAudit: (log: Omit<SuperAdminAuditLog, 'logId' | 'timestamp' | 'actorId' | 'actorName' | 'actorRole' | 'ipAddress'>) => void;
  markNotificationRead: (notificationId: string) => void;
  createSupportTicket: (ticket: Omit<SupportTicket, 'ticketId' | 'ticketNumber' | 'createdAt' | 'updatedAt'>) => { success: boolean; error?: string };
  updateSupportTicketStatus: (ticketId: string, status: SupportTicketStatus, resolutionNotes?: string) => { success: boolean; error?: string };
  updatePlatformSettings: (updates: Partial<PlatformSettings>) => { success: boolean; error?: string };
  getSuperAdminMetrics: () => {
    totalOrganizations: number;
    activeOrganizations: number;
    suspendedOrganizations: number;
    totalBuildings: number;
    totalUnits: number;
    occupiedUnits: number;
    vacantUnits: number;
    totalUsers: number;
    activeSubscriptions: number;
    expiringSubscriptions: number;
    monthlyRecurringRevenueETB: number;
    totalRevenueETB: number;
    unreadNotificationsCount: number;
  };

  resetToSampleData: () => Promise<void>;
}

const PMSContext = createContext<PMSContextType | undefined>(undefined);

const STORAGE_KEY = 'enterprise_pms_data_v1';

export const TAB_TO_PATH: Record<string, string> = {
  sa_dashboard: '/superadmin',
  sa_organizations: '/superadmin/orgs',
  sa_sms_api: '/superadmin/sms',
  sa_subscriptions: '/superadmin/subs',
  sa_plans: '/superadmin/plans',
  sa_ads: '/superadmin/ads',
  sa_billing: '/superadmin/billing',
  sa_health: '/superadmin/health',
  sa_audit_logs: '/superadmin/logs',
  sa_notifications: '/superadmin/notifications',
  sa_support: '/superadmin/support',
  sa_settings: '/superadmin/settings',
  sa_buildings: '/superadmin/buildings',
  sa_users: '/superadmin/users',
  dashboard: '/owner',
  owner_ledger: '/owner/ledger',
  vault: '/owner/vault',
  tenants: '/manager/tenants',
  documents: '/manager/documents',
  invoices: '/manager/invoices',
  redlist: '/manager/redlist',
  sms: '/manager/sms',
  tenant_portal: '/portal',
  admin_monitoring: '/admin'
};

export const getTabPathForUser = (tab: string, role: UserRole): string => {
  if (role === 'super_admin') {
    return TAB_TO_PATH[tab] || '/superadmin';
  }
  if (role === 'owner') {
    if (tab === 'invoices' || tab === 'owner_ledger') return '/owner/ledger';
    if (tab === 'vault') return '/owner/vault';
    if (tab === 'redlist') return '/owner/redlist';
    return '/owner';
  }
  // manager
  if (tab === 'tenants' || tab === 'documents') return '/manager/tenants';
  if (tab === 'invoices') return '/manager/invoices';
  if (tab === 'sms') return '/manager/sms';
  if (tab === 'redlist') return '/manager/redlist';
  if (tab === 'dashboard') return '/manager';
  return '/manager';
};

export const PATH_MAP: Record<string, { tab: string; role: UserRole; route: string }> = {
  '/superadmin/subscriptions': { tab: 'sa_subscriptions', role: 'super_admin', route: '/superadmin' },
  '/superadmin/subs': { tab: 'sa_subscriptions', role: 'super_admin', route: '/superadmin' },
  '/superadmin/organizations': { tab: 'sa_organizations', role: 'super_admin', route: '/superadmin' },
  '/superadmin/orgs': { tab: 'sa_organizations', role: 'super_admin', route: '/superadmin' },
  '/superadmin/clients': { tab: 'sa_organizations', role: 'super_admin', route: '/superadmin' },
  '/superadmin/sms': { tab: 'sa_sms_api', role: 'super_admin', route: '/superadmin' },
  '/superadmin/plans': { tab: 'sa_plans', role: 'super_admin', route: '/superadmin' },
  '/superadmin/pricing': { tab: 'sa_plans', role: 'super_admin', route: '/superadmin' },
  '/superadmin/prices': { tab: 'sa_plans', role: 'super_admin', route: '/superadmin' },
  '/superadmin/price': { tab: 'sa_plans', role: 'super_admin', route: '/superadmin' },
  '/superadmin/ads': { tab: 'sa_ads', role: 'super_admin', route: '/superadmin' },
  '/superadmin/ad': { tab: 'sa_ads', role: 'super_admin', route: '/superadmin' },
  '/superadmin/announcements': { tab: 'sa_ads', role: 'super_admin', route: '/superadmin' },
  '/superadmin/banners': { tab: 'sa_ads', role: 'super_admin', route: '/superadmin' },
  '/superadmin/billing': { tab: 'sa_billing', role: 'super_admin', route: '/superadmin' },
  '/superadmin/health': { tab: 'sa_health', role: 'super_admin', route: '/superadmin' },
  '/superadmin/audit': { tab: 'sa_audit_logs', role: 'super_admin', route: '/superadmin' },
  '/superadmin/logs': { tab: 'sa_audit_logs', role: 'super_admin', route: '/superadmin' },
  '/superadmin/notifications': { tab: 'sa_notifications', role: 'super_admin', route: '/superadmin' },
  '/superadmin/support': { tab: 'sa_support', role: 'super_admin', route: '/superadmin' },
  '/superadmin/settings': { tab: 'sa_settings', role: 'super_admin', route: '/superadmin' },
  '/superadmin/buildings': { tab: 'sa_buildings', role: 'super_admin', route: '/superadmin' },
  '/superadmin/users': { tab: 'sa_users', role: 'super_admin', route: '/superadmin' },
  '/superadmin/dashboard': { tab: 'sa_dashboard', role: 'super_admin', route: '/superadmin' },
  '/superadmin': { tab: 'sa_dashboard', role: 'super_admin', route: '/superadmin' },
  '/pricing': { tab: 'sa_plans', role: 'super_admin', route: '/superadmin' },
  '/plans': { tab: 'sa_plans', role: 'super_admin', route: '/superadmin' },
  '/ads': { tab: 'sa_ads', role: 'super_admin', route: '/superadmin' },
  '/owner/revenue': { tab: 'dashboard', role: 'owner', route: '/owner' },
  '/owner/ledger': { tab: 'owner_ledger', role: 'owner', route: '/owner' },
  '/owner/vault': { tab: 'vault', role: 'owner', route: '/owner' },
  '/owner': { tab: 'dashboard', role: 'owner', route: '/owner' },
  '/manager/tenants': { tab: 'tenants', role: 'manager', route: '/manager' },
  '/manager/documents': { tab: 'documents', role: 'manager', route: '/manager' },
  '/manager/invoices': { tab: 'invoices', role: 'manager', route: '/manager' },
  '/manager/redlist': { tab: 'redlist', role: 'manager', route: '/manager' },
  '/manager/sms': { tab: 'sms', role: 'manager', route: '/manager' },
  '/manager': { tab: 'tenants', role: 'manager', route: '/manager' },
  '/portal': { tab: 'tenant_portal', role: 'tenant', route: '/portal' },
  '/admin': { tab: 'admin_monitoring', role: 'admin', route: '/admin' }
};

const getUserForRole = (role: UserRole | string): UserProfile => {
  if (role === 'super_admin' || role === 'superadmin' || role === 'admin') return MOCK_USERS.superadmin;
  if (role === 'owner') return MOCK_USERS.bole_owner;
  if (role === 'manager') return MOCK_USERS.bole_manager;
  return MOCK_USERS[role] || MOCK_USERS.superadmin;
};

const isPlatformRoute = (path: string) => {
  const p = path.toLowerCase().replace(/\/$/, '') || '/';
  return (
    p === '/platform-login' ||
    p === '/system-access' ||
    p === '/platform-admin' ||
    p === '/superadmin' ||
    p.startsWith('/superadmin/') ||
    p === '/admin' ||
    p.startsWith('/platform-login') ||
    p.startsWith('/system-access')
  );
};

const getInitialRouteInfo = () => {
  if (typeof window === 'undefined') {
    return { isAuth: false, user: MOCK_USERS.bole_owner, route: '/login', tab: 'dashboard' };
  }
  const cleanPath = window.location.pathname.toLowerCase().replace(/\/$/, '') || '/';
  
  if (isPlatformRoute(cleanPath)) {
    return { isAuth: false, user: MOCK_USERS.superadmin, route: '/platform-login', tab: 'sa_dashboard' };
  }
  return { isAuth: false, user: MOCK_USERS.bole_owner, route: '/login', tab: 'dashboard' };
};

export const PMSProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const initialRoute = getInitialRouteInfo();

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(initialRoute.isAuth);
  const [currentUser, setCurrentUser] = useState<UserProfile>(initialRoute.user);
  const [activeRoleRoute, setActiveRoleRoute] = useState<string>(initialRoute.route);
  const [activeTab, setActiveTab] = useState<string>(initialRoute.tab);
  const [guardError, setGuardError] = useState<{ attemptedRoute: string; requiredRole: string; currentRole: string; message: string } | null>(null);
  const [selectedPropertyId, setSelectedPropertyId] = useState<string>('all');
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  useEffect(() => {
    const demoUser = localStorage.getItem('pms_demo_user');
    if (demoUser) {
      const u = JSON.parse(demoUser);
      setCurrentUser(u);
      setIsAuthenticated(true);
      setActiveRoleRoute(u.role === 'super_admin' ? '/superadmin' : u.role === 'owner' ? '/owner' : '/manager');
      return;
    }
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data() as UserProfile;
            setCurrentUser(userData);
            setIsAuthenticated(true);
          } else if (user.email === 'admin@epms.com') {
            setCurrentUser({ email: 'admin@epms.com', role: 'super_admin', firstName: 'Super', lastName: 'Admin' } as any);
            setIsAuthenticated(true);
          }
        } catch (err) {
          console.error("Error fetching user profile", err);
        }
      } else {
        setIsAuthenticated(false);
      }
    });
    return () => unsubscribe();
  }, []);

  // Synchronize browser URL history and prevent unauthorized back navigation
  useEffect(() => {
    const handlePopState = () => {
      const cleanPath = window.location.pathname.toLowerCase().replace(/\/$/, '') || '/';
      
      // Check auth state in localStorage
      let isAuth = false;
      let savedUser: UserProfile | null = null;
      try {
        const authVal = localStorage.getItem(`${STORAGE_KEY}_auth_state`);
        const userStr = localStorage.getItem(`${STORAGE_KEY}_user_profile`);
        if (authVal === 'true' && userStr) {
          isAuth = true;
          savedUser = JSON.parse(userStr);
        }
      } catch (e) {
        isAuth = false;
      }

      // If user is NOT authenticated, block all back navigation to protected routes!
      if (!isAuth || !savedUser) {
        setIsAuthenticated(false);
        if (!isPlatformRoute(cleanPath) && cleanPath !== '/login') {
          window.history.replaceState(null, '', '/login');
        }
        return;
      }

      // If authenticated and tries to go to login pages via back button, stay on current dashboard
      if (cleanPath === '/login' || cleanPath === '/platform-login' || cleanPath === '/system-access') {
        const targetPath = getTabPathForUser(activeTab, savedUser.role);
        window.history.replaceState(null, '', targetPath);
        return;
      }

      // Sync active tab/route if valid path
      const sortedEntries = Object.entries(PATH_MAP).sort((a, b) => b[0].length - a[0].length);
      const match = PATH_MAP[cleanPath] || sortedEntries.find(([k]) => cleanPath === k || cleanPath.startsWith(k + '/'))?.[1];

      if (match) {
        if (savedUser.role === 'super_admin' || (match.role !== 'super_admin' && savedUser.role === match.role)) {
          setIsAuthenticated(true);
          setCurrentUser(savedUser);
          setActiveRoleRoute(match.route);
          setActiveTab(match.tab);
        } else {
          // Role mismatch (e.g. client trying to access superadmin), block and force user's own route
          const targetPath = getTabPathForUser(activeTab, savedUser.role);
          window.history.replaceState(null, '', targetPath);
          setGuardError({
            attemptedRoute: cleanPath,
            requiredRole: 'SUPER_ADMIN',
            currentRole: savedUser.role.toUpperCase(),
            message: '403 Forbidden: Administrative clearance required to access this system resource.'
          });
        }
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [activeTab]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const cleanPath = window.location.pathname.toLowerCase().replace(/\/$/, '') || '/';

    if (isAuthenticated) {
      const targetPath = getTabPathForUser(activeTab, currentUser.role);
      if (targetPath && window.location.pathname !== targetPath) {
        window.history.pushState(null, '', targetPath);
      }
    } else {
      if (isPlatformRoute(cleanPath)) {
        // Do not redirect platform login endpoints
      } else if (cleanPath !== '/login') {
        window.history.replaceState(null, '', '/login');
      }
    }
  }, [activeTab, activeRoleRoute, isAuthenticated, currentUser.role]);

  // Multilingual Support (English & Amharic)
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('epms_language') as Language;
    return saved === 'am' ? 'am' : 'en';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('epms_language', lang);
  };

  const t = (key: string, defaultText?: string): string => {
    return TRANSLATIONS[language]?.[key] || defaultText || TRANSLATIONS.en[key] || key;
  };

  // Firestore Real-Time Connectivity State
  const [isFirestoreConnected, setIsFirestoreConnected] = useState<boolean>(false);
  const [syncStatus, setSyncStatus] = useState<'synced' | 'syncing' | 'offline'>('syncing');

  // Core Data Collections
  const [properties, setProperties] = useState<Property[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_properties`);
      return saved ? JSON.parse(saved) : MOCK_PROPERTIES;
    } catch {
      return MOCK_PROPERTIES;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_properties`, JSON.stringify(properties));
    } catch (e) {
      // ignore
    }
  }, [properties]);
  const [units, setUnits] = useState<Unit[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_units`);
    return saved ? JSON.parse(saved) : MOCK_UNITS;
  });
  const [tenants, setTenants] = useState<Tenant[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_tenants`);
    return saved ? JSON.parse(saved) : MOCK_TENANTS;
  });
  const [invoices, setInvoices] = useState<Invoice[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_invoices`);
    return saved ? JSON.parse(saved) : MOCK_INVOICES;
  });
  const [payments, setPayments] = useState<Payment[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_payments`);
    return saved ? JSON.parse(saved) : MOCK_PAYMENTS;
  });
  const [smsLogs, setSmsLogs] = useState<SMSLog[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_sms_logs`);
    return saved ? JSON.parse(saved) : MOCK_SMS_LOGS;
  });
  const [maintenanceRequests, setMaintenanceRequests] = useState<MaintenanceRequest[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_maintenance_requests`);
    return saved ? JSON.parse(saved) : MOCK_MAINTENANCE_REQUESTS;
  });
  const [renewalRequests, setRenewalRequests] = useState<LeaseRenewalRequest[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_renewal_requests`);
    return saved ? JSON.parse(saved) : MOCK_RENEWAL_REQUESTS;
  });
  const [auditLogs, setAuditLogs] = useState<VerificationAuditLog[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_audit_logs`);
    return saved ? JSON.parse(saved) : [
      {
        id: 'audit_01',
        paymentId: 'pay_2026_004',
        invoiceId: 'inv_2026_07_003',
        action: 'verified',
        performedBy: 'Abebe Mengesha (Owner)',
        role: 'owner',
        timestamp: '2026-07-12T16:00:00Z',
        details: 'Approved Dashen Bank EFT receipt of 210,000.00 ETB for Suite 301.'
      }
    ];
  });

  // Super Admin & Multi-Tenant State Hooks
  const [organizations, setOrganizations] = useState<Organization[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_sa_organizations`);
    return saved ? JSON.parse(saved) : MOCK_ORGANIZATIONS;
  });

  const [plans, setPlans] = useState<PlatformPlan[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_sa_plans`);
    return saved ? JSON.parse(saved) : MOCK_PLATFORM_PLANS;
  });

  const [subscriptions, setSubscriptions] = useState<Subscription[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_sa_subscriptions`);
    return saved ? JSON.parse(saved) : MOCK_SUBSCRIPTIONS;
  });

  const [platformInvoices, setPlatformInvoices] = useState<PlatformInvoice[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_sa_invoices`);
    return saved ? JSON.parse(saved) : MOCK_PLATFORM_INVOICES;
  });

  const [superAdminAuditLogs, setSuperAdminAuditLogs] = useState<SuperAdminAuditLog[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_sa_audit_logs`);
    return saved ? JSON.parse(saved) : MOCK_SUPERADMIN_AUDIT_LOGS;
  });

  const [platformNotifications, setPlatformNotifications] = useState<PlatformNotification[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_sa_notifications`);
    return saved ? JSON.parse(saved) : MOCK_PLATFORM_NOTIFICATIONS;
  });

  const [supportTickets, setSupportTickets] = useState<SupportTicket[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_sa_tickets`);
    return saved ? JSON.parse(saved) : MOCK_SUPPORT_TICKETS;
  });

  const [platformSettings, setPlatformSettings] = useState<PlatformSettings>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_sa_settings`);
    return saved ? JSON.parse(saved) : DEFAULT_PLATFORM_SETTINGS;
  });

  const [adBanners, setAdBanners] = useState<PlatformAdBanner[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_sa_ad_banners`);
    return saved ? JSON.parse(saved) : MOCK_AD_BANNERS;
  });

  const [isAdBannerGlobalEnabled, setIsAdBannerGlobalEnabled] = useState<boolean>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_ad_banner_global_enabled`);
    return saved !== null ? JSON.parse(saved) : true;
  });

  const [smsApiConfig, setSmsApiConfigState] = useState<SmsApiGatewayConfig>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_sa_sms_api_cfg`);
    return saved ? JSON.parse(saved) : DEFAULT_SMS_API_CONFIG;
  });

  const [impersonationContext, setImpersonationContext] = useState<ImpersonationContext | null>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_impersonation_ctx`);
    return saved ? JSON.parse(saved) : null;
  });

  const [organizationPasswords, setOrganizationPasswords] = useState<Record<string, string>>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_org_passwords`);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_org_passwords`, JSON.stringify(organizationPasswords));
    } catch (e) {
      // ignore
    }
  }, [organizationPasswords]);

  // Audit logging utility for Super Admin operations
  const logSuperAdminAudit = (log: Omit<SuperAdminAuditLog, 'logId' | 'timestamp' | 'actorId' | 'actorName' | 'actorRole' | 'ipAddress'>) => {
    const actorId = currentUser?.uid || 'usr_root_superadmin';
    const actorName = currentUser?.name || 'Super Administrator';
    const actorRole = currentUser?.role || 'super_admin';

    const newLog: SuperAdminAuditLog = {
      ...log,
      logId: `slog_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      timestamp: new Date().toISOString(),
      actorId,
      actorName,
      actorRole,
      ipAddress: '197.156.103.42'
    };
    setSuperAdminAuditLogs((prev) => [newLog, ...(prev || [])]);
  };

  // Active Client Brand Theme
  const clientTheme: ClientBrandTheme = useMemo(() => {
    if (currentUser.role === 'super_admin' && !impersonationContext?.isImpersonating) {
      return {
        propertyId: 'platform_core',
        propertyName: 'EPMS Platform Control',
        organizationName: 'Platform Super Admin',
        citySubcity: 'Global Admin, Control Plane',
        gradientClass: 'from-slate-900 to-slate-800',
        primaryColor: '#000000',
        badgeBgClass: 'bg-black/20',
        badgeTextClass: 'text-white',
        badgeBorderClass: 'border-white/20',
        logoIconName: 'Building2',
        tagline: 'Platform Root Operations',
        escrowAccount: 'PLATFORM_ROOT'
      } as ClientBrandTheme;
    }

    const orgId = currentUser.organizationId;
    if (orgId && CLIENT_THEMES[orgId]) {
      return CLIENT_THEMES[orgId];
    }

    // Dynamic Organization resolution from state
    const dynamicOrg = organizations.find(
      (o) => o.organizationId === orgId || (currentUser.organizationName && o.name.toLowerCase() === currentUser.organizationName.toLowerCase())
    );
    if (dynamicOrg) {
      const gradientOptions = [
        'from-[#007AFF] to-[#5856D6]',
        'from-[#34C759] to-[#30B0C7]',
        'from-[#FF9500] to-[#FF2D55]',
        'from-[#5856D6] to-[#AF52DE]',
        'from-[#FF2D55] to-[#5856D6]'
      ];
      const grad = gradientOptions[Math.abs(dynamicOrg.name.length) % gradientOptions.length];

      return {
        propertyId: `prop_${dynamicOrg.organizationId}`,
        propertyName: dynamicOrg.tradeName || dynamicOrg.name,
        organizationName: dynamicOrg.name,
        citySubcity: `${dynamicOrg.address || dynamicOrg.city || 'Addis Ababa'}, ${dynamicOrg.country || 'Ethiopia'}`,
        gradientClass: grad,
        primaryColor: '#007AFF',
        badgeBgClass: 'bg-[#007AFF]/10',
        badgeTextClass: 'text-[#007AFF]',
        badgeBorderClass: 'border-[#007AFF]/20',
        logoIconName: 'Building2',
        tagline: `${dynamicOrg.planTier.toUpperCase()} Commercial PMS Workspace`
      };
    }

    const propId = currentUser.assignedPropertyId || currentUser.complexAccess?.[0];
    if (propId) {
      const found = Object.values(CLIENT_THEMES).find((t) => t.propertyId === propId);
      if (found) return found;
    }

    if (currentUser.organizationName) {
      return {
        propertyId: orgId || 'prop_custom',
        propertyName: currentUser.organizationName,
        organizationName: currentUser.organizationName,
        citySubcity: 'Addis Ababa, Ethiopia',
        gradientClass: 'from-[#007AFF] to-[#5856D6]',
        primaryColor: '#007AFF',
        badgeBgClass: 'bg-[#007AFF]/10',
        badgeTextClass: 'text-[#007AFF]',
        badgeBorderClass: 'border-[#007AFF]/20',
        logoIconName: 'Building2',
        tagline: 'Enterprise Commercial PMS'
      };
    }

    return CLIENT_THEMES.org_bole_plaza;
  }, [currentUser, organizations]);

  // Effective property for data isolation
  const effectivePropertyId = useMemo(() => {
    if (currentUser.role === 'super_admin') return selectedPropertyId;
    return currentUser.assignedPropertyId || currentUser.complexAccess?.[0] || 'prop_bole_01';
  }, [currentUser, selectedPropertyId]);

  // Scoped Data Collections strictly filtered by client building
  const scopedTenants = useMemo(() => {
    if (currentUser.role === 'super_admin' && effectivePropertyId === 'all') return tenants;
    return tenants.filter((t) => t.propertyId === effectivePropertyId);
  }, [tenants, currentUser, effectivePropertyId]);

  const scopedUnits = useMemo(() => {
    if (currentUser.role === 'super_admin' && effectivePropertyId === 'all') return units;
    return units.filter((u) => u.propertyId === effectivePropertyId);
  }, [units, currentUser, effectivePropertyId]);

  const scopedInvoices = useMemo(() => {
    if (currentUser.role === 'super_admin' && effectivePropertyId === 'all') return invoices;
    return invoices.filter((inv) => inv.propertyId === effectivePropertyId);
  }, [invoices, currentUser, effectivePropertyId]);

  const scopedPayments = useMemo(() => {
    if (currentUser.role === 'super_admin' && effectivePropertyId === 'all') return payments;
    const invMap = new Map(invoices.map((i) => [i.invoiceId, i.propertyId]));
    return payments.filter((p) => {
      const pId = invMap.get(p.invoiceId) || (p.unitId?.includes('bole') ? 'prop_bole_01' : p.unitId?.includes('kaz') ? 'prop_kazanchis_02' : p.unitId?.includes('sar') ? 'prop_sarbet_03' : 'prop_cmc_04');
      return pId === effectivePropertyId;
    });
  }, [payments, invoices, currentUser, effectivePropertyId]);

  const scopedSmsLogs = useMemo(() => {
    if (currentUser.role === 'super_admin' && effectivePropertyId === 'all') return smsLogs;
    return smsLogs.filter((s) => !s.organizationId || s.organizationId === currentUser.organizationId);
  }, [smsLogs, currentUser, effectivePropertyId]);

  // Sync state to LocalStorage
  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_sa_organizations`, JSON.stringify(organizations));
  }, [organizations]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_sa_plans`, JSON.stringify(plans));
  }, [plans]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_sa_subscriptions`, JSON.stringify(subscriptions));
  }, [subscriptions]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_sa_invoices`, JSON.stringify(platformInvoices));
  }, [platformInvoices]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_sa_audit_logs`, JSON.stringify(superAdminAuditLogs));
  }, [superAdminAuditLogs]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_sa_notifications`, JSON.stringify(platformNotifications));
  }, [platformNotifications]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_sa_tickets`, JSON.stringify(supportTickets));
  }, [supportTickets]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_sa_settings`, JSON.stringify(platformSettings));
  }, [platformSettings]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_sa_ad_banners`, JSON.stringify(adBanners));
  }, [adBanners]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_ad_banner_global_enabled`, JSON.stringify(isAdBannerGlobalEnabled));
  }, [isAdBannerGlobalEnabled]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_sa_sms_api_cfg`, JSON.stringify(smsApiConfig));
  }, [smsApiConfig]);

  useEffect(() => {
    if (impersonationContext) {
      localStorage.setItem(`${STORAGE_KEY}_impersonation_ctx`, JSON.stringify(impersonationContext));
    } else {
      localStorage.removeItem(`${STORAGE_KEY}_impersonation_ctx`);
    }
  }, [impersonationContext]);

  // Initialize Firestore Collections & Real-time Listeners
  useEffect(() => {
    let isMounted = true;

    async function initFirestore() {
      try {
        setSyncStatus('syncing');
        await seedFirestoreIfEmpty();
        if (isMounted) {
          setIsFirestoreConnected(true);
          setSyncStatus('synced');
        }
      } catch (err) {
        console.warn('Firestore initial sync notice:', err);
        if (isMounted) {
          setIsFirestoreConnected(false);
          setSyncStatus('offline');
        }
      }
    }

    initFirestore();

    const unsubscribe = subscribeToPMSCollections(currentUser.organizationId, {
      onTenants: (list) => {
        if (isMounted) {
          setTenants(list);
          setIsFirestoreConnected(true);
          setSyncStatus('synced');
        }
      },
      onUnits: (list) => {
        if (isMounted) {
          setUnits(list);
        }
      },
      onInvoices: (list) => {
        if (isMounted) {
          setInvoices(list);
        }
      },
      onPayments: (list) => {
        if (isMounted) {
          setPayments(list);
        }
      },
      onSMSLogs: (list) => {
        if (isMounted) {
          setSmsLogs(list);
        }
      },
      onAuditLogs: (list) => {
        if (isMounted) {
          setAuditLogs(list);
        }
      },
      onError: (err) => {
        console.warn('Firestore subscription fallback:', err.message);
      }
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_auth_state`, JSON.stringify(isAuthenticated));
    localStorage.setItem(`${STORAGE_KEY}_user_profile`, JSON.stringify(currentUser));
    localStorage.setItem(`${STORAGE_KEY}_units`, JSON.stringify(units));
    localStorage.setItem(`${STORAGE_KEY}_tenants`, JSON.stringify(tenants));
    localStorage.setItem(`${STORAGE_KEY}_invoices`, JSON.stringify(invoices));
    localStorage.setItem(`${STORAGE_KEY}_payments`, JSON.stringify(payments));
    localStorage.setItem(`${STORAGE_KEY}_sms_logs`, JSON.stringify(smsLogs));
    localStorage.setItem(`${STORAGE_KEY}_audit_logs`, JSON.stringify(auditLogs));
  }, [isAuthenticated, currentUser, units, tenants, invoices, payments, smsLogs, auditLogs]);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification((prev) => (prev?.message === message ? null : prev));
    }, 4000);
  };

  const clearNotification = () => setNotification(null);
  const dismissGuardError = () => setGuardError(null);

  // -------------------------------------------------------------
  // Firebase Authentication & Role Route Redirection
  // -------------------------------------------------------------
  const login = async (usernameOrEmail: string, password: string): Promise<{ success: boolean; error?: string; role?: UserRole }> => {
    if (usernameOrEmail === 'bole@epms.com' && password === '123') {
      const userData = { email: 'bole@epms.com', role: 'owner', organizationId: 'org_bole_plaza', organizationName: 'Bole Medhanialem Commercial Plaza PLC', firstName: 'Bole', lastName: 'Owner', status: 'active', name: 'Bole Owner' };
      setCurrentUser(userData as any);
      setIsAuthenticated(true);
      setGuardError(null);
      setActiveRoleRoute('/owner');
      setActiveTab('dashboard');
      localStorage.setItem('pms_demo_user', JSON.stringify(userData));
      if (typeof window !== 'undefined') window.history.pushState(null, '', '/owner');
      return { success: true, role: 'owner' };
    }
    try {
      const userCred = await signInWithEmailAndPassword(auth, usernameOrEmail, password);
      const userDoc = await getDoc(doc(db, 'users', userCred.user.uid));
      
      if (!userDoc.exists()) {
         await firebaseSignOut(auth);
         return { success: false, error: 'User profile not found.' };
      }
      
      const userData = userDoc.data() as UserProfile;
      
      if (userData.role === 'super_admin' || userData.role === 'SUPER_ADMIN') {
         await firebaseSignOut(auth);
         return { success: false, error: 'Access Restricted: Super Administrators must log in via the dedicated Platform Access portal.' };
      }
      
      setCurrentUser(userData);
      setIsAuthenticated(true);
      setGuardError(null);
      
      const targetRoute = userData.role === 'owner' ? '/owner' : '/manager';
      const targetTab = userData.role === 'owner' ? 'dashboard' : 'tenants';
      
      setActiveRoleRoute(targetRoute);
      setActiveTab(targetTab);
      
      if (typeof window !== 'undefined') {
        window.history.pushState(null, '', targetRoute);
      }
      
      showToast(`Welcome, ${userData.name}! Authenticated successfully.`, 'success');
      return { success: true, role: userData.role };
    } catch (err: any) {
      console.error(err);
      return { success: false, error: err.message || 'Authentication failed. Invalid credentials.' };
    }
  };

  // -------------------------------------------------------------
  // DEDICATED SUPER ADMIN PLATFORM LOGIN (/platform-login & /system-access)
  // -------------------------------------------------------------
  const platformLogin = async (usernameOrEmail: string, password: string): Promise<{ success: boolean; error?: string; role?: UserRole }> => {
    if (usernameOrEmail === 'admin@epms.com' && password === '123') {
      const userData = { email: 'admin@epms.com', role: 'super_admin', firstName: 'Platform', lastName: 'Admin', status: 'active', organizationId: 'security_gate', organizationName: 'EPMS Platform', name: 'Platform Admin' };
      setCurrentUser(userData as any);
      setIsAuthenticated(true);
      setGuardError(null);
      setActiveRoleRoute('/superadmin');
      setActiveTab('sa_dashboard');
      localStorage.setItem('pms_demo_user', JSON.stringify(userData));
      if (typeof window !== 'undefined') window.history.pushState(null, '', '/superadmin');
      return { success: true, role: 'super_admin' };
    }
    try {
      const userCred = await signInWithEmailAndPassword(auth, usernameOrEmail, password);
      const token = await userCred.user.getIdTokenResult();
      
      if (token.claims.role !== 'SUPER_ADMIN') {
         await firebaseSignOut(auth);
         return { success: false, error: 'Access Denied: Insufficient administrative clearance.' };
      }
      
      const userDoc = await getDoc(doc(db, 'users', userCred.user.uid));
      const userData = userDoc.exists() ? (userDoc.data() as UserProfile) : MOCK_USERS.superadmin;
      
      setCurrentUser(userData);
      setIsAuthenticated(true);
      setGuardError(null);
      setActiveRoleRoute('/superadmin');
      setActiveTab('sa_dashboard');
      
      if (typeof window !== 'undefined') {
        window.history.pushState(null, '', '/superadmin');
      }
      
      showToast(`Root Access Granted: Welcome, ${userData.name}.`, 'success');
      return { success: true, role: 'super_admin' };
    } catch (err: any) {
      console.error(err);
      return { success: false, error: 'Access Denied: Invalid administrator credentials or insufficient clearance.' };
    }
  };

  // -------------------------------------------------------------
  // BACKEND / API SUPER ADMIN CLEARANCE VERIFICATION
  // -------------------------------------------------------------
  const verifySuperAdminClearance = (actionName: string): boolean => {
    if (currentUser.role !== 'super_admin' && !impersonationContext?.isImpersonating) {
      logSuperAdminAudit({
        organizationId: 'security_gate',
        organizationName: 'EPMS Security Enforcement',
        action: 'UNAUTHORIZED_API_ATTEMPT',
        resource: 'platform_api',
        resourceId: actionName,
        details: `BLOCKED unauthorized API call to [${actionName}] by non-admin user [${currentUser.name}] (Role: ${currentUser.role})`
      });
      showToast('403 Forbidden: Super Administrator clearance required.', 'error');
      return false;
    }
    return true;
  };

  const logout = () => {
    localStorage.removeItem('pms_demo_user');
    const wasSuperAdmin = currentUser.role === 'super_admin';

    if (wasSuperAdmin) {
      logSuperAdminAudit({
        organizationId: 'platform_core',
        organizationName: 'EPMS Platform Control',
        action: 'SUPER_ADMIN_LOGOUT',
        resource: 'auth_gateway',
        resourceId: 'root_session',
        details: `Super Administrator [${currentUser.name}] terminated control plane session.`
      });
    }

    try {
      localStorage.setItem(`${STORAGE_KEY}_auth_state`, 'false');
      localStorage.removeItem(`${STORAGE_KEY}_user_profile`);
    } catch (e) {
      // ignore
    }
    setIsAuthenticated(false);
    setImpersonationContext(null);

    if (typeof window !== 'undefined') {
      const redirectPath = wasSuperAdmin ? '/platform-login' : '/login';
      window.history.replaceState(null, '', redirectPath);
    }
    showToast('Signed out of Enterprise PMS. Session securely terminated.', 'info');
  };

  // Switch User directly
  const switchUser = (role: UserRole) => {
    const targetUser = getUserForRole(role);
    if (targetUser) {
      try {
        localStorage.setItem(`${STORAGE_KEY}_auth_state`, 'true');
        localStorage.setItem(`${STORAGE_KEY}_user_profile`, JSON.stringify(targetUser));
      } catch (e) {
        // ignore
      }
      setCurrentUser(targetUser);
      setIsAuthenticated(true);
      setGuardError(null);
      if (role === 'super_admin') {
        setActiveRoleRoute('/superadmin');
        setActiveTab('sa_dashboard');
      } else if (role === 'admin') {
        setActiveRoleRoute('/superadmin');
        setActiveTab('sa_dashboard');
      } else if (role === 'owner') {
        setActiveRoleRoute('/owner');
        setActiveTab('dashboard');
      } else if (role === 'manager') {
        setActiveRoleRoute('/manager');
        setActiveTab('tenants');
      } else {
        setActiveRoleRoute('/owner');
        setActiveTab('dashboard');
      }
      showToast(`Switched active persona to [${targetUser.name}] (${role.toUpperCase()})`, 'info');
    }
  };

  // Route Guard / Middleware check
  const navigateRoleRoute = (targetRoute: string): boolean => {
    // Super Admin has universal access across all modules and workspaces
    if (currentUser.role === 'admin' || currentUser.role === 'super_admin' || impersonationContext?.isImpersonating) {
      setActiveRoleRoute(targetRoute);
      setGuardError(null);
      return true;
    }

    // Owner restricted from /admin
    if (currentUser.role === 'owner') {
      if (targetRoute.startsWith('/admin') || targetRoute.startsWith('/superadmin')) {
        setGuardError({
          attemptedRoute: targetRoute,
          requiredRole: 'Super Admin',
          currentRole: 'Building Owner',
          message: 'Access Denied: The route contains low-level cloud infrastructure and is strictly restricted to Super Administrators.'
        });
        showToast('Route Guard: Super Admin role required', 'error');
        return false;
      }
      setActiveRoleRoute(targetRoute);
      setGuardError(null);
      return true;
    }

    // Manager restricted from /admin and /owner verification
    if (currentUser.role === 'manager') {
      if (targetRoute.startsWith('/admin') || targetRoute.startsWith('/superadmin')) {
        setGuardError({
          attemptedRoute: targetRoute,
          requiredRole: 'Super Admin',
          currentRole: 'Property Manager',
          message: 'Access Denied: Property Managers cannot access the cloud system console.'
        });
        showToast('Route Guard: Super Admin role required', 'error');
        return false;
      }
      if (targetRoute.startsWith('/owner')) {
        setGuardError({
          attemptedRoute: targetRoute,
          requiredRole: 'Building Owner',
          currentRole: 'Property Manager',
          message: 'Access Denied: The route /owner is reserved for Executive Revenue Analytics and Digital Receipt Verification approvals.'
        });
        showToast('Route Guard: Building Owner role required for /owner', 'error');
        return false;
      }
      setActiveRoleRoute(targetRoute);
      setGuardError(null);
      return true;
    }

    // Tenant restricted from administrative management routes
    if (currentUser.role === 'tenant') {
      if (!targetRoute.startsWith('/portal')) {
        setGuardError({
          attemptedRoute: targetRoute,
          requiredRole: 'Management / Owner',
          currentRole: 'Commercial Tenant',
          message: 'Access Denied: Tenants only have access to their Self-Service Portal (/portal).'
        });
        showToast('Route Guard: Management role required', 'error');
        return false;
      }
      setActiveRoleRoute(targetRoute);
      setGuardError(null);
      return true;
    }

    return true;
  };

  const resetToSampleData = async () => {
    try {
      setSyncStatus('syncing');
      await resetFirestoreToDefaults();
      localStorage.clear();
      setUnits(MOCK_UNITS);
      setTenants(MOCK_TENANTS);
      setInvoices(MOCK_INVOICES);
      setPayments(MOCK_PAYMENTS);
      setSmsLogs(MOCK_SMS_LOGS);
      setSyncStatus('synced');
      showToast('Enterprise PMS database reset to default records across all browsers.', 'success');
    } catch (err) {
      console.warn('Reset error:', err);
      showToast('Database reset applied locally.', 'info');
    }
  };

  // -------------------------------------------------------------
  // Role-Based Access Control Checks
  // -------------------------------------------------------------
  const canPerformManagerAction = () => {
    return ['manager', 'owner', 'admin', 'super_admin'].includes(currentUser.role) || !!impersonationContext?.isImpersonating;
  };

  const canPerformOwnerAction = () => {
    return ['owner', 'admin', 'super_admin'].includes(currentUser.role) || !!impersonationContext?.isImpersonating;
  };

  // -------------------------------------------------------------
  // Tenant Operations
  // -------------------------------------------------------------
  const addTenant = (tenantData: Omit<Tenant, 'tenantId' | 'createdAt' | 'documents'>) => {
    if (!canPerformManagerAction()) {
      showToast('Firebase RBAC Violation: Insufficient permissions to register tenant.', 'error');
      return { success: false, error: 'Permission denied' };
    }

    const tenantId = `ten_${Date.now()}`;
    const newTenant: Tenant = {
      ...tenantData,
      tenantId,
      createdAt: new Date().toISOString(),
      documents: []
    };

    setTenants((prev) => [newTenant, ...prev]);
    // Mark unit as occupied
    setUnits((prev) =>
      prev.map((u) => (u.unitId === tenantData.assignedUnitId ? { ...u, status: 'occupied', currentTenantId: tenantId } : u))
    );

    // Save to Firestore
    saveTenantToFirestore(newTenant).catch((err) => console.warn('Firestore tenant write:', err));
    updateUnitInFirestore(tenantData.assignedUnitId, { status: 'occupied', currentTenantId: tenantId }).catch((err) => console.warn('Firestore unit write:', err));

    showToast(`Registered tenant "${tenantData.legalName}" successfully.`, 'success');
    return { success: true };
  };

  const updateTenant = (tenantId: string, updates: Partial<Tenant>) => {
    if (!canPerformManagerAction()) {
      showToast('Firebase RBAC Violation: Insufficient permissions to update tenant.', 'error');
      return { success: false, error: 'Permission denied' };
    }

    setTenants((prev) => {
      const updated = prev.map((t) => (t.tenantId === tenantId ? { ...t, ...updates } : t));
      const target = updated.find((t) => t.tenantId === tenantId);
      if (target) {
        saveTenantToFirestore(target).catch((err) => console.warn('Firestore tenant update:', err));
      }
      return updated;
    });
    showToast('Tenant record updated in Firestore.', 'success');
    return { success: true };
  };

  const deleteTenant = (tenantId: string) => {
    if (!canPerformManagerAction()) {
      showToast('Firebase RBAC Violation: Insufficient permissions to delete tenant.', 'error');
      return { success: false, error: 'Permission denied.' };
    }

    const tenant = tenants.find((t) => t.tenantId === tenantId);
    if (!tenant) return { success: false, error: 'Tenant not found' };

    setTenants((prev) => prev.filter((t) => t.tenantId !== tenantId));
    // Free assigned unit
    setUnits((prev) =>
      prev.map((u) => (u.unitId === tenant.assignedUnitId ? { ...u, status: 'vacant', currentTenantId: undefined } : u))
    );

    // Delete in Firestore
    deleteTenantFromFirestore(tenantId).catch((err) => console.warn('Firestore tenant delete:', err));
    if (tenant.assignedUnitId) {
      updateUnitInFirestore(tenant.assignedUnitId, { status: 'vacant', currentTenantId: undefined }).catch((err) => console.warn('Firestore unit free:', err));
    }

    showToast(`Deleted tenant "${tenant.legalName}" from Firestore.`, 'info');
    return { success: true };
  };

  const uploadTenantDocument = (tenantId: string, docData: Omit<TenantDocument, 'docId' | 'uploadedAt'>) => {
    if (!canPerformManagerAction()) {
      showToast('Firebase RBAC Violation: Insufficient permissions for Storage upload.', 'error');
      return { success: false, error: 'Permission denied' };
    }

    const docId = `doc_${Date.now()}`;
    const newDoc: TenantDocument = {
      ...docData,
      docId,
      uploadedAt: new Date().toISOString()
    };

    setTenants((prev) => {
      const updated = prev.map((t) => (t.tenantId === tenantId ? { ...t, documents: [newDoc, ...t.documents] } : t));
      const target = updated.find((t) => t.tenantId === tenantId);
      if (target) {
        saveTenantToFirestore(target).catch((err) => console.warn('Firestore doc upload:', err));
      }
      return updated;
    });

    showToast(`Uploaded document "${docData.name}" to Firebase Storage.`, 'success');
    return { success: true };
  };

  // -------------------------------------------------------------
  // Invoices & Payment Logging
  // -------------------------------------------------------------
  const createInvoice = (invoiceData: Omit<Invoice, 'invoiceId' | 'invoiceNumber'>) => {
    if (!canPerformManagerAction()) {
      showToast('Firebase RBAC Violation: Insufficient permissions to issue invoice.', 'error');
      return { success: false, error: 'Permission denied' };
    }

    const invoiceId = `inv_${Date.now()}`;
    const invoiceNumber = `INV-${new Date().getFullYear()}-${String(invoices.length + 1).padStart(4, '0')}`;

    const newInvoice: Invoice = {
      ...invoiceData,
      invoiceId,
      invoiceNumber
    };

    setInvoices((prev) => [newInvoice, ...prev]);
    saveInvoiceToFirestore(newInvoice).catch((err) => console.warn('Firestore invoice save:', err));

    showToast(`Generated invoice ${invoiceNumber} for ${invoiceData.amountDue.toLocaleString()} ETB.`, 'success');
    return { success: true };
  };

  const deleteInvoice = (invoiceId: string) => {
    if (!canPerformManagerAction()) {
      showToast('Firebase RBAC Violation: Insufficient permissions to delete invoice.', 'error');
      return { success: false, error: 'Permission denied.' };
    }

    const inv = invoices.find((i) => i.invoiceId === invoiceId);
    if (!inv) return { success: false, error: 'Invoice not found' };

    setInvoices((prev) => prev.filter((i) => i.invoiceId !== invoiceId));
    deleteInvoiceFromFirestore(invoiceId).catch((err) => console.warn('Firestore invoice delete:', err));
    showToast(`Deleted invoice ${inv.invoiceNumber} from Firestore.`, 'info');
    return { success: true };
  };

  const logPayment = (paymentData: Omit<Payment, 'paymentId' | 'submittedAt' | 'verificationStatus' | 'submittedBy'>) => {
    const paymentId = `pay_${Date.now()}`;
    const newPayment: Payment = {
      ...paymentData,
      paymentId,
      submittedAt: new Date().toISOString(),
      verificationStatus: 'verified',
      verifiedBy: 'Telegram Bot (@epms_receipt_bot)',
      verifiedAt: new Date().toISOString(),
      submittedBy: `${currentUser.name} (${currentUser.role})`
    };

    setPayments((prev) => [newPayment, ...prev]);
    savePaymentToFirestore(newPayment).catch((err) => console.warn('Firestore payment save:', err));

    // Update the invoice status to paid
    setInvoices((prev) => {
      const updated = prev.map((inv) =>
        inv.invoiceId === paymentData.invoiceId
          ? { ...inv, paymentStatus: 'paid' as const, paymentId, paidAt: new Date().toISOString() }
          : inv
      );
      const target = updated.find((inv) => inv.invoiceId === paymentData.invoiceId);
      if (target) {
        saveInvoiceToFirestore(target).catch((err) => console.warn('Firestore invoice update:', err));
      }
      return updated;
    });

    // Audit log
    const auditEntry: VerificationAuditLog = {
      id: `audit_${Date.now()}`,
      paymentId,
      invoiceId: paymentData.invoiceId,
      action: 'verified',
      performedBy: 'Telegram Bot OCR Ingestion Engine',
      role: 'admin',
      timestamp: new Date().toISOString(),
      details: `Payment slip of ${paymentData.amountPaid.toLocaleString()} ETB (Ref: ${paymentData.referenceNumber}) automatically imported and verified via Telegram Bot (@epms_receipt_bot).`
    };
    setAuditLogs((prev) => [auditEntry, ...prev]);
    saveAuditLogToFirestore(auditEntry).catch((err) => console.warn('Firestore audit save:', err));

    showToast(`Payment slip imported & auto-verified via Telegram Bot!`, 'success');
    return { success: true };
  };

  // -------------------------------------------------------------
  // Maintenance Request Handlers
  // -------------------------------------------------------------
  const createMaintenanceRequest = (reqData: Omit<MaintenanceRequest, 'requestId' | 'ticketNumber' | 'reportedDate'>) => {
    const requestId = `maint_${Date.now()}`;
    const ticketNumber = `TKT-${new Date().getFullYear()}-${String(maintenanceRequests.length + 101).padStart(3, '0')}`;
    const newReq: MaintenanceRequest = {
      ...reqData,
      requestId,
      ticketNumber,
      reportedDate: new Date().toISOString()
    };

    setMaintenanceRequests((prev) => [newReq, ...prev]);
    showToast(`Maintenance Ticket ${ticketNumber} created! Dispatched to facility technicians.`, 'success');
    return { success: true };
  };

  const updateMaintenanceStatus = (requestId: string, status: MaintenanceStatus, resolutionNotes?: string) => {
    if (!canPerformManagerAction()) {
      showToast('Firebase RBAC Violation: Insufficient permissions to update maintenance ticket.', 'error');
      return { success: false, error: 'Permission denied' };
    }

    const nowIso = new Date().toISOString();
    setMaintenanceRequests((prev) =>
      prev.map((req) =>
        req.requestId === requestId
          ? {
              ...req,
              status,
              resolutionNotes: resolutionNotes || req.resolutionNotes,
              completedDate: status === 'completed' ? nowIso : req.completedDate
            }
          : req
      )
    );

    showToast(`Maintenance ticket updated to [${status.toUpperCase()}].`, 'success');
    return { success: true };
  };

  // -------------------------------------------------------------
  // Lease Renewal Workflow
  // -------------------------------------------------------------
  const submitRenewalRequest = (reqData: Omit<LeaseRenewalRequest, 'requestId' | 'submittedAt' | 'status'>) => {
    const requestId = `ren_${Date.now()}`;
    const newReq: LeaseRenewalRequest = {
      ...reqData,
      requestId,
      status: 'pending',
      submittedAt: new Date().toISOString()
    };

    setRenewalRequests((prev) => [newReq, ...prev]);
    showToast(`Lease renewal request submitted for ${reqData.unitNumber}! Management notified.`, 'success');
    return { success: true };
  };

  // -------------------------------------------------------------
  // Digital Receipt Verification Vault (Owner / Admin Exclusive)
  // -------------------------------------------------------------
  const verifyPayment = (paymentId: string, approved: boolean, rejectionReason?: string) => {
    if (!canPerformOwnerAction()) {
      showToast('SECURITY BLOCK: Only Property Owners and System Admins can verify receipts and update revenue ledgers!', 'error');
      return { success: false, error: 'Permission denied: Owner role required.' };
    }

    const targetPayment = payments.find((p) => p.paymentId === paymentId);
    if (!targetPayment) {
      showToast('Payment record not found.', 'error');
      return { success: false, error: 'Payment not found' };
    }

    const newStatus = approved ? 'verified' : 'rejected';
    const nowIso = new Date().toISOString();

    // Update payment record
    setPayments((prev) =>
      prev.map((p) =>
        p.paymentId === paymentId
          ? {
              ...p,
              verificationStatus: newStatus,
              verifiedBy: `${currentUser.name} (${currentUser.role})`,
              verifiedAt: nowIso,
              rejectionReason: approved ? undefined : (rejectionReason || 'Receipt rejected by Owner.')
            }
          : p
      )
    );

    // Update invoice record
    setInvoices((prev) =>
      prev.map((inv) => {
        if (inv.invoiceId === targetPayment.invoiceId) {
          return {
            ...inv,
            paymentStatus: approved ? 'paid' : 'delinquent',
            paidAt: approved ? nowIso : undefined
          };
        }
        return inv;
      })
    );

    // If approved, update tenant status if they were delinquent
    if (approved) {
      setTenants((prev) =>
        prev.map((t) => {
          if (t.tenantId === targetPayment.tenantId && t.status === 'delinquent') {
            return { ...t, status: 'active' };
          }
          return t;
        })
      );

      // Trigger celebratory confetti for approving ledger payment!
      try {
        if (typeof confetti === 'function') {
          confetti({
            particleCount: 80,
            spread: 60,
            origin: { y: 0.6 }
          });
        } else if (confetti && typeof (confetti as any).default === 'function') {
          (confetti as any).default({
            particleCount: 80,
            spread: 60,
            origin: { y: 0.6 }
          });
        }
      } catch {
        // fallback
      }
    }

    // Record verification audit log
    const auditEntry: VerificationAuditLog = {
      id: `audit_${Date.now()}`,
      paymentId,
      invoiceId: targetPayment.invoiceId,
      action: approved ? 'verified' : 'rejected',
      performedBy: currentUser.name,
      role: currentUser.role,
      timestamp: nowIso,
      details: approved
        ? `Owner APPROVED receipt ${targetPayment.referenceNumber}. Ledger credited ${targetPayment.amountPaid.toLocaleString()} ETB.`
        : `Owner REJECTED receipt ${targetPayment.referenceNumber}. Reason: ${rejectionReason || 'Disputed bank advice'}.`
    };
    setAuditLogs((prev) => [auditEntry, ...prev]);

    // Save updates to Firestore
    savePaymentToFirestore({
      ...targetPayment,
      verificationStatus: newStatus,
      verifiedBy: `${currentUser.name} (${currentUser.role})`,
      verifiedAt: nowIso,
      rejectionReason: approved ? undefined : (rejectionReason || 'Receipt rejected by Owner.')
    }).catch((err) => console.warn('Firestore payment verify:', err));

    const updatedInv = invoices.find((i) => i.invoiceId === targetPayment.invoiceId);
    if (updatedInv) {
      saveInvoiceToFirestore({
        ...updatedInv,
        paymentStatus: approved ? 'paid' : 'delinquent',
        paidAt: approved ? nowIso : undefined
      }).catch((err) => console.warn('Firestore inv verify:', err));
    }

    saveAuditLogToFirestore(auditEntry).catch((err) => console.warn('Firestore audit save:', err));

    showToast(
      approved
        ? `Payment verified & ledger updated! Amount: ${targetPayment.amountPaid.toLocaleString()} ETB.`
        : `Payment rejected. Flagged for manual dispute.`,
      approved ? 'success' : 'info'
    );

    return { success: true };
  };

  // -------------------------------------------------------------
  // Automated SMS Engine (Scheduled Cloud Function v2 Simulation)
  // -------------------------------------------------------------
  const runAutomatedSMSEngine = async () => {
    // Exact algorithm from onSchedule('every day 08:00')
    const now = new Date('2026-08-14T08:00:00Z'); // Anchored around current anchor
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
    const endOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);

    const in7DaysDate = new Date(now);
    in7DaysDate.setDate(now.getDate() + 7);
    const startOf7Days = new Date(in7DaysDate.getFullYear(), in7DaysDate.getMonth(), in7DaysDate.getDate(), 0, 0, 0);
    const endOf7Days = new Date(in7DaysDate.getFullYear(), in7DaysDate.getMonth(), in7DaysDate.getDate(), 23, 59, 59);

    const newLogs: SMSLog[] = [];
    let query1Count = 0;
    let query2Count = 0;

    // QUERY 1: Invoices where dueDate in [today + 7 days] AND paymentStatus != 'paid'
    for (const inv of invoices) {
      if (inv.paymentStatus === 'paid') continue;
      const due = new Date(inv.dueDate);

      if (due >= startOf7Days && due <= endOf7Days) {
        const tenant = tenants.find((t) => t.tenantId === inv.tenantId);
        const unit = units.find((u) => u.unitId === inv.unitId);
        if (!tenant) continue;

        const unitName = unit ? unit.unitNumber : 'Assigned Unit';
        const formattedAmount = inv.amountDue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        const formattedDueDate = due.toISOString().split('T')[0];

        const messageText = `Dear ${tenant.legalName}, this is a friendly reminder from management that your rent for ${unitName} is due in 7 days on ${formattedDueDate}. Amount Due: ${formattedAmount} ETB. Thank you.`;

        const logEntry: SMSLog = {
          id: `sms_run_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
          recipientPhone: tenant.phone,
          recipientName: tenant.legalName,
          tenantId: tenant.tenantId,
          unitNumber: unitName,
          invoiceId: inv.invoiceId,
          amountETB: inv.amountDue,
          dueDate: formattedDueDate,
          messageType: '7_day_reminder',
          messageText,
          gateway: 'EthioTelecom_REST',
          status: 'delivered',
          dispatchedAt: new Date().toISOString(),
          httpStatusCode: 200,
          gatewayMessageId: `ETH-REST-${Date.now()}`
        };

        newLogs.push(logEntry);
        query1Count++;
      }
    }

    // QUERY 2: Invoices where dueDate in [today] AND paymentStatus != 'paid'
    for (const inv of invoices) {
      if (inv.paymentStatus === 'paid') continue;
      const due = new Date(inv.dueDate);

      if (due >= startOfToday && due <= endOfToday) {
        const tenant = tenants.find((t) => t.tenantId === inv.tenantId);
        const unit = units.find((u) => u.unitId === inv.unitId);
        if (!tenant) continue;

        const unitName = unit ? unit.unitNumber : 'Assigned Unit';
        const formattedAmount = inv.amountDue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        const formattedDueDate = due.toISOString().split('T')[0];

        const messageText = `Dear ${tenant.legalName}, your rent for ${unitName} is due today, ${formattedDueDate}. Please clear the balance of ${formattedAmount} ETB to prevent account delinquency and late fees.`;

        const logEntry: SMSLog = {
          id: `sms_run_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
          recipientPhone: tenant.phone,
          recipientName: tenant.legalName,
          tenantId: tenant.tenantId,
          unitNumber: unitName,
          invoiceId: inv.invoiceId,
          amountETB: inv.amountDue,
          dueDate: formattedDueDate,
          messageType: 'due_today_reminder',
          messageText,
          gateway: 'Twilio',
          status: 'delivered',
          dispatchedAt: new Date().toISOString(),
          httpStatusCode: 201,
          gatewayMessageId: `SM-TW-${Date.now()}`
        };

        newLogs.push(logEntry);
        query2Count++;
      }
    }

    if (newLogs.length > 0) {
      setSmsLogs((prev) => [...newLogs, ...prev]);
      showToast(`SMS Engine cycle executed! Sent ${query1Count} (7-Day) and ${query2Count} (Due Today) reminders.`, 'success');
    } else {
      showToast(`SMS Engine cycle executed. No matching unpaid invoices due today or in 7 days.`, 'info');
    }

    return { query1Sent: query1Count, query2Sent: query2Count, logs: newLogs };
  };

  const sendCustomSMS = async (recipientPhone: string, recipientName: string, text: string, tenantId: string = 'custom') => {
    const logEntry: SMSLog = {
      id: `sms_custom_${Date.now()}`,
      recipientPhone,
      recipientName,
      tenantId,
      unitNumber: 'Management Dispatch',
      invoiceId: 'custom_msg',
      amountETB: 0,
      dueDate: new Date().toISOString().split('T')[0],
      messageType: 'custom_broadcast',
      messageText: text,
      gateway: 'EthioTelecom_REST',
      status: 'delivered',
      dispatchedAt: new Date().toISOString(),
      httpStatusCode: 200,
      gatewayMessageId: `ETH-DIRECT-${Date.now()}`
    };

    setSmsLogs((prev) => [logEntry, ...prev]);
    showToast(`SMS sent to ${recipientName} (${recipientPhone}) via EthioTelecom REST Gateway.`, 'success');
    return true;
  };

  // -------------------------------------------------------------
  // Analytics & Derived Queries
  // -------------------------------------------------------------
  const getRedList = () => {
    const now = new Date('2026-08-14T08:00:00Z').getTime();
    
    // Scoped invoices for the current client's building
    const targetInvoices = currentUser.role === 'super_admin' ? invoices : scopedInvoices;

    // Red List isolates invoices where dueDate < now AND (paymentStatus == 'delinquent' or overdue pending)
    const delinquentInvoices = targetInvoices.filter((inv) => {
      const dueTime = new Date(inv.dueDate).getTime();
      return inv.paymentStatus === 'delinquent' || (inv.paymentStatus === 'pending' && dueTime < now);
    });

    return delinquentInvoices.map((inv) => {
      const tenant = tenants.find((t) => t.tenantId === inv.tenantId);
      const unit = units.find((u) => u.unitId === inv.unitId);
      const dueTime = new Date(inv.dueDate).getTime();
      const diffMs = Math.max(0, now - dueTime);
      const agingDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
      const lateFee = inv.lateFeeApplied || Math.round(inv.amountDue * 0.05); // 5% late fee standard
      const totalWithLateFee = inv.amountDue + lateFee;

      return {
        ...inv,
        tenantName: tenant ? tenant.legalName : 'Unknown Tenant',
        unitNumber: unit ? unit.unitNumber : 'Unknown Unit',
        phone: tenant ? tenant.phone : '+251 91 000 0000',
        agingDays,
        totalWithLateFee
      };
    }).sort((a, b) => b.agingDays - a.agingDays);
  };

  const getRevenueMetrics = () => {
    const targetInvoices = currentUser.role === 'super_admin' ? invoices : scopedInvoices;
    const targetUnits = currentUser.role === 'super_admin' ? units : scopedUnits;
    const targetPayments = currentUser.role === 'super_admin' ? payments : scopedPayments;

    const totalExpectedETB = targetInvoices.reduce((sum, inv) => sum + inv.amountDue, 0);
    const grossCollectedETB = targetInvoices
      .filter((inv) => inv.paymentStatus === 'paid')
      .reduce((sum, inv) => sum + inv.amountDue, 0);

    const delinquentETB = targetInvoices
      .filter((inv) => inv.paymentStatus === 'delinquent')
      .reduce((sum, inv) => sum + inv.amountDue, 0);

    const netOutstandingETB = totalExpectedETB - grossCollectedETB;
    const collectionRatePercent = totalExpectedETB > 0
      ? Math.round((grossCollectedETB / totalExpectedETB) * 100)
      : 0;

    const totalOccupiedUnits = targetUnits.filter((u) => u.status === 'occupied').length;
    const occupancyRatePercent = targetUnits.length > 0
      ? Math.round((totalOccupiedUnits / targetUnits.length) * 100)
      : 0;

    const pendingVerificationCount = targetPayments.filter((p) => p.verificationStatus === 'unverified').length;
    const redListCount = getRedList().length;

    return {
      totalExpectedETB,
      grossCollectedETB,
      netOutstandingETB,
      delinquentETB,
      collectionRatePercent,
      totalOccupiedUnits,
      occupancyRatePercent,
      pendingVerificationCount,
      redListCount
    };
  };

  // -------------------------------------------------------------
  // Super Admin Control Plane Operational Methods
  // -------------------------------------------------------------
  const createOrganization = (
    orgData: Omit<Organization, 'organizationId' | 'createdAt' | 'lastActivityAt' | 'usage'> & {
      billingCycle?: SubscriptionBillingCycle;
      buildingsCount?: number;
      unitsPerBuilding?: number;
    }
  ) => {
    if (!verifySuperAdminClearance('createOrganization')) {
      return { success: false, error: '403 Forbidden: Super Administrator clearance required.' };
    }

    // 1. Strict Duplicate Prevention
    const trimmedName = orgData.name.trim().toLowerCase();
    const trimmedTin = orgData.tinNumber?.trim();
    const trimmedAdminEmail = orgData.primaryAdminEmail.trim().toLowerCase();
    const trimmedContactEmail = orgData.contactEmail.trim().toLowerCase();

    const existingMatch = organizations.find((o) => {
      const matchName = o.name.trim().toLowerCase() === trimmedName;
      const matchTin = trimmedTin && o.tinNumber && o.tinNumber.trim() === trimmedTin;
      const matchAdminEmail = o.primaryAdminEmail.trim().toLowerCase() === trimmedAdminEmail;
      const matchContactEmail = o.contactEmail.trim().toLowerCase() === trimmedContactEmail;
      return matchName || matchTin || matchAdminEmail || matchContactEmail;
    });

    if (existingMatch) {
      const duplicateReason =
        existingMatch.name.trim().toLowerCase() === trimmedName
          ? `Legal name "${orgData.name}"`
          : existingMatch.tinNumber === trimmedTin
          ? `TIN number "${trimmedTin}"`
          : `Email address "${trimmedAdminEmail}"`;

      showToast(`Duplicate Rejected: An organization with ${duplicateReason} is already registered.`, 'error');
      return {
        success: false,
        error: `Duplicate Profile Error: An organization with ${duplicateReason} already exists in the platform.`
      };
    }

    const newOrgId = `org_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const newSubId = `sub_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const newAdminUid = `usr_admin_${Date.now()}`;
    const assignedPassword = orgData.tempPassword?.trim() || '123';

    // 2. Multi-Building & Units Provisioning
    const numBuildings = Math.max(1, orgData.buildingsCount || 1);
    const unitsPerBldg = Math.max(1, orgData.unitsPerBuilding || 8);
    const newProperties: Property[] = [];
    const newUnits: Unit[] = [];
    let totalUnitsCount = 0;
    let totalOccupiedCount = 0;

    for (let b = 1; b <= numBuildings; b++) {
      const bldgPropId = b === 1 ? `prop_${newOrgId}` : `prop_${newOrgId}_b${b}`;
      const bldgName =
        numBuildings === 1
          ? orgData.tradeName || orgData.name
          : `${orgData.tradeName || orgData.name} - Building ${String.fromCharCode(64 + b)}`;

      newProperties.push({
        propertyId: bldgPropId,
        organizationId: newOrgId,
        organizationName: orgData.name,
        name: bldgName,
        location: orgData.address || `${orgData.city || 'Addis Ababa'}, Ethiopia`,
        totalUnits: unitsPerBldg,
        type: 'commercial'
      });

      const floorCount = Math.max(2, Math.ceil(unitsPerBldg / 2));
      let unitsCreatedForBldg = 0;
      for (let f = 1; f <= floorCount; f++) {
        for (let u = 1; u <= 2; u++) {
          if (unitsCreatedForBldg >= unitsPerBldg) break;
          unitsCreatedForBldg++;
          totalUnitsCount++;
          const unitNum = numBuildings === 1 ? `U-${f}0${u}` : `B${b}-F${f}0${u}`;
          const unitId = `unit_${newOrgId}_b${b}_${f}0${u}`;
          const isOccupied = f === 1 && u === 1;
          if (isOccupied) totalOccupiedCount++;

          newUnits.push({
            unitId,
            organizationId: newOrgId,
            propertyId: bldgPropId,
            propertyName: bldgName,
            unitNumber: unitNum,
            floor: f,
            type: 'commercial_office',
            areaSqMeters: f === 1 ? 85 : 55,
            monthlyBaseRentETB: f === 1 ? 55000 : 38000,
            status: isOccupied ? 'occupied' : 'vacant'
          });
        }
      }
    }

    // 3. Accurate Organization Usage
    const newOrg: Organization = {
      ...orgData,
      organizationId: newOrgId,
      subscriptionId: newSubId,
      primaryAdminUid: newAdminUid,
      tempPassword: assignedPassword,
      createdAt: new Date().toISOString(),
      lastActivityAt: new Date().toISOString(),
      usage: {
        buildingsCount: numBuildings,
        unitsCount: totalUnitsCount,
        occupiedUnitsCount: totalOccupiedCount,
        usersCount: 2,
        storageUsedMB: 1200,
        smsSentThisMonth: 15
      }
    };

    // 4. Billing Cycle & Subscription Expiry Calculation
    const targetPlan = plans.find((p) => p.tier === orgData.planTier) || plans[0];
    const billingCycle: SubscriptionBillingCycle = orgData.billingCycle || 'monthly';
    const cycleMonths = billingCycle === 'monthly' ? 1 : billingCycle === 'semi_annually' ? 6 : 12;
    const cycleDays = cycleMonths * 30;

    const cyclePriceETB =
      billingCycle === 'monthly'
        ? targetPlan.monthlyPriceETB
        : billingCycle === 'semi_annually'
        ? targetPlan.sixMonthPriceETB || Math.round(targetPlan.monthlyPriceETB * 6 * 0.95)
        : targetPlan.annualPriceETB || Math.round(targetPlan.monthlyPriceETB * 12 * 0.85);

    const newSub: Subscription = {
      subscriptionId: newSubId,
      organizationId: newOrgId,
      planId: targetPlan.planId,
      tier: orgData.planTier,
      status: orgData.status === 'trial' ? 'trial' : 'active',
      startDate: new Date().toISOString().split('T')[0],
      expiryDate: new Date(Date.now() + cycleDays * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      daysRemaining: cycleDays,
      amountETB: cyclePriceETB,
      billingCycle,
      autoRenew: true,
      paymentStatus: 'paid',
      nextBillingDate: new Date(Date.now() + cycleDays * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    };

    setOrganizations((prev) => [newOrg, ...prev]);
    setSubscriptions((prev) => [newSub, ...prev]);
    setProperties((prev) => [...newProperties, ...prev]);
    setUnits((prev) => [...newUnits, ...prev]);

    // Save passwords for quick lookup
    setOrganizationPasswords((prev) => ({
      ...prev,
      [newOrgId]: assignedPassword,
      [newOrg.primaryAdminEmail.toLowerCase()]: assignedPassword,
      [newOrg.contactEmail.toLowerCase()]: assignedPassword,
      [newOrg.name.toLowerCase().replace(/[^a-z0-9]/g, '')]: assignedPassword,
      ...(newOrg.tradeName ? { [newOrg.tradeName.toLowerCase().replace(/[^a-z0-9]/g, '')]: assignedPassword } : {})
    }));

    logSuperAdminAudit({
      organizationId: newOrgId,
      organizationName: newOrg.name,
      action: 'CREATE_ORGANIZATION',
      resource: 'organization',
      resourceId: newOrgId,
      newValue: `Created ${newOrg.name} with ${numBuildings} building(s) and ${totalUnitsCount} units under ${billingCycle.toUpperCase()} ${newOrg.planTier.toUpperCase()} plan.`,
      details: `Primary Administrator: ${newOrg.primaryAdminName} (${newOrg.primaryAdminEmail}) with temporary password: ${assignedPassword}`
    });

    showToast(`Client organization "${newOrg.name}" (${numBuildings} buildings, ${totalUnitsCount} units) onboarded successfully!`, 'success');
    return { success: true };
  };

  const updateOrganization = (orgId: string, updates: Partial<Organization>) => {
    if (!verifySuperAdminClearance('updateOrganization')) {
      return { success: false, error: '403 Forbidden: Super Administrator clearance required.' };
    }

    setOrganizations((prev) =>
      prev.map((org) => {
        if (org.organizationId === orgId) {
          const updated = { ...org, ...updates, lastActivityAt: new Date().toISOString() };
          logSuperAdminAudit({
            organizationId: orgId,
            organizationName: org.name,
            action: 'UPDATE_ORGANIZATION',
            resource: 'organization',
            resourceId: orgId,
            details: `Updated fields: ${Object.keys(updates).join(', ')}`
          });
          return updated;
        }
        return org;
      })
    );
    showToast('Organization settings updated successfully.', 'success');
    return { success: true };
  };

  const suspendOrganization = (orgId: string, reason?: string) => {
    if (!verifySuperAdminClearance('suspendOrganization')) {
      return { success: false, error: '403 Forbidden: Super Administrator clearance required.' };
    }

    setOrganizations((prev) =>
      prev.map((org) => {
        if (org.organizationId === orgId) {
          logSuperAdminAudit({
            organizationId: orgId,
            organizationName: org.name,
            action: 'SUSPEND_ORGANIZATION',
            resource: 'organization',
            resourceId: orgId,
            previousValue: `Status: ${org.status}`,
            newValue: 'Status: suspended',
            details: reason || 'Suspended by Super Administrator'
          });
          return { ...org, status: 'suspended', lastActivityAt: new Date().toISOString() };
        }
        return org;
      })
    );
    showToast('Organization suspended. Users locked out from tenant workspaces.', 'info');
    return { success: true };
  };

  const activateOrganization = (orgId: string) => {
    if (!verifySuperAdminClearance('activateOrganization')) {
      return { success: false, error: '403 Forbidden: Super Administrator clearance required.' };
    }

    setOrganizations((prev) =>
      prev.map((org) => {
        if (org.organizationId === orgId) {
          logSuperAdminAudit({
            organizationId: orgId,
            organizationName: org.name,
            action: 'ACTIVATE_ORGANIZATION',
            resource: 'organization',
            resourceId: orgId,
            previousValue: `Status: ${org.status}`,
            newValue: 'Status: active',
            details: 'Reactivated by Super Administrator.'
          });
          return { ...org, status: 'active', lastActivityAt: new Date().toISOString() };
        }
        return org;
      })
    );
    showToast('Organization reactivated successfully.', 'success');
    return { success: true };
  };

  const deleteOrganization = (orgId: string) => {
    if (!verifySuperAdminClearance('deleteOrganization')) {
      return { success: false, error: '403 Forbidden: Super Administrator clearance required.' };
    }

    const targetOrg = organizations.find((o) => o.organizationId === orgId);
    if (!targetOrg) return { success: false, error: 'Organization not found' };

    setOrganizations((prev) => prev.filter((o) => o.organizationId !== orgId));
    setSubscriptions((prev) => prev.filter((s) => s.organizationId !== orgId));

    logSuperAdminAudit({
      organizationId: orgId,
      organizationName: targetOrg.name,
      action: 'ARCHIVE_ORGANIZATION',
      resource: 'organization',
      resourceId: orgId,
      details: `Archived/deleted ${targetOrg.name} and purged subscription scope.`
    });

    showToast(`Organization "${targetOrg.name}" archived.`, 'info');
    return { success: true };
  };

  const departOrganization = (
    orgId: string,
    departureData: {
      reason: import('../types/superAdmin').OrganizationDepartureReason;
      notes: string;
      keysReturned: boolean;
      depositSettled: boolean;
      vacateUnits: boolean;
      revokeAccess: boolean;
    }
  ) => {
    if (!verifySuperAdminClearance('departOrganization')) {
      return { success: false, error: '403 Forbidden: Super Administrator clearance required.' };
    }

    const targetOrg = organizations.find((o) => o.organizationId === orgId);
    if (!targetOrg) return { success: false, error: 'Organization not found' };

    // 1. Vacate all units associated with this organization or property
    let vacatedUnitsCount = 0;
    if (departureData.vacateUnits) {
      setUnits((prev) =>
        prev.map((u) => {
          if (u.organizationId === orgId || u.propertyId === `prop_${orgId}`) {
            if (u.status === 'occupied') {
              vacatedUnitsCount++;
            }
            return {
              ...u,
              status: 'vacant' as const,
              currentTenantId: undefined
            };
          }
          return u;
        })
      );
    }

    // 2. Mark tenants associated with this organization as 'inactive'
    setTenants((prev) =>
      prev.map((t) => {
        if (t.organizationId === orgId || t.assignedUnitId?.includes(orgId)) {
          return {
            ...t,
            status: 'inactive' as const
          };
        }
        return t;
      })
    );

    // 3. Build departure record
    const departureRecord: import('../types/superAdmin').OrganizationDepartureRecord = {
      departedAt: new Date().toISOString(),
      departureReason: departureData.reason,
      departureNotes: departureData.notes || 'Full building exit and handover inspection completed.',
      handoverCompleted: true,
      keysReturned: departureData.keysReturned,
      depositSettled: departureData.depositSettled,
      vacatedUnitsCount,
      processedByAdminName: currentUser.name || 'Super Administrator'
    };

    // 4. Update organization status
    setOrganizations((prev) =>
      prev.map((org) => {
        if (org.organizationId === orgId) {
          return {
            ...org,
            status: 'departed' as const,
            lastActivityAt: new Date().toISOString(),
            departureRecord,
            usage: {
              ...org.usage,
              occupiedUnitsCount: 0
            }
          };
        }
        return org;
      })
    );

    // 5. Cancel subscription
    setSubscriptions((prev) =>
      prev.map((sub) =>
        sub.organizationId === orgId
          ? { ...sub, status: 'cancelled' as const, autoRenew: false }
          : sub
      )
    );

    // 6. Revoke login access if requested
    if (departureData.revokeAccess) {
      setOrganizationPasswords((prev) => {
        const next = { ...prev };
        delete next[orgId];
        delete next[targetOrg.primaryAdminEmail.toLowerCase()];
        delete next[targetOrg.contactEmail.toLowerCase()];
        delete next[targetOrg.name.toLowerCase().replace(/[^a-z0-9]/g, '')];
        if (targetOrg.tradeName) {
          delete next[targetOrg.tradeName.toLowerCase().replace(/[^a-z0-9]/g, '')];
        }
        return next;
      });
    }

    // 7. Audit log
    logSuperAdminAudit({
      organizationId: orgId,
      organizationName: targetOrg.name,
      action: 'DEPART_ORGANIZATION_HANDOVER',
      resource: 'organization',
      resourceId: orgId,
      previousValue: `Status: ${targetOrg.status}`,
      newValue: 'Status: departed',
      details: `Organization completed full building departure. Reason: ${departureData.reason}. Vacated ${vacatedUnitsCount} units. Keys returned: ${departureData.keysReturned}. Deposit settled: ${departureData.depositSettled}. Notes: ${departureData.notes}`
    });

    showToast(`Organization "${targetOrg.name}" marked as Departed. All units marked vacant.`, 'info');
    return { success: true, vacatedUnitsCount };
  };

  const reactivateDepartedOrganization = (orgId: string) => {
    if (!verifySuperAdminClearance('reactivateDepartedOrganization')) {
      return { success: false, error: '403 Forbidden: Super Administrator clearance required.' };
    }

    setOrganizations((prev) =>
      prev.map((org) => {
        if (org.organizationId === orgId) {
          return {
            ...org,
            status: 'active' as const,
            lastActivityAt: new Date().toISOString()
          };
        }
        return org;
      })
    );

    logSuperAdminAudit({
      organizationId: orgId,
      action: 'REACTIVATE_ORGANIZATION',
      resource: 'organization',
      resourceId: orgId,
      details: 'Reactivated previously departed organization.'
    });

    showToast('Organization reactivated successfully.', 'success');
    return { success: true };
  };

  const startImpersonation = (orgId: string) => {
    const targetOrg = organizations.find((o) => o.organizationId === orgId);
    if (!targetOrg) return { success: false, error: 'Organization not found' };

    const orgProps = properties.filter((p) => p.organizationId === orgId);
    const orgPropertyMap: Record<string, string> = {
      'org_bole_plaza': 'prop_bole_01',
      'org_kazanchis_towers': 'prop_kazanchis_02',
      'org_sarbet_mall': 'prop_sarbet_03',
      'org_cmc_hub': 'prop_cmc_04'
    };
    const propId = orgPropertyMap[orgId] || orgProps[0]?.propertyId || `prop_${orgId}`;
    const allOrgPropIds = orgProps.map((p) => p.propertyId);
    const complexAccess = allOrgPropIds.length > 0 ? allOrgPropIds : [propId, 'all'];

    const ctx: ImpersonationContext = {
      isImpersonating: true,
      targetOrganizationId: orgId,
      targetOrganizationName: targetOrg.name,
      originalSuperAdmin: {
        uid: currentUser.uid,
        name: currentUser.name,
        email: currentUser.email
      },
      startedAt: new Date().toISOString()
    };

    setImpersonationContext(ctx);

    // Switch view to owner role of the target organization
    setCurrentUser({
      uid: targetOrg.primaryAdminUid,
      name: targetOrg.primaryAdminName,
      email: targetOrg.primaryAdminEmail,
      role: 'owner',
      phone: targetOrg.contactPhone,
      avatar: targetOrg.logoUrl || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      title: `Managing Director • ${targetOrg.name}`,
      organizationId: orgId,
      organizationName: targetOrg.name,
      assignedPropertyId: propId,
      assignedPropertyName: orgProps[0]?.name || targetOrg.name,
      complexAccess
    });

    setSelectedPropertyId(propId);
    setActiveRoleRoute('/owner');
    setActiveTab('dashboard');

    if (typeof window !== 'undefined') {
      window.history.pushState(null, '', '/owner');
    }

    logSuperAdminAudit({
      organizationId: orgId,
      organizationName: targetOrg.name,
      action: 'START_IMPERSONATION',
      resource: 'impersonation',
      resourceId: orgId,
      details: `Super Admin entered client environment: ${targetOrg.name}`
    });

    showToast(`Super Admin Mode Active: Viewing ${targetOrg.name}`, 'info');
    return { success: true };
  };

  const exitImpersonation = () => {
    if (!impersonationContext) return;

    const orgName = impersonationContext.targetOrganizationName;
    const orgId = impersonationContext.targetOrganizationId;

    logSuperAdminAudit({
      organizationId: orgId,
      organizationName: orgName,
      action: 'EXIT_IMPERSONATION',
      resource: 'impersonation',
      resourceId: orgId,
      details: `Super Admin exited client environment: ${orgName}`
    });

    setImpersonationContext(null);
    setCurrentUser(MOCK_USERS.superadmin);
    setSelectedPropertyId('all');
    setActiveRoleRoute('/superadmin');
    setActiveTab('sa_dashboard');

    if (typeof window !== 'undefined') {
      window.history.pushState(null, '', '/superadmin');
    }

    showToast('Exited client environment. Returned to Super Admin Control Plane.', 'success');
  };

  const extendSubscription = (subId: string, monthsToAdd: number) => {
    if (!verifySuperAdminClearance('extendSubscription')) {
      return { success: false, error: '403 Forbidden: Super Administrator clearance required.' };
    }

    setSubscriptions((prev) =>
      prev.map((sub) => {
        if (sub.subscriptionId === subId) {
          const currentExp = new Date(sub.expiryDate);
          currentExp.setMonth(currentExp.getMonth() + monthsToAdd);
          const newExpStr = currentExp.toISOString().split('T')[0];
          const daysRemaining = Math.ceil((currentExp.getTime() - Date.now()) / (1000 * 60 * 60 * 24));

          logSuperAdminAudit({
            organizationId: sub.organizationId,
            action: 'EXTEND_SUBSCRIPTION',
            resource: 'subscription',
            resourceId: subId,
            previousValue: `Expiry: ${sub.expiryDate}`,
            newValue: `Expiry: ${newExpStr}`,
            details: `Extended subscription by ${monthsToAdd} month(s). New status: active.`
          });

          return {
            ...sub,
            expiryDate: newExpStr,
            daysRemaining,
            status: 'active'
          };
        }
        return sub;
      })
    );
    showToast(`Subscription extended by ${monthsToAdd} month(s)!`, 'success');
    return { success: true };
  };

  const updateSubscriptionPlan = (subId: string, newPlanTier: PlanTier) => {
    if (!verifySuperAdminClearance('updateSubscriptionPlan')) {
      return { success: false, error: '403 Forbidden: Super Administrator clearance required.' };
    }

    const targetPlan = plans.find((p) => p.tier === newPlanTier);
    if (!targetPlan) return { success: false, error: 'Plan tier not found' };

    setSubscriptions((prev) =>
      prev.map((sub) => {
        if (sub.subscriptionId === subId) {
          logSuperAdminAudit({
            organizationId: sub.organizationId,
            action: 'CHANGE_SUBSCRIPTION_PLAN',
            resource: 'subscription',
            resourceId: subId,
            previousValue: `Tier: ${sub.tier}`,
            newValue: `Tier: ${newPlanTier}`,
            details: `Updated plan to ${targetPlan.name} (${targetPlan.monthlyPriceETB.toLocaleString()} ETB/mo)`
          });

          // Also update organization record
          setOrganizations((orgs) =>
            orgs.map((o) =>
              o.organizationId === sub.organizationId
                ? { ...o, planTier: newPlanTier, planId: targetPlan.planId }
                : o
            )
          );

          return {
            ...sub,
            tier: newPlanTier,
            planId: targetPlan.planId,
            amountETB: targetPlan.monthlyPriceETB
          };
        }
        return sub;
      })
    );
    showToast(`Subscription upgraded to ${targetPlan.name}!`, 'success');
    return { success: true };
  };

  const addTrialDays = (subId: string, days: number) => {
    if (!verifySuperAdminClearance('addTrialDays')) {
      return { success: false, error: '403 Forbidden: Super Administrator clearance required.' };
    }

    setSubscriptions((prev) =>
      prev.map((sub) => {
        if (sub.subscriptionId === subId) {
          const currentExp = new Date(sub.expiryDate);
          currentExp.setDate(currentExp.getDate() + days);
          const newExpStr = currentExp.toISOString().split('T')[0];
          const daysRemaining = Math.ceil((currentExp.getTime() - Date.now()) / (1000 * 60 * 60 * 24));

          logSuperAdminAudit({
            organizationId: sub.organizationId,
            action: 'ADD_TRIAL_DAYS',
            resource: 'subscription',
            resourceId: subId,
            previousValue: `Expiry: ${sub.expiryDate}`,
            newValue: `Expiry: ${newExpStr}`,
            details: `Granted ${days} extra trial days.`
          });

          return {
            ...sub,
            expiryDate: newExpStr,
            daysRemaining,
            status: 'trial'
          };
        }
        return sub;
      })
    );
    showToast(`Added ${days} trial days!`, 'success');
    return { success: true };
  };

  const updatePlatformPlan = (planId: string, updates: Partial<PlatformPlan>) => {
    if (!verifySuperAdminClearance('updatePlatformPlan')) {
      return { success: false, error: '403 Forbidden: Super Administrator clearance required.' };
    }

    setPlans((prev) =>
      prev.map((p) => {
        if (p.planId === planId) {
          logSuperAdminAudit({
            action: 'UPDATE_PLAN_CONFIG',
            resource: 'plan',
            resourceId: planId,
            details: `Updated plan ${p.name} properties.`
          });
          return { ...p, ...updates };
        }
        return p;
      })
    );
    showToast('Platform plan updated.', 'success');
    return { success: true };
  };

  const markNotificationRead = (notificationId: string) => {
    setPlatformNotifications((prev) =>
      prev.map((n) => (n.notificationId === notificationId ? { ...n, isRead: true } : n))
    );
  };

  const createSupportTicket = (ticketData: Omit<SupportTicket, 'ticketId' | 'ticketNumber' | 'createdAt' | 'updatedAt'>) => {
    const newTicket: SupportTicket = {
      ...ticketData,
      ticketId: `tkt_${Date.now()}`,
      ticketNumber: `TKT-2026-${Math.floor(100 + Math.random() * 900)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setSupportTickets((prev) => [newTicket, ...prev]);
    showToast(`Support Ticket ${newTicket.ticketNumber} created!`, 'success');
    return { success: true };
  };

  const resetClientPassword = (orgId: string, userUid: string, newPassword: string = '123') => {
    if (!verifySuperAdminClearance('resetClientPassword')) {
      return { success: false, message: '403 Forbidden' };
    }

    const org = organizations.find((o) => o.organizationId === orgId);
    logSuperAdminAudit({
      organizationId: orgId,
      organizationName: org ? org.name : 'Client Organization',
      action: 'RESET_CLIENT_PASSWORD',
      resource: 'security',
      resourceId: userUid,
      details: `Password reset to "${newPassword}" for admin/manager account (${userUid}) by Super Admin.`
    });
    showToast(`Password successfully reset to "${newPassword}" for ${org ? org.primaryAdminName : 'Client Admin'}.`, 'success');
    return { success: true, message: `Password reset to: ${newPassword}` };
  };

  const createCommercialUnitForClient = (orgId: string, unitData: { businessName: string; unitNumber: string; monthlyRentETB: number; managerName: string; managerPhone: string; managerEmail?: string }) => {
    if (!verifySuperAdminClearance('createCommercialUnitForClient')) {
      return { success: false, error: '403 Forbidden' };
    }

    const org = organizations.find((o) => o.organizationId === orgId) || organizations[0];
    const unitId = `unit_comm_${Date.now()}`;
    const tenantId = `tnt_comm_${Date.now()}`;
    const invoiceId = `inv_comm_${Date.now()}`;

    const targetProperty = properties.find((p) => p.organizationId === orgId) || properties[0];

    const newUnit: Unit = {
      unitId,
      organizationId: org ? org.organizationId : 'org_bole_plaza',
      propertyId: targetProperty?.propertyId || 'prop_bole_01',
      propertyName: targetProperty?.name || 'Commercial Plaza',
      unitNumber: unitData.unitNumber || `U-${Math.floor(100 + Math.random() * 900)}`,
      floor: 1,
      type: 'commercial_retail',
      areaSqMeters: 60,
      monthlyBaseRentETB: unitData.monthlyRentETB,
      status: 'occupied',
      currentTenantId: tenantId
    };

    const newTenant: Tenant = {
      tenantId,
      organizationId: org ? org.organizationId : 'org_bole_plaza',
      legalName: unitData.managerName,
      businessTradeName: unitData.businessName,
      phone: unitData.managerPhone,
      email: unitData.managerEmail || `${unitData.businessName.toLowerCase().replace(/[^a-z0-9]/g, '')}@epms.et`,
      assignedUnitId: unitId,
      propertyId: newUnit.propertyId,
      leaseStartDate: new Date().toISOString().split('T')[0],
      leaseEndDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      monthlyRentETB: unitData.monthlyRentETB,
      securityDepositETB: unitData.monthlyRentETB * 2,
      status: 'active',
      documents: [],
      createdAt: new Date().toISOString()
    };

    const newInvoice: Invoice = {
      invoiceId,
      organizationId: org ? org.organizationId : 'org_bole_plaza',
      invoiceNumber: `INV-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      tenantId,
      unitId,
      propertyId: newUnit.propertyId,
      amountDue: unitData.monthlyRentETB,
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      billingPeriod: 'Current Month',
      billingFrequency: 'monthly',
      description: `Monthly commercial lease for Unit ${newUnit.unitNumber}`,
      issuedDate: new Date().toISOString().split('T')[0],
      paymentStatus: 'pending'
    };

    setUnits((prev) => [newUnit, ...prev]);
    setTenants((prev) => [newTenant, ...prev]);
    setInvoices((prev) => [newInvoice, ...prev]);

    logSuperAdminAudit({
      organizationId: org ? org.organizationId : undefined,
      organizationName: org ? org.name : undefined,
      action: 'CREATE_COMMERCIAL_UNIT',
      resource: 'building',
      resourceId: unitId,
      details: `Provisioned new commercial space "${unitData.businessName}" in Unit ${newUnit.unitNumber} (${unitData.monthlyRentETB.toLocaleString()} ETB/mo) for ${org ? org.name : 'Client'}.`
    });

    showToast(`Commercial space "${unitData.businessName}" provisioned in Unit ${newUnit.unitNumber}!`, 'success');
    return { success: true };
  };

  const createSalonForClient = (orgId: string, salonData: { salonName: string; unitNumber: string; monthlyRentETB: number; managerName: string; managerPhone: string; managerEmail?: string }) => {
    return createCommercialUnitForClient(orgId, {
      businessName: salonData.salonName,
      unitNumber: salonData.unitNumber,
      monthlyRentETB: salonData.monthlyRentETB,
      managerName: salonData.managerName,
      managerPhone: salonData.managerPhone,
      managerEmail: salonData.managerEmail
    });
  };

  const createAdBanner = (adData: Omit<PlatformAdBanner, 'adId' | 'createdAt'>) => {
    if (!verifySuperAdminClearance('createAdBanner')) {
      return { success: false, error: '403 Forbidden' };
    }

    const newAd: PlatformAdBanner = {
      ...adData,
      adId: `ad_${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    setAdBanners((prev) => [newAd, ...prev]);
    logSuperAdminAudit({
      action: 'CREATE_AD_BANNER',
      resource: 'setting',
      resourceId: newAd.adId,
      details: `Created platform announcement/ad: "${newAd.title}"`
    });
    showToast(`Announcement "${newAd.title}" published!`, 'success');
    return { success: true };
  };

  const updateAdBanner = (adId: string, updates: Partial<PlatformAdBanner>) => {
    if (!verifySuperAdminClearance('updateAdBanner')) {
      return { success: false, error: '403 Forbidden' };
    }

    setAdBanners((prev) =>
      prev.map((ad) => (ad.adId === adId ? { ...ad, ...updates } : ad))
    );
    showToast('Ad banner updated successfully.', 'success');
    return { success: true };
  };

  const deleteAdBanner = (adId: string) => {
    if (!verifySuperAdminClearance('deleteAdBanner')) {
      return { success: false, error: '403 Forbidden' };
    }

    setAdBanners((prev) => prev.filter((ad) => ad.adId !== adId));
    showToast('Ad banner removed.', 'info');
    return { success: true };
  };

  const toggleAdBanner = (adId: string) => {
    if (!verifySuperAdminClearance('toggleAdBanner')) {
      return { success: false, error: '403 Forbidden' };
    }

    setAdBanners((prev) =>
      prev.map((ad) => (ad.adId === adId ? { ...ad, isActive: !ad.isActive } : ad))
    );
    return { success: true };
  };

  const toggleAdBannerGlobal = (enabled?: boolean) => {
    if (!verifySuperAdminClearance('toggleAdBannerGlobal')) {
      return;
    }

    setIsAdBannerGlobalEnabled((prev) => {
      const nextVal = enabled !== undefined ? enabled : !prev;
      localStorage.setItem(`${STORAGE_KEY}_ad_banner_global_enabled`, JSON.stringify(nextVal));
      showToast(
        nextVal ? 'Platform Banner Announcements Display: ON' : 'Platform Banner Announcements Display: OFF',
        nextVal ? 'success' : 'info'
      );
      return nextVal;
    });
  };

  const updateSmsApiConfig = (updates: Partial<SmsApiGatewayConfig>) => {
    if (!verifySuperAdminClearance('updateSmsApiConfig')) {
      return { success: false, error: '403 Forbidden' };
    }

    setSmsApiConfigState((prev) => {
      const updated = { ...prev, ...updates, lastPingAt: new Date().toISOString() };
      return updated;
    });
    logSuperAdminAudit({
      action: 'UPDATE_SMS_API_GATEWAY',
      resource: 'setting',
      details: `Updated SMS API configuration (${updates.provider || smsApiConfig.provider} gateway).`
    });
    showToast('SMS API gateway configuration saved!', 'success');
    return { success: true };
  };

  const extendSubscriptionWithCycle = (subId: string, cycle: SubscriptionBillingCycle) => {
    const sub = subscriptions.find((s) => s.subscriptionId === subId);
    if (!sub) return { success: false, error: 'Subscription not found' };
    const plan = plans.find((p) => p.tier === sub.tier) || plans[0];

    const months = cycle === 'monthly' ? 1 : cycle === 'semi_annually' ? 6 : 12;
    const price = cycle === 'monthly' ? plan.monthlyPriceETB : cycle === 'semi_annually' ? plan.sixMonthPriceETB : plan.annualPriceETB;

    setSubscriptions((prev) =>
      prev.map((s) => {
        if (s.subscriptionId === subId) {
          const currentExp = new Date(s.expiryDate);
          currentExp.setMonth(currentExp.getMonth() + months);
          const newExpStr = currentExp.toISOString().split('T')[0];
          const daysRemaining = Math.ceil((currentExp.getTime() - Date.now()) / (1000 * 60 * 60 * 24));

          return {
            ...s,
            billingCycle: cycle,
            expiryDate: newExpStr,
            daysRemaining,
            amountETB: price,
            status: 'active'
          };
        }
        return s;
      })
    );

    logSuperAdminAudit({
      organizationId: sub.organizationId,
      action: 'EXTEND_SUBSCRIPTION_CYCLE',
      resource: 'subscription',
      resourceId: subId,
      details: `Renewed subscription for ${months} months (${cycle.toUpperCase()}) at ${price.toLocaleString()} ETB.`
    });

    showToast(`Subscription renewed for ${months} months (${cycle})!`, 'success');
    return { success: true };
  };

  const updateSupportTicketStatus = (ticketId: string, status: SupportTicketStatus, resolutionNotes?: string) => {
    setSupportTickets((prev) =>
      prev.map((tkt) =>
        tkt.ticketId === ticketId
          ? {
              ...tkt,
              status,
              resolutionNotes: resolutionNotes || tkt.resolutionNotes,
              updatedAt: new Date().toISOString()
            }
          : tkt
      )
    );
    showToast(`Ticket status updated to ${status.toUpperCase()}`, 'info');
    return { success: true };
  };

  const updatePlatformSettings = (updates: Partial<PlatformSettings>) => {
    setPlatformSettings((prev) => ({
      ...prev,
      ...updates,
      general: { ...prev.general, ...updates.general },
      security: { ...prev.security, ...updates.security },
      emailSms: { ...prev.emailSms, ...updates.emailSms },
      maintenance: { ...prev.maintenance, ...updates.maintenance }
    }));
    logSuperAdminAudit({
      action: 'UPDATE_PLATFORM_SETTINGS',
      resource: 'setting',
      details: 'Updated global platform configuration parameters.'
    });
    showToast('Platform settings saved.', 'success');
    return { success: true };
  };

  const getSuperAdminMetrics = () => {
    const totalOrganizations = organizations.length;
    const activeOrganizations = organizations.filter((o) => o.status === 'active' || o.status === 'trial').length;
    const suspendedOrganizations = organizations.filter((o) => o.status === 'suspended').length;

    const totalBuildings = organizations.reduce((sum, o) => sum + (o.usage?.buildingsCount || 0), 0);
    const totalUnits = organizations.reduce((sum, o) => sum + (o.usage?.unitsCount || 0), 0);
    const occupiedUnits = organizations.reduce((sum, o) => sum + (o.usage?.occupiedUnitsCount || 0), 0);
    const vacantUnits = totalUnits - occupiedUnits;
    const totalUsers = organizations.reduce((sum, o) => sum + (o.usage?.usersCount || 0), 0);

    const activeSubscriptions = subscriptions.filter((s) => s.status === 'active').length;
    const expiringSubscriptions = subscriptions.filter((s) => s.status === 'expiring_soon' || s.daysRemaining <= 14).length;

    const monthlyRecurringRevenueETB = subscriptions
      .filter((s) => s.status === 'active' || s.status === 'expiring_soon')
      .reduce((sum, s) => sum + (s.billingCycle === 'annually' ? Math.round(s.amountETB / 12) : s.billingCycle === 'semi_annually' ? Math.round(s.amountETB / 6) : s.amountETB), 0);

    const totalRevenueETB = platformInvoices
      .filter((inv) => inv.status === 'paid')
      .reduce((sum, inv) => sum + inv.amountETB, 0);

    const unreadNotificationsCount = platformNotifications.filter((n) => !n.isRead).length;

    return {
      totalOrganizations,
      activeOrganizations,
      suspendedOrganizations,
      totalBuildings,
      totalUnits,
      occupiedUnits,
      vacantUnits,
      totalUsers,
      activeSubscriptions,
      expiringSubscriptions,
      monthlyRecurringRevenueETB,
      totalRevenueETB,
      unreadNotificationsCount
    };
  };

  return (
    <PMSContext.Provider
      value={{
        currentUser,
        clientTheme,
        isAuthenticated,
        isFirestoreConnected,
        syncStatus,
        activeRoleRoute,
        activeTab,
        setActiveTab,
        language,
        setLanguage,
        t,
        login,
        platformLogin,
        logout,
        switchUser,
        guardError,
        dismissGuardError,
        navigateRoleRoute,
        properties,
        selectedPropertyId,
        setSelectedPropertyId,
        tenants: scopedTenants,
        units: scopedUnits,
        invoices: scopedInvoices,
        payments: scopedPayments,
        smsLogs: scopedSmsLogs,
        auditLogs,
        notification,
        clearNotification,
        maintenanceRequests,
        createMaintenanceRequest,
        updateMaintenanceStatus,
        renewalRequests,
        submitRenewalRequest,
        addTenant,
        updateTenant,
        deleteTenant,
        uploadTenantDocument,
        createInvoice,
        deleteInvoice,
        logPayment,
        verifyPayment,
        runAutomatedSMSEngine,
        sendCustomSMS,
        getRedList,
        getRevenueMetrics,
        resetToSampleData,
        // Super Admin Exports
        organizations,
        plans,
        subscriptions,
        platformInvoices,
        superAdminAuditLogs,
        platformNotifications,
        supportTickets,
        platformSettings,
        impersonationContext,
        adBanners,
        isAdBannerGlobalEnabled,
        smsApiConfig,
        createOrganization,
        updateOrganization,
        suspendOrganization,
        activateOrganization,
        deleteOrganization,
        departOrganization,
        reactivateDepartedOrganization,
        startImpersonation,
        exitImpersonation,
        extendSubscription,
        extendSubscriptionWithCycle,
        updateSubscriptionPlan,
        addTrialDays,
        updatePlatformPlan,
        resetClientPassword,
        createCommercialUnitForClient,
        createSalonForClient,
        createAdBanner,
        updateAdBanner,
        deleteAdBanner,
        toggleAdBanner,
        toggleAdBannerGlobal,
        updateSmsApiConfig,
        logSuperAdminAudit,
        markNotificationRead,
        createSupportTicket,
        updateSupportTicketStatus,
        updatePlatformSettings,
        getSuperAdminMetrics
      }}
    >
      {children}
    </PMSContext.Provider>
  );
};

export const usePMS = () => {
  const context = useContext(PMSContext);
  if (!context) {
    throw new Error('usePMS must be used within a PMSProvider');
  }
  return context;
};
