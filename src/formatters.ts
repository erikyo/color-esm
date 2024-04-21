import type {COLOR_FORMATS, RGBA} from "./types.ts";

type FormatOptions = Record<
	string,
	{
		radix?: number;
		min?: number;
		max?: number;
		suffix?: string;
	}
>;

const formatOptions: FormatOptions = {
	string: {},
	number: {
		radix: 10,
	},
	int8: {
		radix: 10,
		min: 0,
		max: 255,
	},
	normalized: {
		radix: 10,
		min: 0,
		max: 1,
	},
	percentage: {
		radix: 10,
		min: 0,
		max: 100,
		suffix: "%",
	},
	radius: {
		radix: 10,
		min: 0,
		max: 360,
		suffix: "rad",
	},
};

function formatValue(value: number, format: string | undefined): string {
	if (typeof format === "string") {
		return format;
	} else {
		const {
			min = 0,
			max = 255,
			radix = 10,
			suffix = "",
		} = formatOptions[format];
		const normalizedValue = (value - min) / (max - min);
		const formattedValue = (
			normalizedValue * (radix === 16 ? 255 : 1)
		).toString(radix);
		return formattedValue + suffix;
	}
}

/**
 * Formats a color into a string based on the specified format.
 * TODO: extendable to other user defined color formats
 *
 * @param color
 * @param separator
 * @param format
 */
function formatColor(
	color: RGBA,
	separator: string,
	format: COLOR_FORMATS,
): string {
	switch (format) {
		case "hex":
			return `#${formatValue(color.r, format)}${formatValue(
				color.g,
				format,
			)}${formatValue(color.b, format)}`;
		case "rgba":
			return `${format}(${formatValue(
				color.r,
				format,
			)}${separator}${formatValue(color.g, format)}${separator}${formatValue(
				color.b,
				format,
			)}${separator}${formatValue(color.alpha, format)})`;
		default:
			return `${format}(${formatValue(
				color.r,
				format,
			)}${separator}${formatValue(color.g, format)}${separator}${formatValue(
				color.b,
				format,
			)})`;
	}
}

export default formatColor;
