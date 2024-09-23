/** @type {import('next').NextConfig} */
const nextConfig = {
    eslint: {
      // Ignoring ESLint during builds
      ignoreDuringBuilds: true,
    },
    typescript: {
      // Ignoring TypeScript errors during builds
      ignoreBuildErrors: true,
    },
  };
  
  export default nextConfig;
  