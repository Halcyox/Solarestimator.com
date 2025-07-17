import React from 'react';
import { FormControl, InputLabel, MenuItem, Select, Slider, Typography, Box, Paper, Grid } from '@mui/material';
import { Settings, SolarPower, ElectricBolt, BatteryChargingFull } from '@mui/icons-material';
import { InverterType, PanelType, PANEL_TYPES, INVERTER_TYPES } from './types';

/**
 * Props interface for the SystemConfiguration component
 * @interface SystemConfigurationProps
 * @property {number} panelCount - Current number of solar panels in the system
 * @property {PanelType} panelType - Type of solar panels being used
 * @property {InverterType} inverterType - Type of inverter in the system
 * @property {boolean} hasBattery - Whether the system includes battery storage
 * @property {number} maxPanels - Maximum number of panels allowed in the system
 * @property {(value: number) => void} onPanelCountChange - Callback when panel count changes
 * @property {(type: PanelType) => void} onPanelTypeChange - Callback when panel type changes
 * @property {(type: InverterType) => void} onInverterTypeChange - Callback when inverter type changes
 * @property {(hasBattery: boolean) => void} onBatteryChange - Callback when battery option changes
 */
interface SystemConfigurationProps {
  panelCount: number;
  panelType: PanelType;
  inverterType: InverterType;
  hasBattery: boolean;
  onPanelCountChange: (value: number) => void;
  onPanelTypeChange: (type: PanelType) => void;
  onInverterTypeChange: (type: InverterType) => void;
  onBatteryChange: (hasBattery: boolean) => void;
  maxPanels: number;
}

/**
 * SystemConfiguration component handles the configuration of solar system parameters
 * including panel count, panel type, inverter type, and battery storage options.
 * 
 * @component
 * @param {SystemConfigurationProps} props - Component props
 * @returns {React.ReactElement} A form with controls for configuring the solar system
 */
