class Color {
	constructor(r, g, b, a = 1) {
		if (typeof r === "string") {
			this.color = this.parseColorString(r);
		} else if (typeof r === "object" && r !== null && !Array.isArray(r)) {
			this.color = this.parseColorObject(r);
		} else if (Array.isArray(r)) {
			this.color = this.parseColorArray(r);
		} else {
			this.color = { r, g, b, a };
		}
	}

	static fromRGB(r, g, b, a = 1) {
		return new Color(r, g, b, a);
	}

	static fromObject(colorObj) {
		return new Color(colorObj.r, colorObj.g, colorObj.b, colorObj.a);
	}

	static fromString(colorString) {
		return new Color(colorString);
	}

	static rgb(r, g, b, a = 1) {
		return new Color(r, g, b, a);
	}

	static rgbArray(rgbArray) {
		return new Color(rgbArray);
	}

	parseColorString(colorString) {
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

	parseColorObject(colorObj) {
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

	parseColorArray(rgbArray) {
		if (rgbArray.length < 3) {
			throw new Error("Invalid color array format");
		}

		return {
			r: rgbArray[0],
			g: rgbArray[1],
			b: rgbArray[2],
			a: rgbArray.length === 4 ? rgbArray[3] : 1,
		};
	}

	alpha(alphaValue) {
		return new Color(
			`rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${alphaValue})`,
		);
	}

	lighten(amount) {
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
