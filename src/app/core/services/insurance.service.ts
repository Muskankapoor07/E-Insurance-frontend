import { Injectable, signal, computed } from '@angular/core';
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
  Bank,
  UserRole
} from '../models/models';
import {
  INITIAL_ADMINS,
  INITIAL_EMPLOYEES,
  INITIAL_AGENTS,
  INITIAL_CUSTOMERS,
  INITIAL_PLANS,
  INITIAL_SCHEMES,
  INITIAL_EMPLOYEE_SCHEMES,
  INITIAL_POLICIES,
  INITIAL_PAYMENTS,
  INITIAL_COMMISSIONS,
  INITIAL_BANKS
} from './mock-data';

const STORAGE_KEYS = {
  ADMINS: 'ei_v2_admins',
  EMPLOYEES: 'ei_v2_employees',
  AGENTS: 'ei_v2_agents',
  CUSTOMERS: 'ei_v2_customers',
  PLANS: 'ei_v2_plans',
  SCHEMES: 'ei_v2_schemes',
  EMPLOYEE_SCHEMES: 'ei_v2_employee_schemes',
  POLICIES: 'ei_v2_policies',
  PAYMENTS: 'ei_v2_payments',
  COMMISSIONS: 'ei_v2_commissions',
  BANKS: 'ei_v2_banks'
};

@Injectable({
  providedIn: 'root'
})
export class InsuranceService {
  // Signals for state
  public admins = signal<Admin[]>(this.load(STORAGE_KEYS.ADMINS, INITIAL_ADMINS));
  public employees = signal<Employee[]>(this.load(STORAGE_KEYS.EMPLOYEES, INITIAL_EMPLOYEES));
  public agents = signal<InsuranceAgent[]>(this.load(STORAGE_KEYS.AGENTS, INITIAL_AGENTS));
  public customers = signal<Customer[]>(this.load(STORAGE_KEYS.CUSTOMERS, INITIAL_CUSTOMERS));
  public plans = signal<InsurancePlan[]>(this.load(STORAGE_KEYS.PLANS, INITIAL_PLANS));
  public schemes = signal<Scheme[]>(this.load(STORAGE_KEYS.SCHEMES, INITIAL_SCHEMES));
  public employeeSchemes = signal<EmployeeScheme[]>(this.load(STORAGE_KEYS.EMPLOYEE_SCHEMES, INITIAL_EMPLOYEE_SCHEMES));
  public policies = signal<Policy[]>(this.load(STORAGE_KEYS.POLICIES, INITIAL_POLICIES));
  public payments = signal<Payment[]>(this.load(STORAGE_KEYS.PAYMENTS, INITIAL_PAYMENTS));
  public commissions = signal<Commission[]>(this.load(STORAGE_KEYS.COMMISSIONS, INITIAL_COMMISSIONS));
  public banks = signal<Bank[]>(this.load(STORAGE_KEYS.BANKS, INITIAL_BANKS));

  // Computed dashboard aggregations
  public totalActivePolicies = computed(() => this.policies().filter(p => p.status === 'Active').length);
  public totalCustomersCount = computed(() => this.customers().length);
  public totalPremiumsCollected = computed(() => this.payments().reduce((sum, p) => sum + (p.amount || 0), 0));
  public totalCommissionsPaid = computed(() => this.commissions().reduce((sum, c) => sum + (c.commissionAmount || 0), 0));

  private load<T>(key: string, defaultValue: T): T {
    try {
      const saved = localStorage.getItem(key);
      return saved ? JSON.parse(saved) : defaultValue;
    } catch {
      return defaultValue;
    }
  }

  private persist<T>(key: string, data: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (e) {
      console.error('Error saving to localStorage', e);
    }
  }

  // -------------------------------------------------------------
  // Plan & Scheme Operations
  // -------------------------------------------------------------
  getSchemesByPlan(planId: number): Scheme[] {
    return this.schemes().filter(s => s.planId === planId);
  }

