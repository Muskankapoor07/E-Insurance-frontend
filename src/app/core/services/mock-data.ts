import {
  Admin,
  Employee,
  InsuranceAgent,
  Customer,
  InsurancePlan,
  Scheme,
  EmployeeScheme,
  Policy,
  Payment,
  Commission,
  Bank
} from '../models/models';

export const INITIAL_ADMINS: Admin[] = [
  {
    adminId: 1,
    username: 'admin',
    password: 'password123',
    email: 'admin@einsurance.com',
    fullName: 'Rajesh Sharma (Chief Administrator)',
    createdAt: '2024-01-10T10:00:00Z'
  },
  {
    adminId: 2,
    username: 'priya_admin',
    password: 'password123',
    email: 'priya.nair@einsurance.com',
    fullName: 'Priya Nair (System Director)',
    createdAt: '2024-02-15T11:30:00Z'
  }
];

export const INITIAL_EMPLOYEES: Employee[] = [
  {
    employeeId: 1,
    username: 'emp_vikram',
    password: 'password123',
    email: 'vikram.singh@einsurance.com',
    fullName: 'Vikram Singh',
    role: 'Senior Underwriter',
    createdAt: '2024-01-15T09:00:00Z'
  },
  {
    employeeId: 2,
    username: 'emp_anita',
    password: 'password123',
    email: 'anita.desai@einsurance.com',
    fullName: 'Anita Desai',
    role: 'Claims Verification Specialist',
    createdAt: '2024-02-01T10:15:00Z'
  },
  {
    employeeId: 3,
    username: 'emp_rohit',
    password: 'password123',
    email: 'rohit.verma@einsurance.com',
    fullName: 'Rohit Verma',
    role: 'Scheme Operations Manager',
    createdAt: '2024-03-05T14:20:00Z'
  }
];

export const INITIAL_AGENTS: InsuranceAgent[] = [
  {
    agentId: 1,
    username: 'agent_suresh',
    password: 'password123',
    email: 'suresh.patel@einsurance.com',
    fullName: 'Suresh Patel',
    phone: '+91 98234 56781',
    createdAt: '2024-01-20T08:30:00Z',
    totalCommissions: 48500
  },
  {
    agentId: 2,
    username: 'agent_meena',
    password: 'password123',
    email: 'meena.gupta@einsurance.com',
    fullName: 'Meena Gupta',
    phone: '+91 98451 23490',
    createdAt: '2024-02-10T12:00:00Z',
    totalCommissions: 62400
  },
  {
    agentId: 3,
    username: 'agent_arjun',
    password: 'password123',
    email: 'arjun.reddy@einsurance.com',
    fullName: 'Arjun Reddy',
    phone: '+91 97123 88412',
    createdAt: '2024-03-01T15:45:00Z',
    totalCommissions: 29800
  }
];

export const INITIAL_CUSTOMERS: Customer[] = [
  {
    customerId: 1,
    fullName: 'Muskan',
    email: 'muskan@einsurance.com',
    phone: '+91 99887 76655',
    dateOfBirth: '1996-05-14',
    agentId: 1,
    createdAt: '2024-02-01T11:00:00Z',
    address: 'Flat 402, Green Glen Layout, Bengaluru, Karnataka'
  },
  {
    customerId: 2,
    fullName: 'Sneha Kulkarni',
    email: 'sneha.k@gmail.com',
    phone: '+91 98765 43210',
    dateOfBirth: '1988-11-20',
    agentId: 2,
    createdAt: '2024-02-18T14:30:00Z',
    address: 'B-12, Orchid Towers, Pune, Maharashtra'
  },
  {
    customerId: 3,
    fullName: 'Amitabh Joshi',
    email: 'amitabh.joshi@outlook.com',
    phone: '+91 91234 56789',
    dateOfBirth: '1982-03-08',
    agentId: 1,
    createdAt: '2024-03-12T16:15:00Z',
    address: '77 Civil Lines, Jaipur, Rajasthan'
  },
  {
    customerId: 4,
    fullName: 'Pooja Sundaram',
    email: 'pooja.s@yahoo.com',
    phone: '+91 94432 10987',
    dateOfBirth: '1995-08-25',
    agentId: 3,
    createdAt: '2024-04-05T09:45:00Z',
    address: 'T-8 Anna Nagar, Chennai, Tamil Nadu'
  }
];

