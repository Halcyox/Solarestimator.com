import React, { useEffect, useRef, useState } from 'react';
import { RoofSegmentStat, BuildingInsights } from './apiHelper';

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
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [canvasSize, setCanvasSize] = useState({ width: 800, height: 600 });
  const [scale, setScale] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
  };

  // Draw potential panel layout
  const drawPanelLayout = (ctx: CanvasRenderingContext2D, segment: RoofSegmentStat) => {
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
    const panelWidthCanvas = (segmentWidth / panelsWide) * 0.85; // 85% of available space
    const panelHeightCanvas = (segmentHeight / panelsHigh) * 0.85;

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

    // Enhanced background with gradient
    const bgGradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    bgGradient.addColorStop(0, '#f8fafc'); // Slate-50
    bgGradient.addColorStop(1, '#f1f5f9'); // Slate-100
    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Add a modern title and legend
    ctx.fillStyle = '#1e293b'; // Slate-800
    ctx.font = 'bold 18px Inter, system-ui, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('Roof Segments and Solar Panel Layout', 20, 30);

    // Enhanced legend with better styling
    const legendY = 60;
    const legendX = 20;
    
    // Legend background
    ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
    ctx.fillRect(legendX - 10, legendY - 10, 300, 80);
    ctx.strokeStyle = 'rgba(226, 232, 240, 0.8)'; // Slate-200
    ctx.lineWidth = 1;
    ctx.strokeRect(legendX - 10, legendY - 10, 300, 80);
    
    // Draw legend items with enhanced styling
    ctx.font = '14px Inter, system-ui, sans-serif';
    
    // Roof pitch
    const roofGradient = ctx.createLinearGradient(legendX, legendY, legendX + 20, legendY + 20);
    roofGradient.addColorStop(0, 'rgba(59, 130, 246, 0.8)'); // Blue-500
    roofGradient.addColorStop(1, 'rgba(37, 99, 235, 0.9)'); // Blue-600
    ctx.fillStyle = roofGradient;
    ctx.fillRect(legendX, legendY, 20, 20);
    ctx.strokeStyle = 'rgba(30, 58, 138, 0.8)'; // Blue-800
    ctx.lineWidth = 2;
    ctx.strokeRect(legendX, legendY, 20, 20);
    ctx.fillStyle = '#1e293b'; // Slate-800
    ctx.fillText('Roof Segment (showing pitch)', legendX + 30, legendY + 14);

    // Solar panel
    const panelGradient = ctx.createLinearGradient(legendX, legendY + 30, legendX + 20, legendY + 50);
    panelGradient.addColorStop(0, 'rgba(15, 23, 42, 0.8)'); // Slate-900
    panelGradient.addColorStop(1, 'rgba(30, 41, 59, 0.9)'); // Slate-800
    ctx.fillStyle = panelGradient;
    ctx.fillRect(legendX, legendY + 30, 20, 20);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.lineWidth = 2;
    ctx.strokeRect(legendX, legendY + 30, 20, 20);
    ctx.fillStyle = '#1e293b'; // Slate-800
    ctx.fillText('Solar Panel', legendX + 30, legendY + 44);

    // Enhanced efficiency information
    ctx.fillStyle = '#64748b'; // Slate-500
    ctx.font = '12px Inter, system-ui, sans-serif';
    ctx.fillText(
      `Shading Factor: ${Math.round(shadingFactor * 100)}% | Tilt Factor: ${Math.round(tiltFactor * 100)}%`,
      legendX,
      canvas.height - 30
    );

    // Draw all roof segments
    roofSegments.forEach(segment => {
      drawRoofSegment(ctx, segment);
      drawPanelLayout(ctx, segment);
    });

  }, [canvasSize, roofSegments, shadingFactor, tiltFactor, numberOfPanels]); // Add all dependencies

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600">Loading roof visualization...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-8 bg-gradient-to-br from-red-50 to-red-100 rounded-lg">
        <div className="text-red-600 text-lg font-semibold mb-2">⚠️ Error</div>
        <div className="text-red-500">Error loading visualization: {error}</div>
      </div>
    );
  }

  return (
    <div className="relative">
      <canvas
        ref={canvasRef}
        style={{
          width: '100%',
          height: 'auto',
          maxWidth: '1200px',
          display: 'block',
          margin: '0 auto',
          borderRadius: '12px',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
        }}
      />
    </div>
  );
};

export default RoofVisualization;
