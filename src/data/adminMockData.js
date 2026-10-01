// Mock dataset for BridgeCart Admin & Governance Portal
// Covers all 9 modules from the specifications

export const INITIAL_BENEFICIARIES = [
  {
    id: 'BEN-2026-001',
    name: 'Priya Sharma',
    phone: '+91 98765 43210',
    aadhaarLast4: '8849',
    rationCardNumber: 'MH-PUN-2024-8849',
    rationCategory: 'Yellow (Antyodaya / AAY)',
    state: 'Maharashtra',
    district: 'Pune',
    fpsId: 'FPS-PUN-042',
    annualIncome: 42000,
    incomeCertNo: 'REV-MH-2025-9921',
    familyHead: 'Priya Sharma',
    familyMembersCount: 4,
    familyMembers: [
      { id: 'FM-1', name: 'Priya Sharma', relation: 'Head of Family', age: 34, gender: 'Female', isRedeemer: true, aadhaarLinked: true },
      { id: 'FM-2', name: 'Rajesh Sharma', relation: 'Spouse', age: 38, gender: 'Male', isRedeemer: true, aadhaarLinked: true },
      { id: 'FM-3', name: 'Aarav Sharma', relation: 'Son', age: 11, gender: 'Male', isRedeemer: false, aadhaarLinked: true },
      { id: 'FM-4', name: 'Ananya Sharma', relation: 'Daughter', age: 7, gender: 'Female', isRedeemer: false, aadhaarLinked: true }
    ],
    documents: [
      { name: 'Ration Card Copy', type: 'PDF', status: 'VERIFIED', verifiedAt: '2026-08-28' },
      { name: 'Aadhaar Card Copy', type: 'PDF', status: 'VERIFIED', verifiedAt: '2026-08-28' },
      { name: 'Tahsildar Income Certificate', type: 'PDF', status: 'VERIFIED', verifiedAt: '2026-08-29' }
    ],
    govtVerificationStatus: 'PASSED',
    familyMatchStatus: 'MATCHED',
    decisionStatus: 'APPROVED', // 'PENDING' | 'APPROVED' | 'REJECTED' | 'RESUBMISSION_REQUIRED'
    decisionReason: 'Verified Yellow Card (AAY) with valid Tahsildar income certificate and 100% family biometric match.',
    decidedBy: 'Admin (Ramesh K.)',
    decidedAt: '2026-09-02 11:30 AM',
    walletBalance: 1200,
    monthlyAllowance: 1500,
    lastRedemptionDate: '2026-09-09',
    reverificationDueDate: '2027-03-01',
    reverificationStatus: 'UP_TO_DATE',
    riskScore: 'LOW',
    isFrozen: false
  },
  {
    id: 'BEN-2026-002',
    name: 'Sunita Tukaram Patil',
    phone: '+91 94231 77102',
    aadhaarLast4: '3104',
    rationCardNumber: 'MH-PUN-2023-4102',
    rationCategory: 'BPL (Priority Household / PHH)',
    state: 'Maharashtra',
    district: 'Pune',
    fpsId: 'FPS-PUN-019',
    annualIncome: 65000,
    incomeCertNo: 'REV-MH-2025-1144',
    familyHead: 'Sunita Tukaram Patil',
    familyMembersCount: 5,
    familyMembers: [
      { id: 'FM-5', name: 'Sunita Tukaram Patil', relation: 'Head of Family', age: 42, gender: 'Female', isRedeemer: true, aadhaarLinked: true },
      { id: 'FM-6', name: 'Tukaram Patil', relation: 'Spouse', age: 46, gender: 'Male', isRedeemer: true, aadhaarLinked: true },
      { id: 'FM-7', name: 'Kavita Patil', relation: 'Daughter', age: 19, gender: 'Female', isRedeemer: true, aadhaarLinked: true },
      { id: 'FM-8', name: 'Sachin Patil', relation: 'Son', age: 16, gender: 'Male', isRedeemer: false, aadhaarLinked: true },
      { id: 'FM-9', name: 'Parvati Patil', relation: 'Mother-in-law', age: 72, gender: 'Female', isRedeemer: false, aadhaarLinked: true }
    ],
    documents: [
      { name: 'Ration Card Copy', type: 'PDF', status: 'VERIFIED', verifiedAt: '2026-09-03' },
      { name: 'Aadhaar Card Copy', type: 'PDF', status: 'VERIFIED', verifiedAt: '2026-09-03' },
      { name: 'Gram Panchayat BPL Certificate', type: 'PDF', status: 'VERIFIED', verifiedAt: '2026-09-04' }
    ],
    govtVerificationStatus: 'PASSED',
    familyMatchStatus: 'MATCHED',
    decisionStatus: 'PENDING',
    decisionReason: '',
    decidedBy: null,
    decidedAt: null,
    walletBalance: 0,
    monthlyAllowance: 1200,
    lastRedemptionDate: null,
    reverificationDueDate: '2027-03-15',
    reverificationStatus: 'PENDING_FIRST_CYCLE',
    riskScore: 'LOW',
    isFrozen: false
  },
  {
    id: 'BEN-2026-003',
    name: 'Mohammad Rafiq Ansari',
    phone: '+91 97650 99421',
    aadhaarLast4: '5519',
    rationCardNumber: 'MH-PUN-2024-9031',
    rationCategory: 'Yellow (Antyodaya / AAY)',
    state: 'Maharashtra',
    district: 'Pune',
    fpsId: 'FPS-PUN-088',
    annualIncome: 38000,
    incomeCertNo: 'REV-MH-2025-7820',
    familyHead: 'Mohammad Rafiq Ansari',
    familyMembersCount: 3,
    familyMembers: [
      { id: 'FM-10', name: 'Mohammad Rafiq Ansari', relation: 'Head of Family', age: 58, gender: 'Male', isRedeemer: true, aadhaarLinked: true },
      { id: 'FM-11', name: 'Zarina Ansari', relation: 'Spouse', age: 54, gender: 'Female', isRedeemer: true, aadhaarLinked: true },
      { id: 'FM-12', name: 'Bilal Ansari', relation: 'Son', age: 22, gender: 'Male', isRedeemer: false, aadhaarLinked: true }
    ],
    documents: [
      { name: 'Ration Card Copy', type: 'PDF', status: 'VERIFIED', verifiedAt: '2026-09-05' },
      { name: 'Aadhaar Card Copy', type: 'PDF', status: 'FLAGGED', verifiedAt: '2026-09-05' }
    ],
    govtVerificationStatus: 'PASSED',
    familyMatchStatus: 'MISMATCH_DETECTED', // mismatch in family records
    decisionStatus: 'RESUBMISSION_REQUIRED',
    decisionReason: 'Family record mismatch: Son Bilal registered with divergent birth certificate year. Please re-upload verified Aadhaar.',
    decidedBy: 'Admin (Sneha P.)',
    decidedAt: '2026-09-07 04:15 PM',
    walletBalance: 0,
    monthlyAllowance: 1500,
    lastRedemptionDate: null,
    reverificationDueDate: '2026-11-01',
    reverificationStatus: 'ACTION_REQUIRED',
    riskScore: 'MEDIUM',
    isFrozen: false
  },
  {
    id: 'BEN-2026-004',
    name: 'Devidas Eknath Gaikwad',
    phone: '+91 98220 12890',
    aadhaarLast4: '6632',
    rationCardNumber: 'MH-PUN-2021-1192',
    rationCategory: 'BPL (Priority Household / PHH)',
    state: 'Maharashtra',
    district: 'Pune',
    fpsId: 'FPS-PUN-005',
    annualIncome: 185000, // Exceeds threshold!
    incomeCertNo: 'REV-MH-2026-0391',
    familyHead: 'Devidas Eknath Gaikwad',
    familyMembersCount: 4,
    familyMembers: [
      { id: 'FM-13', name: 'Devidas Eknath Gaikwad', relation: 'Head of Family', age: 48, gender: 'Male', isRedeemer: true, aadhaarLinked: true },
      { id: 'FM-14', name: 'Rekha Gaikwad', relation: 'Spouse', age: 44, gender: 'Female', isRedeemer: true, aadhaarLinked: true }
    ],
    documents: [
      { name: 'Ration Card Copy', type: 'PDF', status: 'VERIFIED', verifiedAt: '2026-09-01' },
      { name: 'ITR Assessment Filing', type: 'PDF', status: 'REJECTED', verifiedAt: '2026-09-02' }
    ],
    govtVerificationStatus: 'FAILED_INCOME_CRITERIA',
    familyMatchStatus: 'MATCHED',
    decisionStatus: 'REJECTED',
    decisionReason: 'Income verification showed annual household income ₹1,85,000 exceeding maximum BPL entitlement threshold of ₹1,00,000.',
    decidedBy: 'Admin (Ramesh K.)',
    decidedAt: '2026-09-02 02:45 PM',
    walletBalance: 0,
    monthlyAllowance: 0,
    lastRedemptionDate: null,
    reverificationDueDate: null,
    reverificationStatus: 'INELIGIBLE',
    riskScore: 'HIGH',
    isFrozen: false
  },
  {
    id: 'BEN-2026-005',
    name: 'Meenakshi Sundaram',
    phone: '+91 99400 44123',
    aadhaarLast4: '9901',
    rationCardNumber: 'MH-PUN-2023-8821',
    rationCategory: 'Yellow (Antyodaya / AAY)',
    state: 'Maharashtra',
    district: 'Pune',
    fpsId: 'FPS-PUN-033',
    annualIncome: 32000,
    incomeCertNo: 'REV-MH-2025-4512',
    familyHead: 'Meenakshi Sundaram',
    familyMembersCount: 2,
    familyMembers: [
      { id: 'FM-15', name: 'Meenakshi Sundaram', relation: 'Head of Family', age: 67, gender: 'Female', isRedeemer: true, aadhaarLinked: true },
      { id: 'FM-16', name: 'Karthik Sundaram', relation: 'Grandson (Orphan)', age: 14, gender: 'Male', isRedeemer: false, aadhaarLinked: true }
    ],
    documents: [
      { name: 'Ration Card Copy', type: 'PDF', status: 'VERIFIED', verifiedAt: '2026-09-08' },
      { name: 'Senior Citizen Pension Proof', type: 'PDF', status: 'VERIFIED', verifiedAt: '2026-09-08' }
    ],
    govtVerificationStatus: 'PASSED',
    familyMatchStatus: 'MATCHED',
    decisionStatus: 'PENDING',
    decisionReason: '',
    decidedBy: null,
    decidedAt: null,
    walletBalance: 0,
    monthlyAllowance: 1500,
    lastRedemptionDate: null,
    reverificationDueDate: '2027-03-20',
    reverificationStatus: 'PENDING_FIRST_CYCLE',
    riskScore: 'LOW',
    isFrozen: false
  },
  {
    id: 'BEN-2026-006',
    name: 'Sanjay Rameshwar Jadhav',
    phone: '+91 98901 23456',
    aadhaarLast4: '1422',
    rationCardNumber: 'MH-PUN-2022-7719',
    rationCategory: 'BPL (Priority Household / PHH)',
    state: 'Maharashtra',
    district: 'Pune',
    fpsId: 'FPS-PUN-019',
    annualIncome: 58000,
    incomeCertNo: 'REV-MH-2025-6671',
    familyHead: 'Sanjay Rameshwar Jadhav',
    familyMembersCount: 4,
    familyMembers: [
      { id: 'FM-17', name: 'Sanjay Rameshwar Jadhav', relation: 'Head of Family', age: 41, gender: 'Male', isRedeemer: true, aadhaarLinked: true },
      { id: 'FM-18', name: 'Anita Jadhav', relation: 'Spouse', age: 38, gender: 'Female', isRedeemer: true, aadhaarLinked: true }
    ],
    documents: [
      { name: 'Ration Card Copy', type: 'PDF', status: 'VERIFIED', verifiedAt: '2026-07-15' },
      { name: 'Income Proof', type: 'PDF', status: 'VERIFIED', verifiedAt: '2026-07-16' }
    ],
    govtVerificationStatus: 'PASSED',
    familyMatchStatus: 'MATCHED',
    decisionStatus: 'APPROVED',
    decisionReason: 'Full BPL verification confirmed.',
    decidedBy: 'Admin (Ramesh K.)',
    decidedAt: '2026-07-18 10:00 AM',
    walletBalance: 350,
    monthlyAllowance: 1200,
    lastRedemptionDate: '2026-09-08',
    reverificationDueDate: '2026-09-25', // Overdue / Due soon!
    reverificationStatus: 'DUE_FOR_REVIEW',
    riskScore: 'HIGH', // Flagged for suspicious rapid redemption
    isFrozen: true, // Frozen in Fraud module
    freezeReason: 'Flagged for multiple transactions within 30 mins at two separate merchant stores.'
  }
];

