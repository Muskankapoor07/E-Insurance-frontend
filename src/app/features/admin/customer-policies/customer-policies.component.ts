import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InsuranceService } from '../../../core/services/insurance.service';
import { Customer, Policy, Payment } from '../../../core/models/models';

@Component({
  selector: 'app-customer-policies',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container py-4">
      <div class="page-header">
        <div>
          <h1 class="page-title">
            <i class="fa-solid fa-users-viewfinder text-primary"></i> Customer Policies & Audit (Admin)
          </h1>
          <p class="page-subtitle">Search customer profiles to inspect their registered policies, sum assured, lapse dates, and full payment audit.</p>
        </div>
      </div>

      <!-- Customer Search & Filter Bar -->
      <div class="card search-card mb-4">
        <div class="card-header">
          <h2 class="card-title">
            <i class="fa-solid fa-magnifying-glass text-teal"></i> Search & Select Customer
          </h2>
          <span class="badge badge-info">{{ customers().length }} Registered Customers</span>
        </div>

        <div class="search-flex-row">
          <div class="search-input-wrapper">
            <i class="fa-solid fa-search"></i>
            <input
              type="text"
              class="search-input"
              [(ngModel)]="searchQuery"
              placeholder="Search customer by name, email, or phone..." />
          </div>

          <div class="select-wrapper">
            <select class="form-select" [ngModel]="selectedCustomerId()" (ngModelChange)="selectCustomerById($event)">
              <option [value]="null">-- Select a Customer from list --</option>
              <option *ngFor="let c of filteredCustomers()" [value]="c.customerId">
                {{ c.fullName }} ({{ c.email }})
              </option>
            </select>
          </div>

          <button class="btn btn-secondary" (click)="clearSelection()">
            <i class="fa-solid fa-xmark"></i> Clear
          </button>
        </div>
      </div>

      <!-- Customer Profile Summary (When Selected) -->
      <div class="card customer-summary-card mb-4" *ngIf="selectedCustomer() as customer">
        <div class="customer-header">
          <div class="cust-avatar">{{ customer.fullName.charAt(0) }}</div>
          <div class="cust-meta">
            <div class="title-badge-row">
              <h2>{{ customer.fullName }}</h2>
              <span class="badge badge-primary">ID: #CUST-{{ customer.customerId }}</span>
            </div>
            <div class="meta-row">
              <span><i class="fa-solid fa-envelope"></i> {{ customer.email }}</span>
              <span><i class="fa-solid fa-phone"></i> {{ customer.phone }}</span>
              <span><i class="fa-solid fa-cake-candles"></i> DOB: {{ customer.dateOfBirth }}</span>
              <span *ngIf="customer.agentId">
                <i class="fa-solid fa-user-tie"></i> Agent: {{ getAgentName(customer.agentId) }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Policies for Selected Customer -->
      <div class="card mb-4" *ngIf="selectedCustomer()">
        <div class="card-header">
          <h3 class="card-title">
            <i class="fa-solid fa-file-contract text-primary"></i> Policies Held by {{ selectedCustomer()?.fullName }} ({{ customerPolicies().length }})
          </h3>
        </div>

        <div class="table-responsive" *ngIf="customerPolicies().length > 0">
          <table class="table">
            <thead>
              <tr>
                <th>Policy ID</th>
                <th>Scheme Name</th>
                <th>Coverage Sum</th>
                <th>Premium</th>
                <th>Issued Date</th>
                <th>Tenure</th>
                <th>Lapse Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let p of customerPolicies()">
                <td><strong>#POL-{{ p.policyId }}</strong></td>
                <td>
                  <div class="scheme-name font-bold">{{ p.scheme?.schemeName || 'Scheme #' + p.schemeId }}</div>
                  <div class="small-text text-muted">{{ p.policyDetails }}</div>
                </td>
                <td>₹{{ (p.sumAssured || 1000000) | number }}</td>
                <td class="font-bold text-teal">₹{{ p.premium | number }}</td>
                <td>{{ p.dateIssued }}</td>
                <td>{{ p.maturityPeriod }} Yrs</td>
                <td>{{ p.policyLapseDate }}</td>
                <td><span class="badge badge-active">{{ p.status }}</span></td>
                <td>
                  <button class="btn btn-sm btn-outline" (click)="viewPolicyPayments(p)">
                    <i class="fa-solid fa-clock-rotate-left"></i> Payments ({{ getPaymentsForPolicy(p.policyId).length }})
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="empty-state" *ngIf="customerPolicies().length === 0">
          <p class="text-muted">No policies registered for this customer yet.</p>
        </div>
      </div>

      <!-- ALL POLICIES OVERVIEW (If No Customer Selected) -->
      <div class="card" *ngIf="!selectedCustomer()">
        <div class="card-header">
          <h3 class="card-title">
            <i class="fa-solid fa-list text-primary"></i> All System Enrolled Policies ({{ allPolicies().length }})
          </h3>
          <span class="badge badge-neutral">Displaying All</span>
        </div>

        <div class="table-responsive">
          <table class="table">
            <thead>
              <tr>
                <th>Policy ID</th>
                <th>Customer Name</th>
                <th>Scheme</th>
                <th>Sum Assured</th>
                <th>Annual Premium</th>
                <th>Issued</th>
                <th>Maturity</th>
                <th>Status</th>
                <th>Audit</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let p of allPolicies()">
                <td><strong>#POL-{{ p.policyId }}</strong></td>
                <td>
                  <div class="font-bold">{{ p.customer?.fullName || 'Customer #' + p.customerId }}</div>
                  <div class="small-text text-muted">{{ p.customer?.email }}</div>
                </td>
                <td>{{ p.scheme?.schemeName }}</td>
                <td>₹{{ (p.sumAssured || 1000000) | number }}</td>
                <td class="font-bold text-teal">₹{{ p.premium | number }}</td>
                <td>{{ p.dateIssued }}</td>
                <td>{{ p.policyLapseDate }}</td>
                <td><span class="badge badge-active">{{ p.status }}</span></td>
                <td>
                  <button class="btn btn-sm btn-outline" (click)="viewPolicyPayments(p)">
                    <i class="fa-solid fa-receipt"></i> Audit
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Policy Payments Audit Modal -->
      <div class="modal-overlay" *ngIf="inspectPolicy()" (click)="closeModal()">
        <div class="modal-dialog modal-lg" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h3 class="modal-title">
              <i class="fa-solid fa-shield-halved text-primary"></i> Payment Audit for Policy #POL-{{ inspectPolicy()?.policyId }}
            </h3>
            <button class="modal-close" (click)="closeModal()">&times;</button>
          </div>

          <div class="modal-body" *ngIf="inspectPolicy() as pol">
            <div class="modal-grid-summary mb-3">
              <div><strong>Scheme:</strong> {{ pol.scheme?.schemeName }}</div>
              <div><strong>Customer:</strong> {{ pol.customer?.fullName }}</div>
              <div><strong>Annual Premium:</strong> ₹{{ pol.premium | number }}</div>
              <div><strong>Lapse Date:</strong> {{ pol.policyLapseDate }}</div>
            </div>

            <h4 class="font-bold mb-2">Transaction Ledger</h4>
            <div class="table-responsive">
              <table class="table">
                <thead>
                  <tr>
                    <th>Payment ID</th>
                    <th>Transaction Ref</th>
                    <th>Date</th>
                    <th>Method</th>
                    <th>Amount</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr *ngFor="let pay of modalPayments()">
                    <td>#PAY-{{ pay.paymentId }}</td>
                    <td><code>{{ pay.transactionRef }}</code></td>
                    <td>{{ pay.paymentDate }}</td>
                    <td>{{ pay.paymentMethod || 'NetBanking' }}</td>
                    <td class="font-bold text-teal">₹{{ pay.amount | number }}</td>
                    <td><span class="badge badge-success">Completed</span></td>
                  </tr>
                  <tr *ngIf="modalPayments().length === 0">
                    <td colspan="6" class="text-center py-3">No payments recorded.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div class="modal-footer">
            <button class="btn btn-secondary" (click)="closeModal()">Close</button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .py-4 { padding-top: 2rem; padding-bottom: 2rem; }
    .mb-4 { margin-bottom: 1.5rem; }
    .mb-3 { margin-bottom: 1rem; }
    .mb-2 { margin-bottom: 0.5rem; }
    .font-bold { font-weight: 700; }
    .text-primary { color: var(--primary-600); }
    .text-teal { color: var(--teal-600); }
    .text-muted { color: var(--slate-500); }
    .small-text { font-size: 0.75rem; }

    .search-flex-row {
      display: flex;
      gap: 1rem;
      align-items: center;
      flex-wrap: wrap;
    }

    .search-input-wrapper {
      position: relative;
      flex: 1.5;
      min-width: 260px;
    }

    .search-input-wrapper i {
      position: absolute;
      left: 0.9rem;
      top: 50%;
      transform: translateY(-50%);
      color: var(--slate-400);
    }

    .search-input {
      width: 100%;
      padding: 0.65rem 0.9rem 0.65rem 2.4rem;
      border: 1.5px solid var(--slate-200);
      border-radius: var(--radius-md);
      font-size: 0.95rem;
    }

    .select-wrapper {
      flex: 1.2;
      min-width: 240px;
    }

    .customer-summary-card {
      background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
      border: 1px solid var(--primary-200);
    }

    .customer-header {
      display: flex;
      align-items: center;
      gap: 1.25rem;
    }

    .cust-avatar {
      width: 56px;
      height: 56px;
      border-radius: 50%;
      background: var(--primary-600);
      color: #ffffff;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.6rem;
      font-weight: 800;
    }

    .cust-meta h2 {
      font-size: 1.35rem;
      font-weight: 800;
      color: var(--slate-900);
    }

    .title-badge-row {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      margin-bottom: 0.35rem;
    }

    .meta-row {
      display: flex;
      gap: 1.25rem;
      font-size: 0.85rem;
      color: var(--slate-600);
      flex-wrap: wrap;
    }

    .meta-row span {
      display: flex;
      align-items: center;
      gap: 0.4rem;
    }

    .modal-grid-summary {
      background: var(--slate-50);
      padding: 1rem;
      border-radius: var(--radius-md);
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 0.75rem;
      font-size: 0.9rem;
    }

    .empty-state {
      padding: 2.5rem;
      text-align: center;
    }
  `]
})
export class CustomerPoliciesComponent {
  private insuranceService = inject(InsuranceService);

  customers = this.insuranceService.customers;
  searchQuery = '';
  selectedCustomerId = signal<number | null>(1);

  filteredCustomers = computed(() => {
    const q = this.searchQuery.toLowerCase().trim();
    if (!q) return this.customers();
    return this.customers().filter(c =>
      c.fullName.toLowerCase().includes(q) ||
      c.email.toLowerCase().includes(q) ||
      c.phone.includes(q)
    );
  });

  selectedCustomer = computed(() => {
    const id = this.selectedCustomerId();
    if (!id) return null;
    return this.customers().find(c => c.customerId === Number(id)) || null;
  });

  customerPolicies = computed(() => {
    const c = this.selectedCustomer();
    if (!c) return [];
    return this.insuranceService.getCustomerPolicies(c.customerId);
  });

  allPolicies = computed(() => this.insuranceService.getAllPoliciesEnriched());

  inspectPolicy = signal<Policy | null>(null);
  modalPayments = computed(() => {
    const p = this.inspectPolicy();
    return p ? this.insuranceService.getPaymentsByPolicy(p.policyId) : [];
  });

  selectCustomerById(id: any): void {
    this.selectedCustomerId.set(id ? Number(id) : null);
  }

  clearSelection(): void {
    this.selectedCustomerId.set(null);
    this.searchQuery = '';
  }

  getAgentName(agentId: number): string {
    return this.insuranceService.agents().find(a => a.agentId === agentId)?.fullName || 'Agent #' + agentId;
  }

  getPaymentsForPolicy(policyId: number): Payment[] {
    return this.insuranceService.getPaymentsByPolicy(policyId);
  }

  viewPolicyPayments(policy: Policy): void {
    this.inspectPolicy.set(policy);
  }

  closeModal(): void {
    this.inspectPolicy.set(null);
  }
}
