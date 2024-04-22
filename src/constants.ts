import type { FormatOptions } from "./types.js";

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

export const COLOR_INFO = {
	hex: {
		channels: 3,
		alphaSupport: true,
		format: "#[hex][hex][hex]",
		formatAlpha: "#[hex][hex][hex][alpha]",
	},
	rgb: {
		channels: 3,
		channelName: ["red", "green", "blue"],
		alphaSupport: true,
		format: "[model]([int8][sep] [int8][sep] [int8])",
		formatAlpha: "[model]([int8][sep] [int8][sep] [int8][sep] [alpha])",
	},
	hsl: {
		channels: 3,
		channelName: ["hue", "saturation", "lightness"],
		alphaSupport: true,
		format: "[model]([degree][sep] [percent][sep] [percent])",
		formatAlpha: "[model]([degree][sep] [percent][sep] [percent][sep] [alpha])",
	},
	hwb: {
		channels: 3,
		channelName: ["hue", "whiteness", "blackness"],
		alphaSupport: true,
        format: "[model]([degree][sep] [percent][sep] [percent])",
        formatAlpha: "[model]([degree][sep] [percent][sep] [percent][sep] [alpha])",
	},
    lch: {
        channels: 3,
        channelName: ["lightness", "chroma", "hue"],
        alphaSupport: true,
        format: "[model]([color][sep] [float][sep] [float])",
        formatAlpha: "[model]([color][sep] [float][sep] [float][sep] [alpha])",
    },
    lab: {
        channels: 3,
        channelName: ["luminance", "a", "b"],
        alphaSupport: true,
        format: "[model]([float][sep] [float][sep] [float])",
        formatAlpha: "[model]([float][sep] [float][sep] [float][sep] [alpha])",
    },
	oklab: {
		channels: 3,
		channelName: ["lightness", "a", "b"],
		alphaSupport: true,
		format: "[model]([float][sep] [float][sep] [float])",
		formatAlpha: "[model]([float][sep] [float][sep] [float][sep] [alpha])",
	},
	oklch: {
		channels: 3,
		channelName: ["lightness", "chroma", "hue"],
		alphaSupport: true,
		format: "[model]([float][sep] [float][sep] [float])",
		formatAlpha: "[model]([float][sep] [float][sep] [float][sep] [alpha])",
	},
	xyz: {
		channels: 3,
		channelName: ["x", "y", "z"],
		alphaSupport: true,
		format: "[model]([float][sep] [float][sep] [float])",
		formatAlpha: "[model]([float][sep] [float][sep] [float][sep] [alpha])",
	},
	cmyk: {
		channels: 4,
		channelName: ["cyan", "magenta", "yellow", "black"],
		alphaSupport: false,
		format: "[model]([float][sep] [float][sep] [float][sep] [float])",
		formatAlpha: "[model]([float][sep] [float][sep] [color][sep] [float])",
	},
    color: {
        channels: 4,
        channelName: ["red", "green", "blue", "alpha"],
        alphaSupport: true,
        format: "color([model] [color][sep] [color][sep] [color][sep] [color])",
        formatAlpha: "color([model] [color][sep] [color][sep] [color][sep] [color][sep] [alpha])",
    }
};

export const formatOptions: FormatOptions = {
	string: {},
	number: {
		radix: 10,
		decimalPlaces: 0,
	},
	int8: {
		radix: 10,
		min: 0,
		max: 255,
		decimalPlaces: 0,
	},
    hex: {
        radix: 16,
        min: 0,
        max: 255,
        decimalPlaces: 0,
    },
	normalized: {
		radix: 10,
		min: 0,
		max: 1,
		decimalPlaces: 4,
	},
	float16: {
		radix: 10,
		min: 0,
		max: 100,
		decimalPlaces: 2,
	},
	percentage: {
		radix: 10,
		min: 0,
		max: 100,
		suffix: "%",
		decimalPlaces: 0,
	},
	radius: {
		radix: 10,
		min: 0,
		max: 360,
		suffix: "rad",
		decimalPlaces: 0,
	},
};

/** Match any number */
export const isNumeric: RegExp = /^-?\d*\.?\d+$/i;
/** Match any hex number */
export const HexFormat: RegExp = /^[0-9a-f]+$/i;
