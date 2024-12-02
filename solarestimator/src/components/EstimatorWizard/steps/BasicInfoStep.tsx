import React from 'react';
import {
  Box,
  TextField,
  Typography,
  InputAdornment
} from '@mui/material';
import { Person, Email, Phone } from '@mui/icons-material';
import { PatternFormat } from 'react-number-format';

interface BasicInfoStepProps {
  data: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  onUpdate: (updates: Partial<typeof data>) => void;
}

const BasicInfoStep: React.FC<BasicInfoStepProps> = ({ data, onUpdate }) => {
  return (
    <Box>
      <Typography variant="h5" gutterBottom align="center" sx={{ mb: 3 }}>
        Let's Get Started
      </Typography>
      
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <TextField
            required
            fullWidth
            label="First Name"
            value={data.firstName}
            onChange={(e) => onUpdate({ firstName: e.target.value })}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Person />
                </InputAdornment>
              ),
            }}
          />
          <TextField
            required
            fullWidth
            label="Last Name"
            value={data.lastName}
            onChange={(e) => onUpdate({ lastName: e.target.value })}
          />
        </Box>

        <TextField
          required
          fullWidth
          label="Email"
          type="email"
          value={data.email}
          onChange={(e) => onUpdate({ email: e.target.value })}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Email />
              </InputAdornment>
            ),
          }}
        />

        <PatternFormat
          format="+1 (###) ###-####"
          customInput={TextField}
          value={data.phone}
          onValueChange={(values) => {
            onUpdate({ phone: values.value });
          }}
          fullWidth
          label="Phone Number (Optional)"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Phone />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      <Typography variant="body2" color="text.secondary" sx={{ mt: 3 }} align="center">
        We'll use this information to provide your personalized solar savings estimate
      </Typography>
    </Box>
  );
};

export default BasicInfoStep;
