import {
  Tenant,
  Unit,
  Invoice,
  Payment,
  SMSLog,
  Property,
  UserProfile,
  MaintenanceRequest,
  LeaseRenewalRequest,
  ClientBrandTheme
} from '../types/pms';

// ============================================================================
// CLIENT BRAND THEMES & LOGO SPECIFICATIONS FOR THE 4 EPMS CLIENTS
// ============================================================================
export const CLIENT_THEMES: Record<string, ClientBrandTheme> = {
  org_bole_plaza: {
    organizationId: 'org_bole_plaza',
    organizationName: 'Bole Medhanialem Commercial Plaza PLC',
    propertyName: 'Bole Medhanialem Commercial Center',
    propertyId: 'prop_bole_01',
    primaryColor: '#007AFF',
    accentColor: '#5856D6',
    gradientClass: 'from-[#007AFF] to-[#5856D6]',
    badgeBgClass: 'bg-[#007AFF]/10',
    badgeTextClass: 'text-[#007AFF]',
    badgeBorderClass: 'border-[#007AFF]/20',
    lightBgClass: 'bg-blue-50/60',
    logoIconName: 'Store',
    tagline: 'Premier Retail Plaza & Corporate Suites',
    citySubcity: 'Cameroon St, Bole Sub-City, Addis Ababa',
    escrowAccount: 'BOLE MEDHANIALEM PLAZA ESCROW ACC: 1000-4892-3321'
  },
  org_kazanchis_towers: {
    organizationId: 'org_kazanchis_towers',
    organizationName: 'Kazanchis Business Towers S.C.',
    propertyName: 'Kazanchis Financial & Executive Tower',
    propertyId: 'prop_kazanchis_02',
    primaryColor: '#059669',
    accentColor: '#10B981',
    gradientClass: 'from-[#059669] to-[#047857]',
    badgeBgClass: 'bg-[#059669]/10',
    badgeTextClass: 'text-[#059669]',
    badgeBorderClass: 'border-[#059669]/20',
    lightBgClass: 'bg-emerald-50/60',
    logoIconName: 'Building2',
    tagline: 'Executive Financial & Legal Chambers Tower',
    citySubcity: 'Menelik II Ave, Kirkos Sub-City, Addis Ababa',
    escrowAccount: 'KAZANCHIS BUSINESS TOWERS ACC: 1000-7782-9901'
  },
  org_sarbet_mall: {
    organizationId: 'org_sarbet_mall',
    organizationName: 'Sarbet Luxury Mall Real Estate PLC',
    propertyName: 'Sarbet International Retail Mall',
    propertyId: 'prop_sarbet_03',
    primaryColor: '#7C3AED',
    accentColor: '#EC4899',
    gradientClass: 'from-[#7C3AED] to-[#EC4899]',
    badgeBgClass: 'bg-[#7C3AED]/10',
    badgeTextClass: 'text-[#7C3AED]',
    badgeBorderClass: 'border-[#7C3AED]/20',
    lightBgClass: 'bg-purple-50/60',
    logoIconName: 'Store',
    tagline: 'Luxury Retail & Diplomatic Penthouse Suites',
    citySubcity: 'Roosevelt St, Old Airport / Sarbet, Addis Ababa',
    escrowAccount: 'SARBET LUXURY MALL ESCROW ACC: 1000-6621-4419'
  },
  org_cmc_hub: {
    organizationId: 'org_cmc_hub',
    organizationName: 'CMC Commercial Properties Group',
    propertyName: 'CMC Mega Commercial & Retail Hub',
    propertyId: 'prop_cmc_04',
    primaryColor: '#EA580C',
    accentColor: '#F59E0B',
    gradientClass: 'from-[#EA580C] to-[#F59E0B]',
    badgeBgClass: 'bg-[#EA580C]/10',
    badgeTextClass: 'text-[#EA580C]',
    badgeBorderClass: 'border-[#EA580C]/20',
    lightBgClass: 'bg-orange-50/60',
    logoIconName: 'Briefcase',
    tagline: 'Mega Commercial, Industrial & Logistics Hub',
    citySubcity: 'CMC Road, Yeka Sub-City, Addis Ababa',
    escrowAccount: 'CMC MEGA COMMERCIAL HUB ACC: 1000-3319-8802'
  }
};

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
  // Client 1: Bole Medhanialem Commercial Plaza
  bole_owner: {
    uid: 'usr_bole_owner',
    name: 'Abebe Mengesha',
    email: 'owner@boleplaza.et',
    role: 'owner',
    phone: '+251 91 123 4567',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    title: 'Managing Director & Property Owner',
    organizationId: 'org_bole_plaza',
    organizationName: 'Bole Medhanialem Commercial Plaza PLC',
    complexAccess: ['prop_bole_01'],
    assignedPropertyId: 'prop_bole_01',
    assignedPropertyName: 'Bole Medhanialem Commercial Center'
  },
  bole_manager: {
    uid: 'usr_bole_manager',
    name: 'Hanna Tadesse',
    email: 'manager@boleplaza.et',
    role: 'manager',
    phone: '+251 91 234 5678',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    title: 'Senior Property Operations Manager',
    organizationId: 'org_bole_plaza',
    organizationName: 'Bole Medhanialem Commercial Plaza PLC',
    complexAccess: ['prop_bole_01'],
    assignedPropertyId: 'prop_bole_01',
    assignedPropertyName: 'Bole Medhanialem Commercial Center'
  },
  // Client 2: Kazanchis Business Towers
  kazanchis_owner: {
    uid: 'usr_kaz_owner',
    name: 'Dawit Haile',
    email: 'owner@kazanchistower.et',
    role: 'owner',
    phone: '+251 91 345 6789',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    title: 'Executive Asset Director & Owner',
    organizationId: 'org_kazanchis_towers',
    organizationName: 'Kazanchis Business Towers S.C.',
    complexAccess: ['prop_kazanchis_02'],
    assignedPropertyId: 'prop_kazanchis_02',
    assignedPropertyName: 'Kazanchis Financial & Executive Tower'
  },
  kazanchis_manager: {
    uid: 'usr_kaz_manager',
    name: 'Meron Bekele',
    email: 'manager@kazanchistower.et',
    role: 'manager',
    phone: '+251 91 456 7890',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    title: 'Commercial Operations Manager',
    organizationId: 'org_kazanchis_towers',
    organizationName: 'Kazanchis Business Towers S.C.',
    complexAccess: ['prop_kazanchis_02'],
    assignedPropertyId: 'prop_kazanchis_02',
    assignedPropertyName: 'Kazanchis Financial & Executive Tower'
  },
  // Client 3: Sarbet Luxury Mall
  sarbet_owner: {
    uid: 'usr_sar_owner',
    name: 'Solomon Tesfaye',
    email: 'owner@sarbetmall.et',
    role: 'owner',
    phone: '+251 91 567 8901',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    title: 'Managing Director & Retail Owner',
    organizationId: 'org_sarbet_mall',
    organizationName: 'Sarbet Luxury Mall Real Estate PLC',
    complexAccess: ['prop_sarbet_03'],
    assignedPropertyId: 'prop_sarbet_03',
    assignedPropertyName: 'Sarbet International Retail Mall'
  },
  sarbet_manager: {
    uid: 'usr_sar_manager',
    name: 'Tigist Alemayehu',
    email: 'manager@sarbetmall.et',
    role: 'manager',
    phone: '+251 91 678 9012',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    title: 'Retail Operations Manager',
    organizationId: 'org_sarbet_mall',
    organizationName: 'Sarbet Luxury Mall Real Estate PLC',
    complexAccess: ['prop_sarbet_03'],
    assignedPropertyId: 'prop_sarbet_03',
    assignedPropertyName: 'Sarbet International Retail Mall'
  },
  // Client 4: CMC Mega Commercial Hub
  cmc_owner: {
    uid: 'usr_cmc_owner',
    name: 'Yohannes Kebede',
    email: 'owner@cmchub.et',
    role: 'owner',
    phone: '+251 91 789 0123',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
    title: 'Commercial Group President & Owner',
    organizationId: 'org_cmc_hub',
    organizationName: 'CMC Commercial Properties Group',
    complexAccess: ['prop_cmc_04'],
    assignedPropertyId: 'prop_cmc_04',
    assignedPropertyName: 'CMC Mega Commercial & Retail Hub'
  },
  cmc_manager: {
    uid: 'usr_cmc_manager',
    name: 'Selamawit Fikru',
    email: 'manager@cmchub.et',
    role: 'manager',
    phone: '+251 91 890 1234',
    avatar: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=150&auto=format&fit=crop&q=80',
    title: 'Logistics & Hub Operations Manager',
    organizationId: 'org_cmc_hub',
    organizationName: 'CMC Commercial Properties Group',
    complexAccess: ['prop_cmc_04'],
    assignedPropertyId: 'prop_cmc_04',
    assignedPropertyName: 'CMC Mega Commercial & Retail Hub'
  },
  // Legacy aliases
  owner: {
    uid: 'usr_bole_owner',
    name: 'Abebe Mengesha',
    email: 'owner@boleplaza.et',
    role: 'owner',
    phone: '+251 91 123 4567',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    title: 'Managing Director & Property Owner',
    organizationId: 'org_bole_plaza',
    organizationName: 'Bole Medhanialem Commercial Plaza PLC',
    complexAccess: ['prop_bole_01'],
    assignedPropertyId: 'prop_bole_01',
    assignedPropertyName: 'Bole Medhanialem Commercial Center'
  },
  manager: {
    uid: 'usr_bole_manager',
    name: 'Hanna Tadesse',
    email: 'manager@boleplaza.et',
    role: 'manager',
    phone: '+251 91 234 5678',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    title: 'Senior Property Operations Manager',
    organizationId: 'org_bole_plaza',
    organizationName: 'Bole Medhanialem Commercial Plaza PLC',
    complexAccess: ['prop_bole_01'],
    assignedPropertyId: 'prop_bole_01',
    assignedPropertyName: 'Bole Medhanialem Commercial Center'
  }
};

