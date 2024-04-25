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
    default: () => poc_default,
    formatOptions: () => formatOptions
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

  // src/color-utils/hex.ts
  function toHex(int8, alpha = false) {
    return int8.toString(16).padStart(2, "0");
  }
  __name(toHex, "toHex");

  // poc/index.ts
  function detectAlpha(model) {
    return model.endsWith("a");
  }
  __name(detectAlpha, "detectAlpha");
  function removeAlpha(model) {
    return model.slice(0, -1);
  }
  __name(removeAlpha, "removeAlpha");
  function formatValue(value, channelsValuesArray) {
    const [channel, targetModel] = value.split(":");
    if (channel === "A") {
      return targetModel !== "HEX" ? channelsValuesArray[3].toString() : toHex(Math.round(channelsValuesArray[3] * 255));
    }
    const channelID = Number(channel);
    let newValue = channelsValuesArray[channelID - 1];
    const formatter = formatOptions[targetModel];
    if (formatter?.min && newValue < formatter.min) {
      newValue = formatter.min;
    }
    if (formatter?.max && newValue > formatter.max) {
      newValue = formatter.max;
    }
    if (formatter?.decimalPlaces) {
      newValue = Number(newValue).toFixed(formatter.decimalPlaces);
    }
    if (formatter?.radix && formatter?.radix !== 10) {
      newValue = newValue.toString(formatter.radix);
    }
    return formatter?.suffix !== void 0 ? `${newValue}${formatter.suffix}` : newValue.toString();
  }
  __name(formatValue, "formatValue");
  function extractOptions(input, channelValues) {
    const regex = /\[([^\]]+)\]/g;
    let result = input;
    for (const match of input.matchAll(regex)) {
      const formattedValue = formatValue(match[1], channelValues);
      result = result.replaceAll(match[0], formattedValue);
    }
    return result;
  }
  __name(extractOptions, "extractOptions");
  var formatOptions = {
    INT8: {
      min: 0,
      max: 255,
      decimalPlaces: 0
    },
    HEX: {
      radix: 16,
      min: 0,
      max: 255,
      decimalPlaces: 0
    },
    NORMALIZED: {
      min: 0,
      max: 1,
      decimalPlaces: 4
    },
    float16: {
      min: 0,
      max: 100,
      decimalPlaces: 2
    },
    PERCENT: {
      min: 0,
      max: 100,
      suffix: "%",
      decimalPlaces: 0
    },
    DEGREE: {
      min: 0,
      max: 360,
      suffix: "deg",
      decimalPlaces: 0
    }
  };
  var formats = {
    hex: "#[1:HEX][2:HEX][3:HEX]",
    hexAlpha: "#[1:HEX][2:HEX][3:HEX][A:HEX]",
    default: "[1:INT8], [2:INT8], [3:INT8]",
    defaultAlpha: "[1:INT8], [2:INT8], [3:INT8], [A:NORMALIZED]",
    hsl: "[1:DEGREE], [2:PERCENT], [3:PERCENT]",
    hslAlpha: "[1:DEGREE], [2:PERCENT], [3:PERCENT], [A:NORMALIZED]",
    modern: "[1:DEGREE] [2:PERCENT] [3:PERCENT]",
    modernAlpha: "[1:DEGREE] [2:PERCENT] [3:PERCENT] / [A:NORMALIZED]"
  };
  var converters = {
    hex: {
      channels: ["r", "g", "b"],
      format: {
        default: formats.hex,
        alpha: formats.hexAlpha
      }
    },
    rgb: {
      channels: ["r", "g", "b"],
      mod: {
        hsl: (current) => rgbToHsl({ r: current._r, g: current._g, b: current._b })
      },
      format: {
        default: formats.default,
        alpha: formats.defaultAlpha
      }
    },
    hsl: {
      channels: ["h", "s", "l"],
      mod: {
        rgb: (current) => hslToRgb({ h: current._h, s: current._s, l: current._l })
      },
      format: {
        default: formats.hsl,
        alpha: formats.hslAlpha
      }
    }
  };
  var channels = /* @__PURE__ */ new Set();
  channels.add("A");
  for (const model in converters) {
    for (const currentChannel of converters[model].channels) {
      channels.add(currentChannel);
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
    _alphaEnabled = true;
    constructor([r, g, b, a]) {
      this._r = r;
      this._g = g;
      this._b = b;
      this._A = a;
    }
    getModelByChannel(channel) {
      for (const model of Object.keys(converters)) {
        if (converters[model].channels.includes(channel)) {
          return model;
        }
      }
      throw new Error(`Channel ${channel} not found in models`);
    }
    getFullModel() {
      return !this._alphaEnabled ? this._model : `${this._model}a`;
    }
    getChannelValues() {
      const channelValues = converters[this._model].channels.map((channel) => {
        return this[`_${channel}`];
      });
      if (this._alphaEnabled) {
        channelValues.push(this._A);
      }
      return channelValues;
    }
    toString() {
      const format = converters[this._model].format[this._alphaEnabled ? "alpha" : "default"];
      const colorMode = this.getFullModel();
      const channelValues = this.getChannelValues();
      if (this._model === "hex") {
        return extractOptions(format, channelValues);
      }
      return `${colorMode}(${extractOptions(format, channelValues)})`;
    }
  };
  for (const channel of channels) {
    const propertyName = `_${channel}`;
    Test.prototype[`${channel}`] = function(value) {
      if (channel !== "A" && !converters[this._model].channels.includes(channel)) {
        const colorMode = this.getModelByChannel(channel);
        const newColor = converters[this._model].mod[colorMode](this);
        for (let i = 0; i < colorMode.length; i++) {
          this[`_${colorMode[i]}`] = newColor[colorMode[i]];
        }
        this._model = colorMode;
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
      const mod = {
        from: this._model === "hex" ? "rgb" : this._model,
        to: currentModel === "hex" ? "rgb" : currentModel
      };
      this._alphaEnabled = alphaEnabled;
      if (mod.to !== mod.from) {
        const newColor = converters[mod.from].mod[mod.to](this);
        for (let i = 0; i < currentModel.length; i++) {
          this[`_${mod.to[i]}`] = newColor[mod.to[i]];
        }
        this._model = currentModel;
      }
      if (value !== void 0) {
        for (let i = 0; i < mod.to.length; i++) {
          this[`_${mod.to[i]}`] = value[i];
        }
        if (alphaEnabled) {
          this._A = value[3];
        }
        return this;
      }
      const v = [];
      for (let i = 0; i < mod.to.length; i++) {
        v.push(this[`_${mod.to[i]}`]);
      }
      if (alphaEnabled) {
        v.push(this._A);
      }
      return v;
    };
    __name(setGet, "setGet");
    let currentModel = model;
    const alphaEnabled = detectAlpha(model);
    if (alphaEnabled) {
      currentModel = removeAlpha(model);
    }
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
    },
    darken: function(value) {
      if (this._model === "hsl") {
        this._l -= value;
      } else {
        this._r -= value;
        this._g -= value;
        this._b -= value;
      }
      return this;
    }
  });
  var poc_default = Test;
  return __toCommonJS(poc_exports);
})();
