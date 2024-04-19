import test from "node:test";
import Color from "../lib/esm/index.js";
import assert from "node:assert";

test("rgb", () => {
	const color = new Color(255, 255, 255);
	assert.equal(color.toString(), "rgba(255, 255, 255, 1)");
});

test("rgbArray", () => {
	const color = new Color([255, 255, 255]);
	assert.equal(color.toString(), "rgba(255, 255, 255, 1)");
});

test("rgbObject", () => {
	const color = new Color({ r: 255, g: 255, b: 255 });
	assert.equal(color.toString(), "rgba(255, 255, 255, 1)");
  const color2 = new Color({ r: 127, g: 127, b: 127, a: 127 });
  assert.equal(color2.toString(), "rgba(127, 127, 127, 127)");
  const color3 = new Color({ r: 0, g: 0, b: 0, a: 0 });
  assert.equal(color3.toString(), "rgba(0, 0, 0, 0)");
});

test("rgbString", () => {
	const color = new Color("rgb(255, 255, 255)");
	assert.equal(color.toString(), "rgba(255, 255, 255, 1)");
});


test("chain", () => {
  const color = new Color("rgb(255, 255, 255)").alpha(0.5).lighten(0.5);
  assert.equal(color.toString(), "rgba(127.5, 127.5, 127.5, 0.5)");
});
