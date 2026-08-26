import {
  Organization,
  PlatformPlan,
  Subscription,
  PlatformInvoice,
  SuperAdminAuditLog,
  PlatformNotification,
  SupportTicket,
  PlatformSettings,
  PlatformAdBanner,
  SmsApiGatewayConfig
} from '../types/superAdmin';

export const MOCK_PLATFORM_PLANS: PlatformPlan[] = [
  {
    planId: 'plan_starter',
    tier: 'starter',
    name: 'Starter Plan',
    description: 'Designed for single commercial or residential properties starting out with automated billing.',
    monthlyPriceETB: 35000,
    sixMonthPriceETB: 189000, // 10% discount for 6 months
    annualPriceETB: 336000,  // 20% discount for 1 year
    isPopular: false,
    limits: {
      maxBuildings: 2,
      maxUnits: 40,
      maxUsers: 5,
      storageGB: 10,
      features: ['Automated Rent Invoicing', 'Telebirr & CBE Slip Verification', 'Basic SMS Reminders', 'Tenant Directory'],
      supportLevel: 'standard',
      hasCustomReports: false,
      hasApiAccess: false,
      hasSmsIntegration: true
    }
  },
  {
    planId: 'plan_professional',
    tier: 'professional',
    name: 'Professional Plan',
    description: 'Perfect for growing property management firms managing multiple commercial plazas and towers.',
    monthlyPriceETB: 85000,
    sixMonthPriceETB: 459000, // 10% discount for 6 months
    annualPriceETB: 816000,  // 20% discount for 1 year
    isPopular: true,
    limits: {
      maxBuildings: 8,
      maxUnits: 250,
      maxUsers: 25,
      storageGB: 50,
      features: ['Multi-Complex Vault', 'The Red List Escalation', 'Direct Ethio Telecom SMS Gateway', 'Digital Tenant Self-Service Portal', 'Maintenance Work Orders'],
      supportLevel: 'priority',
      hasCustomReports: true,
      hasApiAccess: true,
      hasSmsIntegration: true
    }
  },
  {
    planId: 'plan_business',
    tier: 'business',
    name: 'Business Enterprise',
    description: 'Comprehensive solution for institutional asset managers with high-volume lease operations.',
    monthlyPriceETB: 165000,
    sixMonthPriceETB: 891000, // 10% discount for 6 months
    annualPriceETB: 1584000, // 20% discount for 1 year
    isPopular: false,
    limits: {
      maxBuildings: 25,
      maxUnits: 1000,
      maxUsers: 100,
      storageGB: 200,
      features: ['Unlimited Lease Documents Vault', 'Automated Daily Cloud Scheduler Cron', 'Custom Claims RBAC Matrix', 'Real-Time Financial Audit Trail', 'Multi-Branch Accounting'],
      supportLevel: 'priority',
      hasCustomReports: true,
      hasApiAccess: true,
      hasSmsIntegration: true
    }
  },
  {
    planId: 'plan_enterprise',
    tier: 'enterprise',
    name: 'Custom Enterprise Tier',
    description: 'Dedicated cloud infrastructure, custom SLA, and tailored integrations for national real estate conglomerates.',
    monthlyPriceETB: 320000,
    sixMonthPriceETB: 1728000, // 10% discount for 6 months
    annualPriceETB: 3072000,  // 20% discount for 1 year
    isPopular: false,
    limits: {
      maxBuildings: 100,
      maxUnits: 5000,
      maxUsers: 500,
      storageGB: 1000,
      features: ['Dedicated Firestore Database Cluster', '24/7 Priority Support Engineer', 'Custom ERP & Core Banking Integration', 'White-Label Branding', 'Unlimited API Bandwidth'],
      supportLevel: 'dedicated_24_7',
      hasCustomReports: true,
      hasApiAccess: true,
      hasSmsIntegration: true
    }
  }
];

