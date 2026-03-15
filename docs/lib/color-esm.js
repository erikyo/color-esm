var Color = (() => {
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // src/index.ts
  var index_exports = {};
  __export(index_exports, {
    Color: () => Color,
    default: () => index_default
  });

  // src/constants.ts
  var COLOR_MODEL = [
    "hex",
    "rgb",
    "rgba",
    "hsl",
    "hsla",
    "lab",
    "lch",
    "hwb",
    "oklab",
    "oklch",
    "xyz",
    "cmyk",
    "color"
  ];
  var formatOptions = {
    string: {},
    number: {
      radix: 10,
      decimalPlaces: 0
    },
    int8: {
      radix: 10,
      min: 0,
      max: 255,
      decimalPlaces: 0
    },
    hex: {
      radix: 16,
      min: 0,
      max: 255,
      decimalPlaces: 0
    },
    normalized: {
      radix: 10,
      min: 0,
      max: 1,
      decimalPlaces: 4
    },
    float16: {
      radix: 10,
      min: 0,
      max: 100,
      decimalPlaces: 2
    },
    percentage: {
      radix: 10,
      min: 0,
      max: 100,
      suffix: "%",
      decimalPlaces: 0
    },
    radius: {
      radix: 10,
      min: 0,
      max: 360,
      suffix: "rad",
      decimalPlaces: 0
    }
  };
  var isNumeric = /^-?\d*\.?\d+$/i;
  var HexFormat = /^[0-9a-f]+$/i;

  // src/common.ts
  function shortHexToLongHex(value2) {
    return Array.from(value2).map((v) => (v + v).toUpperCase());
  }
  function isHex(num) {
    return Boolean(num.match(HexFormat));
  }
  function splitValues(rawValues) {
    const parts = rawValues.split("/");
    if (parts.length === 2) {
      const colorValues = parts[0].trim().split(parts[0].includes(",") ? "," : " ");
      const alpha2 = parts[1].trim();
      return [...colorValues.map((s) => s.trim()), alpha2];
    }
    return rawValues.split(rawValues.includes(",") ? "," : " ").map((s) => s.trim());
  }
  function normalizeDegrees(angle) {
    let degAngle = Number.parseFloat(angle) || 0;
    if (angle.indexOf("deg") > -1) {
      degAngle = Number.parseFloat(angle.substring(0, angle.length - 3));
    } else if (angle.indexOf("rad") > -1) {
      degAngle = Math.round(
        Number.parseFloat(angle.substring(0, angle.length - 3)) * (180 / Math.PI)
      );
    } else if (angle.indexOf("turn") > -1) {
      degAngle = Math.round(
        Number.parseFloat(angle.substring(0, angle.length - 4)) * 360
      );
    }
    while (degAngle < 0) {
      degAngle += 360;
    }
    if (degAngle >= 360) degAngle %= 360;
    return degAngle;
  }
  function range(value2, min = 0, max = 255) {
    let newValue = value2;
    if (max !== void 0) newValue = Math.min(newValue, max);
    if (min !== void 0) newValue = Math.max(newValue, min);
    return newValue;
  }
  function calculateValue(valueString, multiplier) {
    const regex = /calc\(([^)]+)\)/;
    const match = valueString.match(regex);
    return safeInt(match ? match[1] : valueString, multiplier);
  }
  var stripComments = /(\/\*[^*]*\*\/)|(\/\/[^*]*)/g;
  function stripComment(string) {
    return string.replace(stripComments, "");
  }
  function cleanDefinition(string) {
    const cleanString = stripComment(string);
    const firstParenthesisIndex = cleanString.indexOf("(");
    const lastParenthesisIndex = cleanString.lastIndexOf(")");
    return cleanString.slice(firstParenthesisIndex + 1, lastParenthesisIndex).trim();
  }
  function normalizePercentage(value2, multiplier) {
    return Number.parseFloat(value2) / 100 * multiplier;
  }
  function colorValueFallbacks(value2, err) {
    switch (value2) {
      case "infinity":
        console.warn(
          err || `Positive infinity value has been set to 255: ${value2}`
        );
        return 255;
      case "currentColor":
        console.warn(
          err || `The "currentColor" value has been set to 0: ${value2}`
        );
        break;
      case "transparent":
        console.warn(
          err || `The "transparent" value has been set to 0: ${value2}`
        );
        break;
      case "NaN":
        console.warn(err || `"NaN" value has been set to 0: ${value2}`);
        break;
      case "-infinity":
        console.warn(
          err || `"Negative" infinity value has been set to 0: ${value2}`
        );
        break;
      case "none":
        console.warn(
          err || `The none keyword is invalid in legacy color syntax: ${value2}`
        );
        break;
      default:
        console.warn(err || `Invalid color value: ${value2}`);
        break;
    }
    return 0;
  }
  function Int(value2, options) {
    if (options) {
      return range(Number(value2), options.min, options.max);
    }
    return Number(value2);
  }
  function safeInt(value2, max = 255) {
    if (typeof value2 === "number") return range(value2, 0, max);
    const newValue = typeof value2 === "string" ? value2?.trim() : "0";
    if (isNumeric.test(newValue)) {
      return range(Number.parseFloat(newValue) || 0, 0, max);
    }
    if (newValue.endsWith("%")) {
      return normalizePercentage(newValue, max) || 0;
    }
    if (newValue.endsWith("deg") || newValue.endsWith("rad") || newValue.endsWith("turn")) {
      return normalizeDegrees(newValue);
    }
    if (newValue.startsWith("calc")) {
      return range(calculateValue(newValue, max), 0, max);
    }
    return colorValueFallbacks(newValue, `Invalid value: ${value2}`);
  }
  function normalizeAlpha(value2) {
    if (typeof value2 === "number") {
      return range(value2, 0, 1);
    }
    return safeInt(value2, 1);
  }
  function isModel(model) {
    return COLOR_MODEL.includes(model);
  }
  function isFormat(format) {
    return Object.keys(formatOptions).includes(format);
  }

  // src/formatters.ts
  function formatValue(value2, format = "number") {
    if (format === "number") {
      return value2.toString();
    }
    const { min, max, radix, suffix } = {
      min: 0,
      max: 255,
      radix: 10,
      suffix: "",
      ...formatOptions[format]
    };
    const normalizedValue = (value2 - min) / (max - min);
    const formattedValue = (normalizedValue * (radix === 16 ? 255 : 1)).toString(
      radix
    );
    return formattedValue + suffix;
  }
  function formatColor(color, model, separator = ", ") {
    const format = "number";
    const f = isFormat(format) ? format : "number";
    const m = isFormat(model) ? model : "rgba";
    switch (m) {
      case "hex":
        return `#${formatValue(color._r, f)}${formatValue(
          color._g,
          f
        )}${formatValue(color._b, f)}`;
      case "rgba":
        if (color._A === 1) {
          return `rgb(${formatValue(Math.round(color._r), f)}${separator}${formatValue(
            Math.round(color._g),
            format
          )}${separator}${formatValue(Math.round(color._b), f)})`;
        }
        return `rgba(${formatValue(Math.round(color._r), f)}${separator}${formatValue(
          Math.round(color._g),
          format
        )}${separator}${formatValue(Math.round(color._b), f)}${separator}${formatValue(
          color._A,
          format
        )})`;
      default:
        if (color._A !== 1) {
          return `rgba(${formatValue(Math.round(color._r), f)}${separator}${formatValue(
            Math.round(color._g),
            format
          )}${separator}${formatValue(Math.round(color._b), f)}${separator}${formatValue(
            color._A,
            format
          )})`;
        }
        return `${m}(${formatValue(Math.round(color._r), f)}${separator}${formatValue(
          Math.round(color._g),
          format
        )}${separator}${formatValue(Math.round(color._b), f)})`;
    }
  }
  var formatters_default = formatColor;

  // src/color-utils/hex.ts
  function fromHex(hex2) {
    return {
      r: Number.parseInt(hex2[0], 16),
      g: Number.parseInt(hex2[1], 16),
      b: Number.parseInt(hex2[2], 16),
      A: Number.parseInt(hex2[3], 16) / 255 || 1
    };
  }
  function toHex(int8, alpha2 = false) {
    return int8.toString(16).padStart(2, "0").toUpperCase();
  }

  // src/color-utils/hsl.ts
  var angleError = (value2) => `Invalid angle: ${value2} - The none keyword is invalid in legacy color syntax `;
  function fromHsl([h, s, l, A]) {
    let hue2 = 0;
    if (h && !isNaN(Number(h))) {
      hue2 = normalizeDegrees(h);
    } else {
      hue2 = colorValueFallbacks(h, angleError(h)) || 0;
    }
    return {
      h: hue2,
      s: safeInt(s, 100) || 0,
      l: safeInt(l, 100) || 0,
      A: A !== void 0 ? Number(A) : 1
    };
  }
  function getHue(c, x, h) {
    if (h < 60) return [c, x, 0];
    if (h < 120) return [x, c, 0];
    if (h < 180) return [0, c, x];
    if (h < 240) return [0, x, c];
    if (h < 300) return [x, 0, c];
    return [c, 0, x];
  }
  function rgbToHsl({ r, g, b }) {
    r /= 255;
    g /= 255;
    b /= 255;
    const cmin = Math.min(r, g, b);
    const cmax = Math.max(r, g, b);
    const delta = cmax - cmin;
    let h = 0;
    let s = 0;
    let l = 0;
    if (delta === 0) {
      h = 0;
    } else if (cmax === r) {
      h = (g - b) / delta % 6;
    } else if (cmax === g) {
      h = (b - r) / delta + 2;
    } else {
      h = (r - g) / delta + 4;
    }
    h = h * 60;
    if (h < 0) {
      h += 360;
    }
    l = (cmax + cmin) / 2;
    s = delta === 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));
    s = s * 100;
    l = l * 100;
    return { h, s, l };
  }
  function hslToRgb({ h, s, l }) {
    s = s / 100;
    l = l / 100;
    const c = (1 - Math.abs(2 * l - 1)) * s;
    const x = c * (1 - Math.abs(h / 60 % 2 - 1));
    const m = l - c / 2;
    let [r, g, b] = getHue(c, x, h);
    r = Math.round((r + m) * 255);
    g = Math.round((g + m) * 255);
    b = Math.round((b + m) * 255);
    return { r, g, b };
  }

  // src/color-utils/hwb.ts
  function toHwb({ r, g, b }) {
    r /= 255;
    g /= 255;
    b /= 255;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const delta = max - min;
    let h = 0;
    if (delta !== 0) {
      if (max === r) {
        h = (g - b) / delta % 6;
      } else if (max === g) {
        h = (b - r) / delta + 2;
      } else {
        h = (r - g) / delta + 4;
      }
    }
    h = h * 60;
    if (h < 0) h += 360;
    const w = min * 100;
    const bl = (1 - max) * 100;
    return { h, w, b: bl };
  }
  function hwbToRgb({ h, w, b }) {
    w /= 100;
    b /= 100;
    const c = Math.max(0, 1 - w - b);
    const hRad = (h % 360 + 360) % 360 / 60;
    const x = c * (1 - Math.abs(hRad % 2 - 1));
    let r = 0, g = 0, b_ = 0;
    if (hRad >= 0 && hRad < 1) {
      [r, g, b_] = [c, x, 0];
    } else if (hRad >= 1 && hRad < 2) {
      [r, g, b_] = [x, c, 0];
    } else if (hRad >= 2 && hRad < 3) {
      [r, g, b_] = [0, c, x];
    } else if (hRad >= 3 && hRad < 4) {
      [r, g, b_] = [0, x, c];
    } else if (hRad >= 4 && hRad < 5) {
      [r, g, b_] = [x, 0, c];
    } else {
      [r, g, b_] = [c, 0, x];
    }
    r = (r + w) * 255;
    g = (g + w) * 255;
    b_ = (b_ + w) * 255;
    return {
      r: Math.round(r),
      g: Math.round(g),
      b: Math.round(b_)
    };
  }
  function fromHwb([h, w, b, alpha2 = 1]) {
    return {
      h: safeInt(h, 360),
      w: safeInt(w, 100),
      b: safeInt(b, 100),
      A: typeof alpha2 === "number" ? Math.max(0, Math.min(1, alpha2)) : Number(alpha2)
    };
  }

  // src/color-utils/color.ts
  function fromColor([h, s, l, alpha2 = "1"]) {
    return { r: 0, g: 0, b: 0, A: Number(alpha2) };
  }
  function rgbToHsv({ r, g, b }) {
    r /= 255;
    g /= 255;
    b /= 255;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const delta = max - min;
    let h = 0;
    if (delta !== 0) {
      if (max === r) {
        h = (g - b) / delta % 6;
      } else if (max === g) {
        h = (b - r) / delta + 2;
      } else {
        h = (r - g) / delta + 4;
      }
    }
    h = h * 60;
    if (h < 0) h += 360;
    const s = max === 0 ? 0 : delta / max * 100;
    const v = max * 100;
    return { h, s, v };
  }
  function hsvToRgb({ h, s, v }) {
    h = h % 360;
    s /= 100;
    v /= 100;
    const c = v * s;
    const x = c * (1 - Math.abs(h / 60 % 2 - 1));
    const m = v - c;
    let r = 0, g = 0, b = 0;
    if (h >= 0 && h < 60) {
      [r, g, b] = [c, x, 0];
    } else if (h >= 60 && h < 120) {
      [r, g, b] = [x, c, 0];
    } else if (h >= 120 && h < 180) {
      [r, g, b] = [0, c, x];
    } else if (h >= 180 && h < 240) {
      [r, g, b] = [0, x, c];
    } else if (h >= 240 && h < 300) {
      [r, g, b] = [x, 0, c];
    } else {
      [r, g, b] = [c, 0, x];
    }
    return {
      r: Math.round((r + m) * 255),
      g: Math.round((g + m) * 255),
      b: Math.round((b + m) * 255)
    };
  }

  // src/color-utils/cmyk.ts
  function fromCmyk([c = 0, m = 0, y = 0, k = 0]) {
    return {
      c: safeInt(c, 100),
      m: safeInt(m, 100),
      y: safeInt(y, 100),
      k: safeInt(k, 100)
    };
  }
  function rgbToCmyk(rgb2) {
    const { r, g, b } = rgb2;
    const red2 = r / 255;
    const green2 = g / 255;
    const blue2 = b / 255;
    const k = 1 - Math.max(red2, green2, blue2);
    const c = (1 - red2 - k) / (1 - k);
    const m = (1 - green2 - k) / (1 - k);
    const y = (1 - blue2 - k) / (1 - k);
    return {
      c: c * 100,
      m: m * 100,
      y: y * 100,
      k: k * 100
    };
  }

  // src/color-space-wrapper.ts
  var ColorSpaceWrapper = class _ColorSpaceWrapper {
    color;
    model;
    parentColor;
    constructor(color, model, parentColor) {
      this.color = color;
      this.model = model;
      this.parentColor = parentColor;
    }
    // Get the raw color values
    get value() {
      return this.color;
    }
    // Convert to string representation
    string(precision) {
      const fmt = (v) => {
        if (precision !== void 0) {
          const factor = Math.pow(10, precision);
          return (Math.round(v * factor) / factor).toString();
        }
        const rounded = Math.round(v * 10) / 10;
        return rounded.toString();
      };
      if (this.model === "hsl") {
        const { h, s, l } = this.color;
        const a2 = this.parentColor?._A ?? 1;
        const isAlpha2 = a2 !== 1;
        if (isAlpha2) {
          return `hsla(${fmt(h)}, ${fmt(s)}%, ${fmt(l)}%, ${a2})`;
        }
        return `hsl(${fmt(h)}, ${fmt(s)}%, ${fmt(l)}%)`;
      } else if (this.model === "hsv") {
        const { h, s, v } = this.color;
        return `hsv(${fmt(h)}, ${fmt(s)}%, ${fmt(v)}%)`;
      } else if (this.model === "hwb") {
        const { h, w, b: b2 } = this.color;
        const a2 = this.parentColor?._A ?? 1;
        const isAlpha2 = a2 !== 1;
        if (isAlpha2) {
          return `hwb(${fmt(h)}, ${fmt(w)}%, ${fmt(b2)}%, ${a2})`;
        }
        return `hwb(${fmt(h)}, ${fmt(w)}%, ${fmt(b2)}%)`;
      } else if (this.model === "cmyk") {
        const { c, m, y, k } = this.color;
        return `cmyk(${fmt(c)}, ${fmt(m)}, ${fmt(y)}, ${fmt(k)})`;
      }
      if (this.model === "rgb" || this.color.r !== void 0) {
        return this.parentColor.toString(this.model === "rgb" ? "rgba" : this.model);
      }
      const { r, g, b } = this.color;
      const a = this.parentColor?._A ?? 1;
      const isAlpha = a !== 1;
      if (isAlpha) {
        return `rgba(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)}, ${a})`;
      }
      return `rgb(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)})`;
    }
    // Return parent color for rgb() chaining
    rgb() {
      return this.parentColor;
    }
    // Convert to object (alias for value)
    object() {
      const a = this.parentColor?._A ?? 1;
      const rounded = {};
      for (const [k, v] of Object.entries(this.color)) {
        rounded[k] = Math.round(v);
      }
      if (a !== 1) {
        rounded.alpha = a;
      }
      return rounded;
    }
    // Convert to array based on model
    array() {
      if (this.model === "hsl") {
        const { h, s, l } = this.color;
        return [Math.round(h), Math.round(s), Math.round(l)];
      }
      if (this.model === "hsv") {
        const { h, s, v } = this.color;
        return [Math.round(h), Math.round(s), Math.round(v)];
      }
      if (this.model === "hwb") {
        const { h, w, b } = this.color;
        return [Math.round(h), Math.round(w), Math.round(b)];
      }
      if (this.model === "cmyk") {
        const { c, m, y, k } = this.color;
        return [Math.round(c), Math.round(m), Math.round(y), Math.round(k)];
      }
      return Object.values(this.color).map((v) => Math.round(v));
    }
    // Round the color values of the wrapper itself
    round() {
      for (const key in this.color) {
        if (Object.prototype.hasOwnProperty.call(this.color, key)) {
          this.color[key] = Math.round(this.color[key]);
        }
      }
      return this;
    }
    // Return RGB string representation with alpha (for use when called on color space wrapper)
    rgbString() {
      const a = this.parentColor?._A ?? 1;
      if (a !== 1) {
        return `rgba(${Math.round(this.parentColor._r)}, ${Math.round(this.parentColor._g)}, ${Math.round(this.parentColor._b)}, ${a})`;
      }
      return `rgb(${Math.round(this.parentColor._r)}, ${Math.round(this.parentColor._g)}, ${Math.round(this.parentColor._b)})`;
    }
    // Convert to JSON format matching original color package
    toJSON() {
      const values = this.array();
      return {
        color: values,
        model: this.model,
        valpha: this.parentColor?._A ?? 1
      };
    }
    toString() {
      return this.string();
    }
    // Proxy to allow direct property access
    static create(color, model, parentColor) {
      const wrapper = new _ColorSpaceWrapper(color, model, parentColor);
      const proto = Object.getPrototypeOf(wrapper);
      const parentProto = parentColor ? Object.getPrototypeOf(parentColor) : null;
      const proxy = new Proxy(wrapper, {
        get(target, prop) {
          const propName = String(prop);
          if (prop in target && typeof target[prop] === "function") {
            return target[prop].bind(target);
          }
          if (prop in color) {
            return color[prop];
          }
          if (prop === "color") return color;
          if (prop === "model") return model;
          if (prop === "parentColor") return parentColor;
          if (parentColor && parentProto && prop in parentProto && typeof parentProto[prop] === "function") {
            return parentProto[prop].bind(parentColor);
          }
          if (parentColor && Object.prototype.hasOwnProperty.call(parentColor, prop)) {
            const val = parentColor[prop];
            return typeof val === "function" ? val.bind(parentColor) : val;
          }
          if (parentColor && typeof parentColor[prop] === "function") {
            return parentColor[prop].bind(parentColor);
          }
          if (prop in proto && typeof proto[prop] === "function") {
            return proto[prop].bind(target);
          }
          return void 0;
        },
        has(target, prop) {
          return prop in target || prop in color || prop === "color" || prop === "model" || prop === "parentColor" || parentColor && (prop in parentColor || parentProto && prop in parentProto);
        },
        ownKeys(target) {
          const keys = /* @__PURE__ */ new Set([
            ...Object.getOwnPropertyNames(target),
            ...Object.getOwnPropertyNames(color),
            "color",
            "model",
            "parentColor"
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
      });
      return proxy;
    }
  };

  // src/models.ts
  var round = Math.round;
  function normalizeHue(h) {
    h = h % 360;
    if (h < 0) h += 360;
    return h;
  }
  function red(r) {
    if (r === void 0) return this._r;
    const clone = new Color();
    clone._r = Math.max(0, Math.min(255, r));
    clone._g = this._g;
    clone._b = this._b;
    clone._A = this._A;
    return clone;
  }
  function green(g) {
    if (g === void 0) return this._g;
    const clone = new Color();
    clone._r = this._r;
    clone._g = Math.max(0, Math.min(255, g));
    clone._b = this._b;
    clone._A = this._A;
    return clone;
  }
  function blue(b) {
    if (b === void 0) return this._b;
    const clone = new Color();
    clone._r = this._r;
    clone._g = this._g;
    clone._b = Math.max(0, Math.min(255, b));
    clone._A = this._A;
    return clone;
  }
  function alpha(a) {
    if (a === void 0) return this._A;
    const clone = new Color();
    clone._r = this._r;
    clone._g = this._g;
    clone._b = this._b;
    clone._A = Math.max(0, Math.min(1, a));
    return clone;
  }
  function hsl(h, s, l) {
    if (h === void 0) {
      const hslValues = rgbToHsl({ r: this._r, g: this._g, b: this._b });
      if (this._h_hsl !== void 0) hslValues.h = this._h_hsl;
      if (this._s_hsl !== void 0) hslValues.s = this._s_hsl;
      if (this._l_hsl !== void 0) hslValues.l = this._l_hsl;
      return ColorSpaceWrapper.create(hslValues, "hsl", this);
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
  function rgb(r, g, b, a) {
    if (r === void 0) {
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
  function hwb(h, w, b) {
    if (h === void 0) {
      const hwbValues = toHwb({ r: this._r, g: this._g, b: this._b });
      if (this._h_hwb !== void 0) hwbValues.h = this._h_hwb;
      if (this._w_hwb !== void 0) hwbValues.w = this._w_hwb;
      if (this._b_hwb !== void 0) hwbValues.b = this._b_hwb;
      return ColorSpaceWrapper.create(hwbValues, "hwb", this);
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
  function hsv(h, s, v) {
    if (h === void 0) {
      const hsvValues = rgbToHsv({ r: this._r, g: this._g, b: this._b });
      if (this._h_hsv !== void 0) hsvValues.h = this._h_hsv;
      if (this._s_hsv !== void 0) hsvValues.s = this._s_hsv;
      if (this._v_hsv !== void 0) hsvValues.v = this._v_hsv;
      return ColorSpaceWrapper.create(hsvValues, "hsv", this);
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
  function cmyk(c, m, y, k) {
    if (c === void 0) {
      const cmykValues = rgbToCmyk({ r: this._r, g: this._g, b: this._b });
      if (this._c_cmyk !== void 0) cmykValues.c = this._c_cmyk;
      if (this._m_cmyk !== void 0) cmykValues.m = this._m_cmyk;
      if (this._y_cmyk !== void 0) cmykValues.y = this._y_cmyk;
      if (this._k_cmyk !== void 0) cmykValues.k = this._k_cmyk;
      return ColorSpaceWrapper.create(cmykValues, "cmyk", this);
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
  function hex(value2) {
    if (value2 === void 0) {
      return `#${toHex(round(this._r))}${toHex(round(this._g))}${toHex(round(this._b))}`;
    }
    const color = new Color(value2);
    const clone = new Color();
    clone._r = color._r;
    clone._g = color._g;
    clone._b = color._b;
    clone._A = color._A;
    return clone;
  }
  function hexa(value2) {
    if (value2 === void 0) {
      const alpha2 = Math.max(0, Math.min(1, this._A));
      return `#${toHex(round(this._r))}${toHex(round(this._g))}${toHex(round(this._b))}${toHex(
        round(alpha2 * 255)
      )}`;
    }
    const color = new Color(value2);
    const clone = new Color();
    clone._r = color._r;
    clone._g = color._g;
    clone._b = color._b;
    clone._A = color._A;
    return clone;
  }
  function hue(value2) {
    if (value2 === void 0) {
      if (this._h_hsl !== void 0) return Math.round(normalizeHue(this._h_hsl));
      if (this._h_hsv !== void 0) return Math.round(normalizeHue(this._h_hsv));
      if (this._h_hwb !== void 0) return Math.round(normalizeHue(this._h_hwb));
      return round(rgbToHsl({ r: this._r, g: this._g, b: this._b }).h);
    }
    const normalizedValue = normalizeHue(value2);
    if (this._h_hwb !== void 0 && this._h_hsl === void 0 && this._h_hsv === void 0) {
      const w = this._w_hwb ?? 0;
      const b = this._b_hwb ?? 0;
      return this.hwb(normalizedValue, w, b);
    }
    const hslValues = rgbToHsl({ r: this._r, g: this._g, b: this._b });
    const s = this._s_hsl ?? hslValues.s;
    const l = this._l_hsl ?? hslValues.l;
    return this.hsl(normalizedValue, s, l);
  }
  function saturationl(value2) {
    if (value2 === void 0) {
      if (this._s_hsl !== void 0) {
        return Math.round(this._s_hsl);
      }
      return round(rgbToHsl({ r: this._r, g: this._g, b: this._b }).s);
    }
    const hslValues = rgbToHsl({ r: this._r, g: this._g, b: this._b });
    const h = this._h_hsl ?? hslValues.h;
    const l = this._l_hsl ?? hslValues.l;
    return this.hsl(h, value2, l);
  }
  function lightness(value2) {
    if (value2 === void 0) {
      if (this._l_hsl !== void 0) return Math.round(this._l_hsl);
      return round(rgbToHsl({ r: this._r, g: this._g, b: this._b }).l);
    }
    const hslValues = rgbToHsl({ r: this._r, g: this._g, b: this._b });
    const h = this._h_hsl ?? hslValues.h;
    const s = this._s_hsl ?? hslValues.s;
    return this.hsl(h, s, value2);
  }
  function saturationv(value2) {
    if (value2 === void 0) {
      if (this._s_hsv !== void 0) return Math.round(this._s_hsv);
      return round(rgbToHsv({ r: this._r, g: this._g, b: this._b }).s);
    }
    const hsvValues = rgbToHsv({ r: this._r, g: this._g, b: this._b });
    const h = this._h_hsv ?? hsvValues.h;
    const v = this._v_hsv ?? hsvValues.v;
    return this.hsv(h, value2, v);
  }
  function value(v) {
    if (v === void 0) {
      if (this._v_hsv !== void 0) return Math.round(this._v_hsv);
      const hsvValues2 = rgbToHsv({ r: this._r, g: this._g, b: this._b });
      return round(hsvValues2.v);
    }
    const hsvValues = rgbToHsv({ r: this._r, g: this._g, b: this._b });
    const h = this._h_hsv ?? hsvValues.h;
    const s = this._s_hsv ?? hsvValues.s;
    return this.hsv(h, s, v);
  }
  function cyan(c) {
    if (c === void 0) {
      if (this._c_cmyk !== void 0) return Math.round(this._c_cmyk);
      return round(rgbToCmyk({ r: this._r, g: this._g, b: this._b }).c);
    }
    const cmykVal = rgbToCmyk({ r: this._r, g: this._g, b: this._b });
    const m = this._m_cmyk ?? cmykVal.m;
    const y = this._y_cmyk ?? cmykVal.y;
    const k = this._k_cmyk ?? cmykVal.k;
    return this.cmyk(c, m, y, k);
  }
  function magenta(m) {
    if (m === void 0) {
      if (this._m_cmyk !== void 0) return Math.round(this._m_cmyk);
      return round(rgbToCmyk({ r: this._r, g: this._g, b: this._b }).m);
    }
    const cmykVal = rgbToCmyk({ r: this._r, g: this._g, b: this._b });
    const c = this._c_cmyk ?? cmykVal.c;
    const y = this._y_cmyk ?? cmykVal.y;
    const k = this._k_cmyk ?? cmykVal.k;
    return this.cmyk(c, m, y, k);
  }
  function yellow(y) {
    if (y === void 0) {
      if (this._y_cmyk !== void 0) return Math.round(this._y_cmyk);
      return round(rgbToCmyk({ r: this._r, g: this._g, b: this._b }).y);
    }
    const cmykVal = rgbToCmyk({ r: this._r, g: this._g, b: this._b });
    const c = this._c_cmyk ?? cmykVal.c;
    const m = this._m_cmyk ?? cmykVal.m;
    const k = this._k_cmyk ?? cmykVal.k;
    return this.cmyk(c, m, y, k);
  }
  function black(k) {
    if (k === void 0) {
      if (this._k_cmyk !== void 0) return Math.round(this._k_cmyk);
      return round(rgbToCmyk({ r: this._r, g: this._g, b: this._b }).k);
    }
    const cmykVal = rgbToCmyk({ r: this._r, g: this._g, b: this._b });
    const c = this._c_cmyk ?? cmykVal.c;
    const m = this._m_cmyk ?? cmykVal.m;
    const y = this._y_cmyk ?? cmykVal.y;
    return this.cmyk(c, m, y, k);
  }
  function white(w) {
    if (w === void 0) {
      if (this._w_hwb !== void 0) return Math.round(this._w_hwb);
      return round(toHwb({ r: this._r, g: this._g, b: this._b }).w);
    }
    const hwbValues = toHwb({ r: this._r, g: this._g, b: this._b });
    const h = this._h_hwb ?? hwbValues.h;
    const b = this._b_hwb ?? hwbValues.b;
    return this.hwb(h, w, b);
  }
  function wblack(b) {
    if (b === void 0) {
      if (this._b_hwb !== void 0) return Math.round(this._b_hwb);
      return round(toHwb({ r: this._r, g: this._g, b: this._b }).b);
    }
    const hwbValues = toHwb({ r: this._r, g: this._g, b: this._b });
    const h = this._h_hwb ?? hwbValues.h;
    const w = this._w_hwb ?? hwbValues.w;
    return this.hwb(h, w, b);
  }
  function ansi256(value2) {
    if (value2 === void 0) {
      const r = Math.floor(this._r / 51);
      const g = Math.floor(this._g / 51);
      const b = Math.floor(this._b / 51);
      const ansi = 16 + 36 * r + 6 * g + b;
      return ColorSpaceWrapper.create({ ansi256: ansi }, "ansi256", this);
    }
    return this;
  }
  function ansi16(value2) {
    if (value2 === void 0) {
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
    const r = round(this._r / 255 * 100);
    const g = round(this._g / 255 * 100);
    const b = round(this._b / 255 * 100);
    if (this._A !== 1) return `rgba(${r}%, ${g}%, ${b}%, ${this._A})`;
    return `rgb(${r}%, ${g}%, ${b}%)`;
  }
  function rgbNumber() {
    return (round(this._r) << 16) + (round(this._g) << 8) + round(this._b);
  }
  var setters = {
    red,
    green,
    blue,
    alpha,
    hue,
    saturationl,
    lightness,
    saturationv,
    value,
    white,
    wblack,
    cyan,
    magenta,
    yellow,
    black,
    hex,
    hexa,
    rgb,
    hsl,
    hwb,
    hsv,
    cmyk,
    ansi256,
    ansi16,
    array,
    unitArray,
    percentString,
    rgbNumber
  };
  var getters = {
    red,
    green,
    blue,
    alpha,
    hue,
    saturationl,
    lightness,
    saturationv,
    value,
    white,
    wblack,
    cyan,
    magenta,
    yellow,
    black,
    hex,
    hexa,
    rgb,
    hsl,
    hwb,
    hsv,
    cmyk,
    array,
    unitArray,
    percentString,
    rgbNumber
  };
  var models_default = { getters, setters };

  // src/named-colors.ts
  var namedColors = {
    white: [255, 255, 255],
    black: [0, 0, 0],
    red: [255, 0, 0],
    green: [0, 128, 0],
    blue: [0, 0, 255],
    orange: [255, 165, 0],
    grey: [128, 128, 128],
    yellow: [255, 255, 0],
    magenta: [255, 0, 255],
    yellowgreen: [154, 205, 50],
    silver: [192, 192, 192],
    lime: [0, 255, 0],
    purple: [128, 0, 128],
    tomato: [255, 99, 71],
    turquoise: [64, 224, 208],
    coral: [255, 127, 80],
    cyan: [0, 255, 255],
    floralwhite: [255, 250, 240],
    pink: [255, 192, 203],
    forestgreen: [34, 139, 34],
    beige: [245, 245, 220],
    fuchsia: [255, 0, 255],
    gainsboro: [220, 220, 220],
    ghostwhite: [248, 248, 255],
    gold: [255, 215, 0],
    goldenrod: [218, 165, 32],
    greenyellow: [173, 255, 47],
    violet: [238, 130, 238],
    wheat: [245, 222, 179],
    whitesmoke: [245, 245, 245],
    darkred: [139, 0, 0],
    aliceblue: [240, 248, 255],
    indianred: [205, 92, 92],
    indigo: [75, 0, 130],
    antiquewhite: [250, 235, 215],
    aqua: [0, 255, 255],
    aquamarine: [127, 255, 212],
    azure: [240, 255, 255],
    bisque: [255, 228, 196],
    blanchedalmond: [255, 235, 205],
    blueviolet: [138, 43, 226],
    brown: [165, 42, 42],
    burlywood: [222, 184, 135],
    cadetblue: [95, 158, 160],
    chartreuse: [127, 255, 0],
    chocolate: [210, 105, 30],
    cornflowerblue: [100, 149, 237],
    cornsilk: [255, 248, 220],
    crimson: [220, 20, 60],
    darkblue: [0, 0, 139],
    darkcyan: [0, 139, 139],
    darkgoldenrod: [184, 134, 11],
    darkgrey: [169, 169, 169],
    darkgreen: [0, 100, 0],
    darkkhaki: [189, 183, 107],
    darkmagenta: [139, 0, 139],
    darkolivegreen: [85, 107, 47],
    darkorange: [255, 140, 0],
    darkorchid: [153, 50, 204],
    darksalmon: [233, 150, 122],
    darkseagreen: [143, 188, 143],
    darkslateblue: [72, 61, 139],
    darkslategrey: [47, 79, 79],
    darkturquoise: [0, 206, 209],
    darkviolet: [148, 0, 211],
    deeppink: [255, 20, 147],
    deepskyblue: [0, 191, 255],
    dimgrey: [105, 105, 105],
    dodgerblue: [30, 144, 255],
    firebrick: [178, 34, 34],
    honeydew: [240, 255, 240],
    hotpink: [255, 105, 180],
    ivory: [255, 255, 240],
    khaki: [240, 230, 140],
    lavender: [230, 230, 250],
    lavenderblush: [255, 240, 245],
    lawngreen: [124, 252, 0],
    lemonchiffon: [255, 250, 205],
    lightblue: [173, 216, 230],
    lightcoral: [240, 128, 128],
    lightcyan: [224, 255, 255],
    lightgoldenrodyellow: [250, 250, 210],
    lightgreen: [144, 238, 144],
    lightgrey: [211, 211, 211],
    lightpink: [255, 182, 193],
    lightsalmon: [255, 160, 122],
    lightseagreen: [32, 178, 170],
    lightskyblue: [135, 206, 250],
    lightslategrey: [119, 136, 153],
    lightsteelblue: [176, 196, 222],
    lightyellow: [255, 255, 224],
    limegreen: [50, 205, 50],
    linen: [250, 240, 230],
    maroon: [128, 0, 0],
    mediumaquamarine: [102, 205, 170],
    mediumblue: [0, 0, 205],
    mediumorchid: [186, 85, 211],
    mediumpurple: [147, 112, 219],
    mediumseagreen: [60, 179, 113],
    mediumslateblue: [123, 104, 238],
    mediumspringgreen: [0, 250, 154],
    mediumturquoise: [72, 209, 204],
    mediumvioletred: [199, 21, 133],
    midnightblue: [25, 25, 112],
    mintcream: [245, 255, 250],
    mistyrose: [255, 228, 225],
    moccasin: [255, 228, 181],
    navajowhite: [255, 222, 173],
    navy: [0, 0, 128],
    oldlace: [253, 245, 230],
    olive: [128, 128, 0],
    olivedrab: [107, 142, 35],
    orangered: [255, 69, 0],
    orchid: [218, 112, 214],
    palegoldenrod: [238, 232, 170],
    palegreen: [152, 251, 152],
    paleturquoise: [175, 238, 238],
    palevioletred: [219, 112, 147],
    papayawhip: [255, 239, 213],
    peachpuff: [255, 218, 185],
    peru: [205, 133, 63],
    plum: [221, 160, 221],
    powderblue: [176, 224, 230],
    rebeccapurple: [102, 51, 153],
    rosybrown: [188, 143, 143],
    royalblue: [65, 105, 225],
    saddlebrown: [139, 69, 19],
    salmon: [250, 128, 114],
    sandybrown: [244, 164, 96],
    seagreen: [46, 139, 87],
    seashell: [255, 245, 238],
    sienna: [160, 82, 45],
    skyblue: [135, 206, 235],
    slateblue: [106, 90, 205],
    slategrey: [112, 128, 144],
    snow: [255, 250, 250],
    springgreen: [0, 255, 127],
    steelblue: [70, 130, 180],
    tan: [210, 180, 140],
    teal: [0, 128, 128],
    thistle: [216, 191, 216]
  };
  var named_colors_default = namedColors;

  // src/modifiers.ts
  function cloneColor(color) {
    const cloned = new Color();
    cloned._r = color._r;
    cloned._g = color._g;
    cloned._b = color._b;
    cloned._A = color._A;
    if (color._h_hsl !== void 0) cloned._h_hsl = color._h_hsl;
    if (color._s_hsl !== void 0) cloned._s_hsl = color._s_hsl;
    if (color._l_hsl !== void 0) cloned._l_hsl = color._l_hsl;
    if (color._h_hsv !== void 0) cloned._h_hsv = color._h_hsv;
    if (color._s_hsv !== void 0) cloned._s_hsv = color._s_hsv;
    if (color._v_hsv !== void 0) cloned._v_hsv = color._v_hsv;
    if (color._h_hwb !== void 0) cloned._h_hwb = color._h_hwb;
    if (color._w_hwb !== void 0) cloned._w_hwb = color._w_hwb;
    if (color._b_hwb !== void 0) cloned._b_hwb = color._b_hwb;
    if (color._c_cmyk !== void 0) cloned._c_cmyk = color._c_cmyk;
    if (color._m_cmyk !== void 0) cloned._m_cmyk = color._m_cmyk;
    if (color._y_cmyk !== void 0) cloned._y_cmyk = color._y_cmyk;
    if (color._k_cmyk !== void 0) cloned._k_cmyk = color._k_cmyk;
    cloned.model = color.model;
    return cloned;
  }
  function reddish(value2) {
    const clone = cloneColor(this);
    clone._r = value2;
    return clone;
  }
  function bluish(value2) {
    const clone = cloneColor(this);
    clone._b = value2;
    return clone;
  }
  function greenish(value2) {
    const clone = cloneColor(this);
    clone._g = value2;
    return clone;
  }
  function invert() {
    const clone = cloneColor(this);
    clone._r = 255 - clone._r;
    clone._g = 255 - clone._g;
    clone._b = 255 - clone._b;
    return clone;
  }
  function negate() {
    const clone = cloneColor(this);
    clone._r = 255 - clone._r;
    clone._g = 255 - clone._g;
    clone._b = 255 - clone._b;
    return clone;
  }
  function lighten(amount) {
    const hslValues = rgbToHsl({ r: this._r, g: this._g, b: this._b });
    const h = this._h_hsl ?? hslValues.h;
    const s = this._s_hsl ?? hslValues.s;
    let l = this._l_hsl ?? hslValues.l;
    l += l * amount;
    l = Math.min(100, l);
    return this.hsl(h, s, l);
  }
  function darken(amount) {
    const hslValues = rgbToHsl({ r: this._r, g: this._g, b: this._b });
    const h = this._h_hsl ?? hslValues.h;
    const s = this._s_hsl ?? hslValues.s;
    let l = this._l_hsl ?? hslValues.l;
    l -= l * amount;
    l = Math.max(0, l);
    return this.hsl(h, s, l);
  }
  function darkness(value2) {
    return this.darken(value2);
  }
  function saturate(ratio) {
    const hslValues = rgbToHsl({ r: this._r, g: this._g, b: this._b });
    const h = this._h_hsl ?? hslValues.h;
    let s = this._s_hsl ?? hslValues.s;
    const l = this._l_hsl ?? hslValues.l;
    s += s * ratio;
    s = Math.min(100, s);
    return this.hsl(h, s, l);
  }
  function desaturate(ratio) {
    const hslValues = rgbToHsl({ r: this._r, g: this._g, b: this._b });
    const h = this._h_hsl ?? hslValues.h;
    let s = this._s_hsl ?? hslValues.s;
    const l = this._l_hsl ?? hslValues.l;
    s = Math.max(0, s - s * ratio);
    return this.hsl(h, s, l);
  }
  function grayscale() {
    const clone = cloneColor(this);
    const value2 = clone._r * 0.299 + clone._g * 0.587 + clone._b * 0.114;
    clone._r = Math.round(value2);
    clone._g = Math.round(value2);
    clone._b = Math.round(value2);
    return clone;
  }
  function whiten(amount) {
    const hwbValues = toHwb({ r: this._r, g: this._g, b: this._b });
    const h = this._h_hwb ?? hwbValues.h;
    let w = this._w_hwb ?? hwbValues.w;
    const b = this._b_hwb ?? hwbValues.b;
    w += w * amount;
    w = Math.min(100, w);
    return this.hwb(h, w, b);
  }
  function blacken(amount) {
    const hwbValues = toHwb({ r: this._r, g: this._g, b: this._b });
    const h = this._h_hwb ?? hwbValues.h;
    const w = this._w_hwb ?? hwbValues.w;
    let b = this._b_hwb ?? hwbValues.b;
    b += b * amount;
    b = Math.min(100, b);
    return this.hwb(h, w, b);
  }
  function fade(ratio) {
    const clone = cloneColor(this);
    clone._A = Math.max(0, clone._A - clone._A * ratio);
    return clone;
  }
  function opaquer(ratio) {
    const clone = cloneColor(this);
    clone._A = Math.min(1, clone._A + clone._A * ratio);
    return clone;
  }
  function clearer(ratio) {
    const clone = cloneColor(this);
    clone._A = Math.max(0, clone._A - ratio);
    return clone;
  }
  function rotate(degrees) {
    const hslValues = rgbToHsl({ r: this._r, g: this._g, b: this._b });
    let h = this._h_hsl ?? hslValues.h;
    const s = this._s_hsl ?? hslValues.s;
    const l = this._l_hsl ?? hslValues.l;
    h = (h + degrees) % 360;
    if (h < 0) h += 360;
    return this.hsl(h, s, l);
  }
  function mix(mixColor, weight = 0.5) {
    if (!mixColor || typeof mixColor !== "object" || mixColor._r === void 0 || mixColor._g === void 0 || mixColor._b === void 0) {
      throw new Error(
        'Argument to "mix" was not a Color instance, but rather an instance of ' + (mixColor ? mixColor.constructor.name : typeof mixColor)
      );
    }
    const p = weight === void 0 ? 0.5 : weight;
    const p1 = 1 - p;
    const w = 2 * p1 - 1;
    const a = this._A - mixColor._A;
    const w1 = ((w * a === -1 ? w : (w + a) / (1 + w * a)) + 1) / 2;
    const w2 = 1 - w1;
    const clone = cloneColor(this);
    clone._r = w1 * this._r + w2 * mixColor._r;
    clone._g = w1 * this._g + w2 * mixColor._g;
    clone._b = w1 * this._b + w2 * mixColor._b;
    clone._A = mixColor._A * p + this._A * (1 - p);
    return clone;
  }
  function isDark() {
    const { _r: r, _g: g, _b: b } = this;
    const brightness = (r * 299 + g * 587 + b * 114) / 1e3;
    return brightness <= 128;
  }
  function isLight() {
    const { _r: r, _g: g, _b: b } = this;
    const brightness = (r * 299 + g * 587 + b * 114) / 1e3;
    return brightness > 128;
  }
  function luminosity() {
    const rsRGB = this._r / 255;
    const gsRGB = this._g / 255;
    const bsRGB = this._b / 255;
    const r = rsRGB <= 0.03928 ? rsRGB / 12.92 : ((rsRGB + 0.055) / 1.055) ** 2.4;
    const g = gsRGB <= 0.03928 ? gsRGB / 12.92 : ((gsRGB + 0.055) / 1.055) ** 2.4;
    const b = bsRGB <= 0.03928 ? bsRGB / 12.92 : ((bsRGB + 0.055) / 1.055) ** 2.4;
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  }
  function contrast(color2) {
    const lum1 = this.luminosity();
    const rsRGB2 = color2._r / 255;
    const gsRGB2 = color2._g / 255;
    const bsRGB2 = color2._b / 255;
    const r2 = rsRGB2 <= 0.03928 ? rsRGB2 / 12.92 : ((rsRGB2 + 0.055) / 1.055) ** 2.4;
    const g2 = gsRGB2 <= 0.03928 ? gsRGB2 / 12.92 : ((gsRGB2 + 0.055) / 1.055) ** 2.4;
    const b2 = bsRGB2 <= 0.03928 ? bsRGB2 / 12.92 : ((bsRGB2 + 0.055) / 1.055) ** 2.4;
    const lum2 = 0.2126 * r2 + 0.7152 * g2 + 0.0722 * b2;
    const brightest = Math.max(lum1, lum2);
    const darkest = Math.min(lum1, lum2);
    return (brightest + 0.05) / (darkest + 0.05);
  }
  function level(color2) {
    const contrastRatio = this.contrast(color2);
    if (contrastRatio >= 7) return "AAA";
    if (contrastRatio >= 4.5) return "AA";
    return "";
  }
  function keyword() {
    const { _r: r, _g: g, _b: b } = this;
    const rr = Math.round(r);
    const rg = Math.round(g);
    const rb = Math.round(b);
    for (const key of Object.keys(named_colors_default)) {
      const val = named_colors_default[key];
      if (val[0] === rr && val[1] === rg && val[2] === rb) {
        return key;
      }
    }
    return void 0;
  }
  function lum() {
    return this.luminosity();
  }
  var modifiers_default = {
    reddish,
    bluish,
    greenish,
    invert,
    negate,
    lighten,
    darken,
    darkness,
    saturate,
    desaturate,
    grayscale,
    whiten,
    blacken,
    fade,
    opaquer,
    clearer,
    rotate,
    mix,
    isDark,
    isLight,
    luminosity,
    contrast,
    level,
    keyword,
    lum
  };

  // src/color-utils/lab.ts
  function fromLab(colorSet) {
    const [L, a, b] = colorSet;
    return labToXyz(Number(L), Number(a), Number(b));
  }
  function labToXyz(L, a, b) {
    const fy = (L + 16) / 116;
    const fx = a / 500 + fy;
    const fz = fy - b / 200;
    const x = fx ** 3 > 8856e-6 ? fx ** 3 : (116 * fx - 16) / 903.3;
    const y = fy ** 3 > 8856e-6 ? fy ** 3 : (116 * fy - 16) / 903.3;
    const z = fz ** 3 > 8856e-6 ? fz ** 3 : (116 * fz - 16) / 903.3;
    return { x: x * 95.047, y: y * 100, z: z * 108.883 };
  }
  function fromOklab([l, a, b]) {
    return { l: Number(l), a: Number(a), b: Number(b) };
  }
  var kE = 216 / 24389;
  var kK = 24389 / 27;

  // src/color-utils/xyz.ts
  function fromXyz([x, y, z]) {
    const [xn, yn, zn] = [x, y, z].map((v) => Number(v));
    const r = xn * 3.2404542 + yn * -1.5371385 + zn * -0.4985314;
    const g = xn * -0.969266 + yn * 1.8760108 + zn * 0.041556;
    const b = xn * 0.0556434 + yn * -0.2040259 + zn * 1.0572252;
    let R = r / 100;
    let G = g / 100;
    let B = b / 100;
    R = R > 31308e-7 ? 1.055 * R ** (1 / 2.4) - 0.055 : R * 12.92;
    G = G > 31308e-7 ? 1.055 * G ** (1 / 2.4) - 0.055 : G * 12.92;
    B = B > 31308e-7 ? 1.055 * B ** (1 / 2.4) - 0.055 : B * 12.92;
    R = Math.min(Math.max(0, R), 1);
    G = Math.min(Math.max(0, G), 1);
    B = Math.min(Math.max(0, B), 1);
    return { r: R * 255, g: G * 255, b: B * 255 };
  }

  // src/color-utils/lch.ts
  function lchToLab({ l, c, h }) {
    const hRad = h * (Math.PI / 180);
    return {
      l,
      a: c * Math.cos(hRad),
      b: c * Math.sin(hRad)
    };
  }
  function lchToRgb({ l, c, h }) {
    const lab = lchToLab({ l, c, h });
    const y = (lab.l + 16) / 116;
    const x = lab.a / 500 + y;
    const z = y - lab.b / 200;
    const x3 = x ** 3;
    const y3 = y ** 3;
    const z3 = z ** 3;
    const xr = x3 > 8856e-6 ? x3 : (x - 16 / 116) / 7.787;
    const yr = y3 > 8856e-6 ? y3 : (y - 16 / 116) / 7.787;
    const zr = z3 > 8856e-6 ? z3 : (z - 16 / 116) / 7.787;
    const X = xr * 95.047;
    const Y = yr * 100;
    const Z = zr * 108.883;
    let r = X * 3.2404542 + Y * -1.5371385 + Z * -0.4985314;
    let g = X * -0.969266 + Y * 1.8760108 + Z * 0.041556;
    let b_ = X * 0.0556434 + Y * -0.2040259 + Z * 1.0572252;
    r /= 100;
    g /= 100;
    b_ /= 100;
    r = r > 31308e-7 ? 1.055 * r ** (1 / 2.4) - 0.055 : r * 12.92;
    g = g > 31308e-7 ? 1.055 * g ** (1 / 2.4) - 0.055 : g * 12.92;
    b_ = b_ > 31308e-7 ? 1.055 * b_ ** (1 / 2.4) - 0.055 : b_ * 12.92;
    return {
      r: Math.max(0, Math.min(255, Math.round(r * 255))),
      g: Math.max(0, Math.min(255, Math.round(g * 255))),
      b: Math.max(0, Math.min(255, Math.round(b_ * 255)))
    };
  }
  function fromLch([l, c, h, alpha2 = "1"]) {
    const rgb2 = lchToRgb({
      l: Number(l),
      c: Number(c),
      h: Number(h)
    });
    return {
      ...rgb2,
      A: Number(alpha2)
    };
  }
  function fromOklch([l, c, h, alpha2 = "1"]) {
    const rgb2 = lchToRgb({
      l: Number(l) * 100,
      // Scale 0-1 to 0-100
      c: Number(c),
      h: Number(h)
    });
    return {
      ...rgb2,
      A: Number(alpha2)
    };
  }

  // src/color-utils/rgb.ts
  function fromRgb([r = 0, g = 0, b = 0, alpha2 = 1]) {
    return {
      r: safeInt(r),
      g: safeInt(g),
      b: safeInt(b),
      A: normalizeAlpha(alpha2)
    };
  }

  // src/parsers-utils.ts
  function parseHex(value2) {
    const hexColor = value2.substring(1);
    let hexArray = [];
    if (hexColor) {
      if (hexColor.length === 3 || hexColor.length === 4) {
        hexArray = shortHexToLongHex(hexColor);
      } else if (hexColor.length === 6 || hexColor.length === 8) {
        hexArray = (hexColor.match(/../g) || []).map((value3) => value3);
      }
    }
    if (hexArray.length) {
      hexArray?.forEach((value3, index) => {
        if (isHex(value3)) {
          hexArray[index] = value3.toUpperCase();
        } else {
          console.warn(`Invalid Hex length in index ${index}: ${value3}`);
        }
      });
      return hexArray;
    }
    console.warn(`Invalid Hex: ${value2}`);
    return fallbackColor(hexArray);
  }
  function extract(colorString) {
    const colorValue = cleanDefinition(colorString);
    let values = splitValues(colorValue);
    if (values.length !== 3 && values.length !== 4) {
      values = fallbackColor(values);
    }
    return values;
  }
  function fallbackColor(color, err = "Invalid color") {
    console.warn(err);
    return [color[0] ?? "0", color[1] ?? "0", color[2] ?? "0"];
  }

  // src/validators.ts
  var validators = {
    hex: /^#([\da-f]{3,8})/i,
    rgb: /^rgba?\(([^)]+)\)/i,
    hsl: /^hsla?\(([^)]+)\)/i,
    lab: /^lab\(([^)]+)\)/i,
    hwb: /^hwb\(([^)]+)\)/i,
    lch: /^lch\(([^)]+)\)/i,
    oklab: /^oklab\(([^)]+)\)/i,
    oklch: /^oklch\(([^)]+)\)/i,
    xyz: /^xyz\(([^)]+)\)/i,
    cmyk: /^cmyk\(([^)]+)\)/i,
    color: /^color\(([^)]+)\)/i
  };
  var validators_default = validators;

  // src/parsers.ts
  var parsers = [
    {
      model: "hex",
      regex: validators_default.hex,
      parser: parseHex,
      converter: fromHex
    },
    { model: "rgb", regex: validators_default.rgb, parser: extract, converter: fromRgb },
    { model: "hsl", regex: validators_default.hsl, parser: extract, converter: fromHsl },
    { model: "lab", regex: validators_default.lab, parser: extract, converter: fromLab },
    { model: "hwb", regex: validators_default.hwb, parser: extract, converter: fromHwb },
    { model: "xyz", regex: validators_default.xyz, parser: extract, converter: fromXyz },
    { model: "lch", regex: validators_default.lch, parser: extract, converter: fromLch },
    {
      model: "oklab",
      regex: validators_default.oklab,
      parser: extract,
      converter: fromOklab
    },
    {
      model: "oklch",
      regex: validators_default.oklch,
      parser: extract,
      converter: fromOklch
    },
    {
      model: "cmyk",
      regex: validators_default.cmyk,
      parser: extract,
      converter: fromCmyk
    },
    {
      model: "color",
      regex: validators_default.color,
      parser: extract,
      converter: fromColor
    }
  ];
  var parsers_default = parsers;

  // src/index.ts
  var Color = class _Color {
    _r = 0;
    _g = 0;
    _b = 0;
    _A = 1;
    _h_hsl;
    _s_hsl;
    _l_hsl;
    _h_hsv;
    _s_hsv;
    _v_hsv;
    _h_hwb;
    _w_hwb;
    _b_hwb;
    _c_cmyk;
    _m_cmyk;
    _y_cmyk;
    _k_cmyk;
    model = "rgba";
    // Static declarations
    static rgb;
    static hsl;
    static hwb;
    static hsv;
    static cmyk;
    static hex;
    static random;
    /**
     * Color constructor function for the Color class that initializes the color object based on the provided arguments.
     *
     * @param {number | string | {r?: number, g?: number, b?: number, a?: number, h?: number, s?: number, l?: number} | number[]| string[]} x - The first color argument for the color
     * @param {number=} y - The second color argument for the color
     * @param {number=} z - The third color argument for the color
     * @param {number=} a - The alpha color argument for the color
     */
    constructor(x, y, z, a = 1) {
      if (x !== void 0 && x !== null) {
        if (x instanceof _Color) {
          this.fromObject(x);
        } else if (typeof x !== "object") {
          if (z !== void 0) {
            this.fromArray([x, y, z, a]);
          } else if (typeof x === "string") {
            const color = this.fromString(x, y);
            this.fromObject(color);
          } else if (typeof x === "number") {
            this.fromValue(x, y);
          }
        } else if (Array.isArray(x)) {
          this.fromArray(x, y ?? "rgba");
        } else if (typeof x === "object") {
          this.fromObject(x);
        }
      }
    }
    fromObject(color) {
      if (color instanceof _Color) {
        this._r = color._r;
        this._g = color._g;
        this._b = color._b;
        this._A = color._A;
        if (color._h_hsl !== void 0) this._h_hsl = color._h_hsl;
        if (color._s_hsl !== void 0) this._s_hsl = color._s_hsl;
        if (color._l_hsl !== void 0) this._l_hsl = color._l_hsl;
        if (color._h_hsv !== void 0) this._h_hsv = color._h_hsv;
        if (color._s_hsv !== void 0) this._s_hsv = color._s_hsv;
        if (color._v_hsv !== void 0) this._v_hsv = color._v_hsv;
        if (color._h_hwb !== void 0) this._h_hwb = color._h_hwb;
        if (color._w_hwb !== void 0) this._w_hwb = color._w_hwb;
        if (color._b_hwb !== void 0) this._b_hwb = color._b_hwb;
        if (color._c_cmyk !== void 0) this._c_cmyk = color._c_cmyk;
        if (color._m_cmyk !== void 0) this._m_cmyk = color._m_cmyk;
        if (color._y_cmyk !== void 0) this._y_cmyk = color._y_cmyk;
        if (color._k_cmyk !== void 0) this._k_cmyk = color._k_cmyk;
        return this;
      }
      const keys = Object.keys(color);
      if (keys.length === 0) {
        throw new Error("Unable to parse color from object");
      }
      if ("h" in color && "s" in color && "l" in color) {
        const h = Number(color.h);
        const s = Number(color.s);
        const l = Number(color.l);
        const rgb2 = hslToRgb({ h, s, l });
        this._r = rgb2.r;
        this._g = rgb2.g;
        this._b = rgb2.b;
        this._A = Math.max(0, Math.min(1, "a" in color || "A" in color || "alpha" in color ? Number(color.a || color.A || color.alpha) : 1));
        this._h_hsl = h;
        this._s_hsl = s;
        this._l_hsl = l;
        return this;
      }
      if ("h" in color && "w" in color && "b" in color) {
        const h = Number(color.h);
        const w = Number(color.w);
        const b = Number(color.b);
        const rgb2 = hwbToRgb({ h, w, b });
        this._r = rgb2.r;
        this._g = rgb2.g;
        this._b = rgb2.b;
        this._A = Math.max(0, Math.min(1, "a" in color || "A" in color || "alpha" in color ? Number(color.a || color.A || color.alpha) : 1));
        this._h_hwb = h;
        this._w_hwb = w;
        this._b_hwb = b;
        return this;
      }
      if ("h" in color && "s" in color && "v" in color) {
        const h = Number(color.h);
        const s = Number(color.s);
        const v = Number(color.v);
        const rgb2 = hsvToRgb({ h, s, v });
        this._r = rgb2.r;
        this._g = rgb2.g;
        this._b = rgb2.b;
        this._A = Math.max(0, Math.min(1, "a" in color || "A" in color || "alpha" in color ? Number(color.a || color.A || color.alpha) : 1));
        this._h_hsv = h;
        this._s_hsv = s;
        this._v_hsv = v;
        return this;
      }
      if ("c" in color && "m" in color && "y" in color && "k" in color) {
        const c_orig = Number(color.c);
        const m_orig = Number(color.m);
        const y_orig = Number(color.y);
        const k_orig = Number(color.k);
        const c = Math.max(0, Math.min(100, c_orig)) / 100;
        const m = Math.max(0, Math.min(100, m_orig)) / 100;
        const y = Math.max(0, Math.min(100, y_orig)) / 100;
        const k = Math.max(0, Math.min(100, k_orig)) / 100;
        this._r = Math.round((1 - c) * (1 - k) * 255);
        this._g = Math.round((1 - m) * (1 - k) * 255);
        this._b = Math.round((1 - y) * (1 - k) * 255);
        this._A = Math.max(0, Math.min(1, "a" in color || "A" in color || "alpha" in color ? Number(color.a || color.A || color.alpha) : 1));
        this._c_cmyk = c_orig;
        this._m_cmyk = m_orig;
        this._y_cmyk = y_orig;
        this._k_cmyk = k_orig;
        return this;
      }
      const keyMap = {
        r: "_r",
        g: "_g",
        b: "_b",
        a: "_A",
        A: "_A",
        alpha: "_A",
        h: "_h_hsl",
        s: "_s_hsl",
        l: "_l_hsl",
        w: "_w_hwb",
        v: "_v_hsv",
        c: "_c_cmyk",
        m: "_m_cmyk",
        y: "_y_cmyk",
        k: "_k_cmyk"
      };
      let hasValidKey = false;
      for (const key of keys) {
        const internalKey = keyMap[key];
        if (internalKey) {
          hasValidKey = true;
          const value2 = color[key];
          if (internalKey === "_A") {
            const rawAlpha = typeof value2 === "number" ? value2 : Number(value2);
            this[internalKey] = Math.max(0, Math.min(1, rawAlpha));
          } else {
            this[internalKey] = safeInt(value2);
          }
        }
      }
      if (!hasValidKey) {
        throw new Error("Unable to parse color from object");
      }
      return this;
    }
    /**
     * Parses a color array in the model [r, g, b, a] and returns an object with r, g, b, and a properties.
     *
     * @param rgbArray the color array
     * @param model
     * @param parse parse the color and transform data types (i.e. percent, degrees) into numbers
     *
     * @return the color object
     */
    fromArray(rgbArray, model = "rgba", parse = false) {
      const keyMap = {
        r: "_r",
        g: "_g",
        b: "_b",
        a: "_A",
        A: "_A",
        h: "_h",
        s: "_s",
        l: "_l",
        x: "_x",
        y: "_y",
        z: "_z",
        c: "_c",
        m: "_m",
        k: "_k"
      };
      for (const i in model.split("")) {
        const channel = model[i];
        const internalKey = keyMap[channel];
        if (internalKey && internalKey in this) {
          const value2 = rgbArray[i];
          if (internalKey === "_A") {
            const rawAlpha = value2 !== void 0 ? typeof value2 === "number" ? value2 : Number(value2) : 1;
            this[internalKey] = Math.max(0, Math.min(1, rawAlpha));
          } else {
            this[internalKey] = value2 !== void 0 ? parse ? safeInt(value2) : Int(value2) : 0;
          }
        }
      }
      return this;
    }
    /**
     * This function takes a string representing a color (color) and uses regular expressions to check if it matches any of the following FORMAT: hex, hex+alpha, RGBSTRING, RGBA, hslString, or HSLA.
     * If the color string matches one of these FORMAT, the function returns an object with the type of color and the value of the color.
     * If the color string does not match any of the FORMAT, the function throws an error.
     *
     * @param {string} colorString - the color string to test and convert to rgbString values
     * @param {MODEL} model - the model of the color string (e.g. "rgb", "rgba", "hsl", "hsla"...)
     *
     * @return {Object|Error} the object with rgbString values of that color
     */
    fromString(colorString, model) {
      const lowerColorString = colorString.toLowerCase();
      if (named_colors_default[lowerColorString]) {
        const [r, g, b] = named_colors_default[lowerColorString];
        return { r, g, b, A: 1 };
      }
      if (typeof model === "string") {
        if (isModel(model)) {
          this.model = model;
          const mode = parsers_default.find((p) => p.model === model);
          if (!mode) {
            throw new Error(`Unable to parse color from string: ${colorString}`);
          }
          return mode.converter(mode.parser(colorString), model);
        }
        throw new Error(
          `Unable to parse color from string: ${colorString}`
        );
      }
      for (const { model: model2, regex, parser, converter } of parsers_default) {
        if (regex.test(colorString)) {
          const result = parser(colorString);
          return converter(result, model2);
        }
      }
      throw new Error(`Unable to parse color from string: ${colorString}`);
    }
    /**
     * Converts the 16bit color number to the rgb color object representation
     *
     * @param x the 16bit color number
     * @param alpha the alpha value
     */
    fromValue(x, alpha2 = 1) {
      return this.fromArray([x >> 16, x >> 8 & 255, x & 255, alpha2]);
    }
    info() {
      return this;
    }
    toObject(model = "rgb") {
      const current = {};
      const channelMap = {
        r: "_r",
        g: "_g",
        b: "_b",
        a: "_A",
        h: "_h",
        s: "_s",
        l: "_l"
      };
      for (const char of model.split("")) {
        const internalKey = channelMap[char];
        if (internalKey && internalKey in this) {
          current[char] = this[internalKey];
        }
      }
      return current;
    }
    toArray(model = "rgba") {
      const current = [];
      const channelMap = {
        r: "_r",
        g: "_g",
        b: "_b",
        a: "_A",
        h: "_h",
        s: "_s",
        l: "_l"
      };
      for (const char of model.split("")) {
        const internalKey = channelMap[char];
        if (internalKey && internalKey in this) {
          current.push(this[internalKey]);
        }
      }
      return current;
    }
    toJSON() {
      return this.rgb().toJSON();
    }
    toString(model = "rgba") {
      return formatters_default(this, model ?? this.model);
    }
    // Alias for toString() to match original color package API
    string(precision) {
      if (typeof precision === "number") {
        return this.round().toString();
      }
      return this.toString(precision);
    }
    // Alias for toObject() to match original color package API
    object(model = "rgb") {
      return this.toObject(model);
    }
    // Alias for toArray() to match original color package API
    array(model = "rgba") {
      return this.toArray(model);
    }
    // Round all channels to integers
    round() {
      return new _Color({
        r: Math.round(this._r),
        g: Math.round(this._g),
        b: Math.round(this._b),
        a: Math.round(this._A * 100) / 100
      });
    }
    toValue() {
      return (this._r << 16) + (this._g << 8) + this._b;
    }
  };
  Object.assign(Color.prototype, models_default.setters);
  Object.assign(Color.prototype, modifiers_default);
  Color.rgb = function(r, g, b, a) {
    if (Array.isArray(r)) {
      [r, g, b, a] = r;
    } else if (typeof r === "object" && r !== null) {
      const obj = r;
      return new Color({ r: obj.r, g: obj.g, b: obj.b, alpha: obj.alpha ?? obj.a ?? 1 });
    }
    return new Color({ r, g, b, alpha: a ?? 1 });
  };
  Color.hsl = function(h, s, l, a) {
    if (Array.isArray(h)) {
      [h, s, l, a] = h;
    }
    return new Color({ h, s, l, alpha: a ?? 1 });
  };
  Color.hsv = function(h, s, v, a) {
    if (Array.isArray(h)) {
      [h, s, v, a] = h;
    }
    return new Color({ h, s, v, alpha: a ?? 1 });
  };
  Color.hwb = function(h, w, b, a) {
    if (Array.isArray(h)) {
      [h, w, b, a] = h;
    }
    return new Color({ h, w, b, alpha: a ?? 1 });
  };
  Color.cmyk = function(c, m, y, k, a) {
    if (Array.isArray(c)) {
      [c, m, y, k, a] = c;
    }
    return new Color({ c, m, y, k, alpha: a ?? 1 });
  };
  Color.hex = function(hex2) {
    return new Color(hex2);
  };
  Color.random = function() {
    return new Color({
      r: Math.floor(Math.random() * 256),
      g: Math.floor(Math.random() * 256),
      b: Math.floor(Math.random() * 256)
    });
  };
  function ColorFactory(x, y, z, a = 1) {
    return new Color(x, y, z, a);
  }
  ColorFactory.prototype = Color.prototype;
  Object.assign(ColorFactory, Color);
  var index_default = ColorFactory;
  return __toCommonJS(index_exports);
})();
