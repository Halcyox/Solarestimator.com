import React from 'react';
import { FormControl, InputLabel, MenuItem, Select, Slider, Typography } from '@mui/material';
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
    <div>
      <Typography variant="h6" gutterBottom>
        System Configuration
      </Typography>
      
      <div>
        <Typography gutterBottom>
          Number of Panels: {panelCount} 
          <Typography variant="caption" color="textSecondary">
            (Max capacity: {maxPanels} panels)
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
        />
      </div>

      <FormControl fullWidth margin="normal">
        <InputLabel>Panel Type</InputLabel>
        <Select
          value={panelType}
          onChange={(e) => onPanelTypeChange(e.target.value as PanelType)}
          label="Panel Type"
        >
          <MenuItem value="Monocrystalline">Monocrystalline</MenuItem>
          <MenuItem value="Polycrystalline">Polycrystalline</MenuItem>
          <MenuItem value="ThinFilm">Thin Film</MenuItem>
        </Select>
      </FormControl>

      <FormControl fullWidth margin="normal">
        <InputLabel>Inverter Type</InputLabel>
        <Select
          value={inverterType}
          onChange={(e) => onInverterTypeChange(e.target.value as InverterType)}
          label="Inverter Type"
        >
          <MenuItem value="StringInverter">String Inverter</MenuItem>
          <MenuItem value="MicroInverter">Micro Inverter</MenuItem>
        </Select>
      </FormControl>

      <FormControl fullWidth margin="normal">
        <InputLabel>Battery Storage</InputLabel>
        <Select
          value={hasBattery}
          onChange={(e) => onBatteryChange(e.target.value === 'true')}
          label="Battery Storage"
        >
          <MenuItem value="true">Include Battery</MenuItem>
          <MenuItem value="false">No Battery</MenuItem>
        </Select>
      </FormControl>
    </div>
  );
};

export default SystemConfiguration;