export const MOCK_AD_BANNERS: PlatformAdBanner[] = [
  {
    adId: 'ad_01',
    title: '⚡ Upgrade to Enterprise Cloud & Get Free EthioTelecom Bulk SMS Gateway',
    subtitle: 'Scale beyond 500 units with dedicated cloud resources, custom domain, and automated tenant receipt SMS.',
    ctaText: 'Explore Enterprise Tier',
    ctaUrl: '#plans',
    badgeText: 'FEATURED PROMO',
    badgeColor: '#007AFF',
    imageUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=300&auto=format&fit=crop&q=80',
    targetAudience: 'all',
    placement: 'dashboard_top',
    isActive: true,
    createdAt: '2026-08-01T00:00:00Z'
  },
  {
    adId: 'ad_02',
    title: '💳 Telebirr & CBE Digital Instant Payment Integration Now Live',
    subtitle: 'Tenants can now settle commercial rent directly through Telebirr SuperApp with automated EFT reference validation.',
    ctaText: 'View Payment Guide',
    ctaUrl: '#telebirr',
    badgeText: 'NEW FEATURE',
    badgeColor: '#34C759',
    targetAudience: 'manager',
    placement: 'dashboard_top',
    isActive: true,
    createdAt: '2026-08-15T00:00:00Z'
  }
];

export const DEFAULT_SMS_API_CONFIG: SmsApiGatewayConfig = {
  provider: 'EthioTelecom',
  apiKey: 'ETH-SMS-KEY-8940-2026-X99B',
  apiSecret: '••••••••••••••••••••••••••••••••',
  senderId: 'EPMS-NOTIFY',
  restEndpointUrl: 'https://api.ethiotelecom.et/v2/sms/send-bulk',
  balanceCredits: 48500,
  costPerSmsETB: 0.35,
  status: 'connected',
  lastPingAt: '2026-08-26T14:30:00Z'
};

