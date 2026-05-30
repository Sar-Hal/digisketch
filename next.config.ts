import path from "path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  allowedDevOrigins: ["192.168.0.173"],
  turbopack: {
    root: path.resolve(__dirname),
  },
};

export default nextConfig;
