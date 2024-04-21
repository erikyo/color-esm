import type Color from "./index.js";

export function reddish(value: number) {
	this.red = this.red + value;
	return this;
}
/**
 * Increment the blue value of the color.
 *
 * @param {number} value - The amount to increment the blue value by, ranging from 0 to 1. Default
 * @return {this} The modified color object
 */
export function bluish(value: number) {
	this.blue = this.blue + value;
	return this;
}

export function greenish(value: number) {
	this.green = this.green + value;
	return this;
}

export function invert() {
	for (const i in [this.current.r, this.current.g, this.current.b]) {
		const key = i;
		this[key] = 255 - this[key];
	}
}

/** @deprecated Please use invert() */
export function negate() {
	this.invert();
}

export function alpha(alphaValue: number) {
	this.a = typeof alphaValue === "number" ? alphaValue : 1;
	return this;
}

/**
 * Lightens the color by a given amount.
 *
 * @param {number} amount - The amount to lighten the color by, ranging from 0 to 1.
 * @return {this} - Returns the modified color object.
 */
export function lighten(amount: number) {
	const factor = 255 - amount * 255;
	this.r -= factor;
	this.b -= factor;
	this.g -= factor;
	return this;
}

export function darken(amount: number) {
	const factor = amount * 255;
	this.r += factor;
	this.b += factor;
	this.g += factor;
	return this;
}

export function lightness(amount: number) {}

export function saturate(amount: number) {}

export function desaturate(amount: number) {}

export function grayscale() {}

export function whiten(amount: number) {}

export function blacken(amount: number) {}

export function fade(amount: number) {}

export function opaquer(amount: number) {}

export function rotate(amount: number) {}

export function mix(color: Color) {}

export function isDark() {}

export function isLight() {}

export function closer(colorset) {}
