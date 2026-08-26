export type UserRole = 'super_admin' | 'admin' | 'owner' | 'manager' | 'tenant';

export type MaintenancePriority = 'low' | 'medium' | 'high' | 'emergency';
export type MaintenanceStatus = 'reported' | 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
export type MaintenanceCategory = 'plumbing' | 'electrical' | 'hvac' | 'elevator' | 'structural' | 'cleaning' | 'general';

export interface MaintenanceRequest {
  requestId: string;
  ticketNumber: string;
  tenantId: string;
  tenantName: string;
  unitId: string;
  unitNumber: string;
  propertyId: string;
  organizationId?: string;
  category: MaintenanceCategory;
  priority: MaintenancePriority;
  status: MaintenanceStatus;
  title: string;
  description: string;
  reportedDate: string;
  estimatedCostETB?: number;
  assignedTechnician?: string;
  technicianPhone?: string;
  scheduledDate?: string;
  completedDate?: string;
  resolutionNotes?: string;
}

export interface LeaseRenewalRequest {
  requestId: string;
  tenantId: string;
  tenantName: string;
  unitNumber: string;
  currentLeaseEndDate: string;
  requestedExtensionMonths: number;
  notes?: string;
  status: 'pending' | 'approved' | 'declined';
  submittedAt: string;
  organizationId?: string;
}

export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  role: UserRole;
  phone: string;
  avatar: string;
  title: string;
  organizationId?: string;
  organizationName?: string;
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
  organizationId?: string;
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
  organizationId?: string;
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
  organizationId?: string;
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
  organizationId?: string;
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
  organizationId?: string;
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
  organizationId?: string;
  organizationName?: string;
  name: string;
  location: string;
  totalUnits: number;
  type: 'commercial' | 'mixed_use' | 'residential';
}

export interface VerificationAuditLog {
  id: string;
  organizationId?: string;
  paymentId: string;
  invoiceId: string;
  action: 'verified' | 'rejected' | 'submitted';
  performedBy: string;
  role: UserRole;
  timestamp: string;
  details: string;
}
