import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Gera .next/standalone com apenas as dependencias usadas, para a imagem Docker.
  output: "standalone",
};

export default nextConfig;
