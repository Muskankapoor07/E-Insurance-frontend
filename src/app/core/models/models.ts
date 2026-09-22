export type UserRole = 'ADMIN' | 'CUSTOMER' | 'AGENT' | 'EMPLOYEE';

export interface Admin {
  adminId: number;
  username: string;
  password?: string;
  email: string;
  fullName: string;
  createdAt: string;
}

export interface Employee {
  employeeId: number;
  username: string;
  password?: string;
  email: string;
  fullName: string;
  role: string;
  createdAt: string;
}

export interface InsuranceAgent {
  agentId: number;
  username: string;
  password?: string;
  email: string;
  fullName: string;
  createdAt: string;
  phone?: string;
  totalCommissions?: number;
}

export interface Customer {
  customerId: number;
  fullName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  agentId?: number | null;
  agent?: InsuranceAgent;
  createdAt: string;
  address?: string;
}

export interface InsurancePlan {
  planId: number;
  planName: string;
  planDetails: string;
  createdAt: string;
  schemesCount?: number;
  icon?: string;
}

export interface Scheme {
  schemeId: number;
  schemeName: string;
  schemeDetails: string;
  planId: number;
  plan?: InsurancePlan;
  createdAt: string;
  minSumAssured?: number;
  maxSumAssured?: number;
  minAge?: number;
  maxAge?: number;
  baseInterestRate?: number;
  minMaturityYears?: number;
  maxMaturityYears?: number;
}

export interface EmployeeScheme {
  employeeSchemeId: number;
  employeeId: number;
  schemeId: number;
  employee?: Employee;
  scheme?: Scheme;
  assignedDate?: string;
}

export type PolicyStatus = 'Active' | 'Pending' | 'Lapsed' | 'Matured';

export interface Policy {
  policyId: number;
  customerId: number;
  schemeId: number;
  policyDetails: string;
  premium: number;
  dateIssued: string;
  maturityPeriod: number; // in years
  policyLapseDate: string;
  createdAt: string;
  status: PolicyStatus;
  customer?: Customer;
  scheme?: Scheme;
  sumAssured?: number;
  nomineeName?: string;
  nomineeRelation?: string;
}

export interface Payment {
  paymentId: number;
  customerId: number;
  policyId: number;
  amount: number;
  paymentDate: string;
  createdAt: string;
  paymentMethod?: string;
  transactionRef?: string;
  customer?: Customer;
  policy?: Policy;
  status?: 'Completed' | 'Pending' | 'Failed';
}

export interface Commission {
  commissionId: number;
  agentId: number;
  policyId: number;
  commissionAmount: number;
  createdAt: string;
  agent?: InsuranceAgent;
  policy?: Policy;
  status?: 'Paid' | 'Pending Approval' | 'Disbursed';
}

export interface Bank {
  bankId: number;
  bankName: string;
  accountNumber: string;
  ifscCode: string;
  branch: string;
  status: 'Active' | 'Inactive';
  createdAt: string;
}

export interface AuthUser {
  id: number;
  username: string;
  fullName: string;
  email: string;
  role: UserRole;
  token: string;
  customerId?: number;
  agentId?: number;
  employeeId?: number;
  adminId?: number;
}

export interface PremiumCalculationRequest {
  schemeId: number;
  age: number;
  maturityPeriodYears: number;
  sumAssured: number;
  rateOfInterest?: number;
}

export interface PremiumCalculationResult {
  basePremium: number;
  annualPremium: number;
  semiAnnualPremium: number;
  quarterlyPremium: number;
  monthlyPremium: number;
  totalMaturityAmount: number;
  effectiveInterestRate: number;
  riskAdjustmentFactor: number;
}
