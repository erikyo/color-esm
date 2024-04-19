import test from "node:test";
import Color from "../lib/esm/index.js";
import * as assert from "node:assert";

test("rgb", () => {
	const color = new Color(255, 255, 255);
	console.assert(color.toString() === "rgba(255, 255, 255, 1.0)");
});

test("rgbArray", () => {
	const color = new Color([255, 255, 255]);
	console.assert(color.toString() === "rgba(255, 255, 255, 1.0)");
});

test("rgbObject", () => {
	const color = new Color({ r: 255, g: 255, b: 255 });
	console.assert(color.toString() === "rgba(255, 255, 255, 1.0)");
  const color2 = new Color({ r: 0, g: 0, b: 0, a: 0 });
  console.assert(color2.toString() === "rgba(0, 0, 0, 0)");
});

test("rgbString", () => {
	const color = new Color("rgb(255, 255, 255)");
	console.assert(color.toString() === "rgba(255, 255, 255, 1.0)");
});
