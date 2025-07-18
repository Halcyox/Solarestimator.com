// solarestimator/src/hooks/useSolarCalculations.ts
import { useState, useEffect, useMemo } from 'react';
import { FetchedSolarData } from '../components/apiHelper';
import { FinancingOption } from '../components/Wizard';
import { PanelType, InverterType, SolarData } from '../components/SavingsCalculator/types';
import {
  AVERAGE_PANEL_OUTPUT_KW,
  BASE_INSTALLATION_COST_PER_KW,
  PANEL_AREA_M2,
  PANEL_TYPES,
  INVERTER_TYPES,
  BATTERY_COST,
  LEASE_COST_PER_YEAR,
  KG_CO2_PER_KWH,
  KG_CO2_OFFSET_PER_TREE,
  GALLONS_GASOLINE_PER_KWH,
  MILES_DRIVEN_PER_KWH,
  MAX_SYSTEM_SIZE_KW
} from '../utils/solarConstants';

interface RoofSegment {
  tiltAngle: number;
  azimuth: number;
  shadingFactor: number;
  area: number;
}

interface UseSolarCalculationsProps {
  fetchedSolarData: FetchedSolarData;
  bill: number;
  panelCount: number;
  panelType: PanelType;
  inverterType: InverterType;
  hasBattery: boolean;
  financingOption: FinancingOption;
  loanTerm: number;
  interestRate: number;
  downPayment: number;
  incentivePercentage: number;
  projectionYears: number;
  utilityInflationRate: number;
  maintenanceCost: number;
}

