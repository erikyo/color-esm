import { Int, isModel, safeInt } from "./common";
import { COLOR_MODEL } from "./constants";
import formatColor from "./formatters";
import models from "./models";
import modifiers from "./modifiers";
import parsers from "./parsers";
import type { CHANNEL, COLORS, MODEL } from "./types";

type COLOR = {
	r: number;
	g: number;
	b: number;
	h?: number;
	s?: number;
	l?: number;
	x?: number;
	y?: number;
	z?: number;
	A: number;
	format: MODEL;
};

class Color implements COLOR {
	r = 0;
	g = 0;
	b = 0;
	A = 1;
	format = "rgba" as MODEL;

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
			| (string | number)[]
			| { [key: CHANNEL]: number | string },
		y?: number | string,
		z?: number | string,
		a: number | string = 1,
	) {
		if (x) {
			if (typeof x !== "object") {
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
				this.fromObject(x);
			}
		}
	}

	fromObject(color: { [key: CHANNEL]: number | string }) {
		for (const i in color) {
			if (i in this) {
				this[i] = safeInt(color[i]);
			}
		}
		return this;
	}

	/**
	 * Parses a color array in the format [r, g, b, a] and returns an object with r, g, b, and a properties.
	 *
	 * @param rgbArray the color array
	 * @param model
	 * @param parse parse the color and transform data types (i.e. percent, degrees) into numbers
	 *
	 * @return the color object
	 */
	fromArray(rgbArray: (string | number)[], model = "rgba", parse = false) {
		for (const i in model.split("")) {
			const channel = model[i];
			if (i === "3" && channel === "a") {
				this.A = parse ? safeInt(rgbArray[i]) : Int(rgbArray[i]);
			} else if (typeof channel === "string" && channel in this) {
				this[channel] = rgbArray[i] ?? 0;
			} else {
				throw new Error(`Invalid color format: ${model}`);
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
	 * @param {MODEL} model - the format of the color string (e.g. "rgb", "rgba", "hsl", "hsla"...)
	 *
	 * @return {Object|Error} the object with rgbString values of that color
	 */
	fromString(colorString: string, model?: string | number): COLORS {
		// the format of the color string (e.g. "rgb", "rgba", "hsl", "hsla"...) is defined in the model
		if (typeof model === "string") {
			if (!isModel(model)) {
				// store the format of the color string
				this.format = model as MODEL;
				// find the converter function based on the format
				const mode = parsers.find((p) => p.format === model);
				// convert the color string to rgbString values
				return mode.converter(
					mode.parser(colorString),
					model as MODEL,
				) as COLOR;
			}
			throw new Error(
				`Invalid model: ${model} should be one of ${COLOR_MODEL.join(", ")}`,
			);
		}

		// If the color string matches one of the regular expressions, return an object with the type of color and the value of the color
		for (const { format, regex, parser, converter } of parsers) {
			if (regex.test(colorString)) {
				const result = parser(colorString);
				return converter(result, format);
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

	toObject(format = "rgb") {
		const current: Record<string, unknown> = {};
		for (const i in format.split("")) {
			if (format[i] in this) {
				const char = format[i];
				current[char] = this[char];
			}
		}
		return current;
	}

	toArray(format = "rgba") {
		const current = [];
		for (const i in format.split("")) {
			const char = format[i];
			if (char in this) {
				current.push(this[char as keyof this]);
			}
		}
		return current;
	}

	toJson() {
		return JSON.stringify(this.toObject(), null, 2);
	}

	toString(format = "rgba") {
		return formatColor(this, format ?? this.format);
	}

	toValue() {
		return (this.r << 16) + (this.g << 8) + this.b;
	}
}

Object.assign(Color.prototype, models, modifiers);

export default Color;