export const MOCK_ORGANIZATIONS: Organization[] = [
  {
    organizationId: 'org_bole_plaza',
    name: 'Bole Medhanialem Commercial Center',
    tradeName: 'Bole Plaza Management PLC',
    logoUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=120&auto=format&fit=crop&q=80',
    tinNumber: '0048192831',
    contactPerson: 'Abebe Mengesha',
    contactEmail: 'abebe.mengesha@boleplaza.et',
    contactPhone: '+251 91 123 4567',
    address: 'Cameroon St, Bole Sub-City',
    city: 'Addis Ababa',
    country: 'Ethiopia',
    website: 'https://boleplaza.et',
    status: 'active',
    planTier: 'professional',
    planId: 'plan_professional',
    subscriptionId: 'sub_bole_001',
    primaryAdminUid: 'usr_owner_001',
    primaryAdminName: 'Abebe Mengesha',
    primaryAdminEmail: 'abebe.mengesha@boleplaza.et',
    createdAt: '2025-11-15T08:00:00Z',
    lastActivityAt: '2026-08-26T14:32:00Z',
    usage: {
      buildingsCount: 3,
      unitsCount: 80,
      occupiedUnitsCount: 74,
      usersCount: 8,
      storageUsedMB: 18450,
      smsSentThisMonth: 640
    }
  },
  {
    organizationId: 'org_kaldas_mgmt',
    name: 'Kaldas Property Management Group',
    tradeName: 'Kaldas Real Estate PLC',
    logoUrl: 'https://images.unsplash.com/photo-1577495508048-b635879837f1?w=120&auto=format&fit=crop&q=80',
    tinNumber: '0071928401',
    contactPerson: 'Yonas Kaldas',
    contactEmail: 'yonas.k@kaldasproperties.et',
    contactPhone: '+251 91 555 7890',
    address: 'Churchill Ave, Piazza',
    city: 'Addis Ababa',
    country: 'Ethiopia',
    website: 'https://kaldasproperties.et',
    status: 'active',
    planTier: 'business',
    planId: 'plan_business',
    subscriptionId: 'sub_kaldas_002',
    primaryAdminUid: 'usr_kaldas_admin',
    primaryAdminName: 'Yonas Kaldas',
    primaryAdminEmail: 'yonas.k@kaldasproperties.et',
    createdAt: '2025-12-01T09:30:00Z',
    lastActivityAt: '2026-08-26T15:10:00Z',
    usage: {
      buildingsCount: 14,
      unitsCount: 420,
      occupiedUnitsCount: 395,
      usersCount: 32,
      storageUsedMB: 68200,
      smsSentThisMonth: 1850
    }
  },
  {
    organizationId: 'org_kazanchis_fin',
    name: 'Kazanchis Financial District Tower',
    tradeName: 'Kazanchis Towers Investment Ltd',
    logoUrl: 'https://images.unsplash.com/photo-1541888946425-d0fbb18f15f6?w=120&auto=format&fit=crop&q=80',
    tinNumber: '0092837415',
    contactPerson: 'Rahel Desta',
    contactEmail: 'rahel.desta@kazanchistower.et',
    contactPhone: '+251 91 888 1234',
    address: 'Menelik II Ave, Kirkos Sub-City',
    city: 'Addis Ababa',
    country: 'Ethiopia',
    website: 'https://kazanchistower.et',
    status: 'active',
    planTier: 'professional',
    planId: 'plan_professional',
    subscriptionId: 'sub_kazanchis_003',
    primaryAdminUid: 'usr_rahel_admin',
    primaryAdminName: 'Rahel Desta',
    primaryAdminEmail: 'rahel.desta@kazanchistower.et',
    createdAt: '2026-01-10T10:00:00Z',
    lastActivityAt: '2026-08-25T17:45:00Z',
    usage: {
      buildingsCount: 2,
      unitsCount: 110,
      occupiedUnitsCount: 102,
      usersCount: 12,
      storageUsedMB: 24300,
      smsSentThisMonth: 480
    }
  },
  {
    organizationId: 'org_sunrise_heights',
    name: 'Sunrise Heights Residential & Commercial',
    tradeName: 'Sunrise Assets & Hospitality PLC',
    logoUrl: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=120&auto=format&fit=crop&q=80',
    tinNumber: '0039281745',
    contactPerson: 'Dawit Getachew',
    contactEmail: 'dawit.g@sunriseheights.et',
    contactPhone: '+251 91 444 3322',
    address: 'CMC Road, Yeka Sub-City',
    city: 'Addis Ababa',
    country: 'Ethiopia',
    website: 'https://sunriseheights.et',
    status: 'trial',
    planTier: 'starter',
    planId: 'plan_starter',
    subscriptionId: 'sub_sunrise_004',
    primaryAdminUid: 'usr_dawit_admin',
    primaryAdminName: 'Dawit Getachew',
    primaryAdminEmail: 'dawit.g@sunriseheights.et',
    createdAt: '2026-08-10T11:00:00Z',
    lastActivityAt: '2026-08-26T12:00:00Z',
    usage: {
      buildingsCount: 1,
      unitsCount: 24,
      occupiedUnitsCount: 19,
      usersCount: 3,
      storageUsedMB: 4120,
      smsSentThisMonth: 95
    }
  },
  {
    organizationId: 'org_abyssinia_tower',
    name: 'Abyssinia Tower Commercial Properties',
    tradeName: 'Abyssinia Real Estate Holding',
    logoUrl: 'https://images.unsplash.com/photo-1464938050520-ef2270bb8ce8?w=120&auto=format&fit=crop&q=80',
    tinNumber: '0019283749',
    contactPerson: 'Solomon Worku',
    contactEmail: 'solomon@abyssiniatower.et',
    contactPhone: '+251 91 999 8877',
    address: 'Mexico Square, Addis Ababa',
    city: 'Addis Ababa',
    country: 'Ethiopia',
    status: 'suspended',
    planTier: 'starter',
    planId: 'plan_starter',
    subscriptionId: 'sub_abyssinia_005',
    primaryAdminUid: 'usr_solomon_admin',
    primaryAdminName: 'Solomon Worku',
    primaryAdminEmail: 'solomon@abyssiniatower.et',
    createdAt: '2026-02-01T14:00:00Z',
    lastActivityAt: '2026-07-20T10:15:00Z',
    usage: {
      buildingsCount: 1,
      unitsCount: 35,
      occupiedUnitsCount: 30,
      usersCount: 4,
      storageUsedMB: 7500,
      smsSentThisMonth: 0
    }
  }
];

