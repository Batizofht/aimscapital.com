import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  ...(process.env.NODE_ENV === "production" && { distDir: "public_html" }),
  trailingSlash: true,
  images: {
    // Static export has no Next image server, so we delegate optimization to a
    // custom loader that hits the backend's on-the-fly WebP resizer.
    loader: "custom",
    loaderFile: "./lib/imageLoader.ts",
  },
};

export default nextConfig;
