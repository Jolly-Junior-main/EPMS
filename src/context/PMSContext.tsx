import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
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
  LeaseRenewalRequest
} from '../types/pms';
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
  generateBankReceiptSvg
} from '../data/mockData';
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
  isAuthenticated: boolean;
  isFirestoreConnected: boolean;
  syncStatus: 'synced' | 'syncing' | 'offline';
  activeRoleRoute: string; // '/admin' | '/owner' | '/manager'
  activeTab: string;
  setActiveTab: (tab: string) => void;
  login: (usernameOrEmail: string, password: string) => Promise<{ success: boolean; error?: string; role?: UserRole }>;
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
  
  resetToSampleData: () => Promise<void>;
}

const PMSContext = createContext<PMSContextType | undefined>(undefined);

const STORAGE_KEY = 'enterprise_pms_data_v1';

export const PMSProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_auth_state`);
    return saved !== null ? JSON.parse(saved) : true;
  });
  const [currentUser, setCurrentUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_user_profile`);
    return saved ? JSON.parse(saved) : MOCK_USERS.owner;
  });
  const [activeRoleRoute, setActiveRoleRoute] = useState<string>(() => {
    return currentUser.role === 'admin' ? '/admin' : currentUser.role === 'manager' ? '/manager' : '/owner';
  });
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [guardError, setGuardError] = useState<{ attemptedRoute: string; requiredRole: string; currentRole: string; message: string } | null>(null);
  const [selectedPropertyId, setSelectedPropertyId] = useState<string>('all');
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  // Firestore Real-Time Connectivity State
  const [isFirestoreConnected, setIsFirestoreConnected] = useState<boolean>(false);
  const [syncStatus, setSyncStatus] = useState<'synced' | 'syncing' | 'offline'>('syncing');

  // Core Data Collections
  const [properties] = useState<Property[]>(MOCK_PROPERTIES);
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

    const unsubscribe = subscribeToPMSCollections({
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
    // Artificial latency for authentic iOS / Firebase feel
    await new Promise((resolve) => setTimeout(resolve, 500));

    const inputUser = usernameOrEmail.trim().toLowerCase();
    const inputPass = password.trim();
    
    // Find matching user and validate credentials
    let matchedUser: UserProfile | undefined;
    let matchedRole: UserRole | undefined;

    if (inputUser === 'owner' || inputUser === 'abebe.mengesha@boleplaza.et' || inputUser.includes('owner')) {
      if (inputPass.toLowerCase() === 'owner' || inputPass === 'Owner' || inputPass === 'OwnerPass2026!') {
        matchedUser = MOCK_USERS.owner;
        matchedRole = 'owner';
      } else {
        return { success: false, error: 'Incorrect password for Owner account. (Password: Owner)' };
      }
    } else if (inputUser === 'admin' || inputUser === 'dawit.alemu@sysadmin.et' || inputUser.includes('admin') || inputUser.includes('administrator')) {
      if (inputPass.toLowerCase() === 'admin' || inputPass === 'Admin' || inputPass === 'AdminPass2026!') {
        matchedUser = MOCK_USERS.admin;
        matchedRole = 'admin';
      } else {
        return { success: false, error: 'Incorrect password for Administrator account. (Password: Admin)' };
      }
    } else if (inputUser === 'manage' || inputUser === 'manager' || inputUser === 'management' || inputUser === 'hanna.tadesse@boleplaza.et' || inputUser.includes('manage')) {
      if (inputPass.toLowerCase() === 'manage' || inputPass.toLowerCase() === 'manager' || inputPass === 'Manage' || inputPass === 'ManagerPass2026!') {
        matchedUser = MOCK_USERS.manager;
        matchedRole = 'manager';
      } else {
        return { success: false, error: 'Incorrect password for Management account. (Password: Manage)' };
      }
    } else if (inputUser === 'tenant' || inputUser === 'almaz.kebede@bolecafe.et' || inputUser.includes('tenant') || inputUser.includes('cafe')) {
      if (inputPass.toLowerCase() === 'tenant' || inputPass === 'Tenant' || inputPass === 'TenantPass2026!') {
        matchedUser = MOCK_USERS.tenant;
        matchedRole = 'tenant';
      } else {
        return { success: false, error: 'Incorrect password for Tenant account. (Password: Tenant)' };
      }
    } else {
      // Check exact match in MOCK_USERS values
      const found = Object.values(MOCK_USERS).find((u) => u.email.toLowerCase() === inputUser);
      if (found) {
        matchedUser = found;
        matchedRole = found.role;
      }
    }

    if (!matchedUser || !matchedRole) {
      return { success: false, error: 'User record not found in Firestore. Please use credentials: Owner/Owner, Admin/Admin, Manage/Manage, or Tenant/Tenant.' };
    }

    // Authenticate and set session
    setCurrentUser(matchedUser);
    setIsAuthenticated(true);
    setGuardError(null);

    // Strict Post-Login Redirection Logic:
    // - Super Admin (/admin): System Monitoring, API Logs, Configuration Dashboard
    // - Building Owner (/owner): Revenue Analytics, Delinquent Red List, Receipt Verification Vault
    // - Property Manager (/manager): Tenant Directory, Document Vault, Rent Schedules, Payment Logging
    // - Tenant Portal (/portal): Lease Overview, Self-Service Slip Upload, Maintenance, Receipts
    if (matchedRole === 'admin') {
      setActiveRoleRoute('/admin');
      setActiveTab('admin_monitoring');
    } else if (matchedRole === 'owner') {
      setActiveRoleRoute('/owner');
      setActiveTab('dashboard');
    } else if (matchedRole === 'manager') {
      setActiveRoleRoute('/manager');
      setActiveTab('tenants');
    } else {
      setActiveRoleRoute('/portal');
      setActiveTab('tenant_portal');
    }

    showToast(`Welcome, ${matchedUser.name}! Authenticated as [${matchedRole.toUpperCase()}]. Redirecting to ${matchedRole === 'admin' ? '/admin' : matchedRole === 'owner' ? '/owner' : matchedRole === 'manager' ? '/manager' : '/portal'}`, 'success');
    return { success: true, role: matchedRole };
  };

  const logout = () => {
    setIsAuthenticated(false);
    showToast('Signed out of Enterprise PMS session.', 'info');
  };

  // Switch User directly
  const switchUser = (role: UserRole) => {
    const targetUser = MOCK_USERS[role];
    if (targetUser) {
      setCurrentUser(targetUser);
      setGuardError(null);
      if (role === 'admin') {
        setActiveRoleRoute('/admin');
        setActiveTab('admin_monitoring');
      } else if (role === 'owner') {
        setActiveRoleRoute('/owner');
        setActiveTab('dashboard');
      } else if (role === 'manager') {
        setActiveRoleRoute('/manager');
        setActiveTab('tenants');
      } else {
        setActiveRoleRoute('/portal');
        setActiveTab('tenant_portal');
      }
      showToast(`Switched active profile to ${targetUser.name} [Role: ${role.toUpperCase()}]`, 'info');
    }
  };

  // Route Guard / Middleware check
  const navigateRoleRoute = (targetRoute: string): boolean => {
    // Super Admin has universal access
    if (currentUser.role === 'admin') {
      setActiveRoleRoute(targetRoute);
      setGuardError(null);
      return true;
    }

    // Owner restricted from /admin
    if (currentUser.role === 'owner') {
      if (targetRoute.startsWith('/admin')) {
        setGuardError({
          attemptedRoute: targetRoute,
          requiredRole: 'Super Admin',
          currentRole: 'Building Owner',
          message: 'Access Denied: The route /admin contains low-level cloud infrastructure and is strictly restricted to Super Administrators.'
        });
        showToast('Route Guard: Super Admin role required for /admin', 'error');
        return false;
      }
      setActiveRoleRoute(targetRoute);
      setGuardError(null);
      return true;
    }

    // Manager restricted from /admin and /owner verification
    if (currentUser.role === 'manager') {
      if (targetRoute.startsWith('/admin')) {
        setGuardError({
          attemptedRoute: targetRoute,
          requiredRole: 'Super Admin',
          currentRole: 'Property Manager',
          message: 'Access Denied: Property Managers cannot access the /admin cloud system console.'
        });
        showToast('Route Guard: Super Admin role required for /admin', 'error');
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
    return ['manager', 'owner', 'admin'].includes(currentUser.role);
  };

  const canPerformOwnerAction = () => {
    return ['owner', 'admin'].includes(currentUser.role);
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
      verificationStatus: 'unverified',
      submittedBy: `${currentUser.name} (${currentUser.role})`
    };

    setPayments((prev) => [newPayment, ...prev]);
    savePaymentToFirestore(newPayment).catch((err) => console.warn('Firestore payment save:', err));

    // Update the invoice status to submitted_for_verification
    setInvoices((prev) => {
      const updated = prev.map((inv) => (inv.invoiceId === paymentData.invoiceId ? { ...inv, paymentStatus: 'submitted_for_verification' as const, paymentId } : inv));
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
      action: 'submitted',
      performedBy: currentUser.name,
      role: currentUser.role,
      timestamp: new Date().toISOString(),
      details: `${currentUser.role === 'tenant' ? 'Tenant' : 'Manager'} submitted payment slip of ${paymentData.amountPaid.toLocaleString()} ETB (Ref: ${paymentData.referenceNumber}) for Owner verification.`
    };
    setAuditLogs((prev) => [auditEntry, ...prev]);
    saveAuditLogToFirestore(auditEntry).catch((err) => console.warn('Firestore audit save:', err));

    showToast(`Payment slip submitted! Queued for Owner Receipt Verification Vault.`, 'success');
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
        confetti({
          particleCount: 80,
          spread: 60,
          origin: { y: 0.6 }
        });
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

    // Red List isolates invoices where dueDate < now AND paymentStatus == 'delinquent'
    const delinquentInvoices = invoices.filter((inv) => {
      const dueTime = new Date(inv.dueDate).getTime();
      return (inv.paymentStatus === 'delinquent' || (inv.paymentStatus === 'pending' && dueTime < now)) &&
        (selectedPropertyId === 'all' || inv.propertyId === selectedPropertyId);
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
    const filteredInvoices = selectedPropertyId === 'all'
      ? invoices
      : invoices.filter((inv) => inv.propertyId === selectedPropertyId);

    const filteredUnits = selectedPropertyId === 'all'
      ? units
      : units.filter((u) => u.propertyId === selectedPropertyId);

    const totalExpectedETB = filteredInvoices.reduce((sum, inv) => sum + inv.amountDue, 0);
    const grossCollectedETB = filteredInvoices
      .filter((inv) => inv.paymentStatus === 'paid')
      .reduce((sum, inv) => sum + inv.amountDue, 0);

    const delinquentETB = filteredInvoices
      .filter((inv) => inv.paymentStatus === 'delinquent')
      .reduce((sum, inv) => sum + inv.amountDue, 0);

    const netOutstandingETB = totalExpectedETB - grossCollectedETB;
    const collectionRatePercent = totalExpectedETB > 0
      ? Math.round((grossCollectedETB / totalExpectedETB) * 100)
      : 0;

    const totalOccupiedUnits = filteredUnits.filter((u) => u.status === 'occupied').length;
    const occupancyRatePercent = filteredUnits.length > 0
      ? Math.round((totalOccupiedUnits / filteredUnits.length) * 100)
      : 0;

    const pendingVerificationCount = payments.filter((p) => p.verificationStatus === 'unverified').length;
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

  return (
    <PMSContext.Provider
      value={{
        currentUser,
        isAuthenticated,
        isFirestoreConnected,
        syncStatus,
        activeRoleRoute,
        activeTab,
        setActiveTab,
        login,
        logout,
        switchUser,
        guardError,
        dismissGuardError,
        navigateRoleRoute,
        properties,
        selectedPropertyId,
        setSelectedPropertyId,
        tenants,
        units,
        invoices,
        payments,
        smsLogs,
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
        resetToSampleData
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
