import {
  collection,
  doc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  writeBatch,
  query,
  where,
  orderBy,
  serverTimestamp
} from 'firebase/firestore';
import { db } from './firebase';
import {
  Tenant,
  Unit,
  Invoice,
  Payment,
  SMSLog,
  VerificationAuditLog,
  Property
} from '../types/pms';
import {
  MOCK_PROPERTIES,
  MOCK_UNITS,
  MOCK_TENANTS,
  MOCK_INVOICES,
  MOCK_PAYMENTS,
  MOCK_SMS_LOGS
} from '../data/mockData';

// Collection references
export const COLLECTIONS = {
  PROPERTIES: 'properties',
  UNITS: 'units',
  TENANTS: 'tenants',
  INVOICES: 'invoices',
  PAYMENTS: 'payments',
  SMS_LOGS: 'sms_logs',
  AUDIT_LOGS: 'audit_logs',
  USERS: 'users'
} as const;

/**
 * Seed initial sample database records into Firestore if collections are empty.
 */
export async function seedFirestoreIfEmpty(): Promise<{ seeded: boolean; counts: Record<string, number> }> {
  try {
    const tenantsSnap = await getDocs(collection(db, COLLECTIONS.TENANTS));
    if (!tenantsSnap.empty) {
      return { seeded: false, counts: { tenants: tenantsSnap.size } };
    }

    const batch = writeBatch(db);

    // 1. Properties
    for (const prop of MOCK_PROPERTIES) {
      const ref = doc(db, COLLECTIONS.PROPERTIES, prop.propertyId);
      batch.set(ref, prop);
    }

    // 2. Units
    for (const unit of MOCK_UNITS) {
      const ref = doc(db, COLLECTIONS.UNITS, unit.unitId);
      batch.set(ref, unit);
    }

    // 3. Tenants
    for (const tenant of MOCK_TENANTS) {
      const ref = doc(db, COLLECTIONS.TENANTS, tenant.tenantId);
      batch.set(ref, tenant);
    }

    // 4. Invoices
    for (const inv of MOCK_INVOICES) {
      const ref = doc(db, COLLECTIONS.INVOICES, inv.invoiceId);
      batch.set(ref, inv);
    }

    // 5. Payments
    for (const pay of MOCK_PAYMENTS) {
      const ref = doc(db, COLLECTIONS.PAYMENTS, pay.paymentId);
      batch.set(ref, pay);
    }

    // 6. SMS Logs
    for (const sms of MOCK_SMS_LOGS) {
      const ref = doc(db, COLLECTIONS.SMS_LOGS, sms.id);
      batch.set(ref, sms);
    }

    // 7. Initial Audit Log
    const initialAudit: VerificationAuditLog = {
      id: 'audit_01',
      paymentId: 'pay_2026_004',
      invoiceId: 'inv_2026_07_003',
      action: 'verified',
      performedBy: 'Abebe Mengesha (Owner)',
      role: 'owner',
      timestamp: new Date().toISOString(),
      details: 'Approved Dashen Bank EFT receipt of 210,000.00 ETB for Suite 301.'
    };
    const auditRef = doc(db, COLLECTIONS.AUDIT_LOGS, initialAudit.id);
    batch.set(auditRef, initialAudit);

    await batch.commit();
    return {
      seeded: true,
      counts: {
        properties: MOCK_PROPERTIES.length,
        units: MOCK_UNITS.length,
        tenants: MOCK_TENANTS.length,
        invoices: MOCK_INVOICES.length,
        payments: MOCK_PAYMENTS.length,
        smsLogs: MOCK_SMS_LOGS.length
      }
    };
  } catch (error) {
    console.warn('Firestore seeding skipped or restricted by rules:', error);
    return { seeded: false, counts: {} };
  }
}

/**
 * Real-time subscriptions helper
 */
