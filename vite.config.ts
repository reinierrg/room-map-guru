import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { resolve } from 'path'

export default defineConfig(({ mode }) => {
  // Cargar todas las variables de entorno
  const env = { ...process.env, ...loadEnv(mode, process.cwd()) };
  return {
    plugins: [react(), tailwindcss()],
    root: '.',
    build: {
      // Carpeta de salida
      outDir: 'dist',
      sourcemap: false,
      minify: 'esbuild',
      manifest: true,
      // Carpeta de salida
        
      // Limpiar la carpeta de output antes de construir
      emptyOutDir: true,
      
      rollupOptions: {
        output: {
          chunkFileNames: 'js/[name]-[hash].js',
          entryFileNames: 'js/[name]-[hash].js',
          assetFileNames: (assetInfo) => {
            const extType = assetInfo.name!.split('.')[1]
            if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(extType)) {
              return 'images/[name]-[hash][extname]'
            }
            if (/css/i.test(extType)) {
              return 'css/[name]-[hash][extname]'
            }
            return 'assets/[name]-[hash][extname]'
          }
        }
      }
    },
    
    // Configuración del servidor de desarrollo
    server: {
      port: parseInt(env.VITE_PORT || '4000'),
      host: 'localhost',
      open: true
    },
    
    // Resolución de paths
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src'),
        '@components': resolve(__dirname, 'src/components')
      }
    },
    test: {
        globals: true,
        environment: 'jsdom',
        setupFiles: './src/test/setupTests.ts',
    },
}})