export const INITIAL_PLANS: InsurancePlan[] = [
  {
    planId: 1,
    planName: 'Term & Pure Life Protection',
    planDetails: 'High sum assured pure term insurance offering complete financial security and family income support at affordable premiums.',
    createdAt: '2024-01-01T00:00:00Z',
    icon: 'fa-shield-heart'
  },
  {
    planId: 2,
    planName: 'Comprehensive Health & Wellness',
    planDetails: 'Cashless hospitalization, critical illness cover, daycare procedures, and restore benefits for you and your loved ones.',
    createdAt: '2024-01-01T00:00:00Z',
    icon: 'fa-user-doctor'
  },
  {
    planId: 3,
    planName: 'Retirement & Guaranteed Pension',
    planDetails: 'Build a disciplined retirement corpus with guaranteed lifelong annuity payouts and capital return options.',
    createdAt: '2024-01-01T00:00:00Z',
    icon: 'fa-piggy-bank'
  },
  {
    planId: 4,
    planName: 'Wealth Builder & Endowment Plans',
    planDetails: 'Market-linked and guaranteed endowment schemes combining insurance protection with wealth compounding.',
    createdAt: '2024-01-01T00:00:00Z',
    icon: 'fa-chart-line'
  },
  {
    planId: 5,
    planName: 'Vehicle & Motor Insurance',
    planDetails: 'Comprehensive vehicle damage protection, theft, zero depreciation, and 24x7 roadside assistance.',
    createdAt: '2024-01-01T00:00:00Z',
    icon: 'fa-car'
  }
];

export const INITIAL_SCHEMES: Scheme[] = [
  {
    schemeId: 1,
    schemeName: 'Suraksha Shield Term Plan',
    schemeDetails: 'Pure term insurance with terminal illness cover up to 1 Crore sum assured. Includes accidental death benefit rider.',
    planId: 1,
    minSumAssured: 2500000,
    maxSumAssured: 20000000,
    minAge: 18,
    maxAge: 65,
    baseInterestRate: 7.2,
    minMaturityYears: 10,
    maxMaturityYears: 40,
    createdAt: '2024-01-05T10:00:00Z'
  },
  {
    schemeId: 2,
    schemeName: 'Family Super Health 360',
    schemeDetails: 'Comprehensive family floater medical insurance with zero copay, unlimited restoration, and AYUSH treatments.',
    planId: 2,
    minSumAssured: 500000,
    maxSumAssured: 5000000,
    minAge: 18,
    maxAge: 70,
    baseInterestRate: 6.5,
    minMaturityYears: 1,
    maxMaturityYears: 5,
    createdAt: '2024-01-08T11:00:00Z'
  },
  {
    schemeId: 3,
    schemeName: 'Golden Age Pension Advantage',
    schemeDetails: 'Secure post-retirement income with annual compound growth bonus and tax-free lump sum payout option.',
    planId: 3,
    minSumAssured: 1000000,
    maxSumAssured: 15000000,
    minAge: 30,
    maxAge: 60,
    baseInterestRate: 8.4,
    minMaturityYears: 15,
    maxMaturityYears: 30,
    createdAt: '2024-01-12T15:00:00Z'
  },
  {
    schemeId: 4,
    schemeName: 'Smart Wealth Endowment Pro',
    schemeDetails: 'Guaranteed maturity additions with systematic annual bonuses and flexible premium payment terms.',
    planId: 4,
    minSumAssured: 500000,
    maxSumAssured: 10000000,
    minAge: 18,
    maxAge: 55,
    baseInterestRate: 7.8,
    minMaturityYears: 10,
    maxMaturityYears: 25,
    createdAt: '2024-01-15T09:30:00Z'
  },
  {
    schemeId: 5,
    schemeName: 'Motor Comprehensive Shield',
    schemeDetails: 'Zero depreciation vehicle coverage with 24x7 roadside assistance and instant cashless claims.',
    planId: 5,
    minSumAssured: 100000,
    maxSumAssured: 3000000,
    minAge: 18,
    maxAge: 75,
    baseInterestRate: 5.5,
    minMaturityYears: 1,
    maxMaturityYears: 3,
    createdAt: '2024-01-16T10:00:00Z'
  }
];

