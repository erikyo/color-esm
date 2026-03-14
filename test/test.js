import assert from "node:assert";
import test from "node:test";
import Color from "../lib/esm/index.js";

test("rgb", () => {
  const black = new Color();
  assert.equal(black.toString(), "rgba(0, 0, 0, 1)");
  const white = new Color(255, 255, 255);
  assert.equal(white.toString(), "rgba(255, 255, 255, 1)");
  const whiteWithAlpha = new Color(255, 255, 255, 0.5);
  assert.equal(whiteWithAlpha.toString(), "rgba(255, 255, 255, 0.5)");
});

test("rgbArray", () => {
  const red = new Color([0,0,0]).red(152);
  assert.equal(red.toString(), "rgba(152, 0, 0, 1)");
  const white = new Color([255, 255, 255]);
  assert.equal(white.toString(), "rgba(255, 255, 255, 1)");
  const whiteWithAlpha = new Color([255, 255, 255, 0.5]);
  assert.equal(whiteWithAlpha.toString(), "rgba(255, 255, 255, 0.5)");
});

test("rgbObject", () => {
  const color = new Color({ r: 255, g: 255, b: 255 });
  assert.equal(color.toString(), "rgba(255, 255, 255, 1)");
  const color2 = new Color({ r: 127, g: 127, b: 127, a: 1 });
  assert.equal(color2.toString(), "rgba(127, 127, 127, 1)");
  const color3 = new Color({ r: 0, g: 0, b: 0, a: 0 });
  assert.equal(color3.toString(), "rgba(0, 0, 0, 0)");
});

test("rgbString", () => {
  const color = new Color("rgb(255, 255, 255)");
  assert.equal(color.toString(), "rgba(255, 255, 255, 1)");
});

test("chain", () => {
  const color = new Color("rgb(255, 255, 255)").darken(0.5).alpha(0.5).red(130).darken(0).lighten(0).blue(140);
  assert.equal(color.toString(), "rgba(130, 128, 140, 0.5)");
  const color2 = new Color("rgb(0, 0, 0)").lighten(0.5);
  assert.equal(color2.toString(), "rgba(128, 128, 128, 1)");
});

test("set color methods", () => {
  const color = new Color()
  console.log(color.red);
  console.log(color.red());
  console.log(color.red(255));
  console.log(color.alpha());
  console.log(color.red());
  console.log(color.blue());
  console.log(color.green());
  // After setting red to 255 on a black color, we get red (255, 0, 0)
  assert.equal(color.toString(), "rgba(255, 0, 0, 1)");
  color.green(255);
  color.blue(255);
  assert.equal(color.toString(), "rgba(255, 255, 255, 1)");
  color.green(0);
  assert.equal(color.toString(), "rgba(255, 0, 255, 1)");
});
