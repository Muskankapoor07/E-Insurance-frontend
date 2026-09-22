import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InsuranceService } from '../../../core/services/insurance.service';
import { CalculatorService } from '../../../core/services/calculator.service';
import { InsuranceAgent, Policy, Commission } from '../../../core/models/models';

@Component({
  selector: 'app-commission-calculator',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container py-4">
      <div class="page-header">
        <div>
          <h1 class="page-title">
            <i class="fa-solid fa-hand-holding-dollar text-primary"></i> Agent Commission Calculator (Admin)
          </h1>
          <p class="page-subtitle">Calculate agent commissions based on policies sold, premium volumes, and disburse payouts.</p>
        </div>
      </div>

      <!-- Agent Selection & Rate Config -->
      <div class="card config-card mb-4">
        <div class="card-header">
          <h2 class="card-title">
            <i class="fa-solid fa-user-check text-teal"></i> Select Insurance Agent & Commission Rate
          </h2>
          <span class="badge badge-info">{{ agents().length }} Registered Agents</span>
        </div>

        <div class="config-grid">
          <div class="form-group">
            <label class="form-label">Select Insurance Agent</label>
            <select
              class="form-select"
              [ngModel]="selectedAgentId()"
              (ngModelChange)="selectedAgentId.set($event ? Number($event) : 1)">
              <option *ngFor="let a of agents()" [value]="a.agentId">
                {{ a.fullName }} ({{ a.email }})
              </option>
            </select>
          </div>

          <div class="form-group">
            <div class="label-row">
              <label class="form-label">Commission Payout Percentage (%)</label>
              <span class="rate-badge">{{ commissionRate() }}%</span>
            </div>
            <select class="form-select" [ngModel]="commissionRate()" (ngModelChange)="commissionRate.set(Number($event))">
              <option [value]="5">5% - Starter Tier</option>
              <option [value]="8">8% - Standard Tier</option>
              <option [value]="10">10% - Prime Tier (Standard)</option>
              <option [value]="12">12% - Senior Advisor Tier</option>
              <option [value]="15">15% - Elite Producer Tier</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Agent Profile & Aggregate Results (When Agent Selected) -->
      <div *ngIf="selectedAgent() as agent">
        <div class="grid-3 mb-4">
          <div class="stat-card">
            <div class="stat-icon primary">
              <i class="fa-solid fa-file-signature"></i>
            </div>
            <div class="stat-info">
              <span class="stat-label">Policies Sold by Agent</span>
              <span class="stat-value">{{ agentPolicies().length }}</span>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-icon teal">
              <i class="fa-solid fa-vault"></i>
            </div>
            <div class="stat-info">
              <span class="stat-label">Total Premium Sourced</span>
              <span class="stat-value">₹{{ totalSourcedPremium() | number }}</span>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-icon warning">
              <i class="fa-solid fa-coins"></i>
            </div>
            <div class="stat-info">
              <span class="stat-label">Calculated Commission ({{ commissionRate() }}%)</span>
              <span class="stat-value text-warning">₹{{ totalCalculatedCommission() | number }}</span>
            </div>
          </div>
        </div>

        <!-- Breakdown Table of Policies Sold -->
        <div class="card mb-4">
          <div class="card-header">
            <h3 class="card-title">
              <i class="fa-solid fa-list-check text-primary"></i> Policies Sourced by {{ agent.fullName }}
            </h3>
            <button
              class="btn btn-primary btn-sm"
              [disabled]="agentPolicies().length === 0"
              (click)="disburseAllCommissions()">
              <i class="fa-solid fa-paper-plane"></i> Disburse Payouts
            </button>
          </div>

          <div class="table-responsive" *ngIf="agentPolicies().length > 0">
            <table class="table">
              <thead>
                <tr>
                  <th>Policy ID</th>
                  <th>Client Name</th>
                  <th>Scheme</th>
                  <th>Policy Premium</th>
                  <th>Rate Applied</th>
                  <th>Commission Amount</th>
                  <th>Issue Date</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let p of agentPolicies()">
                  <td><strong>#POL-{{ p.policyId }}</strong></td>
                  <td>
                    <strong>{{ p.customer?.fullName || 'Customer #' + p.customerId }}</strong>
                  </td>
                  <td>{{ p.scheme?.schemeName || 'Insurance Scheme' }}</td>
                  <td>₹{{ p.premium | number }}</td>
                  <td><span class="badge badge-info">{{ commissionRate() }}%</span></td>
                  <td class="font-bold text-teal">
                    ₹{{ (p.premium * commissionRate() / 100) | number:'1.0-0' }}
                  </td>
                  <td>{{ p.dateIssued }}</td>
                  <td>
                    <button class="btn btn-sm btn-outline" (click)="disburseSingle(p)">
                      <i class="fa-solid fa-check-double"></i> Settle
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="empty-state" *ngIf="agentPolicies().length === 0">
            <p class="text-muted">No policies sold by this agent yet.</p>
          </div>
        </div>

        <!-- Historical Commission Payouts for This Agent -->
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">
              <i class="fa-solid fa-clock-rotate-left text-teal"></i> Commission Payouts Ledger
            </h3>
            <span class="badge badge-success">{{ agentCommissions().length }} Payouts Disbursed</span>
          </div>

          <div class="table-responsive">
            <table class="table">
              <thead>
                <tr>
                  <th>Commission ID</th>
                  <th>Policy Ref</th>
                  <th>Commission Amount</th>
                  <th>Disbursement Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let c of agentCommissions()">
                  <td><strong>#COM-{{ c.commissionId }}</strong></td>
                  <td><strong>#POL-{{ c.policyId }}</strong></td>
                  <td class="font-bold text-teal">₹{{ c.commissionAmount | number }}</td>
                  <td>{{ c.createdAt | date:'mediumDate' }}</td>
                  <td><span class="badge badge-active">{{ c.status || 'Disbursed' }}</span></td>
                </tr>
                <tr *ngIf="agentCommissions().length === 0">
                  <td colspan="5" class="text-center py-3">No commissions recorded for this agent yet.</td>
                </tr>
              </tbody>
            </table>
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
    .text-warning { color: var(--warning-600); }

    .config-grid {
      display: grid;
      grid-template-columns: 1.5fr 1fr;
      gap: 1.5rem;
    }

    .label-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.4rem;
    }

    .rate-badge {
      background: var(--warning-50);
      color: var(--warning-600);
      border: 1px solid var(--warning-500);
      font-weight: 800;
      font-size: 0.8rem;
      padding: 0.15rem 0.5rem;
      border-radius: 999px;
    }

    .empty-state {
      padding: 2.5rem;
      text-align: center;
    }

    @media (max-width: 768px) {
      .config-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class CommissionCalculatorComponent {
  private insuranceService = inject(InsuranceService);
  private calculatorService = inject(CalculatorService);

  Number = Number;
  agents = this.insuranceService.agents;
  selectedAgentId = signal<number>(1);
  commissionRate = signal<number>(10);

  selectedAgent = computed(() =>
    this.agents().find(a => a.agentId === this.selectedAgentId()) || null
  );

  agentPolicies = computed(() => {
    const id = this.selectedAgentId();
    return this.insuranceService.getAgentPolicies(id).map(p => ({
      ...p,
      customer: this.insuranceService.customers().find(c => c.customerId === p.customerId),
      scheme: this.insuranceService.getSchemeById(p.schemeId)
    }));
  });

  agentCommissions = computed(() => {
    const id = this.selectedAgentId();
    return this.insuranceService.getAgentCommissions(id);
  });

  totalSourcedPremium = computed(() =>
    this.agentPolicies().reduce((sum, p) => sum + (p.premium || 0), 0)
  );

  totalCalculatedCommission = computed(() =>
    Math.round(this.totalSourcedPremium() * (this.commissionRate() / 100))
  );

  disburseSingle(policy: Policy): void {
    const commAmt = Math.round((policy.premium * this.commissionRate()) / 100);
    this.insuranceService.recordCommission({
      agentId: this.selectedAgentId(),
      policyId: policy.policyId,
      commissionAmount: commAmt,
      status: 'Disbursed'
    });
    alert(`Commission of ₹${commAmt.toLocaleString()} disbursed for Policy #POL-${policy.policyId}!`);
  }

  disburseAllCommissions(): void {
    const policies = this.agentPolicies();
    let count = 0;
    policies.forEach(p => {
      const commAmt = Math.round((p.premium * this.commissionRate()) / 100);
      this.insuranceService.recordCommission({
        agentId: this.selectedAgentId(),
        policyId: p.policyId,
        commissionAmount: commAmt,
        status: 'Disbursed'
      });
      count++;
    });
    alert(`Successfully disbursed ${count} commission records totaling ₹${this.totalCalculatedCommission().toLocaleString()}!`);
  }
}
