import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      new URL("https://cdn-logos.gocardless.com/**"),
      new URL("https://storage.googleapis.com/**"),
    ],
  },
  output: "standalone",
};

export default nextConfig;
