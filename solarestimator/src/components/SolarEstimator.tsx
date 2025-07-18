// SolarEstimator.tsx
import React, { useState } from 'react';
import { FetchedSolarData } from './apiHelper';
import RoofVisualization from './RoofVisualization';
import { FinancingOption } from './Wizard';
import { PanelType, InverterType } from './SavingsCalculator/types';
import SavingsCalculatorSummary from './SavingsCalculator/SavingsCalculatorSummary';
import ChartDisplay from './SavingsCalculator/ChartDisplay';
import SystemConfiguration from './SavingsCalculator/SystemConfiguration';
import FinancialInputs from './SavingsCalculator/FinancialInputs';
import EfficiencyFactors from './SavingsCalculator/EfficiencyFactors';
import CostFactors from './SavingsCalculator/CostFactors';
import TimelineControl from './SavingsCalculator/TimelineControl';
import { Tabs, Tab, Box } from '@mui/material';
import { TrendingUp, Settings, Timeline, AttachMoney, Calculate } from '@mui/icons-material';
import { useSolarCalculations } from '../hooks/useSolarCalculations';
import '../styles/solar-estimator.css';
import '../styles/material-ui-overrides.css';

interface SolarEstimatorProps {
  solarData: FetchedSolarData;
  bill: number;
  financingOption: FinancingOption;
  onFinancingOptionChange?: (option: FinancingOption) => void;
  numberOfPanels: number;
  shadingFactor: number;
  tiltFactor: number;
}

interface RoofSegment {
  tiltAngle: number;
  azimuth: number;
  shadingFactor: number;
  area: number;
}

