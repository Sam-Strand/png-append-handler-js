import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'

export default defineConfig({
    plugins: [
        dts()
    ],
    build: {
        lib: {
            entry: 'src/index.js',
            name: 'png-append-handler',
            formats: ['es']
        },
        rollupOptions: {
            output: {
                exports: 'named'
            }
        }
    }
})