export const useSolarCalculations = ({
  fetchedSolarData,
  bill,
  panelCount,
  panelType,
  inverterType,
  hasBattery,
  financingOption,
  loanTerm,
  interestRate,
  downPayment,
  incentivePercentage,
  projectionYears,
  utilityInflationRate,
  maintenanceCost,
}: UseSolarCalculationsProps) => {

  const [electricityRate, setElectricityRate] = useState(0.15);

  useEffect(() => {
    // Estimate the user's electricity rate based on their bill and average US consumption for that bill amount.
    const estimatedAnnualConsumptionKwh = (bill / 0.15) * 12; // Assume $0.15/kWh to get a baseline consumption
    const estimatedRate = (bill * 12) / (estimatedAnnualConsumptionKwh || 1);
    
    if (isFinite(estimatedRate) && estimatedRate > 0) {
        setElectricityRate(estimatedRate);
    }
  }, [bill]);

  const roofSegments = useMemo(() => {
    if (fetchedSolarData?.roofSegmentStats) {
      return fetchedSolarData.roofSegmentStats.map(stat => ({
        tiltAngle: stat.pitchDegrees,
        azimuth: stat.azimuthDegrees,
        shadingFactor: stat.stats.sunshineQuantiles.reduce((a, b) => a + b, 0) / (stat.stats.sunshineQuantiles.length || 1),
        area: stat.stats.areaMeters2
      }));
    }
    return [];
  }, [fetchedSolarData]);

  const adaptedSolarData: SolarData = useMemo(() => ({
    maxArrayPanelsCount: fetchedSolarData.maxArrayPanelsCount || 100,
    maxArrayAreaMeters2: fetchedSolarData.maxArrayAreaMeters2 || 100,
    maxSunshineHoursPerYear: fetchedSolarData.maxSunshineHoursPerYear || 1600,
    carbonOffsetFactorKgPerMwh: fetchedSolarData.carbonOffsetFactorKgPerMwh || 0.5,
  }), [fetchedSolarData]);

  const totalArea = useMemo(() => roofSegments.reduce((sum, segment) => sum + segment.area, 0), [roofSegments]);
  const weightedShadingFactor = useMemo(() => totalArea > 0 ? roofSegments.reduce((sum, segment) => sum + (segment.shadingFactor * segment.area / totalArea), 0) : 0, [roofSegments, totalArea]);
  const weightedTiltAngle = useMemo(() => totalArea > 0 ? roofSegments.reduce((sum, segment) => sum + (segment.tiltAngle * segment.area / totalArea), 0) : 0, [roofSegments, totalArea]);

  const maxPossiblePanels = useMemo(() => Math.floor(totalArea / PANEL_AREA_M2), [totalArea]);
  const maxPanelsByPower = useMemo(() => Math.floor(MAX_SYSTEM_SIZE_KW / AVERAGE_PANEL_OUTPUT_KW), []);
  const adjustedMaxPanels = useMemo(() => Math.min(maxPossiblePanels, maxPanelsByPower, adaptedSolarData?.maxArrayPanelsCount || 100), [maxPossiblePanels, maxPanelsByPower, adaptedSolarData]);

  const calculateSystemCost = () => {
    const panelCost = panelCount * AVERAGE_PANEL_OUTPUT_KW * BASE_INSTALLATION_COST_PER_KW * PANEL_TYPES[panelType].costMultiplier;
    const inverterCost = INVERTER_TYPES[inverterType].cost;
    const batteryCost = hasBattery ? BATTERY_COST : 0;
    const totalCost = panelCost + inverterCost + batteryCost;
    const taxCredit = totalCost * (incentivePercentage / 100);
    return totalCost - taxCredit;
  };

  const calculateAnnualProduction = () => {
    // The AVERAGE_PANEL_OUTPUT_KW already accounts for the typical efficiency of a standard panel.
    // We no longer need to multiply by the efficiency factor again.
    const baseProduction = panelCount * AVERAGE_PANEL_OUTPUT_KW * (adaptedSolarData.maxSunshineHoursPerYear || 1600);
    const shading = Math.min(Math.max(weightedShadingFactor, 0), 1);
    const tilt = Math.max(Math.cos((weightedTiltAngle - 30) * Math.PI / 180), 0.1);
    return baseProduction * shading * tilt;
  };

  const [summaryData, setSummaryData] = useState({
    totalSavings: 0, paybackPeriod: 0, monthlyPayment: 0, monthlySaving: 0,
    co2Reduction: 0, treesEquivalent: 0, annualKwhProduction: 0,
    totalRoofArea: 0, maxPossiblePanels: 0, currentPanels: 0,
    gallonsGasSaved: 0, milesDrivenEquivalent: 0
  });

  const [savingsData, setSavingsData] = useState({
    years: [] as number[], cumulativeSavings: [] as number[],
    cumulativeCosts: [] as number[], monthlyPayments: [] as number[],
    utilityBills: [] as number[]
  });

  useEffect(() => {
    const systemCost = calculateSystemCost();
    const annualProduction = calculateAnnualProduction();
    const yearlyProduction: number[] = [];
    const yearlyData: any[] = [];
    const years = Array.from({ length: projectionYears }, (_, i) => i + 1);
    
    let cumulativeSavings = 0;
    let cumulativeCosts = systemCost;
    let cumulativeRevenue = 0;
    const monthlyPayments: number[] = [];
    const utilityBills: number[] = [];

    years.forEach((year, index) => {
      const degradation = Math.pow(1 - PANEL_TYPES[panelType].degradationRate, year - 1);
      const production = annualProduction * degradation;
      yearlyProduction.push(production);

      const utilityBillWithoutSolar = bill * Math.pow(1 + utilityInflationRate / 100, year - 1);
      utilityBills.push(utilityBillWithoutSolar);

      let monthlyPayment = 0;
      if (financingOption === 'loan') {
        const loanAmount = systemCost - (systemCost * downPayment / 100);
        if (loanAmount > 0) {
            const monthlyRate = interestRate / 100 / 12;
            const numPayments = loanTerm * 12;
            if (numPayments > 0) {
                 monthlyPayment = (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / (Math.pow(1 + monthlyRate, numPayments) - 1);
            }
        }
      } else if (financingOption === 'lease') {
        monthlyPayment = LEASE_COST_PER_YEAR / 12;
      }
      monthlyPayments.push(monthlyPayment);

      const electricityProducedValue = production * electricityRate;
      cumulativeRevenue += electricityProducedValue;
      const annualSavings = electricityProducedValue - (monthlyPayment * 12) - maintenanceCost;
      cumulativeSavings += annualSavings;
      cumulativeCosts += monthlyPayment * 12 + maintenanceCost;

      yearlyData.push({
        year, production, utilityBill: utilityBillWithoutSolar, monthlyPayment,
        monthlyMaintenance: maintenanceCost / 12, annualSavings, cumulativeSavings, cumulativeCosts,
        cumulativeRevenue
      });
    });

    setSavingsData({
      years, cumulativeSavings: yearlyData.map(d => d.cumulativeSavings),
      cumulativeCosts: yearlyData.map(d => d.cumulativeCosts), monthlyPayments, utilityBills
    });

    const firstYearProduction = yearlyProduction[0] || 0;
    const co2Reduction = firstYearProduction * KG_CO2_PER_KWH;
    const treesEquivalent = co2Reduction / KG_CO2_OFFSET_PER_TREE;
    const gallonsGasSaved = firstYearProduction * GALLONS_GASOLINE_PER_KWH;
    const milesDrivenEquivalent = firstYearProduction * MILES_DRIVEN_PER_KWH;

    let breakEvenYear = 0;
    let breakEvenMonth = 0;
    for (let i = 0; i < yearlyData.length; i++) {
      if (yearlyData[i].cumulativeRevenue >= systemCost) {
        breakEvenYear = i + 1;
        const remainingCost = systemCost - (i > 0 ? yearlyData[i - 1].cumulativeRevenue : 0);
        const yearlyRevenue = yearlyData[i].cumulativeRevenue - (i > 0 ? yearlyData[i - 1].cumulativeRevenue : 0);
        breakEvenMonth = Math.ceil(remainingCost / (yearlyRevenue || 1) * 12);
        break;
      }
    }

    const totalLifetimeSavings = yearlyData.length > 0 ? yearlyData[yearlyData.length - 1].cumulativeSavings : 0;
    const firstYearMonthlyPayment = yearlyData[0]?.monthlyPayment || 0;
    const monthlyMaintenance = maintenanceCost / 12;
    const totalMonthlyPayment = firstYearMonthlyPayment; // This will be just the loan/lease payment
    const monthlySaving = (firstYearProduction / 12 * electricityRate) - totalMonthlyPayment - monthlyMaintenance;

    setSummaryData({
      totalSavings: totalLifetimeSavings,
      paybackPeriod: breakEvenYear > 0 ? breakEvenYear + (breakEvenMonth / 12) : 0,
      monthlyPayment: totalMonthlyPayment, // This is now correctly just the loan/lease payment
      monthlySaving: monthlySaving,
      co2Reduction, treesEquivalent,
      annualKwhProduction: firstYearProduction,
      totalRoofArea: totalArea, maxPossiblePanels: adjustedMaxPanels, currentPanels: panelCount,
      gallonsGasSaved, milesDrivenEquivalent
    });
  }, [
    panelCount, panelType, inverterType, hasBattery, financingOption,
    loanTerm, interestRate, downPayment, incentivePercentage,
    bill, projectionYears, utilityInflationRate, maintenanceCost,
    roofSegments, adaptedSolarData, electricityRate
  ]);

  return { summaryData, savingsData, adjustedMaxPanels };
}; 