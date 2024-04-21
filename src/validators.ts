const validators: Record<string, RegExp> = {
	hex: /^#([\da-f]{3,8})/i,
	rgb: /^rgba?\(([^)]+)\)/i,
	hsl: /^hsla?\(([^)]+)\)/i,
	lab: /^lab\(([^)]+)\)/i,
	hwb: /^hwb\(([^)]+)\)/i,
	lch: /^lch\(([^)]+)\)/i,
	oklab: /^oklab\(([^)]+)\)/i,
	oklch: /^oklch\(([^)]+)\)/i,
    xyz: /^xyz\(([^)]+)\)/i,
	color: /^color\(([^)]+)\)/i,
};

export default validators;
