# color-esm

ESM-only, chainable color utility. This repo is a fork of `Qix-/color`, with ESM-compatible import specifiers and an ESM build so it can be used as a drop-in replacement for the original package in ESM projects.

**Install**
```bash
npm i color-esm
```

**ESM Import**
```js
import Color from "color-esm";
```

**Quick Start**
```js
import Color from "color-esm";

const a = new Color("#ffcc00");
const b = new Color(0xffcc00);
const c = new Color([255, 204, 0, 0.8]);
const d = new Color({ r: 255, g: 204, b: 0, a: 0.8 });

const chained = a.red(10).green(20).blue(30).alpha(0.5);
console.log(chained.rgb()); // { r: 10, g: 20, b: 30 }
console.log(chained.hsl()); // { h: ..., s: ..., l: ... }
```

**Purpose**
Provide the same constructor-based, chainable API style as the original `color` package while being ESM-first. You should be able to swap imports in ESM code and keep the same usage pattern.

**What This Package Exports**
Default export:
- `Color` class

No named exports are provided from the package root. All functionality is exposed as instance methods on `Color`.

**Constructor Inputs**
The `Color` class constructor supports multiple input shapes:
- `new Color(ColorInstance)` copies another instance by copying internal channels.
- `new Color("#fff")` or any supported CSS-like color string.
- `new Color(0xff00ff)` or `new Color(0xff00ff, 0.5)` for 24-bit integer input plus optional alpha.
- `new Color([r, g, b, a?], model?)` where `model` is a string like `"rgba"`.
- `new Color({ r, g, b, a, h, s, l, x, y, z, c, m, k })` for channel maps.

Alpha handling:
- The internal alpha channel is stored as `A` (uppercase).
- Object inputs accept `a` or `A` for alpha.

**Supported Color String Models**
Auto-detected by `fromString` and the constructor when a string is passed:
- Hex: `#rgb`, `#rgba`, `#rrggbb`, `#rrggbbaa`
- RGB: `rgb(...)`, `rgba(...)`
- HSL: `hsl(...)`, `hsla(...)`
- HWB: `hwb(...)`
- LAB: `lab(...)`
- LCH: `lch(...)`
- OKLAB: `oklab(...)`
- OKLCH: `oklch(...)`
- XYZ: `xyz(...)`
- CMYK: `cmyk(...)`
- CSS `color(...)` function

Parsing details for string models:
- HSL and HWB angle values accept `deg`, `rad`, or `turn`.
- HSL saturation and lightness accept percentage strings.
- HWB whiteness and blackness accept percentage strings.
- RGB expects numeric channel values, not percentages.

**Instance Methods: Construction and Parsing**
`fromObject(obj)`:
- Loads channel values from a plain object or another `Color`.
- Maps keys like `r`, `g`, `b`, `a`, `h`, `s`, `l`, `x`, `y`, `z`, `c`, `m`, `k` to internal fields.

`fromArray(values, model?, parse?)`:
- Loads channel values from an array.
- `model` is a string of channel letters, default `"rgba"`.
- If `parse` is true, values are normalized and clamped (percentages and angles are processed where applicable).

`fromString(string, model?)`:
- Parses a color string using the built-in model parsers.
- If `model` is not provided, it auto-detects the first matching parser.

`fromValue(number, alpha?)`:
- Interprets a 24-bit integer into RGB and optional alpha.
- Example: `new Color().fromValue(0xff00ff, 0.5)`.

**Instance Methods: Output and Formatting**
`info()`:
- Returns the same instance. Useful for chaining and inspection.

`toObject(model?)`:
- Returns a plain object by mapping channel letters found on the instance.
- This does not convert between color spaces. It only reads existing properties.

`toArray(model?)`:
- Returns an array by mapping channel letters found on the instance.
- This does not convert between color spaces. It only reads existing properties.

`toJson()`:
- Serializes the result of `toObject()` with indentation.

`toString(model?)`:
- Formats the color as a string.
- Intended for output like `rgba(...)` or `#rrggbb` based on the requested model.

`toValue()`:
- Returns a 24-bit integer color value from RGB channels.

