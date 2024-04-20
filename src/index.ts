import { hexRegex, hslRegex, rgbRegex } from "./constants.ts";
import { fromHex, hexString, parseHex } from "./hex-utils.ts";
import { fromHsl, parseHsl } from "./hsl-utils.ts";
import namedColors from "./named-colors.json" with { type: "json" };
import { getRgbValues, parseRgb } from "./rgb-utils.ts";
import type {
	COLORDEF,
	COLORSTRING,
	ColorParsers,
	NAMEDCOLOR,
	RGB,
	RGBA,
	RGBDEF,
} from "./types.ts";

/**
 * array of color parsers to be used
 */
const colorParsers: ColorParsers[] = [
	{ regex: hexRegex, parser: parseHex, converter: fromHex },
	{ regex: rgbRegex, parser: parseRgb, converter: getRgbValues },
	{ regex: hslRegex, parser: parseHsl, converter: fromHsl },
];

class Color {
	r: number;
	g: number;
	b: number;
	a: number;
	/**
	 * A constructor function for the Color class that initializes the color object based on the provided arguments.
	 *
	 * @param {number | string | object | any[]} x - The first color argument for the color
	 * @param {number | undefined} y - The second color argument for the color
	 * @param {number | undefined} z - The third color argument for the color
	 * @param {number | undefined} a - The alpha channel value
	 */
	constructor(
		x:
			| number
			| string
			| {
					r?: string | number | object | unknown[];
					g?: number;
					b?: number;
					a?: number;
			  }
			| unknown[] = 0,
		y?: number,
		z?: number,
		a: number | undefined = 1,
	) {
		if (typeof x === "string") {
			const res = this.parseColorString(x);
			[this.r, this.g, this.b, this.a] = this.getRgba(res);
		} else if (typeof x === "object" && x !== null && !Array.isArray(x)) {
			// Validate color object
			if (
				typeof x !== "number" ||
				typeof y !== "number" ||
				typeof z !== "number"
			) {
				throw new Error("Invalid color object format");
			}
			[this.r, this.g, this.b, this.a] = this.parseColorObject(x);
		} else if (Array.isArray(x)) {
			[this.r, this.g, this.b, this.a] = this.getRgba(x);
		} else if (
			typeof x === "number" &&
			typeof y === "number" &&
			typeof z === "number"
		) {
			[this.r, this.g, this.b, this.a] = { r: x, g: y, b: z, a: a || 1 };
		} else {
			[this.r, this.g, this.b, this.a] = { r: 0, g: 0, b: 0, a: 1 };
		}
	}

	static fromRGB(
		r: string | number | unknown[] | undefined,
		g: number | undefined,
		b: number | undefined,
		a = 1,
	) {
		return new Color(r, g, b, a);
	}

	static fromObject(colorObj: {
		r?: string | number;
		g?: number;
		b?: number;
		a?: number;
	}) {
		return new Color(colorObj.r, colorObj.g, colorObj.b, colorObj.a);
	}

	static fromString(colorString: string | undefined) {
		return new Color(colorString);
	}

	// https://www.w3.org/TR/css-color-4/#color-type
	// color spaces <rgbString()> | <rgba()> |
	//               <hslString()> | <hsla()> | <hwb()> |
	//               <lab()> | <lch()> | <oklab()> | <oklch()> |
	//               <color()>

	static red(colorString: string | undefined) {
		return new Color(colorString);
	}

	static green(colorString: string | undefined) {}

	static blue(colorString: string | undefined) {}

	static hex(colorString: string | undefined) {
		return new Color(colorString);
	}

	static rgb(r?: string | number, g?: number, b?: number, a = 1) {
		return new Color(r, g, b, a);
	}

	static rgbArray(rgbArray: unknown[] | undefined) {
		return new Color(rgbArray);
	}

	static rgbString(rgbString: string | undefined) {
		return new Color(rgbString);
	}

	static hsl(h?: number, s?: number, l?: number, a = 1) {
		return new Color(h, s, l, a);
	}

	static hslArray(hslArray: unknown[] | undefined) {
		return new Color(hslArray);
	}

	static hslString(hslString: string | undefined) {
		return new Color(hslString);
	}

