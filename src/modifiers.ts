import { hslToRgb, rgbToHsl } from "./color-utils/hsl.js";
import Color from "./index.js";

// Type for Color with modifiers mixed in
type ColorWithModifiers = Color & {
	luminosity(): number;
};

function reddish(value: number) {
	this._r += value;
	return this;
}

function bluish(value: number) {
	this._b += value;
	return this;
}

function greenish(value: number) {
	this._g += value;
	return this;
}

function invert() {
	this._r = 255 - this._r;
	this._g = 255 - this._g;
	this._b = 255 - this._b;
	return this;
}

/** @deprecated Please use invert() */
function negate() {
	return this.invert();
}

function lighten(amount: number): Color {
	const hsl = rgbToHsl({ r: this._r, g: this._g, b: this._b });
	hsl.l = Math.min(100, hsl.l + amount * 100);
	const rgb = hslToRgb(hsl);
	this._r = rgb.r;
	this._g = rgb.g;
	this._b = rgb.b;
	return this;
}

function darken(amount: number): Color {
	const hsl = rgbToHsl({ r: this._r, g: this._g, b: this._b });
	hsl.l = Math.max(0, hsl.l - amount * 100);
	const rgb = hslToRgb(hsl);
	this._r = rgb.r;
	this._g = rgb.g;
	this._b = rgb.b;
	return this;
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
	const hsl = rgbToHsl({ r: this._r, g: this._g, b: this._b });
	hsl.s = Math.min(100, hsl.s + hsl.s * ratio);
	const rgb = hslToRgb(hsl);
	this._r = rgb.r;
	this._g = rgb.g;
	this._b = rgb.b;
	return this;
}

function desaturate(ratio: number): Color {
	const hsl = rgbToHsl({ r: this._r, g: this._g, b: this._b });
	hsl.s = Math.max(0, hsl.s - hsl.s * ratio);
	const rgb = hslToRgb(hsl);
	this._r = rgb.r;
	this._g = rgb.g;
	this._b = rgb.b;
	return this;
}

function grayscale(): Color {
	// http://en.wikipedia.org/wiki/Grayscale#Converting_color_to_grayscale
	const value = this._r * 0.3 + this._g * 0.59 + this._b * 0.11;
	this._r = value;
	this._g = value;
	this._b = value;
	return this;
}

function whiten(amount: number): Color {
	// HWB whiten - add whiteness by mixing with white
	const factor = Math.min(1, amount);
	this._r = this._r + (255 - this._r) * factor;
	this._g = this._g + (255 - this._g) * factor;
	this._b = this._b + (255 - this._b) * factor;
	return this;
}

function blacken(amount: number): Color {
	// HWB blacken - add blackness by mixing with black
	const factor = Math.min(1, amount);
	this._r = this._r * (1 - factor);
	this._g = this._g * (1 - factor);
	this._b = this._b * (1 - factor);
	return this;
}

function fade(ratio: number): Color {
	this._A = Math.max(0, this._A - this._A * ratio);
	return this;
}

function opaquer(ratio: number): Color {
	this._A = Math.min(1, this._A + this._A * ratio);
	return this;
}

function rotate(degrees: number): Color {
	const hsl = rgbToHsl({ r: this._r, g: this._g, b: this._b });
	let hue = (hsl.h + degrees) % 360;
	if (hue < 0) hue += 360;
	hsl.h = hue;
	const rgb = hslToRgb(hsl);
	this._r = rgb.r;
	this._g = rgb.g;
	this._b = rgb.b;
	return this;
}

function mix(mixColor: Color, weight = 0.5): Color {
	if (!(mixColor instanceof Color)) {
		throw new Error(
			'Argument to "mix" was not a Color instance, but rather an instance of ' +
				typeof mixColor,
		);
	}

	const w = 2 * weight - 1;
	const a = this._A - mixColor._A;

	const w1 = ((w * a === -1 ? w : (w + a) / (1 + w * a)) + 1) / 2;
	const w2 = 1 - w1;

	this._r = w2 * this._r + w1 * mixColor._r;
	this._g = w2 * this._g + w1 * mixColor._g;
	this._b = w2 * this._b + w1 * mixColor._b;
	this._A = this._A * (1 - weight) + mixColor._A * weight;

	return this;
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
