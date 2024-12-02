import React from 'react';
import {
  Box,
  Typography,
  ToggleButton,
  ToggleButtonGroup,
  TextField,
  InputAdornment
} from '@mui/material';
import {
  Home,
  Apartment,
  Business,
  House,
  HolidayVillage
} from '@mui/icons-material';

interface PropertyDetailsStepProps {
  data: {
    propertyType: 'single-family' | 'multi-family' | 'commercial' | '';
    ownership: 'own' | 'rent' | '';
    roofAge: number | null;
  };
  onUpdate: (updates: Partial<typeof data>) => void;
}

const PropertyDetailsStep: React.FC<PropertyDetailsStepProps> = ({ data, onUpdate }) => {
  return (
    <Box>
      <Typography variant="h5" gutterBottom align="center" sx={{ mb: 3 }}>
        Tell Us About Your Property
      </Typography>
      
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <Box>
          <Typography variant="subtitle1" gutterBottom>
            Property Type
          </Typography>
          <ToggleButtonGroup
            value={data.propertyType}
            exclusive
            onChange={(e, value) => onUpdate({ propertyType: value })}
            fullWidth
            sx={{ 
              display: 'grid', 
              gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' },
              gap: 1 
            }}
          >
            <ToggleButton 
              value="single-family"
              sx={{ 
                display: 'flex', 
                flexDirection: 'column', 
                gap: 1,
                py: 2
              }}
            >
              <Home />
              <Typography variant="body2">Single Family</Typography>
            </ToggleButton>
            <ToggleButton 
              value="multi-family"
              sx={{ 
                display: 'flex', 
                flexDirection: 'column', 
                gap: 1,
                py: 2
              }}
            >
              <Apartment />
              <Typography variant="body2">Multi Family</Typography>
            </ToggleButton>
            <ToggleButton 
              value="commercial"
              sx={{ 
                display: 'flex', 
                flexDirection: 'column', 
                gap: 1,
                py: 2
              }}
            >
              <Business />
              <Typography variant="body2">Commercial</Typography>
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>

        <Box>
          <Typography variant="subtitle1" gutterBottom>
            Do you own or rent this property?
          </Typography>
          <ToggleButtonGroup
            value={data.ownership}
            exclusive
            onChange={(e, value) => onUpdate({ ownership: value })}
            fullWidth
            sx={{ 
              display: 'grid', 
              gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' },
              gap: 1 
            }}
          >
            <ToggleButton 
              value="own"
              sx={{ 
                display: 'flex', 
                flexDirection: 'column', 
                gap: 1,
                py: 2
              }}
            >
              <House />
              <Typography variant="body2">I Own</Typography>
            </ToggleButton>
            <ToggleButton 
              value="rent"
              sx={{ 
                display: 'flex', 
                flexDirection: 'column', 
                gap: 1,
                py: 2
              }}
            >
              <HolidayVillage />
              <Typography variant="body2">I Rent</Typography>
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>

        <Box>
          <Typography variant="subtitle1" gutterBottom>
            How old is your roof? (approximate)
          </Typography>
          <TextField
            type="number"
            value={data.roofAge === null ? '' : data.roofAge}
            onChange={(e) => {
              const value = e.target.value === '' ? null : Number(e.target.value);
              onUpdate({ roofAge: value });
            }}
            fullWidth
            InputProps={{
              endAdornment: <InputAdornment position="end">years</InputAdornment>,
            }}
            inputProps={{
              min: 0,
              max: 100,
            }}
          />
        </Box>
      </Box>

      <Typography variant="body2" color="text.secondary" sx={{ mt: 3 }} align="center">
        This information helps us determine the best solar solution for your property
      </Typography>
    </Box>
  );
};

export default PropertyDetailsStep;
