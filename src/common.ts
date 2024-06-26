import { COLOR_MODEL, HexFormat, formatOptions, isNumeric } from "./constants.js";
import type { FORMAT, MODEL } from "./types.js";

/**
 * It returns an object with the hex values of the 3 digit hex color
 *
 * @param {string} value 3 digit hex
 * @return {string[]} 6 digit hex
 */
export function shortHexToLongHex(value: string): string[] {
	// split the string in to an array of digits then return an array that contains that digit doubled for each item
	return Array.from(value).map((v: string) => (v + v).toUpperCase());
}

/**
 * Checks if a given string represents a hexadecimal number.
 *
 * @param {string} num - The string to be checked.
 * @return {boolean} Returns true if the string is a valid hexadecimal number, false otherwise.
 */
export function isHex(num: string): boolean {
	return Boolean(num.match(HexFormat));
}

/**
 * split the content of rgbString and hslString colors depending on the parsed value of the css property
 *
 * https://developer.mozilla.org/en-US/docs/Web/CSS/color_value/rgb#syntax
 *
 * @param {string} rawValues - the value inside the rgbString(.*) css color definition
 *
 * @return {Array} the array of rgbString values found inside the passed string
 */
export function splitValues(rawValues: string): string[] {
	return rawValues
		.split(rawValues.includes(",") ? "," : " ")
		.map((s) => s.trim());
}

/**
 * If the value is an angle in degrees, convert it to the 0-360 range
 *
 * @param {string} angle - the degrees to convert into a number
 *
 * @return {number} the converted value
 */
export function normalizeDegrees(angle: string): number {
	// Strip label and convert to degrees (if necessary)
	let degAngle = Number.parseFloat(angle) || 0;
	if (angle.indexOf("deg") > -1) {
		degAngle = Number.parseFloat(angle.substring(0, angle.length - 3));
	} else if (angle.indexOf("rad") > -1) {
		degAngle = Math.round(
			Number.parseFloat(angle.substring(0, angle.length - 3)) * (180 / Math.PI),
		);
	} else if (angle.indexOf("turn") > -1) {
		degAngle = Math.round(
			Number.parseFloat(angle.substring(0, angle.length - 4)) * 360,
		);
	}

	while (degAngle < 0) {
		degAngle += 360;
	}

	// Make sure it's a number between 0 and 360
	if (degAngle >= 360) degAngle %= 360;

	return degAngle;
}

/**
 * Returns a value that is limited between a minimum and maximum value.
 *
 * @param {number} value - The value to be limited.
 * @param {number} min - The minimum allowed value (default is 0).
 * @param {number} max - The maximum allowed value (default is 0).
 * @return {number} The limited value.
 */
export function range(value: number, min?: number, max?: number): number {
	let newValue = value;
	if (min) newValue = Math.min(value, min);
	if (max) newValue = Math.max(value, max);
	return newValue;
}

/**
 * Calculates the value based on a given string and multiplier.
 *
 * @param {string} valueString - The string representing the value to be calculated.
 * @param {number} multiplier - The multiplier to be applied to the calculated value.
 * @return {number} The calculated value.
 */
export function calculateValue(
	valueString: string,
	multiplier: number,
): number {
	// Regular expression to match the calc() function and extract the numerical value
	const regex = /calc\(([^)]+)\)/;

	// Match the calc() function in the CSS string
	const match = valueString.match(regex);

	return safeInt(match ? match[1] : valueString, multiplier);
}

/** Remove comments from string */
export const stripComments: RegExp = /(\/\*[^*]*\*\/)|(\/\/[^*]*)/g;

/**
 * Strip comments from string
 * @param string - The input string.
 * @returns The string without the comments.
 */
export function stripComment(string: string): string {
	return string.replace(stripComments, "");
}

/**
 * Removes comments from the input string and extracts the content between the first opening parenthesis
 * and the last closing parenthesis.
 *
 * @param {string} string - The input string.
 * @return {string} The content between the first opening parenthesis and the last closing parenthesis.
 */
