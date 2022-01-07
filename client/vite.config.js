import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import dotenv from 'dotenv'
import { resolve } from 'path'
import eslint from 'vite-plugin-eslint'
import autoprefixer from 'autoprefixer'

dotenv.config()
const port = process.env.npm_config_port || process.env.PORT

export default defineConfig({
    server: {
        port,
    },
    resolve: {
        extensions: [
            ".ts", ".vue", ".js", ".mjs"
        ],
        alias: {
            "@": resolve(__dirname, './src')
        }
    },
    plugins: [
        vue(),
        //eslint(),
    ],
    css: {
        postcss: {
            plugins: [
                autoprefixer,
            ]
        },
        preprocessorOptions: {
            scss: {
                additionalData: `@import '@/assets/styles/variables.scss';`
            }
        }
    }
})