export const INITIAL_COMMUNITY_WALLET_DATA = {
  escrowPoolBalance: 485420,
  activeAllocatedBeneficiaryFunds: 210000,
  totalRedeemedToDate: 255180,
  unallocatedBuffer: 20240,
  totalDonorsCount: 1420,
  averageDonationPerCheckout: 24.50,
  nonSpendableSafeguardActive: true,
  escrowSmartContractAddress: '0x8F3dE9291bB84C8b7762A772E9D404fE524b07A1',
  vaultBankPartner: 'State Bank of India - Special Escrow Trust A/C 9901844211',
  recentEscrowTransactions: [
    {
      id: 'ESC-TX-9901',
      date: '2026-09-10 17:42',
      type: 'MERCHANT_SETTLEMENT',
      recipientStore: 'Lokmanya Super Market (#101)',
      beneficiaryToken: 'BEN-***-8849',
      itemsCount: 4,
      amount: 345.00,
      status: 'DISBURSED',
      txHash: '0x3a91cbf094a97f18b3e8c379aef4c09d77e41b9d4f0923e1'
    },
    {
      id: 'ESC-TX-9900',
      date: '2026-09-10 16:15',
      type: 'PUBLIC_DONATION',
      donorName: 'Anonymous Shopper (In-store Checkout #BC1042)',
      recipientStore: 'BridgeCart Community Escrow Vault',
      beneficiaryToken: 'PLATFORM_ESCROW_POOL',
      itemsCount: 0,
      amount: 50.00,
      status: 'CONFIRMED',
      txHash: '0x88f12a9de7c301bf578841ba2289cde7320b98a00e5c10fa'
    },
    {
      id: 'ESC-TX-9899',
      date: '2026-09-10 14:02',
      type: 'PUBLIC_DONATION',
      donorName: 'Rahul Verma (In-store Checkout #BC1041)',
      recipientStore: 'BridgeCart Community Escrow Vault',
      beneficiaryToken: 'PLATFORM_ESCROW_POOL',
      itemsCount: 0,
      amount: 25.00,
      status: 'CONFIRMED',
      txHash: '0x99e1bc89da43110efac4419cb761042d3889afe19488b1cc'
    },
    {
      id: 'ESC-TX-9898',
      date: '2026-09-10 11:20',
      type: 'MERCHANT_SETTLEMENT',
      recipientStore: 'Green Valley Mart (#102)',
      beneficiaryToken: 'BEN-***-1422',
      itemsCount: 3,
      amount: 280.00,
      status: 'DISBURSED',
      txHash: '0x10efaa8724b9104cc79910fbc65409191e49aa018261bd77'
    },
    {
      id: 'ESC-TX-9897',
      date: '2026-09-09 19:40',
      type: 'QUOTA_ALLOCATION',
      recipientStore: 'Beneficiary Reserve Ledger',
      beneficiaryToken: 'BEN-***-8849',
      itemsCount: 0,
      amount: 1500.00,
      status: 'ALLOCATED_UNSPENT',
      txHash: '0x55ac9188be4f1074a38910ebca8719266184aef09b552210'
    }
  ]
};

