import { UserRole } from './pms';

export type OrganizationStatus = 'active' | 'trial' | 'suspended' | 'archived' | 'departed';
export type PlanTier = 'starter' | 'professional' | 'business' | 'enterprise';
export type SubscriptionStatus = 'trial' | 'active' | 'expiring_soon' | 'expired' | 'suspended' | 'cancelled';
export type PlatformBillingStatus = 'paid' | 'pending' | 'failed' | 'refunded' | 'cancelled';
export type SupportTicketPriority = 'low' | 'medium' | 'high' | 'urgent';
export type SupportTicketStatus = 'open' | 'in_progress' | 'waiting_for_client' | 'resolved' | 'closed';

export type SubscriptionBillingCycle = 'monthly' | 'semi_annually' | 'annually';

export type OrganizationDepartureReason =
  | 'lease_expired'
  | 'relocation'
  | 'early_termination'
  | 'eviction'
  | 'business_closure'
  | 'other';

export interface OrganizationDepartureRecord {
  departedAt: string;
  departureReason: OrganizationDepartureReason;
  departureNotes: string;
  handoverCompleted: boolean;
  keysReturned: boolean;
  depositSettled: boolean;
  vacatedUnitsCount: number;
  processedByAdminName: string;
}

export interface PlanLimits {
  maxBuildings: number;
  maxUnits: number;
  maxUsers: number;
  storageGB: number;
  features: string[];
  supportLevel: 'community' | 'standard' | 'priority' | 'dedicated_24_7';
  hasCustomReports: boolean;
  hasApiAccess: boolean;
  hasSmsIntegration: boolean;
}

export interface PlatformPlan {
  planId: string;
  tier: PlanTier;
  name: string;
  description: string;
  monthlyPriceETB: number;
  sixMonthPriceETB: number;
  annualPriceETB: number;
  limits: PlanLimits;
  isPopular?: boolean;
}

export interface Subscription {
  subscriptionId: string;
  organizationId: string;
  planId: string;
  tier: PlanTier;
  status: SubscriptionStatus;
  startDate: string;
  expiryDate: string;
  daysRemaining: number;
  amountETB: number;
  billingCycle: SubscriptionBillingCycle;
  autoRenew: boolean;
  paymentStatus: PlatformBillingStatus;
  lastPaymentDate?: string;
  nextBillingDate: string;
}

export interface OrganizationUsage {
  buildingsCount: number;
  unitsCount: number;
  occupiedUnitsCount: number;
  usersCount: number;
  storageUsedMB: number;
  smsSentThisMonth: number;
}

export interface Organization {
  organizationId: string;
  name: string;
  tradeName?: string;
  logoUrl?: string;
  tinNumber: string;
  contactPerson: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
  city: string;
  country: string;
  website?: string;
  status: OrganizationStatus;
  planTier: PlanTier;
  planId: string;
  subscriptionId: string;
  primaryAdminUid: string;
  primaryAdminName: string;
  primaryAdminEmail: string;
  tempPassword?: string;
  createdAt: string;
  lastActivityAt: string;
  usage: OrganizationUsage;
  customLimits?: Partial<PlanLimits>;
  departureRecord?: OrganizationDepartureRecord;
}

export interface PlatformInvoice {
  invoiceId: string;
  invoiceNumber: string;
  organizationId: string;
  organizationName: string;
  planName: string;
  amountETB: number;
  currency: 'ETB' | 'USD';
  billingPeriod: string;
  issuedDate: string;
  dueDate: string;
  paidDate?: string;
  status: PlatformBillingStatus;
  paymentMethod?: 'telebirr' | 'cbe_birr' | 'awash_bank' | 'bank_transfer' | 'credit_card';
  transactionReference?: string;
  downloadUrl?: string;
}

export type PlatformInvoiceStatus = PlatformBillingStatus;
export type SuperAdminAuditAction = string;

export interface SuperAdminAuditLog {
  logId: string;
  timestamp: string;
  actorId: string;
  actorName: string;
  actorRole: UserRole | 'super_admin';
  organizationId?: string;
  organizationName?: string;
  action: string;
  resource:
    | 'organization'
    | 'subscription'
    | 'plan'
    | 'user'
    | 'building'
    | 'setting'
    | 'impersonation'
    | 'security'
    | 'auth_gateway'
    | 'platform_login'
    | 'platform_api';
  resourceId?: string;
  previousValue?: string;
  newValue?: string;
  ipAddress: string;
  userAgent?: string;
  details: string;
}

export interface PlatformNotification {
  notificationId: string;
  title: string;
  message: string;
  type: 'subscription_expiring' | 'subscription_expired' | 'payment_failed' | 'org_suspended' | 'usage_limit_warning' | 'security_alert' | 'system_maintenance' | 'user_invitation';
  organizationId?: string;
  organizationName?: string;
  isRead: boolean;
  createdAt: string;
  actionUrl?: string;
}

export interface SupportTicket {
  ticketId: string;
  ticketNumber: string;
  organizationId: string;
  organizationName: string;
  contactPerson: string;
  contactEmail: string;
  subject: string;
  description: string;
  priority: SupportTicketPriority;
  status: SupportTicketStatus;
  assignedStaff?: string;
  createdAt: string;
  updatedAt: string;
  resolutionNotes?: string;
}

export interface PlatformSettings {
  general: {
    platformName: string;
    tagline: string;
    supportEmail: string;
    supportPhone: string;
    defaultCurrency: string;
    timezone: string;
    logoUrl?: string;
  };
  security: {
    sessionTimeoutMinutes: number;
    requireMFAForAdmins: boolean;
    maxLoginAttempts: number;
    passwordExpiryDays: number;
    allowPasswordReset: boolean;
    ipAllowlist: string[];
  };
  emailSms: {
    senderName: string;
    senderEmail: string;
    smtpHost: string;
    smsGateway: 'EthioTelecom' | 'Twilio' | 'Safaricom';
    smsSenderId: string;
    enableAutomatedReminders: boolean;
  };
  maintenance: {
    isMaintenanceMode: boolean;
    maintenanceMessage: string;
    allowedIpAddresses: string[];
    scheduledEndTime?: string;
  };
}

export interface ImpersonationContext {
  isImpersonating: boolean;
  targetOrganizationId: string;
  targetOrganizationName: string;
  originalSuperAdmin: {
    uid: string;
    name: string;
    email: string;
  };
  startedAt: string;
}

export interface PlatformAdBanner {
  adId: string;
  title: string;
  subtitle: string;
  ctaText?: string;
  ctaUrl?: string;
  badgeText?: string;
  badgeColor?: string; // e.g. '#007AFF' | '#34C759' | '#FF9500'
  imageUrl?: string;
  targetAudience: 'all' | 'owner' | 'manager' | 'tenant';
  placement: 'dashboard_top' | 'sidebar_bottom' | 'portal_header';
  isActive: boolean;
  createdAt: string;
  expiresAt?: string;
}

export interface SmsApiGatewayConfig {
  provider: 'EthioTelecom' | 'Twilio' | 'Safaricom';
  apiKey: string;
  apiSecret: string;
  senderId: string;
  restEndpointUrl: string;
  balanceCredits: number;
  costPerSmsETB: number;
  status: 'connected' | 'disconnected' | 'rate_limited';
  lastPingAt: string;
}
