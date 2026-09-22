import { Component, inject, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { InsuranceService } from '../../../core/services/insurance.service';
import { Policy, Payment } from '../../../core/models/models';

@Component({
  selector: 'app-my-policies',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="container py-4">
      <div class="page-header">
        <div>
          <h1 class="page-title">
            <i class="fa-solid fa-file-shield text-primary"></i> My Active Policies
          </h1>
          <p class="page-subtitle">View and inspect your enrolled insurance policies, coverage terms, and installment records.</p>
        </div>
        <a routerLink="/customer/buy-policy" class="btn btn-primary">
          <i class="fa-solid fa-plus"></i> Enroll in New Policy
        </a>
      </div>

      <!-- Policy Cards Grid -->
      <div class="grid-2 mb-4" *ngIf="myPolicies().length > 0">
        <div class="card policy-card" *ngFor="let p of myPolicies()">
          <div class="policy-card-top">
            <div class="policy-id-badge">
              <span class="policy-number">#POL-{{ p.policyId }}</span>
              <span class="badge badge-active">{{ p.status }}</span>
            </div>
            <div class="policy-premium">
              <span class="premium-label">Annual Premium</span>
              <span class="premium-val">₹{{ p.premium | number }}</span>
            </div>
          </div>

          <h3 class="scheme-heading">{{ p.scheme?.schemeName || 'Insurance Scheme' }}</h3>
          <p class="policy-desc">{{ p.policyDetails }}</p>

          <div class="policy-specs-grid">
            <div class="spec-item">
              <span class="spec-label"><i class="fa-solid fa-vault"></i> Sum Assured</span>
              <span class="spec-val">₹{{ (p.sumAssured || 1000000) | number }}</span>
            </div>
            <div class="spec-item">
              <span class="spec-label"><i class="fa-solid fa-calendar-check"></i> Issued Date</span>
              <span class="spec-val">{{ p.dateIssued }}</span>
            </div>
            <div class="spec-item">
              <span class="spec-label"><i class="fa-solid fa-hourglass-half"></i> Tenure</span>
              <span class="spec-val">{{ p.maturityPeriod }} Years</span>
            </div>
            <div class="spec-item">
              <span class="spec-label"><i class="fa-solid fa-calendar-xmark"></i> Maturity / Lapse</span>
              <span class="spec-val">{{ p.policyLapseDate }}</span>
            </div>
          </div>

          <div class="nominee-strip" *ngIf="p.nomineeName">
            <i class="fa-solid fa-user-tag text-teal"></i>
            <span>Nominee: <strong>{{ p.nomineeName }}</strong> ({{ p.nomineeRelation || 'Spouse' }})</span>
          </div>

          <div class="card-footer-actions">
            <button class="btn btn-outline btn-sm" (click)="openPolicyDetails(p)">
              <i class="fa-solid fa-receipt"></i> View Payments & Receipt
            </button>
            <button class="btn btn-secondary btn-sm" (click)="downloadCertificate(p)">
              <i class="fa-solid fa-file-pdf"></i> Certificate
            </button>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div *ngIf="myPolicies().length === 0" class="card empty-state">
        <i class="fa-solid fa-folder-open empty-icon"></i>
        <h3>No Registered Policies</h3>
        <p>You do not have any active insurance policies under your account.</p>
        <a routerLink="/customer/buy-policy" class="btn btn-primary mt-3">
          Explore Policies & Buy Now
        </a>
      </div>

      <!-- Policy Payment Details Modal -->
      <div class="modal-overlay" *ngIf="selectedPolicy()" (click)="closeModal()">
        <div class="modal-dialog modal-lg" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h3 class="modal-title">
              <i class="fa-solid fa-receipt text-primary"></i> Policy #POL-{{ selectedPolicy()?.policyId }} Audit & Payments
            </h3>
            <button class="modal-close" (click)="closeModal()">&times;</button>
          </div>

          <div class="modal-body" *ngIf="selectedPolicy() as pol">
            <div class="modal-summary-box">
              <div>
                <strong>Scheme:</strong> {{ pol.scheme?.schemeName }}
              </div>
              <div>
                <strong>Customer:</strong> {{ pol.customer?.fullName || 'Rahul Verma' }}
              </div>
              <div>
                <strong>Sum Assured:</strong> ₹{{ (pol.sumAssured || 1000000) | number }}
              </div>
              <div>
                <strong>Current Status:</strong> <span class="badge badge-active">{{ pol.status }}</span>
              </div>
            </div>

            <h4 class="mt-4 mb-2 font-bold"><i class="fa-solid fa-credit-card text-teal"></i> Payment Transaction History</h4>
            <div class="table-responsive">
              <table class="table">
                <thead>
                  <tr>
                    <th>Payment ID</th>
                    <th>Transaction Ref</th>
                    <th>Date</th>
                    <th>Payment Mode</th>
                    <th>Amount Paid</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr *ngFor="let pay of policyPayments()">
                    <td>#PAY-{{ pay.paymentId }}</td>
                    <td><code>{{ pay.transactionRef }}</code></td>
                    <td>{{ pay.paymentDate }}</td>
                    <td>{{ pay.paymentMethod || 'UPI/NetBanking' }}</td>
                    <td class="font-bold text-teal">₹{{ pay.amount | number }}</td>
                    <td><span class="badge badge-success">Completed</span></td>
                  </tr>
                  <tr *ngIf="policyPayments().length === 0">
                    <td colspan="6" class="text-center py-3">No payments recorded for this policy yet.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div class="modal-footer">
            <button class="btn btn-secondary" (click)="closeModal()">Close</button>
            <button class="btn btn-primary" (click)="printDocument()">
              <i class="fa-solid fa-print"></i> Print Statement
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .py-4 { padding-top: 2rem; padding-bottom: 2rem; }
    .mb-4 { margin-bottom: 1.5rem; }
    .mt-4 { margin-top: 1.5rem; }
    .mb-2 { margin-bottom: 0.5rem; }
    .font-bold { font-weight: 700; }
    .text-primary { color: var(--primary-600); }
    .text-teal { color: var(--teal-600); }

    .policy-card {
      display: flex;
      flex-direction: column;
      border-top: 4px solid var(--primary-600);
    }

    .policy-card-top {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 1rem;
    }

    .policy-id-badge {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .policy-number {
      font-weight: 800;
      color: var(--slate-900);
      font-size: 1.1rem;
    }

    .policy-premium {
      text-align: right;
    }

    .premium-label {
      font-size: 0.75rem;
      color: var(--slate-500);
      display: block;
      text-transform: uppercase;
    }

    .premium-val {
      font-size: 1.25rem;
      font-weight: 800;
      color: var(--primary-600);
    }

    .scheme-heading {
      font-size: 1.2rem;
      font-weight: 700;
      color: var(--slate-900);
      margin-bottom: 0.4rem;
    }

    .policy-desc {
      font-size: 0.85rem;
      color: var(--slate-600);
      margin-bottom: 1.25rem;
      line-height: 1.4;
    }

    .policy-specs-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 0.75rem;
      background: var(--slate-50);
      padding: 0.85rem;
      border-radius: var(--radius-md);
      margin-bottom: 1rem;
    }

    .spec-item {
      display: flex;
      flex-direction: column;
    }

    .spec-label {
      font-size: 0.75rem;
      color: var(--slate-500);
      display: flex;
      align-items: center;
      gap: 0.35rem;
    }

    .spec-val {
      font-size: 0.9rem;
      font-weight: 700;
      color: var(--slate-800);
    }

    .nominee-strip {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.85rem;
      color: var(--slate-700);
      padding: 0.5rem 0.75rem;
      background: rgba(13, 148, 136, 0.08);
      border-radius: var(--radius-sm);
      margin-bottom: 1rem;
    }

    .card-footer-actions {
      display: flex;
      gap: 0.75rem;
      margin-top: auto;
      padding-top: 0.75rem;
      border-top: 1px solid var(--slate-100);
    }

    .modal-summary-box {
      background: var(--slate-50);
      border: 1px solid var(--slate-200);
      border-radius: var(--radius-md);
      padding: 1rem;
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 0.75rem;
      font-size: 0.9rem;
    }

    .empty-state {
      text-align: center;
      padding: 3.5rem 2rem;
    }

    .empty-icon {
      font-size: 3.5rem;
      color: var(--slate-300);
      margin-bottom: 1rem;
    }
  `]
})
export class MyPoliciesComponent {
  private authService = inject(AuthService);
  private insuranceService = inject(InsuranceService);

  customerId = computed(() => this.authService.currentUser()?.customerId || 1);
  myPolicies = computed(() => this.insuranceService.getCustomerPolicies(this.customerId()));

  selectedPolicy = signal<Policy | null>(null);
  policyPayments = computed(() => {
    const p = this.selectedPolicy();
    return p ? this.insuranceService.getPaymentsByPolicy(p.policyId) : [];
  });

  openPolicyDetails(policy: Policy): void {
    this.selectedPolicy.set(policy);
  }

  closeModal(): void {
    this.selectedPolicy.set(null);
  }

  downloadCertificate(policy: Policy): void {
    alert(`Certificate generated for Policy #POL-${policy.policyId} (${policy.scheme?.schemeName || 'Insurance Scheme'}). In a live deployment, this downloads the signed PDF.`);
  }

  printDocument(): void {
    window.print();
  }
}
