import React from 'react';
import {
  Box,
  TextField,
  Typography,
  Autocomplete,
} from '@mui/material';

// This list should be populated with actual utility providers based on the user's location
const UTILITY_PROVIDERS = [
  'Pacific Gas & Electric (PG&E)',
  'Southern California Edison (SCE)',
  'San Diego Gas & Electric (SDG&E)',
  'Duke Energy',
  'Florida Power & Light',
  'ConEdison',
  'National Grid',
  'Other'
];

interface BillInfoStepProps {
  data: {
    utilityProvider: string;
  };
  onUpdate: (updates: Partial<typeof data>) => void;
}

const BillInfoStep: React.FC<BillInfoStepProps> = ({ data, onUpdate }) => {
  return (
    <Box>
      <Typography variant="h5" gutterBottom align="center" sx={{ mb: 3 }}>
        Your Utility Provider
      </Typography>
      
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        <Box>
          <Typography variant="subtitle1" gutterBottom>
            Who is your utility provider?
          </Typography>
          <Autocomplete
            value={data.utilityProvider}
            onChange={(event, newValue) => {
              onUpdate({ utilityProvider: newValue || '' });
            }}
            options={UTILITY_PROVIDERS}
            renderInput={(params) => (
              <TextField
                {...params}
                required
                placeholder="Select your utility provider"
                fullWidth
              />
            )}
          />
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            We'll use this to calculate rates and available incentives
          </Typography>
        </Box>
      </Box>

      <Typography variant="body2" color="text.secondary" sx={{ mt: 3 }} align="center">
        Your information helps us provide the most accurate solar savings estimate
      </Typography>
    </Box>
  );
};

export default BillInfoStep;
