import React from 'react';
import { TextField, Typography } from '@mui/material';

interface CostFactorsProps {
  maintenanceCost: number;
  inflationRate: number;
  utilityInflationRate: number;
  onMaintenanceCostChange: (cost: number) => void;
  onInflationRateChange: (rate: number) => void;
  onUtilityInflationRateChange: (rate: number) => void;
}

const CostFactors: React.FC<CostFactorsProps> = ({
  maintenanceCost,
  inflationRate,
  utilityInflationRate,
  onMaintenanceCostChange,
  onInflationRateChange,
  onUtilityInflationRateChange,
}) => {
  return (
    <div>
      <Typography variant="h6" gutterBottom>
        Cost Factors
      </Typography>

      <TextField
        fullWidth
        margin="normal"
        label="Annual Maintenance Cost ($)"
        type="number"
        value={maintenanceCost}
        onChange={(e) => onMaintenanceCostChange(Number(e.target.value))}
        inputProps={{ min: 0 }}
      />

      <TextField
        fullWidth
        margin="normal"
        label="General Inflation Rate (%)"
        type="number"
        value={inflationRate}
        onChange={(e) => onInflationRateChange(Number(e.target.value))}
        inputProps={{ min: 0, max: 20, step: 0.1 }}
      />

      <TextField
        fullWidth
        margin="normal"
        label="Utility Rate Inflation (%)"
        type="number"
        value={utilityInflationRate}
        onChange={(e) => onUtilityInflationRateChange(Number(e.target.value))}
        inputProps={{ min: 0, max: 20, step: 0.1 }}
      />
    </div>
  );
};

export default CostFactors;