export const MOCK_SUBSCRIPTIONS: Subscription[] = [
  {
    subscriptionId: 'sub_bole_001',
    organizationId: 'org_bole_plaza',
    planId: 'plan_professional',
    tier: 'professional',
    status: 'active',
    startDate: '2026-01-01',
    expiryDate: '2027-01-01',
    daysRemaining: 128,
    amountETB: 918000,
    billingCycle: 'annually',
    autoRenew: true,
    paymentStatus: 'paid',
    lastPaymentDate: '2026-01-01',
    nextBillingDate: '2027-01-01'
  },
  {
    subscriptionId: 'sub_kaldas_002',
    organizationId: 'org_kaldas_mgmt',
    planId: 'plan_business',
    tier: 'business',
    status: 'active',
    startDate: '2026-03-15',
    expiryDate: '2027-03-15',
    daysRemaining: 201,
    amountETB: 1782000,
    billingCycle: 'annually',
    autoRenew: true,
    paymentStatus: 'paid',
    lastPaymentDate: '2026-03-15',
    nextBillingDate: '2027-03-15'
  },
  {
    subscriptionId: 'sub_kazanchis_003',
    organizationId: 'org_kazanchis_fin',
    planId: 'plan_professional',
    tier: 'professional',
    status: 'expiring_soon',
    startDate: '2025-09-01',
    expiryDate: '2026-09-01',
    daysRemaining: 6,
    amountETB: 85000,
    billingCycle: 'monthly',
    autoRenew: true,
    paymentStatus: 'pending',
    lastPaymentDate: '2026-08-01',
    nextBillingDate: '2026-09-01'
  },
  {
    subscriptionId: 'sub_sunrise_004',
    organizationId: 'org_sunrise_heights',
    planId: 'plan_starter',
    tier: 'starter',
    status: 'trial',
    startDate: '2026-08-10',
    expiryDate: '2026-09-10',
    daysRemaining: 15,
    amountETB: 0,
    billingCycle: 'monthly',
    autoRenew: false,
    paymentStatus: 'paid',
    nextBillingDate: '2026-09-10'
  },
  {
    subscriptionId: 'sub_abyssinia_005',
    organizationId: 'org_abyssinia_tower',
    planId: 'plan_starter',
    tier: 'starter',
    status: 'suspended',
    startDate: '2026-02-01',
    expiryDate: '2026-08-01',
    daysRemaining: 0,
    amountETB: 35000,
    billingCycle: 'monthly',
    autoRenew: false,
    paymentStatus: 'failed',
    nextBillingDate: '2026-08-01'
  }
];

export const MOCK_PLATFORM_INVOICES: PlatformInvoice[] = [
  {
    invoiceId: 'pinv_2026_001',
    invoiceNumber: 'EPMS-SAAS-2026-001',
    organizationId: 'org_kaldas_mgmt',
    organizationName: 'Kaldas Property Management Group',
    planName: 'Business Enterprise (Annual)',
    amountETB: 1782000,
    currency: 'ETB',
    billingPeriod: 'Mar 2026 - Mar 2027',
    issuedDate: '2026-03-01',
    dueDate: '2026-03-15',
    paidDate: '2026-03-12',
    status: 'paid',
    paymentMethod: 'bank_transfer',
    transactionReference: 'CBE-FT-998822119'
  },
  {
    invoiceId: 'pinv_2026_002',
    invoiceNumber: 'EPMS-SAAS-2026-002',
    organizationId: 'org_bole_plaza',
    organizationName: 'Bole Medhanialem Commercial Center',
    planName: 'Professional Plan (Annual)',
    amountETB: 918000,
    currency: 'ETB',
    billingPeriod: 'Jan 2026 - Jan 2027',
    issuedDate: '2025-12-15',
    dueDate: '2026-01-01',
    paidDate: '2025-12-28',
    status: 'paid',
    paymentMethod: 'awash_bank',
    transactionReference: 'AWASH-CORP-440019'
  },
  {
    invoiceId: 'pinv_2026_003',
    invoiceNumber: 'EPMS-SAAS-2026-003',
    organizationId: 'org_kazanchis_fin',
    organizationName: 'Kazanchis Financial District Tower',
    planName: 'Professional Plan (Monthly)',
    amountETB: 85000,
    currency: 'ETB',
    billingPeriod: 'September 2026',
    issuedDate: '2026-08-20',
    dueDate: '2026-09-01',
    status: 'pending',
    paymentMethod: 'telebirr',
    transactionReference: 'TB-MERCH-81928374'
  },
  {
    invoiceId: 'pinv_2026_004',
    invoiceNumber: 'EPMS-SAAS-2026-004',
    organizationId: 'org_abyssinia_tower',
    organizationName: 'Abyssinia Tower Commercial Properties',
    planName: 'Starter Plan (Monthly)',
    amountETB: 35000,
    currency: 'ETB',
    billingPeriod: 'August 2026',
    issuedDate: '2026-07-25',
    dueDate: '2026-08-01',
    status: 'failed',
    paymentMethod: 'cbe_birr'
  }
];