**Instance Methods: Channel Getters and Setters**
These methods are chainable. When called with no arguments, they return the current value. When called with an argument, they set the value and return `this`.

`red(value?)`, `green(value?)`, `blue(value?)`:
- Get or set individual RGB channels.

`alpha(value?)`:
- Get or set the alpha channel.

`rgb(r?, g?, b?, a?)`:
- Getter: returns `{ r, g, b }` from internal RGB state.
- Setter: sets any provided channels and optional alpha.

`hsl(h?, s?, l?)`:
- Getter: returns `{ h, s, l }` computed from current RGB.
- Setter: converts HSL to RGB and updates internal channels.

`hex(value?)`:
- Getter: returns a hex representation of the current color.
- Setter: parses a hex string and updates the internal channels.

`hexa(value?)`:
- Getter: returns a hex representation including alpha.
- Setter: parses a hex-with-alpha string and updates the internal channels.

**Instance Methods: Modifiers**
All modifiers return the instance, enabling chaining.

`reddish(value)`:
- Adds `value` to the red channel.

`greenish(value)`:
- Adds `value` to the green channel.

`bluish(value)`:
- Adds `value` to the blue channel.

`invert()`:
- Inverts RGB channels.

`negate()`:
- Deprecated alias for `invert()`.

`lighten(amount)`:
- Lightens the color by increasing HSL lightness.
- `amount` is a ratio such as `0.1` for 10 percent.

`darken(amount)`:
- Darkens the color by decreasing HSL lightness.
- `amount` is a ratio such as `0.1` for 10 percent.

`lightness()`:
- Deprecated alias for `luminosity()`.

`darkness(amount)`:
- Deprecated alias for `darken(amount)`.

`saturate(ratio)`:
- Increases HSL saturation by a ratio of the current saturation.

`desaturate(ratio)`:
- Decreases HSL saturation by a ratio of the current saturation.

`grayscale()`:
- Converts the color to grayscale using a weighted average.

`whiten(amount)`:
- Mixes the color with white by the given ratio.

`blacken(amount)`:
- Mixes the color with black by the given ratio.

`fade(ratio)`:
- Decreases alpha by the given ratio.

`opaquer(ratio)`:
- Increases alpha by the given ratio.

`rotate(degrees)`:
- Rotates hue by the given number of degrees.

`mix(color, weight?)`:
- Mixes this color with another `Color` instance.
- `weight` defaults to `0.5`.
- Throws if the argument is not a `Color`.

**Accessibility and Analysis**
`luminosity()`:
- Returns relative luminance using the WCAG formula.

`contrast(color)`:
- Returns WCAG contrast ratio between this color and another.

`level(color)`:
- Returns `"AAA"` if contrast >= 7.
- Returns `"AA"` if contrast >= 4.5.
- Returns `""` otherwise.

`isDark()`:
- Returns `true` if `luminosity() < 0.5`.

`isLight()`:
- Returns `true` if `isDark()` is false.

**Behavior Notes and Current Limitations**
These reflect the current implementation in this ESM fork.

- `toString()` currently outputs `rgba(...)` by default and supports `hex` output. Other model strings are not formatted yet.
- `toObject()` and `toArray()` map channel letters directly from instance properties. Internal storage uses `_r`, `_g`, `_b`, `_A`, so `toObject("rgb")` and `toArray("rgba")` are not useful unless those letter properties exist.
- `fromString(string, model)` currently throws when `model` is one of the known models. Use auto-detection by omitting the model.
- `hex()` and `hexa()` setters depend on `fromString` with an explicit model and do not work reliably yet.
- `hexa()` is not a recognized parser model, so hex-with-alpha input should be parsed using the regular hex parser.
- `color(...)` parsing is a placeholder and only preserves alpha.
- `oklch(...)` conversion uses a simplified mapping to RGB.
- Non-RGB models parsed from strings are stored in internal fields like `_x`, `_y`, `_z` and do not have dedicated getters.

**ESM Drop-In Usage**
This package is ESM-only and intended to replace `color` in ESM code:
```js
// original
// import Color from "color";

// ESM replacement
import Color from "color-esm";
```
