import React from 'react';
import { TextField, Typography } from '@mui/material';

/**
 * Interface for the EnergyUsageProfile component props
 * @interface
 * @property {number} monthlyBill - The user's current monthly electricity bill in dollars
 * @property {number} utilityRate - The current utility rate in dollars per kilowatt-hour
 * @property {function} onMonthlyBillChange - Callback function triggered when monthly bill value changes
 * @property {function} onUtilityRateChange - Callback function triggered when utility rate value changes
 */
interface EnergyUsageProfileProps {
  monthlyBill: number;
  utilityRate: number;
  onMonthlyBillChange: (bill: number) => void;
  onUtilityRateChange: (rate: number) => void;
}

/**
 * A component that captures the user's energy usage profile through monthly bill
 * and utility rate inputs. This information is used to calculate potential solar savings.
 * 
 * @component
 * @param {EnergyUsageProfileProps} props - The component props
 * @returns {React.ReactElement} A form with input fields for monthly bill and utility rate
 */
const EnergyUsageProfile: React.FC<EnergyUsageProfileProps> = ({
  monthlyBill,
  utilityRate,
  onMonthlyBillChange,
  onUtilityRateChange,
}) => {
  return (
    <div>
      <Typography variant="h6" gutterBottom>
        Energy Usage Profile
      </Typography>

      <TextField
        fullWidth
        margin="normal"
        label="Monthly Electricity Bill ($)"
        type="number"
        value={monthlyBill}
        onChange={(e) => onMonthlyBillChange(Number(e.target.value))}
        inputProps={{ min: 0 }}
      />

      <TextField
        fullWidth
        margin="normal"
        label="Utility Rate ($/kWh)"
        type="number"
        value={utilityRate}
        onChange={(e) => onUtilityRateChange(Number(e.target.value))}
        inputProps={{ min: 0, step: 0.01 }}
      />
    </div>
  );
};

export default EnergyUsageProfile;
