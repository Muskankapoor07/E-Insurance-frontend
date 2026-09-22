import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { InsuranceService } from '../../../core/services/insurance.service';
import { CalculatorService } from '../../../core/services/calculator.service';
import { PremiumCalculationResult } from '../../../core/models/models';

@Component({
  selector: 'app-premium-calculator',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container">
      <div class="page-header">
        <div>
          <h1 class="page-title">
            <i class="fa-solid fa-calculator text-primary"></i> Premium Calculator
          </h1>
          <p class="page-subtitle">Calculate insurance premium and maturity returns based on your age and tenure.</p>
        </div>
      </div>

      <div class="grid-2">
        <!-- Form Inputs Card -->
        <div class="card">
          <div class="card-header">
            <h2 class="card-title">Enter Details</h2>
          </div>

          <!-- Select Scheme -->
          <div class="form-group">
            <label class="form-label">Insurance Scheme</label>
            <select
              class="form-select"
              [(ngModel)]="selectedSchemeId"
              (change)="onSchemeChange()">
              <option *ngFor="let s of schemes()" [value]="s.schemeId">
                {{ s.schemeName }} (ROI: {{ s.baseInterestRate }}%)
              </option>
            </select>
          </div>

          <!-- Age -->
          <div class="form-group">
            <label class="form-label">Your Age (Years)</label>
            <input
              type="number"
              class="form-control"
              [(ngModel)]="age"
              (input)="calculate()"
              min="18"
              max="70" />
            <small class="form-text">Between 18 and 70 years</small>
          </div>

          <!-- Sum Assured -->
          <div class="form-group">
            <label class="form-label">Sum Assured / Coverage (₹)</label>
            <input
              type="number"
              class="form-control"
              [(ngModel)]="sumAssured"
              (input)="calculate()"
              min="500000"
              step="100000" />
            <small class="form-text">e.g. 2500000 (25 Lakhs)</small>
          </div>

          <!-- Tenure -->
          <div class="form-group">
            <label class="form-label">Tenure (Years)</label>
            <input
              type="number"
              class="form-control"
              [(ngModel)]="tenureYears"
              (input)="calculate()"
              min="5"
              max="35" />
          </div>

          <!-- Interest Rate -->
          <div class="form-group">
            <label class="form-label">Expected Growth Rate (% p.a.)</label>
            <input
              type="number"
              class="form-control"
              [(ngModel)]="interestRate"
              (input)="calculate()"
              step="0.1" />
          </div>
        </div>

        <!-- Results Card -->
        <div class="card">
          <div class="card-header">
            <h2 class="card-title">Calculated Premium Summary</h2>
          </div>

          <div class="result-box" *ngIf="result() as res">
            <div class="primary-result">
              <span class="res-lbl">Annual Regular Premium:</span>
              <div class="res-num">₹{{ res.annualPremium | number }} / yr</div>
            </div>

            <div class="sub-results">
              <div class="sub-item">
                <span>Monthly Equivalent:</span>
                <strong>₹{{ res.monthlyPremium | number }} / mo</strong>
              </div>
              <div class="sub-item">
                <span>Quarterly:</span>
                <strong>₹{{ res.quarterlyPremium | number }}</strong>
              </div>
              <div class="sub-item">
                <span>Half-Yearly:</span>
                <strong>₹{{ res.semiAnnualPremium | number }}</strong>
              </div>
            </div>

            <div class="maturity-highlight">
              <span>Estimated Payout at Maturity:</span>
              <div class="maturity-num">₹{{ res.totalMaturityAmount | number }}</div>
              <small style="color: var(--gray-500);">Includes Sum Assured + Compounded Bonuses</small>
            </div>

            <div style="margin-top: 1.5rem;">
              <button class="btn btn-primary" style="width: 100%;" (click)="goToBuy()">
                <i class="fa-solid fa-cart-shopping"></i> Purchase Policy Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .text-primary { color: var(--primary); }
    .result-box {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
    .primary-result {
      background: var(--primary-light);
      border: 1px solid rgba(37, 99, 235, 0.2);
      border-radius: var(--radius-sm);
      padding: 1.25rem;
      text-align: center;
    }
    .res-lbl {
      font-size: 0.85rem;
      color: var(--gray-600);
      font-weight: 600;
    }
    .res-num {
      font-size: 2rem;
      font-weight: 800;
      color: var(--primary);
      margin-top: 0.25rem;
    }
    .sub-results {
      background: var(--gray-50);
      border: 1px solid var(--gray-200);
      border-radius: var(--radius-sm);
      padding: 0.85rem;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      font-size: 0.9rem;
    }
    .sub-item {
      display: flex;
      justify-content: space-between;
    }
    .maturity-highlight {
      background: #f0fdf4;
      border: 1px solid #bbf7d0;
      border-radius: var(--radius-sm);
      padding: 1rem;
      text-align: center;
    }
    .maturity-highlight span {
      font-size: 0.85rem;
      color: #15803d;
      font-weight: 600;
    }
    .maturity-num {
      font-size: 1.5rem;
      font-weight: 800;
      color: #15803d;
      margin: 0.25rem 0;
    }
  `]
})
export class PremiumCalculatorComponent {
  private insuranceService = inject(InsuranceService);
  private calculatorService = inject(CalculatorService);
  private router = inject(Router);

  schemes = this.insuranceService.schemes;

  selectedSchemeId = 1;
  age = 30;
  sumAssured = 2500000;
  tenureYears = 15;
  interestRate = 7.5;

  result = signal<PremiumCalculationResult | null>(null);

  constructor() {
    this.calculate();
  }

  onSchemeChange(): void {
    const s = this.schemes().find(sc => sc.schemeId === Number(this.selectedSchemeId));
    if (s) {
      this.interestRate = s.baseInterestRate || 7.5;
      this.sumAssured = s.minSumAssured || 2000000;
      this.tenureYears = s.minMaturityYears || 10;
    }
    this.calculate();
  }

  calculate(): void {
    const res = this.calculatorService.calculatePremium({
      schemeId: Number(this.selectedSchemeId),
      age: Number(this.age),
      maturityPeriodYears: Number(this.tenureYears),
      sumAssured: Number(this.sumAssured),
      rateOfInterest: Number(this.interestRate)
    });
    this.result.set(res);
  }

  goToBuy(): void {
    this.router.navigate(['/customer/buy-policy']);
  }
}