export const MOCK_PROPERTIES: Property[] = [
  {
    propertyId: 'prop_bole_01',
    organizationId: 'org_bole_plaza',
    organizationName: 'Bole Medhanialem Commercial Plaza PLC',
    name: 'Bole Medhanialem Commercial Center',
    location: 'Cameroon St, Bole Sub-City, Addis Ababa',
    totalUnits: 28,
    type: 'commercial'
  },
  {
    propertyId: 'prop_kazanchis_02',
    organizationId: 'org_kazanchis_towers',
    organizationName: 'Kazanchis Business Towers S.C.',
    name: 'Kazanchis Financial & Executive Tower',
    location: 'Menelik II Ave, Kirkos Sub-City, Addis Ababa',
    totalUnits: 36,
    type: 'mixed_use'
  },
  {
    propertyId: 'prop_sarbet_03',
    organizationId: 'org_sarbet_mall',
    organizationName: 'Sarbet Luxury Mall Real Estate PLC',
    name: 'Sarbet International Retail Mall',
    location: 'Roosevelt St, Old Airport / Sarbet, Addis Ababa',
    totalUnits: 24,
    type: 'commercial'
  },
  {
    propertyId: 'prop_cmc_04',
    organizationId: 'org_cmc_hub',
    organizationName: 'CMC Commercial Properties Group',
    name: 'CMC Mega Commercial & Retail Hub',
    location: 'CMC Road, Yeka Sub-City, Addis Ababa',
    totalUnits: 45,
    type: 'commercial'
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
    : opts.bankName.includes('Telebirr') || opts.bankName.includes('telebirr')
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
      <text x="0" y="240" fill="#0f172a" font-size="14" font-weight="700">COMMERCIAL PROPERTY ESCROW ACC</text>

      <text x="0" y="285" fill="#64748b" font-size="12" font-weight="600">PAYMENT PURPOSE / ROOM REMARKS</text>
      <text x="0" y="310" fill="#0369a1" font-size="15" font-weight="700">Commercial Rent Settlement for ${opts.roomNumber}</text>

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

// ============================================================================
// 1. MOCK UNITS (DISTINCT FOR ALL 4 PROPERTIES)
// ============================================================================
export const MOCK_UNITS: Unit[] = [
  // --- CLIENT 1: BOLE MEDHANIALEM COMMERCIAL CENTER (prop_bole_01) ---
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
    currentTenantId: 'ten_bole_001'
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
    currentTenantId: 'ten_bole_002'
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
    currentTenantId: 'ten_bole_003'
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
    currentTenantId: 'ten_bole_004'
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
    currentTenantId: 'ten_bole_005'
  },
  {
    unitId: 'unit_bole_402',
    propertyId: 'prop_bole_01',
    propertyName: 'Bole Medhanialem Commercial Center',
    unitNumber: 'Suite 402 (Prime Vacant Suite)',
    floor: 4,
    type: 'commercial_office',
    areaSqMeters: 130,
    monthlyBaseRentETB: 110000,
    status: 'vacant'
  },

  // --- CLIENT 2: KAZANCHIS FINANCIAL DISTRICT TOWER (prop_kazanchis_02) ---
  {
    unitId: 'unit_kaz_101',
    propertyId: 'prop_kazanchis_02',
    propertyName: 'Kazanchis Financial & Executive Tower',
    unitNumber: 'Branch B-01 (Ground Bank Banking Hall)',
    floor: 0,
    type: 'commercial_retail',
    areaSqMeters: 350,
    monthlyBaseRentETB: 350000,
    status: 'occupied',
    currentTenantId: 'ten_kaz_001'
  },
  {
    unitId: 'unit_kaz_201',
    propertyId: 'prop_kazanchis_02',
    propertyName: 'Kazanchis Financial & Executive Tower',
    unitNumber: 'Tower Suite 501 (Law Chambers)',
    floor: 5,
    type: 'commercial_office',
    areaSqMeters: 195,
    monthlyBaseRentETB: 165000,
    status: 'occupied',
    currentTenantId: 'ten_kaz_002'
  },
  {
    unitId: 'unit_kaz_301',
    propertyId: 'prop_kazanchis_02',
    propertyName: 'Kazanchis Financial & Executive Tower',
    unitNumber: 'Tower Suite 601 (Commodities Trading HQ)',
    floor: 6,
    type: 'commercial_office',
    areaSqMeters: 230,
    monthlyBaseRentETB: 195000,
    status: 'occupied',
    currentTenantId: 'ten_kaz_003'
  },
  {
    unitId: 'unit_kaz_401',
    propertyId: 'prop_kazanchis_02',
    propertyName: 'Kazanchis Financial & Executive Tower',
    unitNumber: 'Tower Suite 701 (FinTech Development Hub)',
    floor: 7,
    type: 'commercial_office',
    areaSqMeters: 250,
    monthlyBaseRentETB: 220000,
    status: 'occupied',
    currentTenantId: 'ten_kaz_004'
  },
  {
    unitId: 'unit_kaz_501',
    propertyId: 'prop_kazanchis_02',
    propertyName: 'Kazanchis Financial & Executive Tower',
    unitNumber: 'Tower Suite 801 (Safari & Travel Bureau)',
    floor: 8,
    type: 'commercial_office',
    areaSqMeters: 140,
    monthlyBaseRentETB: 130000,
    status: 'occupied',
    currentTenantId: 'ten_kaz_005'
  },
  {
    unitId: 'unit_kaz_601',
    propertyId: 'prop_kazanchis_02',
    propertyName: 'Kazanchis Financial & Executive Tower',
    unitNumber: 'Tower Suite 901 (Engineering Consultancy)',
    floor: 9,
    type: 'commercial_office',
    areaSqMeters: 200,
    monthlyBaseRentETB: 185000,
    status: 'occupied',
    currentTenantId: 'ten_kaz_006'
  },

  // --- CLIENT 3: SARBET INTERNATIONAL RETAIL MALL (prop_sarbet_03) ---
  {
    unitId: 'unit_sar_101',
    propertyId: 'prop_sarbet_03',
    propertyName: 'Sarbet International Retail Mall',
    unitNumber: 'Shop G-01 (Swiss Watches & Jewelry)',
    floor: 0,
    type: 'commercial_retail',
    areaSqMeters: 160,
    monthlyBaseRentETB: 280000,
    status: 'occupied',
    currentTenantId: 'ten_sar_001'
  },
  {
    unitId: 'unit_sar_201',
    propertyId: 'prop_sarbet_03',
    propertyName: 'Sarbet International Retail Mall',
    unitNumber: 'Rooftop Lounge (Italian Ristorante)',
    floor: 6,
    type: 'commercial_retail',
    areaSqMeters: 380,
    monthlyBaseRentETB: 320000,
    status: 'occupied',
    currentTenantId: 'ten_sar_002'
  },
  {
    unitId: 'unit_sar_301',
    propertyId: 'prop_sarbet_03',
    propertyName: 'Sarbet International Retail Mall',
    unitNumber: 'Shop G-04 (French Perfumery & Spa)',
    floor: 0,
    type: 'commercial_retail',
    areaSqMeters: 130,
    monthlyBaseRentETB: 140000,
    status: 'occupied',
    currentTenantId: 'ten_sar_003'
  },
  {
    unitId: 'unit_sar_401',
    propertyId: 'prop_sarbet_03',
    propertyName: 'Sarbet International Retail Mall',
    unitNumber: 'Executive Suite 3A (Diplomatic Residence)',
    floor: 3,
    type: 'residential_apartment',
    areaSqMeters: 165,
    monthlyBaseRentETB: 85000,
    status: 'occupied',
    currentTenantId: 'ten_sar_004'
  },
  {
    unitId: 'unit_sar_501',
    propertyId: 'prop_sarbet_03',
    propertyName: 'Sarbet International Retail Mall',
    unitNumber: 'Penthouse PH-1 (Diplomatic Mission)',
    floor: 7,
    type: 'residential_penthouse',
    areaSqMeters: 310,
    monthlyBaseRentETB: 240000,
    status: 'occupied',
    currentTenantId: 'ten_sar_005'
  },
  {
    unitId: 'unit_sar_601',
    propertyId: 'prop_sarbet_03',
    propertyName: 'Sarbet International Retail Mall',
    unitNumber: 'Shop 1-02 (Haute Couture Boutique)',
    floor: 1,
    type: 'commercial_retail',
    areaSqMeters: 115,
    monthlyBaseRentETB: 115000,
    status: 'occupied',
    currentTenantId: 'ten_sar_006'
  },

  // --- CLIENT 4: CMC MEGA COMMERCIAL & RETAIL HUB (prop_cmc_04) ---
  {
    unitId: 'unit_cmc_101',
    propertyId: 'prop_cmc_04',
    propertyName: 'CMC Mega Commercial & Retail Hub',
    unitNumber: 'Wing A (Mega Hypermarket Anchor)',
    floor: 0,
    type: 'commercial_retail',
    areaSqMeters: 550,
    monthlyBaseRentETB: 450000,
    status: 'occupied',
    currentTenantId: 'ten_cmc_001'
  },
  {
    unitId: 'unit_cmc_201',
    propertyId: 'prop_cmc_04',
    propertyName: 'CMC Mega Commercial & Retail Hub',
    unitNumber: 'Logistics Warehouse B (Industrial Equipment)',
    floor: 0,
    type: 'commercial_office',
    areaSqMeters: 420,
    monthlyBaseRentETB: 290000,
    status: 'occupied',
    currentTenantId: 'ten_cmc_002'
  },
  {
    unitId: 'unit_cmc_301',
    propertyId: 'prop_cmc_04',
    propertyName: 'CMC Mega Commercial & Retail Hub',
    unitNumber: 'Concourse C (Automotive Showroom)',
    floor: 0,
    type: 'commercial_retail',
    areaSqMeters: 310,
    monthlyBaseRentETB: 210000,
    status: 'occupied',
    currentTenantId: 'ten_cmc_003'
  },
  {
    unitId: 'unit_cmc_401',
    propertyId: 'prop_cmc_04',
    propertyName: 'CMC Mega Commercial & Retail Hub',
    unitNumber: 'Medical Wing D (Diagnostics & Lab)',
    floor: 1,
    type: 'commercial_office',
    areaSqMeters: 220,
    monthlyBaseRentETB: 160000,
    status: 'occupied',
    currentTenantId: 'ten_cmc_004'
  },
  {
    unitId: 'unit_cmc_501',
    propertyId: 'prop_cmc_04',
    propertyName: 'CMC Mega Commercial & Retail Hub',
    unitNumber: 'Logistics Bay E (Air Cargo Courier Terminal)',
    floor: 0,
    type: 'commercial_office',
    areaSqMeters: 260,
    monthlyBaseRentETB: 175000,
    status: 'occupied',
    currentTenantId: 'ten_cmc_005'
  },
  {
    unitId: 'unit_cmc_601',
    propertyId: 'prop_cmc_04',
    propertyName: 'CMC Mega Commercial & Retail Hub',
    unitNumber: 'Cafe Wing F (Commercial Bakery & Roastery)',
    floor: 0,
    type: 'commercial_retail',
    areaSqMeters: 150,
    monthlyBaseRentETB: 135000,
    status: 'occupied',
    currentTenantId: 'ten_cmc_006'
  }
];

// ============================================================================
// 2. MOCK TENANTS (ISOLATED ACROSS THE 4 PROPERTIES)
// ============================================================================
export const MOCK_TENANTS: Tenant[] = [
  // --- CLIENT 1: BOLE PLAZA TENANTS ---
  {
    tenantId: 'ten_bole_001',
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
    documents: [],
    createdAt: '2025-01-01T08:00:00Z'
  },
  {
    tenantId: 'ten_bole_002',
    legalName: 'Zemen Digital Systems & Electronics S.C.',
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
    documents: [],
    createdAt: '2024-06-01T08:00:00Z'
  },
  {
    tenantId: 'ten_bole_003',
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
    documents: [],
    createdAt: '2024-01-01T08:00:00Z'
  },
  {
    tenantId: 'ten_bole_004',
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
    tenantId: 'ten_bole_005',
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

  // --- CLIENT 2: KAZANCHIS TOWERS TENANTS ---
  {
    tenantId: 'ten_kaz_001',
    legalName: 'Awash International Bank S.C. (Executive Branch)',
    businessTradeName: 'Awash Bank Kazanchis Branch',
    phone: '+251911223300',
    email: 'kazanchis.branch@awashbank.com',
    assignedUnitId: 'unit_kaz_101',
    propertyId: 'prop_kazanchis_02',
    leaseStartDate: '2023-01-01',
    leaseEndDate: '2028-12-31',
    status: 'active',
    monthlyRentETB: 350000,
    securityDepositETB: 1050000,
    tinNumber: '0011223344',
    contactPerson: 'Mulugeta Tesema (Branch Director)',
    documents: [],
    createdAt: '2023-01-01T08:00:00Z'
  },
  {
    tenantId: 'ten_kaz_002',
    legalName: 'Tewodros & Associates Legal Practitioners LLP',
    businessTradeName: 'Tewodros Law',
    phone: '+251916990011',
    email: 'info@tewodroslaw.et',
    assignedUnitId: 'unit_kaz_201',
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
    tenantId: 'ten_kaz_003',
    legalName: 'Addis Global Commodities Trading PLC',
    businessTradeName: 'Addis Global Commodities',
    phone: '+251917001122',
    email: 'treasury@addisglobaltrade.com',
    assignedUnitId: 'unit_kaz_301',
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
    tenantId: 'ten_kaz_004',
    legalName: 'Horn FinTech Innovation Hub Share Co.',
    businessTradeName: 'Horn FinTech Labs',
    phone: '+251918334455',
    email: 'accounts@hornfintech.et',
    assignedUnitId: 'unit_kaz_401',
    propertyId: 'prop_kazanchis_02',
    leaseStartDate: '2025-01-01',
    leaseEndDate: '2027-12-31',
    status: 'active',
    monthlyRentETB: 220000,
    securityDepositETB: 660000,
    tinNumber: '0044556677',
    contactPerson: 'Dr. Nahom Fisseha',
    documents: [],
    createdAt: '2025-01-01T08:00:00Z'
  },
  {
    tenantId: 'ten_kaz_005',
    legalName: 'Safari Travel & Tourism International PLC',
    businessTradeName: 'Safari Global Expeditions',
    phone: '+251919556677',
    email: 'admin@safaritravel.et',
    assignedUnitId: 'unit_kaz_501',
    propertyId: 'prop_kazanchis_02',
    leaseStartDate: '2024-08-01',
    leaseEndDate: '2026-07-31',
    status: 'delinquent',
    monthlyRentETB: 130000,
    securityDepositETB: 390000,
    tinNumber: '0055667788',
    contactPerson: 'Bethlehem Taye',
    documents: [],
    createdAt: '2024-08-01T08:00:00Z'
  },
  {
    tenantId: 'ten_kaz_006',
    legalName: 'Red Sea Architectural & Engineering Consultants',
    businessTradeName: 'Red Sea Design Group',
    phone: '+251911990088',
    email: 'finance@redseadesign.et',
    assignedUnitId: 'unit_kaz_601',
    propertyId: 'prop_kazanchis_02',
    leaseStartDate: '2025-02-01',
    leaseEndDate: '2027-01-31',
    status: 'active',
    monthlyRentETB: 185000,
    securityDepositETB: 555000,
    tinNumber: '0066778899',
    contactPerson: 'Eng. Daniel Girma',
    documents: [],
    createdAt: '2025-02-01T08:00:00Z'
  },

  // --- CLIENT 3: SARBET LUXURY MALL TENANTS ---
  {
    tenantId: 'ten_sar_001',
    legalName: 'Golden Crown Swiss Watches & Jewelry PLC',
    businessTradeName: 'Golden Crown Luxury',
    phone: '+251911334411',
    email: 'boutique@goldencrown.et',
    assignedUnitId: 'unit_sar_101',
    propertyId: 'prop_sarbet_03',
    leaseStartDate: '2024-01-01',
    leaseEndDate: '2027-12-31',
    status: 'active',
    monthlyRentETB: 280000,
    securityDepositETB: 840000,
    tinNumber: '0033445566',
    contactPerson: 'Henok Yohannes',
    documents: [],
    createdAt: '2024-01-01T08:00:00Z'
  },
  {
    tenantId: 'ten_sar_002',
    legalName: 'Milano Italian Ristorante & Skyline Lounge',
    businessTradeName: 'Milano Rooftop',
    phone: '+251912445522',
    email: 'reservations@milanorooftop.et',
    assignedUnitId: 'unit_sar_201',
    propertyId: 'prop_sarbet_03',
    leaseStartDate: '2023-06-01',
    leaseEndDate: '2028-05-31',
    status: 'active',
    monthlyRentETB: 320000,
    securityDepositETB: 960000,
    tinNumber: '0044556611',
    contactPerson: 'Chef Marco Rossi / Liya Desta',
    documents: [],
    createdAt: '2023-06-01T08:00:00Z'
  },
  {
    tenantId: 'ten_sar_003',
    legalName: 'Velvet Paris Luxury Perfumery & Wellness Spa',
    businessTradeName: 'Velvet Paris Spa',
    phone: '+251913556633',
    email: 'accounts@velvetparis.et',
    assignedUnitId: 'unit_sar_301',
    propertyId: 'prop_sarbet_03',
    leaseStartDate: '2025-01-01',
    leaseEndDate: '2027-12-31',
    status: 'active',
    monthlyRentETB: 140000,
    securityDepositETB: 420000,
    tinNumber: '0055667722',
    contactPerson: 'Helina Moges',
    documents: [],
    createdAt: '2025-01-01T08:00:00Z'
  },
  {
    tenantId: 'ten_sar_004',
    legalName: 'Dr. Almaz Bekele (UNICEF Country Mission)',
    businessTradeName: 'Diplomatic Residence Suite 3A',
    phone: '+251918112233',
    email: 'almaz.bekele@unicef.org',
    assignedUnitId: 'unit_sar_401',
    propertyId: 'prop_sarbet_03',
    leaseStartDate: '2025-02-01',
    leaseEndDate: '2027-01-31',
    status: 'active',
    monthlyRentETB: 85000,
    securityDepositETB: 170000,
    tinNumber: '0077889900',
    contactPerson: 'Dr. Almaz Bekele',
    documents: [],
    createdAt: '2025-02-01T08:00:00Z'
  },
  {
    tenantId: 'ten_sar_005',
    legalName: 'Ambassador Jean-Luc Dubois (French Embassy Residence)',
    businessTradeName: 'Embassy Penthouse Mission',
    phone: '+251919223344',
    email: 'jldubois@diplomatie.gouv.fr',
    assignedUnitId: 'unit_sar_501',
    propertyId: 'prop_sarbet_03',
    leaseStartDate: '2024-01-01',
    leaseEndDate: '2027-12-31',
    status: 'active',
    monthlyRentETB: 240000,
    securityDepositETB: 720000,
    tinNumber: '0088990011',
    contactPerson: 'Attache Pierre Martin',
    documents: [],
    createdAt: '2024-01-01T08:00:00Z'
  },
  {
    tenantId: 'ten_sar_006',
    legalName: 'Glamour Haute Couture Fashion Import PLC',
    businessTradeName: 'Glamour Boutique',
    phone: '+251914667744',
    email: 'contact@glamourfashion.et',
    assignedUnitId: 'unit_sar_601',
    propertyId: 'prop_sarbet_03',
    leaseStartDate: '2024-07-01',
    leaseEndDate: '2026-06-30',
    status: 'delinquent',
    monthlyRentETB: 115000,
    securityDepositETB: 345000,
    tinNumber: '0099001122',
    contactPerson: 'Tsion Gebremedhin',
    documents: [],
    createdAt: '2024-07-01T08:00:00Z'
  },

  // --- CLIENT 4: CMC MEGA HUB TENANTS ---
  {
    tenantId: 'ten_cmc_001',
    legalName: 'CMC Hypermarket & Wholesale Grocery PLC',
    businessTradeName: 'CMC Mega Hypermarket',
    phone: '+251911778811',
    email: 'accounts@cmchypermarket.et',
    assignedUnitId: 'unit_cmc_101',
    propertyId: 'prop_cmc_04',
    leaseStartDate: '2023-01-01',
    leaseEndDate: '2028-12-31',
    status: 'active',
    monthlyRentETB: 450000,
    securityDepositETB: 1350000,
    tinNumber: '0011992288',
    contactPerson: 'Girma Woldemariam (CEO)',
    documents: [],
    createdAt: '2023-01-01T08:00:00Z'
  },
  {
    tenantId: 'ten_cmc_002',
    legalName: 'Sinopia Industrial Tools & Equipment Import',
    businessTradeName: 'Sinopia Hardware Hub',
    phone: '+251912889922',
    email: 'trade@sinopiatools.et',
    assignedUnitId: 'unit_cmc_201',
    propertyId: 'prop_cmc_04',
    leaseStartDate: '2024-03-01',
    leaseEndDate: '2027-02-28',
    status: 'active',
    monthlyRentETB: 290000,
    securityDepositETB: 870000,
    tinNumber: '0022883399',
    contactPerson: 'Berhanu Asfaw',
    documents: [],
    createdAt: '2024-03-01T08:00:00Z'
  },
  {
    tenantId: 'ten_cmc_003',
    legalName: 'Yeka Automotive Genuine Parts Distribution',
    businessTradeName: 'Yeka Auto Hub',
    phone: '+251913990033',
    email: 'parts@yekaauto.et',
    assignedUnitId: 'unit_cmc_301',
    propertyId: 'prop_cmc_04',
    leaseStartDate: '2024-09-01',
    leaseEndDate: '2027-08-31',
    status: 'active',
    monthlyRentETB: 210000,
    securityDepositETB: 630000,
    tinNumber: '0033774488',
    contactPerson: 'Tadesse Tefera',
    documents: [],
    createdAt: '2024-09-01T08:00:00Z'
  },
  {
    tenantId: 'ten_cmc_004',
    legalName: 'Medtech Diagnostic Laboratory & Pharmacy Share Co.',
    businessTradeName: 'Medtech Medical Wing',
    phone: '+251914001144',
    email: 'lab@medtechafrica.et',
    assignedUnitId: 'unit_cmc_401',
    propertyId: 'prop_cmc_04',
    leaseStartDate: '2025-01-01',
    leaseEndDate: '2028-12-31',
    status: 'active',
    monthlyRentETB: 160000,
    securityDepositETB: 480000,
    tinNumber: '0044665577',
    contactPerson: 'Dr. Eyob Mesfin',
    documents: [],
    createdAt: '2025-01-01T08:00:00Z'
  },
  {
    tenantId: 'ten_cmc_005',
    legalName: 'Ethio-Express Air Cargo & Courier Center',
    businessTradeName: 'Ethio-Express Cargo Hub',
    phone: '+251915112255',
    email: 'dispatch@ethioexpress.et',
    assignedUnitId: 'unit_cmc_501',
    propertyId: 'prop_cmc_04',
    leaseStartDate: '2024-06-01',
    leaseEndDate: '2026-05-31',
    status: 'delinquent',
    monthlyRentETB: 175000,
    securityDepositETB: 525000,
    tinNumber: '0055776688',
    contactPerson: 'Zelalem Hailu',
    documents: [],
    createdAt: '2024-06-01T08:00:00Z'
  },
  {
    tenantId: 'ten_cmc_006',
    legalName: 'Sunrise Commercial Bakery & Roastery PLC',
    businessTradeName: 'Sunrise Bakery & Cafe',
    phone: '+251916223366',
    email: 'orders@sunrisebakery.et',
    assignedUnitId: 'unit_cmc_601',
    propertyId: 'prop_cmc_04',
    leaseStartDate: '2025-02-01',
    leaseEndDate: '2027-01-31',
    status: 'active',
    monthlyRentETB: 135000,
    securityDepositETB: 405000,
    tinNumber: '0066887799',
    contactPerson: 'Meseret Alemu',
    documents: [],
    createdAt: '2025-02-01T08:00:00Z'
  }
];

// ============================================================================
// 3. MOCK INVOICES (ISOLATED ACROSS THE 4 PROPERTIES)
// ============================================================================
export const MOCK_INVOICES: Invoice[] = [
  // --- BOLE PLAZA INVOICES (prop_bole_01) ---
  {
    invoiceId: 'inv_bole_001',
    invoiceNumber: 'INV-BOLE-2026-081',
    unitId: 'unit_bole_101',
    tenantId: 'ten_bole_001',
    propertyId: 'prop_bole_01',
    amountDue: 125000,
    dueDate: '2026-08-15T00:00:00Z',
    issuedDate: '2026-08-01T00:00:00Z',
    billingFrequency: 'monthly',
    paymentStatus: 'submitted_for_verification',
    billingPeriod: 'August 2026',
    description: 'Monthly Commercial Rent - Ground Floor Retail (G-01)',
    paymentId: 'pay_bole_001'
  },
  {
    invoiceId: 'inv_bole_002',
    invoiceNumber: 'INV-BOLE-2026-082',
    unitId: 'unit_bole_102',
    tenantId: 'ten_bole_002',
    propertyId: 'prop_bole_01',
    amountDue: 180000,
    dueDate: '2026-08-21T00:00:00Z',
    issuedDate: '2026-08-01T00:00:00Z',
    billingFrequency: 'monthly',
    paymentStatus: 'pending',
    billingPeriod: 'August 2026',
    description: 'Monthly Commercial Showroom Rent - G-02'
  },
  {
    invoiceId: 'inv_bole_003',
    invoiceNumber: 'INV-BOLE-2026-063',
    unitId: 'unit_bole_201',
    tenantId: 'ten_bole_003',
    propertyId: 'prop_bole_01',
    amountDue: 145000,
    dueDate: '2026-06-15T00:00:00Z',
    issuedDate: '2026-06-01T00:00:00Z',
    billingFrequency: 'monthly',
    paymentStatus: 'delinquent',
    billingPeriod: 'June 2026',
    description: 'Overdue Commercial Rent - Suite 201',
    lateFeeApplied: 7250
  },
  {
    invoiceId: 'inv_bole_004',
    invoiceNumber: 'INV-BOLE-2026-074',
    unitId: 'unit_bole_301',
    tenantId: 'ten_bole_004',
    propertyId: 'prop_bole_01',
    amountDue: 210000,
    dueDate: '2026-07-15T00:00:00Z',
    issuedDate: '2026-07-01T00:00:00Z',
    billingFrequency: 'monthly',
    paymentStatus: 'paid',
    billingPeriod: 'July 2026',
    description: 'Monthly Tech Hub Office Rent',
    paidAt: '2026-07-12T14:30:00Z',
    paymentId: 'pay_bole_004'
  },
  {
    invoiceId: 'inv_bole_005',
    invoiceNumber: 'INV-BOLE-2026-075',
    unitId: 'unit_bole_401',
    tenantId: 'ten_bole_005',
    propertyId: 'prop_bole_01',
    amountDue: 95000,
    dueDate: '2026-07-10T00:00:00Z',
    issuedDate: '2026-07-01T00:00:00Z',
    billingFrequency: 'monthly',
    paymentStatus: 'delinquent',
    billingPeriod: 'July 2026',
    description: 'Overdue Office Rent - Suite 401',
    lateFeeApplied: 4750
  },

  // --- KAZANCHIS TOWERS INVOICES (prop_kazanchis_02) ---
  {
    invoiceId: 'inv_kaz_001',
    invoiceNumber: 'INV-KAZ-2026-081',
    unitId: 'unit_kaz_101',
    tenantId: 'ten_kaz_001',
    propertyId: 'prop_kazanchis_02',
    amountDue: 350000,
    dueDate: '2026-08-15T00:00:00Z',
    issuedDate: '2026-08-01T00:00:00Z',
    billingFrequency: 'monthly',
    paymentStatus: 'submitted_for_verification',
    billingPeriod: 'August 2026',
    description: 'Executive Banking Hall Rent - Ground Floor B-01',
    paymentId: 'pay_kaz_001'
  },
  {
    invoiceId: 'inv_kaz_002',
    invoiceNumber: 'INV-KAZ-2026-082',
    unitId: 'unit_kaz_201',
    tenantId: 'ten_kaz_002',
    propertyId: 'prop_kazanchis_02',
    amountDue: 165000,
    dueDate: '2026-08-14T00:00:00Z',
    issuedDate: '2026-08-01T00:00:00Z',
    billingFrequency: 'monthly',
    paymentStatus: 'submitted_for_verification',
    billingPeriod: 'August 2026',
    description: 'Tower Suite 501 Legal Chambers Monthly Rent',
    paymentId: 'pay_kaz_002'
  },
  {
    invoiceId: 'inv_kaz_003',
    invoiceNumber: 'INV-KAZ-2026-083',
    unitId: 'unit_kaz_301',
    tenantId: 'ten_kaz_003',
    propertyId: 'prop_kazanchis_02',
    amountDue: 195000,
    dueDate: '2026-08-24T00:00:00Z',
    issuedDate: '2026-08-01T00:00:00Z',
    billingFrequency: 'monthly',
    paymentStatus: 'pending',
    billingPeriod: 'August 2026',
    description: 'Commodities Trading HQ Suite 601 Rent'
  },
  {
    invoiceId: 'inv_kaz_004',
    invoiceNumber: 'INV-KAZ-2026-074',
    unitId: 'unit_kaz_401',
    tenantId: 'ten_kaz_004',
    propertyId: 'prop_kazanchis_02',
    amountDue: 220000,
    dueDate: '2026-07-15T00:00:00Z',
    issuedDate: '2026-07-01T00:00:00Z',
    billingFrequency: 'monthly',
    paymentStatus: 'paid',
    billingPeriod: 'July 2026',
    description: 'FinTech Innovation Lab Suite 701 Rent',
    paidAt: '2026-07-14T11:00:00Z',
    paymentId: 'pay_kaz_004'
  },
  {
    invoiceId: 'inv_kaz_005',
    invoiceNumber: 'INV-KAZ-2026-075',
    unitId: 'unit_kaz_501',
    tenantId: 'ten_kaz_005',
    propertyId: 'prop_kazanchis_02',
    amountDue: 130000,
    dueDate: '2026-07-05T00:00:00Z',
    issuedDate: '2026-07-01T00:00:00Z',
    billingFrequency: 'monthly',
    paymentStatus: 'delinquent',
    billingPeriod: 'July 2026',
    description: 'Overdue Travel Bureau Suite 801 Rent',
    lateFeeApplied: 6500
  },

  // --- SARBET LUXURY MALL INVOICES (prop_sarbet_03) ---
  {
    invoiceId: 'inv_sar_001',
    invoiceNumber: 'INV-SAR-2026-081',
    unitId: 'unit_sar_101',
    tenantId: 'ten_sar_001',
    propertyId: 'prop_sarbet_03',
    amountDue: 280000,
    dueDate: '2026-08-10T00:00:00Z',
    issuedDate: '2026-08-01T00:00:00Z',
    billingFrequency: 'monthly',
    paymentStatus: 'paid',
    billingPeriod: 'August 2026',
    description: 'Swiss Timepieces Retail Shop G-01 Rent',
    paidAt: '2026-08-05T10:30:00Z',
    paymentId: 'pay_sar_001'
  },
  {
    invoiceId: 'inv_sar_002',
    invoiceNumber: 'INV-SAR-2026-082',
    unitId: 'unit_sar_201',
    tenantId: 'ten_sar_002',
    propertyId: 'prop_sarbet_03',
    amountDue: 320000,
    dueDate: '2026-08-15T00:00:00Z',
    issuedDate: '2026-08-01T00:00:00Z',
    billingFrequency: 'monthly',
    paymentStatus: 'submitted_for_verification',
    billingPeriod: 'August 2026',
    description: 'Milano Rooftop Italian Ristorante Rent',
    paymentId: 'pay_sar_002'
  },
  {
    invoiceId: 'inv_sar_003',
    invoiceNumber: 'INV-SAR-2026-083',
    unitId: 'unit_sar_301',
    tenantId: 'ten_sar_003',
    propertyId: 'prop_sarbet_03',
    amountDue: 140000,
    dueDate: '2026-08-19T00:00:00Z',
    issuedDate: '2026-08-01T00:00:00Z',
    billingFrequency: 'monthly',
    paymentStatus: 'pending',
    billingPeriod: 'August 2026',
    description: 'French Perfumery & Spa Shop G-04 Rent'
  },
  {
    invoiceId: 'inv_sar_004',
    invoiceNumber: 'INV-SAR-2026-084',
    unitId: 'unit_sar_401',
    tenantId: 'ten_sar_004',
    propertyId: 'prop_sarbet_03',
    amountDue: 85000,
    dueDate: '2026-08-14T00:00:00Z',
    issuedDate: '2026-08-01T00:00:00Z',
    billingFrequency: 'monthly',
    paymentStatus: 'paid',
    billingPeriod: 'August 2026',
    description: 'Diplomatic Residence Suite 3A Rent',
    paidAt: '2026-08-13T09:00:00Z',
    paymentId: 'pay_sar_004'
  },
  {
    invoiceId: 'inv_sar_005',
    invoiceNumber: 'INV-SAR-2026-085',
    unitId: 'unit_sar_501',
    tenantId: 'ten_sar_005',
    propertyId: 'prop_sarbet_03',
    amountDue: 240000,
    dueDate: '2026-08-10T00:00:00Z',
    issuedDate: '2026-08-01T00:00:00Z',
    billingFrequency: 'monthly',
    paymentStatus: 'submitted_for_verification',
    billingPeriod: 'August 2026',
    description: 'Executive Penthouse PH-1 Rent',
    paymentId: 'pay_sar_005'
  },
  {
    invoiceId: 'inv_sar_006',
    invoiceNumber: 'INV-SAR-2026-066',
    unitId: 'unit_sar_601',
    tenantId: 'ten_sar_006',
    propertyId: 'prop_sarbet_03',
    amountDue: 115000,
    dueDate: '2026-06-20T00:00:00Z',
    issuedDate: '2026-06-01T00:00:00Z',
    billingFrequency: 'monthly',
    paymentStatus: 'delinquent',
    billingPeriod: 'June 2026',
    description: 'Overdue Haute Couture Fashion Shop Rent',
    lateFeeApplied: 5750
  },

  // --- CMC MEGA HUB INVOICES (prop_cmc_04) ---
  {
    invoiceId: 'inv_cmc_001',
    invoiceNumber: 'INV-CMC-2026-081',
    unitId: 'unit_cmc_101',
    tenantId: 'ten_cmc_001',
    propertyId: 'prop_cmc_04',
    amountDue: 450000,
    dueDate: '2026-08-10T00:00:00Z',
    issuedDate: '2026-08-01T00:00:00Z',
    billingFrequency: 'monthly',
    paymentStatus: 'paid',
    billingPeriod: 'August 2026',
    description: 'Mega Hypermarket Anchor Wing A Rent',
    paidAt: '2026-08-08T15:00:00Z',
    paymentId: 'pay_cmc_001'
  },
  {
    invoiceId: 'inv_cmc_002',
    invoiceNumber: 'INV-CMC-2026-082',
    unitId: 'unit_cmc_201',
    tenantId: 'ten_cmc_002',
    propertyId: 'prop_cmc_04',
    amountDue: 290000,
    dueDate: '2026-08-15T00:00:00Z',
    issuedDate: '2026-08-01T00:00:00Z',
    billingFrequency: 'monthly',
    paymentStatus: 'submitted_for_verification',
    billingPeriod: 'August 2026',
    description: 'Industrial Tools & Warehouse B Rent',
    paymentId: 'pay_cmc_002'
  },
  {
    invoiceId: 'inv_cmc_003',
    invoiceNumber: 'INV-CMC-2026-083',
    unitId: 'unit_cmc_301',
    tenantId: 'ten_cmc_003',
    propertyId: 'prop_cmc_04',
    amountDue: 210000,
    dueDate: '2026-08-22T00:00:00Z',
    issuedDate: '2026-08-01T00:00:00Z',
    billingFrequency: 'monthly',
    paymentStatus: 'pending',
    billingPeriod: 'August 2026',
    description: 'Automotive Genuine Parts Showroom C Rent'
  },
  {
    invoiceId: 'inv_cmc_004',
    invoiceNumber: 'INV-CMC-2026-074',
    unitId: 'unit_cmc_401',
    tenantId: 'ten_cmc_004',
    propertyId: 'prop_cmc_04',
    amountDue: 160000,
    dueDate: '2026-07-15T00:00:00Z',
    issuedDate: '2026-07-01T00:00:00Z',
    billingFrequency: 'monthly',
    paymentStatus: 'paid',
    billingPeriod: 'July 2026',
    description: 'Diagnostic Medical Wing D Rent',
    paidAt: '2026-07-10T12:00:00Z',
    paymentId: 'pay_cmc_004'
  },
  {
    invoiceId: 'inv_cmc_005',
    invoiceNumber: 'INV-CMC-2026-065',
    unitId: 'unit_cmc_501',
    tenantId: 'ten_cmc_005',
    propertyId: 'prop_cmc_04',
    amountDue: 175000,
    dueDate: '2026-06-15T00:00:00Z',
    issuedDate: '2026-06-01T00:00:00Z',
    billingFrequency: 'monthly',
    paymentStatus: 'delinquent',
    billingPeriod: 'June 2026',
    description: 'Overdue Cargo Hub Terminal Bay E Rent',
    lateFeeApplied: 8750
  },
  {
    invoiceId: 'inv_cmc_006',
    invoiceNumber: 'INV-CMC-2026-076',
    unitId: 'unit_cmc_601',
    tenantId: 'ten_cmc_006',
    propertyId: 'prop_cmc_04',
    amountDue: 135000,
    dueDate: '2026-07-15T00:00:00Z',
    issuedDate: '2026-07-01T00:00:00Z',
    billingFrequency: 'monthly',
    paymentStatus: 'paid',
    billingPeriod: 'July 2026',
    description: 'Sunrise Bakery & Cafe Wing F Rent',
    paidAt: '2026-07-14T16:30:00Z',
    paymentId: 'pay_cmc_006'
  }
];

// ============================================================================
// 4. MOCK PAYMENTS (AUTHENTIC WITH BANK RECEIPTS FOR ALL 4 PROPERTIES)
// ============================================================================
export const MOCK_PAYMENTS: Payment[] = [
  // --- BOLE PLAZA PAYMENTS ---
  {
    paymentId: 'pay_bole_001',
    invoiceId: 'inv_bole_001',
    tenantId: 'ten_bole_001',
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
      paymentType: 'CBE Birr / Direct Core Transfer',
      roomNumber: 'G-01 (Bole Medhanialem Commercial Center)'
    }),
    submittedBy: 'Hanna Tadesse (Manager)',
    submittedAt: '2026-08-13T12:00:00Z',
    verificationStatus: 'unverified',
    notes: 'Tenant submitted CBE core reference. Deposited to Bole Plaza Escrow.'
  },
  {
    paymentId: 'pay_bole_004',
    invoiceId: 'inv_bole_004',
    tenantId: 'ten_bole_004',
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

  // --- KAZANCHIS TOWERS PAYMENTS ---
  {
    paymentId: 'pay_kaz_001',
    invoiceId: 'inv_kaz_001',
    tenantId: 'ten_kaz_001',
    unitId: 'unit_kaz_101',
    amountPaid: 350000,
    paymentMethod: 'awash_bank',
    referenceNumber: 'AWASH-CORP-991204',
    receiptImageUrl: generateBankReceiptSvg({
      bankName: 'Awash International Bank S.C.',
      payerName: 'Awash International Bank S.C. (Executive Branch)',
      amountETB: 350000,
      refNumber: 'AWASH-CORP-991204',
      date: '2026-08-14 09:15:22 EAT',
      paymentType: 'Inter-Bank Core Escrow Settlement',
      roomNumber: 'Ground Bank Branch B-01 (Kazanchis Financial Tower)'
    }),
    submittedBy: 'Meron Bekele (Manager)',
    submittedAt: '2026-08-14T10:00:00Z',
    verificationStatus: 'unverified',
    notes: 'Inter-branch wire slip submitted for executive owner vault approval.'
  },
  {
    paymentId: 'pay_kaz_002',
    invoiceId: 'inv_kaz_002',
    tenantId: 'ten_kaz_002',
    unitId: 'unit_kaz_201',
    amountPaid: 165000,
    paymentMethod: 'dashen_bank',
    referenceNumber: 'DASH-LEGAL-884102',
    receiptImageUrl: generateBankReceiptSvg({
      bankName: 'Dashen Bank Corporate',
      payerName: 'Tewodros & Associates Legal Practitioners LLP',
      amountETB: 165000,
      refNumber: 'DASH-LEGAL-884102',
      date: '2026-08-13 15:40:02 EAT',
      paymentType: 'Dashen Online RTGS Transfer',
      roomNumber: 'Tower Suite 501 (Kazanchis Financial Tower)'
    }),
    submittedBy: 'Meron Bekele (Manager)',
    submittedAt: '2026-08-13T16:10:00Z',
    verificationStatus: 'unverified',
    notes: 'RTGS clearance verification pending owner signature.'
  },
  {
    paymentId: 'pay_kaz_004',
    invoiceId: 'inv_kaz_004',
    tenantId: 'ten_kaz_004',
    unitId: 'unit_kaz_401',
    amountPaid: 220000,
    paymentMethod: 'telebirr',
    referenceNumber: 'TB-FINTECH-66719',
    receiptImageUrl: generateBankReceiptSvg({
      bankName: 'Telebirr SuperApp Enterprise',
      payerName: 'Horn FinTech Innovation Hub Share Co.',
      amountETB: 220000,
      refNumber: 'TB-FINTECH-66719',
      date: '2026-07-14 10:55:00 EAT',
      paymentType: 'Telebirr QR Enterprise Transfer',
      roomNumber: 'Tower Suite 701 (Kazanchis Financial Tower)',
      isVerified: true
    }),
    submittedBy: 'Meron Bekele (Manager)',
    submittedAt: '2026-07-14T11:05:00Z',
    verificationStatus: 'verified',
    verifiedBy: 'Dawit Haile (Owner)',
    verifiedAt: '2026-07-14T12:00:00Z',
    notes: 'Telebirr payment confirmed.'
  },

  // --- SARBET LUXURY MALL PAYMENTS ---
  {
    paymentId: 'pay_sar_001',
    invoiceId: 'inv_sar_001',
    tenantId: 'ten_sar_001',
    unitId: 'unit_sar_101',
    amountPaid: 280000,
    paymentMethod: 'cbe_birr',
    referenceNumber: 'CBE-LUX-551940',
    receiptImageUrl: generateBankReceiptSvg({
      bankName: 'Commercial Bank of Ethiopia (CBE)',
      payerName: 'Golden Crown Swiss Watches & Jewelry PLC',
      amountETB: 280000,
      refNumber: 'CBE-LUX-551940',
      date: '2026-08-05 10:15:00 EAT',
      paymentType: 'CBE Birr Corporate Direct',
      roomNumber: 'Shop G-01 (Sarbet International Retail Mall)',
      isVerified: true
    }),
    submittedBy: 'Tigist Alemayehu (Manager)',
    submittedAt: '2026-08-05T10:20:00Z',
    verificationStatus: 'verified',
    verifiedBy: 'Solomon Tesfaye (Owner)',
    verifiedAt: '2026-08-05T11:00:00Z',
    notes: 'CBE Luxury merchant clearing approved.'
  },
  {
    paymentId: 'pay_sar_002',
    invoiceId: 'inv_sar_002',
    tenantId: 'ten_sar_002',
    unitId: 'unit_sar_201',
    amountPaid: 320000,
    paymentMethod: 'bank_of_abyssinia',
    referenceNumber: 'BOA-MILANO-339182',
    receiptImageUrl: generateBankReceiptSvg({
      bankName: 'Bank of Abyssinia (BOA)',
      payerName: 'Milano Italian Ristorante & Skyline Lounge',
      amountETB: 320000,
      refNumber: 'BOA-MILANO-339182',
      date: '2026-08-14 14:20:10 EAT',
      paymentType: 'BOA Online Core Credit',
      roomNumber: 'Rooftop Lounge (Sarbet International Retail Mall)'
    }),
    submittedBy: 'Tigist Alemayehu (Manager)',
    submittedAt: '2026-08-14T14:40:00Z',
    verificationStatus: 'unverified',
    notes: 'Rooftop hospitality rent voucher submitted for Owner approval.'
  },
  {
    paymentId: 'pay_sar_004',
    invoiceId: 'inv_sar_004',
    tenantId: 'ten_sar_004',
    unitId: 'unit_sar_401',
    amountPaid: 85000,
    paymentMethod: 'bank_of_abyssinia',
    referenceNumber: 'BOA-UN-449182',
    receiptImageUrl: generateBankReceiptSvg({
      bankName: 'Bank of Abyssinia (BOA)',
      payerName: 'Dr. Almaz Bekele (UNICEF Mission)',
      amountETB: 85000,
      refNumber: 'BOA-UN-449182',
      date: '2026-08-13 08:50:00 EAT',
      paymentType: 'Diplomatic UN Direct Wire',
      roomNumber: 'Executive Suite 3A (Sarbet Heights)',
      isVerified: true
    }),
    submittedBy: 'Tigist Alemayehu (Manager)',
    submittedAt: '2026-08-13T08:55:00Z',
    verificationStatus: 'verified',
    verifiedBy: 'Solomon Tesfaye (Owner)',
    verifiedAt: '2026-08-13T09:30:00Z',
    notes: 'Diplomatic wire verified.'
  },
  {
    paymentId: 'pay_sar_005',
    invoiceId: 'inv_sar_005',
    tenantId: 'ten_sar_005',
    unitId: 'unit_sar_501',
    amountPaid: 240000,
    paymentMethod: 'bank_of_abyssinia',
    referenceNumber: 'BOA-EMBASSY-11094',
    receiptImageUrl: generateBankReceiptSvg({
      bankName: 'Bank of Abyssinia (BOA)',
      payerName: 'Ambassador Jean-Luc Dubois (French Embassy)',
      amountETB: 240000,
      refNumber: 'BOA-EMBASSY-11094',
      date: '2026-08-09 11:30:11 EAT',
      paymentType: 'Diplomatic Mission Account Clearing',
      roomNumber: 'Penthouse PH-1 (Sarbet International Retail Mall)'
    }),
    submittedBy: 'Tigist Alemayehu (Manager)',
    submittedAt: '2026-08-09T12:00:00Z',
    verificationStatus: 'unverified',
    notes: 'French diplomatic mission rental advice submitted for verification.'
  },

  // --- CMC MEGA HUB PAYMENTS ---
  {
    paymentId: 'pay_cmc_001',
    invoiceId: 'inv_cmc_001',
    tenantId: 'ten_cmc_001',
    unitId: 'unit_cmc_101',
    amountPaid: 450000,
    paymentMethod: 'cbe_birr',
    referenceNumber: 'CBE-HYPER-994182',
    receiptImageUrl: generateBankReceiptSvg({
      bankName: 'Commercial Bank of Ethiopia (CBE)',
      payerName: 'CMC Hypermarket & Wholesale Grocery PLC',
      amountETB: 450000,
      refNumber: 'CBE-HYPER-994182',
      date: '2026-08-08 14:45:00 EAT',
      paymentType: 'CBE Direct Bulk Clearance',
      roomNumber: 'Wing A (CMC Mega Commercial & Retail Hub)',
      isVerified: true
    }),
    submittedBy: 'Selamawit Fikru (Manager)',
    submittedAt: '2026-08-08T14:50:00Z',
    verificationStatus: 'verified',
    verifiedBy: 'Yohannes Kebede (Owner)',
    verifiedAt: '2026-08-08T16:00:00Z',
    notes: 'Hypermarket anchor tenant rent cleared.'
  },
  {
    paymentId: 'pay_cmc_002',
    invoiceId: 'inv_cmc_002',
    tenantId: 'ten_cmc_002',
    unitId: 'unit_cmc_201',
    amountPaid: 290000,
    paymentMethod: 'bank_of_abyssinia',
    referenceNumber: 'BOA-IND-778219',
    receiptImageUrl: generateBankReceiptSvg({
      bankName: 'Bank of Abyssinia (BOA)',
      payerName: 'Sinopia Industrial Tools & Equipment Import',
      amountETB: 290000,
      refNumber: 'BOA-IND-778219',
      date: '2026-08-14 11:20:00 EAT',
      paymentType: 'Heavy Industry Wholesale Wire',
      roomNumber: 'Logistics Warehouse B (CMC Mega Commercial Hub)'
    }),
    submittedBy: 'Selamawit Fikru (Manager)',
    submittedAt: '2026-08-14T11:45:00Z',
    verificationStatus: 'unverified',
    notes: 'Industrial warehouse payment advice in Owner verification queue.'
  },
  {
    paymentId: 'pay_cmc_004',
    invoiceId: 'inv_cmc_004',
    tenantId: 'ten_cmc_004',
    unitId: 'unit_cmc_401',
    amountPaid: 160000,
    paymentMethod: 'telebirr',
    referenceNumber: 'TB-MED-881920',
    receiptImageUrl: generateBankReceiptSvg({
      bankName: 'Telebirr SuperApp Enterprise',
      payerName: 'Medtech Diagnostic Laboratory & Pharmacy',
      amountETB: 160000,
      refNumber: 'TB-MED-881920',
      date: '2026-07-10 11:45:00 EAT',
      paymentType: 'Telebirr Merchant Pay',
      roomNumber: 'Medical Wing D (CMC Mega Commercial Hub)',
      isVerified: true
    }),
    submittedBy: 'Selamawit Fikru (Manager)',
    submittedAt: '2026-07-10T11:50:00Z',
    verificationStatus: 'verified',
    verifiedBy: 'Yohannes Kebede (Owner)',
    verifiedAt: '2026-07-10T13:00:00Z',
    notes: 'Medical wing rent approved.'
  },
  {
    paymentId: 'pay_cmc_006',
    invoiceId: 'inv_cmc_006',
    tenantId: 'ten_cmc_006',
    unitId: 'unit_cmc_601',
    amountPaid: 135000,
    paymentMethod: 'cbe_birr',
    referenceNumber: 'CBE-BAKE-441920',
    receiptImageUrl: generateBankReceiptSvg({
      bankName: 'Commercial Bank of Ethiopia (CBE)',
      payerName: 'Sunrise Commercial Bakery & Roastery PLC',
      amountETB: 135000,
      refNumber: 'CBE-BAKE-441920',
      date: '2026-07-14 16:15:00 EAT',
      paymentType: 'CBE Birr Mobile Transfer',
      roomNumber: 'Cafe Wing F (CMC Mega Commercial Hub)',
      isVerified: true
    }),
    submittedBy: 'Selamawit Fikru (Manager)',
    submittedAt: '2026-07-14T16:20:00Z',
    verificationStatus: 'verified',
    verifiedBy: 'Yohannes Kebede (Owner)',
    verifiedAt: '2026-07-14T17:00:00Z',
    notes: 'Bakery lease payment confirmed.'
  }
];

// ============================================================================
// 5. MOCK SMS LOGS (ACROSS CLIENTS)
// ============================================================================
export const MOCK_SMS_LOGS: SMSLog[] = [
  {
    id: 'sms_log_001',
    organizationId: 'org_bole_plaza',
    recipientPhone: '+251912556677',
    recipientName: 'Zemen Digital Systems',
    tenantId: 'ten_bole_002',
    unitNumber: 'G-02',
    invoiceId: 'inv_bole_002',
    amountETB: 180000,
    dueDate: '2026-08-21',
    messageType: '7_day_reminder',
    messageText: 'Dear Zemen Digital Systems, this is a friendly reminder that your rent for G-02 is due in 7 days on 2026-08-21. Amount Due: 180,000.00 ETB. - Bole Plaza Management',
    gateway: 'EthioTelecom_REST',
    status: 'delivered',
    dispatchedAt: '2026-08-14T08:00:12Z',
    httpStatusCode: 200,
    gatewayMessageId: 'ETH-SMS-992014-OK'
  },
  {
    id: 'sms_log_002',
    organizationId: 'org_kazanchis_towers',
    recipientPhone: '+251917001122',
    recipientName: 'Addis Global Commodities',
    tenantId: 'ten_kaz_003',
    unitNumber: 'Tower Suite 601',
    invoiceId: 'inv_kaz_003',
    amountETB: 195000,
    dueDate: '2026-08-24',
    messageType: '7_day_reminder',
    messageText: 'Dear Addis Global Commodities, rent invoice INV-KAZ-2026-083 is scheduled for settlement. Amount: 195,000.00 ETB. - Kazanchis Towers S.C.',
    gateway: 'EthioTelecom_REST',
    status: 'delivered',
    dispatchedAt: '2026-08-14T08:00:15Z',
    httpStatusCode: 200,
    gatewayMessageId: 'ETH-SMS-992015-OK'
  },
  {
    id: 'sms_log_003',
    organizationId: 'org_sarbet_mall',
    recipientPhone: '+251913556633',
    recipientName: 'Velvet Paris Spa',
    tenantId: 'ten_sar_003',
    unitNumber: 'Shop G-04',
    invoiceId: 'inv_sar_003',
    amountETB: 140000,
    dueDate: '2026-08-19',
    messageType: '7_day_reminder',
    messageText: 'Dear Velvet Paris Spa, your retail lease installment for Shop G-04 is due on August 19. Amount: 140,000.00 ETB. - Sarbet Mall Management',
    gateway: 'EthioTelecom_REST',
    status: 'delivered',
    dispatchedAt: '2026-08-14T08:00:18Z',
    httpStatusCode: 200,
    gatewayMessageId: 'ETH-SMS-992018-OK'
  },
  {
    id: 'sms_log_004',
    organizationId: 'org_cmc_hub',
    recipientPhone: '+251913990033',
    recipientName: 'Yeka Auto Hub',
    tenantId: 'ten_cmc_003',
    unitNumber: 'Concourse C',
    invoiceId: 'inv_cmc_003',
    amountETB: 210000,
    dueDate: '2026-08-22',
    messageType: '7_day_reminder',
    messageText: 'Dear Yeka Auto Hub, reminder that showroom rent for Concourse C is due on August 22. Amount: 210,000.00 ETB. - CMC Mega Hub Management',
    gateway: 'EthioTelecom_REST',
    status: 'delivered',
    dispatchedAt: '2026-08-14T08:00:22Z',
    httpStatusCode: 200,
    gatewayMessageId: 'ETH-SMS-992022-OK'
  }
];

export const MOCK_MAINTENANCE_REQUESTS: MaintenanceRequest[] = [
  {
    requestId: 'maint_001',
    ticketNumber: 'TKT-2026-089',
    tenantId: 'ten_bole_001',
    tenantName: 'Abyssinia Roast & Cafe',
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
    tenantId: 'ten_kaz_004',
    tenantName: 'Horn FinTech Labs',
    unitId: 'unit_kaz_401',
    unitNumber: 'Suite 701',
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
  }
];

export const MOCK_RENEWAL_REQUESTS: LeaseRenewalRequest[] = [
  {
    requestId: 'ren_001',
    tenantId: 'ten_bole_001',
    tenantName: 'Abyssinia Specialty Coffee Exporters PLC',
    unitNumber: 'G-01',
    currentLeaseEndDate: '2027-12-31',
    requestedExtensionMonths: 24,
    notes: 'Requesting 2-year commercial lease extension with standard 5% escalation cap.',
    status: 'pending',
    submittedAt: '2026-08-15T10:00:00Z'
  }
];