export const INITIAL_EMPLOYEE_SCHEMES: EmployeeScheme[] = [
  {
    employeeSchemeId: 1,
    employeeId: 1, // Vikram Singh
    schemeId: 1, // Suraksha Shield Term Plan
    assignedDate: '2024-01-20'
  },
  {
    employeeSchemeId: 2,
    employeeId: 1, // Vikram Singh
    schemeId: 4, // Smart Wealth Endowment Pro
    assignedDate: '2024-01-20'
  },
  {
    employeeSchemeId: 3,
    employeeId: 2, // Anita Desai
    schemeId: 2, // Family Super Health 360
    assignedDate: '2024-02-05'
  },
  {
    employeeSchemeId: 4,
    employeeId: 3, // Rohit Verma
    schemeId: 3, // Golden Age Pension Advantage
    assignedDate: '2024-03-10'
  }
];

export const INITIAL_POLICIES: Policy[] = [
  {
    policyId: 12345,
    customerId: 1, // Muskan
    schemeId: 2, // Family Super Health 360 (Health Insurance)
    policyDetails: 'Health Insurance - Comprehensive family floater medical insurance with zero copay.',
    premium: 5000,
    dateIssued: '2026-01-01',
    maturityPeriod: 1,
    policyLapseDate: '2026-12-31',
    createdAt: '2026-01-01T10:00:00Z',
    status: 'Active',
    sumAssured: 1000000,
    nomineeName: 'Aarav Verma',
    nomineeRelation: 'Spouse'
  },
  {
    policyId: 67890,
    customerId: 1, // Muskan
    schemeId: 5, // Motor Comprehensive Shield (Vehicle Insurance)
    policyDetails: 'Vehicle Insurance - Comprehensive car coverage with zero depreciation.',
    premium: 4500,
    dateIssued: '2026-03-15',
    maturityPeriod: 1,
    policyLapseDate: '2027-03-14',
    createdAt: '2026-03-15T11:00:00Z',
    status: 'Active',
    sumAssured: 500000,
    nomineeName: 'Aarav Verma',
    nomineeRelation: 'Spouse'
  },
  {
    policyId: 11223,
    customerId: 1, // Muskan
    schemeId: 1, // Suraksha Shield Term Plan (Life Insurance)
    policyDetails: 'Life Insurance - 10 Year Pure Term policy with terminal illness rider.',
    premium: 3000,
    dateIssued: '2026-02-10',
    maturityPeriod: 10,
    policyLapseDate: '2036-02-09',
    createdAt: '2026-02-10T12:00:00Z',
    status: 'Pending',
    sumAssured: 2500000,
    nomineeName: 'Aarav Verma',
    nomineeRelation: 'Spouse'
  },
  {
    policyId: 103,
    customerId: 2, // Sneha Kulkarni
    schemeId: 4, // Smart Wealth Endowment Pro
    policyDetails: 'Smart Wealth Endowment Pro - 15 Year wealth creation and guaranteed bonus policy.',
    premium: 24000,
    dateIssued: '2024-02-22',
    maturityPeriod: 15,
    policyLapseDate: '2039-02-22',
    createdAt: '2024-02-22T10:00:00Z',
    status: 'Active',
    sumAssured: 3000000,
    nomineeName: 'Rohan Kulkarni',
    nomineeRelation: 'Brother'
  },
  {
    policyId: 104,
    customerId: 3, // Amitabh Joshi
    schemeId: 3, // Golden Age Pension
    policyDetails: 'Golden Age Pension Advantage - 20 Year Annuity accumulating plan.',
    premium: 35000,
    dateIssued: '2024-03-15',
    maturityPeriod: 20,
    policyLapseDate: '2044-03-15',
    createdAt: '2024-03-15T16:00:00Z',
    status: 'Active',
    sumAssured: 4500000,
    nomineeName: 'Geeta Joshi',
    nomineeRelation: 'Spouse'
  }
];

