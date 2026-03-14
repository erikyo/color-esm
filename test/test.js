import assert from "node:assert";
import test from "node:test";
import Color from "../lib/index.js";

test("1. Constructors & Parsing", () => {
  const c1 = new Color("#FFFFFF");
  assert.equal(c1.toString(), "rgba(255, 255, 255, 1)", "Should parse HEX string");

  const c2 = new Color({ r: 255, g: 0, b: 0 });
  assert.equal(c2.toString(), "rgba(255, 0, 0, 1)", "Should parse RGB object");

  const c3 = new Color([0, 255, 0]);
  assert.equal(c3.toString(), "rgba(0, 255, 0, 1)", "Should parse RGB array");

  const c4 = new Color("rgb(0, 0, 255)");
  assert.equal(c4.toString(), "rgba(0, 0, 255, 1)", "Should parse RGB string");
  
  const c5 = new Color(c4);
  assert.equal(c5.toString(), "rgba(0, 0, 255, 1)", "Should parse Color instance (Clone)");
});

test("2. Getters and Setters", () => {
  const color = new Color({ r: 10, g: 20, b: 30, a: 0.5 });
  
  // Getters
  assert.equal(color.red(), 10, "Should get red channel");
  assert.equal(color.green(), 20, "Should get green channel");
  assert.equal(color.blue(), 30, "Should get blue channel");
  assert.equal(color.alpha(), 0.5, "Should get alpha channel");

  // Setters (Should mutate OR return a new instance based on your implementation choice. 
  // NOTE: Original color package mutates on setters like .red(), but returns new instances on modifiers like .lighten())
  const color2 = color.red(100).green(200).blue(255).alpha(1);
  assert.equal(color2.red(), 100, "Should set red channel");
  assert.equal(color2.green(), 200, "Should set green channel");
  assert.equal(color2.blue(), 255, "Should set blue channel");
  assert.equal(color2.alpha(), 1, "Should set alpha channel");
});

test("3. Immutability on Modifiers (CRITICAL PARITY REQUIREMENT)", () => {
  const baseColor = new Color("#808080"); // 128, 128, 128
  const lightenedColor = baseColor.lighten(0.5);
  
  // If baseColor is mutated, this will fail. Modifiers must return NEW instances.
  assert.equal(baseColor.toString(), "rgba(128, 128, 128, 1)", "Base color should NOT be mutated");
  assert.notEqual(baseColor, lightenedColor, "Modifier should return a new Color instance");
});

test("4. Output Formats (CRITICAL PARITY REQUIREMENT)", () => {
  const color = new Color({ r: 255, g: 128, b: 0 });

  // Original 'color' package outputs
  assert.equal(color.hex(), "#FF8000", "Should output hex string via hex()");
  
  // rgb() in original returns an object with toString overwritten, or just an object
  // Let's test standard object output
  const rgbObj = color.rgb();
  assert.equal(rgbObj.r, 255);
  assert.equal(rgbObj.g, 128);
  assert.equal(rgbObj.b, 0);

  // Array output
  assert.deepEqual(color.array(), [255, 128, 0], "Should output array via array()");
  
  // RGB Number output
  const white = new Color("#FFFFFF");
  assert.equal(white.rgbNumber(), 16777215, "Should output standard 24-bit number");
});

test("5. WCAG Accessibility Utilities (CRITICAL PARITY REQUIREMENT)", () => {
  const black = new Color("#000000");
  const white = new Color("#FFFFFF");
  const gray = new Color("#777777");

  // Luminosity
  assert.equal(black.luminosity(), 0, "Black luminosity should be 0");
  assert.equal(white.luminosity(), 1, "White luminosity should be 1");

  // Contrast
  assert.equal(black.contrast(white), 21, "Black/White contrast should be 21");
  assert.equal(white.contrast(black), 21, "White/Black contrast should be 21");

  // isLight / isDark
  assert.equal(white.isLight(), true, "White is light");
  assert.equal(black.isDark(), true, "Black is dark");
});

test("6. Modifiers Math Correctness", () => {
  const color = new Color("hsl(100, 50%, 50%)");
  
  // Lighten increases HSL Lightness channel by ratio. 50% + (50% * 0.5) = 75%
  const light = color.lighten(0.5);
  // Assuming you implement an hsl() output getter
  assert.equal(Math.round(light.hsl().l), 75, "Lighten should modify HSL lightness by ratio");

  // Rotate increases HSL Hue
  const rotated = color.rotate(90);
  assert.equal(rotated.hsl().h, 190, "Rotate should increase hue by degrees");
  
  // Fade decreases alpha by ratio
  const semi = new Color("rgba(0, 0, 0, 1)").fade(0.5);
  assert.equal(semi.alpha(), 0.5, "Fade should reduce alpha by 50%");
});
