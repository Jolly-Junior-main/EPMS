import { Tenant, Unit, Invoice, Payment, SMSLog, Property, UserProfile, MaintenanceRequest, LeaseRenewalRequest } from '../types/pms';

export const MOCK_USERS: Record<string, UserProfile> = {
  superadmin: {
    uid: 'usr_superadmin_000',
    name: 'Platform Super Administrator',
    email: 'superadmin@epms.cloud.et',
    role: 'super_admin',
    phone: '+251 91 000 0000',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    title: 'Chief Platform Operations & System Architect',
    organizationId: 'all',
    organizationName: 'EPMS Cloud Platform',
    complexAccess: ['all']
  },
  owner: {
    uid: 'usr_owner_001',
    name: 'Abebe Mengesha',
    email: 'abebe.mengesha@boleplaza.et',
    role: 'owner',
    phone: '+251 91 123 4567',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    title: 'Managing Director & Property Owner',
    organizationId: 'org_bole_plaza',
    organizationName: 'Bole Medhanialem Commercial Center',
    complexAccess: ['prop_bole_01', 'prop_kazanchis_02', 'prop_sarbet_03']
  },
  manager: {
    uid: 'usr_mgr_002',
    name: 'Hanna Tadesse',
    email: 'hanna.tadesse@boleplaza.et',
    role: 'manager',
    phone: '+251 91 234 5678',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    title: 'Senior Property Operations Manager',
    organizationId: 'org_bole_plaza',
    organizationName: 'Bole Medhanialem Commercial Center',
    complexAccess: ['prop_bole_01'],
    assignedPropertyId: 'prop_bole_01',
    assignedPropertyName: 'Bole Medhanialem Commercial Center'
  },
  admin: {
    uid: 'usr_admin_003',
    name: 'Dawit Alemu',
    email: 'dawit.alemu@sysadmin.et',
    role: 'admin',
    phone: '+251 91 345 6789',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    title: 'Lead Firebase Cloud Architect',
    organizationId: 'org_bole_plaza',
    organizationName: 'Bole Medhanialem Commercial Center',
    complexAccess: ['prop_bole_01', 'prop_kazanchis_02', 'prop_sarbet_03']
  },
  tenant: {
    uid: 'ten_001',
    name: 'Almaz Kebede',
    email: 'almaz.kebede@bolecafe.et',
    role: 'tenant',
    phone: '+251 91 123 4567',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    title: 'Tenant • Bole Coffee Roastery (G-01)',
    organizationId: 'org_bole_plaza',
    organizationName: 'Bole Medhanialem Commercial Center',
    complexAccess: ['prop_bole_01']
  }
};

export const MOCK_PROPERTIES: Property[] = [
  {
    propertyId: 'prop_bole_01',
    name: 'Bole Medhanialem Commercial Center',
    location: 'Cameroon St, Bole Sub-City, Addis Ababa',
    totalUnits: 28,
    type: 'commercial'
  },
  {
    propertyId: 'prop_kazanchis_02',
    name: 'Kazanchis Financial District Tower',
    location: 'Menelik II Ave, Kirkos Sub-City, Addis Ababa',
    totalUnits: 36,
    type: 'mixed_use'
  },
  {
    propertyId: 'prop_sarbet_03',
    name: 'Sarbet Heights Executive Residences',
    location: 'Roosevelt St, Old Airport / Sarbet, Addis Ababa',
    totalUnits: 16,
    type: 'residential'
  }
];