	toLab() {
		const xyz = this.rgbToXyz();
		return this.xyzToLab(xyz.x, xyz.y, xyz.z);
	}

	/**
	 * Given a color in XYZ color space, return the corresponding color in the CIELAB color space.
	 * @param {number} L
	 * @param {number} a
	 * @param {number} b
	 * @param {number} alpha
	 */
	fromLab(L: number, a: number, b: number, alpha = 1): Color {
		const xyz = this.labToXyz(L, a, b);
		return new Color().fromXyz(xyz.x, xyz.y, xyz.z, alpha);
	}

	rgbToXyz() {
		let { r, g, b } = { r: this.r, g: this.g, b: this.b };
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

		return { x, y, z };
	}

	xyzToLab(x: number, y: number, z: number) {
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

		return { L, a, b };
	}

	labToXyz(L: number, a: number, b: number) {
		const fy = (L + 16) / 116;
		const fx = a / 500 + fy;
		const fz = fy - b / 200;

		const x = fx ** 3 > 0.008856 ? fx ** 3 : (116 * fx - 16) / 903.3;
		const y = fy ** 3 > 0.008856 ? fy ** 3 : (116 * fy - 16) / 903.3;
		const z = fz ** 3 > 0.008856 ? fz ** 3 : (116 * fz - 16) / 903.3;

		return { x: x * 95.047, y: y * 100.0, z: z * 108.883 };
	}

	fromXyz(x: number, y: number, z: number, alpha = 1) {
		// Observer. = 2°, Illuminant = D65
		const r = x * 3.2404542 + y * -1.5371385 + z * -0.4985314;
		const g = x * -0.969266 + y * 1.8760108 + z * 0.041556;
		const b = x * 0.0556434 + y * -0.2040259 + z * 1.0572252;

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

		return new Color(R * 255, G * 255, B * 255, alpha);
	}

	/**
	 * This function takes a string representing a color (color) and uses regular expressions to check if it matches any of the following formats: hex, hex+alpha, RGBSTRING, RGBA, hslString, or HSLA.
	 * If the color string matches one of these formats, the function returns an object with the type of color and the value of the color.
	 * If the color string does not match any of the formats, the function throws an error.
	 *
	 * @param {string} colorString - the color string to test and convert to rgbString values
	 *
	 * @return {Object|Error} the object with rgbString values of that color
	 */
	parseColorString(colorString: string): RGBA {
		for (const { regex, parser, converter } of colorParsers) {
			if (regex.test(colorString)) {
				const result = parser(colorString as COLORSTRING);
				return converter(result);
			}
		}

		// If the color string does not match any of the regular expressions, return an error
		throw new Error(`Invalid color: ${colorString}`);
	}

	/**
	 * Parse a color object in the format {r: r, g: g, b: b, a: a} and returns an object with r, g, b, and a properties.
	 * @param colorObj the color object
	 * @return {RGBA} the color object
	 */
	parseColorObject(colorObj: {
		r: number;
		g: number;
		b: number;
		a: number;
	}): { r: number; g: number; b: number; a: number } {
		return {
			r: colorObj.r,
			g: colorObj.g,
			b: colorObj.b,
			a: typeof colorObj.a === "number" ? colorObj.a : 1,
		};
	}

	/**
	 * Parses a color array in the format [r, g, b, a] and returns an object with r, g, b, and a properties.
	 *
	 * @param rgbArray the color array
	 * @return the color object
	 */
	getRgba(rgbArray: string[] | number[]) {
		if (rgbArray.length < 3) {
			throw new Error("Invalid color array format");
		}

		return {
			r:
				typeof rgbArray[0] === "number"
					? rgbArray[0]
					: Number.parseInt(rgbArray[0], 10),
			g:
				typeof rgbArray[1] === "number"
					? rgbArray[1]
					: Number.parseInt(rgbArray[1], 10),
			b:
				typeof rgbArray[2] === "number"
					? rgbArray[2]
					: Number.parseInt(rgbArray[2], 10),
			a: rgbArray.length === 4 ? Number.parseInt(String(rgbArray[3]), 10) : 1,
		};
	}

