import { toHex } from "./color-utils/hex.js";
import { hslToRgb, rgbToHsl } from "./color-utils/hsl.js";
import { toHwb, hwbToRgb } from "./color-utils/hwb.js";
import { rgbToHsv, hsvToRgb } from "./color-utils/color.js";
import { rgbToCmyk, cmykToRgb } from "./color-utils/cmyk.js";
import { ColorSpaceWrapper } from "./color-space-wrapper.js";
import { Color } from "./index.js";

// Helper for rounding
const round = Math.round;

// Normalize hue to 0-360 range
function normalizeHue(h: number): number {
	h = h % 360;
	if (h < 0) h += 360;
	return h;
}

function red(r?: number) {
	if (r === undefined) return this._r;
	const clone = new Color();
	clone._r = Math.max(0, Math.min(255, r));
	clone._g = this._g;
	clone._b = this._b;
	clone._A = this._A;
	return clone;
}

function green(g?: number) {
	if (g === undefined) return this._g;
	const clone = new Color();
	clone._r = this._r;
	clone._g = Math.max(0, Math.min(255, g));
	clone._b = this._b;
	clone._A = this._A;
	return clone;
}

function blue(b?: number) {
	if (b === undefined) return this._b;
	const clone = new Color();
	clone._r = this._r;
	clone._g = this._g;
	clone._b = Math.max(0, Math.min(255, b));
	clone._A = this._A;
	return clone;
}

function alpha(a?: number) {
	if (a === undefined) return this._A;
	const clone = new Color();
	clone._r = this._r;
	clone._g = this._g;
	clone._b = this._b;
	clone._A = Math.max(0, Math.min(1, a));
	return clone;
}

function hsl(h?: number, s?: number, l?: number) {
	if (h === undefined) {
		const hslValues = rgbToHsl({ r: this._r, g: this._g, b: this._b });
		if (this._h_hsl !== undefined) hslValues.h = this._h_hsl;
		if (this._s_hsl !== undefined) hslValues.s = this._s_hsl;
		if (this._l_hsl !== undefined) hslValues.l = this._l_hsl;
		return ColorSpaceWrapper.create(hslValues as unknown as Record<string, number>, "hsl", this);
	}
	const rgbValue = hslToRgb({ h, s: s ?? 0, l: l ?? 0 });
	const clone = new Color();
	clone._r = rgbValue.r;
	clone._g = rgbValue.g;
	clone._b = rgbValue.b;
	clone._A = this._A;
	clone._h_hsl = h;
	clone._s_hsl = s ?? 0;
	clone._l_hsl = l ?? 0;
	return clone;
}

function rgb(r?: number, g?: number, b?: number, a?: number) {
	if (r === undefined) {
		const rgbValues = { r: this._r, g: this._g, b: this._b };
		return ColorSpaceWrapper.create(rgbValues, "rgb", this);
	}
	const clone = new Color();
	clone._r = r ?? this._r;
	clone._g = g ?? this._g;
	clone._b = b ?? this._b;
	clone._A = a ?? this._A;
	return clone;
}

function hwb(h?: number, w?: number, b?: number) {
	if (h === undefined) {
		const hwbValues = toHwb({ r: this._r, g: this._g, b: this._b });
		if (this._h_hwb !== undefined) hwbValues.h = this._h_hwb;
		if (this._w_hwb !== undefined) hwbValues.w = this._w_hwb;
		if (this._b_hwb !== undefined) hwbValues.b = this._b_hwb;
		return ColorSpaceWrapper.create(hwbValues as unknown as Record<string, number>, "hwb", this);
	}
	const rgbValue = hwbToRgb({ h, w: w ?? 0, b: b ?? 0 });
	const clone = new Color();
	clone._r = rgbValue.r;
	clone._g = rgbValue.g;
	clone._b = rgbValue.b;
	clone._A = this._A;
	clone._h_hwb = h;
	clone._w_hwb = w ?? 0;
	clone._b_hwb = b ?? 0;
	return clone;
}

function hsv(h?: number, s?: number, v?: number) {
	if (h === undefined) {
		const hsvValues = rgbToHsv({ r: this._r, g: this._g, b: this._b });
		if (this._h_hsv !== undefined) hsvValues.h = this._h_hsv;
		if (this._s_hsv !== undefined) hsvValues.s = this._s_hsv;
		if (this._v_hsv !== undefined) hsvValues.v = this._v_hsv;
		return ColorSpaceWrapper.create(hsvValues as unknown as Record<string, number>, "hsv", this);
	}
	const rgbValue = hsvToRgb({ h, s: s ?? 0, v: v ?? 0 });
	const clone = new Color();
	clone._r = rgbValue.r;
	clone._g = rgbValue.g;
	clone._b = rgbValue.b;
	clone._A = this._A;
	clone._h_hsv = h;
	clone._s_hsv = s ?? 0;
	clone._v_hsv = v ?? 0;
	return clone;
}

