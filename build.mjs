#!/usr/bin/env node
import * as es from 'esbuild'

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
    tsconfig: 'tsconfig.json',
    globalName: 'Color',
  })
  const iifeMin = es.build({
    format: 'iife',
    platform: 'node',
    entryPoints: ['src/index.ts'],
    outfile: 'lib/iife/index.min.js',
    bundle: true,
    minify: true,
    sourcemap: true,
    tsconfig: 'tsconfig.json',
    globalName: 'Color',
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
    splitting: true,
    minify: false,
    keepNames: true,
    globalName: 'Color'
  })

  await Promise.all([iife, iifeMin, esm])
}

/** Run the build */
await run().catch((err) => {
  console.error(err)
})
