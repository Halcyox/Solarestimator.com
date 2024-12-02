import React from 'react';
import { TextField, Typography } from '@mui/material';

interface EnergyUsageProfileProps {
  monthlyBill: number;
  utilityRate: number;
  onMonthlyBillChange: (bill: number) => void;
  onUtilityRateChange: (rate: number) => void;
}

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