export const INITIAL_FRAUD_ALERTS = [
  {
    id: 'FRD-801',
    beneficiaryId: 'BEN-2026-006',
    beneficiaryName: 'Sanjay Rameshwar Jadhav',
    rationCardNumber: 'MH-PUN-2022-7719',
    severity: 'HIGH',
    type: 'CROSS_STORE_VELOCITY_SPIKE',
    detectedAt: '2026-09-08 04:35 PM',
    description: 'Beneficiary wallet attempted 2 major redemptions (₹850 and ₹620) within a 22-minute window across 2 distinct stores 14km apart.',
    actionTaken: 'WALLET_FROZEN',
    status: 'ACTIVE_INVESTIGATION',
    evidence: {
      locationA: 'Lokmanya Super Market, Kothrud',
      locationB: 'Green Valley Mart, Baner',
      timeDeltaMins: 22,
      distanceKm: 14.2
    }
  },
  {
    id: 'FRD-802',
    beneficiaryId: 'BEN-2026-004',
    beneficiaryName: 'Devidas Eknath Gaikwad',
    rationCardNumber: 'MH-PUN-2021-1192',
    severity: 'MEDIUM',
    type: 'INCOME_DISCREPANCY_ALERT',
    detectedAt: '2026-09-02 01:10 PM',
    description: 'Income database cross-reference reported employer TDS filing of ₹1,85,000 conflicting with self-declared BPL limit of ₹60,000.',
    actionTaken: 'APPLICATION_REJECTED',
    status: 'RESOLVED',
    evidence: {
      declaredIncome: 60000,
      databaseReportedIncome: 185000,
      source: 'State Digital Revenue System'
    }
  },
  {
    id: 'FRD-803',
    beneficiaryId: 'BEN-2026-003',
    beneficiaryName: 'Mohammad Rafiq Ansari',
    rationCardNumber: 'MH-PUN-2024-9031',
    severity: 'LOW',
    type: 'FAMILY_MEMBER_DUPLICATION',
    detectedAt: '2026-09-05 11:20 AM',
    description: 'Aadhaar ending in 5519 was flagged as potential dependent match in an existing rural ration card record in Solapur district.',
    actionTaken: 'RESUBMISSION_MANDATED',
    status: 'AWAITING_BENEFICIARY_RESPONSE',
    evidence: {
      suspectedDuplicateCard: 'MH-SOL-2020-5519',
      matchConfidence: '82%'
    }
  }
];

