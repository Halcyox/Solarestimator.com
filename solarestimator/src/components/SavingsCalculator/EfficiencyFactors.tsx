import React from 'react';
import { Slider, Typography, Box } from '@mui/material';

interface RoofSegment {
  tiltAngle: number;
  azimuth: number;
  shadingFactor: number;
  area: number;
}

interface EfficiencyFactorsProps {
  roofSegments: RoofSegment[];
  onShadingChange: (value: number) => void;
  onTiltChange: (value: number) => void;
}

const EfficiencyFactors: React.FC<EfficiencyFactorsProps> = ({
  roofSegments,
  onShadingChange,
  onTiltChange,
}) => {
  // Calculate weighted average shading factor and tilt angle based on segment areas
  const totalArea = roofSegments.reduce((sum, segment) => sum + segment.area, 0);
  const weightedShadingFactor = roofSegments.reduce((sum, segment) => 
    sum + (segment.shadingFactor * segment.area / totalArea), 0);
  const weightedTiltAngle = roofSegments.reduce((sum, segment) => 
    sum + (segment.tiltAngle * segment.area / totalArea), 0);

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Efficiency Factors
      </Typography>

      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle1" gutterBottom>
          Average Shading Factor: {weightedShadingFactor.toFixed(1)}%
        </Typography>
        <Typography variant="body2" color="textSecondary" gutterBottom>
          Based on weighted average of roof segments
        </Typography>
        {roofSegments.map((segment, index) => (
          <Typography variant="caption" display="block" key={index}>
            Segment {index + 1}: {segment.shadingFactor}% shading ({segment.area.toFixed(1)} m²)
          </Typography>
        ))}
      </Box>

      <Box>
        <Typography variant="subtitle1" gutterBottom>
          Average Tilt Angle: {weightedTiltAngle.toFixed(1)}°
        </Typography>
        <Typography variant="body2" color="textSecondary" gutterBottom>
          Based on weighted average of roof segments
        </Typography>
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
