import Color from "./index";

function red(r = 255) {
	this.r = r;
	return this;
}

function green(g = 255) {
	this.g = g;
	return this;
}

function blue(b = 255) {
	this.b = b;
	return this;
}

/**
 * Overrides the alpha value of the color
 * this the color
 * @param A the alpha value
 */
function alpha(A = 1) {
	this.A = A;
	return this;
}

function hex(colorString: string | undefined) {
	return new Color().fromString(colorString, "hex");
}

function hexa(colorString: string | undefined) {
	return new Color(colorString, "hexa");
}

function rgb(
	r?: string | number,
	g?: string | number,
	b?: string | number,
	a = 1,
) {
	return new Color(r, g, b, a);
}

function hsl(string: string | undefined) {
	return new Color(string, "hsl");
}

function lab(string: string | undefined) {
	return new Color(string, "lab");
}

function lch(string: string | undefined) {
	return new Color(string, "lch");
}

function oklab(string: string | undefined) {
	return new Color(string, "oklab");
}

function hwb(string: string | undefined) {
	return new Color(string, "hwb");
}

function oklch(string: string | undefined) {
	return new Color(string, "oklch");
}

function color(string: string | undefined) {
	return new Color(string, "color");
}

export default {
	red,
	green,
	blue,
	alpha,
	hex,
	hexa,
	rgb,
	hsl,
	lab,
	lch,
	oklab,
	hwb,
	oklch,
	color,
};
