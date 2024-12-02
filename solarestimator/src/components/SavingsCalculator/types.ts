export interface SolarData {
  maxArrayPanelsCount: number;
  maxArrayAreaMeters2: number;
  maxSunshineHoursPerYear: number;
  carbonOffsetFactorKgPerMwh: number;
}

export type FinancingOption = 'cash' | 'loan' | 'lease';
export type PanelType = 'Monocrystalline' | 'Polycrystalline' | 'ThinFilm';
export type InverterType = 'StringInverter' | 'MicroInverter';

export interface SavingsCalculatorProps {
  solarData: SolarData;
  bill: number;
  totalEnergyProductionPerYearKwh: number;
  onPanelChange: (value: number) => void;
  onShadingChange: (value: number) => void;
  onTiltChange: (value: number) => void;
}

export const PANEL_TYPES = {
  Monocrystalline: { efficiency: 0.22, costMultiplier: 1.2, degradationRate: 0.005 },
  Polycrystalline: { efficiency: 0.20, costMultiplier: 1.0, degradationRate: 0.005 },
  ThinFilm: { efficiency: 0.18, costMultiplier: 0.8, degradationRate: 0.005 },
};

export const INVERTER_TYPES = {
  StringInverter: { cost: 2000 },
  MicroInverter: { cost: 3000 },
};

// Constants for calculations
export const BATTERY_COST = 5000;
export const AVERAGE_PANEL_OUTPUT_KW = 0.3;
export const BASE_INSTALLATION_COST_PER_KW = 2500;
export const LEASE_COST_PER_YEAR = 1000;
export const KG_CO2_PER_KWH = 0.5;
export const KG_CO2_OFFSET_PER_TREE = 20;
