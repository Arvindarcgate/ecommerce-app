import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@ecommerce/coupon": path.resolve(
        __dirname,
        "../../packages/coupon/src/index.ts"
      ),
    },
  },
  server: {
    port: 3001,
    open: true,
  },
});
