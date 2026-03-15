import { hslToRgb, rgbToHsl } from "./color-utils/hsl.js";
import { hwbToRgb, toHwb } from "./color-utils/hwb.js";
import { rgbToHsv } from "./color-utils/color.js";
import namedColors from "./named-colors.js";
import { Color } from "./index.js";

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
	if (color._h_hsl !== undefined) cloned._h_hsl = color._h_hsl;
	if (color._s_hsl !== undefined) cloned._s_hsl = color._s_hsl;
	if (color._l_hsl !== undefined) cloned._l_hsl = color._l_hsl;
	if (color._h_hsv !== undefined) cloned._h_hsv = color._h_hsv;
	if (color._s_hsv !== undefined) cloned._s_hsv = color._s_hsv;
	if (color._v_hsv !== undefined) cloned._v_hsv = color._v_hsv;
	if (color._h_hwb !== undefined) cloned._h_hwb = color._h_hwb;
	if (color._w_hwb !== undefined) cloned._w_hwb = color._w_hwb;
	if (color._b_hwb !== undefined) cloned._b_hwb = color._b_hwb;
	if (color._c_cmyk !== undefined) cloned._c_cmyk = color._c_cmyk;
	if (color._m_cmyk !== undefined) cloned._m_cmyk = color._m_cmyk;
	if (color._y_cmyk !== undefined) cloned._y_cmyk = color._y_cmyk;
	if (color._k_cmyk !== undefined) cloned._k_cmyk = color._k_cmyk;
	cloned.model = color.model;
	return cloned;
}

function reddish(value: number): Color {
	const clone = cloneColor(this);
	clone._r = value;
	return clone;
}

function bluish(value: number): Color {
	const clone = cloneColor(this);
	clone._b = value;
	return clone;
}

function greenish(value: number): Color {
	const clone = cloneColor(this);
	clone._g = value;
	return clone;
}

function invert(): Color {
	const clone = cloneColor(this);
	clone._r = 255 - clone._r;
	clone._g = 255 - clone._g;
	clone._b = 255 - clone._b;
	return clone;
}

function negate(): Color {
	const clone = cloneColor(this);
	clone._r = 255 - clone._r;
	clone._g = 255 - clone._g;
	clone._b = 255 - clone._b;
	return clone;
}

function lighten(amount: number): Color {
	const hslValues = rgbToHsl({ r: this._r, g: this._g, b: this._b });
	const h = this._h_hsl ?? hslValues.h;
	const s = this._s_hsl ?? hslValues.s;
	let l = this._l_hsl ?? hslValues.l;
	l += l * amount;
	l = Math.min(100, l);
	return this.hsl(h, s, l);
}

function darken(amount: number): Color {
	const hslValues = rgbToHsl({ r: this._r, g: this._g, b: this._b });
	const h = this._h_hsl ?? hslValues.h;
	const s = this._s_hsl ?? hslValues.s;
	let l = this._l_hsl ?? hslValues.l;
	l -= l * amount;
	l = Math.max(0, l);
	return this.hsl(h, s, l);
}

/** @deprecated Please use darken() */
function darkness(value: number): Color {
	return this.darken(value);
}

function saturate(ratio: number): Color {
	const hslValues = rgbToHsl({ r: this._r, g: this._g, b: this._b });
	const h = this._h_hsl ?? hslValues.h;
	let s = this._s_hsl ?? hslValues.s;
	const l = this._l_hsl ?? hslValues.l;
	s += s * ratio;
	s = Math.min(100, s);
	return this.hsl(h, s, l);
}

function desaturate(ratio: number): Color {
	const hslValues = rgbToHsl({ r: this._r, g: this._g, b: this._b });
	const h = this._h_hsl ?? hslValues.h;
	let s = this._s_hsl ?? hslValues.s;
	const l = this._l_hsl ?? hslValues.l;
	s = Math.max(0, s - s * ratio);
	return this.hsl(h, s, l);
}

function grayscale(): Color {
	const clone = cloneColor(this);
	// Use luminosity coefficients for grayscale (matches original color package)
	const value = clone._r * 0.299 + clone._g * 0.587 + clone._b * 0.114;
	clone._r = Math.round(value);
	clone._g = Math.round(value);
	clone._b = Math.round(value);
	return clone;
}

function whiten(amount: number): Color {
	const hwbValues = toHwb({ r: this._r, g: this._g, b: this._b });
	const h = this._h_hwb ?? hwbValues.h;
	let w = this._w_hwb ?? hwbValues.w;
	const b = this._b_hwb ?? hwbValues.b;
	w += w * amount;
	w = Math.min(100, w);
	return this.hwb(h, w, b);
}

