import { hslToRgb, rgbToHsl } from "./color-utils/hsl.js";
import Color from "./index.js";

// Type for Color with modifiers mixed in
type ColorWithModifiers = Color & {
	luminosity(): number;
};

// Helper function to create a clone of a Color instance
function cloneColor(color: Color): Color {
	const cloned = new Color();
	cloned._r = color._r;
	cloned._g = color._g;
	cloned._b = color._b;
	cloned._A = color._A;
	if (color._h !== undefined) cloned._h = color._h;
	if (color._s !== undefined) cloned._s = color._s;
	if (color._l !== undefined) cloned._l = color._l;
	if (color._x !== undefined) cloned._x = color._x;
	if (color._y !== undefined) cloned._y = color._y;
	if (color._z !== undefined) cloned._z = color._z;
	cloned.model = color.model;
	return cloned;
}

function reddish(value: number): Color {
	const clone = cloneColor(this);
	clone._r += value;
	return clone;
}

function bluish(value: number): Color {
	const clone = cloneColor(this);
	clone._b += value;
	return clone;
}

function greenish(value: number): Color {
	const clone = cloneColor(this);
	clone._g += value;
	return clone;
}

function invert(): Color {
	const clone = cloneColor(this);
	clone._r = 255 - clone._r;
	clone._g = 255 - clone._g;
	clone._b = 255 - clone._b;
	return clone;
}

/** @deprecated Please use invert() */
function negate() {
	return this.invert();
}

function lighten(amount: number): Color {
	const clone = cloneColor(this);
	const hsl = rgbToHsl({ r: clone._r, g: clone._g, b: clone._b });
	hsl.l = Math.min(100, hsl.l + (hsl.l * amount));
	const rgb = hslToRgb(hsl);
	clone._r = rgb.r;
	clone._g = rgb.g;
	clone._b = rgb.b;
	return clone;
}

function darken(amount: number): Color {
	const clone = cloneColor(this);
	const hsl = rgbToHsl({ r: clone._r, g: clone._g, b: clone._b });
	hsl.l = Math.max(0, hsl.l - amount * 100);
	const rgb = hslToRgb(hsl);
	clone._r = rgb.r;
	clone._g = rgb.g;
	clone._b = rgb.b;
	return clone;
}

/** @deprecated Please use darken() */
function darkness(amount: number) {
	return this.darken(amount);
}

/**
 * Calculate the relative luminance of the color (WCAG formula)
 * http://www.w3.org/TR/WCAG20/#relativeluminancedef
 */
