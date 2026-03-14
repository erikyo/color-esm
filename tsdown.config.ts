import { defineConfig } from "tsdown";

export default defineConfig({
	// Build for both ESM and CJS
	format: ["esm", "cjs"],

	// Main entry point
	entry: ["src/index.ts"],

	// Generate TypeScript declarations
	dts: true,

	// Don't bundle - preserve module structure for tree-shaking
	unbundle: true,

	// Enable tree-shaking
	treeshake: true,

	// No minification for module builds (esbuild handles browser minification)
	minify: false,

	// Add shims for CJS compatibility
	shims: true,

	// Output directory (esbuild will create lib/browser separately)
	outDir: "lib",

	// File extensions: .js for ESM, .cjs for CJS
	outExtensions({ format }) {
		return {
			js: format === "cjs" ? ".cjs" : ".js",
		};
	},

	// Don't clean - let npm run build handle that
	clean: false,

	// Target modern Node.js
	target: "node18",
});
