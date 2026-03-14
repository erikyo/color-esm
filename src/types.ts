import type { CHANNELS, COLOR_MODEL } from "./constants.js";
import type namedColors from "./named-colors";

// https://developer.mozilla.org/en-US/docs/Web/CSS/color_value#formal_syntax

/* RGB Hexadecimal */
export type HEXSTRING = `#${string}` | string;

export type COLORS =
	| RGB
	| RGBA
	| HSL
	| HSLA
	| LAB
	| XYZ
	| LCH
	| HEXSTRING
	| CMYK
	| HWB
	| OKLAB
	| OKLCH;

/* CMYK */
export interface CMYK {
	c: number;
	m: number;
	y: number;
	k: number;
}

/* RGB (Red, Green, Blue) */
export interface RGB {
	r: number;
	g: number;
	b: number;
}
export type RGBA = WithAlpha<RGB>;

/* HSL (Hue, Saturation, Lightness) */
export interface HSL {
	h: number;
	s: number;
	l: number;
}
export type HSLA = WithAlpha<HSL>;

/* HWB (Hue, Whiteness, Blackness) */
export type HWB = {
	h: number;
	w: number;
	b: number;
};

/* LAB (Lightness, A-axis, B-axis) */
export type LAB = {
	l: number;
	a: number;
	b: number;
};

/* LCH (Lightness, Chroma, Hue) */
export type LCH = {
	l: number;
	c: number;
	h: number;
};

/* Oklab (Lightness, A-axis, B-axis) */
export type OKLAB = {
	l: number;
	a: number;
	b: number;
};

/* Oklch (Lightness, Chroma, Hue) */
export type OKLCH = {
	l: number;
	c: number;
	h: number;
};

/* XYZ */
export type XYZ = {
	x: number;
	y: number;
	z: number;
};

/** Channels type (e.g. "r", "g", "b"...) */
export type CHANNEL = (typeof CHANNELS)[number];

/** Color model type (e.g. "rgb", "hsl", "lab"...) */
export type MODEL = (typeof COLOR_MODEL)[number];

/** the unit used as a color type (e.g. "number", "percent", "degrees"...) */
export type FormatOptions = Record<
	string,
	{
		radix?: number;
		min?: number;
		max?: number;
		suffix?: string;
		decimalPlaces?: number;
	}
>;
export type FORMAT = keyof FormatOptions;

/* COLOR INFO */
export interface COLOR_INFO {
	name: keyof typeof namedColors;
	color: number[];
	gap?: number;
}

// With Alpha Channel Support
export type WithAlpha<O> = O & { A: number };

/** color parsers interface */
export interface COLOR_PARSERS {
	model: MODEL;
	regex: RegExp;
	parser: (color: string) => string[];
	converter: (color: string[], source?: MODEL) => COLORS;
}
