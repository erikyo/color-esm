import type {RGBA} from "../types.js";

export function fromHwb([h, w, b, alpha = "1"]: string[]): RGBA {
	return {
		r: 0,
		g: 0,
		b: 0,
		alpha: Number(alpha),
	};
}

export function toHwb() {}
