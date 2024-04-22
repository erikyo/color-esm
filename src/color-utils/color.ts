import type { RGBA } from "../types";

export function fromColor([h, s, l, alpha = "1"]: string[]): RGBA {
	return { r: 0, g: 0, b: 0, A: Number(alpha) };
}