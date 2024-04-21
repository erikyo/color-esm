import {fromColor} from "./color-functions/color.ts";
import {fromHex} from "./color-functions/hex.ts";
import {fromHsl} from "./color-functions/hsl.ts";
import {fromHwb} from "./color-functions/hwb.ts";
import {fromLab, fromOklab} from "./color-functions/lab.ts";
import {fromLch, fromOklch} from "./color-functions/lch.ts";
import {fromRgb} from "./color-functions/rgb.ts";
import {fromXyz} from "./color-functions/xyz.ts";
import {extract, parseHex} from "./parsers-utils.ts";
import type {COLOR_PARSERS} from "./types.ts";
import validators from "./validators.ts";

/**
 * array of color parsers to be used
 */
const Parsers: COLOR_PARSERS[] = [
	{
		format: "hex",
		regex: validators.hex,
		parser: parseHex,
		converter: fromHex,
	},
	{ format: "rgb", regex: validators.rgb, parser: extract, converter: fromRgb },
	{ format: "hsl", regex: validators.hsl, parser: extract, converter: fromHsl },
	{ format: "lab", regex: validators.lab, parser: extract, converter: fromLab },
	{ format: "hwb", regex: validators.hwb, parser: extract, converter: fromHwb },
	{ format: "xyz", regex: validators.xyz, parser: extract, converter: fromXyz },
	{ format: "lch", regex: validators.lch, parser: extract, converter: fromLch },
	{
		format: "oklab",
		regex: validators.oklab,
		parser: extract,
		converter: fromOklab,
	},
	{
		format: "oklch",
		regex: validators.oklch,
		parser: extract,
		converter: fromOklch,
	},
	{
		format: "color",
		regex: validators.color,
		parser: extract,
		converter: fromColor,
	},
];
export default Parsers;
