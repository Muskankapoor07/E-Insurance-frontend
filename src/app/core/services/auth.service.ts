import { Injectable, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { AuthUser, UserRole } from '../models/models';
import { INITIAL_ADMINS, INITIAL_CUSTOMERS, INITIAL_AGENTS, INITIAL_EMPLOYEES } from './mock-data';

const AUTH_USER_KEY = 'e_insurance_auth_user_v2';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSignal = signal<AuthUser | null>(this.getStoredUser());

  public currentUser = this.currentUserSignal.asReadonly();
  public isAuthenticated = computed(() => !!this.currentUserSignal());
  public userRole = computed(() => this.currentUserSignal()?.role ?? null);

  constructor(private router: Router) {
    // If no user is logged in, default to Customer or Admin for convenience
    if (!this.currentUserSignal()) {
      this.loginAsDefault('CUSTOMER');
    }
  }

  private getStoredUser(): AuthUser | null {
    try {
      const saved = localStorage.getItem(AUTH_USER_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  }

  private setStoredUser(user: AuthUser | null): void {
    this.currentUserSignal.set(user);
    if (user) {
      localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(AUTH_USER_KEY);
    }
  }

  login(username: string, role: UserRole): boolean {
    const token = `fake-jwt-token-${role.toLowerCase()}-${Date.now()}`;
    let authUser: AuthUser;

    if (role === 'ADMIN') {
      const admin = INITIAL_ADMINS.find(a => a.username.toLowerCase() === username.toLowerCase()) || INITIAL_ADMINS[0];
      authUser = {
        id: admin.adminId,
        username: admin.username,
        fullName: admin.fullName,
        email: admin.email,
        role: 'ADMIN',
        adminId: admin.adminId,
        token
      };
    } else if (role === 'CUSTOMER') {
      const customer = INITIAL_CUSTOMERS.find(c => c.fullName.toLowerCase().includes(username.toLowerCase())) || INITIAL_CUSTOMERS[0];
      authUser = {
        id: customer.customerId,
        username: customer.email,
        fullName: customer.fullName,
        email: customer.email,
        role: 'CUSTOMER',
        customerId: customer.customerId,
        agentId: customer.agentId ?? undefined,
        token
      };
    } else if (role === 'AGENT') {
      const agent = INITIAL_AGENTS.find(a => a.username.toLowerCase() === username.toLowerCase()) || INITIAL_AGENTS[0];
      authUser = {
        id: agent.agentId,
        username: agent.username,
        fullName: agent.fullName,
        email: agent.email,
        role: 'AGENT',
        agentId: agent.agentId,
        token
      };
    } else {
      // EMPLOYEE
      const employee = INITIAL_EMPLOYEES.find(e => e.username.toLowerCase() === username.toLowerCase()) || INITIAL_EMPLOYEES[0];
      authUser = {
        id: employee.employeeId,
        username: employee.username,
        fullName: employee.fullName,
        email: employee.email,
        role: 'EMPLOYEE',
        employeeId: employee.employeeId,
        token
      };
    }

    this.setStoredUser(authUser);
    this.redirectToDashboard(role);
    return true;
  }

  loginAsDefault(role: UserRole): void {
    if (role === 'ADMIN') {
      this.login('admin', 'ADMIN');
    } else if (role === 'CUSTOMER') {
      this.login('Muskan', 'CUSTOMER');
    } else if (role === 'AGENT') {
      this.login('agent_suresh', 'AGENT');
    } else if (role === 'EMPLOYEE') {
      this.login('emp_vikram', 'EMPLOYEE');
    }
  }

  switchPersona(role: UserRole): void {
    this.loginAsDefault(role);
  }

  logout(): void {
    this.setStoredUser(null);
    this.router.navigate(['/auth/login']);
  }

  redirectToDashboard(role?: UserRole): void {
    const targetRole = role || this.userRole();
    switch (targetRole) {
      case 'ADMIN':
        this.router.navigate(['/admin/dashboard']);
        break;
      case 'CUSTOMER':
        this.router.navigate(['/customer/dashboard']);
        break;
      case 'AGENT':
        this.router.navigate(['/agent/dashboard']);
        break;
      case 'EMPLOYEE':
        this.router.navigate(['/employee/dashboard']);
        break;
      default:
        this.router.navigate(['/auth/login']);
    }
  }
}
