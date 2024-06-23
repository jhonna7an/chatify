/* eslint-disable no-undef */
import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    sourcemap: false, // Desactiva la generación de sourcemaps
    minify: false, // Desactiva la minificación para reducir el uso de memoria
    rollupOptions: {
      // Añadir más opciones de configuración de Rollup si es necesario
    },
  }
})