function luminosity(): number {
	const rsRGB = this._r / 255;
	const gsRGB = this._g / 255;
	const bsRGB = this._b / 255;

	const r = rsRGB <= 0.04045 ? rsRGB / 12.92 : ((rsRGB + 0.055) / 1.055) ** 2.4;
	const g = gsRGB <= 0.04045 ? gsRGB / 12.92 : ((gsRGB + 0.055) / 1.055) ** 2.4;
	const b = bsRGB <= 0.04045 ? bsRGB / 12.92 : ((bsRGB + 0.055) / 1.055) ** 2.4;

	return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/**
 * Calculate the contrast ratio between this color and another color
 * (L1 + 0.05) / (L2 + 0.05) where L1 is the lighter color
 */
function contrast(color2: Color): number {
	const lum1 = (this as ColorWithModifiers).luminosity();
	const lum2 = (color2 as ColorWithModifiers).luminosity();
	const brightest = Math.max(lum1, lum2);
	const darkest = Math.min(lum1, lum2);
	return (brightest + 0.05) / (darkest + 0.05);
}

/**
 * Return the WCAG accessibility level between this color and another
 * Returns "AAA" for contrast >= 7, "AA" for contrast >= 4.5, "" otherwise
 */
function level(color2: Color): string {
	const contrastRatio = this.contrast(color2);
	if (contrastRatio >= 7) return "AAA";
	if (contrastRatio >= 4.5) return "AA";
	return "";
}

/** @deprecated Please use luminosity() */
function lightness(): number {
	return this.luminosity();
}

function saturate(ratio: number): Color {
	const clone = cloneColor(this);
	const hsl = rgbToHsl({ r: clone._r, g: clone._g, b: clone._b });
	hsl.s = Math.min(100, hsl.s + hsl.s * ratio);
	const rgb = hslToRgb(hsl);
	clone._r = rgb.r;
	clone._g = rgb.g;
	clone._b = rgb.b;
	return clone;
}

function desaturate(ratio: number): Color {
	const clone = cloneColor(this);
	const hsl = rgbToHsl({ r: clone._r, g: clone._g, b: clone._b });
	hsl.s = Math.max(0, hsl.s - hsl.s * ratio);
	const rgb = hslToRgb(hsl);
	clone._r = rgb.r;
	clone._g = rgb.g;
	clone._b = rgb.b;
	return clone;
}

function grayscale(): Color {
	const clone = cloneColor(this);
	// http://en.wikipedia.org/wiki/Grayscale#Converting_color_to_grayscale
	const value = clone._r * 0.3 + clone._g * 0.59 + clone._b * 0.11;
	clone._r = value;
	clone._g = value;
	clone._b = value;
	return clone;
}

function whiten(amount: number): Color {
	const clone = cloneColor(this);
	// HWB whiten - add whiteness by mixing with white
	const factor = Math.min(1, amount);
	clone._r = clone._r + (255 - clone._r) * factor;
	clone._g = clone._g + (255 - clone._g) * factor;
	clone._b = clone._b + (255 - clone._b) * factor;
	return clone;
}

function blacken(amount: number): Color {
	const clone = cloneColor(this);
	// HWB blacken - add blackness by mixing with black
	const factor = Math.min(1, amount);
	clone._r = clone._r * (1 - factor);
	clone._g = clone._g * (1 - factor);
	clone._b = clone._b * (1 - factor);
	return clone;
}

function fade(ratio: number): Color {
	const clone = cloneColor(this);
	clone._A = Math.max(0, clone._A - clone._A * ratio);
	return clone;
}

function opaquer(ratio: number): Color {
	const clone = cloneColor(this);
	clone._A = Math.min(1, clone._A + clone._A * ratio);
	return clone;
}

function rotate(degrees: number): Color {
	const clone = cloneColor(this);
	const hsl = rgbToHsl({ r: clone._r, g: clone._g, b: clone._b });
	let hue = (hsl.h + degrees) % 360;
	if (hue < 0) hue += 360;
	hsl.h = hue;
	const rgb = hslToRgb(hsl);
	clone._r = rgb.r;
	clone._g = rgb.g;
	clone._b = rgb.b;
	return clone;
}

function mix(mixColor: Color, weight = 0.5): Color {
	if (!(mixColor instanceof Color)) {
		throw new Error(
			'Argument to "mix" was not a Color instance, but rather an instance of ' +
				typeof mixColor,
		);
	}

	const clone = cloneColor(this);
	const w = 2 * weight - 1;
	const a = clone._A - mixColor._A;

	const w1 = ((w * a === -1 ? w : (w + a) / (1 + w * a)) + 1) / 2;
	const w2 = 1 - w1;

	clone._r = w2 * clone._r + w1 * mixColor._r;
	clone._g = w2 * clone._g + w1 * mixColor._g;
	clone._b = w2 * clone._b + w1 * mixColor._b;
	clone._A = clone._A * (1 - weight) + mixColor._A * weight;

	return clone;
}

function isDark(): boolean {
	return this.luminosity() < 0.5;
}

function isLight(): boolean {
	return !this.isDark();
}

export default {
	reddish,
	bluish,
	greenish,
	invert,
	negate,
	lighten,
	lightness,
	darken,
	darkness,
	saturate,
	desaturate,
	grayscale,
	whiten,
	blacken,
	fade,
	opaquer,
	rotate,
	mix,
	isDark,
	isLight,
	luminosity,
	contrast,
	level,
};
