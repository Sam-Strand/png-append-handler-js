import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'

export default defineConfig({
    plugins: [
        dts()
    ],
    build: {
        lib: {
            entry: 'src/index.js',
            formats: ['es']
        },
        rollupOptions: {
            output: {
                exports: 'named'
            }
        }
    }
})