const SystemConfiguration: React.FC<SystemConfigurationProps> = ({
  panelCount,
  panelType,
  inverterType,
  hasBattery,
  onPanelCountChange,
  onPanelTypeChange,
  onInverterTypeChange,
  onBatteryChange,
  maxPanels,
}) => {
  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: 2, 
        mb: 4,
        p: 2,
        background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
        borderRadius: 2,
        border: '1px solid rgba(226, 232, 240, 0.8)'
      }}>
        <Settings sx={{ color: '#3b82f6', fontSize: 28 }} />
        <Typography variant="h6" sx={{ 
          fontWeight: 'bold',
          color: '#1f2937',
          fontFamily: 'Inter, system-ui, sans-serif'
        }}>
          System Configuration
        </Typography>
      </Box>
      
      <Grid container spacing={3}>
        {/* Panel Count Section */}
        <Grid item xs={12} md={6}>
          <Paper elevation={0} sx={{ 
            p: 3,
            background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
            borderRadius: 3,
            border: '1px solid rgba(226, 232, 240, 0.8)',
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <SolarPower sx={{ color: '#f59e0b', fontSize: 24 }} />
              <Typography variant="h6" sx={{ 
                fontWeight: 'bold',
                color: '#1f2937',
                fontFamily: 'Inter, system-ui, sans-serif'
              }}>
                Panel Configuration
              </Typography>
            </Box>
            
            <Typography variant="body1" sx={{ mb: 2, color: '#374151' }}>
              Number of Panels: <strong>{panelCount}</strong>
              <Typography variant="caption" sx={{ 
                display: 'block', 
                color: '#6b7280',
                mt: 0.5
              }}>
                Max capacity: {maxPanels} panels
              </Typography>
            </Typography>
            
            <Slider
              value={panelCount}
              onChange={(_, value) => onPanelCountChange(value as number)}
              min={4}  
              max={maxPanels}
              step={1}
              marks={[
                { value: 4, label: '4' },
                { value: Math.round(maxPanels / 2), label: Math.round(maxPanels / 2).toString() },
                { value: maxPanels, label: maxPanels.toString() }
              ]}
              valueLabelDisplay="auto"
              sx={{
                '& .MuiSlider-track': {
                  background: 'linear-gradient(90deg, #3b82f6 0%, #1d4ed8 100%)',
                },
                '& .MuiSlider-thumb': {
                  background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                  boxShadow: '0 4px 8px rgba(59, 130, 246, 0.3)',
                },
                '& .MuiSlider-mark': {
                  backgroundColor: '#9ca3af',
                },
                '& .MuiSlider-markLabel': {
                  color: '#6b7280',
                  fontFamily: 'Inter, system-ui, sans-serif',
                  fontWeight: 600,
                }
              }}
            />
          </Paper>
        </Grid>

        {/* Panel Type Section */}
        <Grid item xs={12} md={6}>
          <Paper elevation={0} sx={{ 
            p: 3,
            background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
            borderRadius: 3,
            border: '1px solid rgba(226, 232, 240, 0.8)',
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <SolarPower sx={{ color: '#10b981', fontSize: 24 }} />
              <Typography variant="h6" sx={{ 
                fontWeight: 'bold',
                color: '#1f2937',
                fontFamily: 'Inter, system-ui, sans-serif'
              }}>
                Panel Type
              </Typography>
            </Box>
            
            <FormControl fullWidth>
              <InputLabel sx={{ 
                fontFamily: 'Inter, system-ui, sans-serif',
                color: '#6b7280'
              }}>
                Panel Type
              </InputLabel>
              <Select
                value={panelType}
                onChange={(e) => onPanelTypeChange(e.target.value as PanelType)}
                label="Panel Type"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: 'rgba(226, 232, 240, 0.8)',
                    },
                    '&:hover fieldset': {
                      borderColor: '#3b82f6',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#3b82f6',
                    },
                  },
                  '& .MuiSelect-select': {
                    fontFamily: 'Inter, system-ui, sans-serif',
                    fontWeight: 600,
                  }
                }}
              >
                <MenuItem value="Monocrystalline" sx={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
                  Monocrystalline
                </MenuItem>
                <MenuItem value="Polycrystalline" sx={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
                  Polycrystalline
                </MenuItem>
                <MenuItem value="ThinFilm" sx={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
                  Thin Film
                </MenuItem>
              </Select>
            </FormControl>
          </Paper>
        </Grid>

        {/* Inverter Type Section */}
        <Grid item xs={12} md={6}>
          <Paper elevation={0} sx={{ 
            p: 3,
            background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
            borderRadius: 3,
            border: '1px solid rgba(226, 232, 240, 0.8)',
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <ElectricBolt sx={{ color: '#f59e0b', fontSize: 24 }} />
              <Typography variant="h6" sx={{ 
                fontWeight: 'bold',
                color: '#1f2937',
                fontFamily: 'Inter, system-ui, sans-serif'
              }}>
                Inverter Type
              </Typography>
            </Box>
            
            <FormControl fullWidth>
              <InputLabel sx={{ 
                fontFamily: 'Inter, system-ui, sans-serif',
                color: '#6b7280'
              }}>
                Inverter Type
              </InputLabel>
              <Select
                value={inverterType}
                onChange={(e) => onInverterTypeChange(e.target.value as InverterType)}
                label="Inverter Type"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: 'rgba(226, 232, 240, 0.8)',
                    },
                    '&:hover fieldset': {
                      borderColor: '#3b82f6',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#3b82f6',
                    },
                  },
                  '& .MuiSelect-select': {
                    fontFamily: 'Inter, system-ui, sans-serif',
                    fontWeight: 600,
                  }
                }}
              >
                <MenuItem value="StringInverter" sx={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
                  String Inverter
                </MenuItem>
                <MenuItem value="MicroInverter" sx={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
                  Micro Inverter
                </MenuItem>
              </Select>
            </FormControl>
          </Paper>
        </Grid>

        {/* Battery Storage Section */}
        <Grid item xs={12} md={6}>
          <Paper elevation={0} sx={{ 
            p: 3,
            background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
            borderRadius: 3,
            border: '1px solid rgba(226, 232, 240, 0.8)',
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <BatteryChargingFull sx={{ color: '#8b5cf6', fontSize: 24 }} />
              <Typography variant="h6" sx={{ 
                fontWeight: 'bold',
                color: '#1f2937',
                fontFamily: 'Inter, system-ui, sans-serif'
              }}>
                Battery Storage
              </Typography>
            </Box>
            
            <FormControl fullWidth>
              <InputLabel sx={{ 
                fontFamily: 'Inter, system-ui, sans-serif',
                color: '#6b7280'
              }}>
                Battery Storage
              </InputLabel>
              <Select
                value={hasBattery}
                onChange={(e) => onBatteryChange(e.target.value === 'true')}
                label="Battery Storage"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: 'rgba(226, 232, 240, 0.8)',
                    },
                    '&:hover fieldset': {
                      borderColor: '#3b82f6',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#3b82f6',
                    },
                  },
                  '& .MuiSelect-select': {
                    fontFamily: 'Inter, system-ui, sans-serif',
                    fontWeight: 600,
                  }
                }}
              >
                <MenuItem value="true" sx={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
                  Include Battery
                </MenuItem>
                <MenuItem value="false" sx={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
                  No Battery
                </MenuItem>
              </Select>
            </FormControl>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default SystemConfiguration;