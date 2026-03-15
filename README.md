# 🎨 color-esm

> **Chainable color library for Node and the browser. A modern, ESM-first, zero-dependency drop-in replacement for the original `color` package.**

This repository is a modernized fork of `Qix-/color` featuring an enhanced ESM build system, proper immutability, static factory methods, and parsing support for modern CSS color spaces.

---

## 🚀 Install

```bash
npm i color-esm

```

## 📦 ESM Import

```js
import Color from "color-esm";

```

## ✨ Quick Start

The `Color` class constructor supports multiple input shapes. You can use it with or without the `new` keyword.

```js
import Color from "color-esm";

const a = Color("#ffcc00");                         // ![#ffcc00](https://placehold.co/15x15/ffcc00/ffcc00.png) String
const b = Color(0xffcc00);                          // ![#ffcc00](https://placehold.co/15x15/ffcc00/ffcc00.png) Number
const c = Color([255, 204, 0, 0.8]);                // Array [r, g, b, a]
const d = Color({ r: 255, g: 204, b: 0, a: 0.8 });  // Object

// Fully chainable API
const chained = a.red(10).green(20).blue(30).alpha(0.5);

console.log(chained.rgb()); // { r: 10, g: 20, b: 30 }
console.log(chained.hsl()); // { h: ..., s: ..., l: ... }

```

---

## 🏭 Static Factories

You can bypass strings entirely and construct colors directly using built-in static methods:

```js
Color.rgb(255, 204, 0);       // ![#ffcc00](https://placehold.co/15x15/ffcc00/ffcc00.png)
Color.hsl(210, 100, 50);      // ![#007fff](https://placehold.co/15x15/007fff/007fff.png)
Color.hsv(120, 100, 100);     // ![#00ff00](https://placehold.co/15x15/00ff00/00ff00.png)
Color.cmyk(100, 50, 0, 0);    // ![#0080ff](https://placehold.co/15x15/0080ff/0080ff.png)
Color.hex("#ff00ff");         // ![#ff00ff](https://placehold.co/15x15/ff00ff/ff00ff.png)
Color.random();               // 🎲 Generates a random color

```

---

## 🎨 Supported Color Models

Strings are auto-detected by `fromString` and the constructor. We support classic and **modern CSS color functions**:

* **Hex:** `#rgb`, `#rgba`, `#rrggbb`, `#rrggbbaa`
* **RGB:** `rgb(...)`, `rgba(...)`
* **HSL:** `hsl(...)`, `hsla(...)`
* **HSV & HWB:** `hsv(...)`, `hwb(...)`
* **Modern CSS:** `lab(...)`, `lch(...)`, `oklab(...)`, `oklch(...)`, `xyz(...)`
* **Print:** `cmyk(...)`
* **CSS Keywords:** `red`, `transparent`, etc.

> **Note on Parsing:** HSL and HWB angle values accept `deg`, `rad`, or `turn`. Saturation, lightness, whiteness, and blackness accept percentage strings.

---

## 🔗 Channel Getters & Setters

These methods are **chainable**. Called without arguments, they return the current value. Called *with* an argument, they return a new `Color` instance with the updated value.

* `red(val?)`, `green(val?)`, `blue(val?)`: Individual RGB channels (0-255).
* `alpha(val?)`: Alpha channel (0-1).
* `hue()`, `saturationl()`, `lightness()`: HSL channels (h: 0-360, s/l: 0-100).
* `saturationv()`, `value()`: HSV channels (s/v: 0-100).
* `rgb(r?, g?, b?, a?)`: Gets/Sets internal RGB state.
* `hsl(h?, s?, l?)`: Converts to/from HSL.
* `hsv(h?, s?, v?)`: Converts to/from HSV.
* `hwb(h?, w?, b?)`: Converts to/from HWB.
* `cmyk(c?, m?, y?, k?)`: Converts to/from CMYK.
* `hex(val?)`, `hexa(val?)`: Gets/Sets hex string representations.

---

## 🛠️ Modifiers

All modifiers return a **new instance**, keeping your original color variables safe and enabling clean chaining.

```js
const base = Color("#007fff"); // ![#007fff](https://placehold.co/15x15/007fff/007fff.png)

base.lighten(0.1);      // Lightens by 10%
base.darken(0.1);       // Darkens by 10%
base.saturate(0.5);     // Increases saturation by ratio
base.desaturate(0.5);   // Decreases saturation by ratio
base.grayscale();       // Converts to grayscale via weighted average
base.whiten(0.5);       // Mixes with white
base.blacken(0.5);      // Mixes with black
base.fade(0.5);         // Decreases alpha by ratio
base.opaquer(0.5);      // Increases alpha by ratio
base.rotate(180);       // Rotates hue by 180 degrees
base.mix(Color("red")); // Mixes with another Color (default 50% weight)
base.invert();          // Inverts RGB channels

```

*Modifiers like `reddish(val)`, `greenish(val)`, and `bluish(val)` are also available for direct addition to channels.*

---

## ♿ Accessibility & Analysis

`color-esm` makes WCAG compliance checks easy:

```js
const bg = Color("#ffffff");
const text = Color("#555555");

text.luminosity(); // Returns relative luminance (0-1) using WCAG formula
text.contrast(bg); // Returns WCAG contrast ratio (1-21)
text.level(bg);    // Returns "AAA" (>= 7), "AA" (>= 4.5), or ""

text.isDark();     // true if luminosity < 0.5
text.isLight();    // true if luminosity >= 0.5
text.keyword();    // Returns the exact CSS keyword if it matches (e.g. "dimgrey")

```

---

## 📤 Output & Formatting

Extract your color data back into native JavaScript formats:

* `toString(model?)`: Formats the color as a string (e.g., `rgba(255, 0, 0, 1)` or `#ff0000`).
* `toObject(model?)`: Returns a plain object mapped to the requested channel letters.
* `toArray(model?)`: Returns an array of the requested channel values.
* `toJSON()`: Serializes the RGB object state.
* `toValue()`: Returns a 24-bit integer color value from the RGB channels.
* `round()`: Returns a new `Color` instance with all channels mathematically rounded to integers.

---

## 📖 Interactive Documentation

Visit our interactive documentation at: **[https://erikyo.github.io/color-esm/](https://erikyo.github.io/color-esm/)**

Test out all methods with live color pickers, real-time color space conversions, chainable examples, and WCAG accessibility testing!

---

## 💻 Development

```bash
# Clone and install
git clone [https://github.com/erikyo/color-esm.git](https://github.com/erikyo/color-esm.git)
cd color-esm
npm install

# Run tests
npm run test
npm run test:coverage

# Build for production
npm run build

```

## ⚖️ License

[ISC](https://www.google.com/search?q=LICENSE) - See https://www.google.com/search?q=LICENSE file for details.