export const INITIAL_PAYMENTS: Payment[] = [
  {
    paymentId: 1001,
    customerId: 1,
    policyId: 12345,
    amount: 5000,
    paymentDate: '2026-09-12',
    createdAt: '2026-09-12T10:30:00Z',
    paymentMethod: 'UPI / NetBanking',
    transactionRef: 'TXN-INS-891023',
    status: 'Completed'
  },
  {
    paymentId: 1002,
    customerId: 1,
    policyId: 67890,
    amount: 4500,
    paymentDate: '2026-03-15',
    createdAt: '2026-03-15T11:40:00Z',
    paymentMethod: 'Credit Card',
    transactionRef: 'TXN-INS-901244',
    status: 'Completed'
  },
  {
    paymentId: 1005,
    customerId: 1,
    policyId: 11223,
    amount: 3000,
    paymentDate: '2026-02-10',
    createdAt: '2026-02-10T12:15:00Z',
    paymentMethod: 'NetBanking',
    transactionRef: 'TXN-INS-899120',
    status: 'Completed'
  },
  {
    paymentId: 1003,
    customerId: 2,
    policyId: 103,
    amount: 24000,
    paymentDate: '2024-02-22',
    createdAt: '2024-02-22T10:10:00Z',
    paymentMethod: 'NetBanking (HDFC)',
    transactionRef: 'TXN-INS-899120',
    status: 'Completed'
  },
  {
    paymentId: 1004,
    customerId: 3,
    policyId: 104,
    amount: 35000,
    paymentDate: '2024-03-15',
    createdAt: '2024-03-15T16:05:00Z',
    paymentMethod: 'Debit Card (SBI)',
    transactionRef: 'TXN-INS-911802',
    status: 'Completed'
  }
];

export const INITIAL_COMMISSIONS: Commission[] = [
  {
    commissionId: 501,
    agentId: 1, // Suresh Patel (Customer Rahul Verma agent)
    policyId: 101,
    commissionAmount: 1250, // 10% of 12500
    createdAt: '2024-02-06T09:00:00Z',
    status: 'Disbursed'
  },
  {
    commissionId: 502,
    agentId: 1, // Suresh Patel
    policyId: 102,
    commissionAmount: 1456, // 8% of 18200
    createdAt: '2024-03-02T10:00:00Z',
    status: 'Disbursed'
  },
  {
    commissionId: 503,
    agentId: 2, // Meena Gupta (Customer Sneha Kulkarni agent)
    policyId: 103,
    commissionAmount: 2400, // 10% of 24000
    createdAt: '2024-02-23T11:30:00Z',
    status: 'Disbursed'
  },
  {
    commissionId: 504,
    agentId: 1, // Suresh Patel (Customer Amitabh Joshi agent)
    policyId: 104,
    commissionAmount: 3500, // 10% of 35000
    createdAt: '2024-03-16T14:00:00Z',
    status: 'Disbursed'
  }
];

export const INITIAL_BANKS: Bank[] = [
  {
    bankId: 1,
    bankName: 'State Bank of India',
    accountNumber: '30992817291',
    ifscCode: 'SBIN0001824',
    branch: 'MG Road Corporate Branch, Bengaluru',
    status: 'Active',
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    bankId: 2,
    bankName: 'HDFC Bank Ltd',
    accountNumber: '50100293849102',
    ifscCode: 'HDFC0000240',
    branch: 'Nariman Point, Mumbai',
    status: 'Active',
    createdAt: '2024-01-05T00:00:00Z'
  },
  {
    bankId: 3,
    bankName: 'ICICI Bank',
    accountNumber: '001205019284',
    ifscCode: 'ICIC0000012',
    branch: 'Connaught Place, New Delhi',
    status: 'Active',
    createdAt: '2024-01-10T00:00:00Z'
  },
  {
    bankId: 4,
    bankName: 'Axis Bank',
    accountNumber: '918020039281723',
    ifscCode: 'UTIB0000115',
    branch: 'Banjara Hills, Hyderabad',
    status: 'Active',
    createdAt: '2024-02-01T00:00:00Z'
  }
];
