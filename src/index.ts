import * as models from "./models.ts";
import * as modifiers from "./modifiers.ts";
import Parsers from "./parsers.ts";
import {Channels} from "./types.ts";
import type {COLORS} from "./types.ts";
import {safeInt} from "./common.ts";

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
    alpha: number;
    format: string;
}

class Color implements COLOR {
    r= 0;
    g= 0;
    b= 0;
    alpha= 1;
	format = "rgb";

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
            | null
			| string
			| (string | number)[]
			| {
					r?: number;
					g?: number;
					b?: number;
					h?: number;
					s?: number;
					l?: number;
					alpha?: number;
			  },
		y?: number | string,
		z?: number | string,
		a?: number | string,
	) {
		if (x !== null) {
			if (
				(typeof y === "string" && z === undefined) ||
				(typeof x === "string" && x.length > 4)
			) {
				if (typeof x === "string") this.fromString(x);
				else if (typeof x === "number") this.fromValue(x);
			} else if (Array.isArray(x)) {
				this.fromArray(x);
			} else if (typeof x === "object") {
                this.r = safeInt(x.r);
                this.g = safeInt(x.g);
                this.b = safeInt(x.b);
                this.alpha = safeInt(x.alpha, 1) ?? 1;
			} else {
                this.r = safeInt(x);
                this.g = safeInt(y);
                this.b = safeInt(z);
                this.alpha = safeInt(a, 1) ?? 1;
			}
		}
	}

	/**
	 * Parses a color array in the format [r, g, b, a] and returns an object with r, g, b, and a properties.
	 *
	 * @param rgbArray the color array
	 * @param format
	 * @return the color object
	 */
	fromArray(rgbArray: (string | number)[], format = "rgb") {
		if (rgbArray.length < 3) {
			throw new Error("Invalid color array format");
		}

		for (const i in format.split("")) {
			const channel = format[i];
            if (Channels.includes(channel)) {
				this[channel] = rgbArray[i];
			} else {
				throw new Error("Invalid color array format");
			}
		}
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
	fromString(colorString: string): COLORS {
		for (const { format, regex, parser, converter } of Parsers) {
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
	 * @param x
	 */
	fromValue(x: number) {
		return this.fromArray([x >> 16, (x >> 8) & 0xff, x & 0xff]);
	}

	info() {
		return this;
	}

	toObject(format = "rgb") {
		const current = {};
		for (const i in format.split("")) {
			const char = format[i];
			if (char in this) {
				current[char] = this[char as keyof this];
			}
		}
		return current as Color;
	}

	toArray(format = "rgb") {
		const current = [];
		for (const i in format.split("")) {
			const char = format[i];
			if (char in this) {
				current.push(this[char as keyof this]);
			}
		}
		return current;
	}

	toString(format = "rgba") {
		return `rgba(${this.r}, ${this.g}, ${this.b}, ${this.alpha})`;
	}

	toValue() {
		return (this.r << 16) + (this.g << 8) + this.b;
	}
}

Object.assign(Color.prototype, models, modifiers);

export default Color;
