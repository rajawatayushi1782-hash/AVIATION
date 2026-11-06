import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      'static/images/reach-map.svg': path.resolve(__dirname, 'src/static/images/reach-map.ts'),
      'static/images/strip-landing.svg': path.resolve(__dirname, 'src/static/images/strip-landing.ts'),
      'static/images/suitcases.svg': path.resolve(__dirname, 'src/static/images/suitcases.ts'),
      'static/images/strip-number.svg': path.resolve(__dirname, 'src/static/images/strip-number.tsx'),
      'components': path.resolve(__dirname, 'src/components'),
      'constants': path.resolve(__dirname, 'src/constants'),
      'containers': path.resolve(__dirname, 'src/containers'),
      'data': path.resolve(__dirname, 'src/data'),
      'shell': path.resolve(__dirname, 'src/shell'),
      'static': path.resolve(__dirname, 'src/static'),
      'styles': path.resolve(__dirname, 'src/styles'),
      'node_modules/sass-mq': path.resolve(__dirname, 'node_modules/sass-mq')
    }
  },
  css: {
    preprocessorOptions: {
      scss: {
        includePaths: [
          path.resolve(__dirname, 'src'),
          path.resolve(__dirname, 'node_modules')
        ]
      }
    }
  },
  define: {
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'production'),
    'process.env.PUBLIC_URL': JSON.stringify(''),
    '__webpack_public_path__': JSON.stringify('/')
  },
  server: {
    port: 3000,
    open: false
  }
});
