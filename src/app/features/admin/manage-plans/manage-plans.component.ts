import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InsuranceService } from '../../../core/services/insurance.service';
import { InsurancePlan, Scheme } from '../../../core/models/models';

@Component({
  selector: 'app-manage-plans',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container py-4">
      <div class="page-header">
        <div>
          <h1 class="page-title">
            <i class="fa-solid fa-layer-group text-primary"></i> Insurance Plans & Schemes Architecture
          </h1>
          <p class="page-subtitle">Manage top-level Insurance Plans and their child Scheme catalog (1-to-many relationship).</p>
        </div>
        <div class="d-flex gap-2">
          <button class="btn btn-primary" (click)="openAddSchemeModal()">
            <i class="fa-solid fa-plus"></i> Add New Scheme
          </button>
          <button class="btn btn-outline" (click)="openAddPlanModal()">
            <i class="fa-solid fa-folder-plus"></i> Add Plan Category
          </button>
        </div>
      </div>

      <!-- Plan Cards with Schemes accordion/list -->
      <div class="plans-container">
        <div class="card plan-card mb-4" *ngFor="let plan of plans()">
          <div class="plan-header">
            <div class="plan-title-box">
              <div class="plan-icon">
                <i class="fa-solid" [ngClass]="plan.icon || 'fa-shield-halved'"></i>
              </div>
              <div>
                <h2>{{ plan.planName }}</h2>
                <p>{{ plan.planDetails }}</p>
              </div>
            </div>
            <span class="badge badge-primary">
              {{ getSchemesForPlan(plan.planId).length }} Schemes
            </span>
          </div>

          <div class="schemes-table-wrap">
            <h4 class="schemes-heading"><i class="fa-solid fa-list-ul text-teal"></i> Schemes under this Plan:</h4>
            <div class="table-responsive">
              <table class="table">
                <thead>
                  <tr>
                    <th>Scheme ID</th>
                    <th>Scheme Title & Details</th>
                    <th>Sum Assured Limit</th>
                    <th>Age Bracket</th>
                    <th>Base Interest Rate</th>
                    <th>Tenure</th>
                  </tr>
                </thead>
                <tbody>
                  <tr *ngFor="let s of getSchemesForPlan(plan.planId)">
                    <td><strong>#SCH-{{ s.schemeId }}</strong></td>
                    <td>
                      <div class="font-bold">{{ s.schemeName }}</div>
                      <div class="text-muted small-text">{{ s.schemeDetails }}</div>
                    </td>
                    <td>₹{{ (s.minSumAssured || 500000) / 100000 }}L - ₹{{ (s.maxSumAssured || 10000000) / 10000000 }}Cr</td>
                    <td>{{ s.minAge || 18 }} - {{ s.maxAge || 65 }} yrs</td>
                    <td class="font-bold text-teal">{{ s.baseInterestRate }}% p.a.</td>
                    <td>{{ s.minMaturityYears }}-{{ s.maxMaturityYears }} Yrs</td>
                  </tr>
                  <tr *ngIf="getSchemesForPlan(plan.planId).length === 0">
                    <td colspan="6" class="text-center py-3 text-muted">No schemes enrolled under this plan yet.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <!-- ADD PLAN MODAL -->
      <div class="modal-overlay" *ngIf="showPlanModal()" (click)="showPlanModal.set(false)">
        <div class="modal-dialog" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h3 class="modal-title">Create Insurance Plan Category</h3>
            <button class="modal-close" (click)="showPlanModal.set(false)">&times;</button>
          </div>
          <div class="modal-body">
            <div class="form-group">
              <label class="form-label">Plan Name</label>
              <input type="text" class="form-control" [(ngModel)]="newPlan.planName" placeholder="e.g. Travel & Global Mobility" />
            </div>
            <div class="form-group">
              <label class="form-label">Plan Details</label>
              <textarea class="form-control" [(ngModel)]="newPlan.planDetails" rows="3"></textarea>
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary" (click)="showPlanModal.set(false)">Cancel</button>
            <button class="btn btn-primary" (click)="savePlan()">Create Plan</button>
          </div>
        </div>
      </div>

      <!-- ADD SCHEME MODAL -->
      <div class="modal-overlay" *ngIf="showSchemeModal()" (click)="showSchemeModal.set(false)">
        <div class="modal-dialog modal-lg" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h3 class="modal-title">Create Insurance Scheme</h3>
            <button class="modal-close" (click)="showSchemeModal.set(false)">&times;</button>
          </div>
          <div class="modal-body">
            <div class="form-group">
              <label class="form-label">Parent Insurance Plan</label>
              <select class="form-select" [(ngModel)]="newScheme.planId">
                <option *ngFor="let p of plans()" [value]="p.planId">{{ p.planName }}</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">Scheme Title</label>
              <input type="text" class="form-control" [(ngModel)]="newScheme.schemeName" placeholder="e.g. Executive Platinum Shield" />
            </div>
            <div class="form-group">
              <label class="form-label">Scheme Description</label>
              <textarea class="form-control" [(ngModel)]="newScheme.schemeDetails" rows="2"></textarea>
            </div>
            <div class="grid-2">
              <div class="form-group">
                <label class="form-label">Base Growth / Interest Rate (%)</label>
                <input type="number" class="form-control" [(ngModel)]="newScheme.baseInterestRate" step="0.1" />
              </div>
              <div class="form-group">
                <label class="form-label">Min Sum Assured (₹)</label>
                <input type="number" class="form-control" [(ngModel)]="newScheme.minSumAssured" step="100000" />
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary" (click)="showSchemeModal.set(false)">Cancel</button>
            <button class="btn btn-primary" (click)="saveScheme()">Create Scheme</button>
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
    .text-muted { color: var(--slate-500); }
    .small-text { font-size: 0.8rem; }
    .d-flex { display: flex; }
    .gap-2 { gap: 0.75rem; }

    .plan-card {
      border: 1px solid var(--slate-200);
      padding: 1.5rem;
    }

    .plan-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 1.25rem;
    }

    .plan-title-box {
      display: flex;
      gap: 1rem;
      align-items: center;
    }

    .plan-icon {
      width: 48px;
      height: 48px;
      border-radius: 12px;
      background: var(--primary-50);
      color: var(--primary-600);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.35rem;
      flex-shrink: 0;
    }

    .plan-title-box h2 {
      font-size: 1.3rem;
      font-weight: 800;
      color: var(--slate-900);
    }

    .plan-title-box p {
      font-size: 0.85rem;
      color: var(--slate-500);
      max-width: 700px;
    }

    .schemes-heading {
      font-size: 0.95rem;
      font-weight: 700;
      color: var(--slate-700);
      margin-bottom: 0.5rem;
      display: flex;
      align-items: center;
      gap: 0.4rem;
    }
  `]
})
export class ManagePlansComponent {
  private insuranceService = inject(InsuranceService);

  plans = this.insuranceService.plans;
  schemes = this.insuranceService.schemes;

  showPlanModal = signal(false);
  showSchemeModal = signal(false);

  newPlan = {
    planName: '',
    planDetails: '',
    icon: 'fa-umbrella'
  };

  newScheme = {
    planId: 1,
    schemeName: '',
    schemeDetails: '',
    baseInterestRate: 7.5,
    minSumAssured: 1000000,
    maxSumAssured: 10000000,
    minAge: 18,
    maxAge: 65,
    minMaturityYears: 10,
    maxMaturityYears: 30
  };

  getSchemesForPlan(planId: number): Scheme[] {
    return this.insuranceService.getSchemesByPlan(planId);
  }

  openAddPlanModal(): void {
    this.newPlan = { planName: '', planDetails: '', icon: 'fa-umbrella' };
    this.showPlanModal.set(true);
  }

  openAddSchemeModal(): void {
    this.newScheme = {
      planId: 1,
      schemeName: '',
      schemeDetails: '',
      baseInterestRate: 7.5,
      minSumAssured: 1000000,
      maxSumAssured: 10000000,
      minAge: 18,
      maxAge: 65,
      minMaturityYears: 10,
      maxMaturityYears: 30
    };
    this.showSchemeModal.set(true);
  }

  savePlan(): void {
    if (!this.newPlan.planName) return;
    this.insuranceService.addPlan(this.newPlan);
    this.showPlanModal.set(false);
  }

  saveScheme(): void {
    if (!this.newScheme.schemeName) return;
    this.insuranceService.addScheme({
      ...this.newScheme,
      planId: Number(this.newScheme.planId)
    });
    this.showSchemeModal.set(false);
  }
}
