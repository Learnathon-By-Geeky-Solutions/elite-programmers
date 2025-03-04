import { NextConfig } from "next";

const nextConfig: NextConfig = {
    webpack: (config, { dev }) => {
        if (dev) {
            config.watchOptions = {
                ignored: ["**/node_modules/**", "**/.next/**"],
            };
        }
        return config;
    },
    reactStrictMode: true,
};

export default nextConfig;