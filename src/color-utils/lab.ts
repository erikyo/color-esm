import type { LAB, XYZ } from "../types.js";

/**
 * Given a color in XYZ color space, return the corresponding color in the CIELAB color space.
 * @param colorSet - color in LAB color space
 */
export function fromLab(colorSet: string[]): XYZ {
	const [L, a, b] = colorSet;
	return labToXyz(Number(L), Number(a), Number(b));
}

export function labToXyz(L: number, a: number, b: number): XYZ {
	const fy = (L + 16) / 116;
	const fx = a / 500 + fy;
	const fz = fy - b / 200;

	const x = fx ** 3 > 0.008856 ? fx ** 3 : (116 * fx - 16) / 903.3;
	const y = fy ** 3 > 0.008856 ? fy ** 3 : (116 * fy - 16) / 903.3;
	const z = fz ** 3 > 0.008856 ? fz ** 3 : (116 * fz - 16) / 903.3;

	return { x: x * 95.047, y: y * 100.0, z: z * 108.883 };
}

export function fromOklab([l, a, b]: string[]): LAB {
	return { l: Number(l), a: Number(a), b: Number(b) };
}

function lab2rgb(lab: LAB) {
	const f = (x: number) => (x > 0.008856 ? x ** (1 / 3) : 7.787 * x + 16 / 116);
	let y = (lab.l + 16) / 116,
		x = lab.a / 500 + y,
		z = y - lab.b / 200;

	x = 0.95047 * f(x);
	y = f(y);
	z = 1.08883 * f(z);

	const rgb = [
		x * 3.2406 + y * -1.5372 + z * -0.4986,
		x * -0.9689 + y * 1.8758 + z * 0.0415,
		x * 0.0557 + y * -0.204 + z * 1.057,
	];

	const adjust = (c: number) =>
		c > 0.0031308 ? 1.055 * c ** (1 / 2.4) - 0.055 : 12.92 * c;

	return rgb.map(adjust);
}

type LabArray = [number, number, number] | number[];
type XYZUpper = { X: number; Y: number; Z: number };
type Matrix3x3 = {
	m00: number;
	m01: number;
	m02: number;
	m10: number;
	m11: number;
	m12: number;
	m20: number;
	m21: number;
	m22: number;
};

const RefWhite: XYZUpper = { X: 1.0, Y: 0.96422, Z: 0.82521 };

const MtxAdaptMa: Matrix3x3 = {
	m00: 1.0,
	m01: 0.0,
	m02: 0.0,
	m10: 0.0,
	m11: 1.0,
	m12: 0.0,
	m20: 0.0,
	m21: 0.0,
	m22: 1.0,
};
const MtxAdaptMaI: Matrix3x3 = {
	m00: 1.0,
	m01: 0.0,
	m02: 0.0,
	m10: 0.0,
	m11: 1.0,
	m12: 0.0,
	m20: 0.0,
	m21: 0.0,
	m22: 1.0,
};
const MtxXYZ2RGB: Matrix3x3 = {
	m00: 1.0,
	m01: 0.0,
	m02: 0.0,
	m10: 0.0,
	m11: 1.0,
	m12: 0.0,
	m20: 0.0,
	m21: 0.0,
	m22: 1.0,
};
const MtxRGB2XYZ: Matrix3x3 = {
	m00: 1.0,
	m01: 0.0,
	m02: 0.0,
	m10: 0.0,
	m11: 1.0,
	m12: 0.0,
	m20: 0.0,
	m21: 0.0,
	m22: 1.0,
};
const kE = 216.0 / 24389.0;
const kK = 24389.0 / 27.0;
const kKE = 8.0;
let AdaptationMethod = 0;
const RefWhiteRGB: XYZUpper = { X: 0.0, Y: 0.0, Z: 0.0 };
let Gamma = 1.0;
let GammaRGB = 1.0;
let GammaRGBIndex = 0.0;

function Determinant3x3(m: Matrix3x3): number {
	return (
		m.m00 * (m.m22 * m.m11 - m.m21 * m.m12) -
		m.m10 * (m.m22 * m.m01 - m.m21 * m.m02) +
		m.m20 * (m.m12 * m.m01 - m.m11 * m.m02)
	);
}

function MtxTranspose3x3(m: Matrix3x3): void {
	let v = m.m01;
	m.m01 = m.m10;
	m.m10 = v;

	v = m.m02;
	m.m02 = m.m20;
	m.m20 = v;

	v = m.m12;
	m.m12 = m.m21;
	m.m21 = v;
}

