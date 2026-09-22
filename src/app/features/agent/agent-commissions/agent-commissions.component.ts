import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';
import { InsuranceService } from '../../../core/services/insurance.service';

@Component({
  selector: 'app-agent-commissions',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container py-4">
      <div class="page-header">
        <div>
          <h1 class="page-title">
            <i class="fa-solid fa-coins text-warning"></i> My Commission Statements & Payouts
          </h1>
          <p class="page-subtitle">Track individual commission credits generated across all policies sold.</p>
        </div>
      </div>

      <!-- Stat Summary -->
      <div class="grid-3 mb-4">
        <div class="stat-card">
          <div class="stat-icon warning">
            <i class="fa-solid fa-hand-holding-dollar"></i>
          </div>
          <div class="stat-info">
            <span class="stat-label">Total Commission Received</span>
            <span class="stat-value text-warning">₹{{ totalCommission() | number }}</span>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon emerald">
            <i class="fa-solid fa-circle-check"></i>
          </div>
          <div class="stat-info">
            <span class="stat-label">Disbursed Payouts</span>
            <span class="stat-value">{{ commissions().length }}</span>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon primary">
            <i class="fa-solid fa-percent"></i>
          </div>
          <div class="stat-info">
            <span class="stat-label">Base Payout Rate</span>
            <span class="stat-value">10.0%</span>
          </div>
        </div>
      </div>

      <!-- Commission Table -->
      <div class="card">
        <div class="table-responsive">
          <table class="table">
            <thead>
              <tr>
                <th>Commission ID</th>
                <th>Policy ID</th>
                <th>Commission Amount</th>
                <th>Disbursement Date</th>
                <th>Payout Status</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let c of commissions()">
                <td><strong>#COM-{{ c.commissionId }}</strong></td>
                <td><strong>#POL-{{ c.policyId }}</strong></td>
                <td class="font-bold text-teal">₹{{ c.commissionAmount | number }}</td>
                <td>{{ c.createdAt | date:'mediumDate' }}</td>
                <td><span class="badge badge-success">{{ c.status || 'Disbursed' }}</span></td>
              </tr>
              <tr *ngIf="commissions().length === 0">
                <td colspan="5" class="text-center py-4">No commissions recorded yet.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .py-4 { padding-top: 2rem; padding-bottom: 2rem; }
    .mb-4 { margin-bottom: 1.5rem; }
    .font-bold { font-weight: 700; }
    .text-warning { color: var(--warning-600); }
    .text-teal { color: var(--teal-600); }
  `]
})
export class AgentCommissionsComponent {
  private authService = inject(AuthService);
  private insuranceService = inject(InsuranceService);

  agentId = computed(() => this.authService.currentUser()?.agentId || 1);
  commissions = computed(() => this.insuranceService.getAgentCommissions(this.agentId()));

  totalCommission = computed(() =>
    this.commissions().reduce((sum, c) => sum + (c.commissionAmount || 0), 0)
  );
}
