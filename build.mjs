#!/usr/bin/env node
import * as es from 'esbuild'
import { copyFileSync, mkdirSync, existsSync } from 'fs'
import { dirname } from 'path'

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
    minify: false,
    globalName: 'Color',
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
    globalName: 'Color',
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

  await Promise.all([iife, iifeMin, esm])
  
  // Copy browser files to docs directory for GitHub Pages
  console.log('Copying browser files to docs directory...')
  
  // Ensure docs/lib directory exists
  const docsLibDir = 'docs/lib'
  if (!existsSync(docsLibDir)) {
    mkdirSync(docsLibDir, { recursive: true })
  }
  
  // Copy browser build files
  copyFileSync('lib/iife/index.js', 'docs/lib/color-esm.js')
  copyFileSync('lib/iife/index.min.js', 'docs/lib/color-esm.min.js')
  if (existsSync('lib/iife/index.min.js.map')) {
    copyFileSync('lib/iife/index.min.js.map', 'docs/lib/color-esm.min.js.map')
  }
  
  console.log('Browser files copied to docs/lib/')
}

/** Run the build */
await run().catch((err) => {
  console.error(err)
})
