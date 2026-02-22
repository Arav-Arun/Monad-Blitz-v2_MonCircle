import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/api': 'http://localhost:5000'
    }
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Core vendor chunks
          vendor: ['react', 'react-dom', 'react-router-dom'],
          // Wallet provider chunks
          walletProviders: ['@rainbow-me/rainbowkit', 'wagmi', 'viem'],
          // UI library chunks
          ui: ['@radix-ui', 'lucide-react'],
          // Utility chunks
          utils: ['ethers', 'clsx', 'class-variance-authority'],
        },
      },
    },
    target: 'esnext',
    minify: 'terser',
    sourcemap: false,
  },
});