function cmyk(c?: number, m?: number, y?: number, k?: number) {
	if (c === undefined) {
		const cmykValues = rgbToCmyk({ r: this._r, g: this._g, b: this._b });
		if (this._c_cmyk !== undefined) cmykValues.c = this._c_cmyk;
		if (this._m_cmyk !== undefined) cmykValues.m = this._m_cmyk;
		if (this._y_cmyk !== undefined) cmykValues.y = this._y_cmyk;
		if (this._k_cmyk !== undefined) cmykValues.k = this._k_cmyk;
		return ColorSpaceWrapper.create(cmykValues as unknown as Record<string, number>, "cmyk", this);
	}
	const cc = Math.max(0, Math.min(100, c)) / 100;
	const mc = Math.max(0, Math.min(100, m ?? 0)) / 100;
	const yc = Math.max(0, Math.min(100, y ?? 0)) / 100;
	const kc = Math.max(0, Math.min(100, k ?? 0)) / 100;

	const clone = new Color();
	clone._r = round((1 - cc) * (1 - kc) * 255);
	clone._g = round((1 - mc) * (1 - kc) * 255);
	clone._b = round((1 - yc) * (1 - kc) * 255);
	clone._A = this._A;
	clone._c_cmyk = c;
	clone._m_cmyk = m ?? 0;
	clone._y_cmyk = y ?? 0;
	clone._k_cmyk = k ?? 0;
	return clone;
}

function hex(value?: string) {
	if (value === undefined) {
		return `#${toHex(round(this._r))}${toHex(round(this._g))}${toHex(round(this._b))}`;
	}
	const color = new Color(value);
	const clone = new Color();
	clone._r = color._r;
	clone._g = color._g;
	clone._b = color._b;
	clone._A = color._A;
	return clone;
}

function hexa(value?: string) {
	if (value === undefined) {
		const alpha = Math.max(0, Math.min(1, this._A));
		return `#${toHex(round(this._r))}${toHex(round(this._g))}${toHex(round(this._b))}${toHex(
			round(alpha * 255),
		)}`;
	}
	const color = new Color(value);
	const clone = new Color();
	clone._r = color._r;
	clone._g = color._g;
	clone._b = color._b;
	clone._A = color._A;
	return clone;
}

function hue(value?: number) {
	if (value === undefined) {
		// Prefer HSL hue, then HSV hue, then HWB hue, then calculate from RGB
		if (this._h_hsl !== undefined) return Math.round(normalizeHue(this._h_hsl));
		if (this._h_hsv !== undefined) return Math.round(normalizeHue(this._h_hsv));
		if (this._h_hwb !== undefined) return Math.round(normalizeHue(this._h_hwb));
		return round(rgbToHsl({ r: this._r, g: this._g, b: this._b }).h);
	}
	const normalizedValue = normalizeHue(value);
	// If this color was created in HWB space (and not HSL/HSV), set HWB hue
	if (this._h_hwb !== undefined && this._h_hsl === undefined && this._h_hsv === undefined) {
		const w = this._w_hwb ?? 0;
		const b = this._b_hwb ?? 0;
		return this.hwb(normalizedValue, w, b);
	}
	const hslValues = rgbToHsl({ r: this._r, g: this._g, b: this._b });
	const s = this._s_hsl ?? hslValues.s;
	const l = this._l_hsl ?? hslValues.l;
	return this.hsl(normalizedValue, s, l);
}

function saturationl(value?: number) {
	if (value === undefined) {
		if (this._s_hsl !== undefined) {
			return Math.round(this._s_hsl);
		}
		return round(rgbToHsl({ r: this._r, g: this._g, b: this._b }).s);
	}
	const hslValues = rgbToHsl({ r: this._r, g: this._g, b: this._b });
	const h = this._h_hsl ?? hslValues.h;
	const l = this._l_hsl ?? hslValues.l;
	return this.hsl(h, value, l);
}

function lightness(value?: number) {
	if (value === undefined) {
		if (this._l_hsl !== undefined) return Math.round(this._l_hsl);
		return round(rgbToHsl({ r: this._r, g: this._g, b: this._b }).l);
	}
	const hslValues = rgbToHsl({ r: this._r, g: this._g, b: this._b });
	const h = this._h_hsl ?? hslValues.h;
	const s = this._s_hsl ?? hslValues.s;
	return this.hsl(h, s, value);
}

function saturationv(value?: number) {
	if (value === undefined) {
		if (this._s_hsv !== undefined) return Math.round(this._s_hsv);
		return round(rgbToHsv({ r: this._r, g: this._g, b: this._b }).s);
	}
	const hsvValues = rgbToHsv({ r: this._r, g: this._g, b: this._b });
	const h = this._h_hsv ?? hsvValues.h;
	const v = this._v_hsv ?? hsvValues.v;
	return this.hsv(h, value, v);
}

function value(v?: number) {
	if (v === undefined) {
		if (this._v_hsv !== undefined) return Math.round(this._v_hsv);
		const hsvValues = rgbToHsv({ r: this._r, g: this._g, b: this._b });
		return round(hsvValues.v);
	}
	const hsvValues = rgbToHsv({ r: this._r, g: this._g, b: this._b });
	const h = this._h_hsv ?? hsvValues.h;
	const s = this._s_hsv ?? hsvValues.s;
	return this.hsv(h, s, v);
}