export const MOCK_UNITS: Unit[] = [
  // Bole Plaza
  {
    unitId: 'unit_bole_101',
    propertyId: 'prop_bole_01',
    propertyName: 'Bole Medhanialem Commercial Center',
    unitNumber: 'G-01 (Ground Floor Retail)',
    floor: 0,
    type: 'commercial_retail',
    areaSqMeters: 145,
    monthlyBaseRentETB: 125000,
    status: 'occupied',
    currentTenantId: 'ten_001'
  },
  {
    unitId: 'unit_bole_102',
    propertyId: 'prop_bole_01',
    propertyName: 'Bole Medhanialem Commercial Center',
    unitNumber: 'G-02 (Showroom & Cafe)',
    floor: 0,
    type: 'commercial_retail',
    areaSqMeters: 210,
    monthlyBaseRentETB: 180000,
    status: 'occupied',
    currentTenantId: 'ten_002'
  },
  {
    unitId: 'unit_bole_201',
    propertyId: 'prop_bole_01',
    propertyName: 'Bole Medhanialem Commercial Center',
    unitNumber: 'Suite 201 (Corporate Office)',
    floor: 2,
    type: 'commercial_office',
    areaSqMeters: 180,
    monthlyBaseRentETB: 145000,
    status: 'occupied',
    currentTenantId: 'ten_003'
  },
  {
    unitId: 'unit_bole_301',
    propertyId: 'prop_bole_01',
    propertyName: 'Bole Medhanialem Commercial Center',
    unitNumber: 'Suite 301 (Tech Hub Office)',
    floor: 3,
    type: 'commercial_office',
    areaSqMeters: 260,
    monthlyBaseRentETB: 210000,
    status: 'occupied',
    currentTenantId: 'ten_004'
  },
  {
    unitId: 'unit_bole_401',
    propertyId: 'prop_bole_01',
    propertyName: 'Bole Medhanialem Commercial Center',
    unitNumber: 'Suite 401 (Consultancy Firm)',
    floor: 4,
    type: 'commercial_office',
    areaSqMeters: 110,
    monthlyBaseRentETB: 95000,
    status: 'occupied',
    currentTenantId: 'ten_005'
  },
  {
    unitId: 'unit_bole_402',
    propertyId: 'prop_bole_01',
    propertyName: 'Bole Medhanialem Commercial Center',
    unitNumber: 'Suite 402 (Vacant Prime Office)',
    floor: 4,
    type: 'commercial_office',
    areaSqMeters: 130,
    monthlyBaseRentETB: 110000,
    status: 'vacant'
  },
  // Kazanchis Tower
  {
    unitId: 'unit_kaz_101',
    propertyId: 'prop_kazanchis_02',
    propertyName: 'Kazanchis Financial District Tower',
    unitNumber: 'Tower Suite 501 (Law Offices)',
    floor: 5,
    type: 'commercial_office',
    areaSqMeters: 195,
    monthlyBaseRentETB: 165000,
    status: 'occupied',
    currentTenantId: 'ten_006'
  },
  {
    unitId: 'unit_kaz_201',
    propertyId: 'prop_kazanchis_02',
    propertyName: 'Kazanchis Financial District Tower',
    unitNumber: 'Tower Suite 601 (Import/Export HQ)',
    floor: 6,
    type: 'commercial_office',
    areaSqMeters: 230,
    monthlyBaseRentETB: 195000,
    status: 'occupied',
    currentTenantId: 'ten_007'
  },
  // Sarbet Heights
  {
    unitId: 'unit_sar_101',
    propertyId: 'prop_sarbet_03',
    propertyName: 'Sarbet Heights Executive Residences',
    unitNumber: 'Apt 3A (3-Bedroom Luxury)',
    floor: 3,
    type: 'residential_apartment',
    areaSqMeters: 165,
    monthlyBaseRentETB: 85000,
    status: 'occupied',
    currentTenantId: 'ten_008'
  },
  {
    unitId: 'unit_sar_201',
    propertyId: 'prop_sarbet_03',
    propertyName: 'Sarbet Heights Executive Residences',
    unitNumber: 'Penthouse PH-1 (Duplex Suite)',
    floor: 7,
    type: 'residential_penthouse',
    areaSqMeters: 310,
    monthlyBaseRentETB: 240000,
    status: 'occupied',
    currentTenantId: 'ten_009'
  }
];

