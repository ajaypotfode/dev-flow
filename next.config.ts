import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  
  /* config options here */

  experimental: {
    authInterrupts: true,//this is allow to use forbidden(forbidden.ts) / unAuthorized options 
  },

  async redirects() {
    return [{ source: '/', destination: '/dashboard', permanent: false }]
  },
};

export default nextConfig;
