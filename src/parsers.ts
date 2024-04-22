import { fromCmyk } from "./color-utils/cmyk.js";
import { fromColor } from "./color-utils/color.js";
import { fromHex } from "./color-utils/hex.js";
import { fromHsl } from "./color-utils/hsl.js";
import { fromHwb } from "./color-utils/hwb.js";
import { fromLab, fromOklab } from "./color-utils/lab.js";
import { fromLch, fromOklch } from "./color-utils/lch.js";
import { fromRgb } from "./color-utils/rgb.js";
import { fromXyz } from "./color-utils/xyz.js";
import { extract, parseHex } from "./parsers-utils.js";
import type { COLOR_PARSERS } from "./types.js";
import validators from "./validators.js";

/**
 * array of color parsers to be used
 */
const parsers: COLOR_PARSERS[] = [
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
		format: "oklch",
		regex: validators.cmyk,
		parser: extract,
		converter: fromCmyk,
	},
	{
		format: "color",
		regex: validators.color,
		parser: extract,
		converter: fromColor,
	},
];

export default parsers;
