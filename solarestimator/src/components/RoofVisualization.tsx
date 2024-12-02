import React, { useEffect, useRef, useState } from 'react';

interface RoofSegment {
  pitchDegrees: number;
  azimuthDegrees: number;
  segmentType: string;
  groundAreaMeters2: number;
  absoluteHeightMeters: number;
  absoluteWidthMeters: number;
  bounds: {
    n: number;
    s: number;
    e: number;
    w: number;
  } | null;
  boundingBox?: {
    sw: { latitude: number; longitude: number };
    ne: { latitude: number; longitude: number };
  };
}

interface RoofVisualizationProps {
  latitude: number;
  longitude: number;
  roofSegments: RoofSegment[];
  numberOfPanels: number;
  shadingFactor: number;
  tiltFactor: number;
  apiKey: string;
}

interface CanvasPoint {
  x: number;
  y: number;
}

const RoofVisualization: React.FC<RoofVisualizationProps> = ({
  latitude,
  longitude,
  roofSegments,
  numberOfPanels,
  shadingFactor,
  tiltFactor,
  apiKey
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [canvasSize, setCanvasSize] = useState({ width: 800, height: 600 });
  const [scale, setScale] = useState(1);

  // Calculate bounds for all roof segments
  const calculateBounds = (segments: RoofSegment[]) => {
    if (!segments.length) return { minLat: 0, maxLat: 0, minLng: 0, maxLng: 0 };

    let minLat = Infinity;
    let maxLat = -Infinity;
    let minLng = Infinity;
    let maxLng = -Infinity;

    segments.forEach(segment => {
      // Try to get bounds from the transformed bounds property first
      if (segment.bounds) {
        minLat = Math.min(minLat, segment.bounds.s);
        maxLat = Math.max(maxLat, segment.bounds.n);
        minLng = Math.min(minLng, segment.bounds.w);
        maxLng = Math.max(maxLng, segment.bounds.e);
      } 
      // Fall back to boundingBox if bounds is not available
      else if (segment.boundingBox) {
        const { sw, ne } = segment.boundingBox;
        minLat = Math.min(minLat, sw.latitude, ne.latitude);
        maxLat = Math.max(maxLat, sw.latitude, ne.latitude);
        minLng = Math.min(minLng, sw.longitude, ne.longitude);
        maxLng = Math.max(maxLng, sw.longitude, ne.longitude);
      }
    });

    // If no valid bounds were found, use the center point
    if (!isFinite(minLat) || !isFinite(maxLat) || !isFinite(minLng) || !isFinite(maxLng)) {
      return {
        minLat: latitude - 0.001,
        maxLat: latitude + 0.001,
        minLng: longitude - 0.001,
        maxLng: longitude + 0.001
      };
    }

    return { minLat, maxLat, minLng, maxLng };
  };

  // Convert lat/lng to canvas coordinates
  const latLngToCanvas = (lat: number, lng: number): CanvasPoint => {
    const bounds = calculateBounds(roofSegments);
    const padding = 50; // Pixels of padding around the edges

    // Calculate the range of coordinates
    const latRange = bounds.maxLat - bounds.minLat;
    const lngRange = bounds.maxLng - bounds.minLng;

    // Prevent division by zero
    if (latRange === 0 || lngRange === 0) {
      return { x: padding, y: padding };
    }

    // Calculate the scale to fit the canvas while maintaining aspect ratio
    const latScale = (canvasSize.height - 2 * padding) / latRange;
    const lngScale = (canvasSize.width - 2 * padding) / lngRange;
    const scale = Math.min(latScale, lngScale);

    // Convert coordinates to canvas space
    const x = padding + ((lng - bounds.minLng) * scale);
    const y = canvasSize.height - padding - ((lat - bounds.minLat) * scale);

    return { x, y };
  };

  // Constants for panel visualization
  const PANEL_ASPECT_RATIO = 1.7; // Standard solar panel aspect ratio
  const PANEL_SPACING = 0.2; // Spacing between panels in meters

  // Draw roof segment
  const drawRoofSegment = (ctx: CanvasRenderingContext2D, segment: RoofSegment) => {
    // Skip if no valid bounds data
    if (!segment.bounds && !segment.boundingBox) {
      console.warn('Segment missing bounds data:', segment);
      return;
    }

    let points: CanvasPoint[];
    
    if (segment.bounds) {
      points = [
        latLngToCanvas(segment.bounds.s, segment.bounds.w), // SW
        latLngToCanvas(segment.bounds.s, segment.bounds.e), // SE
        latLngToCanvas(segment.bounds.n, segment.bounds.e), // NE
        latLngToCanvas(segment.bounds.n, segment.bounds.w)  // NW
      ];
    } else if (segment.boundingBox) {
      const { sw, ne } = segment.boundingBox;
      points = [
        latLngToCanvas(sw.latitude, sw.longitude),
        latLngToCanvas(sw.latitude, ne.longitude),
        latLngToCanvas(ne.latitude, ne.longitude),
        latLngToCanvas(ne.latitude, sw.longitude)
      ];
    } else {
      return;
    }

    // Begin drawing the roof segment
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i++) {
      ctx.lineTo(points[i].x, points[i].y);
    }
    ctx.closePath();

    // Style based on pitch and shading factor
    const brightness = Math.min(0.3 + (segment.pitchDegrees / 45) * 0.7, 1.0) * shadingFactor;
    ctx.fillStyle = `rgba(70, 130, 180, ${brightness})`;
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.lineWidth = 2;

    // Fill and stroke the segment
    ctx.fill();
    ctx.stroke();

    // Add segment information at center
    const centerPoint = {
      x: points.reduce((sum, p) => sum + p.x, 0) / points.length,
      y: points.reduce((sum, p) => sum + p.y, 0) / points.length
    };
    
    ctx.font = '12px Arial';
    ctx.fillStyle = 'white';
    ctx.textAlign = 'center';
    ctx.fillText(
      `${Math.round(segment.pitchDegrees)}°`,
      centerPoint.x,
      centerPoint.y
    );
  };

  // Draw potential panel layout
  const drawPanelLayout = (ctx: CanvasRenderingContext2D, segment: RoofSegment) => {
    // Skip if no valid bounds data
    if (!segment.bounds && !segment.boundingBox) {
      console.warn('Segment missing bounds data:', segment);
      return;
    }

    let points: CanvasPoint[];
    
    if (segment.bounds) {
      points = [
        latLngToCanvas(segment.bounds.s, segment.bounds.w), // SW
        latLngToCanvas(segment.bounds.s, segment.bounds.e), // SE
        latLngToCanvas(segment.bounds.n, segment.bounds.e), // NE
        latLngToCanvas(segment.bounds.n, segment.bounds.w)  // NW
      ];
    } else if (segment.boundingBox) {
      const { sw, ne } = segment.boundingBox;
      points = [
        latLngToCanvas(sw.latitude, sw.longitude),
        latLngToCanvas(sw.latitude, ne.longitude),
        latLngToCanvas(ne.latitude, ne.longitude),
        latLngToCanvas(ne.latitude, sw.longitude)
      ];
    } else {
      return;
    }

    // Calculate segment width and height in meters
    const segmentWidthMeters = segment.absoluteWidthMeters;
    const segmentHeightMeters = segment.absoluteHeightMeters;

    // Calculate panel dimensions in meters (maintaining aspect ratio)
    const panelWidth = Math.min(
      segmentWidthMeters / Math.ceil(Math.sqrt(numberOfPanels)),
      1.6 // Standard panel width in meters
    );
    const panelHeight = panelWidth / PANEL_ASPECT_RATIO;

    // Calculate number of panels that can fit in each direction
    const panelsWide = Math.floor(segmentWidthMeters / (panelWidth + PANEL_SPACING));
    const panelsHigh = Math.floor(segmentHeightMeters / (panelHeight + PANEL_SPACING));

    // Calculate total panels that can fit
    const totalPanels = Math.min(panelsWide * panelsHigh, numberOfPanels);

    // Calculate segment vectors
    const segmentWidth = Math.sqrt(
      Math.pow(points[1].x - points[0].x, 2) + Math.pow(points[1].y - points[0].y, 2)
    );
    const segmentHeight = Math.sqrt(
      Math.pow(points[3].x - points[0].x, 2) + Math.pow(points[3].y - points[0].y, 2)
    );

    // Calculate panel dimensions in canvas units
    const panelWidthCanvas = (segmentWidth / panelsWide) * 0.9; // 90% of available space
    const panelHeightCanvas = (segmentHeight / panelsHigh) * 0.9;

    // Calculate panel positions
    for (let row = 0; row < panelsHigh; row++) {
      for (let col = 0; col < panelsWide; col++) {
        if (row * panelsWide + col >= totalPanels) break;

        // Calculate panel position
        const xOffset = (col + 0.5) * (segmentWidth / panelsWide);
        const yOffset = (row + 0.5) * (segmentHeight / panelsHigh);

        // Calculate panel center point
        const x = points[0].x + 
          (xOffset * (points[1].x - points[0].x) / segmentWidth) +
          (yOffset * (points[3].x - points[0].x) / segmentHeight);
        const y = points[0].y + 
          (xOffset * (points[1].y - points[0].y) / segmentWidth) +
          (yOffset * (points[3].y - points[0].y) / segmentHeight);

        // Draw panel
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(Math.atan2(
          points[1].y - points[0].y,
          points[1].x - points[0].x
        ));

        // Panel appearance based on efficiency factors
        const efficiency = shadingFactor * tiltFactor;
        ctx.fillStyle = `rgba(0, 0, 0, ${0.7 * efficiency})`;
        ctx.strokeStyle = `rgba(255, 255, 255, ${0.5 * efficiency})`;
        ctx.lineWidth = 1;

        // Draw panel rectangle
        ctx.beginPath();
        ctx.rect(
          -panelWidthCanvas / 2,
          -panelHeightCanvas / 2,
          panelWidthCanvas,
          panelHeightCanvas
        );
        ctx.fill();
        ctx.stroke();

        ctx.restore();
      }
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !roofSegments.length) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Update canvas size based on container
    const updateCanvasSize = () => {
      const container = canvas.parentElement;
      if (!container) return;

      const containerWidth = container.clientWidth;
      const newWidth = Math.min(containerWidth, 1200); // Max width of 1200px
      const newHeight = Math.round(newWidth * 0.75); // 4:3 aspect ratio

      if (newWidth !== canvasSize.width || newHeight !== canvasSize.height) {
        setCanvasSize({ width: newWidth, height: newHeight });
      }
    };

    // Initial size update
    updateCanvasSize();

    // Add resize listener
    window.addEventListener('resize', updateCanvasSize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', updateCanvasSize);
    };
  }, [canvasSize.width, canvasSize.height]); // Only re-run if canvas size changes

  // Separate useEffect for drawing
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !roofSegments.length) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = canvasSize.width;
    canvas.height = canvasSize.height;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw background
    ctx.fillStyle = '#f0f0f0';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Add a title and legend
    ctx.fillStyle = '#333';
    ctx.font = 'bold 14px Arial';
    ctx.textAlign = 'left';
    ctx.fillText('Roof Segments and Solar Panel Layout', 10, 20);

    // Add legend
    const legendY = 40;
    const legendX = 10;
    
    // Draw legend items
    ctx.font = '12px Arial';
    
    // Roof pitch
    ctx.fillStyle = 'rgba(70, 130, 180, 0.7)';
    ctx.fillRect(legendX, legendY, 20, 20);
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.strokeRect(legendX, legendY, 20, 20);
    ctx.fillStyle = '#333';
    ctx.fillText('Roof Segment (showing pitch)', legendX + 30, legendY + 14);

    // Solar panel
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(legendX, legendY + 30, 20, 20);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.strokeRect(legendX, legendY + 30, 20, 20);
    ctx.fillStyle = '#333';
    ctx.fillText('Solar Panel', legendX + 30, legendY + 44);

    // Draw efficiency information
    ctx.fillText(
      `Shading Factor: ${Math.round(shadingFactor * 100)}% | Tilt Factor: ${Math.round(tiltFactor * 100)}%`,
      legendX,
      canvas.height - 20
    );

    // Draw all roof segments
    roofSegments.forEach(segment => {
      drawRoofSegment(ctx, segment);
      drawPanelLayout(ctx, segment);
    });

  }, [canvasSize, roofSegments, shadingFactor, tiltFactor, numberOfPanels]); // Add all dependencies

  return (
    <canvas
      ref={canvasRef}
      style={{
        width: '100%',
        height: 'auto',
        maxWidth: '1200px',
        display: 'block',
        margin: '0 auto'
      }}
    />
  );
};

export default RoofVisualization;
