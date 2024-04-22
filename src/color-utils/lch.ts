import Color from "../index.js";
import type { LCH, RGBA } from "../types.js";

export function toLch() {
	return new Color();
}
export function fromLch([L, c, h, alpha = "1"]: string[]): LCH {
	return { l: Number(L), c: Number(c), h: Number(h), A: Number(alpha) };
}

export function fromOklch([l, c, h, alpha = "1"]: string[]): RGBA {
	return {
		r: 0,
		g: 0,
		b: 0,
		A: Number(alpha),
	};
}
