import { Int, isModel, safeInt } from "./common.js";
import { COLOR_MODEL } from "./constants.js";
import formatColor from "./formatters.js";
import models from "./models.js";
import modifiers from "./modifiers.js";
import parsers from "./parsers.js";
import { hslToRgb } from "./color-utils/hsl.js";
import { hwbToRgb } from "./color-utils/hwb.js";
import { hsvToRgb } from "./color-utils/color.js";
import namedColors from "./named-colors.js";
import type { CHANNEL, COLORS, MODEL } from "./types.js";

export class Color {
	_r = 0;
	_g = 0;
	_b = 0;
	_A = 1;
	_h_hsl?: number;
	_s_hsl?: number;
	_l_hsl?: number;
	_h_hsv?: number;
	_s_hsv?: number;
	_v_hsv?: number;
	_h_hwb?: number;
	_w_hwb?: number;
	_b_hwb?: number;
	_c_cmyk?: number;
	_m_cmyk?: number;
	_y_cmyk?: number;
	_k_cmyk?: number;
	model: MODEL = "rgba" as MODEL;

	// Dynamic methods declared for TypeScript
	declare red: any; declare green: any; declare blue: any; declare alpha: any;
	declare hue: any; declare saturationl: any; declare lightness: any;
	declare saturationv: any; declare value: any;
	declare white: any; declare wblack: any;
	declare cyan: any; declare magenta: any; declare yellow: any; declare black: any;
	declare hex: any; declare hexa: any;
	declare rgb: any; declare hsl: any; declare hwb: any; declare hsv: any; declare cmyk: any;
	declare ansi256: any; declare ansi16: any;
	declare luminosity: any; declare contrast: any; declare level: any; declare isDark: any; declare isLight: any;
	declare mix: any; declare fade: any; declare opaquer: any; declare clearer: any; declare grayscale: any;
	declare whiten: any; declare blacken: any; declare rotate: any;
	declare unitArray: any; declare percentString: any; declare rgbNumber: any;

	// Static declarations
	static rgb: any; static hsl: any; static hwb: any; static hsv: any; static cmyk: any;
	static hex: any; static random: any;

	/**
	 * Color constructor function for the Color class that initializes the color object based on the provided arguments.
	 *
	 * @param {number | string | {r?: number, g?: number, b?: number, a?: number, h?: number, s?: number, l?: number} | number[]| string[]} x - The first color argument for the color
	 * @param {number=} y - The second color argument for the color
	 * @param {number=} z - The third color argument for the color
	 * @param {number=} a - The alpha color argument for the color
	 */
	constructor(
		x?:
			| number
			| string
			| unknown
			| (string | number)[]
			| { [key: CHANNEL]: number | string },
		y?: number | string,
		z?: number | string,
		a: number | string = 1,
	) {
		if (x !== undefined && x !== null) {
			if (x instanceof Color) {
				this.fromObject(x);
			} else if (typeof x !== "object") {
				if (z !== undefined) {
					// Args - Color(x, y, z, a)
					// We have passed 3 or 4 arguments, each argument is a channel value for the color
					this.fromArray([x as string, y as string, z, a]);
				} else if (typeof x === "string") {
					// String - Color("xyz(1,2,3)")
					// We have passed 1 argument in this case the first argument is the color string
					const color = this.fromString(x, y); // The returned color model should be rgba
					this.fromObject(color as { [key: CHANNEL]: number | string });
				} else if (typeof x === "number") {
					// Number - Color(0x123456) or Color(0x123456, 0.5)
					// We have passed 1 argument in this case the first argument is the 16bit color number
					this.fromValue(x, y);
				}
			} else if (Array.isArray(x)) {
				// Array - Color([1, 2, 3, 0.5])
				// You can pass 2 arguments in this case, the first argument is an array, and the second is the color model
				this.fromArray(x, (y as string) ?? "rgba");
			} else if (typeof x === "object") {
				// Object - Color({r: 1, g: 2, b: 3, a: 0.5})
				// We have passed 1 argument in this case, an object where each key is a channel, and the value is the channel value
				this.fromObject(x as { [key: CHANNEL]: number | string });
			}
		}
	}

