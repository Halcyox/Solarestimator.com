import React from 'react';
import { Slider, Typography, Box, Tooltip, IconButton } from '@mui/material';
import { Info } from '@mui/icons-material';

/**
 * Props interface for the EfficiencyFactors component
 * @interface EfficiencyFactorsProps
 * @property {RoofSegment[]} roofSegments - Array of roof segments with their respective tilt angles, azimuths, shading factors, and areas
 * @property {(value: number) => void} onShadingChange - Callback for shading factor updates
 * @property {(value: number) => void} onTiltChange - Callback for tilt angle updates
 */
interface EfficiencyFactorsProps {
  roofSegments: RoofSegment[];
  onShadingChange: (value: number) => void;
  onTiltChange: (value: number) => void;
}

/**
 * RoofSegment interface
 * @interface RoofSegment
 * @property {number} tiltAngle - Tilt angle of the roof segment
 * @property {number} azimuth - Azimuth of the roof segment
 * @property {number} shadingFactor - Shading factor of the roof segment
 * @property {number} area - Area of the roof segment
 */
interface RoofSegment {
  tiltAngle: number;
  azimuth: number;
  shadingFactor: number;
  area: number;
}

/**
 * EfficiencyFactors Component
 * 
 * A form component that allows users to adjust various efficiency-related factors
 * that affect solar panel performance. These factors include:
 * - Average Shading Factor (based on weighted average of roof segments)
 * - Average Tilt Angle (based on weighted average of roof segments)
 * 
 * Each factor is displayed with a tooltip providing additional information about
 * the impact of each setting.
 * 
 * Features:
 * - Intuitive display of efficiency factors
 * - Real-time updates
 * - Informative tooltips
 * - Percentage-based inputs
 * - Visual feedback
 * 
 * @component
 * @param {EfficiencyFactorsProps} props - Component props
 * @param {RoofSegment[]} props.roofSegments - Array of roof segments
 * @param {Function} props.onShadingChange - Callback for shading factor updates
 * @param {Function} props.onTiltChange - Callback for tilt angle updates
 * @returns {JSX.Element} Rendered form component
 * 
 * @example
 * ```tsx
 * <EfficiencyFactors
 *   roofSegments={[
 *     { tiltAngle: 30, azimuth: 180, shadingFactor: 10, area: 100 },
 *     { tiltAngle: 20, azimuth: 200, shadingFactor: 20, area: 150 },
 *   ]}
 *   onShadingChange={(value) => {
 *     console.log('Shading factor updated:', value);
 *     // Handle updates
 *   }}
 *   onTiltChange={(value) => {
 *     console.log('Tilt angle updated:', value);
 *     // Handle updates
 *   }}
 * />
 * ```
 */
const EfficiencyFactors: React.FC<EfficiencyFactorsProps> = ({
  roofSegments,
  onShadingChange,
  onTiltChange,
}) => {
  /**
   * Helper function to calculate weighted average of an array of numbers
   * @param {number[]} array - Array of numbers
   * @param {number[]} weights - Array of weights corresponding to the numbers
   * @returns {number} Weighted average
   */
  const calculateWeightedAverage = (array: number[], weights: number[]) => {
    const sum = array.reduce((acc, value, index) => acc + value * weights[index], 0);
    const weightSum = weights.reduce((acc, value) => acc + value, 0);
    return sum / weightSum;
  };

  /**
   * Helper function to create tooltip content with title and description
   * @param {string} title - The tooltip title
   * @param {string} description - The detailed description
   * @returns {JSX.Element} Formatted tooltip content
   */
  const createTooltipContent = (title: string, description: string) => (
    <Box>
      <Typography variant="subtitle2">{title}</Typography>
      <Typography variant="body2">{description}</Typography>
    </Box>
  );

  // Calculate weighted average shading factor and tilt angle based on segment areas
  const totalArea = roofSegments.reduce((sum, segment) => sum + segment.area, 0);
  const weightedShadingFactor = calculateWeightedAverage(
    roofSegments.map((segment) => segment.shadingFactor),
    roofSegments.map((segment) => segment.area / totalArea)
  );
  const weightedTiltAngle = calculateWeightedAverage(
    roofSegments.map((segment) => segment.tiltAngle),
    roofSegments.map((segment) => segment.area / totalArea)
  );

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Efficiency Factors
      </Typography>

      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <Typography>Average Shading Factor: {weightedShadingFactor.toFixed(1)}%</Typography>
          <Tooltip title={createTooltipContent(
            "Average Shading Factor",
            "The weighted average of shading factors from all roof segments. Lower percentages mean less shading and better performance."
          )}>
            <IconButton size="small">
              <Info fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
        {roofSegments.map((segment, index) => (
          <Typography variant="caption" display="block" key={index}>
            Segment {index + 1}: {segment.shadingFactor}% shading ({segment.area.toFixed(1)} m²)
          </Typography>
        ))}
      </Box>

      <Box>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <Typography>Average Tilt Angle: {weightedTiltAngle.toFixed(1)}°</Typography>
          <Tooltip title={createTooltipContent(
            "Average Tilt Angle",
            "The weighted average of tilt angles from all roof segments. Optimal tilt angles vary by location and time of year."
          )}>
            <IconButton size="small">
              <Info fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
        {roofSegments.map((segment, index) => (
          <Typography variant="caption" display="block" key={index}>
            Segment {index + 1}: {segment.tiltAngle}° tilt ({segment.area.toFixed(1)} m²)
          </Typography>
        ))}
      </Box>
    </Box>
  );
};

export default EfficiencyFactors;