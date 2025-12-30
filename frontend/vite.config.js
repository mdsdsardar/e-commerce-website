// vite.config.js
// This file should be in your frontend root folder (same level as package.json)

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173, // Your frontend port
    // Proxy configuration to forward API requests to backend
    proxy: {
      "/api": {
        target: "http://localhost:4000", // Your backend server URL
        changeOrigin: true,
        secure: false,
        // Add logging to see if proxy is working
        configure: (proxy, options) => {
          proxy.on("proxyReq", (proxyReq, req, res) => {
            console.log('🔄 Proxying request:', req.method, req.url, '→', options.target + req.url);
          });
          proxy.on("proxyRes", (proxyRes, req, res) => {
            console.log('✅ Proxy response:', proxyRes.statusCode, req.url);
          });
        },
      },
    },
  },
});