  getSchemeById(schemeId: number): Scheme | undefined {
    return this.schemes().find(s => s.schemeId === schemeId);
  }

  getPlanById(planId: number): InsurancePlan | undefined {
    return this.plans().find(p => p.planId === planId);
  }

  addPlan(plan: Omit<InsurancePlan, 'planId' | 'createdAt'>): InsurancePlan {
    const newPlan: InsurancePlan = {
      ...plan,
      planId: Math.max(0, ...this.plans().map(p => p.planId)) + 1,
      createdAt: new Date().toISOString()
    };
    const updated = [...this.plans(), newPlan];
    this.plans.set(updated);
    this.persist(STORAGE_KEYS.PLANS, updated);
    return newPlan;
  }

  addScheme(scheme: Omit<Scheme, 'schemeId' | 'createdAt'>): Scheme {
    const newScheme: Scheme = {
      ...scheme,
      schemeId: Math.max(0, ...this.schemes().map(s => s.schemeId)) + 1,
      createdAt: new Date().toISOString()
    };
    const updated = [...this.schemes(), newScheme];
    this.schemes.set(updated);
    this.persist(STORAGE_KEYS.SCHEMES, updated);
    return newScheme;
  }

  // -------------------------------------------------------------
  // Policy & Purchase Operations
  // -------------------------------------------------------------
  getCustomerPolicies(customerId: number): Policy[] {
    return this.policies()
      .filter(p => p.customerId === customerId)
      .map(p => ({
        ...p,
        scheme: this.getSchemeById(p.schemeId),
        customer: this.customers().find(c => c.customerId === p.customerId)
      }));
  }

  getAllPoliciesEnriched(): Policy[] {
    return this.policies().map(p => ({
      ...p,
      scheme: this.getSchemeById(p.schemeId),
      customer: this.customers().find(c => c.customerId === p.customerId)
    }));
  }

  getPaymentsByPolicy(policyId: number): Payment[] {
    return this.payments().filter(p => p.policyId === policyId);
  }

  getPaymentsByCustomer(customerId: number): Payment[] {
    return this.payments()
      .filter(p => p.customerId === customerId)
      .map(p => ({
        ...p,
        policy: this.policies().find(pol => pol.policyId === p.policyId)
      }));
  }

  purchasePolicy(payload: {
    customerId: number;
    schemeId: number;
    policyDetails: string;
    premium: number;
    maturityPeriod: number;
    sumAssured: number;
    nomineeName: string;
    nomineeRelation: string;
    paymentMethod: string;
  }): { policy: Policy; payment: Payment } {
    const newPolicyId = Math.max(100, ...this.policies().map(p => p.policyId)) + 1;
    const now = new Date();
    const lapseDate = new Date();
    lapseDate.setFullYear(now.getFullYear() + payload.maturityPeriod);

    // 1. Create Policy
    const newPolicy: Policy = {
      policyId: newPolicyId,
      customerId: payload.customerId,
      schemeId: payload.schemeId,
      policyDetails: payload.policyDetails,
      premium: payload.premium,
      dateIssued: now.toISOString().split('T')[0],
      maturityPeriod: payload.maturityPeriod,
      policyLapseDate: lapseDate.toISOString().split('T')[0],
      createdAt: now.toISOString(),
      status: 'Active',
      sumAssured: payload.sumAssured,
      nomineeName: payload.nomineeName,
      nomineeRelation: payload.nomineeRelation
    };

    const updatedPolicies = [newPolicy, ...this.policies()];
    this.policies.set(updatedPolicies);
    this.persist(STORAGE_KEYS.POLICIES, updatedPolicies);

    // 2. Create Initial Payment
    const newPaymentId = Math.max(1000, ...this.payments().map(p => p.paymentId)) + 1;
    const newPayment: Payment = {
      paymentId: newPaymentId,
      customerId: payload.customerId,
      policyId: newPolicyId,
      amount: payload.premium,
      paymentDate: now.toISOString().split('T')[0],
      createdAt: now.toISOString(),
      paymentMethod: payload.paymentMethod || 'NetBanking / UPI',
      transactionRef: `TXN-INS-${Math.floor(100000 + Math.random() * 900000)}`,
      status: 'Completed'
    };

    const updatedPayments = [newPayment, ...this.payments()];
    this.payments.set(updatedPayments);
    this.persist(STORAGE_KEYS.PAYMENTS, updatedPayments);

    // 3. If Customer is assigned to an Agent, calculate and record Commission
    const customer = this.customers().find(c => c.customerId === payload.customerId);
    if (customer && customer.agentId) {
      const commissionAmount = Math.round(payload.premium * 0.10); // 10% commission
      const newCommissionId = Math.max(500, ...this.commissions().map(c => c.commissionId)) + 1;

      const newCommission: Commission = {
        commissionId: newCommissionId,
        agentId: customer.agentId,
        policyId: newPolicyId,
        commissionAmount,
        createdAt: now.toISOString(),
        status: 'Disbursed'
      };

      const updatedCommissions = [newCommission, ...this.commissions()];
      this.commissions.set(updatedCommissions);
      this.persist(STORAGE_KEYS.COMMISSIONS, updatedCommissions);
    }

    return { policy: newPolicy, payment: newPayment };
  }

