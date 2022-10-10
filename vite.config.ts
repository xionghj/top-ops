import { resolve } from 'path';
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import eslint from 'vite-plugin-eslint';

export default defineConfig({
  resolve: {
    alias: [{ find: '@', replacement: resolve(__dirname, 'src') }],
  },
  plugins: [
    vue(),
    eslint({
      cache: false,
    }),
  ],
  //反向代理配置 - 可解决跨域问题
  server: {
    // host: "192.168.247.26",
    port: 8888,
    proxy: {
      '/api': {
        target: 'http://192.168.253.207:8000/',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
})