export const INITIAL_LEDGER_BLOCKS = [
  {
    blockHeight: 10492,
    blockHash: '0x9fa4b8e21908472bf6d2105ca77189ae880291ba4f1238ef',
    prevHash: '0x71bc994012ea8f09918bcde45520938b8ca7119e340182bb',
    timestamp: '2026-09-10 17:42:10 UTC',
    eventType: 'REDEMPTION_SETTLEMENT',
    anonymizedBeneficiaryHash: 'HASH_ANON_8849a9f201bce',
    amount: 345.00,
    merchantId: 'MCH-LOKMANYA-101',
    itemsCategory: 'ESSENTIALS_FOOD_GRAINS',
    zkProof: 'zk-SNARK-Valid-Proof-0x992fa',
    status: 'CONFIRMED_ON_CHAIN'
  },
  {
    blockHeight: 10491,
    blockHash: '0x71bc994012ea8f09918bcde45520938b8ca7119e340182bb',
    prevHash: '0x33e8901af456c20188b4920dfa192800192ea01bfca84221',
    timestamp: '2026-09-10 16:15:04 UTC',
    eventType: 'COMMUNITY_DONATION',
    anonymizedBeneficiaryHash: 'POOL_COMMUNITY_ESCROW',
    amount: 50.00,
    merchantId: 'MCH-LOKMANYA-101',
    itemsCategory: 'DONATION_ROUNDUP',
    zkProof: 'zk-SNARK-Valid-Proof-0x771bd',
    status: 'CONFIRMED_ON_CHAIN'
  },
  {
    blockHeight: 10490,
    blockHash: '0x33e8901af456c20188b4920dfa192800192ea01bfca84221',
    prevHash: '0x12a9bc441098de77bfa9001ec8910029bcae8841029ba8ff',
    timestamp: '2026-09-10 14:02:55 UTC',
    eventType: 'COMMUNITY_DONATION',
    anonymizedBeneficiaryHash: 'POOL_COMMUNITY_ESCROW',
    amount: 25.00,
    merchantId: 'MCH-LOKMANYA-101',
    itemsCategory: 'DONATION_DIRECT',
    zkProof: 'zk-SNARK-Valid-Proof-0x310fc',
    status: 'CONFIRMED_ON_CHAIN'
  },
  {
    blockHeight: 10489,
    blockHash: '0x12a9bc441098de77bfa9001ec8910029bcae8841029ba8ff',
    prevHash: '0x00f12c88490a1bf6489aee1049bba32910fa8bc0091176bc',
    timestamp: '2026-09-09 19:40:22 UTC',
    eventType: 'ESCROW_ALLOCATION',
    anonymizedBeneficiaryHash: 'HASH_ANON_8849a9f201bce',
    amount: 1500.00,
    merchantId: 'SYSTEM_ESCROW_VAULT',
    itemsCategory: 'MONTHLY_NUTRITION_ALLOWANCE',
    zkProof: 'zk-SNARK-Valid-Proof-0x55bc1',
    status: 'CONFIRMED_ON_CHAIN'
  }
];

export const INITIAL_REPORTS_DATA = {
  monthlyVerificationSummary: {
    totalApplicationsReceived: 128,
    approvedCount: 94,
    rejectedCount: 18,
    resubmissionCount: 16,
    avgProcessingTimeHours: 4.6,
    autoGovtVerificationSuccessRate: '92.4%'
  },
  impactMetrics: {
    totalFamiliesNourished: 412,
    essentialKilosDistributed: 18450, // kgs of Atta, Rice, Pulses
    childrenBeneficiaries: 684,
    seniorBeneficiaries: 218,
    zeroPovertyHungerScore: '99.1%'
  },
  fundFlowBreakdown: {
    donorContributionsINR: 485420,
    merchantSettlementsINR: 255180,
    activeBeneficiaryEncumbranceINR: 210000,
    platformAdminTakeINR: 0, // STRICTLY ZERO!
    efficiencyRatio: '100% Direct-to-Food'
  }
};