export const MOCK_SUPERADMIN_AUDIT_LOGS: SuperAdminAuditLog[] = [
  {
    logId: 'slog_001',
    timestamp: '2026-08-26T15:30:12Z',
    actorId: 'usr_superadmin',
    actorName: 'Platform Super Administrator',
    actorRole: 'super_admin',
    organizationId: 'org_kaldas_mgmt',
    organizationName: 'Kaldas Property Management Group',
    action: 'UPGRADE_SUBSCRIPTION',
    resource: 'subscription',
    resourceId: 'sub_kaldas_002',
    previousValue: 'Plan: Professional',
    newValue: 'Plan: Business Enterprise (14 Buildings, 420 Units)',
    ipAddress: '197.156.103.42',
    details: 'Upgraded subscription tier following new commercial tower onboarding in Piazza.'
  },
  {
    logId: 'slog_002',
    timestamp: '2026-08-26T12:15:40Z',
    actorId: 'usr_superadmin',
    actorName: 'Platform Super Administrator',
    actorRole: 'super_admin',
    organizationId: 'org_sunrise_heights',
    organizationName: 'Sunrise Heights Residential & Commercial',
    action: 'CREATE_ORGANIZATION',
    resource: 'organization',
    resourceId: 'org_sunrise_heights',
    newValue: 'Organization created with 30-day Starter Trial',
    ipAddress: '197.156.103.42',
    details: 'Onboarded Sunrise Assets PLC with primary admin Dawit Getachew.'
  },
  {
    logId: 'slog_003',
    timestamp: '2026-08-25T16:45:00Z',
    actorId: 'usr_superadmin',
    actorName: 'Platform Super Administrator',
    actorRole: 'super_admin',
    organizationId: 'org_bole_plaza',
    organizationName: 'Bole Medhanialem Commercial Center',
    action: 'START_IMPERSONATION',
    resource: 'impersonation',
    resourceId: 'org_bole_plaza',
    ipAddress: '197.156.103.42',
    details: 'Super Admin started troubleshooting session for CBE bank slip clearance audit.'
  },
  {
    logId: 'slog_004',
    timestamp: '2026-08-24T09:10:22Z',
    actorId: 'usr_superadmin',
    actorName: 'Platform Super Administrator',
    actorRole: 'super_admin',
    organizationId: 'org_abyssinia_tower',
    organizationName: 'Abyssinia Tower Commercial Properties',
    action: 'SUSPEND_ORGANIZATION',
    resource: 'organization',
    resourceId: 'org_abyssinia_tower',
    previousValue: 'Status: active',
    newValue: 'Status: suspended',
    ipAddress: '197.156.103.42',
    details: 'Automated platform suspension triggered due to 2 consecutive failed billing cycles.'
  }
];

export const MOCK_SUPPORT_TICKETS: SupportTicket[] = [
  {
    ticketId: 'tkt_001',
    ticketNumber: 'TKT-2026-104',
    organizationId: 'org_kaldas_mgmt',
    organizationName: 'Kaldas Property Management Group',
    contactPerson: 'Yonas Kaldas',
    contactEmail: 'yonas.k@kaldasproperties.et',
    subject: 'Request for custom Telebirr Merchant QR Integration for 14 buildings',
    description: 'We need each building reception desk to show unique sub-merchant QR codes for tenant walk-in payments.',
    priority: 'high',
    status: 'in_progress',
    assignedStaff: 'Dawit Alemu (Lead Architect)',
    createdAt: '2026-08-24T10:00:00Z',
    updatedAt: '2026-08-26T11:30:00Z'
  },
  {
    ticketId: 'tkt_002',
    ticketNumber: 'TKT-2026-105',
    organizationId: 'org_kazanchis_fin',
    organizationName: 'Kazanchis Financial District Tower',
    contactPerson: 'Rahel Desta',
    contactEmail: 'rahel.desta@kazanchistower.et',
    subject: 'Annual Subscription Renewal & Multi-Year Discount Quotation',
    description: 'Our board approved 3-year upfront commitment. Requesting formal proforma with Enterprise SLA.',
    priority: 'medium',
    status: 'open',
    assignedStaff: 'Account Management',
    createdAt: '2026-08-25T14:20:00Z',
    updatedAt: '2026-08-25T14:20:00Z'
  },
  {
    ticketId: 'tkt_003',
    ticketNumber: 'TKT-2026-098',
    organizationId: 'org_bole_plaza',
    organizationName: 'Bole Medhanialem Commercial Center',
    contactPerson: 'Hanna Tadesse',
    contactEmail: 'hanna.tadesse@boleplaza.et',
    subject: 'Assistance with Bulk Lease Migration for 28 Retail Units',
    description: 'Need assistance importing PDF lease contracts into the Firebase Storage document vault.',
    priority: 'low',
    status: 'resolved',
    assignedStaff: 'Tech Support',
    createdAt: '2026-08-18T08:30:00Z',
    updatedAt: '2026-08-19T16:00:00Z',
    resolutionNotes: 'Completed batch upload script and validated metadata.'
  }
];

