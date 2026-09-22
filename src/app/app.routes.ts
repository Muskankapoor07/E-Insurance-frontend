import { Routes } from '@angular/router';
import { authGuard, roleGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  // Auth
  {
    path: 'auth/login',
    loadComponent: () =>
      import('./features/auth/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'auth/register',
    loadComponent: () =>
      import('./features/auth/register/register.component').then(m => m.RegisterComponent)
  },

  // Customer Routes
  {
    path: 'customer/dashboard',
    canActivate: [authGuard, roleGuard(['CUSTOMER'])],
    loadComponent: () =>
      import('./features/customer/customer-dashboard/customer-dashboard.component').then(
        m => m.CustomerDashboardComponent
      )
  },
  {
    path: 'customer/my-policies',
    canActivate: [authGuard, roleGuard(['CUSTOMER'])],
    loadComponent: () =>
      import('./features/customer/my-policies/my-policies.component').then(
        m => m.MyPoliciesComponent
      )
  },
  {
    path: 'customer/buy-policy',
    canActivate: [authGuard, roleGuard(['CUSTOMER'])],
    loadComponent: () =>
      import('./features/customer/buy-policy/buy-policy.component').then(
        m => m.BuyPolicyComponent
      )
  },
  {
    path: 'customer/payments',
    canActivate: [authGuard, roleGuard(['CUSTOMER'])],
    loadComponent: () =>
      import('./features/customer/payments/payments.component').then(
        m => m.PaymentsComponent
      )
  },

  // Admin Routes
  {
    path: 'admin/dashboard',
    canActivate: [authGuard, roleGuard(['ADMIN'])],
    loadComponent: () =>
      import('./features/admin/admin-dashboard/admin-dashboard.component').then(
        m => m.AdminDashboardComponent
      )
  },
  {
    path: 'admin/customer-policies',
    canActivate: [authGuard, roleGuard(['ADMIN', 'EMPLOYEE'])],
    loadComponent: () =>
      import('./features/admin/customer-policies/customer-policies.component').then(
        m => m.CustomerPoliciesComponent
      )
  },
  {
    path: 'admin/manage-users',
    canActivate: [authGuard, roleGuard(['ADMIN'])],
    loadComponent: () =>
      import('./features/admin/manage-users/manage-users.component').then(
        m => m.ManageUsersComponent
      )
  },
  {
    path: 'admin/manage-banks',
    canActivate: [authGuard, roleGuard(['ADMIN'])],
    loadComponent: () =>
      import('./features/admin/manage-banks/manage-banks.component').then(
        m => m.ManageBanksComponent
      )
  },
  {
    path: 'admin/commission-calculator',
    canActivate: [authGuard, roleGuard(['ADMIN'])],
    loadComponent: () =>
      import('./features/admin/commission-calculator/commission-calculator.component').then(
        m => m.CommissionCalculatorComponent
      )
  },
  {
    path: 'admin/manage-plans',
    canActivate: [authGuard, roleGuard(['ADMIN'])],
    loadComponent: () =>
      import('./features/admin/manage-plans/manage-plans.component').then(
        m => m.ManagePlansComponent
      )
  },

  // Agent Routes
  {
    path: 'agent/dashboard',
    canActivate: [authGuard, roleGuard(['AGENT'])],
    loadComponent: () =>
      import('./features/agent/agent-dashboard/agent-dashboard.component').then(
        m => m.AgentDashboardComponent
      )
  },
  {
    path: 'agent/customers',
    canActivate: [authGuard, roleGuard(['AGENT'])],
    loadComponent: () =>
      import('./features/agent/agent-customers/agent-customers.component').then(
        m => m.AgentCustomersComponent
      )
  },
  {
    path: 'agent/commissions',
    canActivate: [authGuard, roleGuard(['AGENT'])],
    loadComponent: () =>
      import('./features/agent/agent-commissions/agent-commissions.component').then(
        m => m.AgentCommissionsComponent
      )
  },

  // Employee Routes
  {
    path: 'employee/dashboard',
    canActivate: [authGuard, roleGuard(['EMPLOYEE'])],
    loadComponent: () =>
      import('./features/employee/employee-dashboard/employee-dashboard.component').then(
        m => m.EmployeeDashboardComponent
      )
  },

  // Shared Tools (Premium Calculator)
  {
    path: 'calculator/premium',
    loadComponent: () =>
      import('./features/calculator/premium-calculator/premium-calculator.component').then(
        m => m.PremiumCalculatorComponent
      )
  },

  // Defaults
  { path: '', redirectTo: 'customer/dashboard', pathMatch: 'full' },
  { path: '**', redirectTo: 'customer/dashboard' }
];