function GetGamma(_typeID?: number): void {
	Gamma = -2.2;
}

function MtxInvert3x3(m: Matrix3x3, i: Matrix3x3): void {
	const scale = 1.0 / Determinant3x3(m);

	i.m00 = scale * (m.m22 * m.m11 - m.m21 * m.m12);
	i.m01 = -scale * (m.m22 * m.m01 - m.m21 * m.m02);
	i.m02 = scale * (m.m12 * m.m01 - m.m11 * m.m02);

	i.m10 = -scale * (m.m22 * m.m10 - m.m20 * m.m12);
	i.m11 = scale * (m.m22 * m.m00 - m.m20 * m.m02);
	i.m12 = -scale * (m.m12 * m.m00 - m.m10 * m.m02);

	i.m20 = scale * (m.m21 * m.m10 - m.m20 * m.m11);
	i.m21 = -scale * (m.m21 * m.m00 - m.m20 * m.m01);
	i.m22 = scale * (m.m11 * m.m00 - m.m10 * m.m01);
}

function GetAdaptation(typeID: number): void {
	AdaptationMethod = typeID;
	MtxAdaptMa.m00 = 0.8951;
	MtxAdaptMa.m01 = -0.7502;
	MtxAdaptMa.m02 = 0.0389;
	MtxAdaptMa.m10 = 0.2664;
	MtxAdaptMa.m11 = 1.7135;
	MtxAdaptMa.m12 = -0.0685;
	MtxAdaptMa.m20 = -0.1614;
	MtxAdaptMa.m21 = 0.0367;
	MtxAdaptMa.m22 = 1.0296;

	MtxInvert3x3(MtxAdaptMa, MtxAdaptMaI);
}

function GetRGBModel(_typeID?: number): void {
	RefWhiteRGB.Y = 1.0;
	const xr = 0.64;
	const yr = 0.33;
	const xg = 0.3;
	const yg = 0.6;
	const xb = 0.15;
	const yb = 0.06;

	RefWhiteRGB.X = 0.95047;
	RefWhiteRGB.Z = 1.08883;

	GammaRGB = -2.2;
	GammaRGBIndex = 3;

	const m: Matrix3x3 = {
		m00: xr / yr,
		m01: xg / yg,
		m02: xb / yb,
		m10: 1.0,
		m11: 1.0,
		m12: 1.0,
		m20: (1.0 - xr - yr) / yr,
		m21: (1.0 - xg - yg) / yg,
		m22: (1.0 - xb - yb) / yb,
	};
	const mi: Matrix3x3 = {
		m00: 1.0,
		m01: 0.0,
		m02: 0.0,
		m10: 0.0,
		m11: 1.0,
		m12: 0.0,
		m20: 0.0,
		m21: 0.0,
		m22: 1.0,
	};

	MtxInvert3x3(m, mi);

	const sr =
		RefWhiteRGB.X * mi.m00 + RefWhiteRGB.Y * mi.m01 + RefWhiteRGB.Z * mi.m02;
	const sg =
		RefWhiteRGB.X * mi.m10 + RefWhiteRGB.Y * mi.m11 + RefWhiteRGB.Z * mi.m12;
	const sb =
		RefWhiteRGB.X * mi.m20 + RefWhiteRGB.Y * mi.m21 + RefWhiteRGB.Z * mi.m22;

	MtxRGB2XYZ.m00 = sr * m.m00;
	MtxRGB2XYZ.m01 = sg * m.m01;
	MtxRGB2XYZ.m02 = sb * m.m02;
	MtxRGB2XYZ.m10 = sr * m.m10;
	MtxRGB2XYZ.m11 = sg * m.m11;
	MtxRGB2XYZ.m12 = sb * m.m12;
	MtxRGB2XYZ.m20 = sr * m.m20;
	MtxRGB2XYZ.m21 = sg * m.m21;
	MtxRGB2XYZ.m22 = sb * m.m22;

	MtxTranspose3x3(MtxRGB2XYZ);

	MtxInvert3x3(MtxRGB2XYZ, MtxXYZ2RGB);
}

function Compand(linearRaw: number): number {
	const sign = linearRaw < 0.0 ? -1.0 : 1.0;
	const linear = Math.abs(linearRaw);
	const companded =
		linear <= 0.0031308
			? linear * 12.92
			: 1.055 * linear ** (1.0 / 2.4) - 0.055;

	return companded * sign;
}