export const MOCK_PLATFORM_NOTIFICATIONS: PlatformNotification[] = [
  {
    notificationId: 'pnotif_001',
    title: 'Subscription Expiring in 6 Days',
    message: 'Kazanchis Financial District Tower subscription expires on Sept 1, 2026. Pending payment invoice EPMS-SAAS-2026-003.',
    type: 'subscription_expiring',
    organizationId: 'org_kazanchis_fin',
    organizationName: 'Kazanchis Financial District Tower',
    isRead: false,
    createdAt: '2026-08-26T08:00:00Z',
    actionUrl: 'subscriptions'
  },
  {
    notificationId: 'pnotif_002',
    title: 'Payment Settlement Failed',
    message: 'Abyssinia Tower invoice EPMS-SAAS-2026-004 failed via CBE Birr gateway. Organization suspended.',
    type: 'payment_failed',
    organizationId: 'org_abyssinia_tower',
    organizationName: 'Abyssinia Tower Commercial Properties',
    isRead: false,
    createdAt: '2026-08-24T09:10:00Z',
    actionUrl: 'billing'
  },
  {
    notificationId: 'pnotif_003',
    title: 'New Client Organization Onboarded',
    message: 'Sunrise Heights Residential (Dawit Getachew) registered for Starter Trial.',
    type: 'user_invitation',
    organizationId: 'org_sunrise_heights',
    organizationName: 'Sunrise Heights Residential & Commercial',
    isRead: true,
    createdAt: '2026-08-10T11:00:00Z',
    actionUrl: 'organizations'
  },
  {
    notificationId: 'pnotif_004',
    title: 'Usage Limit Warning (92%)',
    message: 'Bole Medhanialem Commercial Center has reached 74/80 units (92.5% unit capacity). Consider upgrading to Business tier.',
    type: 'usage_limit_warning',
    organizationId: 'org_bole_plaza',
    organizationName: 'Bole Medhanialem Commercial Center',
    isRead: false,
    createdAt: '2026-08-25T10:15:00Z',
    actionUrl: 'organizations'
  }
];

export const DEFAULT_PLATFORM_SETTINGS: PlatformSettings = {
  general: {
    platformName: 'EPMS Cloud Platform',
    tagline: 'Multi-Tenant Commercial & Residential Property Management SaaS',
    supportEmail: 'support@epms.cloud.et',
    supportPhone: '+251 11 667 8900',
    defaultCurrency: 'ETB',
    timezone: 'Africa/Addis_Ababa (UTC+3)'
  },
  security: {
    sessionTimeoutMinutes: 60,
    requireMFAForAdmins: true,
    maxLoginAttempts: 5,
    passwordExpiryDays: 90,
    allowPasswordReset: true,
    ipAllowlist: ['197.156.103.0/24', '197.156.104.0/24']
  },
  emailSms: {
    senderName: 'EPMS Notifications',
    senderEmail: 'noreply@epms.cloud.et',
    smtpHost: 'smtp.sendgrid.net:587',
    smsGateway: 'EthioTelecom',
    smsSenderId: 'EPMS-ALERT',
    enableAutomatedReminders: true
  },
  maintenance: {
    isMaintenanceMode: false,
    maintenanceMessage: 'EPMS Platform is undergoing scheduled database indexing. Normal operations will resume shortly.',
    allowedIpAddresses: ['197.156.103.42']
  }
};
