import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { InsuranceService } from '../../../core/services/insurance.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="auth-page">
      <div class="auth-card">
        <!-- Logo & Header -->
        <div class="auth-header">
          <div class="auth-logo">
            <i class="fa-solid fa-shield-halved"></i>
          </div>
          <h2>Customer Registration</h2>
          <p>Create your new E-Insurance customer account</p>
        </div>

        <form (ngSubmit)="handleRegister()">
          <!-- 2-Column Grid for Compact Fit -->
          <div class="form-grid">
            <!-- Full Name -->
            <div class="form-group">
              <label class="form-label">Full Name *</label>
              <div class="input-icon-box">
                <i class="fa-solid fa-user"></i>
                <input
                  type="text"
                  class="form-control with-icon"
                  [(ngModel)]="fullName"
                  name="fullName"
                  placeholder="e.g. Rahul Sharma"
                  required />
              </div>
            </div>

            <!-- Email -->
            <div class="form-group">
              <label class="form-label">Email Address *</label>
              <div class="input-icon-box">
                <i class="fa-solid fa-envelope"></i>
                <input
                  type="email"
                  class="form-control with-icon"
                  [(ngModel)]="email"
                  name="email"
                  placeholder="e.g. rahul@example.com"
                  required />
              </div>
            </div>

            <!-- Phone -->
            <div class="form-group">
              <label class="form-label">Phone Number *</label>
              <div class="input-icon-box">
                <i class="fa-solid fa-phone"></i>
                <input
                  type="tel"
                  class="form-control with-icon"
                  [(ngModel)]="phone"
                  name="phone"
                  placeholder="e.g. +91 98765 43210"
                  required />
              </div>
            </div>

            <!-- Date of Birth -->
            <div class="form-group">
              <label class="form-label">Date of Birth *</label>
              <div class="input-icon-box">
                <i class="fa-solid fa-calendar"></i>
                <input
                  type="date"
                  class="form-control with-icon"
                  [(ngModel)]="dateOfBirth"
                  name="dateOfBirth"
                  required />
              </div>
            </div>

            <!-- Password -->
            <div class="form-group span-2">
              <label class="form-label">Password *</label>
              <div class="input-icon-box">
                <i class="fa-solid fa-lock"></i>
                <input
                  type="password"
                  class="form-control with-icon"
                  [(ngModel)]="password"
                  name="password"
                  placeholder="Create a password"
                  required />
              </div>
            </div>
          </div>

          <!-- Submit Button -->
          <button type="submit" class="btn btn-primary w-100 mt-2">
            <i class="fa-solid fa-user-check"></i> Register Customer Account
          </button>
        </form>

        <!-- Back to Login Link -->
        <div class="auth-footer">
          <p>Already have an account? <a routerLink="/auth/login">Login here</a></p>
          <span class="note-text">Note: Admin, Employee and Agent accounts are managed from backend.</span>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .auth-page {
      min-height: calc(100vh - 120px);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0.75rem 1rem;
      background: #f1f5f9;
    }

    .auth-card {
      width: 100%;
      max-width: 580px;
      background: #ffffff;
      border-radius: var(--radius-md);
      padding: 1.25rem 1.5rem;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.08), 0 2px 4px -2px rgba(0, 0, 0, 0.05);
      border: 1px solid var(--gray-200);
    }

    .auth-header {
      text-align: center;
      margin-bottom: 0.85rem;
    }

    .auth-logo {
      width: 38px;
      height: 38px;
      margin: 0 auto 0.25rem;
      border-radius: 8px;
      background: linear-gradient(135deg, #2563eb 0%, #06b6d4 100%);
      color: #ffffff;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.1rem;
    }

    .auth-header h2 {
      font-size: 1.2rem;
      font-weight: 700;
      color: var(--gray-900);
      margin-bottom: 0.1rem;
    }

    .auth-header p {
      font-size: 0.75rem;
      color: var(--gray-500);
    }

    .form-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 0.6rem 0.85rem;
    }

    .form-group {
      margin-bottom: 0;
    }

    .span-2 {
      grid-column: span 2;
    }

    .form-label {
      font-size: 0.78rem;
      font-weight: 600;
      color: var(--gray-700);
      margin-bottom: 0.2rem;
      display: block;
    }

    .input-icon-box {
      position: relative;
      display: flex;
      align-items: center;
    }

    .input-icon-box i {
      position: absolute;
      left: 0.7rem;
      color: var(--gray-400);
      font-size: 0.78rem;
    }

    .with-icon {
      padding-left: 2rem;
      height: 36px;
      font-size: 0.825rem;
    }

    .form-select {
      height: 36px;
      font-size: 0.825rem;
      padding: 0.35rem 0.6rem;
    }

    .w-100 { width: 100%; }
    .mt-2 {
      margin-top: 0.85rem;
      height: 36px;
      font-size: 0.85rem;
    }

    .auth-footer {
      text-align: center;
      margin-top: 0.85rem;
      padding-top: 0.65rem;
      border-top: 1px solid var(--gray-200);
      font-size: 0.8rem;
      color: var(--gray-600);
    }

    .auth-footer a {
      font-weight: 600;
      color: var(--primary);
    }

    .note-text {
      display: block;
      font-size: 0.7rem;
      color: var(--gray-500);
      margin-top: 0.2rem;
    }

    @media (max-width: 600px) {
      .form-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class RegisterComponent {
  insuranceService = inject(InsuranceService);
  authService = inject(AuthService);
  router = inject(Router);

  fullName = '';
  email = '';
  phone = '';
  dateOfBirth = '1995-05-15';
  password = '';
  agentId: number | null = 1;

  handleRegister(): void {
    if (!this.fullName || !this.email || !this.password) {
      alert('Please fill all required fields.');
      return;
    }

    const created = this.insuranceService.addCustomer({
      fullName: this.fullName,
      email: this.email,
      phone: this.phone || '+91 98765 00000',
      dateOfBirth: this.dateOfBirth,
      agentId: this.agentId,
      address: 'Registered Online'
    });

    alert(`Customer account created successfully for ${created.fullName}! Logging you in.`);
    this.authService.login(created.fullName, 'CUSTOMER');
  }
}
