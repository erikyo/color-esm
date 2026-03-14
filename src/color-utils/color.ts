import type { RGBA, RGB, HSV } from "../types.js";

export function fromColor([h, s, l, alpha = "1"]: string[]): RGBA {
	return { r: 0, g: 0, b: 0, A: Number(alpha) };
}

/**
 * Convert RGB to HSV (Hue, Saturation, Value)
 */
export function rgbToHsv({ r, g, b }: RGB): HSV {
	r /= 255;
	g /= 255;
	b /= 255;

	const max = Math.max(r, g, b);
	const min = Math.min(r, g, b);
	const delta = max - min;

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
	h = Math.round(h * 60);
	if (h < 0) h += 360;

	const s = max === 0 ? 0 : Math.round((delta / max) * 100);
	const v = Math.round(max * 100);

	return { h, s, v };
}

/**
 * Convert HSV to RGB
 */
export function hsvToRgb({ h, s, v }: HSV): RGB {
	h = h % 360;
	s /= 100;
	v /= 100;

	const c = v * s;
	const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
	const m = v - c;

	let r = 0, g = 0, b = 0;

	if (h >= 0 && h < 60) {
		[r, g, b] = [c, x, 0];
	} else if (h >= 60 && h < 120) {
		[r, g, b] = [x, c, 0];
	} else if (h >= 120 && h < 180) {
		[r, g, b] = [0, c, x];
	} else if (h >= 180 && h < 240) {
		[r, g, b] = [0, x, c];
	} else if (h >= 240 && h < 300) {
		[r, g, b] = [x, 0, c];
	} else {
		[r, g, b] = [c, 0, x];
	}

	return {
		r: Math.round((r + m) * 255),
		g: Math.round((g + m) * 255),
		b: Math.round((b + m) * 255),
	};
}
