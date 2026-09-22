import { Component, inject, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';
import { InsuranceService } from '../../../core/services/insurance.service';
import { Payment } from '../../../core/models/models';

@Component({
  selector: 'app-payments',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container py-4">
      <div class="page-header">
        <div>
          <h1 class="page-title">
            <i class="fa-solid fa-receipt text-teal"></i> Payment & Billing Ledger
          </h1>
          <p class="page-subtitle">Track all premium transactions, payment receipts, and billing history.</p>
        </div>
      </div>

      <!-- Stats Summary -->
      <div class="grid-3 mb-4">
        <div class="stat-card">
          <div class="stat-icon teal">
            <i class="fa-solid fa-wallet"></i>
          </div>
          <div class="stat-info">
            <span class="stat-label">Total Premiums Paid</span>
            <span class="stat-value">₹{{ totalPaid() | number }}</span>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon emerald">
            <i class="fa-solid fa-circle-check"></i>
          </div>
          <div class="stat-info">
            <span class="stat-label">Successful Transactions</span>
            <span class="stat-value">{{ myPayments().length }}</span>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon primary">
            <i class="fa-solid fa-calendar-check"></i>
          </div>
          <div class="stat-info">
            <span class="stat-label">Latest Payment Date</span>
            <span class="stat-value font-md">{{ latestPaymentDate() }}</span>
          </div>
        </div>
      </div>

      <!-- Payments Table -->
      <div class="card">
        <div class="card-header">
          <h2 class="card-title">
            <i class="fa-solid fa-clock-rotate-left text-primary"></i> Premium Invoices & Receipts
          </h2>
        </div>

        <div class="table-responsive">
          <table class="table">
            <thead>
              <tr>
                <th>Payment ID</th>
                <th>Transaction Reference</th>
                <th>Linked Policy</th>
                <th>Date Paid</th>
                <th>Payment Method</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Receipt</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let p of myPayments()">
                <td><strong>#PAY-{{ p.paymentId }}</strong></td>
                <td><code>{{ p.transactionRef }}</code></td>
                <td>
                  <strong>#POL-{{ p.policyId }}</strong>
                </td>
                <td>{{ p.paymentDate }}</td>
                <td>{{ p.paymentMethod || 'NetBanking / UPI' }}</td>
                <td class="font-bold text-teal">₹{{ p.amount | number }}</td>
                <td>
                  <span class="badge badge-success">Completed</span>
                </td>
                <td>
                  <button class="btn btn-sm btn-outline" (click)="viewReceipt(p)">
                    <i class="fa-solid fa-file-invoice"></i> Receipt
                  </button>
                </td>
              </tr>
              <tr *ngIf="myPayments().length === 0">
                <td colspan="8" class="text-center py-4">No payments recorded.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Payment Receipt Modal -->
      <div class="modal-overlay" *ngIf="selectedPayment()" (click)="closeModal()">
        <div class="modal-dialog" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h3 class="modal-title">
              <i class="fa-solid fa-receipt text-teal"></i> Official Payment Receipt
            </h3>
            <button class="modal-close" (click)="closeModal()">&times;</button>
          </div>

          <div class="modal-body" *ngIf="selectedPayment() as pay">
            <div class="receipt-box">
              <div class="receipt-header">
                <div class="receipt-logo">
                  <i class="fa-solid fa-shield-halved"></i> E-INSURANCE
                </div>
                <div class="receipt-status-badge">
                  PAID
                </div>
              </div>

              <div class="receipt-divider"></div>

              <div class="receipt-grid">
                <div class="receipt-field">
                  <span>Receipt No:</span>
                  <strong>RCP-{{ pay.paymentId }}-{{ pay.policyId }}</strong>
                </div>
                <div class="receipt-field">
                  <span>Txn Reference:</span>
                  <strong>{{ pay.transactionRef }}</strong>
                </div>
                <div class="receipt-field">
                  <span>Policy Number:</span>
                  <strong>#POL-{{ pay.policyId }}</strong>
                </div>
                <div class="receipt-field">
                  <span>Payment Date:</span>
                  <strong>{{ pay.paymentDate }}</strong>
                </div>
                <div class="receipt-field">
                  <span>Payment Channel:</span>
                  <strong>{{ pay.paymentMethod }}</strong>
                </div>
                <div class="receipt-field">
                  <span>Payer Name:</span>
                  <strong>{{ customerName() }}</strong>
                </div>
              </div>

              <div class="receipt-total-box">
                <span>Total Amount Paid:</span>
                <span class="total-val">₹{{ pay.amount | number }}</span>
              </div>
            </div>
          </div>

          <div class="modal-footer">
            <button class="btn btn-secondary" (click)="closeModal()">Close</button>
            <button class="btn btn-primary" (click)="print()">
              <i class="fa-solid fa-print"></i> Print Receipt
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .py-4 { padding-top: 2rem; padding-bottom: 2rem; }
    .mb-4 { margin-bottom: 1.5rem; }
    .font-bold { font-weight: 700; }
    .text-primary { color: var(--primary-600); }
    .text-teal { color: var(--teal-600); }
    .font-md { font-size: 1.25rem !important; }

    .receipt-box {
      background: #fafafa;
      border: 1.5px dashed var(--slate-300);
      border-radius: var(--radius-md);
      padding: 1.5rem;
    }

    .receipt-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
    }

    .receipt-logo {
      font-weight: 800;
      color: #0f172a;
      display: flex;
      align-items: center;
      gap: 0.4rem;
      letter-spacing: 0.05em;
    }

    .receipt-status-badge {
      background: var(--success-50);
      color: var(--success-600);
      border: 1px solid var(--success-500);
      font-weight: 800;
      font-size: 0.75rem;
      padding: 0.2rem 0.6rem;
      border-radius: 4px;
    }

    .receipt-divider {
      height: 1px;
      background: var(--slate-200);
      margin: 1rem 0;
    }

    .receipt-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
      margin-bottom: 1.5rem;
    }

    .receipt-field {
      display: flex;
      flex-direction: column;
    }

    .receipt-field span {
      font-size: 0.75rem;
      color: var(--slate-500);
    }

    .receipt-field strong {
      font-size: 0.9rem;
      color: var(--slate-800);
    }

    .receipt-total-box {
      background: #ffffff;
      padding: 1rem;
      border-radius: var(--radius-sm);
      border: 1px solid var(--slate-200);
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-weight: 700;
    }

    .total-val {
      font-size: 1.35rem;
      color: var(--teal-600);
      font-weight: 800;
    }
  `]
})
export class PaymentsComponent {
  private authService = inject(AuthService);
  private insuranceService = inject(InsuranceService);

  customerId = computed(() => this.authService.currentUser()?.customerId || 1);
  customerName = computed(() => this.authService.currentUser()?.fullName || 'Rahul Verma');
  myPayments = computed(() => this.insuranceService.getPaymentsByCustomer(this.customerId()));

  totalPaid = computed(() =>
    this.myPayments().reduce((sum, p) => sum + (p.amount || 0), 0)
  );

  latestPaymentDate = computed(() => {
    const list = this.myPayments();
    return list.length > 0 ? list[0].paymentDate : 'N/A';
  });

  selectedPayment = signal<Payment | null>(null);

  viewReceipt(payment: Payment): void {
    this.selectedPayment.set(payment);
  }

  closeModal(): void {
    this.selectedPayment.set(null);
  }

  print(): void {
    window.print();
  }
}
