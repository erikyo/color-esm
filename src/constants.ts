import type { FormatOptions } from "./types";

export const INT8 = 255;
export const INT16 = 65535;
export const CHANNELS: string[] = [
	"r",
	"g",
	"b",
	"a",
	"h",
	"s",
	"l",
	"x",
	"y",
	"z",
	"c",
	"m",
	"k",
	"A",
];
export const COLOR_MODEL: string[] = [
	"hex",
	"rgb",
	"rgba",
	"hsl",
	"hsla",
	"lab",
	"lch",
	"hwb",
	"oklab",
	"oklch",
	"xyz",
	"cmyk",
	"color",
];

export const formatOptions: FormatOptions = {
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

/** Match any number */
export const isNumeric: RegExp = /^-?\d*\.?\d+$/i;
/** Match any hex number */
export const HexFormat: RegExp = /^[0-9a-f]+$/i;
