import React from 'react';
import { FormControl, InputLabel, MenuItem, Select, Slider, Typography } from '@mui/material';
import { InverterType, PanelType, PANEL_TYPES, INVERTER_TYPES } from './types';

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
          onChange={(e) => onBatteryChange(e.target.value as boolean)}
          label="Battery Storage"
        >
          <MenuItem value={false}>No Battery</MenuItem>
          <MenuItem value={true}>Include Battery</MenuItem>
        </Select>
      </FormControl>
    </div>
  );
};

export default SystemConfiguration;
