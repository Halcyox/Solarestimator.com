// solarestimator/src/utils/solarConstants.ts

import { PanelType, InverterType } from '../components/SavingsCalculator/types';

export const AVERAGE_PANEL_OUTPUT_KW = 0.35; // 350W panel
export const BASE_INSTALLATION_COST_PER_KW = 2500;
export const PANEL_AREA_M2 = 1.7;

export const PANEL_TYPES: Record<PanelType, { efficiency: number; degradationRate: number; costMultiplier: number }> = {
  Monocrystalline: { efficiency: 0.23, degradationRate: 0.005, costMultiplier: 1.2 },
  Polycrystalline: { efficiency: 0.20, degradationRate: 0.006, costMultiplier: 1.0 },
  ThinFilm: { efficiency: 0.18, degradationRate: 0.007, costMultiplier: 0.8 },
};

export const INVERTER_TYPES: Record<InverterType, { cost: number }> = {
  StringInverter: { cost: 2000 },
  MicroInverter: { cost: 3000 },
};

export const BATTERY_COST = 5000;
export const LEASE_COST_PER_YEAR = 1000;

// Environmental impact conversion factors
export const KG_CO2_PER_KWH = 0.6; // kg CO2 per kWh (US average - EPA estimate)
export const KG_CO2_OFFSET_PER_TREE = 22.0; // kg CO2 offset per tree per year
export const GALLONS_GASOLINE_PER_KWH = 0.08; // gallons of gas equivalent per kWh
export const MILES_DRIVEN_PER_KWH = 0.4; // miles driven equivalent per kWh
export const MAX_SYSTEM_SIZE_KW = 30; 