// Helper to generate SVG bank receipts for realistic zoomable inspection
export function generateBankReceiptSvg(opts: {
  bankName: string;
  payerName: string;
  amountETB: number;
  refNumber: string;
  date: string;
  paymentType: string;
  roomNumber: string;
  isVerified?: boolean;
}): string {
  const formattedAmount = opts.amountETB.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const themeColor = opts.bankName.includes('CBE')
    ? '#6B21A8'
    : opts.bankName.includes('telebirr')
    ? '#0284C7'
    : opts.bankName.includes('Awash')
    ? '#047857'
    : opts.bankName.includes('Dashen')
    ? '#1E40AF'
    : '#B45309';

  const svg = `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 1050" width="800" height="1050" style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #ffffff;">
    <defs>
      <pattern id="security-pattern" width="40" height="40" patternUnits="userSpaceOnUse">
        <path d="M 0,20 l 20,-20 M 20,40 l 20,-20" stroke="#f1f5f9" stroke-width="1"/>
      </pattern>
      <linearGradient id="header-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${themeColor}"/>
        <stop offset="100%" stop-color="#0f172a"/>
      </linearGradient>
    </defs>
    
    <!-- Background and Border -->
    <rect width="800" height="1050" fill="#fafafa"/>
    <rect x="25" y="25" width="750" height="1000" rx="16" fill="#ffffff" stroke="#e2e8f0" stroke-width="2"/>
    <rect x="30" y="30" width="740" height="990" fill="url(#security-pattern)" opacity="0.4"/>
    
    <!-- Bank Header -->
    <rect x="25" y="25" width="750" height="150" rx="16" fill="url(#header-grad)"/>
    <text x="60" y="80" fill="#ffffff" font-size="28" font-weight="800" letter-spacing="1">${opts.bankName.toUpperCase()}</text>
    <text x="60" y="115" fill="#93c5fd" font-size="14" font-weight="600">ELECTRONIC FUNDS TRANSFER ADVICE &amp; DEPOSIT RECEIPT</text>
    <text x="60" y="145" fill="#cbd5e1" font-size="12">National Switch Clearance Ref: ETB-NPS-${opts.refNumber}</text>

    <g transform="translate(620, 50)">
      <rect width="110" height="100" rx="8" fill="#ffffff" opacity="0.15"/>
      <text x="55" y="45" fill="#ffffff" font-size="11" text-anchor="middle" font-weight="600">OFFICIAL</text>
      <text x="55" y="65" fill="#38bdf8" font-size="12" text-anchor="middle" font-weight="700">STAMP</text>
      <circle cx="55" cy="55" r="40" fill="none" stroke="#38bdf8" stroke-width="2" stroke-dasharray="4,2"/>
    </g>

    <!-- Amount Badge -->
    <rect x="60" y="205" width="680" height="110" rx="12" fill="#f8fafc" stroke="#e2e8f0" stroke-width="1.5"/>
    <text x="90" y="245" fill="#64748b" font-size="13" font-weight="600" text-transform="uppercase">Total Amount Transferred</text>
    <text x="90" y="290" fill="#0f172a" font-size="34" font-weight="800">${formattedAmount} <tspan font-size="20" fill="${themeColor}">ETB</tspan></text>
    <text x="560" y="265" fill="#059669" font-size="14" font-weight="700">● SUCCESS</text>
    <text x="560" y="290" fill="#64748b" font-size="11">Direct Core Credit</text>

    <!-- Details Grid -->
    <g transform="translate(60, 340)">
      <line x1="0" y1="0" x2="680" y2="0" stroke="#e2e8f0" stroke-width="1.5"/>
      
      <!-- Row 1 -->
      <text x="0" y="35" fill="#64748b" font-size="12" font-weight="600">TRANSACTION REFERENCE</text>
      <text x="0" y="60" fill="#0f172a" font-size="16" font-weight="700" font-family="monospace">${opts.refNumber}</text>

      <text x="360" y="35" fill="#64748b" font-size="12" font-weight="600">TRANSACTION DATE &amp; TIME</text>
      <text x="360" y="60" fill="#0f172a" font-size="15" font-weight="600">${opts.date}</text>

      <line x1="0" y1="90" x2="680" y2="90" stroke="#f1f5f9" stroke-width="1"/>

      <!-- Row 2 -->
      <text x="0" y="125" fill="#64748b" font-size="12" font-weight="600">DEPOSITED BY (TENANT / ENTITY)</text>
      <text x="0" y="150" fill="#0f172a" font-size="16" font-weight="700">${opts.payerName}</text>

      <text x="360" y="125" fill="#64748b" font-size="12" font-weight="600">PAYMENT CHANNEL</text>
      <text x="360" y="150" fill="#0f172a" font-size="15" font-weight="600">${opts.paymentType}</text>

      <line x1="0" y1="180" x2="680" y2="180" stroke="#f1f5f9" stroke-width="1"/>

      <!-- Row 3 -->
      <text x="0" y="215" fill="#64748b" font-size="12" font-weight="600">BENEFICIARY ACCOUNT</text>
      <text x="0" y="240" fill="#0f172a" font-size="15" font-weight="700">BOLE MEDHANIALEM PLAZA ESCROW ACC: 1000-4892-3321</text>

      <text x="0" y="285" fill="#64748b" font-size="12" font-weight="600">PAYMENT PURPOSE / ROOM REMARKS</text>
      <text x="0" y="310" fill="#0369a1" font-size="15" font-weight="700">Rent Payment for ${opts.roomNumber}</text>

      <line x1="0" y1="340" x2="680" y2="340" stroke="#e2e8f0" stroke-width="1.5"/>
    </g>

    <!-- Watermark Stamp -->
    <g transform="translate(480, 720) rotate(-15)">
      <rect width="240" height="90" rx="8" fill="none" stroke="${themeColor}" stroke-width="3" stroke-dasharray="6,4"/>
      <text x="120" y="35" fill="${themeColor}" font-size="15" font-weight="900" text-anchor="middle" letter-spacing="2">PAYMENT PROCESSED</text>
      <text x="120" y="58" fill="${themeColor}" font-size="11" font-weight="700" text-anchor="middle">AUTHENTICATED BANK SLIP</text>
      <text x="120" y="78" fill="${themeColor}" font-size="10" font-weight="600" text-anchor="middle">ADDIS ABABA CLEARING</text>
    </g>

    <!-- Verification status footer in receipt -->
    <g transform="translate(60, 880)">
      <rect width="680" height="70" rx="8" fill="#f1f5f9"/>
      <text x="20" y="32" fill="#475569" font-size="12" font-weight="600">Property Management Cloud Verification Engine • Storage Path: gs://enterprise-pms-et.appspot.com/receipts/${opts.refNumber}.png</text>
      <text x="20" y="52" fill="#64748b" font-size="11">Audit hash: sha256:7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069</text>
    </g>
  </svg>
  `;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

export const MOCK_TENANTS: Tenant[] = [
  {
    tenantId: 'ten_001',
    legalName: 'Abyssinia Specialty Coffee Exporters PLC',
    businessTradeName: 'Abyssinia Roast & Cafe',
    phone: '+251911445566',
    email: 'finance@abyssiniacoffee.com',
    assignedUnitId: 'unit_bole_101',
    propertyId: 'prop_bole_01',
    leaseStartDate: '2025-01-01',
    leaseEndDate: '2027-12-31',
    status: 'active',
    monthlyRentETB: 125000,
    securityDepositETB: 375000,
    tinNumber: '0098421458',
    contactPerson: 'Kassahun Belay',
    emergencyContact: '+251911998877',
    notes: 'Premium commercial tenant. Monthly rent due on 1st of every month.',
    documents: [
      {
        docId: 'doc_01_lease',
        name: 'Master Lease Agreement 2025-2027.pdf',
        type: 'lease_agreement',
        storagePath: 'tenants/ten_001/documents/lease_2025.pdf',
        downloadUrl: '#',
        uploadedAt: '2025-01-02T10:00:00Z',
        sizeBytes: 2450000,
        mimeType: 'application/pdf'
      },
      {
        docId: 'doc_01_tin',
        name: 'TIN & Ministry of Trade License.pdf',
        type: 'tax_registration',
        storagePath: 'tenants/ten_001/documents/tin_license.pdf',
        downloadUrl: '#',
        uploadedAt: '2025-01-02T10:15:00Z',
        sizeBytes: 1120000,
        mimeType: 'application/pdf'
      }
    ],
    createdAt: '2025-01-01T08:00:00Z'
  },
  {
    tenantId: 'ten_002',
    legalName: 'Zemen Digital Systems & Electronics Share Co.',
    businessTradeName: 'Zemen Tech Showroom',
    phone: '+251912556677',
    email: 'operations@zementechnologies.et',
    assignedUnitId: 'unit_bole_102',
    propertyId: 'prop_bole_01',
    leaseStartDate: '2024-06-01',
    leaseEndDate: '2026-08-31',
    status: 'pending_renewal',
    monthlyRentETB: 180000,
    securityDepositETB: 540000,
    tinNumber: '0012398451',
    contactPerson: 'Selamawit Kebede',
    emergencyContact: '+251911223344',
    notes: 'Lease expiring in August 2026. Management has issued renewal terms.',
    documents: [
      {
        docId: 'doc_02_lease',
        name: 'Signed Lease 2024-2026.pdf',
        type: 'lease_agreement',
        storagePath: 'tenants/ten_002/documents/lease_2024.pdf',
        downloadUrl: '#',
        uploadedAt: '2024-06-01T09:00:00Z',
        sizeBytes: 3100000,
        mimeType: 'application/pdf'
      }
    ],
    createdAt: '2024-06-01T08:00:00Z'
  },
  {
    tenantId: 'ten_003',
    legalName: 'Horn of Africa Logistics & Freight Corp',
    businessTradeName: 'HOA Logistics',
    phone: '+251913667788',
    email: 'accounts@hoalogistics.et',
    assignedUnitId: 'unit_bole_201',
    propertyId: 'prop_bole_01',
    leaseStartDate: '2024-01-01',
    leaseEndDate: '2026-12-31',
    status: 'delinquent',
    monthlyRentETB: 145000,
    securityDepositETB: 435000,
    tinNumber: '0087612349',
    contactPerson: 'Yared Getachew',
    emergencyContact: '+251911887766',
    notes: 'Severely overdue rent for June, July, and August 2026. Placed on Red List.',
    documents: [
      {
        docId: 'doc_03_lease',
        name: 'Office Lease Suite 201.pdf',
        type: 'lease_agreement',
        storagePath: 'tenants/ten_003/documents/lease.pdf',
        downloadUrl: '#',
        uploadedAt: '2024-01-05T11:00:00Z',
        sizeBytes: 1980000,
        mimeType: 'application/pdf'
      }
    ],
    createdAt: '2024-01-01T08:00:00Z'
  },
  {
    tenantId: 'ten_004',
    legalName: 'Apex Cloud Solutions Africa',
    businessTradeName: 'Apex Labs',
    phone: '+251914778899',
    email: 'billing@apexcloud.africa',
    assignedUnitId: 'unit_bole_301',
    propertyId: 'prop_bole_01',
    leaseStartDate: '2025-03-01',
    leaseEndDate: '2027-02-28',
    status: 'active',
    monthlyRentETB: 210000,
    securityDepositETB: 630000,
    tinNumber: '0034567890',
    contactPerson: 'Bisrat Worku',
    emergencyContact: '+251911334455',
    notes: 'Prompt payer. Quarterly billing frequency.',
    documents: [],
    createdAt: '2025-03-01T08:00:00Z'
  },
  {
    tenantId: 'ten_005',
    legalName: 'Blue Nile Advisory Partners LLP',
    businessTradeName: 'Blue Nile Advisory',
    phone: '+251915889900',
    email: 'contact@bluenileadvisory.et',
    assignedUnitId: 'unit_bole_401',
    propertyId: 'prop_bole_01',
    leaseStartDate: '2024-09-01',
    leaseEndDate: '2026-08-31',
    status: 'delinquent',
    monthlyRentETB: 95000,
    securityDepositETB: 285000,
    tinNumber: '0056789012',
    contactPerson: 'Ephrem Assefa',
    emergencyContact: '+251911443322',
    notes: 'Delinquent since July 2026. Issued formal SMS notice.',
    documents: [],
    createdAt: '2024-09-01T08:00:00Z'
  },
  {
    tenantId: 'ten_006',
    legalName: 'Tewodros & Associates Legal Practitioners',
    businessTradeName: 'Tewodros Law',
    phone: '+251916990011',
    email: 'info@tewodroslaw.et',
    assignedUnitId: 'unit_kaz_101',
    propertyId: 'prop_kazanchis_02',
    leaseStartDate: '2023-11-01',
    leaseEndDate: '2026-10-31',
    status: 'active',
    monthlyRentETB: 165000,
    securityDepositETB: 495000,
    tinNumber: '0078901234',
    contactPerson: 'Adv. Tewodros Haile',
    documents: [],
    createdAt: '2023-11-01T08:00:00Z'
  },
  {
    tenantId: 'ten_007',
    legalName: 'Addis Global Commodities Trading PLC',
    businessTradeName: 'Addis Global',
    phone: '+251917001122',
    email: 'treasury@addisglobaltrade.com',
    assignedUnitId: 'unit_kaz_201',
    propertyId: 'prop_kazanchis_02',
    leaseStartDate: '2024-04-01',
    leaseEndDate: '2027-03-31',
    status: 'active',
    monthlyRentETB: 195000,
    securityDepositETB: 585000,
    tinNumber: '0089012345',
    contactPerson: 'Solomon Teshome',
    documents: [],
    createdAt: '2024-04-01T08:00:00Z'
  },
  {
    tenantId: 'ten_008',
    legalName: 'Dr. Almaz Bekele',
    phone: '+251918112233',
    email: 'almaz.bekele@unicef.org',
    assignedUnitId: 'unit_sar_101',
    propertyId: 'prop_sarbet_03',
    leaseStartDate: '2025-02-01',
    leaseEndDate: '2027-01-31',
    status: 'active',
    monthlyRentETB: 85000,
    securityDepositETB: 170000,
    contactPerson: 'Dr. Almaz Bekele',
    documents: [],
    createdAt: '2025-02-01T08:00:00Z'
  },
  {
    tenantId: 'ten_009',
    legalName: 'Ambassador Jean-Luc Dubois (Embassy Residence)',
    phone: '+251919223344',
    email: 'jldubois@diplomatie.gouv.fr',
    assignedUnitId: 'unit_sar_201',
    propertyId: 'prop_sarbet_03',
    leaseStartDate: '2024-01-01',
    leaseEndDate: '2027-12-31',
    status: 'active',
    monthlyRentETB: 240000,
    securityDepositETB: 720000,
    contactPerson: 'Attache Pierre Martin',
    documents: [],
    createdAt: '2024-01-01T08:00:00Z'
  }
];

// Helper to construct realistic dates around current local time (Aug 2026)
export const MOCK_INVOICES: Invoice[] = [
  // 1. Submitted for verification (For Owner Verification Vault!)
  {
    invoiceId: 'inv_2026_08_001',
    invoiceNumber: 'INV-2026-08-001',
    unitId: 'unit_bole_101',
    tenantId: 'ten_001',
    propertyId: 'prop_bole_01',
    amountDue: 125000,
    dueDate: '2026-08-15T00:00:00Z',
    issuedDate: '2026-08-01T00:00:00Z',
    billingFrequency: 'monthly',
    paymentStatus: 'submitted_for_verification',
    billingPeriod: 'August 2026',
    description: 'Monthly Commercial Rent - Ground Floor Retail (G-01)',
    paymentId: 'pay_2026_001'
  },
  {
    invoiceId: 'inv_2026_08_002',
    invoiceNumber: 'INV-2026-08-002',
    unitId: 'unit_kaz_101',
    tenantId: 'ten_006',
    propertyId: 'prop_kazanchis_02',
    amountDue: 165000,
    dueDate: '2026-08-14T00:00:00Z',
    issuedDate: '2026-08-01T00:00:00Z',
    billingFrequency: 'monthly',
    paymentStatus: 'submitted_for_verification',
    billingPeriod: 'August 2026',
    description: 'Monthly Office Rent - Tower Suite 501',
    paymentId: 'pay_2026_002'
  },
  {
    invoiceId: 'inv_2026_08_003',
    invoiceNumber: 'INV-2026-08-003',
    unitId: 'unit_sar_201',
    tenantId: 'ten_009',
    propertyId: 'prop_sarbet_03',
    amountDue: 240000,
    dueDate: '2026-08-10T00:00:00Z',
    issuedDate: '2026-08-01T00:00:00Z',
    billingFrequency: 'monthly',
    paymentStatus: 'submitted_for_verification',
    billingPeriod: 'August 2026',
    description: 'Executive Penthouse Rent - PH-1',
    paymentId: 'pay_2026_003'
  },

  // 2. Pending Invoices (Upcoming - Triggers SMS Engine 7-day and due-today queries)
  // Due in 7 days (August 21, 2026) -> triggers Query 1 in SMS engine!
  {
    invoiceId: 'inv_2026_08_004',
    invoiceNumber: 'INV-2026-08-004',
    unitId: 'unit_bole_102',
    tenantId: 'ten_002',
    propertyId: 'prop_bole_01',
    amountDue: 180000,
    dueDate: '2026-08-21T00:00:00Z', // Today is Aug 14, 2026 -> Exactly +7 days!
    issuedDate: '2026-08-01T00:00:00Z',
    billingFrequency: 'monthly',
    paymentStatus: 'pending',
    billingPeriod: 'August 2026',
    description: 'Monthly Commercial Showroom Rent - G-02'
  },
  // Due today (August 14, 2026) -> triggers Query 2 in SMS engine!
  {
    invoiceId: 'inv_2026_08_005',
    invoiceNumber: 'INV-2026-08-005',
    unitId: 'unit_sar_101',
    tenantId: 'ten_008',
    propertyId: 'prop_sarbet_03',
    amountDue: 85000,
    dueDate: '2026-08-14T00:00:00Z', // Due today!
    issuedDate: '2026-08-01T00:00:00Z',
    billingFrequency: 'monthly',
    paymentStatus: 'pending',
    billingPeriod: 'August 2026',
    description: 'Residential Apartment Rent - Apt 3A'
  },
  // Due in 10 days
  {
    invoiceId: 'inv_2026_08_006',
    invoiceNumber: 'INV-2026-08-006',
    unitId: 'unit_kaz_201',
    tenantId: 'ten_007',
    propertyId: 'prop_kazanchis_02',
    amountDue: 195000,
    dueDate: '2026-08-24T00:00:00Z',
    issuedDate: '2026-08-01T00:00:00Z',
    billingFrequency: 'monthly',
    paymentStatus: 'pending',
    billingPeriod: 'August 2026',
    description: 'HQ Office Rent - Tower Suite 601'
  },

  // 3. Delinquent Invoices (The Red List!)
  {
    invoiceId: 'inv_2026_06_001',
    invoiceNumber: 'INV-2026-06-001',
    unitId: 'unit_bole_201',
    tenantId: 'ten_003',
    propertyId: 'prop_bole_01',
    amountDue: 145000,
    dueDate: '2026-06-15T00:00:00Z', // 60 days overdue
    issuedDate: '2026-06-01T00:00:00Z',
    billingFrequency: 'monthly',
    paymentStatus: 'delinquent',
    billingPeriod: 'June 2026',
    description: 'Overdue Commercial Rent - Suite 201',
    lateFeeApplied: 7250
  },
  {
    invoiceId: 'inv_2026_07_001',
    invoiceNumber: 'INV-2026-07-001',
    unitId: 'unit_bole_201',
    tenantId: 'ten_003',
    propertyId: 'prop_bole_01',
    amountDue: 145000,
    dueDate: '2026-07-15T00:00:00Z', // 30 days overdue
    issuedDate: '2026-07-01T00:00:00Z',
    billingFrequency: 'monthly',
    paymentStatus: 'delinquent',
    billingPeriod: 'July 2026',
    description: 'Overdue Commercial Rent - Suite 201',
    lateFeeApplied: 7250
  },
  {
    invoiceId: 'inv_2026_07_002',
    invoiceNumber: 'INV-2026-07-002',
    unitId: 'unit_bole_401',
    tenantId: 'ten_005',
    propertyId: 'prop_bole_01',
    amountDue: 95000,
    dueDate: '2026-07-10T00:00:00Z', // 35 days overdue
    issuedDate: '2026-07-01T00:00:00Z',
    billingFrequency: 'monthly',
    paymentStatus: 'delinquent',
    billingPeriod: 'July 2026',
    description: 'Overdue Office Rent - Suite 401',
    lateFeeApplied: 4750
  },

  // 4. Paid Invoices (Historical & Verified)
  {
    invoiceId: 'inv_2026_07_003',
    invoiceNumber: 'INV-2026-07-003',
    unitId: 'unit_bole_301',
    tenantId: 'ten_004',
    propertyId: 'prop_bole_01',
    amountDue: 210000,
    dueDate: '2026-07-15T00:00:00Z',
    issuedDate: '2026-07-01T00:00:00Z',
    billingFrequency: 'monthly',
    paymentStatus: 'paid',
    billingPeriod: 'July 2026',
    description: 'Monthly Tech Hub Office Rent',
    paidAt: '2026-07-12T14:30:00Z',
    paymentId: 'pay_2026_004'
  },
  {
    invoiceId: 'inv_2026_07_004',
    invoiceNumber: 'INV-2026-07-004',
    unitId: 'unit_sar_201',
    tenantId: 'ten_009',
    propertyId: 'prop_sarbet_03',
    amountDue: 240000,
    dueDate: '2026-07-10T00:00:00Z',
    issuedDate: '2026-07-01T00:00:00Z',
    billingFrequency: 'monthly',
    paymentStatus: 'paid',
    billingPeriod: 'July 2026',
    description: 'Executive Penthouse Rent',
    paidAt: '2026-07-08T09:15:00Z',
    paymentId: 'pay_2026_005'
  }
];

export const MOCK_PAYMENTS: Payment[] = [
  {
    paymentId: 'pay_2026_001',
    invoiceId: 'inv_2026_08_001',
    tenantId: 'ten_001',
    unitId: 'unit_bole_101',
    amountPaid: 125000,
    paymentMethod: 'cbe_birr',
    referenceNumber: 'CBE-FT-89241902',
    receiptImageUrl: generateBankReceiptSvg({
      bankName: 'Commercial Bank of Ethiopia (CBE)',
      payerName: 'Abyssinia Specialty Coffee Exporters PLC',
      amountETB: 125000,
      refNumber: 'CBE-FT-89241902',
      date: '2026-08-13 11:24:18 EAT',
      paymentType: 'CBE Birr / Direct Transfer',
      roomNumber: 'G-01 (Bole Medhanialem Commercial Center)'
    }),
    submittedBy: 'Hanna Tadesse (Manager)',
    submittedAt: '2026-08-13T12:00:00Z',
    verificationStatus: 'unverified',
    notes: 'Tenant sent CBE confirmation screenshot. Deposited directly to main escrow account.'
  },
  {
    paymentId: 'pay_2026_002',
    invoiceId: 'inv_2026_08_002',
    tenantId: 'ten_006',
    unitId: 'unit_kaz_101',
    amountPaid: 165000,
    paymentMethod: 'awash_bank',
    referenceNumber: 'AWASH-TX-901844',
    receiptImageUrl: generateBankReceiptSvg({
      bankName: 'Awash International Bank S.C.',
      payerName: 'Tewodros & Associates Legal Practitioners',
      amountETB: 165000,
      refNumber: 'AWASH-TX-901844',
      date: '2026-08-13 15:40:02 EAT',
      paymentType: 'Awash Online RTGS Transfer',
      roomNumber: 'Suite 501 (Kazanchis Financial Tower)'
    }),
    submittedBy: 'Hanna Tadesse (Manager)',
    submittedAt: '2026-08-13T16:10:00Z',
    verificationStatus: 'unverified',
    notes: 'Awash RTGS confirmation slip checked against bank statement.'
  },
  {
    paymentId: 'pay_2026_003',
    invoiceId: 'inv_2026_08_003',
    tenantId: 'ten_009',
    unitId: 'unit_sar_201',
    amountPaid: 240000,
    paymentMethod: 'bank_of_abyssinia',
    referenceNumber: 'BOA-CORP-441092',
    receiptImageUrl: generateBankReceiptSvg({
      bankName: 'Bank of Abyssinia (BOA)',
      payerName: 'Embassy Residence / Pierre Martin',
      amountETB: 240000,
      refNumber: 'BOA-CORP-441092',
      date: '2026-08-12 09:30:11 EAT',
      paymentType: 'Diplomatic Mission Account Clearing',
      roomNumber: 'Penthouse PH-1 (Sarbet Heights)'
    }),
    submittedBy: 'Hanna Tadesse (Manager)',
    submittedAt: '2026-08-12T10:00:00Z',
    verificationStatus: 'unverified',
    notes: 'Diplomatic rental voucher and BOA swift copy.'
  },
  {
    paymentId: 'pay_2026_004',
    invoiceId: 'inv_2026_07_003',
    tenantId: 'ten_004',
    unitId: 'unit_bole_301',
    amountPaid: 210000,
    paymentMethod: 'dashen_bank',
    referenceNumber: 'DASH-Amole-77312',
    receiptImageUrl: generateBankReceiptSvg({
      bankName: 'Dashen Bank / Amole Corporate',
      payerName: 'Apex Cloud Solutions Africa',
      amountETB: 210000,
      refNumber: 'DASH-Amole-77312',
      date: '2026-07-12 14:28:00 EAT',
      paymentType: 'Corporate EFT Transfer',
      roomNumber: 'Suite 301 (Bole Medhanialem Commercial Center)',
      isVerified: true
    }),
    submittedBy: 'Hanna Tadesse (Manager)',
    submittedAt: '2026-07-12T14:35:00Z',
    verificationStatus: 'verified',
    verifiedBy: 'Abebe Mengesha (Owner)',
    verifiedAt: '2026-07-12T16:00:00Z',
    notes: 'Approved and reconciled with bank deposit.'
  },
  {
    paymentId: 'pay_2026_005',
    invoiceId: 'inv_2026_07_004',
    tenantId: 'ten_009',
    unitId: 'unit_sar_201',
    amountPaid: 240000,
    paymentMethod: 'telebirr',
    referenceNumber: 'TB-MERCHANT-99824',
    receiptImageUrl: generateBankReceiptSvg({
      bankName: 'Telebirr SuperApp Pay',
      payerName: 'Jean-Luc Dubois',
      amountETB: 240000,
      refNumber: 'TB-MERCHANT-99824',
      date: '2026-07-08 09:12:00 EAT',
      paymentType: 'Telebirr QR Pay',
      roomNumber: 'Penthouse PH-1 (Sarbet Heights)',
      isVerified: true
    }),
    submittedBy: 'Hanna Tadesse (Manager)',
    submittedAt: '2026-07-08T09:20:00Z',
    verificationStatus: 'verified',
    verifiedBy: 'Abebe Mengesha (Owner)',
    verifiedAt: '2026-07-08T10:00:00Z',
    notes: 'Telebirr merchant notification validated.'
  }
];

export const MOCK_SMS_LOGS: SMSLog[] = [
  {
    id: 'sms_log_001',
    recipientPhone: '+251912556677',
    recipientName: 'Zemen Digital Systems',
    tenantId: 'ten_002',
    unitNumber: 'G-02',
    invoiceId: 'inv_2026_08_004',
    amountETB: 180000,
    dueDate: '2026-08-21',
    messageType: '7_day_reminder',
    messageText: 'Dear Zemen Digital Systems, this is a friendly reminder from management that your rent for G-02 (Showroom & Cafe) is due in 7 days on 2026-08-21. Amount Due: 180,000.00 ETB. Thank you.',
    gateway: 'EthioTelecom_REST',
    status: 'delivered',
    dispatchedAt: '2026-08-14T08:00:12Z',
    httpStatusCode: 200,
    gatewayMessageId: 'ETH-SMS-992014-OK'
  },
  {
    id: 'sms_log_002',
    recipientPhone: '+251918112233',
    recipientName: 'Dr. Almaz Bekele',
    tenantId: 'ten_008',
    unitNumber: 'Apt 3A',
    invoiceId: 'inv_2026_08_005',
    amountETB: 85000,
    dueDate: '2026-08-14',
    messageType: 'due_today_reminder',
    messageText: 'Dear Dr. Almaz Bekele, your rent for Apt 3A (3-Bedroom Luxury) is due today, 2026-08-14. Please clear the balance of 85,000.00 ETB to prevent account delinquency and late fees.',
    gateway: 'Twilio',
    status: 'delivered',
    dispatchedAt: '2026-08-14T08:00:15Z',
    httpStatusCode: 201,
    gatewayMessageId: 'SM99a8b7c6d5e4f3a2b1c0'
  },
  {
    id: 'sms_log_003',
    recipientPhone: '+251913667788',
    recipientName: 'Horn of Africa Logistics',
    tenantId: 'ten_003',
    unitNumber: 'Suite 201',
    invoiceId: 'inv_2026_07_001',
    amountETB: 145000,
    dueDate: '2026-07-15',
    messageType: 'delinquency_notice',
    messageText: 'URGENT LEGAL NOTICE: Dear Horn of Africa Logistics, your rent for Suite 201 is 30 days overdue. Outstanding: 145,000.00 ETB + Late Fee. Please remit immediately to prevent lease termination.',
    gateway: 'EthioTelecom_REST',
    status: 'delivered',
    dispatchedAt: '2026-08-13T14:30:00Z',
    httpStatusCode: 200,
    gatewayMessageId: 'ETH-SMS-984420-OK'
  }
];

export const MOCK_MAINTENANCE_REQUESTS: MaintenanceRequest[] = [
  {
    requestId: 'maint_001',
    ticketNumber: 'TKT-2026-089',
    tenantId: 'ten_001',
    tenantName: 'Almaz Kebede (Bole Coffee Roastery)',
    unitId: 'unit_bole_101',
    unitNumber: 'G-01',
    propertyId: 'prop_bole_01',
    category: 'plumbing',
    priority: 'high',
    status: 'in_progress',
    title: 'Espresso Bar Water Line Pressure Regulator Leak',
    description: 'Main incoming high-pressure water valve supplying commercial espresso machines has a pinhole leak causing low bar pressure.',
    reportedDate: '2026-08-16T09:30:00Z',
    estimatedCostETB: 12500,
    assignedTechnician: 'Kassahun Worku (Master Plumber)',
    technicianPhone: '+251 91 555 1234',
    scheduledDate: '2026-08-18T10:00:00Z'
  },
  {
    requestId: 'maint_002',
    ticketNumber: 'TKT-2026-092',
    tenantId: 'ten_004',
    tenantName: 'Afro-Nile Trading PLC',
    unitId: 'unit_kaz_301',
    unitNumber: 'Suite 301',
    propertyId: 'prop_kazanchis_02',
    category: 'hvac',
    priority: 'medium',
    status: 'scheduled',
    title: 'Server Room Central AC Filter Replacement & Thermostat Calibration',
    description: 'Room temperature drifting above 24°C during peak afternoon sun hours. Requires diagnostic of condenser fan.',
    reportedDate: '2026-08-17T14:15:00Z',
    estimatedCostETB: 8000,
    assignedTechnician: 'Yonas Getachew (HVAC Specialist)',
    technicianPhone: '+251 91 666 4321',
    scheduledDate: '2026-08-19T14:00:00Z'
  },
  {
    requestId: 'maint_003',
    ticketNumber: 'TKT-2026-095',
    tenantId: 'ten_008',
    tenantName: 'Dr. Almaz Bekele',
    unitId: 'unit_sar_301',
    unitNumber: 'Apt 3A',
    propertyId: 'prop_sarbet_03',
    category: 'electrical',
    priority: 'low',
    status: 'completed',
    title: 'Master Bedroom Smart Dimmer Switch Intermittent Flicker',
    description: 'LED recessed lighting flickers when dimming below 30% intensity.',
    reportedDate: '2026-08-12T11:00:00Z',
    completedDate: '2026-08-14T16:00:00Z',
    assignedTechnician: 'Mulugeta Tsegaye (Electrician)',
    technicianPhone: '+251 91 777 9876',
    estimatedCostETB: 3500,
    resolutionNotes: 'Replaced neutral-wire trailing-edge dimmer module with compatible phase-cut driver. Tested 100% stable.'
  }
];

export const MOCK_RENEWAL_REQUESTS: LeaseRenewalRequest[] = [
  {
    requestId: 'ren_001',
    tenantId: 'ten_001',
    tenantName: 'Almaz Kebede (Bole Coffee Roastery)',
    unitNumber: 'G-01',
    currentLeaseEndDate: '2027-01-31',
    requestedExtensionMonths: 24,
    notes: 'Requesting 2-year commercial lease extension with standard 5% escalation cap.',
    status: 'pending',
    submittedAt: '2026-08-15T10:00:00Z'
  }
];