function cyan(c?: number) {
	if (c === undefined) {
		if (this._c_cmyk !== undefined) return Math.round(this._c_cmyk);
		return round(rgbToCmyk({ r: this._r, g: this._g, b: this._b }).c);
	}
	const cmykVal = rgbToCmyk({ r: this._r, g: this._g, b: this._b });
	const m = this._m_cmyk ?? cmykVal.m;
	const y = this._y_cmyk ?? cmykVal.y;
	const k = this._k_cmyk ?? cmykVal.k;
	return this.cmyk(c, m, y, k);
}

function magenta(m?: number) {
	if (m === undefined) {
		if (this._m_cmyk !== undefined) return Math.round(this._m_cmyk);
		return round(rgbToCmyk({ r: this._r, g: this._g, b: this._b }).m);
	}
	const cmykVal = rgbToCmyk({ r: this._r, g: this._g, b: this._b });
	const c = this._c_cmyk ?? cmykVal.c;
	const y = this._y_cmyk ?? cmykVal.y;
	const k = this._k_cmyk ?? cmykVal.k;
	return this.cmyk(c, m, y, k);
}

function yellow(y?: number) {
	if (y === undefined) {
		if (this._y_cmyk !== undefined) return Math.round(this._y_cmyk);
		return round(rgbToCmyk({ r: this._r, g: this._g, b: this._b }).y);
	}
	const cmykVal = rgbToCmyk({ r: this._r, g: this._g, b: this._b });
	const c = this._c_cmyk ?? cmykVal.c;
	const m = this._m_cmyk ?? cmykVal.m;
	const k = this._k_cmyk ?? cmykVal.k;
	return this.cmyk(c, m, y, k);
}

function black(k?: number) {
	if (k === undefined) {
		if (this._k_cmyk !== undefined) return Math.round(this._k_cmyk);
		return round(rgbToCmyk({ r: this._r, g: this._g, b: this._b }).k);
	}
	const cmykVal = rgbToCmyk({ r: this._r, g: this._g, b: this._b });
	const c = this._c_cmyk ?? cmykVal.c;
	const m = this._m_cmyk ?? cmykVal.m;
	const y = this._y_cmyk ?? cmykVal.y;
	return this.cmyk(c, m, y, k);
}

function white(w?: number) {
	if (w === undefined) {
		if (this._w_hwb !== undefined) return Math.round(this._w_hwb);
		return round(toHwb({ r: this._r, g: this._g, b: this._b }).w);
	}
	const hwbValues = toHwb({ r: this._r, g: this._g, b: this._b });
	const h = this._h_hwb ?? hwbValues.h;
	const b = this._b_hwb ?? hwbValues.b;
	return this.hwb(h, w, b);
}

function wblack(b?: number) {
	if (b === undefined) {
		if (this._b_hwb !== undefined) return Math.round(this._b_hwb);
		return round(toHwb({ r: this._r, g: this._g, b: this._b }).b);
	}
	const hwbValues = toHwb({ r: this._r, g: this._g, b: this._b });
	const h = this._h_hwb ?? hwbValues.h;
	const w = this._w_hwb ?? hwbValues.w;
	return this.hwb(h, w, b);
}

function ansi256(value?: number) {
	if (value === undefined) {
		const r = Math.floor(this._r / 51);
		const g = Math.floor(this._g / 51);
		const b = Math.floor(this._b / 51);
		const ansi = 16 + 36 * r + 6 * g + b;
		return ColorSpaceWrapper.create({ ansi256: ansi }, "ansi256", this);
	}
	return this;
}

function ansi16(value?: number) {
	if (value === undefined) {
		return ColorSpaceWrapper.create({ ansi16: 31 }, "ansi16", this);
	}
	return this;
}

function array() {
	return [round(this._r), round(this._g), round(this._b)];
}

function unitArray() {
	const arr = [this._r / 255, this._g / 255, this._b / 255];
	if (this._A !== 1) arr.push(this._A);
	return arr;
}

function percentString() {
	const r = round((this._r / 255) * 100);
	const g = round((this._g / 255) * 100);
	const b = round((this._b / 255) * 100);
	if (this._A !== 1) return `rgba(${r}%, ${g}%, ${b}%, ${this._A})`;
	return `rgb(${r}%, ${g}%, ${b}%)`;
}

function rgbNumber() {
	return (round(this._r) << 16) + (round(this._g) << 8) + round(this._b);
}

const setters = {
	red, green, blue, alpha, hue, saturationl, lightness, saturationv, value,
	white, wblack, cyan, magenta, yellow, black,
	hex, hexa, rgb, hsl, hwb, hsv, cmyk, ansi256, ansi16,
	array, unitArray, percentString, rgbNumber,
};

const getters = {
	red, green, blue, alpha, hue, saturationl, lightness, saturationv, value,
	white, wblack, cyan, magenta, yellow, black,
	hex, hexa, rgb, hsl, hwb, hsv, cmyk,
	array, unitArray, percentString, rgbNumber,
};

export default { getters, setters };
