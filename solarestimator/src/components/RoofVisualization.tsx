import React, { useEffect, useRef, useState } from 'react';
import { RoofSegmentStat } from './apiHelper';

// We'll skip redefining window.google type since it's defined elsewhere

interface RoofVisualizationProps {
  latitude: number;
  longitude: number;
  roofSegments: RoofSegmentStat[];
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
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });
  const [scale, setScale] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showAngles, setShowAngles] = useState(true);

  // Calculate bounds for all roof segments
  const calculateBounds = (segments: RoofSegmentStat[]) => {
    if (!segments.length) return { minLat: 0, maxLat: 0, minLng: 0, maxLng: 0 };

    let minLat = Infinity;
    let maxLat = -Infinity;
    let minLng = Infinity;
    let maxLng = -Infinity;

    segments.forEach(segment => {
      // Get bounds from the boundingBox
      if (segment.boundingBox) {
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
    const padding = 80; // Increased padding for better visual spacing

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
  const drawRoofSegment = (ctx: CanvasRenderingContext2D, segment: RoofSegmentStat) => {
    // Skip if no valid bounds data
    if (!segment.boundingBox) {
      console.warn('Segment missing bounds data:', segment);
      return;
    }

    const { sw, ne } = segment.boundingBox;
    const points: CanvasPoint[] = [
      latLngToCanvas(sw.latitude, sw.longitude),
      latLngToCanvas(sw.latitude, ne.longitude),
      latLngToCanvas(ne.latitude, ne.longitude),
      latLngToCanvas(ne.latitude, sw.longitude)
    ];

    // Begin drawing the roof segment
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i++) {
      ctx.lineTo(points[i].x, points[i].y);
    }
    ctx.closePath();

    // Enhanced styling based on pitch and shading factor
    const brightness = Math.min(0.4 + (segment.pitchDegrees / 45) * 0.6, 1.0) * shadingFactor;
    const gradient = ctx.createLinearGradient(points[0].x, points[0].y, points[2].x, points[2].y);
    gradient.addColorStop(0, `rgba(59, 130, 246, ${brightness})`); // Blue-500
    gradient.addColorStop(1, `rgba(37, 99, 235, ${brightness})`); // Blue-600
    
    ctx.fillStyle = gradient;
    ctx.strokeStyle = 'rgba(30, 58, 138, 0.8)'; // Blue-800
    ctx.lineWidth = 3;

    // Fill and stroke the segment
    ctx.fill();
    ctx.stroke();

    if (showAngles) {
      // Add segment information at center with enhanced styling
      const centerPoint = {
        x: points.reduce((sum, p) => sum + p.x, 0) / points.length,
        y: points.reduce((sum, p) => sum + p.y, 0) / points.length
      };
      
      // Background for text
      ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
      ctx.fillRect(centerPoint.x - 25, centerPoint.y - 12, 50, 24);
      
      // Text styling
      ctx.font = 'bold 14px Inter, system-ui, sans-serif';
      ctx.fillStyle = '#1e40af'; // Blue-800
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(
        `${Math.round(segment.pitchDegrees)}°`,
        centerPoint.x,
        centerPoint.y
      );
    }
  };

  // Draw potential panel layout
  const drawPanelLayout = (ctx: CanvasRenderingContext2D, segment: RoofSegmentStat, segmentIndex: number) => {
    // Skip if no valid bounds data
    if (!segment.boundingBox) {
      console.warn('Segment missing bounds data:', segment);
      return;
    }

    const { sw, ne } = segment.boundingBox;
    const points: CanvasPoint[] = [
      latLngToCanvas(sw.latitude, sw.longitude),
      latLngToCanvas(sw.latitude, ne.longitude),
      latLngToCanvas(ne.latitude, ne.longitude),
      latLngToCanvas(ne.latitude, sw.longitude)
    ];

    // Calculate segment width and height in meters
    const segmentWidthMeters = (segment as any).absoluteWidthMeters || 
                               Math.sqrt(segment.stats.areaMeters2); // Estimate width from area
    const segmentHeightMeters = (segment as any).absoluteHeightMeters || 
                               Math.sqrt(segment.stats.areaMeters2); // Estimate height from area

    // Calculate panel dimensions in meters (maintaining aspect ratio)
    const panelWidth = Math.min(
      segmentWidthMeters / Math.ceil(Math.sqrt(numberOfPanels)),
      1.6 // Standard panel width in meters
    );
    const panelHeight = panelWidth / PANEL_ASPECT_RATIO;

    // Calculate number of panels that can fit in each direction
    const panelsWide = Math.floor(segmentWidthMeters / (panelWidth + PANEL_SPACING));
    const panelsHigh = Math.floor(segmentHeightMeters / (panelHeight + PANEL_SPACING));

    // Calculate total panels that can fit on this segment
    const maxPanelsForSegment = panelsWide * panelsHigh;

    // Calculate segment vectors
    const segmentWidth = Math.sqrt(
      Math.pow(points[1].x - points[0].x, 2) + Math.pow(points[1].y - points[0].y, 2)
    );
    const segmentHeight = Math.sqrt(
      Math.pow(points[3].x - points[0].x, 2) + Math.pow(points[3].y - points[0].y, 2)
    );

    // Calculate panel dimensions in canvas units
    const panelWidthCanvas = (segmentWidth / panelsWide) * 0.85; // 85% of available space
    const panelHeightCanvas = (segmentHeight / panelsHigh) * 0.85;

    // Distribute panels across segments based on area
    const totalSegmentArea = roofSegments.reduce((sum, seg) => sum + seg.stats.areaMeters2, 0);
    const segmentAreaRatio = segment.stats.areaMeters2 / totalSegmentArea;
    const panelsForThisSegment = Math.floor(numberOfPanels * segmentAreaRatio);
    
    // Ensure we don't exceed the maximum panels that can fit on this segment
    const actualPanelsForSegment = Math.min(panelsForThisSegment, maxPanelsForSegment);

    // Calculate panel positions
    for (let row = 0; row < panelsHigh; row++) {
      for (let col = 0; col < panelsWide; col++) {
        if (row * panelsWide + col >= actualPanelsForSegment) break;

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

        // Draw panel with enhanced styling
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(Math.atan2(
          points[1].y - points[0].y,
          points[1].x - points[0].x
        ));

        // Panel appearance based on efficiency factors with modern styling
        const efficiency = shadingFactor * tiltFactor;
        
        // Create gradient for panel
        const panelGradient = ctx.createLinearGradient(
          -panelWidthCanvas / 2, -panelHeightCanvas / 2,
          panelWidthCanvas / 2, panelHeightCanvas / 2
        );
        panelGradient.addColorStop(0, `rgba(15, 23, 42, ${0.8 * efficiency})`); // Slate-900
        panelGradient.addColorStop(1, `rgba(30, 41, 59, ${0.9 * efficiency})`); // Slate-800
        
        ctx.fillStyle = panelGradient;
        ctx.strokeStyle = `rgba(255, 255, 255, ${0.6 * efficiency})`;
        ctx.lineWidth = 2;

        // Draw panel rectangle with rounded corners effect
        ctx.beginPath();
        ctx.roundRect(
          -panelWidthCanvas / 2,
          -panelHeightCanvas / 2,
          panelWidthCanvas,
          panelHeightCanvas,
          4
        );
        ctx.fill();
        ctx.stroke();

        // Add subtle highlight
        ctx.strokeStyle = `rgba(255, 255, 255, ${0.3 * efficiency})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(-panelWidthCanvas / 2 + 2, -panelHeightCanvas / 2 + 2);
        ctx.lineTo(panelWidthCanvas / 2 - 2, -panelHeightCanvas / 2 + 2);
        ctx.stroke();

        ctx.restore();
      }
    }
  };

  // Add a ResizeObserver to update canvas size when the container resizes
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const resizeObserver = new ResizeObserver(entries => {
      if (entries.length > 0) {
        const { width, height } = entries[0].contentRect;
        setCanvasSize({ width, height });
      }
    });

    resizeObserver.observe(container);

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  // Redraw canvas when data or size changes
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || canvasSize.width === 0 || canvasSize.height === 0 || loading || error) {
      return;
    }
    
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      setError('Could not get canvas context.');
      return;
    }
    
    canvas.width = canvasSize.width;
    canvas.height = canvasSize.height;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#f3f4f6';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    if (roofSegments.length > 0) {
      roofSegments.forEach(segment => drawRoofSegment(ctx, segment));
      roofSegments.forEach((segment, index) => drawPanelLayout(ctx, segment, index));
    } else {
      ctx.fillStyle = '#6b7280';
      ctx.font = '16px Inter, system-ui, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('No roof segments data available.', canvas.width / 2, canvas.height / 2);
    }
  }, [
    roofSegments,
    numberOfPanels,
    shadingFactor,
    tiltFactor,
    canvasSize,
    loading,
    error,
    showAngles,
  ]);

  return (
    <div ref={containerRef} style={{ width: '100%', height: '100%', position: 'relative', background: '#f3f4f6' }}>
      {loading && (
        <div style={{ /* loading styles */ }}>Loading...</div>
      )}
      {error && (
        <div style={{ /* error styles */ }}>Error: {error}</div>
      )}
      <canvas
        ref={canvasRef}
        style={{
          width: '100%',
          height: '100%',
          display: loading || error ? 'none' : 'block',
        }}
      />
      {!(loading || error) && (
        <>
          <div style={{ position: 'absolute', bottom: '10px', right: '10px', fontSize: '10px', color: '#9ca3af' }}>
            Shading Factor: {shadingFactor.toFixed(2)}% | Tilt Factor: {tiltFactor.toFixed(2)}%
          </div>
          <div style={{ position: 'absolute', top: '10px', left: '10px', background: 'rgba(255,255,255,0.8)', padding: '8px', borderRadius: '6px' }}>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '4px' }}>
                <div style={{ width: '20px', height: '10px', background: '#3b82f6', marginRight: '8px', border: '1px solid #1e40af' }}></div>
                <span style={{ fontSize: '12px' }}>Roof Segment (showing pitch)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <div style={{ width: '20px', height: '10px', background: '#1e293b', marginRight: '8px', border: '1px solid #0f172a' }}></div>
                <span style={{ fontSize: '12px' }}>Solar Panel</span>
              </div>
          </div>
          <div style={{ position: 'absolute', top: '10px', right: '10px', background: 'rgba(255,255,255,0.8)', padding: '8px', borderRadius: '6px' }}>
            <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
              <input 
                type="checkbox" 
                checked={showAngles} 
                onChange={() => setShowAngles(!showAngles)}
                style={{ marginRight: '8px' }}
              />
              <span style={{ fontSize: '12px' }}>Show Angles</span>
            </label>
          </div>
        </>
      )}
    </div>
  );
};

export default RoofVisualization;
