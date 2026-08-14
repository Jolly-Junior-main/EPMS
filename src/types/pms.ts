export type UserRole = 'admin' | 'owner' | 'manager';

export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  role: UserRole;
  phone: string;
  avatar: string;
  title: string;
  complexAccess: string[];
}

export type TenantStatus = 'active' | 'pending_renewal' | 'delinquent';

export interface TenantDocument {
  docId: string;
  name: string;
  type: 'lease_agreement' | 'id_card' | 'tax_registration' | 'business_license' | 'other';
  storagePath: string;
  downloadUrl: string;
  uploadedAt: string;
  sizeBytes: number;
  mimeType: string;
}

export interface Tenant {
  tenantId: string;
  legalName: string;
  businessTradeName?: string;
  phone: string;
  email: string;
  assignedUnitId: string;
  propertyId: string;
  leaseStartDate: string;
  leaseEndDate: string;
  status: TenantStatus;
  monthlyRentETB: number;
  securityDepositETB: number;
  tinNumber?: string;
  contactPerson?: string;
  emergencyContact?: string;
  notes?: string;
  documents: TenantDocument[];
  createdAt: string;
}

export interface Unit {
  unitId: string;
  propertyId: string;
  propertyName: string;
  unitNumber: string;
  floor: number;
  type: 'commercial_retail' | 'commercial_office' | 'residential_apartment' | 'residential_penthouse';
  areaSqMeters: number;
  monthlyBaseRentETB: number;
  status: 'occupied' | 'vacant' | 'maintenance';
  currentTenantId?: string;
}

export type BillingFrequency = 'monthly' | 'quarterly' | 'bi-annually' | 'annually';
export type PaymentStatus = 'pending' | 'submitted_for_verification' | 'paid' | 'delinquent';

export interface Invoice {
  invoiceId: string;
  invoiceNumber: string;
  unitId: string;
  tenantId: string;
  propertyId: string;
  amountDue: number; // in ETB
  dueDate: string; // ISO string
  issuedDate: string; // ISO string
  billingFrequency: BillingFrequency;
  paymentStatus: PaymentStatus;
  billingPeriod: string; // e.g. "August 2026" or "Q3 2026"
  description: string;
  lateFeeApplied?: number;
  paidAt?: string;
  paymentId?: string;
}

export type VerificationStatus = 'unverified' | 'verified' | 'rejected';

export interface Payment {
  paymentId: string;
  invoiceId: string;
  tenantId: string;
  unitId: string;
  amountPaid: number; // in ETB
  paymentMethod: 'telebirr' | 'cbe_birr' | 'awash_bank' | 'dashen_bank' | 'bank_of_abyssinia' | 'cash' | 'bank_transfer';
  referenceNumber: string;
  receiptImageUrl: string;
  submittedBy: string; // Manager UID or name
  submittedAt: string;
  verificationStatus: VerificationStatus;
  verifiedBy?: string; // Owner/Admin UID or name
  verifiedAt?: string;
  rejectionReason?: string;
  notes?: string;
}

export interface SMSLog {
  id: string;
  recipientPhone: string;
  recipientName: string;
  tenantId: string;
  unitNumber: string;
  invoiceId: string;
  amountETB: number;
  dueDate: string;
  messageType: '7_day_reminder' | 'due_today_reminder' | 'delinquency_notice' | 'payment_confirmed' | 'custom_broadcast';
  messageText: string;
  gateway: 'Twilio' | 'EthioTelecom_REST' | 'Safaricom_SMS';
  status: 'sent' | 'delivered' | 'failed' | 'queued';
  dispatchedAt: string;
  httpStatusCode: number;
  gatewayMessageId: string;
}

export interface Property {
  propertyId: string;
  name: string;
  location: string;
  totalUnits: number;
  type: 'commercial' | 'mixed_use' | 'residential';
}

export interface VerificationAuditLog {
  id: string;
  paymentId: string;
  invoiceId: string;
  action: 'verified' | 'rejected' | 'submitted';
  performedBy: string;
  role: UserRole;
  timestamp: string;
  details: string;
}
