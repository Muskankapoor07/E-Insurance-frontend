import { Injectable } from '@angular/core';
import { PremiumCalculationRequest, PremiumCalculationResult, Policy, Commission } from '../models/models';

@Injectable({
  providedIn: 'root'
})
export class CalculatorService {

  /**
   * Calculates insurance premium based on age, policy duration, sum assured, and base interest rate
   */
  calculatePremium(request: PremiumCalculationRequest, baseRate = 7.0): PremiumCalculationResult {
    const { age, maturityPeriodYears, sumAssured, rateOfInterest = baseRate } = request;

    // Age risk factor: Young (<30) gets baseline, 30-45 +15%, 45-60 +35%, >60 +65%
    let ageRiskFactor = 1.0;
    if (age < 30) {
      ageRiskFactor = 1.0;
    } else if (age <= 45) {
      ageRiskFactor = 1.15;
    } else if (age <= 60) {
      ageRiskFactor = 1.35;
    } else {
      ageRiskFactor = 1.65;
    }

    // Term factor: Longer maturity terms distribute mortality cost
    const termFactor = Math.max(0.7, 1 - (maturityPeriodYears * 0.01));

    // Base annual mortality and cost rate per 1,000 sum assured
    const baseMortalityPerThousand = 2.5;

    // Annual premium calculation
    const baseAnnual = (sumAssured / 1000) * baseMortalityPerThousand * ageRiskFactor * termFactor;

    // Interest rate discount factor (higher interest schemes yield better returns, lowering net term premium)
    const interestDiscount = 1 - ((rateOfInterest - 5) * 0.02);
    const adjustedAnnual = Math.round(baseAnnual * Math.max(0.75, interestDiscount));

    const annualPremium = Math.max(1200, adjustedAnnual);
    const semiAnnualPremium = Math.round((annualPremium * 0.52));
    const quarterlyPremium = Math.round((annualPremium * 0.27));
    const monthlyPremium = Math.round((annualPremium * 0.092));

    // Expected maturity amount with compound interest on invested portion
    const investmentPortionAnnual = annualPremium * 0.70;
    const r = rateOfInterest / 100;
    const n = maturityPeriodYears;
    const futureValue = investmentPortionAnnual * ((Math.pow(1 + r, n) - 1) / r) * (1 + r);
    const totalMaturityAmount = Math.round(sumAssured + futureValue);

    return {
      basePremium: baseAnnual,
      annualPremium,
      semiAnnualPremium,
      quarterlyPremium,
      monthlyPremium,
      totalMaturityAmount,
      effectiveInterestRate: rateOfInterest,
      riskAdjustmentFactor: ageRiskFactor
    };
  }

  /**
   * Commission calculation for an agent based on policies sold
   */
  calculateCommissionForPolicy(policy: Policy, commissionRatePercent: number = 10): number {
    return Math.round((policy.premium * commissionRatePercent) / 100);
  }

  /**
   * Aggregates commission for multiple policies
   */
  calculateTotalCommission(policies: Policy[], defaultRatePercent: number = 10): { totalPremium: number; totalCommission: number; count: number } {
    const totalPremium = policies.reduce((acc, p) => acc + (p.premium || 0), 0);
    const totalCommission = Math.round((totalPremium * defaultRatePercent) / 100);
    return {
      totalPremium,
      totalCommission,
      count: policies.length
    };
  }
}
