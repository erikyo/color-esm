import { normalizeAlpha, safeInt } from "../common.js";
import type { HWB, RGB, RGBA } from "../types.js";

/**
 * Convert RGB to HWB (Hue, Whiteness, Blackness)
 * HWB is a more intuitive cylindrical color model than HSL
 */
export function toHwb({ r, g, b }: RGB): HWB {
	// First convert RGB to HSL to get the hue
	r /= 255;
	g /= 255;
	b /= 255;

	const max = Math.max(r, g, b);
	const min = Math.min(r, g, b);
	const delta = max - min;

	// Calculate hue (same as HSL)
	let h = 0;
	if (delta !== 0) {
		if (max === r) {
			h = ((g - b) / delta) % 6;
		} else if (max === g) {
			h = (b - r) / delta + 2;
		} else {
			h = (r - g) / delta + 4;
		}
	}
	h = h * 60;
	if (h < 0) h += 360;

	// Calculate whiteness and blackness
	const w = min * 100;
	const bl = (1 - max) * 100;

	return { h, w, b: bl };
}

/**
 * Convert HWB to RGB
 */
export function hwbToRgb({ h, w, b }: HWB): RGB {
	// Normalize whiteness and blackness
	w /= 100;
	b /= 100;

	// Calculate the chroma (color intensity)
	const c = Math.max(0, 1 - w - b);

	// Calculate RGB from hue and chroma (similar to HSL)
	const hRad = ((h % 360 + 360) % 360 / 60);
	const x = c * (1 - Math.abs((hRad % 2) - 1));

	let r = 0,
		g = 0,
		b_ = 0;

	if (hRad >= 0 && hRad < 1) {
		[r, g, b_] = [c, x, 0];
	} else if (hRad >= 1 && hRad < 2) {
		[r, g, b_] = [x, c, 0];
	} else if (hRad >= 2 && hRad < 3) {
		[r, g, b_] = [0, c, x];
	} else if (hRad >= 3 && hRad < 4) {
		[r, g, b_] = [0, x, c];
	} else if (hRad >= 4 && hRad < 5) {
		[r, g, b_] = [x, 0, c];
	} else {
		[r, g, b_] = [c, 0, x];
	}

	// Add whiteness
	r = (r + w) * 255;
	g = (g + w) * 255;
	b_ = (b_ + w) * 255;

	return {
		r: Math.round(r),
		g: Math.round(g),
		b: Math.round(b_),
	};
}

export function fromHwb([h, w, b, alpha = 1]: (string | number)[]): { h: number; w: number; b: number; A: number } {
	return {
		h: safeInt(h, 360),
		w: safeInt(w, 100),
		b: safeInt(b, 100),
		A: typeof alpha === 'number' ? Math.max(0, Math.min(1, alpha)) : Number(alpha),
	};
}
