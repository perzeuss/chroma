import { defineConfig, Options } from 'tsup'
import fs from 'fs'

export default function tsupTemplateFor(packageName: string) {
    return defineConfig((options: Options) => {
        const commonOptions: Partial<Options> = {
            entry: {
                [packageName]: 'src/index.ts'
            },
            sourcemap: true,
            dts: true,
            ...options
        }

        return [
            // Standard ESM, embedded `process.env.NODE_ENV` checks
            {
                ...commonOptions,
                format: ['esm'],
                outExtension: () => ({ js: '.mjs' }),
                async onSuccess() {
                    // Support Webpack 4 by pointing `"module"` to a file with a `.js` extension
                    fs.copyFileSync(`dist/${packageName}.mjs`, `dist/${packageName}.legacy-esm.js`)
                }
            },
            // Browser-ready ESM, production + minified
            {
                ...commonOptions,
                entry: {
                    [`${packageName}.browser`]: 'src/index.ts',
                },
                define: {
                    'process.env.NODE_ENV': JSON.stringify('production')
                },
                format: ['esm'],
                outExtension: () => ({ js: '.mjs' }),
                minify: true,
            },
            // CJS build
            {
                ...commonOptions,
                format: 'cjs',
                outDir: './dist/cjs/',
                outExtension: () => ({ js: '.cjs' })
            }
        ]
    })
}