export function cleanDefinition(string: string): string {
	// Remove comments from the string
	const cleanString = stripComment(string);

	// Find the positions of the first opening and the last closing parentheses
	const firstParenthesisIndex = cleanString.indexOf("(");
	const lastParenthesisIndex = cleanString.lastIndexOf(")");

	// Extract the content between the parentheses
	return cleanString
		.slice(firstParenthesisIndex + 1, lastParenthesisIndex)
		.trim();
}

/**
 * Normalizes a percentage value by dividing it by 100 and multiplying it by a given multiplier.
 *
 * @param {string} value - The percentage value to be normalized.
 * @param {number} multiplier - The number to multiply the normalized percentage by.
 * @return {number} The normalized percentage value.
 */
export function normalizePercentage(value: string, multiplier: number): number {
	return (Number.parseFloat(value) / 100) * multiplier;
}

/**
 * Calculates the color value fallbacks for a given value.
 *
 * @param {string} value - The color value to calculate fallbacks for.
 * @param {string} [err] - An optional error message to display.
 * @return {number} - The calculated color value fallbacks.
 */
export function colorValueFallbacks(value: string, err?: string): number {
	switch (value) {
		case "infinity":
			console.warn(
				err || `Positive infinity value has been set to 255: ${value}`,
			);
			return 255;
		case "currentColor":
			console.warn(
				err || `The "currentColor" value has been set to 0: ${value}`,
			);
			break;
		case "transparent":
			console.warn(
				err || `The "transparent" value has been set to 0: ${value}`,
			);
			break;
		case "NaN":
			console.warn(err || `"NaN" value has been set to 0: ${value}`);
			break;
		case "-infinity":
			console.warn(
				err || `"Negative" infinity value has been set to 0: ${value}`,
			);
			break;
		case "none":
			console.warn(
				err || `The none keyword is invalid in legacy color syntax: ${value}`,
			);
			break;
		default:
			console.warn(err || `Invalid color value: ${value}`);
			break;
	}
	return 0;
}

/**
 * Converts a number or string to a number.
 * If options are provided, it will return a value limited between options. Min and options.max. Otherwise, it will return a number.
 *
 * @param value
 * @param options
 * @constructor
 */
export function Int(
	value: string | number,
	options?: { min: number; max: number },
): number {
	if (options) {
		return range(Number(value), options.min, options.max);
	}
	return Number(value);
}

/**
 * Takes a string with a css value that could be a number or percentage or an angle in degrees and returns the corresponding 8bit value
 *
 * @param value - a valid value for the css color definition (like 255, "100%", "324deg", etc.) *
 * @param max - the number that represent the maximum - default is 255 decimal - 100 hex
 *
 * @example safeInt('100%'); // 255
 *
 * @return {string} the corresponding value in 8-bit format
 */
export function safeInt(value: string | unknown, max = 255): number {
	if (typeof value === "number") return range(value, 0, max);
	const newValue = typeof value === "string" ? value?.trim() : "0";
	if (isNumeric.test(newValue)) {
		// limit the min and the max newValue
		return range(Number.parseFloat(newValue) || 0, 0, max);
	}
	if (newValue.endsWith("%")) {
		// If the newValue is a percentage, divide it by 100 to get a newValue from 0 to 1
		// and then multiply it by 255 to get a newValue from 0 to 255
		return normalizePercentage(newValue, max) || 0;
	}
	if (
		newValue.endsWith("deg") ||
		newValue.endsWith("rad") ||
		newValue.endsWith("turn")
	) {
		return normalizeDegrees(newValue);
	}
	if (newValue.startsWith("calc")) {
		// get the newValue from the calc function
		return range(calculateValue(newValue, max), 0, max);
	}

	// If the value is not a percentage or an angle in degrees, it is invalid
	return colorValueFallbacks(newValue, `Invalid value: ${value}`);
}

export function normalizeAlpha(value: string | number | unknown): number {
	if (typeof value === "number") {
		return range(value, 0, 1);
	}
	return safeInt(value, 1);
}

/** typeguard for model */
export function isModel(model: string): model is MODEL {
	return COLOR_MODEL.includes(model);
}

/** typeguard for format */
export function isFormat(format: string): format is FORMAT {
	return Object.keys(formatOptions).includes(format);
}
