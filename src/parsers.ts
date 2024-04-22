import { fromCmyk } from "./color-utils/cmyk";
import { fromColor } from "./color-utils/color";
import { fromHex } from "./color-utils/hex";
import { fromHsl } from "./color-utils/hsl";
import { fromHwb } from "./color-utils/hwb";
import { fromLab, fromOklab } from "./color-utils/lab";
import { fromLch, fromOklch } from "./color-utils/lch";
import { fromRgb } from "./color-utils/rgb";
import { fromXyz } from "./color-utils/xyz";
import { extract, parseHex } from "./parsers-utils";
import type { COLOR_PARSERS } from "./types";
import validators from "./validators";

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
