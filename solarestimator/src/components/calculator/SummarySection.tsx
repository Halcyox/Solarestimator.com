import React from 'react';
import { SavingsCalculatorProps } from './types';

interface SummarySectionProps extends SavingsCalculatorProps {
  totalSystemCost: number;
  totalIncentives: number;
  annualSavings: number[];
  totalSavingsOverYears: number;
  paybackPeriod: number | string;
  roi: number;
}

const SummarySection: React.FC<SummarySectionProps> = ({
  solarData,
  bill,
  totalSystemCost,
  totalIncentives,
  annualSavings,
  totalSavingsOverYears,
  paybackPeriod,
  roi
}) => {
  const formatCurrency = (amount: number) => {
    return `$${amount.toFixed(2)}`;
  };

  const firstYearSavings = annualSavings[0];
  const averageAnnualSavings = totalSavingsOverYears / solarData.maxSunshineHoursPerYear;

  return (
    <div className="summary">
      <h2>Solar Savings Summary</h2>
      <p><strong>Payback Period:</strong> {typeof paybackPeriod === 'number' ? `${paybackPeriod} years` : paybackPeriod}</p>
      <p><strong>Return on Investment (ROI):</strong> {roi.toFixed(2)}%</p>
      <p><strong>Net System Cost:</strong> {formatCurrency(totalSystemCost - totalIncentives)}</p>
      <p><strong>Total Incentives:</strong> {formatCurrency(totalIncentives)}</p>
      <p><strong>First Year Savings:</strong> {formatCurrency(firstYearSavings)} per year ({formatCurrency(firstYearSavings / 12)} per month)</p>
      <p><strong>Average Annual Savings:</strong> {formatCurrency(averageAnnualSavings)} per year</p>
      <p><strong>Cumulative Savings Over {solarData.maxSunshineHoursPerYear} Years:</strong> {formatCurrency(totalSavingsOverYears)}</p>
    </div>
  );
};

export default SummarySection;
