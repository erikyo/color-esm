var TestEsm = (() => {
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
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

  // poc/index.ts
  var poc_exports = {};
  __export(poc_exports, {
    default: () => poc_default
  });

  // src/color-utils/hsl.ts
  function getHue(c, x, h) {
    if (h < 60)
      return [c, x, 0];
    if (h < 120)
      return [x, c, 0];
    if (h < 180)
      return [0, c, x];
    if (h < 240)
      return [0, x, c];
    if (h < 300)
      return [x, 0, c];
    return [c, 0, x];
  }
  __name(getHue, "getHue");
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
    h = Math.round(h * 60);
    if (h < 0) {
      h += 360;
    }
    l = (cmax + cmin) / 2;
    s = delta === 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));
    s = +(s * 100).toFixed(1);
    l = +(l * 100).toFixed(1);
    return { h, s, l };
  }
  __name(rgbToHsl, "rgbToHsl");
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
  __name(hslToRgb, "hslToRgb");

  // poc/index.ts
  var converters = {
    rgb: {
      channels: ["r", "g", "b"],
      mod: {
        hsl: (current) => rgbToHsl({ r: current._r, g: current._g, b: current._b })
      }
    },
    hsl: {
      channels: ["h", "s", "l"],
      mod: {
        rgb: (current) => hslToRgb({ h: current._h, s: current._s, l: current._l })
      }
    }
  };
  var channels = /* @__PURE__ */ new Set();
  channels.add("A");
  for (const model in converters) {
    for (const chan of converters[model].channels) {
      channels.add(chan);
    }
  }
  var models = Object.keys(converters);
  var modelsWithAlpha = [...models, ...models.map((m) => `${m}a`)];
  var Test = class {
    static {
      __name(this, "Test");
    }
    _r = 0;
    _g = 0;
    _b = 0;
    _h = 0;
    _s = 0;
    _l = 0;
    _A = 1;
    _model = "rgb";
    constructor([r, g, b, a]) {
      this._r = r;
      this._g = g;
      this._b = b;
      this._A = a;
    }
    toString() {
      if (this._model.endsWith("a")) {
        return `rgba(${this._r}, ${this._g}, ${this._b}, ${this._A})`;
      }
      return `rgb(${this._r}, ${this._g}, ${this._b})`;
    }
  };
  for (const channel of channels) {
    const propertyName = `_${channel}`;
    Test.prototype[`${channel}`] = function(value) {
      const currentColorMode = this._model.endsWith("a") ? this._model.slice(0, -1) : this._model;
      if (channel !== "A" && !currentColorMode.split("").includes(channel)) {
        const colorMode = models.find((m) => m.split("").includes(channel));
        const newColor = converters[currentColorMode].mod[colorMode](this);
        for (let i = 0; i < colorMode.length; i++) {
          this[`_${colorMode[i]}`] = newColor[colorMode[i]];
        }
        this._model = `${colorMode}a`;
      }
      if (value !== void 0) {
        this[propertyName] = value;
        return this;
      }
      return this[propertyName];
    };
  }
  for (const model of modelsWithAlpha) {
    let setGet = function(value) {
      let colorMode = model;
      let currentColorMode = this._model;
      if (currentColorMode.endsWith("a")) {
        currentColorMode = currentColorMode.slice(0, -1);
      }
      ;
      const hasAlpha = model.endsWith("a");
      if (hasAlpha) {
        colorMode = model.slice(0, -1);
      }
      if (colorMode !== currentColorMode) {
        const newColor = converters[currentColorMode].mod[colorMode](this);
        for (let i = 0; i < colorMode.length; i++) {
          this[`_${colorMode[i]}`] = newColor[colorMode[i]];
        }
        this._model = model;
      }
      if (value !== void 0) {
        for (let i = 0; i < colorMode.length; i++) {
          this[`_${colorMode[i]}`] = value[i];
        }
        if (hasAlpha) {
          this._A = value[3];
        }
        return this;
      }
      const v = [];
      for (let i = 0; i < colorMode.length; i++) {
        v.push(this[`_${colorMode[i]}`]);
      }
      if (hasAlpha) {
        v.push(this._A);
      }
      return v;
    };
    __name(setGet, "setGet");
    Test.prototype[`${model}`] = setGet;
  }
  Object.assign(Test.prototype, {
    lighten: function(value) {
      if (this._model === "hsl") {
        this._l += value;
      } else {
        this._r += value;
        this._g += value;
        this._b += value;
      }
      return this;
    }
  });
  var poc_default = Test;
  return __toCommonJS(poc_exports);
})();
