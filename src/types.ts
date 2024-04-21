import type namedColors from "./named-colors.json";

/**
 * Types definition for common colors formats
 * supported format are: rgbString, rgba, hslString, hsla, hex, hex+alpha
 */
export type RGBSTRING = `rgb(${string},${string},${string})`;
export type HSLSTRING = `hsl(${string},${string},${string})`;
export type LABSTRING = `lab(${string},${string},${string})`;

/* HEX */
export type HEXSTRING = `#${string}` | string;

export type COLORSTRING = RGBSTRING | HSLSTRING | LABSTRING | HEXSTRING;

export type COLORS = RGBA | HSLA | LAB | XYZ | LCH | HEXSTRING;

export type COLOR_NAME = keyof typeof namedColors;

export type NAMED_COLOR = [COLOR_NAME, [number, number, number]];

/* CMYK */
export interface CMYK {
	c: number;
	m: number;
	y: number;
	k: number;
}

/* RGB */
export interface RGB {
	r: number;
	g: number;
	b: number;
}
export type RGBA = WithAlpha<RGB>;

/* HSL */
export interface HSL {
	h: number;
	s: number;
	l: number;
}
export type HSLA = WithAlpha<HSL>;

/* LAB */
export type LAB = {
	l: number;
	a: number;
	b: number;
	A: number;
};

/* XYZ */
export type XYZ = {
	x: number;
	y: number;
	z: number;
	A: number;
};

/* LCH */
export type LCH = {
	l: number;
	c: number;
	h: number;
	A: number;
};

/* HWB */
export type HWB = {
	h: number;
	w: number;
	b: number;
	A: number;
};

export const Channels:string[]= ["r" , "g" , "b" , "a" , "h" , "s" , "l" , "x" , "y" , "z" , "c" , "m" , "k", "alpha"];

export type COLOR_FORMATS =
	| "hex"
	| "rgb"
	| "rgba"
	| "hsl"
	| "hsla"
	| "lab"
	| "lch"
	| "hwb"
	| "oklab"
	| "oklch"
	| "xyz"
	| "cmyk"
    | "color";

/* COLOR INFO */
export interface COLOR_INFO {
	name: COLOR_NAME;
	color: COLORSTRING;
	hex?: string;
	hsl?: string;
	lab?: string;
	gap?: number;
}

// With Alpha Channel Support
export type WithAlpha<O> = O & { A: number };

/** color parsers interface */
export interface COLOR_PARSERS {
	format: COLOR_FORMATS;
	regex: RegExp;
	parser: (color: string) => string[];
	converter: (color: string[], source?: COLOR_FORMATS) => COLORS;
}
