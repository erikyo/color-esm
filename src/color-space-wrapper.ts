import type { HSL, HSV, HWB, RGB } from "./types.js";
import formatColor from "./formatters.js";

/**
 * Wrapper class for color space objects that provides string() and object() methods
 * to match the original color package API
 */
export class ColorSpaceWrapper<T extends Record<string, number>> {
	private color: T;
	private model: string;
	private parentColor: any;

	constructor(color: T, model: string, parentColor: any) {
		this.color = color;
		this.model = model;
		this.parentColor = parentColor;
	}

	// Get the raw color values
	get value(): T {
		return this.color;
	}

	// Convert to string representation
	string(): string {
		// Format manually based on the model
		if (this.model === 'hsl') {
			const { h, s, l } = this.color as any;
			return `hsl(${h}, ${s}%, ${l}%)`;
		} else if (this.model === 'hsv') {
			const { h, s, v } = this.color as any;
			return `hsv(${h}, ${s}%, ${v}%)`;
		} else if (this.model === 'hwb') {
			const { h, w, b } = this.color as any;
			return `hwb(${h}, ${w}%, ${b}%)`;
		}
		// Default to rgba for rgb
		const { r, g, b } = this.color as any;
		return `rgba(${r}, ${g}, ${b}, 1)`;
	}

	// Convert to object (alias for value)
	object(): T {
		return this.color;
	}

	// Make it behave like the original object with direct property access
	toJSON(): T {
		return this.color;
	}

	toString(): string {
		return this.string();
	}

	// Proxy to allow direct property access
	static create<T extends Record<string, number>>(color: T, model: string, parentColor: any): T & ColorSpaceWrapper<T> {
		const wrapper = new ColorSpaceWrapper<T>(color, model, parentColor);
		const proxy = new Proxy(wrapper, {
			get(target, prop) {
				// If it's a wrapper method, call it
				if (prop in target && typeof (target as any)[prop] === 'function') {
					return (target as any)[prop].bind(target);
				}
				// If it's a color property, return it
				if (prop in color) {
					return color[prop as keyof T];
				}
				// Check wrapper properties
				if (prop === 'color') return color;
				if (prop === 'model') return model;
				if (prop === 'parentColor') return parentColor;
				// Otherwise return undefined
				return undefined;
			}
		}) as T & ColorSpaceWrapper<T>;
		return proxy;
	}
}
