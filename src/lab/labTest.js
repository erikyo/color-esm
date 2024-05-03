import test from "node:test";
import { labTorgb } from "./lab.js";

test("labtoRgb", () => {
	const rgb1 = labTorgb(Object.values({ l: 73, a: 33.95, b: 77.48 }));

	console.log(rgb1.map((x) => x * 255));
});
