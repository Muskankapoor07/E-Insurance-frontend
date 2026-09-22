import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { InsuranceService } from '../../../core/services/insurance.service';
import { CalculatorService } from '../../../core/services/calculator.service';
import { Scheme } from '../../../core/models/models';

@Component({
  selector: 'app-buy-policy',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container">
      <div class="page-header">
        <div>
          <h1 class="page-title">
            <i class="fa-solid fa-cart-plus text-primary"></i> Buy an Insurance Policy
          </h1>
          <p class="page-subtitle">Choose a scheme below and purchase your policy in seconds.</p>
        </div>
      </div>

      <!-- Schemes Grid -->
      <div class="grid-2">
        <div class="card scheme-card" *ngFor="let s of schemes()">
          <div class="card-header">
            <h3 class="card-title">{{ s.schemeName }}</h3>
            <span class="badge badge-primary">{{ s.baseInterestRate || 7.5 }}% ROI</span>
          </div>

          <p class="scheme-desc">{{ s.schemeDetails }}</p>

          <div class="specs-box">
            <div class="spec-row">
              <span class="lbl">Plan Category:</span>
              <strong>{{ getPlanName(s.planId) }}</strong>
            </div>
            <div class="spec-row">
              <span class="lbl">Sum Assured Range:</span>
              <span>₹{{ (s.minSumAssured || 500000) | number }} - ₹{{ (s.maxSumAssured || 10000000) | number }}</span>
            </div>
            <div class="spec-row">
              <span class="lbl">Eligible Age:</span>
              <span>{{ s.minAge || 18 }} to {{ s.maxAge || 65 }} years</span>
            </div>
          </div>

          <div style="margin-top: 1rem;">
            <button class="btn btn-primary" style="width: 100%;" (click)="openBuyModal(s)">
              <i class="fa-solid fa-check"></i> Select & Buy This Scheme
            </button>
          </div>
        </div>
      </div>

      <!-- Simple Buy Modal -->
      <div class="modal-overlay" *ngIf="selectedScheme()" (click)="closeModal()">
        <div class="modal-dialog" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h3 class="modal-title">Purchase Policy: {{ selectedScheme()?.schemeName }}</h3>
            <button class="modal-close" (click)="closeModal()">&times;</button>
          </div>

          <div class="modal-body">
            <!-- Sum Assured -->
            <div class="form-group">
              <label class="form-label">Coverage Amount (Sum Assured in ₹)</label>
              <input
                type="number"
                class="form-control"
                [(ngModel)]="sumAssured"
                (input)="calculateQuote()"
                min="500000"
                step="100000" />
            </div>

            <!-- Tenure -->
            <div class="form-group">
              <label class="form-label">Policy Tenure (Years)</label>
              <select class="form-select" [(ngModel)]="tenureYears" (change)="calculateQuote()">
                <option [value]="5">5 Years</option>
                <option [value]="10">10 Years</option>
                <option [value]="15">15 Years</option>
                <option [value]="20">20 Years</option>
                <option [value]="25">25 Years</option>
              </select>
            </div>

            <!-- Nominee Name -->
            <div class="form-group">
              <label class="form-label">Nominee Name</label>
              <input
                type="text"
                class="form-control"
                [(ngModel)]="nomineeName"
                placeholder="e.g. Sunita Verma" />
            </div>

            <!-- Nominee Relation -->
            <div class="form-group">
              <label class="form-label">Nominee Relation</label>
              <select class="form-select" [(ngModel)]="nomineeRelation">
                <option value="Spouse">Spouse</option>
                <option value="Child">Son / Daughter</option>
                <option value="Parent">Father / Mother</option>
                <option value="Sibling">Brother / Sister</option>
              </select>
            </div>

            <!-- Quote Calculation Box -->
            <div class="quote-summary">
              <div class="quote-row">
                <span>Annual Premium Payable:</span>
                <strong class="quote-price">₹{{ calculatedPremium() | number }}</strong>
              </div>
              <div class="quote-row" style="font-size: 0.8rem; color: var(--gray-500); margin-top: 0.25rem;">
                <span>Estimated Maturity Payout:</span>
                <span>₹{{ estimatedMaturity() | number }}</span>
              </div>
            </div>
          </div>

          <div class="modal-footer">
            <button class="btn btn-secondary" (click)="closeModal()">Cancel</button>
            <button class="btn btn-success" (click)="confirmPurchase()" [disabled]="!nomineeName">
              <i class="fa-solid fa-lock"></i> Pay ₹{{ calculatedPremium() | number }} & Complete Purchase
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .text-primary { color: var(--primary); }
    .scheme-card {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }
    .scheme-desc {
      font-size: 0.85rem;
      color: var(--gray-600);
      margin-bottom: 1rem;
    }
    .specs-box {
      background: var(--gray-50);
      border: 1px solid var(--gray-200);
      border-radius: var(--radius-sm);
      padding: 0.75rem;
      display: flex;
      flex-direction: column;
      gap: 0.35rem;
      font-size: 0.85rem;
    }
    .spec-row {
      display: flex;
      justify-content: space-between;
    }
    .lbl { color: var(--gray-500); }
    .quote-summary {
      background: var(--primary-light);
      border: 1px solid rgba(37, 99, 235, 0.2);
      border-radius: var(--radius-sm);
      padding: 0.85rem;
      margin-top: 1rem;
    }
    .quote-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .quote-price {
      font-size: 1.25rem;
      color: var(--primary);
    }
  `]
})
export class BuyPolicyComponent {
  private authService = inject(AuthService);
  private insuranceService = inject(InsuranceService);
  private calculatorService = inject(CalculatorService);
  private router = inject(Router);

  schemes = this.insuranceService.schemes;
  plans = this.insuranceService.plans;

  selectedScheme = signal<Scheme | null>(null);
  sumAssured = 2500000;
  tenureYears = 10;
  nomineeName = 'Sunita Verma';
  nomineeRelation = 'Spouse';

  calculatedPremium = signal(12500);
  estimatedMaturity = signal(4200000);

  getPlanName(planId: number): string {
    return this.plans().find(p => p.planId === planId)?.planName || 'General Plan';
  }

  openBuyModal(scheme: Scheme): void {
    this.selectedScheme.set(scheme);
    this.sumAssured = scheme.minSumAssured || 2000000;
    this.tenureYears = scheme.minMaturityYears || 10;
    this.calculateQuote();
  }

  closeModal(): void {
    this.selectedScheme.set(null);
  }

  calculateQuote(): void {
    const s = this.selectedScheme();
    if (!s) return;

    const res = this.calculatorService.calculatePremium({
      schemeId: s.schemeId,
      age: 30,
      maturityPeriodYears: Number(this.tenureYears),
      sumAssured: Number(this.sumAssured),
      rateOfInterest: s.baseInterestRate || 7.5
    });

    this.calculatedPremium.set(res.annualPremium);
    this.estimatedMaturity.set(res.totalMaturityAmount);
  }

  confirmPurchase(): void {
    const s = this.selectedScheme();
    if (!s) return;

    const customerId = this.authService.currentUser()?.customerId || 1;
    const { policy } = this.insuranceService.purchasePolicy({
      customerId,
      schemeId: s.schemeId,
      policyDetails: `${s.schemeName} - ${this.tenureYears} Years`,
      premium: this.calculatedPremium(),
      maturityPeriod: Number(this.tenureYears),
      sumAssured: Number(this.sumAssured),
      nomineeName: this.nomineeName,
      nomineeRelation: this.nomineeRelation,
      paymentMethod: 'UPI / NetBanking'
    });

    alert(`Policy #POL-${policy.policyId} purchased successfully! Your policy is now active.`);
    this.closeModal();
    this.router.navigate(['/customer/my-policies']);
  }
}
