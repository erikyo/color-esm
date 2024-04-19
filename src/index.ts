class Color {
    x?: number;
    y?: number;
    z?: number;
    a?: number;
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
		} else if (typeof r === "number" && typeof g === "number" && typeof b === "number") {
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
        r?: string | number;
        g?: number;
        b?: number;
        a?: number;
    }) {
        return new Color(colorObj.r, colorObj.g, colorObj.b, colorObj.a);
    }

    static fromString(colorString: string | undefined) {
        return new Color(colorString);
    }

    // https://www.w3.org/TR/css-color-4/#color-type
    // color spaces <rgb()> | <rgba()> |
    //               <hsl()> | <hsla()> | <hwb()> |
    //               <lab()> | <lch()> | <oklab()> | <oklch()> |
    //               <color()>

    static red(colorString: string | undefined) {

    }

    static green(colorString: string | undefined) {

    }

    static blue(colorString: string | undefined) {

    }

    static hex(colorString: string | undefined) {
        return new Color(colorString);
    }

    static rgb(
        r?: string | number,
        g?: number,
        b?: number,
        a = 1,
    ) {
        return new Color(r, g, b, a);
    }

    static rgbArray(rgbArray: unknown[] | undefined) {
        return new Color(rgbArray);
    }

    static rgbString(rgbString: string | undefined) {
        return new Color(rgbString);
    }

    static hsl(
        h?: string | number,
        s?: number,
        l?: number,
        a = 1,
    ) {
        return new Color(h, s, l, a);
    }

    static hslArray(hslArray: unknown[] | undefined) {
        return new Color(hslArray);
    }

    static hslString(hslString: string | undefined) {
        return new Color(hslString);
    }

    toLab() {
        const xyz = this.rgbToXyz();
        return this.xyzToLab(xyz.x, xyz.y, xyz.z);
    }

    /**
     * Given a color in XYZ color space, return the corresponding color in the CIELAB color space.
     * @param {number} L
     * @param {number} a
     * @param {number} b
     * @param {number} alpha
     */
    fromLab(L: number, a: number, b: number, alpha: number = 1): Color {
        const xyz = this.labToXyz(L, a, b);
        return new Color().fromXyz(xyz.x, xyz.y, xyz.z, alpha);
    }

    rgbToXyz() {
        let { r, g, b } = this.color;
        r /= 255;
        g /= 255;
        b /= 255;

        // Apply gamma correction if needed

        r = r > 0.04045 ? Math.pow((r + 0.055) / 1.055, 2.4) : r / 12.92;
        g = g > 0.04045 ? Math.pow((g + 0.055) / 1.055, 2.4) : g / 12.92;
        b = b > 0.04045 ? Math.pow((b + 0.055) / 1.055, 2.4) : b / 12.92;

        r *= 100;
        g *= 100;
        b *= 100;

        // Observer. = 2°, Illuminant = D65
        const x = r * 0.4124564 + g * 0.3575761 + b * 0.1804375;
        const y = r * 0.2126729 + g * 0.7151522 + b * 0.072175;
        const z = r * 0.0193339 + g * 0.119192 + b * 0.9503041;

        return { x, y, z };
    }

    xyzToLab(x: number, y: number, z: number) {
        // Reference white D65
        const Xn = 95.047;
        const Yn = 100.0;
        const Zn = 108.883;

        let fx = x / Xn;
        let fy = y / Yn;
        let fz = z / Zn;

        fx = fx > 0.008856 ? Math.pow(fx, 1 / 3) : (7.787 * fx) + (16 / 116);
        fy = fy > 0.008856 ? Math.pow(fy, 1 / 3) : (7.787 * fy) + (16 / 116);
        fz = fz > 0.008856 ? Math.pow(fz, 1 / 3) : (7.787 * fz) + (16 / 116);

        const L = (116 * fy) - 16;
        const a = 500 * (fx - fy);
        const b = 200 * (fy - fz);

        return { L, a, b };
    }

    labToXyz(L: number, a: number, b: number) {
        const fy = (L + 16) / 116;
        const fx = a / 500 + fy;
        const fz = fy - b / 200;

        const x = Math.pow(fx, 3) > 0.008856 ? Math.pow(fx, 3) : (116 * fx - 16) / 903.3;
        const y = Math.pow(fy, 3) > 0.008856 ? Math.pow(fy, 3) : (116 * fy - 16) / 903.3;
        const z = Math.pow(fz, 3) > 0.008856 ? Math.pow(fz, 3) : (116 * fz - 16) / 903.3;

        return { x: x * 95.047, y: y * 100.0, z: z * 108.883 };
    }

    fromXyz(x: number, y: number, z: number, alpha = 1) {
        // Observer. = 2°, Illuminant = D65
        const r = x * 3.2404542 + y * -1.5371385 + z * -0.4985314;
        const g = x * -0.969266 + y * 1.8760108 + z * 0.041556;
        const b = x * 0.0556434 + y * -0.2040259 + z * 1.0572252;

        let R = r / 100;
        let G = g / 100;
        let B = b / 100;

        // Apply gamma correction if needed

        R = R > 0.0031308 ? 1.055 * Math.pow(R, 1 / 2.4) - 0.055 : R * 12.92;
        G = G > 0.0031308 ? 1.055 * Math.pow(G, 1 / 2.4) - 0.055 : G * 12.92;
        B = B > 0.0031308 ? 1.055 * Math.pow(B, 1 / 2.4) - 0.055 : B * 12.92;

        R = Math.min(Math.max(0, R), 1);
        G = Math.min(Math.max(0, G), 1);
        B = Math.min(Math.max(0, B), 1);

        return new Color(R * 255, G * 255, B * 255, alpha);
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

    invert() {
        for (const i in this.color) {
            const key = i as keyof typeof this.color;
            this.color[key] = 255 - this.color[key];
        }
    }

    /** @deprecated use invert() */
    negate() {
        this.invert()
    }


    alpha(alphaValue) {
        this.color.a = typeof alphaValue === 'number' ? alphaValue : 1;
        return this;
    }

    /**
     * Lightens the color by a given amount.
     *
     * @param {number} amount - The amount to lighten the color by, ranging from 0 to 1.
     * @return {this} - Returns the modified color object.
     */
	lighten(amount: number) {
        const factor = 255 - (amount * 255);
        this.color.r -= factor;
        this.color.b -= factor;
        this.color.g -= factor;
        return this;
	}

    darken(amount: number) {

    }

    lightness(amount: number) {

    }

    saturate(amount: number) {
    }

    desaturate(amount: number) {

    }

    grayscale() {

    }

    whiten(amount: number) {

    }

    blacken(amount: number) {

    }

    fade(amount: number) {

    }

    opaquer(amount: number) {

    }

    rotate(amount: number) {

    }

    mix(color: Color) {

    }

    isDark() {

    }

    isLight() {

    }


	toRgbaString() {
		return `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${this.color.a})`;
	}


    toString() {
        return this.toRgbaString();
    }
}

export default Color;
