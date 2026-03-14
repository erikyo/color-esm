#!/usr/bin/env node
import * as es from 'esbuild'

const isDev = process?.env?.NODE_ENV === 'development' ?? false

/**
 * This function builds the package.
 *
 * @return {Promise<void>}
 */
async function run() {
  const test = es.build({
    format: 'iife',
    platform: 'node',
    entryPoints: ['poc/index.ts'],
    outfile: 'poc/script.js',
    keepNames: true,
    bundle: true,
    minify: false,
    globalName: 'TestEsm',
    tsconfig: 'tsconfig.json',
  })

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
    bundle: false,
    minify: false,
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
    entryPoints: ['src/**/*.ts'],
    outdir: 'lib/esm',
    treeShaking: true,
    splitting: false,
    tsconfig: 'tsconfig.json',
    minify: isDev,
    keepNames: true,
    sourcemap: isDev,
    chunkNames: 'c_[name]-[hash]',
  })

  await Promise.all([test,iife, iifeMin, esm])
}

/** Run the build */
await run().catch((err) => {
  console.error(err)
})
