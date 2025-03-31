import React, { useEffect, useRef, useState } from 'react';
<<<<<<< Updated upstream

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
=======
import { RoofSegmentStat, BuildingInsights } from './apiHelper';

declare global {
  interface Window {
    google: typeof google;
  }
>>>>>>> Stashed changes
}

interface RoofVisualizationProps {
  latitude: number;
  longitude: number;
<<<<<<< Updated upstream
  roofSegments: RoofSegment[];
=======
  roofSegments: RoofSegmentStat[];
>>>>>>> Stashed changes
  numberOfPanels: number;
  shadingFactor: number;
  tiltFactor: number;
  apiKey: string;
}

<<<<<<< Updated upstream
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
=======
const MapComponent: React.FC<{
  center: google.maps.LatLngLiteral;
  zoom: number;
  buildingData: BuildingInsights | null;
}> = ({ center, zoom, buildingData }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map>();
  const [overlay, setOverlay] = useState<any>();

  class RoofOverlay extends window.google.maps.OverlayView {
    private canvas: HTMLCanvasElement | null = null;
    private buildingData: BuildingInsights;
    private mapInstance: google.maps.Map | null = null;

    constructor(buildingData: BuildingInsights, map: google.maps.Map) {
      super();
      this.buildingData = buildingData;
      this.mapInstance = map;
      this.setMap(map);
    }

    onAdd(): void {
      const canvas = document.createElement('canvas');
      canvas.style.position = 'absolute';
      const panes = this.getPanes();
      if (panes?.overlayMouseTarget) {
        panes.overlayMouseTarget.appendChild(canvas);
        this.canvas = canvas;
      } else {
        console.error("Cannot add RoofOverlay: Map panes not available.");
      }
    }

    draw(): void {
      if (!this.canvas || !this.mapInstance) return;

      const overlayProjection = this.getProjection();
      if (!overlayProjection) {
        console.error("Cannot draw RoofOverlay: Map projection not available.");
        return;
      }

      const solarPotential = this.buildingData.solarPotential;
      if (!solarPotential?.roofSegmentStats || solarPotential.roofSegmentStats.length === 0) {
        this.canvas.width = 0;
        this.canvas.height = 0;
        return;
      }

      const segments = solarPotential.roofSegmentStats;

      const bounds = new google.maps.LatLngBounds();
      segments.forEach(segment => {
        bounds.extend(new google.maps.LatLng(segment.boundingBox.sw.latitude, segment.boundingBox.sw.longitude));
        bounds.extend(new google.maps.LatLng(segment.boundingBox.ne.latitude, segment.boundingBox.ne.longitude));
      });

      const swPx = overlayProjection.fromLatLngToDivPixel(bounds.getSouthWest());
      const nePx = overlayProjection.fromLatLngToDivPixel(bounds.getNorthEast());

      if (!swPx || !nePx) {
        console.error("Cannot draw RoofOverlay: Failed to convert LatLng bounds to pixels.");
        return;
      }

      this.canvas.style.left = swPx.x + 'px';
      this.canvas.style.top = nePx.y + 'px';
      this.canvas.width = nePx.x - swPx.x;
      this.canvas.height = swPx.y - nePx.y;

      const ctx = this.canvas.getContext('2d');
      if (!ctx) return;

      ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

      const maxSunshine = solarPotential.maxSunshineHoursPerYear || 1;

      segments.forEach(segment => {
        const segmentSw = overlayProjection.fromLatLngToDivPixel(
          new google.maps.LatLng(segment.boundingBox.sw.latitude, segment.boundingBox.sw.longitude)
        );
        const segmentNe = overlayProjection.fromLatLngToDivPixel(
          new google.maps.LatLng(segment.boundingBox.ne.latitude, segment.boundingBox.ne.longitude)
        );

        if (!segmentSw || !segmentNe) return;

        const medianSunshine = segment.stats.sunshineQuantiles?.[Math.floor(segment.stats.sunshineQuantiles.length / 2)] || 0;
        const sunshineIntensity = medianSunshine / maxSunshine;
        
        const hue = 60 * (1 - sunshineIntensity);
        ctx.fillStyle = `hsla(${hue}, 100%, 50%, 0.6)`;
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.lineWidth = 1;

        ctx.beginPath();
        ctx.rect(
          segmentSw.x - swPx.x,
          segmentNe.y - nePx.y,
          segmentNe.x - segmentSw.x,
          segmentSw.y - segmentNe.y
        );
        ctx.fill();
        ctx.stroke();
      });

      if (solarPotential.solarPanels) {
        solarPotential.solarPanels.forEach(panel => {
          const point = overlayProjection.fromLatLngToDivPixel(
            new google.maps.LatLng(panel.center.latitude, panel.center.longitude)
          );
          if (!point) return;

          ctx.fillStyle = 'rgba(26, 115, 232, 0.8)';
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.9)';
          ctx.lineWidth = 0.5;

          const panelSize = 4;
          ctx.beginPath();
          ctx.rect(
            point.x - swPx.x - panelSize/2,
            point.y - nePx.y - panelSize/2,
            panelSize,
            panelSize
          );
          ctx.fill();
          ctx.stroke();
        });
      }
    }

    onRemove(): void {
      if (this.canvas && this.canvas.parentNode) {
        this.canvas.parentNode.removeChild(this.canvas);
        this.canvas = null;
      }
      this.mapInstance = null;
    }
  }

  useEffect(() => {
    if (ref.current && !map && window.google?.maps?.Map) {
      const mapInstance = new window.google.maps.Map(ref.current, {
        center,
        zoom: 18,
        mapTypeId: 'satellite',
        tilt: 0,
        disableDefaultUI: true,
        gestureHandling: "none",
        keyboardShortcuts: false,
      });
      setMap(mapInstance);
    } else if (!window.google?.maps?.Map) {
      console.error("Google Maps library not loaded when trying to initialize map.");
    }
  }, [ref, map, center, zoom]);

  useEffect(() => {
    if (!map) return;

    if (overlay) {
      overlay.setMap(null);
      setOverlay(null);
    }

    if (buildingData && buildingData.solarPotential?.roofSegmentStats) {
      const newOverlay = new RoofOverlay(buildingData, map);
      setOverlay(newOverlay);
      
      const bounds = new google.maps.LatLngBounds();
      buildingData.solarPotential.roofSegmentStats.forEach(segment => {
        bounds.extend(new google.maps.LatLng(segment.boundingBox.sw.latitude, segment.boundingBox.sw.longitude));
        bounds.extend(new google.maps.LatLng(segment.boundingBox.ne.latitude, segment.boundingBox.ne.longitude));
      });
      if (!bounds.isEmpty()) {
        map.fitBounds(bounds, 40);
      }
    } else {
      console.log("No valid building data or roof segments to display overlay.");
    }

    return () => {
      if (overlay) {
        overlay.setMap(null);
      }
    };
  }, [map, buildingData]);

  return <div ref={ref} style={{ width: '100%', height: '400px' }} aria-label="Roof visualization map" />;
};

