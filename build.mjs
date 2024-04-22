#!/usr/bin/env node
import * as es from 'esbuild'

const isDev = process?.env?.NODE_ENV === 'development' ?? false

/**
 * This function builds the package.
 *
 * @return {Promise<void>}
 */
async function run() {
  /**
   * Immediately Invoked Function Expression (IIFE)
   */
  const iife = es.build({
    format: 'iife',
    platform: 'node',
    entryPoints: ['src/index.ts'],
    outfile: 'lib/iife/index.js',
    bundle: true,
    globalName: 'ColorEsm',
    tsconfig: 'tsconfig.json',
  })

  const iifeMin = es.build({
    format: 'iife',
    platform: 'node',
    entryPoints: ['src/index.ts'],
    outfile: 'lib/iife/index.min.js',
    bundle: true,
    minify: true,
    sourcemap: true,
    globalName: 'ColorEsm',
    tsconfig: 'tsconfig.json'
  })

  /**
   * ES Module (ESM)
   */
  const esm = es.build({
    format: 'esm',
    platform: 'browser',
    entryPoints: ['src/**/*.ts', "src/named-colors.json"],
    outdir: 'lib/esm',
    treeShaking: true,
    splitting: false,
    tsconfig: 'tsconfig.json',
    minify: isDev,
    keepNames: true,
    sourcemap: isDev,
    chunkNames: 'c_[name]-[hash]',
  })

  await Promise.all([iife, iifeMin, esm])
}

/** Run the build */
await run().catch((err) => {
  console.error(err)
})
