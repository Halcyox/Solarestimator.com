import React from 'react';
import { FormControl, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material';
import { FinancingOption } from './types';

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