const RoofVisualization: React.FC<RoofVisualizationProps> = ({ 
  latitude, 
  longitude, 
  apiKey 
}) => {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [buildingData, setBuildingData] = useState<BuildingInsights | null>(null);

  useEffect(() => {
    const fetchBuildingInsights = async () => {
      if (!latitude || !longitude || !apiKey) {
        setError("Missing location or API key for visualization.");
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        setError(null);
        setBuildingData(null);
        
        const url = `https://solar.googleapis.com/v1/buildingInsights:findClosest?location.latitude=${latitude}&location.longitude=${longitude}&requiredQuality=HIGH&key=${apiKey}`;
        
        const response = await fetch(url);
        if (!response.ok) {
          let errorBody = 'Unknown error';
          try { errorBody = await response.text(); } catch(e){}
          console.error('API Error Response:', errorBody);
          throw new Error(`Failed to fetch building insights: ${response.status} ${response.statusText}`);
        }
        
        const data: BuildingInsights = await response.json();
        console.log('Fetched Building Insights:', data);

        if (!data || !data.solarPotential) {
          console.warn("Received building insights data but missing solarPotential.");
        }

        setBuildingData(data);

      } catch (error) {
        console.error('Error fetching building insights:', error);
        setError(error instanceof Error ? error.message : 'Failed to load building visualization');
        setBuildingData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchBuildingInsights();
  }, [latitude, longitude, apiKey]);
>>>>>>> Stashed changes

  if (loading) {
    return <div className="text-center p-4">Loading roof visualization...</div>;
  }

  if (error) {
    return <div className="text-center p-4 text-red-600">Error loading visualization: {error}</div>;
  }

  return (
<<<<<<< Updated upstream
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
=======
    <div className="visualization-container my-4">
      <h3 className="text-lg font-semibold mb-2 text-center">Roof Visualization</h3>
      {window.google?.maps ? (
        <MapComponent 
          center={{ lat: latitude, lng: longitude }}
          zoom={18}
          buildingData={buildingData}
        />
      ) : (
        <div className="text-center p-4 text-gray-500">Maps library loading...</div>
      )}
    </div>
  );
};

export default RoofVisualization;
>>>>>>> Stashed changes
