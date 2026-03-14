import type { LAB, LCH, RGB, RGBA } from "../types.js";
import { rgbToXyz, xyzToLab } from "./xyz.js";

/**
 * Convert LAB to LCH (Lightness, Chroma, Hue)
 * LCH is a cylindrical representation of LAB
 */
export function labToLch({ l, a, b }: LAB): LCH {
	const c = Math.sqrt(a * a + b * b);
	let h = Math.atan2(b, a) * (180 / Math.PI);
	if (h < 0) h += 360;

	return {
		l,
		c: Math.round(c * 100) / 100,
		h: Math.round(h * 100) / 100,
	};
}

/**
 * Convert LCH to LAB
 */
export function lchToLab({ l, c, h }: LCH): LAB {
	const hRad = h * (Math.PI / 180);
	return {
		l,
		a: c * Math.cos(hRad),
		b: c * Math.sin(hRad),
	};
}

/**
 * Convert RGB to LCH via XYZ -> LAB
 */
export function rgbToLch(rgb: RGB): LCH {
	const xyz = rgbToXyz(rgb);
	const lab = xyzToLab(xyz);
	return labToLch(lab);
}

/**
 * Convert LCH to RGB via LAB -> XYZ
 * This requires the inverse XYZ to RGB conversion
 */
export function lchToRgb({ l, c, h }: LCH): RGB {
	const lab = lchToLab({ l, c, h });
	// Convert LAB to XYZ
	const y = (lab.l + 16) / 116;
	const x = lab.a / 500 + y;
	const z = y - lab.b / 200;

	const x3 = x ** 3;
	const y3 = y ** 3;
	const z3 = z ** 3;

	const xr = x3 > 0.008856 ? x3 : (x - 16 / 116) / 7.787;
	const yr = y3 > 0.008856 ? y3 : (y - 16 / 116) / 7.787;
	const zr = z3 > 0.008856 ? z3 : (z - 16 / 116) / 7.787;

	// D65 illuminant
	const X = xr * 95.047;
	const Y = yr * 100.0;
	const Z = zr * 108.883;

	// Convert XYZ to RGB
	let r = X * 3.2404542 + Y * -1.5371385 + Z * -0.4985314;
	let g = X * -0.969266 + Y * 1.8760108 + Z * 0.041556;
	let b_ = X * 0.0556434 + Y * -0.2040259 + Z * 1.0572252;

	// Normalize and gamma correct
	r /= 100;
	g /= 100;
	b_ /= 100;

	r = r > 0.0031308 ? 1.055 * r ** (1 / 2.4) - 0.055 : r * 12.92;
	g = g > 0.0031308 ? 1.055 * g ** (1 / 2.4) - 0.055 : g * 12.92;
	b_ = b_ > 0.0031308 ? 1.055 * b_ ** (1 / 2.4) - 0.055 : b_ * 12.92;

	return {
		r: Math.max(0, Math.min(255, Math.round(r * 255))),
		g: Math.max(0, Math.min(255, Math.round(g * 255))),
		b: Math.max(0, Math.min(255, Math.round(b_ * 255))),
	};
}

export function toLch(rgb: RGB): LCH {
	return rgbToLch(rgb);
}

export function fromLch([l, c, h, alpha = "1"]: string[]): RGBA {
	const rgb = lchToRgb({
		l: Number(l),
		c: Number(c),
		h: Number(h),
	});
	return {
		...rgb,
		A: Number(alpha),
	};
}

// Oklch functions - simplified versions (not full Oklab implementation)
export function fromOklch([l, c, h, alpha = "1"]: string[]): RGBA {
	// Simplified Oklch to RGB conversion
	// For a complete implementation, proper Oklab matrices would be needed
	const rgb = lchToRgb({
		l: Number(l) * 100, // Scale 0-1 to 0-100
		c: Number(c),
		h: Number(h),
	});
	return {
		...rgb,
		A: Number(alpha),
	};
}
