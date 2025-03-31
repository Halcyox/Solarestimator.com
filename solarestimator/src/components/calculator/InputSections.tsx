import React, { useState, useCallback } from 'react';
import { SavingsCalculatorProps } from './types';

const InputSections: React.FC<SavingsCalculatorProps> = ({
  solarData,
  onPanelChange,
  onShadingChange,
  onTiltChange
}) => {
  // Local state for inputs
  const [numberOfPanels, setNumberOfPanels] = useState<number>(Math.min(solarData.maxArrayPanelsCount, 20));
  const [shadingFactor, setShadingFactor] = useState<number>(0.9); // Default 90% efficiency
  const [tiltFactor, setTiltFactor] = useState<number>(0.9); // Default 90% efficiency
  const [financingOption, setFinancingOption] = useState<'cash' | 'loan' | 'lease'>('cash');
  const [panelType, setPanelType] = useState<'Monocrystalline' | 'Polycrystalline' | 'Thin-film'>('Monocrystalline');
  const [inverterType, setInverterType] = useState<string>('String Inverter');
  const [batteryStorage, setBatteryStorage] = useState<boolean>(false);
  const [loanInterestRate, setLoanInterestRate] = useState<number>(0.04); // Default 4% loan interest rate
  const [loanTermYears, setLoanTermYears] = useState<number>(10); // Default loan term of 10 years

  // Callbacks for handling changes
  const handlePanelChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const newCount = Number(event.target.value);
    setNumberOfPanels(newCount);
    onPanelChange(newCount);
  }, [onPanelChange]);

  const handleShadingChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const newShading = Number(event.target.value);
    setShadingFactor(newShading);
    onShadingChange(newShading);
  }, [onShadingChange]);

  const handleTiltChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const newTilt = Number(event.target.value);
    setTiltFactor(newTilt);
    onTiltChange(newTilt);
  }, [onTiltChange]);

  return (
    <div className="input-sections">
      <div className="input-group">
        <h3>System Configuration</h3>
        <label>
          Number of Panels:
          <input
            type="range"
            min="1"
            max={solarData.maxArrayPanelsCount}
            value={numberOfPanels}
            onChange={handlePanelChange}
          />
          {numberOfPanels}
        </label>
        <label>
          Panel Type:
          <select value={panelType} onChange={(e) => setPanelType(e.target.value as any)}>
            <option value="Monocrystalline">Monocrystalline</option>
            <option value="Polycrystalline">Polycrystalline</option>
            <option value="Thin-film">Thin-film</option>
          </select>
        </label>
        <label>
          Inverter Type:
          <select value={inverterType} onChange={(e) => setInverterType(e.target.value)}>
            <option value="String Inverter">String Inverter</option>
            <option value="Micro Inverter">Micro Inverter</option>
            <option value="Power Optimizer">Power Optimizer</option>
          </select>
        </label>
        <label>
          Include Battery Storage:
          <input
            type="checkbox"
            checked={batteryStorage}
            onChange={(e) => setBatteryStorage(e.target.checked)}
          />
        </label>
      </div>

      <div className="input-group">
        <h3>Efficiency Factors</h3>
        <label>
          Shading Factor:
          <input
            type="range"
            min="0.5"
            max="1.0"
            step="0.01"
            value={shadingFactor}
            onChange={handleShadingChange}
          />
          {(shadingFactor * 100).toFixed(0)}%
        </label>
        <label>
          Tilt Factor:
          <input
            type="range"
            min="0.5"
            max="1.0"
            step="0.01"
            value={tiltFactor}
            onChange={handleTiltChange}
          />
          {(tiltFactor * 100).toFixed(0)}%
        </label>
      </div>

      <div className="input-group">
        <h3>Financial Options</h3>
        <label>
          Financing Option:
          <select value={financingOption} onChange={(e) => setFinancingOption(e.target.value as any)}>
            <option value="cash">Cash Purchase</option>
            <option value="loan">Loan Financing</option>
            <option value="lease">Leasing</option>
          </select>
        </label>
        {financingOption === 'loan' && (
          <>
            <label>
              Loan Interest Rate (%):
              <input
                type="number"
                min="0"
                max="10"
                step="0.1"
                value={loanInterestRate * 100}
                onChange={(e) => setLoanInterestRate(Number(e.target.value) / 100)}
              />
            </label>
            <label>
              Loan Term (Years):
              <input
                type="number"
                min="1"
                max="30"
                value={loanTermYears}
                onChange={(e) => setLoanTermYears(Number(e.target.value))}
              />
            </label>
          </>
        )}
      </div>
    </div>
  );
};

export default InputSections;