const SolarEstimator: React.FC<SolarEstimatorProps> = (props) => {
  const {
    solarData: fetchedSolarData,
    bill,
    numberOfPanels,
    financingOption: initialFinancingOption,
    onFinancingOptionChange,
  } = props;

  // --- UI State Management ---
  const [panelCount, setPanelCount] = useState(numberOfPanels);
  const [panelType, setPanelType] = useState<PanelType>('Monocrystalline');
  const [inverterType, setInverterType] = useState<InverterType>('StringInverter');
  const [hasBattery, setHasBattery] = useState(false);
  const [financingOption, setFinancingOption] = useState<FinancingOption>(initialFinancingOption);
  const [roofSegments, setRoofSegments] = useState<RoofSegment[]>([]);
  
  const [loanTerm, setLoanTerm] = useState(20);
  const [interestRate, setInterestRate] = useState(4.5);
  const [downPayment, setDownPayment] = useState(0);
  const [incentivePercentage, setIncentivePercentage] = useState(26);

  const [monthlyBill, setMonthlyBill] = useState(bill);
  const [projectionYears, setProjectionYears] = useState(25);
  const [inflationRate, setInflationRate] = useState(2.9);
  const [utilityInflationRate, setUtilityInflationRate] = useState(3.5);
  const [maintenanceCost, setMaintenanceCost] = useState(200);
  
  const [activeTab, setActiveTab] = useState(0);

  // --- Using the custom hook for all calculations ---
  const { summaryData, savingsData, adjustedMaxPanels } = useSolarCalculations({
    fetchedSolarData,
    bill: monthlyBill,
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
  });

  const handleFinancingOptionChange = (option: FinancingOption) => {
    setFinancingOption(option);
    if(onFinancingOptionChange) {
      onFinancingOptionChange(option);
    }
  }

  if (!fetchedSolarData) {
    return <div>Error: Solar data is missing.</div>;
  }

  return (
    <div className="solar-estimator">
      <div className="solar-estimator-container">
        <div className="solar-estimator-header">
          <h1 className="solar-estimator-title">
            Your Solar Estimate
          </h1>
          <p className="solar-estimator-subtitle">
            Personalized analysis based on your property and energy usage
          </p>
        </div>

        <div className="solar-estimator-grid">
          
          {/* Left Column */}
          <div className="solar-estimator-left-column">
            <div className="solar-estimator-card" style={{ maxHeight: '500px', display: 'flex', flexDirection: 'column' }}>
              <h2 className="solar-estimator-card-header">
                🏠 Roof Analysis & Panel Layout
              </h2>
              <div style={{ flex: 1, minHeight: 0 }}>
                <RoofVisualization
                  latitude={fetchedSolarData.latitude}
                  longitude={fetchedSolarData.longitude}
                  roofSegments={fetchedSolarData.roofSegmentStats ?? []}
                  numberOfPanels={panelCount}
                  shadingFactor={props.shadingFactor}
                  tiltFactor={props.tiltFactor}
                  apiKey={process.env.NEXT_PUBLIC_GOOGLE_SOLAR_API_KEY ?? ''}
                />
              </div>
            </div>
            <div className="solar-estimator-card">
              <h2 className="solar-estimator-card-header">
                📈 Financial Analysis
              </h2>
              <ChartDisplay
                years={savingsData.years}
                cumulativeSavings={savingsData.cumulativeSavings}
                cumulativeCosts={savingsData.cumulativeCosts}
                monthlyPayments={savingsData.monthlyPayments}
                utilityBills={savingsData.utilityBills}
              />
            </div>
          </div>

          {/* Right Column */}
          <div className="solar-estimator-right-column">
            <div className="solar-estimator-card">
              <SavingsCalculatorSummary
                {...summaryData}
              />
            </div>
            <div className="solar-estimator-card">
              
              <div className="solar-estimator-tabs-container">
                <Tabs 
                  value={activeTab} 
                  onChange={(_, val) => setActiveTab(val)} 
                  aria-label="Configuration Tabs" 
                  variant="scrollable"
                  sx={{
                    '& .MuiTab-root': {
                      minWidth: 'auto',
                      flex: 1,
                    }
                  }}
                >
                  <Tab label="System" icon={<Settings />} iconPosition="start" />
                  <Tab label="Financial" icon={<AttachMoney />} iconPosition="start" />
                  <Tab label="Efficiency" icon={<TrendingUp />} iconPosition="start" />
                  <Tab label="Timeline" icon={<Timeline />} iconPosition="start" />
                  <Tab label="Costs" icon={<Calculate />} iconPosition="start" />
                </Tabs>
              </div>
              <div className="solar-estimator-tab-content">
                
                {activeTab === 0 && <SystemConfiguration
                  panelCount={panelCount} panelType={panelType} inverterType={inverterType} hasBattery={hasBattery}
                  onPanelCountChange={setPanelCount} onPanelTypeChange={setPanelType}
                  onInverterTypeChange={setInverterType} onBatteryChange={setHasBattery}
                  maxPanels={adjustedMaxPanels} />}
                {activeTab === 1 && <FinancialInputs
                  financingOption={financingOption} loanTerm={loanTerm} interestRate={interestRate} downPayment={downPayment} incentivePercentage={incentivePercentage}
                  onFinancingOptionChange={handleFinancingOptionChange} onLoanTermChange={setLoanTerm} onInterestRateChange={setInterestRate}
                  onDownPaymentChange={setDownPayment} onIncentivePercentageChange={setIncentivePercentage} />}
                {activeTab === 2 && <EfficiencyFactors roofSegments={roofSegments} onShadingChange={(val) => setRoofSegments(s => s.map(seg => ({...seg, shadingFactor: val})))} onTiltChange={(val) => setRoofSegments(s => s.map(seg => ({...seg, tiltAngle: val})))} />}
                {activeTab === 3 && <TimelineControl timelineYears={projectionYears} maxYears={40} onTimelineChange={setProjectionYears} />}
                {activeTab === 4 && <CostFactors maintenanceCost={maintenanceCost} inflationRate={inflationRate} utilityInflationRate={utilityInflationRate} onMaintenanceCostChange={setMaintenanceCost} onInflationRateChange={setInflationRate} onUtilityInflationRateChange={setUtilityInflationRate} />}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SolarEstimator;
