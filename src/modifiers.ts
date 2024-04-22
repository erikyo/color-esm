import type Color from "./index";

import { INT8 } from "./constants";

function reddish(value: number) {
	this.r += value;
	return this;
}
/**
 * Increment the blue value of the color.
 *
 * @param {number} value - The amount to increment the blue value by, ranging from 0 to 1. Default
 * @return {this} The modified color object
 */
function bluish(value: number) {
	this.b += value;
	return this;
}

function greenish(value: number) {
	this.g += value;
	return this;
}

function invert() {
	for (const i in this) {
		const key = i as keyof Color;
		this[key] = 255 - this[key];
	}
}

/** @deprecated Please use invert() */
function negate() {
	this.invert();
}

/**
 * Lightens the color by a given amount.
 *
 * @param {number} amount - The amount to lighten the color by, ranging from 0 to 1.
 * @param {number} [precision=INT8] - The precision of the amount to lighten the color by.
 * @return {this} - Returns the modified color object.
 */
function lighten(amount: number, precision = INT8) {
	const factor = amount * precision;
	this.r += factor;
	this.b += factor;
	this.g += factor;
	return this;
}

function darken(amount: number, precision = INT8) {
	const factor = amount * precision;
	this.r -= factor;
	this.b -= factor;
	this.g -= factor;
	return this;
}

function lightness(amount: number) {}

function saturate(amount: number) {}

function desaturate(amount: number) {}

function grayscale() {}

function whiten(amount: number) {}

function blacken(amount: number) {}

function fade(amount: number) {}

function opaquer(amount: number) {}

function rotate(amount: number) {}

function mix(color: Color) {}

function isDark() {}

function isLight() {}

function closer(color: Color, colorSet: Color[]) {}

export default {
	reddish,
	bluish,
	greenish,
	invert,
	negate,
	lighten,
	darken,
	lightness,
	saturate,
	desaturate,
	grayscale,
	whiten,
	blacken,
	fade,
	opaquer,
	rotate,
	mix,
	isDark,
	isLight,
	closer,
};
