class Color {
	color: { r: number; g: number; b: number; a: number };
	/**
	 * A constructor function for the Color class that initializes the color object based on the provided arguments.
	 *
	 * @param {number | string | object | any[]} r - The red component of the color.
	 * @param {number | undefined} g - The green component of the color.
	 * @param {number | undefined} b - The blue component of the color.
	 * @param {number | undefined} a - The alpha component of the color.
	 */
	constructor(
		r:
			| number
			| string
			| {
					r?: string | number | object | unknown[];
					g?: number;
					b?: number;
					a?: number;
			  }
			| unknown[] = 0,
		g?: number,
		b?: number,
		a: number | undefined = 1,
	) {
		if (typeof r === "string") {
			this.color = this.parseColorString(r);
		} else if (typeof r === "object" && r !== null && !Array.isArray(r)) {
			this.color = this.parseColorObject(r);
		} else if (Array.isArray(r)) {
			this.color = this.parseColorArray(r);
		} else if (typeof g === "number" && typeof b === "number") {
			this.color = { r, g, b, a };
		} else {
			this.color = { r: 0, g: 0, b: 0, a: 1 };
		}
	}

	static fromRGB(
		r: string | number | unknown[] | undefined,
		g: number | undefined,
		b: number | undefined,
		a = 1,
	) {
		return new Color(r, g, b, a);
	}

	static fromObject(colorObj: {
		r: string | number | undefined;
		g: number | undefined;
		b: number | undefined;
		a: number | undefined;
	}) {
		return new Color(colorObj.r, colorObj.g, colorObj.b, colorObj.a);
	}

	static fromString(colorString: string | undefined) {
		return new Color(colorString);
	}

	static rgb(
		r: string | number | undefined,
		g: number | undefined,
		b: number | undefined,
		a = 1,
	) {
		return new Color(r, g, b, a);
	}

	static rgbArray(rgbArray: unknown[] | undefined) {
		return new Color(rgbArray);
	}

	parseColorString(colorString: string) {
		// Parse CSS color string
		// For simplicity, let's assume the color string is always in the format rgba(r, g, b, a)
		const rgbaRegex = /rgba?\((\d+), (\d+), (\d+)(?:, ([\d.]+))?\)/;
		const matches = colorString.match(rgbaRegex);
		if (!matches) {
			throw new Error("Invalid color string format");
		}

		return {
			r: Number.parseInt(matches[1], 10),
			g: Number.parseInt(matches[2], 10),
			b: Number.parseInt(matches[3], 10),
			a: matches[4] ? Number.parseFloat(matches[4]) : 1,
		};
	}

	/**
	 * Parse a color object in the format {r: r, g: g, b: b, a: a} and returns an object with r, g, b, and a properties.
	 * @param colorObj the color object
	 * @return {{r: number, g: number, b: number, a: number}} the color object
	 */
	parseColorObject(colorObj: {
		r?: string | number | object | unknown[];
		g?: number;
		b?: number;
		a?: number;
	}): { r: number; g: number; b: number; a: number } {
		// Validate color object
		if (
			typeof colorObj.r !== "number" ||
			typeof colorObj.g !== "number" ||
			typeof colorObj.b !== "number"
		) {
			throw new Error("Invalid color object format");
		}

		return {
			r: colorObj.r,
			g: colorObj.g,
			b: colorObj.b,
			a: typeof colorObj.a === "number" ? colorObj.a : 1,
		};
	}

	/**
	 * Parses a color array in the format [r, g, b, a] and returns an object with r, g, b, and a properties.
	 *
	 * @param rgbArray the color array
	 * @return the color object
	 */
	parseColorArray(rgbArray: unknown[]) {
		if (rgbArray.length < 3) {
			throw new Error("Invalid color array format");
		}

		return {
			r: Number.parseInt(String(rgbArray[0]), 10),
			g: Number.parseInt(String(rgbArray[1]), 10),
			b: Number.parseInt(String(rgbArray[2]), 10),
			a: rgbArray.length === 4 ? Number.parseInt(String(rgbArray[3]), 10) : 1,
		};
	}

	alpha(alphaValue: number | string | undefined) {
		return new Color(
			`rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${
				alphaValue ?? 1
			})`,
		);
	}

	lighten(amount: number) {
		return new Color(
			`rgba(${this.color.r + amount * 255}, ${this.color.g + amount * 255}, ${
				this.color.b + amount * 255
			}, ${this.color.a})`,
		);
	}

	toString() {
		return `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${this.color.a})`;
	}
}

export default Color;