export function subscribeToPMSCollections(organizationId: string | null | undefined, callbacks: {
  onTenants?: (data: Tenant[]) => void;
  onUnits?: (data: Unit[]) => void;
  onInvoices?: (data: Invoice[]) => void;
  onPayments?: (data: Payment[]) => void;
  onSMSLogs?: (data: SMSLog[]) => void;
  onAuditLogs?: (data: VerificationAuditLog[]) => void;
  onError?: (err: Error) => void;
}) {
  const unsubscribers: (() => void)[] = [];

  try {
    if (callbacks.onTenants) {
      let q = query(collection(db, COLLECTIONS.TENANTS));
      if (organizationId && organizationId !== 'platform_core') {
        q = query(collection(db, COLLECTIONS.TENANTS), where('organizationId', '==', organizationId));
      }
      unsubscribers.push(
        onSnapshot(q, (snap) => {
          const list = snap.docs.map((d) => d.data() as Tenant);
          callbacks.onTenants?.(list);
        }, callbacks.onError)
      );
    }

    if (callbacks.onUnits) {
      let q = query(collection(db, COLLECTIONS.UNITS));
      if (organizationId && organizationId !== 'platform_core') {
        q = query(collection(db, COLLECTIONS.UNITS), where('organizationId', '==', organizationId));
      }
      unsubscribers.push(
        onSnapshot(q, (snap) => {
          const list = snap.docs.map((d) => d.data() as Unit);
          callbacks.onUnits?.(list);
        }, callbacks.onError)
      );
    }

    if (callbacks.onInvoices) {
      let q = query(collection(db, COLLECTIONS.INVOICES));
      if (organizationId && organizationId !== 'platform_core') {
        q = query(collection(db, COLLECTIONS.INVOICES), where('organizationId', '==', organizationId));
      }
      unsubscribers.push(
        onSnapshot(q, (snap) => {
          const list = snap.docs.map((d) => d.data() as Invoice);
          callbacks.onInvoices?.(list);
        }, callbacks.onError)
      );
    }

    if (callbacks.onPayments) {
      let q = query(collection(db, COLLECTIONS.PAYMENTS));
      if (organizationId && organizationId !== 'platform_core') {
        q = query(collection(db, COLLECTIONS.PAYMENTS), where('organizationId', '==', organizationId));
      }
      unsubscribers.push(
        onSnapshot(q, (snap) => {
          const list = snap.docs.map((d) => d.data() as Payment);
          callbacks.onPayments?.(list);
        }, callbacks.onError)
      );
    }

    if (callbacks.onSMSLogs) {
      let q = query(collection(db, COLLECTIONS.SMS_LOGS));
      if (organizationId && organizationId !== 'platform_core') {
        q = query(collection(db, COLLECTIONS.SMS_LOGS), where('organizationId', '==', organizationId));
      }
      unsubscribers.push(
        onSnapshot(q, (snap) => {
          const list = snap.docs.map((d) => d.data() as SMSLog);
          callbacks.onSMSLogs?.(list);
        }, callbacks.onError)
      );
    }

    if (callbacks.onAuditLogs) {
      let q = query(collection(db, COLLECTIONS.AUDIT_LOGS));
      if (organizationId && organizationId !== 'platform_core') {
        q = query(collection(db, COLLECTIONS.AUDIT_LOGS), where('organizationId', '==', organizationId));
      }
      unsubscribers.push(
        onSnapshot(q, (snap) => {
          const list = snap.docs.map((d) => d.data() as VerificationAuditLog);
          callbacks.onAuditLogs?.(list);
        }, callbacks.onError)
      );
    }
  } catch (error: any) {
    if (callbacks.onError) callbacks.onError(error);
  }

  return () => {
    unsubscribers.forEach((unsub) => unsub());
  };
}

/**
 * Firestore CRUD helpers
 */
export async function saveTenantToFirestore(tenant: Tenant): Promise<void> {
  const ref = doc(db, COLLECTIONS.TENANTS, tenant.tenantId);
  await setDoc(ref, tenant, { merge: true });
}

export async function deleteTenantFromFirestore(tenantId: string): Promise<void> {
  const ref = doc(db, COLLECTIONS.TENANTS, tenantId);
  await deleteDoc(ref);
}

export async function saveInvoiceToFirestore(invoice: Invoice): Promise<void> {
  const ref = doc(db, COLLECTIONS.INVOICES, invoice.invoiceId);
  await setDoc(ref, invoice, { merge: true });
}

export async function savePaymentToFirestore(payment: Payment): Promise<void> {
  const ref = doc(db, COLLECTIONS.PAYMENTS, payment.paymentId);
  await setDoc(ref, payment, { merge: true });
}

export async function saveSMSLogToFirestore(log: SMSLog): Promise<void> {
  const ref = doc(db, COLLECTIONS.SMS_LOGS, log.id);
  await setDoc(ref, log, { merge: true });
}

export async function saveAuditLogToFirestore(audit: VerificationAuditLog): Promise<void> {
  const ref = doc(db, COLLECTIONS.AUDIT_LOGS, audit.id);
  await setDoc(ref, audit, { merge: true });
}

export async function updateUnitInFirestore(unitId: string, updates: Partial<Unit>): Promise<void> {
  const ref = doc(db, COLLECTIONS.UNITS, unitId);
  await updateDoc(ref, updates);
}

export async function deleteInvoiceFromFirestore(invoiceId: string): Promise<void> {
  const ref = doc(db, COLLECTIONS.INVOICES, invoiceId);
  await deleteDoc(ref);
}

export async function deletePaymentFromFirestore(paymentId: string): Promise<void> {
  const ref = doc(db, COLLECTIONS.PAYMENTS, paymentId);
  await deleteDoc(ref);
}

export async function resetFirestoreToDefaults(): Promise<void> {
  const batch = writeBatch(db);

  // 1. Properties
  for (const prop of MOCK_PROPERTIES) {
    const ref = doc(db, COLLECTIONS.PROPERTIES, prop.propertyId);
    batch.set(ref, prop);
  }

  // 2. Units
  for (const unit of MOCK_UNITS) {
    const ref = doc(db, COLLECTIONS.UNITS, unit.unitId);
    batch.set(ref, unit);
  }

  // 3. Tenants
  for (const tenant of MOCK_TENANTS) {
    const ref = doc(db, COLLECTIONS.TENANTS, tenant.tenantId);
    batch.set(ref, tenant);
  }

  // 4. Invoices
  for (const inv of MOCK_INVOICES) {
    const ref = doc(db, COLLECTIONS.INVOICES, inv.invoiceId);
    batch.set(ref, inv);
  }

  // 5. Payments
  for (const pay of MOCK_PAYMENTS) {
    const ref = doc(db, COLLECTIONS.PAYMENTS, pay.paymentId);
    batch.set(ref, pay);
  }

  // 6. SMS Logs
  for (const sms of MOCK_SMS_LOGS) {
    const ref = doc(db, COLLECTIONS.SMS_LOGS, sms.id);
    batch.set(ref, sms);
  }

  await batch.commit();
}

