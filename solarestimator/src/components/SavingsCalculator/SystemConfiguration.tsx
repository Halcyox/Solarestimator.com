import React from 'react';
import { FormControl, InputLabel, MenuItem, Select, Slider } from '@mui/material';
import { InverterType, PanelType } from './types';
import '../../styles/system-configuration.css';

/**
 * Props interface for the SystemConfiguration component
 * @interface SystemConfigurationProps
 * @property {number} panelCount - Current number of solar panels in the system
 * @property {PanelType} panelType - Type of solar panels being used
 * @property {InverterType} inverterType - Type of inverter in the system
 * @property {boolean} hasBattery - Whether the system includes battery storage
 * @property {(value: number) => void} onPanelCountChange - Callback when panel count changes
 * @property {(type: PanelType) => void} onPanelTypeChange - Callback when panel type changes
 * @property {(type: InverterType) => void} onInverterTypeChange - Callback when inverter type changes
 * @property {(hasBattery: boolean) => void} onBatteryChange - Callback when battery option changes
 * @property {number} maxPanels - Maximum number of panels allowed in the system
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
  const minPanels = 4;
  const validPanelCount = Math.max(minPanels, Math.min(panelCount, maxPanels));
  const systemSizeKW = (validPanelCount * 0.35).toFixed(1);

  return (
    <div className="system-config-container">
      {/* Panel Count Control */}
      <div className="system-config-section">
        <div className="system-config-header">
          <div>
            <h3 className="system-config-title">Adjust Your Solar Panel System</h3>
            <div className="system-config-subtitle">Fine-tune the number of panels to fit your roof and budget. Max: {maxPanels} panels.</div>
          </div>
          <div className="text-right">
            <div className="system-config-value">{validPanelCount} panels</div>
            <div className="system-config-subtitle">{systemSizeKW} kW system</div>
          </div>
        </div>
        
        <Slider
          value={validPanelCount}
          onChange={(_, value) => onPanelCountChange(value as number)}
          min={minPanels}
          max={maxPanels}
          step={1}
          marks={[
            { value: minPanels, label: `${minPanels} panels` },
            { value: maxPanels, label: `${maxPanels} panels` }
          ]}
          valueLabelDisplay="auto"
          className="custom-slider"
        />
      </div>

      {/* Component Selection */}
      <div className="system-config-grid">
        {/* Panel Type */}
        <div className="system-config-input-group">
          <label className="system-config-label"><strong>Panel Type</strong></label>
          <FormControl fullWidth size="small">
            <Select
              value={panelType}
              onChange={(e) => onPanelTypeChange(e.target.value as PanelType)}
            >
              <MenuItem value="Monocrystalline">
                <div>
                  <strong>Monocrystalline</strong>
                  <div className="system-config-subtitle">Highest efficiency (23%)</div>
                </div>
              </MenuItem>
              <MenuItem value="Polycrystalline">
                <div>
                  <strong>Polycrystalline</strong>
                  <div className="system-config-subtitle">Balanced cost & performance (20%)</div>
                </div>
              </MenuItem>
              <MenuItem value="ThinFilm">
                 <div>
                  <strong>Thin Film</strong>
                  <div className="system-config-subtitle">Most affordable, lower efficiency (18%)</div>
                </div>
              </MenuItem>
            </Select>
          </FormControl>
        </div>

        {/* Inverter Type */}
        <div className="system-config-input-group">
          <label className="system-config-label"><strong>Inverter Type</strong></label>
          <FormControl fullWidth size="small">
            <Select
              value={inverterType}
              onChange={(e) => onInverterTypeChange(e.target.value as InverterType)}
            >
              <MenuItem value="StringInverter">
                <div>
                  <strong>String Inverter</strong>
                  <div className="system-config-subtitle">Cost-effective for uniform roofs</div>
                </div>
              </MenuItem>
              <MenuItem value="MicroInverter">
                <div>
                  <strong>Microinverters</strong>
                  <div className="system-config-subtitle">Maximizes output in shaded conditions</div>
                </div>
              </MenuItem>
            </Select>
          </FormControl>
        </div>

        {/* Battery Storage */}
        <div className="system-config-input-group">
          <label className="system-config-label"><strong>Energy Storage</strong></label>
          <FormControl fullWidth size="small">
            <Select
              value={hasBattery.toString()}
              onChange={(e) => onBatteryChange(e.target.value === 'true')}
            >
              <MenuItem value="false">
                <div>
                  <strong>No Battery</strong>
                  <div className="system-config-subtitle">Standard grid-tied system</div>
                </div>
              </MenuItem>
              <MenuItem value="true">
                <div>
                  <strong>Include Battery</strong>
                  <div className="system-config-subtitle">Power backup & energy independence</div>
                </div>
              </MenuItem>
            </Select>
          </FormControl>
        </div>
      </div>
    </div>
  );
};

export default SystemConfiguration;