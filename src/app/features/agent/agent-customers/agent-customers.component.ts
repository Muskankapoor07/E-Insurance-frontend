import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';
import { InsuranceService } from '../../../core/services/insurance.service';

@Component({
  selector: 'app-agent-customers',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container py-4">
      <div class="page-header">
        <div>
          <h1 class="page-title">
            <i class="fa-solid fa-users text-primary"></i> My Assigned Clients Roster
          </h1>
          <p class="page-subtitle">Clients linked to your advisor account (InsuranceAgent 1 -> * Customer relationship).</p>
        </div>
      </div>

      <div class="card">
        <div class="table-responsive">
          <table class="table">
            <thead>
              <tr>
                <th>Customer ID</th>
                <th>Client Name</th>
                <th>Email Address</th>
                <th>Phone Number</th>
                <th>Date of Birth</th>
                <th>Active Policies</th>
                <th>Address</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let c of clients()">
                <td><strong>#CUST-{{ c.customerId }}</strong></td>
                <td class="font-bold">{{ c.fullName }}</td>
                <td>{{ c.email }}</td>
                <td>{{ c.phone }}</td>
                <td>{{ c.dateOfBirth }}</td>
                <td>
                  <span class="badge badge-primary">
                    {{ getClientPoliciesCount(c.customerId) }} Active Policies
                  </span>
                </td>
                <td class="small-text text-muted">{{ c.address || 'Bengaluru, India' }}</td>
              </tr>
              <tr *ngIf="clients().length === 0">
                <td colspan="7" class="text-center py-4">No clients assigned to your account.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .py-4 { padding-top: 2rem; padding-bottom: 2rem; }
    .font-bold { font-weight: 700; }
    .text-primary { color: var(--primary-600); }
    .small-text { font-size: 0.8rem; }
    .text-muted { color: var(--slate-500); }
  `]
})
export class AgentCustomersComponent {
  private authService = inject(AuthService);
  private insuranceService = inject(InsuranceService);

  agentId = computed(() => this.authService.currentUser()?.agentId || 1);
  clients = computed(() => this.insuranceService.getAgentCustomers(this.agentId()));

  getClientPoliciesCount(customerId: number): number {
    return this.insuranceService.getCustomerPolicies(customerId).length;
  }
}