	fromObject(color: { [key: CHANNEL]: number | string } | Color) {
		// Handle Color instance - copy internal properties directly
		if (color instanceof Color) {
			this._r = color._r;
			this._g = color._g;
			this._b = color._b;
			this._A = color._A;
			if (color._h_hsl !== undefined) this._h_hsl = color._h_hsl;
			if (color._s_hsl !== undefined) this._s_hsl = color._s_hsl;
			if (color._l_hsl !== undefined) this._l_hsl = color._l_hsl;
			if (color._h_hsv !== undefined) this._h_hsv = color._h_hsv;
			if (color._s_hsv !== undefined) this._s_hsv = color._s_hsv;
			if (color._v_hsv !== undefined) this._v_hsv = color._v_hsv;
			if (color._h_hwb !== undefined) this._h_hwb = color._h_hwb;
			if (color._w_hwb !== undefined) this._w_hwb = color._w_hwb;
			if (color._b_hwb !== undefined) this._b_hwb = color._b_hwb;
			if (color._c_cmyk !== undefined) this._c_cmyk = color._c_cmyk;
			if (color._m_cmyk !== undefined) this._m_cmyk = color._m_cmyk;
			if (color._y_cmyk !== undefined) this._y_cmyk = color._y_cmyk;
			if (color._k_cmyk !== undefined) this._k_cmyk = color._k_cmyk;
			return this;
		}

		// Check if this is an empty object
		const keys = Object.keys(color);
		if (keys.length === 0) {
			throw new Error("Unable to parse color from object");
		}

		// Check if this is an HSL object
		if ('h' in color && 's' in color && 'l' in color) {
			// Convert HSL to RGB
			const h = Number((color as any).h);
			const s = Number((color as any).s);
			const l = Number((color as any).l);
			const rgb = hslToRgb({ h, s, l });
			this._r = rgb.r;
			this._g = rgb.g;
			this._b = rgb.b;
			this._A = Math.max(0, Math.min(1, ('a' in color || 'A' in color || 'alpha' in color) ? Number((color as any).a || (color as any).A || (color as any).alpha) : 1));
			this._h_hsl = h;
			this._s_hsl = s;
			this._l_hsl = l;
			return this;
		}


		// Handle HWB object
		if ('h' in color && 'w' in color && 'b' in color) {
			const h = Number((color as any).h);
			const w = Number((color as any).w);
			const b = Number((color as any).b);
			const rgb = hwbToRgb({ h, w, b });
			this._r = rgb.r;
			this._g = rgb.g;
			this._b = rgb.b;
			this._A = Math.max(0, Math.min(1, ('a' in color || 'A' in color || 'alpha' in color) ? Number((color as any).a || (color as any).A || (color as any).alpha) : 1));
			this._h_hwb = h;
			this._w_hwb = w;
			this._b_hwb = b;
			return this;
		}

		// Handle HSV object
		if ('h' in color && 's' in color && 'v' in color) {
			const h = Number((color as any).h);
			const s = Number((color as any).s);
			const v = Number((color as any).v);
			const rgb = hsvToRgb({ h, s, v });
			this._r = rgb.r;
			this._g = rgb.g;
			this._b = rgb.b;
			this._A = Math.max(0, Math.min(1, ('a' in color || 'A' in color || 'alpha' in color) ? Number((color as any).a || (color as any).A || (color as any).alpha) : 1));
			this._h_hsv = h;
			this._s_hsv = s;
			this._v_hsv = v;
			return this;
		}

		// Handle CMYK object
		if ('c' in color && 'm' in color && 'y' in color && 'k' in color) {
			const c_orig = Number((color as any).c);
			const m_orig = Number((color as any).m);
			const y_orig = Number((color as any).y);
			const k_orig = Number((color as any).k);
			
			const c = Math.max(0, Math.min(100, c_orig)) / 100;
			const m = Math.max(0, Math.min(100, m_orig)) / 100;
			const y = Math.max(0, Math.min(100, y_orig)) / 100;
			const k = Math.max(0, Math.min(100, k_orig)) / 100;

			this._r = Math.round((1 - c) * (1 - k) * 255);
			this._g = Math.round((1 - m) * (1 - k) * 255);
			this._b = Math.round((1 - y) * (1 - k) * 255);
			this._A = Math.max(0, Math.min(1, ('a' in color || 'A' in color || 'alpha' in color) ? Number((color as any).a || (color as any).A || (color as any).alpha) : 1));
			this._c_cmyk = c_orig;
			this._m_cmyk = m_orig;
			this._y_cmyk = y_orig;
			this._k_cmyk = k_orig;
			return this;
		}

		// Handle plain object with color values (RGB)
		const keyMap: Record<string, string> = {
			r: "_r",
			g: "_g",
			b: "_b",
			a: "_A",
			A: "_A",
			alpha: "_A",
			h: "_h_hsl",
			s: "_s_hsl",
			l: "_l_hsl",
			w: "_w_hwb",
			v: "_v_hsv",
			c: "_c_cmyk",
			m: "_m_cmyk",
			y: "_y_cmyk",
			k: "_k_cmyk",
		};

		let hasValidKey = false;
		for (const key of keys) {
			const internalKey = keyMap[key];
			if (internalKey) {
				hasValidKey = true;
				const value = (color as unknown as Record<string, string | number>)[
					key
				];
				// Alpha is 0-1, other channels are 0-255
				if (internalKey === "_A") {
					const rawAlpha = typeof value === "number" ? value : Number(value);
					(this as unknown as Record<string, number>)[internalKey] =
						Math.max(0, Math.min(1, rawAlpha));
				} else {
					(this as unknown as Record<string, number>)[internalKey] =
						safeInt(value);
				}
			}
		}
		
		if (!hasValidKey) {
			throw new Error("Unable to parse color from object");
		}
		
		return this;
	}

