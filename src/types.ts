/**
 * Types definition for common colors formats
 * supported format are: rgbString, rgba, hslString, hsla, hex, hex+alpha
 */
export type RGBSTRING = `rgb(${string},${string},${string})`;
export type HSLSTRING = `hsl(${string},${string},${string})`;
export type HEXSTRING = `#${string}` | string;
export type COLORSTRING = RGBSTRING | HSLSTRING | HEXSTRING;

export type WithAlpha<O> = O & { a: number };

/* HSLSTRING */
export interface HSL {
	h: number;
	s: number;
	l: number;
}
export type HSLA = WithAlpha<HSL>;

/* RGBSTRING */
export interface RGB {
	r: number;
	g: number;
	b: number;
}
export type RGBA = WithAlpha<RGB>;

export type RGBDEF = [number, number, number];
export type NAMEDCOLOR = Record<string, RGBDEF>;

/* HEXSTRING */
export type colorName = string;

export interface COLORDEF {
	name: colorName;
	color: COLORSTRING;
	hex?: string;
	hsl?: string;
	gap?: number;
}

export interface ColorParsers {
	regex: RegExp;
	parser: (color: string) => string[];
	converter: (colorSet: string[]) => RGBA;
}

export type colorListHEX = Array<{ name: string; color: string }>;
