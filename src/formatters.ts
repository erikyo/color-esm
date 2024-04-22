import { isFormat } from "./common";
import { formatOptions } from "./constants";
import type { FORMAT, RGBA } from "./types";

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
 * @param format
 * @param separator
 */
function formatColor(color: RGBA, model: string, separator = ", "): string {
	const format = "number";
	const f: FORMAT = isFormat(format) ? format : "number";
	const m = isFormat(model) ? model : "rgba";
	switch (m) {
		case "hex":
			return `#${formatValue(color.r, f)}${formatValue(
				color.g,
				f,
			)}${formatValue(color.b, f)}`;
		case "rgba":
			return `${m}(${formatValue(color.r, f)}${separator}${formatValue(
				color.g,
				format,
			)}${separator}${formatValue(color.b, f)}${separator}${formatValue(
				color.A,
				format,
			)})`;
		default:
			return `${m}(${formatValue(color.r, f)}${separator}${formatValue(
				color.g,
				format,
			)}${separator}${formatValue(color.b, f)})`;
	}
}

export default formatColor;