	/**
	 * Parses a color array in the model [r, g, b, a] and returns an object with r, g, b, and a properties.
	 *
	 * @param rgbArray the color array
	 * @param model
	 * @param parse parse the color and transform data types (i.e. percent, degrees) into numbers
	 *
	 * @return the color object
	 */
	fromArray(rgbArray: (string | number)[], model = "rgba", parse = false) {
		const keyMap: Record<string, string> = {
			r: "_r",
			g: "_g",
			b: "_b",
			a: "_A",
			A: "_A",
			h: "_h",
			s: "_s",
			l: "_l",
			x: "_x",
			y: "_y",
			z: "_z",
			c: "_c",
			m: "_m",
			k: "_k",
		};

		for (const i in model.split("")) {
			const channel = model[i];
			const internalKey = keyMap[channel];
			if (internalKey && internalKey in this) {
				const value = rgbArray[i];
				// Alpha is 0-1, other channels are 0-255
				if (internalKey === "_A") {
					const rawAlpha = value !== undefined
						? typeof value === "number"
							? value
							: Number(value)
						: 1;
					(this as unknown as Record<string, number>)[internalKey] =
						Math.max(0, Math.min(1, rawAlpha));
				} else {
					(this as unknown as Record<string, number>)[internalKey] =
						value !== undefined ? (parse ? safeInt(value) : Int(value)) : 0;
				}
			}
		}
		return this;
	}

	/**
	 * This function takes a string representing a color (color) and uses regular expressions to check if it matches any of the following FORMAT: hex, hex+alpha, RGBSTRING, RGBA, hslString, or HSLA.
	 * If the color string matches one of these FORMAT, the function returns an object with the type of color and the value of the color.
	 * If the color string does not match any of the FORMAT, the function throws an error.
	 *
	 * @param {string} colorString - the color string to test and convert to rgbString values
	 * @param {MODEL} model - the model of the color string (e.g. "rgb", "rgba", "hsl", "hsla"...)
	 *
	 * @return {Object|Error} the object with rgbString values of that color
	 */
	fromString(colorString: string, model?: string | number): COLORS {
		// Check for named colors first
		const lowerColorString = colorString.toLowerCase();
		if (namedColors[lowerColorString]) {
			const [r, g, b] = namedColors[lowerColorString];
			return { r, g, b, A: 1 } as COLORS;
		}

		// the model of the color string (e.g. "rgb", "rgba", "hsl", "hsla"...) is defined in the model
		if (typeof model === "string") {
			if (isModel(model)) {
				// store the model of the color string
				this.model = model as MODEL;
				// find the converter function based on the model
				const mode = parsers.find((p) => p.model === model);
				if (!mode) {
					throw new Error(`Unable to parse color from string: ${colorString}`);
				}
				// convert the color string to rgbString values
				return mode.converter(mode.parser(colorString), model as MODEL);
			}
			throw new Error(
				`Unable to parse color from string: ${colorString}`,
			);
		}

		// If the color string matches one of the regular expressions, return an object with the type of color and the value of the color
		for (const { model, regex, parser, converter } of parsers) {
			if (regex.test(colorString)) {
				const result = parser(colorString);
				return converter(result, model);
			}
		}

		// If the color string does not match any of the regular expressions, return an error
		throw new Error(`Unable to parse color from string: ${colorString}`);
	}

	/**
	 * Converts the 16bit color number to the rgb color object representation
	 *
	 * @param x the 16bit color number
	 * @param alpha the alpha value
	 */
	fromValue(x: number, alpha: number | string = 1) {
		return this.fromArray([x >> 16, (x >> 8) & 0xff, x & 0xff, alpha]);
	}

	info() {
		return this;
	}

	toObject(model = "rgb") {
		const current: Record<string, unknown> = {};
		const channelMap: Record<string, string> = {
			r: "_r",
			g: "_g", 
			b: "_b",
			a: "_A",
			h: "_h",
			s: "_s",
			l: "_l",
		};
		
		for (const char of model.split("")) {
			const internalKey = channelMap[char];
			if (internalKey && internalKey in this) {
				current[char] = (this as any)[internalKey];
			}
		}
		return current;
	}