	/**
	 * Given a color string, it returns the closest corresponding name of the color.
	 * Uses the Euclidean distance formula to calculate the distance between colors in the RGBSTRING color space.
	 *
	 * @param {string} color - the color string you want to find the closest color name
	 * @param {NAMEDCOLOR[]} set - the color set that will be used to find the closest color
	 *
	 * @return {COLORDEF} the closest color name and rgbString value
	 *
	 * @example // Returns the closest color name and rgbString value given a css color string
	 * closest('#f00'); // { name: 'red', color: 'rgbString(255,0,0)' }
	 *
	 * closest('#f00', undefined, {info:true}); // { name: 'red', color: 'rgbString(255,0,0)', hex: '#ff0000', hslString: 'hslString(0, 100%, 50%)', distance: 0 ) }
	 */
	closest(
		color: RGBA,
		set: NAMEDCOLOR[] = namedColors as NAMEDCOLOR[],
	): COLORDEF {
		let closestGap = Number.MAX_SAFE_INTEGER;
		const closestColor: COLORDEF = { name: "error", color: "#F00" };

		if (set.length < 1) {
			return closestColor;
		}

		const rgbColorValues = Object.values(color);
		const colorSetLength = set.length;
		// Precompute RGBSTRING values if needed
		const precomputedRGBValues = set.map((item) => [item[0], item[1], item[2]]);

		// Find the closest color in the color set
		for (let i = 0; i < colorSetLength; i++) {
			const tested = precomputedRGBValues[i];
			const gap = this.distance(rgbColorValues, tested, true);
			if (gap < closestGap) {
				closestGap = gap;
				closestColor.name = set[i].key;
				closestColor.color = `rgb(${set[i][0]},${set[i][1]},${set[i][2]})`;
			}

			// Break if exact match found
			if (gap === 0) {
				break;
			}
		}

		return closestColor;
	}

	invert() {
		for (const i in [this.r, this.g, this.b]) {
			const key = i as number;
			this[key] = 255 - this[key];
		}
	}

	/** @deprecated Please use invert() */
	negate() {
		this.invert();
	}

	alpha(alphaValue: number) {
		this.a = typeof alphaValue === "number" ? alphaValue : 1;
		return this;
	}

	/**
	 * Lightens the color by a given amount.
	 *
	 * @param {number} amount - The amount to lighten the color by, ranging from 0 to 1.
	 * @return {this} - Returns the modified color object.
	 */
	lighten(amount: number) {
		const factor = 255 - amount * 255;
		this.r -= factor;
		this.b -= factor;
		this.g -= factor;
		return this;
	}

	darken(amount: number) {
		const factor = amount * 255;
		this.r += factor;
		this.b += factor;
		this.g += factor;
		return this;
	}

	lightness(amount: number) {}

	saturate(amount: number) {}

	desaturate(amount: number) {}

	grayscale() {}

	whiten(amount: number) {}

	blacken(amount: number) {}

	fade(amount: number) {}

	opaquer(amount: number) {}

	rotate(amount: number) {}

	mix(color: Color) {}

	isDark() {}

	isLight() {}

	/**
	 * Compute the distance between the two RGBSTRING values
	 * There are two modes:
	 * fast = true -> the distance is calculated without using the Euclidean formula completely, it is reliable but its result is exponential
	 * fast = false -> the distance is calculated with the Euclidean formula, its result is linear
	 *
	 * @param rgb1 - The RGBSTRING value of the first color to compare
	 * @param rgb2 - The RGBSTRING value of the second color to compare
	 * @param fast - If you want to calculate the distance without calculating the square root, the result will be exponential otherwise is linear
	 *
	 * @return {number} the distance between the two RGBSTRING values
	 *
	 * @example distance([10, 20, 30], [120, 120, 120]); // 173.78147196982766
	 */
	distance(rgb1: RGB, rgb2: RGB, fast = false): number {
		const [rDiff, gDiff, bDiff] = [
			rgb2[0] - rgb1[0],
			rgb2[1] - rgb1[1],
			rgb2[2] - rgb1[2],
		];
		const dist = rDiff * rDiff + gDiff * gDiff + bDiff * bDiff;
		return fast ? dist : Math.sqrt(dist);
	}

	rgbaString() {
		return `rgba(${this.r}, ${this.g}, ${this.b}, ${this.a})`;
	}

	toString() {
		return this.rgbaString();
	}
}

export default Color;
