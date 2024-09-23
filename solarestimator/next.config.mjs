/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'export', // Use static export mode
    eslint: {
      ignoreDuringBuilds: true, // Optional: Ignore linting errors
    },
    typescript: {
      ignoreBuildErrors: true, // Optional: Ignore TypeScript errors
    },
  };
  
  export default nextConfig;
  