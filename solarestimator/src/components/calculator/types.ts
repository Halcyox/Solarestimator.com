export interface SolarData {
    maxArrayPanelsCount: number;
    maxArrayAreaMeters2: number;
    maxSunshineHoursPerYear: number;
    carbonOffsetFactorKgPerMwh: number;
}

export interface SavingsCalculatorProps {
    solarData: SolarData;
    bill: number;
    utilityRate: number;  // Added if utility rate changes are significant
    onPanelChange: (value: number) => void;
    onShadingChange: (value: number) => void;
    onTiltChange: (value: number) => void;
    onFinancingOptionChange?: (option: FinancingOption) => void;  // Optional handler if needed
    onUtilityRateChange?: (rate: number) => void;  // Optional handler if needed
}

export type FinancingOption = 'cash' | 'loan' | 'lease';

export type PanelType = 'Monocrystalline' | 'Polycrystalline' | 'Thin-film';

export interface FinancialDetails {
    loanInterestRate: number;
    loanTermYears: number;
    leaseTerms?: string;  // If there are specific terms for leases that need to be tracked
    incentives: IncentiveDetails;
}

export interface IncentiveDetails {
    federal: number;
    state: number;
    local: number;
}

// Expanded to include types for handling dynamic components in your calculator
export type InverterType = 'String Inverter' | 'Micro Inverter' | 'Power Optimizer';
export interface AdditionalOptions {
    batteryStorageIncluded: boolean;
    inverterType: InverterType;
}
