import { Int, isModel, safeInt } from "./common.js";
import { COLOR_MODEL } from "./constants.js";
import formatColor from "./formatters.js";
import models from "./models.js";
import modifiers from "./modifiers.js";
import parsers from "./parsers.js";
import { hslToRgb } from "./color-utils/hsl.js";
import type { CHANNEL, COLORS, MODEL } from "./types.js";

class Color {
	_r = 0;
	_g = 0;
	_b = 0;
	_A = 1;
	_h?: number;
	_s?: number;
	_l?: number;
	_x?: number;
	_y?: number;
	_z?: number;
	model: MODEL = "rgba" as MODEL;

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
			if (color._h !== undefined) this._h = color._h;
			if (color._s !== undefined) this._s = color._s;
			if (color._l !== undefined) this._l = color._l;
			return this;
		}

		// Check if this is an HSL object
		if ('h' in color && 's' in color && 'l' in color) {
			// Convert HSL to RGB
			const rgb = hslToRgb({ 
				h: Number(color.h), 
				s: Number(color.s), 
				l: Number(color.l) 
			});
			this._r = rgb.r;
			this._g = rgb.g;
			this._b = rgb.b;
			this._A = 'a' in color ? Number(color.a) : 1;
			return this;
		}

		// Handle plain object with color values (RGB)
		const keyMap: Record<string, string> = {
			r: "_r",
			g: "_g",
			b: "_b",
			a: "_A",
			A: "_A",
		};

		for (const key of Object.keys(color)) {
			const internalKey = keyMap[key];
			if (internalKey) {
				const value = (color as unknown as Record<string, string | number>)[
					key
				];
				// Alpha is 0-1, other channels are 0-255
				if (internalKey === "_A") {
					(this as unknown as Record<string, number>)[internalKey] =
						typeof value === "number" ? value : Number(value);
				} else {
					(this as unknown as Record<string, number>)[internalKey] =
						safeInt(value);
				}
			}
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
					(this as unknown as Record<string, number>)[internalKey] =
						value !== undefined
							? typeof value === "number"
								? value
								: Number(value)
							: 1;
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
		// the model of the color string (e.g. "rgb", "rgba", "hsl", "hsla"...) is defined in the model
		if (typeof model === "string") {
			if (isModel(model)) {
				// store the model of the color string
				this.model = model as MODEL;
				// find the converter function based on the model
				const mode = parsers.find((p) => p.model === model);
				if (!mode) {
					throw new Error(`Parser not found for model: ${model}`);
				}
				// convert the color string to rgbString values
				return mode.converter(mode.parser(colorString), model as MODEL);
			}
			throw new Error(
				`Invalid model: ${model} should be one of ${COLOR_MODEL.join(", ")}`,
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
		throw new Error(`Invalid color: ${colorString}`);
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
		for (const i in model.split("")) {
			if (model[i] in this) {
				const char = model[i];
				current[char] = this[char];
			}
		}
		return current;
	}

	toArray(model = "rgba") {
		const current = [];
		for (const i in model.split("")) {
			const char = model[i];
			if (char in this) {
				current.push(this[char as keyof this]);
			}
		}
		return current;
	}

	toJson() {
		return JSON.stringify(this.toObject(), null, 2);
	}

	toString(model = "rgba") {
		return formatColor(this, model ?? this.model);
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
Color.rgb = function(r: number, g: number, b: number, a?: number): Color {
	return new Color({ r, g, b, a: a ?? 1 });
};

Color.hsl = function(h: number, s: number, l: number, a?: number): Color {
	const color = new Color();
	color.hsl(h, s, l);
	if (a !== undefined) color.alpha(a);
	return color;
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

export default Color;
