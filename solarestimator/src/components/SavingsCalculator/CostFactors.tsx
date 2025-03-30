import React from 'react';
import { TextField, Typography, Box, Slider, InputAdornment } from '@mui/material';
import { AttachMoney, Percent } from '@mui/icons-material';

/**
 * Props interface for the CostFactors component
 * @interface CostFactorsProps
 * @property {number} maintenanceCost - Annual maintenance cost
 * @property {number} inflationRate - General inflation rate
 * @property {number} utilityInflationRate - Utility rate inflation
 * @property {(cost: number) => void} onMaintenanceCostChange - Callback for maintenance cost updates
 * @property {(rate: number) => void} onInflationRateChange - Callback for inflation rate updates
 * @property {(rate: number) => void} onUtilityInflationRateChange - Callback for utility inflation rate updates
 */
interface CostFactorsProps {
  maintenanceCost: number;
  inflationRate: number;
  utilityInflationRate: number;
  onMaintenanceCostChange: (cost: number) => void;
  onInflationRateChange: (rate: number) => void;
  onUtilityInflationRateChange: (rate: number) => void;
}

/**
 * CostFactors Component
 * 
 * A form component that allows users to input and adjust various cost factors
 * related to solar system installation and maintenance. This includes:
 * - Annual maintenance cost
 * - General inflation rate
 * - Utility rate inflation
 * 
 * The component provides real-time validation and updates to ensure inputs
 * are within reasonable ranges and maintain proper relationships.
 * 
 * Features:
 * - Input validation and formatting
 * - Real-time updates
 * - Currency and percentage formatting
 * - Error handling and input constraints
 * 
 * @component
 * @param {CostFactorsProps} props - Component props
 * @param {number} props.maintenanceCost - Annual maintenance cost
 * @param {number} props.inflationRate - General inflation rate (as decimal)
 * @param {number} props.utilityInflationRate - Utility rate inflation (as decimal)
 * @param {Function} props.onMaintenanceCostChange - Callback for maintenance cost updates
 * @param {Function} props.onInflationRateChange - Callback for inflation rate updates
 * @param {Function} props.onUtilityInflationRateChange - Callback for utility inflation rate updates
 * @returns {JSX.Element} Rendered form component
 * 
 * @example
 * ```tsx
 * <CostFactors
 *   maintenanceCost={1000}
 *   inflationRate={0.02}
 *   utilityInflationRate={0.03}
 *   onMaintenanceCostChange={(cost) => {
 *     console.log('Maintenance cost updated:', cost);
 *     // Handle updates
 *   }}
 *   onInflationRateChange={(rate) => {
 *     console.log('Inflation rate updated:', rate);
 *     // Handle updates
 *   }}
 *   onUtilityInflationRateChange={(rate) => {
 *     console.log('Utility inflation rate updated:', rate);
 *     // Handle updates
 *   }}
 * />
 * ```
 */
const CostFactors: React.FC<CostFactorsProps> = ({
  maintenanceCost,
  inflationRate,
  utilityInflationRate,
  onMaintenanceCostChange,
  onInflationRateChange,
  onUtilityInflationRateChange,
}) => {
  /**
   * Handles changes to the maintenance cost input
   * Ensures the cost stays within valid range (0 to infinity)
   * @param {React.ChangeEvent<HTMLInputElement>} e - Input change event
   */
  const handleMaintenanceCostChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newCost = Math.max(0, Number(e.target.value));
    onMaintenanceCostChange(newCost);
  };

  /**
   * Handles changes to the inflation rate input
   * Ensures the rate stays within valid range (0 to 20%)
   * @param {React.ChangeEvent<HTMLInputElement>} e - Input change event
   */
  const handleInflationRateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newRate = Math.min(20, Math.max(0, Number(e.target.value)));
    onInflationRateChange(newRate / 100);
  };

  /**
   * Handles changes to the utility inflation rate input
   * Ensures the rate stays within valid range (0 to 20%)
   * @param {React.ChangeEvent<HTMLInputElement>} e - Input change event
   */
  const handleUtilityInflationRateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newRate = Math.min(20, Math.max(0, Number(e.target.value)));
    onUtilityInflationRateChange(newRate / 100);
  };

  return (
    <Box sx={{ width: '100%', my: 2 }}>
      <Typography variant="h6" gutterBottom>
        Cost Factors
      </Typography>
      
      <TextField
        fullWidth
        label="Annual Maintenance Cost"
        type="number"
        value={maintenanceCost}
        onChange={handleMaintenanceCostChange}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <AttachMoney />
            </InputAdornment>
          ),
        }}
        sx={{ mb: 2 }}
      />
      
      <TextField
        fullWidth
        label="General Inflation Rate"
        type="number"
        value={inflationRate * 100}
        onChange={handleInflationRateChange}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <Percent />
            </InputAdornment>
          ),
        }}
        sx={{ mb: 2 }}
      />
      
      <TextField
        fullWidth
        label="Utility Rate Inflation"
        type="number"
        value={utilityInflationRate * 100}
        onChange={handleUtilityInflationRateChange}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <Percent />
            </InputAdornment>
          ),
        }}
      />
    </Box>
  );
};

export default CostFactors;