function blacken(amount: number): Color {
	const hwbValues = toHwb({ r: this._r, g: this._g, b: this._b });
	const h = this._h_hwb ?? hwbValues.h;
	const w = this._w_hwb ?? hwbValues.w;
	let b = this._b_hwb ?? hwbValues.b;
	b += b * amount;
	b = Math.min(100, b);
	return this.hwb(h, w, b);
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

function clearer(ratio: number): Color {
	const clone = cloneColor(this);
	clone._A = Math.max(0, clone._A - ratio);
	return clone;
}

function rotate(degrees: number): Color {
	const hslValues = rgbToHsl({ r: this._r, g: this._g, b: this._b });
	let h = this._h_hsl ?? hslValues.h;
	const s = this._s_hsl ?? hslValues.s;
	const l = this._l_hsl ?? hslValues.l;
	h = (h + degrees) % 360;
	if (h < 0) h += 360;
	return this.hsl(h, s, l);
}

function mix(mixColor: any, weight = 0.5): Color {
	// Use duck typing instead of instanceof to handle ColorFactory wrapper
	if (!mixColor || typeof mixColor !== 'object' || 
	    mixColor._r === undefined || mixColor._g === undefined || mixColor._b === undefined) {
		throw new Error(
			'Argument to "mix" was not a Color instance, but rather an instance of ' +
			(mixColor ? mixColor.constructor.name : typeof mixColor)
		);
	}

	const p = weight === undefined ? 0.5 : weight;
	// SASS mix formula: p is the weight of the first color
	const p1 = 1 - p;
	const w = 2 * p1 - 1;
	const a = this._A - mixColor._A;

	const w1 = ((w * a === -1 ? w : (w + a) / (1 + w * a)) + 1) / 2.0;
	const w2 = 1.0 - w1;

	const clone = cloneColor(this);
	clone._r = w1 * this._r + w2 * mixColor._r;
	clone._g = w1 * this._g + w2 * mixColor._g;
	clone._b = w1 * this._b + w2 * mixColor._b;
	clone._A = mixColor._A * p + this._A * (1 - p);

	return clone;
}

function isDark(): boolean {
	const { _r: r, _g: g, _b: b } = this;
	const brightness = (r * 299 + g * 587 + b * 114) / 1000;
	return brightness <= 128;
}

function isLight(): boolean {
	const { _r: r, _g: g, _b: b } = this;
	const brightness = (r * 299 + g * 587 + b * 114) / 1000;
	return brightness > 128;
}

/**
 * Calculate the luminosity of the color (0-1)
 * Based on WCAG 2.0 relative luminance formula
 */
function luminosity(): number {
	const rsRGB = this._r / 255;
	const gsRGB = this._g / 255;
	const bsRGB = this._b / 255;

	const r = rsRGB <= 0.03928 ? rsRGB / 12.92 : ((rsRGB + 0.055) / 1.055) ** 2.4;
	const g = gsRGB <= 0.03928 ? gsRGB / 12.92 : ((gsRGB + 0.055) / 1.055) ** 2.4;
	const b = bsRGB <= 0.03928 ? bsRGB / 12.92 : ((bsRGB + 0.055) / 1.055) ** 2.4;

	return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/**
 * Calculate the contrast ratio between this color and another color
 * (L1 + 0.05) / (L2 + 0.05) where L1 is the lighter color
 */
function contrast(color2: Color): number {
	const lum1 = (this as ColorWithModifiers).luminosity();
	// Use duck typing to get luminosity from color2
	const rsRGB2 = (color2 as any)._r / 255;
	const gsRGB2 = (color2 as any)._g / 255;
	const bsRGB2 = (color2 as any)._b / 255;
	const r2 = rsRGB2 <= 0.03928 ? rsRGB2 / 12.92 : ((rsRGB2 + 0.055) / 1.055) ** 2.4;
	const g2 = gsRGB2 <= 0.03928 ? gsRGB2 / 12.92 : ((gsRGB2 + 0.055) / 1.055) ** 2.4;
	const b2 = bsRGB2 <= 0.03928 ? bsRGB2 / 12.92 : ((bsRGB2 + 0.055) / 1.055) ** 2.4;
	const lum2 = 0.2126 * r2 + 0.7152 * g2 + 0.0722 * b2;
	
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

/**
 * Get the CSS color keyword that matches this color
 */
function keyword(): string | undefined {
	const { _r: r, _g: g, _b: b } = this;
	const rr = Math.round(r);
	const rg = Math.round(g);
	const rb = Math.round(b);
	
	for (const key of Object.keys(namedColors)) {
		const val = (namedColors as any)[key];
		if (val[0] === rr && val[1] === rg && val[2] === rb) {
			return key;
		}
	}
	return undefined;
}

/** @deprecated Please use luminosity() */
function lum(): number {
	return this.luminosity();
}

export default {
	reddish,
	bluish,
	greenish,
	invert,
	negate,
	lighten,
	darken,
	darkness,
	saturate,
	desaturate,
	grayscale,
	whiten,
	blacken,
	fade,
	opaquer,
	clearer,
	rotate,
	mix,
	isDark,
	isLight,
	luminosity,
	contrast,
	level,
	keyword,
	lum,
};
