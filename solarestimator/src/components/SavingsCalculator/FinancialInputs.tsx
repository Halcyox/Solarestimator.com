import React from 'react';
import { FormControl, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material';
import { FinancingOption } from './types';

/**
 * Props interface for the FinancialInputs component
 * @interface FinancialInputsProps
 * @property {FinancingOption} financingOption - The selected financing option (cash, loan, or lease)
 * @property {number} loanTerm - The term length of the solar loan in years
 * @property {number} interestRate - The annual interest rate for the solar loan as a percentage
 * @property {number} downPayment - The initial down payment amount in dollars
 * @property {number} incentivePercentage - The percentage of solar incentives available
 * @property {function} onFinancingOptionChange - Callback function when financing option changes
 * @property {function} onLoanTermChange - Callback function when loan term changes
 * @property {function} onInterestRateChange - Callback function when interest rate changes
 * @property {function} onDownPaymentChange - Callback function when down payment amount changes
 * @property {function} onIncentivePercentageChange - Callback function when incentive percentage changes
 */
interface FinancialInputsProps {
  financingOption: FinancingOption;
  loanTerm: number;
  interestRate: number;
  downPayment: number;
  incentivePercentage: number;
  onFinancingOptionChange: (option: FinancingOption) => void;
  onLoanTermChange: (term: number) => void;
  onInterestRateChange: (rate: number) => void;
  onDownPaymentChange: (payment: number) => void;
  onIncentivePercentageChange: (percentage: number) => void;
}

/**
 * FinancialInputs Component
 * 
 * A form component that handles the financial aspects of solar installation,
 * including financing options (cash, loan, or lease), loan terms, interest rates,
 * down payments, and available solar incentives.
 * 
 * The component conditionally renders loan-related fields when the loan financing
 * option is selected.
 * 
 * @component
 * @param {FinancialInputsProps} props - The component props
 * @returns {JSX.Element} A form with financial input fields
 */
const FinancialInputs: React.FC<FinancialInputsProps> = ({
  financingOption,
  loanTerm,
  interestRate,
  downPayment,
  incentivePercentage,
  onFinancingOptionChange,
  onLoanTermChange,
  onInterestRateChange,
  onDownPaymentChange,
  onIncentivePercentageChange,
}) => {
  return (
    <div>
      <Typography variant="h6" gutterBottom>
        Financial Options
      </Typography>

      <FormControl fullWidth margin="normal">
        <InputLabel>Financing Option</InputLabel>
        <Select
          value={financingOption}
          onChange={(e) => onFinancingOptionChange(e.target.value as FinancingOption)}
          label="Financing Option"
        >
          <MenuItem value="cash">Cash Purchase</MenuItem>
          <MenuItem value="loan">Solar Loan</MenuItem>
          <MenuItem value="lease">Solar Lease</MenuItem>
        </Select>
      </FormControl>

      {financingOption === 'loan' && (
        <>
          <TextField
            fullWidth
            margin="normal"
            label="Loan Term (years)"
            type="number"
            value={loanTerm}
            onChange={(e) => onLoanTermChange(Number(e.target.value))}
            inputProps={{ min: 1, max: 30 }}
          />

          <TextField
            fullWidth
            margin="normal"
            label="Interest Rate (%)"
            type="number"
            value={interestRate}
            onChange={(e) => onInterestRateChange(Number(e.target.value))}
            inputProps={{ min: 0, max: 100, step: 0.1 }}
          />

          <TextField
            fullWidth
            margin="normal"
            label="Down Payment ($)"
            type="number"
            value={downPayment}
            onChange={(e) => onDownPaymentChange(Number(e.target.value))}
            inputProps={{ min: 0 }}
          />
        </>
      )}

      <TextField
        fullWidth
        margin="normal"
        label="Solar Incentives (%)"
        type="number"
        value={incentivePercentage}
        onChange={(e) => onIncentivePercentageChange(Number(e.target.value))}
        inputProps={{ min: 0, max: 100, step: 0.1 }}
      />
    </div>
  );
};

export default FinancialInputs;
