import React from 'react';
import { Box, TextField, InputAdornment } from '@mui/material';

/**
 * Props interface for the BillInfoStep component
 * @interface
 * @property {Object} data - The form data object containing user's billing information
 * @property {number|null} data.monthlyBill - User's average monthly electricity bill
 * @property {string} data.utilityProvider - User's electricity utility provider
 * @property {function} onUpdate - Callback function to update the form data
 */
interface BillInfoStepProps {
  data: {
    bill: number | null;
    utilityProvider: string;
  };
  onUpdate: (updates: Partial<BillInfoStepProps['data']>) => void;
}

/**
 * BillInfoStep component that collects user's electricity billing information
 * This component is part of the solar estimator wizard
 * 
 * @component
 * @param {BillInfoStepProps} props - Component props
 * @returns {React.ReactElement} A form collecting user's billing information
 */
const BillInfoStep: React.FC<BillInfoStepProps> = ({ data, onUpdate }) => {
  return (
    <Box className="space-y-4">
      <TextField
        label="What is your average monthly electric bill?"
        type="number"
        placeholder="150"
        fullWidth
        value={data.bill ?? ''}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => onUpdate({ bill: parseInt(e.target.value, 10) || null })}
        InputProps={{
          startAdornment: <InputAdornment position="start">$</InputAdornment>,
        }}
        error={!data.bill}
        helperText={!data.bill ? 'Monthly bill is required' : ''}
      />
      <TextField
        label="Who is your utility provider?"
        type="text"
        fullWidth
        placeholder="e.g., PG&E, Con Edison"
        value={data.utilityProvider}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => onUpdate({ utilityProvider: e.target.value })}
        error={!data.utilityProvider}
        helperText={!data.utilityProvider ? 'Utility provider is required' : ''}
      />
    </Box>
  );
};

export default BillInfoStep;