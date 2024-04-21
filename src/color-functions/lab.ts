import type {LAB, XYZ} from "../types.js";

/**
 * Given a color in XYZ color space, return the corresponding color in the CIELAB color space.
 * @param colorSet - color in LAB color space
 */
export function fromLab(colorSet: string[]): XYZ {
	const [L, a, b, alpha = "1"] = colorSet;
	return labToXyz(Number(L), Number(a), Number(b), Number(alpha));
}

export function labToXyz(L: number, a: number, b: number, alpha = 1): XYZ {
	const fy = (L + 16) / 116;
	const fx = a / 500 + fy;
	const fz = fy - b / 200;

	const x = fx ** 3 > 0.008856 ? fx ** 3 : (116 * fx - 16) / 903.3;
	const y = fy ** 3 > 0.008856 ? fy ** 3 : (116 * fy - 16) / 903.3;
	const z = fz ** 3 > 0.008856 ? fz ** 3 : (116 * fz - 16) / 903.3;

	return { x: x * 95.047, y: y * 100.0, z: z * 108.883, alpha: 1 };
}

export function fromOklab([l, a, b, alpha = "1"]: string[]): LAB {
	return { l: Number(l), a: Number(a), b: Number(b), alpha: Number(alpha) };
}
