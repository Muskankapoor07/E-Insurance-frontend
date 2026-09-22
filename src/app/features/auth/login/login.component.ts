import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { UserRole } from '../../../core/models/models';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="login-page">
      <div class="login-card">
        <!-- Brand Header -->
        <div class="login-header">
          <div class="brand-badge">
            <i class="fa-solid fa-shield-halved"></i>
          </div>
          <h2>E-Insurance Portal</h2>
          <p>Common Login for Customer, Admin, Agent & Employee</p>
        </div>

        <!-- Unified Login Form for all roles -->
        <form (ngSubmit)="handleLogin()">
          <!-- Select Role -->
          <div class="form-group">
            <label class="form-label">Select Your Role</label>
            <select class="form-select" [(ngModel)]="selectedRole" name="role" (change)="onRoleChange()">
              <option value="CUSTOMER">Customer</option>
              <option value="ADMIN">Administrator</option>
              <option value="AGENT">Insurance Agent</option>
              <option value="EMPLOYEE">Employee (Underwriting/Operations)</option>
            </select>
          </div>

          <!-- Username / Email -->
          <div class="form-group">
            <label class="form-label">Username / Email</label>
            <div class="input-icon-box">
              <i class="fa-solid fa-user"></i>
              <input
                type="text"
                class="form-control with-icon"
                [(ngModel)]="username"
                name="username"
                [placeholder]="getPlaceholder()"
                required />
            </div>
          </div>

          <!-- Password -->
          <div class="form-group">
            <label class="form-label">Password</label>
            <div class="input-icon-box">
              <i class="fa-solid fa-lock"></i>
              <input
                type="password"
                class="form-control with-icon"
                [(ngModel)]="password"
                name="password"
                placeholder="Enter your password"
                required />
            </div>
          </div>

          <button type="submit" class="btn btn-primary w-100 mt-3">
            <i class="fa-solid fa-arrow-right-to-bracket"></i> Login as {{ selectedRole }}
          </button>
        </form>

        <!-- Customer Register Prompt -->
        <div class="register-prompt">
          <p>New Customer? <a routerLink="/auth/register">Create a Customer Account</a></p>
          <small class="text-muted">Admin, Employee and Agent credentials are managed by backend database.</small>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .login-page {
      min-height: calc(100vh - 120px);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 1rem;
      background: #f1f5f9;
    }

    .login-card {
      width: 100%;
      max-width: 380px;
      background: #ffffff;
      border-radius: var(--radius-md);
      padding: 1.5rem 1.75rem;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.08), 0 2px 4px -2px rgba(0, 0, 0, 0.05);
      border: 1px solid var(--gray-200);
    }

    .login-header {
      text-align: center;
      margin-bottom: 1.15rem;
    }

    .brand-badge {
      width: 42px;
      height: 42px;
      margin: 0 auto 0.4rem;
      border-radius: 10px;
      background: linear-gradient(135deg, #2563eb 0%, #06b6d4 100%);
      color: #ffffff;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.2rem;
    }

    .login-header h2 {
      font-size: 1.25rem;
      font-weight: 700;
      color: var(--gray-900);
      margin-bottom: 0.15rem;
    }

    .login-header p {
      font-size: 0.78rem;
      color: var(--gray-500);
    }

    .form-group {
      margin-bottom: 0.75rem;
    }

    .form-label {
      font-size: 0.8rem;
      font-weight: 600;
      color: var(--gray-700);
      margin-bottom: 0.25rem;
      display: block;
    }

    .input-icon-box {
      position: relative;
      display: flex;
      align-items: center;
    }

    .input-icon-box i {
      position: absolute;
      left: 0.75rem;
      color: var(--gray-400);
      font-size: 0.8rem;
    }

    .with-icon {
      padding-left: 2.1rem;
      height: 38px;
      font-size: 0.85rem;
    }

    .form-select {
      height: 38px;
      font-size: 0.85rem;
      padding: 0.4rem 0.65rem;
    }

    .w-100 { width: 100%; }
    .mt-3 {
      margin-top: 0.85rem;
      height: 38px;
      font-size: 0.875rem;
    }

    .register-prompt {
      text-align: center;
      margin-top: 1rem;
      padding-top: 0.85rem;
      border-top: 1px solid var(--gray-200);
      font-size: 0.82rem;
      color: var(--gray-600);
    }

    .register-prompt a {
      font-weight: 600;
      color: var(--primary);
    }

    .text-muted {
      display: block;
      font-size: 0.72rem;
      color: var(--gray-500);
      margin-top: 0.25rem;
    }
  `]
})
export class LoginComponent {
  authService = inject(AuthService);
  router = inject(Router);

  selectedRole: UserRole = 'CUSTOMER';
  username = '';
  password = '';

  onRoleChange(): void {
    this.username = '';
    this.password = '';
  }

  getPlaceholder(): string {
    switch (this.selectedRole) {
      case 'ADMIN': return 'e.g. admin or priya_admin';
      case 'CUSTOMER': return 'e.g. rahul@example.com';
      case 'AGENT': return 'e.g. agent_suresh';
      case 'EMPLOYEE': return 'e.g. emp_vikram';
    }
  }

  handleLogin(): void {
    if (!this.username) {
      alert('Please enter your username or email.');
      return;
    }
    this.authService.login(this.username, this.selectedRole);
  }
}
