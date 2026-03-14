import { toHex } from "./color-utils/hex.js";
import { hslToRgb, rgbToHsl } from "./color-utils/hsl.js";
import { toHwb, hwbToRgb } from "./color-utils/hwb.js";
import { rgbToHsv, hsvToRgb } from "./color-utils/color.js";
import { ColorSpaceWrapper } from "./color-space-wrapper.js";
import Color from "./index.js";

function red(r?: number) {
	if (r === undefined) return this._r;
	this._r = r;
	return this;
}

function green(g?: number) {
	if (g === undefined) return this._g;
	this._g = g;
	return this;
}

function blue(b?: number) {
	if (b === undefined) return this._b;
	this._b = b;
	return this;
}

/**
 * Get or set the alpha value of the color
 * @param a - the alpha value to set (optional)
 * @returns the alpha value when getting, or the Color instance when setting
 */
function alpha(a?: number) {
	if (a === undefined) return this._A;
	this._A = a;
	return this;
}

function hsl(h?: number, s?: number, l?: number) {
	if (h === undefined) {
		// Getter: return HSL object from current RGB with wrapper
		const hslValues = rgbToHsl({ r: this._r, g: this._g, b: this._b });
		return ColorSpaceWrapper.create(hslValues, "hsl", this);
	}
	// Setter: convert HSL to RGB and update
	const rgb = hslToRgb({ h, s: s ?? 0, l: l ?? 0 });
	this._r = rgb.r;
	this._g = rgb.g;
	this._b = rgb.b;
	return this;
}

function rgb(r?: number, g?: number, b?: number, a?: number) {
	if (r === undefined) {
		// Getter: return RGB object
		return { r: this._r, g: this._g, b: this._b };
	}
	// Setter: update RGB values
	this._r = r;
	if (g !== undefined) this._g = g;
	if (b !== undefined) this._b = b;
	if (a !== undefined) this._A = a;
	return this;
}

function hwb(h?: number, w?: number, b?: number) {
	if (h === undefined) {
		// Getter: return HWB object from current RGB with wrapper
		const hwbValues = toHwb({ r: this._r, g: this._g, b: this._b });
		return ColorSpaceWrapper.create(hwbValues, "hwb", this);
	}
	// Setter: convert HWB to RGB and update
	const rgb = hwbToRgb({ h, w: w ?? 0, b: b ?? 0 });
	this._r = rgb.r;
	this._g = rgb.g;
	this._b = rgb.b;
	return this;
}

function hsv(h?: number, s?: number, v?: number) {
	if (h === undefined) {
		// Getter: return HSV object from current RGB with wrapper
		const hsvValues = rgbToHsv({ r: this._r, g: this._g, b: this._b });
		return ColorSpaceWrapper.create(hsvValues, "hsv", this);
	}
	// Setter: convert HSV to RGB and update
	const rgb = hsvToRgb({ h, s: s ?? 0, v: v ?? 0 });
	this._r = rgb.r;
	this._g = rgb.g;
	this._b = rgb.b;
	return this;
}

function hex(value?: string) {
	if (value === undefined) {
		// Getter: return hex string
		return `#${toHex(this._r)}${toHex(this._g)}${toHex(this._b)}`;
	}
	// Setter: parse hex and update
	const color = new Color(value);
	this._r = color._r;
	this._g = color._g;
	this._b = color._b;
	this._A = color._A;
	return this;
}

function hexa(value?: string) {
	if (value === undefined) {
		// Getter: return hexa string
		const alpha = Math.max(0, Math.min(1, this._A));
		return `#${toHex(this._r)}${toHex(this._g)}${toHex(this._b)}${toHex(
			Math.round(alpha * 255),
		)}`;
	}
	// Setter: parse hexa and update
	const color = new Color(value);
	this._r = color._r;
	this._g = color._g;
	this._b = color._b;
	this._A = color._A;
	return this;
}

function setLab(string: string | undefined) {
	return new Color(string, "lab");
}

function setLch(string: string | undefined) {
	return new Color(string, "lch");
}

function setOklab(string: string | undefined) {
	return new Color(string, "oklab");
}

function setHwb(string: string | undefined) {
	return new Color(string, "hwb");
}

function setOklch(string: string | undefined) {
	return new Color(string, "oklch");
}

function setColor(string: string | undefined) {
	return new Color(string, "color");
}

const channelGetters: Record<string, () => number> = {
	red() {
		return this._r;
	},
	green() {
		return this._g;
	},
	blue() {
		return this._b;
	},
	alpha() {
		return this._A;
	},
	hue() {
		return rgbToHsl({ r: this._r, g: this._g, b: this._b }).h;
	},
	saturationl() {
		return rgbToHsl({ r: this._r, g: this._g, b: this._b }).s;
	},
	lightness() {
		return rgbToHsl({ r: this._r, g: this._g, b: this._b }).l;
	},
	saturationv() {
		return this._s ?? 0;
	},
	value() {
		return this._l ?? 0;
	},
	chroma() {
		return this._z ?? 0;
	},
	gray() {
		return this._y ?? 0;
	},
	white() {
		return this._y ?? 0;
	},
	wblack() {
		return this._z ?? 0;
	},
	cyan() {
		return this._x ?? 0;
	},
	magenta() {
		return this._y ?? 0;
	},
	yellow() {
		return this._z ?? 0;
	},
	black() {
		return this._z ?? 0;
	},
	x() {
		return this._x ?? 0;
	},
	y() {
		return this._y ?? 0;
	},
	z() {
		return this._z ?? 0;
	},
	l() {
		return this._l ?? 0;
	},
	a() {
		return this._x ?? 0;
	},
	b() {
		return this._y ?? 0;
	},
};

function array() {
	return [this._r, this._g, this._b];
}

function rgbNumber() {
	return (this._r << 16) + (this._g << 8) + this._b;
}

const setters = {
	red,
	green,
	blue,
	alpha,
	hex,
	hexa,
	rgb,
	hsl,
	hwb,
	hsv,
	array,
	rgbNumber,
};

const getters = {
	...channelGetters,
	hex,
	hexa,
	rgb,
	hsl,
	hwb,
	hsv,
	array,
	rgbNumber,
};

export default { getters, setters };
