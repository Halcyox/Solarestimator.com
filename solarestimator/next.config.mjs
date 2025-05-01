/** @type {import('next').NextConfig} */
const nextConfig = {
    eslint: {
      ignoreDuringBuilds: true, // Optional: Ignore linting errors
    },
    typescript: {
      ignoreBuildErrors: true, // Optional: Ignore TypeScript errors
    },
  };
  
  export default nextConfig;
  