  // -------------------------------------------------------------
  // Agent Specific Operations
  // -------------------------------------------------------------
  getAgentCustomers(agentId: number): Customer[] {
    return this.customers().filter(c => c.agentId === agentId);
  }

  getAgentPolicies(agentId: number): Policy[] {
    const customerIds = this.getAgentCustomers(agentId).map(c => c.customerId);
    return this.policies().filter(p => customerIds.includes(p.customerId));
  }

  getAgentCommissions(agentId: number): Commission[] {
    return this.commissions()
      .filter(c => c.agentId === agentId)
      .map(c => ({
        ...c,
        policy: this.policies().find(p => p.policyId === c.policyId),
        agent: this.agents().find(a => a.agentId === c.agentId)
      }));
  }

  recordCommission(commission: Omit<Commission, 'commissionId' | 'createdAt'>): Commission {
    const newCommission: Commission = {
      ...commission,
      commissionId: Math.max(500, ...this.commissions().map(c => c.commissionId)) + 1,
      createdAt: new Date().toISOString()
    };
    const updated = [newCommission, ...this.commissions()];
    this.commissions.set(updated);
    this.persist(STORAGE_KEYS.COMMISSIONS, updated);
    return newCommission;
  }

  // -------------------------------------------------------------
  // Employee Specific Operations (EmployeeScheme)
  // -------------------------------------------------------------
  getEmployeeAssignedSchemes(employeeId: number): { employeeScheme: EmployeeScheme; scheme?: Scheme }[] {
    return this.employeeSchemes()
      .filter(es => es.employeeId === employeeId)
      .map(es => ({
        employeeScheme: es,
        scheme: this.getSchemeById(es.schemeId)
      }));
  }

  assignSchemeToEmployee(employeeId: number, schemeId: number): EmployeeScheme {
    const newId = Math.max(0, ...this.employeeSchemes().map(es => es.employeeSchemeId)) + 1;
    const newAssignment: EmployeeScheme = {
      employeeSchemeId: newId,
      employeeId,
      schemeId,
      assignedDate: new Date().toISOString().split('T')[0]
    };
    const updated = [...this.employeeSchemes(), newAssignment];
    this.employeeSchemes.set(updated);
    this.persist(STORAGE_KEYS.EMPLOYEE_SCHEMES, updated);
    return newAssignment;
  }

  // -------------------------------------------------------------
  // User Management CRUD (Admin Use Case 3)
  // -------------------------------------------------------------
  addCustomer(customer: Omit<Customer, 'customerId' | 'createdAt'>): Customer {
    const newCust: Customer = {
      ...customer,
      customerId: Math.max(0, ...this.customers().map(c => c.customerId)) + 1,
      createdAt: new Date().toISOString()
    };
    const updated = [...this.customers(), newCust];
    this.customers.set(updated);
    this.persist(STORAGE_KEYS.CUSTOMERS, updated);
    return newCust;
  }