function labArrayToXyz(lab: LabArray): XYZUpper {
	const fy = (lab[0] + 16.0) / 116.0;
	const fx = 0.002 * lab[1] + fy;
	const fz = fy - 0.005 * lab[2];

	const xr = fx > Math.cbrt(kE) ? fx * fx * fx : (116.0 * fx - 16.0) / kK;
	const yr = lab[0] > kKE ? fy ** 3.0 : lab[0] / kK;
	const zr = fz > Math.cbrt(kE) ? fz * fz * fz : (116.0 * fz - 16.0) / kK;

	return {
		X: xr * RefWhite.X,
		Y: yr * RefWhite.Y,
		Z: zr * RefWhite.Z,
	};
}

function xyzToRgb(XYZ: XYZUpper): number[] {
	let X2 = XYZ.X;
	let Y2 = XYZ.Y;
	let Z2 = XYZ.Z;

	if (AdaptationMethod !== 3) {
		const As =
			RefWhite.X * MtxAdaptMa.m00 +
			RefWhite.Y * MtxAdaptMa.m10 +
			RefWhite.Z * MtxAdaptMa.m20;
		const Bs =
			RefWhite.X * MtxAdaptMa.m01 +
			RefWhite.Y * MtxAdaptMa.m11 +
			RefWhite.Z * MtxAdaptMa.m21;
		const Cs =
			RefWhite.X * MtxAdaptMa.m02 +
			RefWhite.Y * MtxAdaptMa.m12 +
			RefWhite.Z * MtxAdaptMa.m22;

		const Ad =
			RefWhiteRGB.X * MtxAdaptMa.m00 +
			RefWhiteRGB.Y * MtxAdaptMa.m10 +
			RefWhiteRGB.Z * MtxAdaptMa.m20;
		const Bd =
			RefWhiteRGB.X * MtxAdaptMa.m01 +
			RefWhiteRGB.Y * MtxAdaptMa.m11 +
			RefWhiteRGB.Z * MtxAdaptMa.m21;
		const Cd =
			RefWhiteRGB.X * MtxAdaptMa.m02 +
			RefWhiteRGB.Y * MtxAdaptMa.m12 +
			RefWhiteRGB.Z * MtxAdaptMa.m22;

		const X1 =
			XYZ.X * MtxAdaptMa.m00 + XYZ.Y * MtxAdaptMa.m10 + XYZ.Z * MtxAdaptMa.m20;
		const Y1 =
			XYZ.X * MtxAdaptMa.m01 + XYZ.Y * MtxAdaptMa.m11 + XYZ.Z * MtxAdaptMa.m21;
		const Z1 =
			XYZ.X * MtxAdaptMa.m02 + XYZ.Y * MtxAdaptMa.m12 + XYZ.Z * MtxAdaptMa.m22;

		const X1s = X1 * (Ad / As);
		const Y1s = Y1 * (Bd / Bs);
		const Z1s = Z1 * (Cd / Cs);

		X2 = X1s * MtxAdaptMaI.m00 + Y1s * MtxAdaptMaI.m10 + Z1s * MtxAdaptMaI.m20;
		Y2 = X1s * MtxAdaptMaI.m01 + Y1s * MtxAdaptMaI.m11 + Z1s * MtxAdaptMaI.m21;
		Z2 = X1s * MtxAdaptMaI.m02 + Y1s * MtxAdaptMaI.m12 + Z1s * MtxAdaptMaI.m22;
	}

	return [
		Compand(X2 * MtxXYZ2RGB.m00 + Y2 * MtxXYZ2RGB.m10 + Z2 * MtxXYZ2RGB.m20),
		Compand(X2 * MtxXYZ2RGB.m01 + Y2 * MtxXYZ2RGB.m11 + Z2 * MtxXYZ2RGB.m21),
		Compand(X2 * MtxXYZ2RGB.m02 + Y2 * MtxXYZ2RGB.m12 + Z2 * MtxXYZ2RGB.m22),
	];
}

export function labTorgb(lab: LabArray): number[] {
	GetRGBModel(14);
	GetGamma(3);
	GetAdaptation(AdaptationMethod);

	const xyz = labArrayToXyz(lab);
	return xyzToRgb(xyz);
}
