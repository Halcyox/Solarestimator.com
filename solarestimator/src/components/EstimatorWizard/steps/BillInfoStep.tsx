import React from 'react';
import {
  Box,
  TextField,
  Typography,
  InputAdornment,
  Select,
  MenuItem,
  FormControl,
  InputLabel
} from '@mui/material';
import { AttachMoney } from '@mui/icons-material';

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
    monthlyBill: number | null;
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
    <Box>
      <Typography variant="h5" gutterBottom align="center" sx={{ mb: 3 }}>
        Your Energy Usage
      </Typography>
      
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        <TextField
          required
          fullWidth
          label="Average Monthly Electric Bill"
          type="number"
          value={data.monthlyBill}
          onChange={(e) => onUpdate({ monthlyBill: Number(e.target.value) })}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <AttachMoney />
              </InputAdornment>
            ),
          }}
        />

        <FormControl fullWidth required>
          <InputLabel>Utility Provider</InputLabel>
          <Select
            value={data.utilityProvider}
            label="Utility Provider"
            onChange={(e) => onUpdate({ utilityProvider: e.target.value })}
          >
            <MenuItem value="pge">PG&amp;E</MenuItem>
            <MenuItem value="sce">Southern California Edison</MenuItem>
            <MenuItem value="sdge">San Diego Gas &amp; Electric</MenuItem>
            <MenuItem value="other">Other</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <Typography variant="body2" color="text.secondary" sx={{ mt: 3 }} align="center">
        This helps us calculate your potential solar savings
      </Typography>
    </Box>
  );
};

export default BillInfoStep;