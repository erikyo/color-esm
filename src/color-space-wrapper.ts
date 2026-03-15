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
	string(precision?: number): string {
		// Helper to format values with precision matching original library
		const fmt = (v: number) => {
			if (precision !== undefined) {
				const factor = Math.pow(10, precision);
				return (Math.round(v * factor) / factor).toString();
			}
			// Default precision for original library compatibility
			const rounded = Math.round(v * 10) / 10;
			return rounded.toString();
		};

		// Format manually based on the model
		if (this.model === 'hsl') {
			const { h, s, l } = this.color as any;
			const a = this.parentColor?._A ?? 1;
			const isAlpha = a !== 1;
			
			if (isAlpha) {
				return `hsla(${fmt(h)}, ${fmt(s)}%, ${fmt(l)}%, ${a})`;
			}
			return `hsl(${fmt(h)}, ${fmt(s)}%, ${fmt(l)}%)`;
		} else if (this.model === 'hsv') {
			const { h, s, v } = this.color as any;
			return `hsv(${fmt(h)}, ${fmt(s)}%, ${fmt(v)}%)`;
		} else if (this.model === 'hwb') {
			const { h, w, b } = this.color as any;
			const a = this.parentColor?._A ?? 1;
			const isAlpha = a !== 1;

			if (isAlpha) {
				return `hwb(${fmt(h)}, ${fmt(w)}%, ${fmt(b)}%, ${a})`;
			}
			return `hwb(${fmt(h)}, ${fmt(w)}%, ${fmt(b)}%)`;
		} else if (this.model === 'cmyk') {
			const { c, m, y, k } = this.color as any;
			return `cmyk(${fmt(c)}, ${fmt(m)}, ${fmt(y)}, ${fmt(k)})`;
		}
		
		// If it's a wrapper for RGB, use the parent color's formatColor logic
		if (this.model === 'rgb' || (this.color as any).r !== undefined) {
			return this.parentColor.toString(this.model === 'rgb' ? 'rgba' : this.model);
		}

		// Default to rgba for other models
		const { r, g, b } = this.color as any;
		const a = this.parentColor?._A ?? 1;
		const isAlpha = a !== 1;

		if (isAlpha) {
			return `rgba(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)}, ${a})`;
		}
		return `rgb(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)})`;
	}

	// Return parent color for rgb() chaining
	rgb(): any {
		return this.parentColor;
	}

	// Convert to object (alias for value)
	object(): Record<string, number> {
		const a = this.parentColor?._A ?? 1;
		const rounded: Record<string, number> = {};
		for (const [k, v] of Object.entries(this.color)) {
			rounded[k] = Math.round(v as number);
		}
		if (a !== 1) {
			rounded.alpha = a;
		}
		return rounded;
	}

	// Convert to array based on model
	array(): number[] {
		// Use values in order based on model
		if (this.model === 'hsl') {
			const { h, s, l } = this.color as any;
			return [Math.round(h), Math.round(s), Math.round(l)];
		}
		if (this.model === 'hsv') {
			const { h, s, v } = this.color as any;
			return [Math.round(h), Math.round(s), Math.round(v)];
		}
		if (this.model === 'hwb') {
			const { h, w, b } = this.color as any;
			return [Math.round(h), Math.round(w), Math.round(b)];
		}
		if (this.model === 'cmyk') {
			const { c, m, y, k } = this.color as any;
			return [Math.round(c), Math.round(m), Math.round(y), Math.round(k)];
		}
		return Object.values(this.color).map(v => Math.round(v));
	}

	// Round the color values of the wrapper itself
	round(): any {
		for (const key in this.color) {
			if (Object.prototype.hasOwnProperty.call(this.color, key)) {
				this.color[key] = Math.round(this.color[key] as any) as any;
			}
		}
		return this;
	}

	// Return RGB string representation with alpha (for use when called on color space wrapper)
	rgbString(): string {
		const a = this.parentColor?._A ?? 1;
		if (a !== 1) {
			return `rgba(${Math.round(this.parentColor._r)}, ${Math.round(this.parentColor._g)}, ${Math.round(this.parentColor._b)}, ${a})`;
		}
		return `rgb(${Math.round(this.parentColor._r)}, ${Math.round(this.parentColor._g)}, ${Math.round(this.parentColor._b)})`;
	}

	// Convert to JSON format matching original color package
	toJSON(): { color: number[], model: string, valpha: number } {
		const values = this.array();
		return {
			color: values,
			model: this.model,
			valpha: this.parentColor?._A ?? 1,
		};
	}

	toString(): string {
		return this.string();
	}

	// Proxy to allow direct property access
	static create<T extends Record<string, number>>(color: T, model: string, parentColor: any): T & ColorSpaceWrapper<T> {
		const wrapper = new ColorSpaceWrapper<T>(color, model, parentColor);
		const proto = Object.getPrototypeOf(wrapper);
		const parentProto = parentColor ? Object.getPrototypeOf(parentColor) : null;
		const proxy = new Proxy(wrapper, {
			get(target, prop) {
				const propName = String(prop);
				
				// If it's a wrapper method, call it
				if (prop in target && typeof (target as any)[prop] === 'function') {
					return (target as any)[prop].bind(target);
				}
				
				// If it's a color property, return it
				if (prop in color) {
					return color[prop as keyof T];
				}
				
				// Check special properties
				if (prop === 'color') return color;
				if (prop === 'model') return model;
				if (prop === 'parentColor') return parentColor;
				
				// Check parentColor prototype for the method
				if (parentColor && parentProto && prop in parentProto && typeof parentProto[prop] === 'function') {
					return parentProto[prop].bind(parentColor);
				}
				
				// Check parentColor directly using hasOwnProperty
				if (parentColor && Object.prototype.hasOwnProperty.call(parentColor, prop)) {
					const val = parentColor[prop];
					return typeof val === 'function' ? val.bind(parentColor) : val;
				}
				
				// Check parentColor for inherited methods
				if (parentColor && typeof parentColor[prop] === 'function') {
					return parentColor[prop].bind(parentColor);
				}
				
				// Check wrapper prototype
				if (prop in proto && typeof proto[prop] === 'function') {
					return proto[prop].bind(target);
				}
				
				// Otherwise return undefined
				return undefined;
			},
			has(target, prop) {
				// Make sure proxy reports having the property
				return prop in target || prop in color || prop === 'color' || prop === 'model' || prop === 'parentColor' ||
				       (parentColor && (prop in parentColor || (parentProto && prop in parentProto)));
			},
			ownKeys(target) {
				// Return all keys
				const keys = new Set([
					...Object.getOwnPropertyNames(target),
					...Object.getOwnPropertyNames(color),
					'color', 'model', 'parentColor'
				]);
				if (parentColor) {
					for (const key of Object.getOwnPropertyNames(parentColor)) {
						keys.add(key);
					}
					if (parentProto) {
						for (const key of Object.getOwnPropertyNames(parentProto)) {
							keys.add(key);
						}
					}
				}
				return Array.from(keys);
			}
		}) as T & ColorSpaceWrapper<T>;
		return proxy;
	}
}
