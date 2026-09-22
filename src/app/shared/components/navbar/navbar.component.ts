import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { UserRole } from '../../../core/models/models';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, RouterLinkActive],
  template: `
    <header class="navbar">
      <div class="nav-container">
        <!-- Logo -->
        <a routerLink="/" class="nav-brand">
          <i class="fa-solid fa-shield-halved brand-icon"></i>
          <span class="brand-name">E-Insurance</span>
        </a>

        <!-- Navigation Links (When Logged In) -->
        <nav class="nav-links" *ngIf="authService.isAuthenticated()">
          <!-- CUSTOMER -->
          <ng-container *ngIf="authService.userRole() === 'CUSTOMER'">
            <a routerLink="/customer/dashboard" routerLinkActive="active" class="link">
              <i class="fa-solid fa-house"></i> Home
            </a>
            <a routerLink="/customer/buy-policy" routerLinkActive="active" class="link">
              <i class="fa-solid fa-cart-plus"></i> Buy Policy
            </a>
            <a routerLink="/customer/my-policies" routerLinkActive="active" class="link">
              <i class="fa-solid fa-file-lines"></i> My Policies
            </a>
            <a routerLink="/calculator/premium" routerLinkActive="active" class="link">
              <i class="fa-solid fa-calculator"></i> Premium Calc
            </a>
            <a routerLink="/customer/payments" routerLinkActive="active" class="link">
              <i class="fa-solid fa-receipt"></i> Payments
            </a>
          </ng-container>

          <!-- ADMIN -->
          <ng-container *ngIf="authService.userRole() === 'ADMIN'">
            <a routerLink="/admin/dashboard" routerLinkActive="active" class="link">
              <i class="fa-solid fa-gauge"></i> Overview
            </a>
            <a routerLink="/admin/customer-policies" routerLinkActive="active" class="link">
              <i class="fa-solid fa-users-viewfinder"></i> Customer Policies
            </a>
            <a routerLink="/admin/manage-users" routerLinkActive="active" class="link">
              <i class="fa-solid fa-users"></i> Users
            </a>
            <a routerLink="/admin/manage-banks" routerLinkActive="active" class="link">
              <i class="fa-solid fa-building-columns"></i> Banks
            </a>
            <a routerLink="/admin/commission-calculator" routerLinkActive="active" class="link">
              <i class="fa-solid fa-hand-holding-dollar"></i> Commission Calc
            </a>
          </ng-container>

          <!-- AGENT -->
          <ng-container *ngIf="authService.userRole() === 'AGENT'">
            <a routerLink="/agent/dashboard" routerLinkActive="active" class="link">
              <i class="fa-solid fa-house"></i> Dashboard
            </a>
            <a routerLink="/agent/customers" routerLinkActive="active" class="link">
              <i class="fa-solid fa-user-group"></i> My Clients
            </a>
            <a routerLink="/agent/commissions" routerLinkActive="active" class="link">
              <i class="fa-solid fa-coins"></i> Commissions
            </a>
            <a routerLink="/calculator/premium" routerLinkActive="active" class="link">
              <i class="fa-solid fa-calculator"></i> Calculator
            </a>
          </ng-container>

          <!-- EMPLOYEE -->
          <ng-container *ngIf="authService.userRole() === 'EMPLOYEE'">
            <a routerLink="/employee/dashboard" routerLinkActive="active" class="link">
              <i class="fa-solid fa-briefcase"></i> Operations
            </a>
            <a routerLink="/admin/customer-policies" routerLinkActive="active" class="link">
              <i class="fa-solid fa-file-check"></i> Policy Audits
            </a>
            <a routerLink="/calculator/premium" routerLinkActive="active" class="link">
              <i class="fa-solid fa-calculator"></i> Calculator
            </a>
          </ng-container>
        </nav>

        <!-- Right Side User & Role Controls -->
        <div class="nav-right">
          <!-- When Logged In -->
          <ng-container *ngIf="authService.isAuthenticated()">
            <!-- Quick Role Switcher -->
            <div class="role-selector">
              <span class="role-label">Role:</span>
              <select
                class="role-dropdown"
                [ngModel]="authService.userRole()"
                (ngModelChange)="switchRole($event)">
                <option value="CUSTOMER">Customer</option>
                <option value="ADMIN">Admin</option>
                <option value="AGENT">Agent</option>
                <option value="EMPLOYEE">Employee</option>
              </select>
            </div>

            <!-- User Name -->
            <span class="user-greeting" *ngIf="authService.currentUser() as user">
              {{ user.fullName.split(' ')[0] }}
            </span>

            <!-- Logout -->
            <button class="btn btn-sm btn-secondary" (click)="logout()" title="Logout">
              <i class="fa-solid fa-arrow-right-from-bracket"></i> Logout
            </button>
          </ng-container>

          <!-- When Logged Out -->
          <ng-container *ngIf="!authService.isAuthenticated()">
            <a routerLink="/auth/register" class="btn btn-sm btn-outline">
              <i class="fa-solid fa-user-plus"></i> Customer Register
            </a>
            <a routerLink="/auth/login" class="btn btn-sm btn-primary">
              <i class="fa-solid fa-arrow-right-to-bracket"></i> Login
            </a>
          </ng-container>
        </div>
      </div>
    </header>
  `,
  styles: [`
    .navbar {
      background: #ffffff;
      border-bottom: 1px solid var(--gray-200);
      position: sticky;
      top: 0;
      z-index: 100;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
    }

    .nav-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0.6rem 1.5rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
    }

    .nav-brand {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      color: var(--gray-900);
      font-weight: 800;
      font-size: 1.15rem;
      text-decoration: none;
    }

    .brand-icon {
      color: var(--primary);
      font-size: 1.25rem;
    }

    .nav-links {
      display: flex;
      align-items: center;
      gap: 0.35rem;
      flex-wrap: wrap;
    }

    .link {
      padding: 0.4rem 0.75rem;
      color: var(--gray-600);
      font-size: 0.85rem;
      font-weight: 600;
      border-radius: var(--radius-sm);
      text-decoration: none;
      display: inline-flex;
      align-items: center;
      gap: 0.35rem;
      transition: background-color 0.15s, color 0.15s;
    }

    .link:hover {
      color: var(--primary);
      background-color: var(--primary-light);
      text-decoration: none;
    }

    .link.active {
      color: var(--primary);
      background-color: var(--primary-light);
    }

    .nav-right {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .role-selector {
      display: flex;
      align-items: center;
      gap: 0.35rem;
    }

    .role-label {
      font-size: 0.75rem;
      color: var(--gray-500);
      font-weight: 600;
    }

    .role-dropdown {
      padding: 0.25rem 0.5rem;
      font-size: 0.75rem;
      font-weight: 600;
      border: 1px solid var(--gray-300);
      border-radius: var(--radius-sm);
      background: var(--gray-50);
      color: var(--gray-800);
      cursor: pointer;
    }

    .user-greeting {
      font-size: 0.85rem;
      font-weight: 600;
      color: var(--gray-800);
    }

    @media (max-width: 768px) {
      .nav-container {
        flex-direction: column;
        align-items: flex-start;
      }
      .nav-right {
        width: 100%;
        justify-content: space-between;
      }
    }
  `]
})
export class NavbarComponent {
  public authService = inject(AuthService);

  switchRole(role: any): void {
    this.authService.switchPersona(role as UserRole);
  }

  logout(): void {
    this.authService.logout();
  }
}