  updateCustomer(customerId: number, data: Partial<Customer>): void {
    const updated = this.customers().map(c => c.customerId === customerId ? { ...c, ...data } : c);
    this.customers.set(updated);
    this.persist(STORAGE_KEYS.CUSTOMERS, updated);
  }

  deleteCustomer(customerId: number): void {
    const updated = this.customers().filter(c => c.customerId !== customerId);
    this.customers.set(updated);
    this.persist(STORAGE_KEYS.CUSTOMERS, updated);
  }

  addAgent(agent: Omit<InsuranceAgent, 'agentId' | 'createdAt'>): InsuranceAgent {
    const newAgent: InsuranceAgent = {
      ...agent,
      agentId: Math.max(0, ...this.agents().map(a => a.agentId)) + 1,
      createdAt: new Date().toISOString(),
      totalCommissions: 0
    };
    const updated = [...this.agents(), newAgent];
    this.agents.set(updated);
    this.persist(STORAGE_KEYS.AGENTS, updated);
    return newAgent;
  }

  deleteAgent(agentId: number): void {
    const updated = this.agents().filter(a => a.agentId !== agentId);
    this.agents.set(updated);
    this.persist(STORAGE_KEYS.AGENTS, updated);
  }

  addEmployee(emp: Omit<Employee, 'employeeId' | 'createdAt'>): Employee {
    const newEmp: Employee = {
      ...emp,
      employeeId: Math.max(0, ...this.employees().map(e => e.employeeId)) + 1,
      createdAt: new Date().toISOString()
    };
    const updated = [...this.employees(), newEmp];
    this.employees.set(updated);
    this.persist(STORAGE_KEYS.EMPLOYEES, updated);
    return newEmp;
  }

  deleteEmployee(employeeId: number): void {
    const updated = this.employees().filter(e => e.employeeId !== employeeId);
    this.employees.set(updated);
    this.persist(STORAGE_KEYS.EMPLOYEES, updated);
  }

  // -------------------------------------------------------------
  // Bank Management CRUD (Admin Use Case 3)
  // -------------------------------------------------------------
  addBank(bank: Omit<Bank, 'bankId' | 'createdAt'>): Bank {
    const newBank: Bank = {
      ...bank,
      bankId: Math.max(0, ...this.banks().map(b => b.bankId)) + 1,
      createdAt: new Date().toISOString()
    };
    const updated = [...this.banks(), newBank];
    this.banks.set(updated);
    this.persist(STORAGE_KEYS.BANKS, updated);
    return newBank;
  }

  updateBank(bankId: number, data: Partial<Bank>): void {
    const updated = this.banks().map(b => b.bankId === bankId ? { ...b, ...data } : b);
    this.banks.set(updated);
    this.persist(STORAGE_KEYS.BANKS, updated);
  }

  deleteBank(bankId: number): void {
    const updated = this.banks().filter(b => b.bankId !== bankId);
    this.banks.set(updated);
    this.persist(STORAGE_KEYS.BANKS, updated);
  }

  resetToDefaultSeed(): void {
    localStorage.clear();
    this.admins.set(INITIAL_ADMINS);
    this.employees.set(INITIAL_EMPLOYEES);
    this.agents.set(INITIAL_AGENTS);
    this.customers.set(INITIAL_CUSTOMERS);
    this.plans.set(INITIAL_PLANS);
    this.schemes.set(INITIAL_SCHEMES);
    this.employeeSchemes.set(INITIAL_EMPLOYEE_SCHEMES);
    this.policies.set(INITIAL_POLICIES);
    this.payments.set(INITIAL_PAYMENTS);
    this.commissions.set(INITIAL_COMMISSIONS);
    this.banks.set(INITIAL_BANKS);
  }
}
