import assert from "node:assert";
import test from "node:test";
import Color from "../lib/esm/index.js";

test("rgb", () => {
  const color = new Color(255, 255, 255);
  console.log(color.toString())
  assert.equal(color.toString(), "rgba(255, 255, 255, 1)");
});

test("rgbArray", () => {
  const color = new Color([255, 255, 255]);
  assert.equal(color.toString(), "rgba(255, 255, 255, 1)");
});

test("rgbObject", () => {
  const color = new Color({ r: 255, g: 255, b: 255 });
  assert.equal(color.toString(), "rgba(255, 255, 255, 1)");
  const color2 = new Color({ r: 127, g: 127, b: 127, alpha: 1 });
  assert.equal(color2.toString(), "rgba(127, 127, 127, 1)");
  const color3 = new Color({ r: 0, g: 0, b: 0, alpha: 0 });
  assert.equal(color3.toString(), "rgba(0, 0, 0, 0)");
});

test("rgbString", () => {
  const color = new Color("rgb(255, 255, 255)");
  assert.equal(color.toString(), "rgba(255, 255, 255, 1)");
});

test("chain", () => {
  const color = new Color("rgb(255, 255, 255)");
  color.lighten(0.5).darken(0).lighten(0)
  assert.equal(color.toString(), "rgba(127.5, 127.5, 127.5, 0.5)");
  const color2 = new Color("rgb(0, 0, 0)").darken(0.5);
  assert.equal(color2.toString(), "rgba(127.5, 127.5, 127.5, 1)");
});

test("red", () => {
  const color = new Color()
  console.log(color.red());
  console.log(color.blue());
  console.log(color.green());
  console.log(color.toString());
});
