import { safeInt } from "../common.js";
import type { CMYK, RGB, RGBA } from "../types.js";

export function fromCmyk([c = 0, m = 0, y = 0, k = 0]: (string | number)[]): CMYK {
	return {
		c: safeInt(c, 100),
		m: safeInt(m, 100),
		y: safeInt(y, 100),
		k: safeInt(k, 100),
	};
}

/**
 * Converts rgb to cmyk
 * @param cmyk color to convert to rgb
 * @returns rgb object
 */
export function cmykToRgb(cmyk: string[]): RGBA {
	const [c, m, y, k] = cmyk.map((v: string) => Number(v) / 100);
	const rgb = {
		r: Math.round((1 - Math.min(1, c * (1 - k) + k)) * 255),
		g: Math.round((1 - Math.min(1, m * (1 - k) + k)) * 255),
		b: Math.round((1 - Math.min(1, y * (1 - k) + k)) * 255),
	};
	return { ...rgb, A: 1 };
}

export function rgbToCmyk(rgb: RGB): CMYK {
	const { r, g, b } = rgb;

	const red = r / 255;
	const green = g / 255;
	const blue = b / 255;

	const k = 1 - Math.max(red, green, blue);

	const c = (1 - red - k) / (1 - k);
	const m = (1 - green - k) / (1 - k);
	const y = (1 - blue - k) / (1 - k);

	return {
		c: c * 100,
		m: m * 100,
		y: y * 100,
		k: k * 100,
	};
}
