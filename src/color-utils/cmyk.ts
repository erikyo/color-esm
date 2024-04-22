import { Int } from "../common";
import type { CMYK, RGBA } from "../types";

export function fromCmyk([c, m, y, k]: (string | number)[]): CMYK {
	return {
		c: Int(c),
		m: Int(m),
		y: Int(y),
		k: Int(k),
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
		r: 1 - Math.min(1, c * (1 - k) + k) * 255,
		g: 1 - Math.min(1, m * (1 - k) + k) * 255,
		b: 1 - Math.min(1, y * (1 - k) + k) * 255,
	};
	return { ...rgb, A: 1 };
}

export function rgbToCmyk(rgb: RGBA): CMYK {
	const { r, g, b } = rgb;

	const red = r / 255;
	const green = g / 255;
	const blue = b / 255;

	const k = 1 - Math.max(red, green, blue);

	const c = (1 - red - k) / (1 - k);
	const m = (1 - green - k) / (1 - k);
	const y = (1 - blue - k) / (1 - k);

	return {
		c: Math.round(c * 100),
		m: Math.round(m * 100),
		y: Math.round(y * 100),
		k: Math.round(k * 100),
	};
}
