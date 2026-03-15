import { isFormat } from "./common.js";
import { formatOptions } from "./constants.js";
import type Color from "./index.js";
import type { FORMAT } from "./types.js";

function formatValue(value: number, format: FORMAT = "number"): string {
	if (format === "number") {
		return value.toString();
	}
	const { min, max, radix, suffix } = {
		min: 0,
		max: 255,
		radix: 10,
		suffix: "",
		...formatOptions[format],
	};
	const normalizedValue = (value - min) / (max - min);
	const formattedValue = (normalizedValue * (radix === 16 ? 255 : 1)).toString(
		radix,
	);
	return formattedValue + suffix;
}

/**
 * FORMAT a color into a string based on the specified format.
 * TODO: extendable to other user defined color FORMAT
 *
 * @param color
 * @param model
 * @param separator
 */
function formatColor(color: Color, model: string, separator = ", "): string {
	const format = "number";
	const f: FORMAT = isFormat(format) ? format : "number";
	const m = isFormat(model) ? model : "rgba";
	switch (m) {
		case "hex":
			return `#${formatValue(color._r, f)}${formatValue(
				color._g,
				f,
			)}${formatValue(color._b, f)}`;
		case "rgba":
			if (color._A === 1) {
				return `rgb(${formatValue(Math.round(color._r), f)}${separator}${formatValue(
					Math.round(color._g),
					format,
				)}${separator}${formatValue(Math.round(color._b), f)})`;
			}
			return `rgba(${formatValue(Math.round(color._r), f)}${separator}${formatValue(
				Math.round(color._g),
				format,
			)}${separator}${formatValue(Math.round(color._b), f)}${separator}${formatValue(
				color._A,
				format,
			)})`;
		default:
			if (color._A !== 1) {
				return `rgba(${formatValue(Math.round(color._r), f)}${separator}${formatValue(
					Math.round(color._g),
					format,
				)}${separator}${formatValue(Math.round(color._b), f)}${separator}${formatValue(
					color._A,
					format,
				)})`;
			}
			return `${m}(${formatValue(Math.round(color._r), f)}${separator}${formatValue(
				Math.round(color._g),
				format,
			)}${separator}${formatValue(Math.round(color._b), f)})`;
	}
}

export default formatColor;