	toArray(model = "rgba") {
		const current = [];
		const channelMap: Record<string, string> = {
			r: "_r",
			g: "_g", 
			b: "_b",
			a: "_A",
			h: "_h",
			s: "_s",
			l: "_l",
		};
		
		for (const char of model.split("")) {
			const internalKey = channelMap[char];
			if (internalKey && internalKey in this) {
				current.push((this as any)[internalKey]);
			}
		}
		return current;
	}

	toJSON() {
		return this.rgb().toJSON();
	}

	toString(model = "rgba") {
		return formatColor(this, model ?? this.model);
	}

	// Alias for toString() to match original color package API
	string(precision?: number | string) {
		if (typeof precision === 'number') {
			// If precision is provided, we should probably round or handle it
			// For now, let's just use it as a flag to round values in formatColor or similar
			return this.round().toString();
		}
		return this.toString(precision as string);
	}

	// Alias for toObject() to match original color package API
	object(model = "rgb") {
		return this.toObject(model);
	}

	// Alias for toArray() to match original color package API
	array(model = "rgba") {
		return this.toArray(model);
	}

	// Round all channels to integers
	round() {
		return new Color({
			r: Math.round(this._r),
			g: Math.round(this._g),
			b: Math.round(this._b),
			a: Math.round(this._A * 100) / 100
		});
	}

	toValue() {
		return (this._r << 16) + (this._g << 8) + this._b;
	}
}

// Apply model methods (red, green, blue, alpha, rgb, hsl, hex, etc.)
// These work as both getters (when called without args) and setters (when called with args)
Object.assign(Color.prototype, models.setters);

// Apply modifiers
Object.assign(Color.prototype, modifiers);

// Static factory methods
Color.rgb = function(r: number | number[] | { r: number; g: number; b: number; alpha?: number; a?: number }, g?: number, b?: number, a?: number): Color {
	if (Array.isArray(r)) {
		[r, g, b, a] = r as [number, number, number, number?];
	} else if (typeof r === 'object' && r !== null) {
		const obj = r as { r: number; g: number; b: number; alpha?: number; a?: number };
		return new Color({ r: obj.r, g: obj.g, b: obj.b, alpha: obj.alpha ?? obj.a ?? 1 });
	}
	return new Color({ r: r as number, g: g!, b: b!, alpha: a ?? 1 });
};

Color.hsl = function(h: number | number[], s?: number, l?: number, a?: number): Color {
	if (Array.isArray(h)) { [h, s, l, a] = h as [number, number, number, number?]; }
	return new Color({ h: h as number, s: s!, l: l!, alpha: a ?? 1 });
};

Color.hsv = function(h: number | number[], s?: number, v?: number, a?: number): Color {
	if (Array.isArray(h)) { [h, s, v, a] = h as [number, number, number, number?]; }
	return new Color({ h: h as number, s: s!, v: v!, alpha: a ?? 1 });
};

Color.hwb = function(h: number | number[], w?: number, b?: number, a?: number): Color {
	if (Array.isArray(h)) { [h, w, b, a] = h as [number, number, number, number?]; }
	return new Color({ h: h as number, w: w!, b: b!, alpha: a ?? 1 });
};

Color.cmyk = function(c: number | number[], m?: number, y?: number, k?: number, a?: number): Color {
	if (Array.isArray(c)) { [c, m, y, k, a] = c as [number, number, number, number, number?]; }
	return new Color({ c: c as number, m: m!, y: y!, k: k!, alpha: a ?? 1 });
};

Color.hex = function(hex: string): Color {
	return new Color(hex);
};

Color.random = function(): Color {
	return new Color({
		r: Math.floor(Math.random() * 256),
		g: Math.floor(Math.random() * 256),
		b: Math.floor(Math.random() * 256),
	});
};

// Factory function to support calling Color() without 'new'
function ColorFactory(
	x?:
		| number
		| string
		| unknown
		| (string | number)[]
		| { [key: string]: number | string },
	y?: number | string,
	z?: number | string,
	a: number | string = 1,
): Color {
	return new (Color as any)(x, y, z, a);
}

// Ensure instanceof Color works when using the factory
ColorFactory.prototype = Color.prototype;

// Copy static methods from Color class to ColorFactory
Object.assign(ColorFactory, Color);

export default ColorFactory as unknown as typeof Color &
	((
		x?:
			| number
			| string
			| unknown
			| (string | number)[]
			| { [key: string]: number | string },
		y?: number | string,
		z?: number | string,
		a?: number | string,
	) => Color);
