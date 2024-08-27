import version from './build/version'
import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import AutoImport from 'unplugin-auto-import/vite'
import svgLoader from 'vite-svg-loader'
import Components from 'unplugin-vue-components/vite'
import { AntDesignVueResolver } from 'unplugin-vue-components/resolvers'

export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
    AutoImport({
      imports: ['vue', 'vue-router', 'pinia']
    }),
    svgLoader(),
    Components({
      resolvers: [
        AntDesignVueResolver({
          importStyle: false
        })
      ]
    })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  base: '/admin/',
  define: {
    __APP_VERSION__: version
  },
  server: {
    open: true,
    host: 'localhost',
    port: 5000,
    proxy: {
      '/dev': {
        // target: 'http://127.0.0.1:4523/m1/3925622-0-default',
        target: 'http://127.0.0.1:3001/api/v1',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/dev/, '')
      }
    }
  }
})
