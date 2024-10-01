import React, { useEffect, useRef } from 'react';
import { fromArrayBuffer } from 'geotiff';


interface RoofVisualizationProps {
  latitude: number;
  longitude: number;
  roofSegments: any[];
  numberOfPanels: number;
  shadingFactor: number;
  tiltFactor: number;
  apiKey: string;
}


declare global {
  interface Window {
    google: any;
  }
}

const googleApiKey = process.env.NEXT_PUBLIC_GOOGLE_GEOCODE_API_KEY;

const RoofVisualization: React.FC<RoofVisualizationProps> = ({ latitude, longitude, apiKey }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const fetchGeoTIFFData = async () => {
      try {
        // Step 1: Fetch data layer using the location and radius parameters
        const url = `https://solar.googleapis.com/v1/dataLayers:get?location.latitude=${latitude}&location.longitude=${longitude}&radiusMeters=100&view=FULL_LAYERS&requiredQuality=HIGH&pixelSizeMeters=0.5&key=${googleApiKey}`;
        
        console.log(googleApiKey); // Check if the key is coming through

        const response = await fetch(url);
        const data = await response.json();

        console.log(data.annualFluxUrl); // Check the returned URL for the GeoTIFF file

        // Step 2: Fetch the GeoTIFF file, making sure to include the API key in the request URL
        if (data.annualFluxUrl) {
          const tiffUrl = `${data.annualFluxUrl}&key=${"AIzaSyCAPPDpM4I6phkrMU-4xsF9GKE7W-_B1T4"}`; // Append the API key
          const tiffResponse = await fetch(tiffUrl);
          const arrayBuffer = await tiffResponse.arrayBuffer();

          // Step 3: Read the GeoTIFF data
          const tiff = await fromArrayBuffer(arrayBuffer);
          const image = await tiff.getImage();
          const width = image.getWidth();
          const height = image.getHeight();
          const raster = await image.readRasters();

          // Step 4: Render the GeoTIFF data on the canvas
          renderOnCanvas(raster[0], width, height);
        }
      } catch (error) {
        console.error('Error fetching GeoTIFF data:', error);
      }
    };

    const renderOnCanvas = (raster: any, width: number, height: number) => {
      const canvas = canvasRef.current;
      if (canvas && canvas.getContext) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          const imageData = ctx.createImageData(width, height);
          for (let i = 0; i < raster.length; i++) {
            const value = raster[i];
            const idx = i * 4; // RGBA
            imageData.data[idx] = value; // R
            imageData.data[idx + 1] = value; // G
            imageData.data[idx + 2] = value; // B
            imageData.data[idx + 3] = 255; // A (fully opaque)
          }
          ctx.putImageData(imageData, 0, 0);
        }
      }
    };

    fetchGeoTIFFData();
  }, [latitude, longitude, apiKey]);

  return (
    <div>
      <h3>Roof Visualization</h3>
      <canvas ref={canvasRef} style={{ width: '100%', height: '400px' }} />
    </div>
  );
};

export default RoofVisualization;

// const RoofVisualization: React.FC<RoofVisualizationProps> = ({ roofSegments, numberOfPanels, shadingFactor, tiltFactor }) => {
//   const roofContainerRef = useRef<HTMLDivElement | null>(null);

//   useEffect(() => {
//     const loadGoogleSunroofScript = () => {
//       const script = document.createElement('script');
//       script.src = `https://solar.googleapis.com/v1/roofvisualization?key=${googleApiKey}`;
//       script.async = true;
//       script.defer = true;
//       script.onload = () => {
//         if (roofContainerRef.current && window.google?.sunroof) {
//           const roofVisualization = new window.google.sunroof.RoofVisualization(roofContainerRef.current, {
//             roofSegments: roofSegments.map(segment => ({
//               ...segment,
//               panels: Math.floor(segment.areaMeters2 / numberOfPanels),
//               shading: shadingFactor,
//               tilt: tiltFactor,
//             })),
//           });
//           roofVisualization.render();
//         }
//       };
//       document.head.appendChild(script);
//     };

//     if (!window.google?.sunroof) {
//       loadGoogleSunroofScript();
//     } else if (roofContainerRef.current && window.google.sunroof) {
//       const roofVisualization = new window.google.sunroof.RoofVisualization(roofContainerRef.current, {
//         roofSegments: roofSegments.map(segment => ({
//           ...segment,
//           panels: Math.floor(segment.areaMeters2 / numberOfPanels),
//           shading: shadingFactor,
//           tilt: tiltFactor,
//         })),
//       });
//       roofVisualization.render();
//     }
//   }, [roofSegments, numberOfPanels, shadingFactor, tiltFactor]);

//   return (
//     <div>
//       <h3>Roof Visualization</h3>
//       <div ref={roofContainerRef} style={{ width: '100%', height: '400px' }}>
//         {/* Roof visualization will be rendered here */}
//       </div>
//     </div>
//   );
// };

// export default RoofVisualization;
