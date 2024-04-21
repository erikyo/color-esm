import type {RGBA, XYZ} from "../types.ts";

export function rgbToXyz({ r, g, b, A = 1 }): XYZ {
	r /= 255;
	g /= 255;
	b /= 255;

	// Apply gamma correction if needed
	r = r > 0.04045 ? ((r + 0.055) / 1.055) ** 2.4 : r / 12.92;
	g = g > 0.04045 ? ((g + 0.055) / 1.055) ** 2.4 : g / 12.92;
	b = b > 0.04045 ? ((b + 0.055) / 1.055) ** 2.4 : b / 12.92;

	r *= 100;
	g *= 100;
	b *= 100;

	// Observer. = 2°, Illuminant = D65
	const x = r * 0.4124564 + g * 0.3575761 + b * 0.1804375;
	const y = r * 0.2126729 + g * 0.7151522 + b * 0.072175;
	const z = r * 0.0193339 + g * 0.119192 + b * 0.9503041;

	return { x, y, z, A };
}

export function xyzToLab(x: number, y: number, z: number, A = 1) {
	// Reference white D65
	const Xn = 95.047;
	const Yn = 100.0;
	const Zn = 108.883;

	let fx = x / Xn;
	let fy = y / Yn;
	let fz = z / Zn;

	fx = fx > 0.008856 ? fx ** (1 / 3) : 7.787 * fx + 16 / 116;
	fy = fy > 0.008856 ? fy ** (1 / 3) : 7.787 * fy + 16 / 116;
	fz = fz > 0.008856 ? fz ** (1 / 3) : 7.787 * fz + 16 / 116;

	const L = 116 * fy - 16;
	const a = 500 * (fx - fy);
	const b = 200 * (fy - fz);

	return { L, a, b, A };
}

export function fromXyz([x, y, z, A = "1"]: string[]): RGBA {
	const [xn, yn, zn] = [x, y, z].map((v) => Number(v));

	// Observer. = 2°, Illuminant = D65
	const r = xn * 3.2404542 + yn * -1.5371385 + zn * -0.4985314;
	const g = xn * -0.969266 + yn * 1.8760108 + zn * 0.041556;
	const b = xn * 0.0556434 + yn * -0.2040259 + zn * 1.0572252;

	let R = r / 100;
	let G = g / 100;
	let B = b / 100;

	// Apply gamma correction if needed
	R = R > 0.0031308 ? 1.055 * R ** (1 / 2.4) - 0.055 : R * 12.92;
	G = G > 0.0031308 ? 1.055 * G ** (1 / 2.4) - 0.055 : G * 12.92;
	B = B > 0.0031308 ? 1.055 * B ** (1 / 2.4) - 0.055 : B * 12.92;

	R = Math.min(Math.max(0, R), 1);
	G = Math.min(Math.max(0, G), 1);
	B = Math.min(Math.max(0, B), 1);

	return { r: R * 255, g: G * 255, b: B * 255, A: Number(A) };
}
