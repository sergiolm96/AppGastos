import { defineConfig } from 'vite';

export default defineConfig({
  // Configuración para construir el proyecto
  build: {
    // Establece el directorio de salida a "static/js"
    outDir: 'static/js',
    // Si deseas que el archivo de salida tenga un nombre específico (por defecto es main.js)
    rollupOptions: {
      input: 'src/main.ts',  // Archivo de entrada
      output: {
        entryFileNames: '[name].js'
      }
    },
    // Puedes ajustar otras opciones de compilación según lo necesites
  },
  // Si usas módulos, Vite resolverá las dependencias de node_modules correctamente.
});
