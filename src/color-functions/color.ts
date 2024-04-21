import type {RGBA} from "../types.ts";

export function fromColor([h, s, l, alpha = "1"]: string[]): RGBA {
	return { r: 0, g: 0, b: 0, alpha: Number(alpha) };
}
