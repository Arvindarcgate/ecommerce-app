import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [tailwindcss()],
  server: {
    port: 3000, // 👈 change this to any port you want
    open: true  // optional: automatically open browser
  }
});
