import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // @ts-ignore - Permitir que o seu WebSocket funcione perfeitamente com esse IP virtual
  allowedDevOrigins: ['172.26.208.1', 'localhost'],
};

export default nextConfig;
