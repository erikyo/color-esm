const RefWhite = { X: 0.0, Y: 0.0, Z: 0.0 };

const MtxAdaptMa = {
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
const MtxAdaptMaI = {
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
const MtxXYZ2RGB = {
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
const MtxRGB2XYZ = {
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
const RefWhiteRGB = { X: 0.0, Y: 0.0, Z: 0.0 };
let Gamma = 1.0;
let GammaRGB = 1.0;
let GammaRGBIndex = 0.0;

function Determinant3x3(m) {
	return (
		m.m00 * (m.m22 * m.m11 - m.m21 * m.m12) -
		m.m10 * (m.m22 * m.m01 - m.m21 * m.m02) +
		m.m20 * (m.m12 * m.m01 - m.m11 * m.m02)
	);
}

function MtxTranspose3x3(m) {
	var v = m.m01;
	m.m01 = m.m10;
	m.m10 = v;

	v = m.m02;
	m.m02 = m.m20;
	m.m20 = v;

	v = m.m12;
	m.m12 = m.m21;
	m.m21 = v;
}

function GetGamma(typeID) {
	switch (typeID) {
		case 0 /* 1.0 */:
			Gamma = 1.0;
			break;
		case 1 /* 1.8 */:
			Gamma = 1.8;
			break;
		case 2 /* 2.2 */:
			Gamma = 2.2;
			break;
		case 3 /* sRGB */:
			Gamma = -2.2;
			break;
		case 4 /* L* */:
			Gamma = 0.0;
			break;
	}
}

function MtxInvert3x3(m, i) {
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

function GetAdaptation(typeID) {
	AdaptationMethod = typeID;
	switch (AdaptationMethod) {
		case 0 /* Bradford */:
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
			break;
		case 1 /* von Kries */:
			MtxAdaptMa.m00 = 0.40024;
			MtxAdaptMa.m01 = -0.2263;
			MtxAdaptMa.m02 = 0.0;
			MtxAdaptMa.m10 = 0.7076;
			MtxAdaptMa.m11 = 1.16532;
			MtxAdaptMa.m12 = 0.0;
			MtxAdaptMa.m20 = -0.08081;
			MtxAdaptMa.m21 = 0.0457;
			MtxAdaptMa.m22 = 0.91822;

			MtxInvert3x3(MtxAdaptMa, MtxAdaptMaI);
			break;
		case 2: /* XYZ Scaling */
		case 3 /* None */:
			MtxAdaptMa.m00 = 1.0;
			MtxAdaptMa.m01 = 0.0;
			MtxAdaptMa.m02 = 0.0;
			MtxAdaptMa.m10 = 0.0;
			MtxAdaptMa.m11 = 1.0;
			MtxAdaptMa.m12 = 0.0;
			MtxAdaptMa.m20 = 0.0;
			MtxAdaptMa.m21 = 0.0;
			MtxAdaptMa.m22 = 1.0;

			MtxAdaptMaI.m00 = 1.0;
			MtxAdaptMaI.m01 = 0.0;
			MtxAdaptMaI.m02 = 0.0;
			MtxAdaptMaI.m10 = 0.0;
			MtxAdaptMaI.m11 = 1.0;
			MtxAdaptMaI.m12 = 0.0;
			MtxAdaptMaI.m20 = 0.0;
			MtxAdaptMaI.m21 = 0.0;
			MtxAdaptMaI.m22 = 1.0;
			break;
	}
}

function GetRGBModel(typeID) {
	RefWhiteRGB.Y = 1.0;
	let xr;
	let yr;
	let xg;
	let yg;
	let xb;
	let yb;

	switch (typeID) {
		case 0 /* Adobe RGB (1998) */:
			xr = 0.64;
			yr = 0.33;
			xg = 0.21;
			yg = 0.71;
			xb = 0.15;
			yb = 0.06;

			RefWhiteRGB.X = 0.95047;
			RefWhiteRGB.Z = 1.08883;

			GammaRGB = 2.2;
			GammaRGBIndex = 2;
			break;
		case 1 /* AppleRGB */:
			xr = 0.625;
			yr = 0.34;
			xg = 0.28;
			yg = 0.595;
			xb = 0.155;
			yb = 0.07;

			RefWhiteRGB.X = 0.95047;
			RefWhiteRGB.Z = 1.08883;

			GammaRGB = 1.8;
			GammaRGBIndex = 1;
			break;
		case 2 /* Best RGB */:
			xr = 0.7347;
			yr = 0.2653;
			xg = 0.215;
			yg = 0.775;
			xb = 0.13;
			yb = 0.035;

			RefWhiteRGB.X = 0.96422;
			RefWhiteRGB.Z = 0.82521;

			GammaRGB = 2.2;
			GammaRGBIndex = 2;
			break;
		case 3 /* Beta RGB */:
			xr = 0.6888;
			yr = 0.3112;
			xg = 0.1986;
			yg = 0.7551;
			xb = 0.1265;
			yb = 0.0352;

			RefWhiteRGB.X = 0.96422;
			RefWhiteRGB.Z = 0.82521;

			GammaRGB = 2.2;
			GammaRGBIndex = 2;
			break;
		case 4 /* Bruce RGB */:
			xr = 0.64;
			yr = 0.33;
			xg = 0.28;
			yg = 0.65;
			xb = 0.15;
			yb = 0.06;

			RefWhiteRGB.X = 0.95047;
			RefWhiteRGB.Z = 1.08883;

			GammaRGB = 2.2;
			GammaRGBIndex = 2;
			break;
		case 5 /* CIE RGB */:
			xr = 0.735;
			yr = 0.265;
			xg = 0.274;
			yg = 0.717;
			xb = 0.167;
			yb = 0.009;

			RefWhiteRGB.X = 1.0;
			RefWhiteRGB.Z = 1.0;

			GammaRGB = 2.2;
			GammaRGBIndex = 2;
			break;
		case 6 /* ColorMatch RGB */:
			xr = 0.63;
			yr = 0.34;
			xg = 0.295;
			yg = 0.605;
			xb = 0.15;
			yb = 0.075;

			RefWhiteRGB.X = 0.96422;
			RefWhiteRGB.Z = 0.82521;

			GammaRGB = 1.8;
			GammaRGBIndex = 1;
			break;
		case 7 /* Don RGB 4 */:
			xr = 0.696;
			yr = 0.3;
			xg = 0.215;
			yg = 0.765;
			xb = 0.13;
			yb = 0.035;

			RefWhiteRGB.X = 0.96422;
			RefWhiteRGB.Z = 0.82521;

			GammaRGB = 2.2;
			GammaRGBIndex = 2;
			break;
		case 8 /* ECI RGB v2 */:
			xr = 0.67;
			yr = 0.33;
			xg = 0.21;
			yg = 0.71;
			xb = 0.14;
			yb = 0.08;

			RefWhiteRGB.X = 0.96422;
			RefWhiteRGB.Z = 0.82521;

			GammaRGB = 0.0;
			GammaRGBIndex = 4;
			break;
		case 9 /* Ekta Space PS5 */:
			xr = 0.695;
			yr = 0.305;
			xg = 0.26;
			yg = 0.7;
			xb = 0.11;
			yb = 0.005;

			RefWhiteRGB.X = 0.96422;
			RefWhiteRGB.Z = 0.82521;

			GammaRGB = 2.2;
			GammaRGBIndex = 2;
			break;
		case 10 /* NTSC RGB */:
			xr = 0.67;
			yr = 0.33;
			xg = 0.21;
			yg = 0.71;
			xb = 0.14;
			yb = 0.08;

			RefWhiteRGB.X = 0.98074;
			RefWhiteRGB.Z = 1.18232;

			GammaRGB = 2.2;
			GammaRGBIndex = 2;
			break;
		case 11 /* PAL/SECAM RGB */:
			xr = 0.64;
			yr = 0.33;
			xg = 0.29;
			yg = 0.6;
			xb = 0.15;
			yb = 0.06;

			RefWhiteRGB.X = 0.95047;
			RefWhiteRGB.Z = 1.08883;

			GammaRGB = 2.2;
			GammaRGBIndex = 2;
			break;
		case 12 /* ProPhoto RGB */:
			xr = 0.7347;
			yr = 0.2653;
			xg = 0.1596;
			yg = 0.8404;
			xb = 0.0366;
			yb = 0.0001;

			RefWhiteRGB.X = 0.96422;
			RefWhiteRGB.Z = 0.82521;

			GammaRGB = 1.8;
			GammaRGBIndex = 1;
			break;
		case 13 /* SMPTE-C RGB */:
			xr = 0.63;
			yr = 0.34;
			xg = 0.31;
			yg = 0.595;
			xb = 0.155;
			yb = 0.07;

			RefWhiteRGB.X = 0.95047;
			RefWhiteRGB.Z = 1.08883;

			GammaRGB = 2.2;
			GammaRGBIndex = 2;
			break;
		case 14 /* sRGB */:
			xr = 0.64;
			yr = 0.33;
			xg = 0.3;
			yg = 0.6;
			xb = 0.15;
			yb = 0.06;

			RefWhiteRGB.X = 0.95047;
			RefWhiteRGB.Z = 1.08883;

			GammaRGB = -2.2;
			GammaRGBIndex = 3;
			break;
		case 15 /* Wide Gamut RGB */:
			xr = 0.735;
			yr = 0.265;
			xg = 0.115;
			yg = 0.826;
			xb = 0.157;
			yb = 0.018;

			RefWhiteRGB.X = 0.96422;
			RefWhiteRGB.Z = 0.82521;

			GammaRGB = 2.2;
			GammaRGBIndex = 2;
			break;
	}

	var m = {
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
	var mi = {
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

	var sr =
		RefWhiteRGB.X * mi.m00 + RefWhiteRGB.Y * mi.m01 + RefWhiteRGB.Z * mi.m02;
	var sg =
		RefWhiteRGB.X * mi.m10 + RefWhiteRGB.Y * mi.m11 + RefWhiteRGB.Z * mi.m12;
	var sb =
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

function GetRefWhite(typeID) {
	RefWhite.Y = 1.0;
	switch (typeID) {
		case 0: // A (ASTM E308-01)
			RefWhite.X = 1.0985;
			RefWhite.Z = 0.35585;
			break;
		case 1: // B (Wyszecki & Stiles, p. 769)
			RefWhite.X = 0.99072;
			RefWhite.Z = 0.85223;
			break;
		case 2: // C (ASTM E308-01)
			RefWhite.X = 0.98074;
			RefWhite.Z = 1.18232;
			break;
		case 3: // D50 (ASTM E308-01)
			RefWhite.X = 0.96422;
			RefWhite.Z = 0.82521;
			break;
		case 4: // D55 (ASTM E308-01)
			RefWhite.X = 0.95682;
			RefWhite.Z = 0.92149;
			break;
		case 5: // D65 (ASTM E308-01)
			RefWhite.X = 0.95047;
			RefWhite.Z = 1.08883;
			break;
		case 6: // D75 (ASTM E308-01)
			RefWhite.X = 0.94972;
			RefWhite.Z = 1.22638;
			break;
		default:
		case 7: // E (ASTM E308-01)
			RefWhite.X = 1.0;
			RefWhite.Z = 1.0;
			break;
		case 8: // F2 (ASTM E308-01)
			RefWhite.X = 0.99186;
			RefWhite.Z = 0.67393;
			break;
		case 9: // F7 (ASTM E308-01)
			RefWhite.X = 0.95041;
			RefWhite.Z = 1.08747;
			break;
		case 10: // F11 (ASTM E308-01)
			RefWhite.X = 1.00962;
			RefWhite.Z = 0.6435;
			break;
	}
}

function Compand(linearRaw) {
	const sign = linearRaw < 0.0 ? -1.0 : 1.0;
	const linear = Math.abs(linearRaw);
	let companded;

	if (Gamma > 0.0) {
		const invGamma = 1.0 / Gamma;
		companded = Math.pow(linear, invGamma);
	} else if (Gamma < 0.0) {
		companded =
			linear <= 0.0031308
				? linear * 12.92
				: 1.055 * Math.pow(linear, 1.0 / 2.4) - 0.055;
	} else {
		// Gamma == 0.0
		companded =
			linear <= 216.0 / 24389.0
				? (linear * 24389.0) / 2700.0
				: 1.16 * Math.pow(linear, 1.0 / 3.0) - 0.16;
	}

	return companded * sign;
}

function labToXyz(lab) {
	const fy = (lab[0] + 16.0) / 116.0;
	const fx = 0.002 * lab[1] + fy;
	const fz = fy - 0.005 * lab[2];

	const xr = fx > Math.cbrt(kE) ? fx * fx * fx : (116.0 * fx - 16.0) / kK;
	const yr = lab[0] > kKE ? Math.pow(fy, 3.0) : lab[0] / kK;
	const zr = fz > Math.cbrt(kE) ? fz * fz * fz : (116.0 * fz - 16.0) / kK;

	return {
		X: xr * RefWhite.X,
		Y: yr * RefWhite.Y,
		Z: zr * RefWhite.Z,
	};
}

function xyzToRgb(XYZ) {
	var X2 = XYZ.X;
	var Y2 = XYZ.Y;
	var Z2 = XYZ.Z;

	if (AdaptationMethod != 3) {
		var As =
			RefWhite.X * MtxAdaptMa.m00 +
			RefWhite.Y * MtxAdaptMa.m10 +
			RefWhite.Z * MtxAdaptMa.m20;
		var Bs =
			RefWhite.X * MtxAdaptMa.m01 +
			RefWhite.Y * MtxAdaptMa.m11 +
			RefWhite.Z * MtxAdaptMa.m21;
		var Cs =
			RefWhite.X * MtxAdaptMa.m02 +
			RefWhite.Y * MtxAdaptMa.m12 +
			RefWhite.Z * MtxAdaptMa.m22;

		var Ad =
			RefWhiteRGB.X * MtxAdaptMa.m00 +
			RefWhiteRGB.Y * MtxAdaptMa.m10 +
			RefWhiteRGB.Z * MtxAdaptMa.m20;
		var Bd =
			RefWhiteRGB.X * MtxAdaptMa.m01 +
			RefWhiteRGB.Y * MtxAdaptMa.m11 +
			RefWhiteRGB.Z * MtxAdaptMa.m21;
		var Cd =
			RefWhiteRGB.X * MtxAdaptMa.m02 +
			RefWhiteRGB.Y * MtxAdaptMa.m12 +
			RefWhiteRGB.Z * MtxAdaptMa.m22;

		var X1 =
			XYZ.X * MtxAdaptMa.m00 + XYZ.Y * MtxAdaptMa.m10 + XYZ.Z * MtxAdaptMa.m20;
		var Y1 =
			XYZ.X * MtxAdaptMa.m01 + XYZ.Y * MtxAdaptMa.m11 + XYZ.Z * MtxAdaptMa.m21;
		var Z1 =
			XYZ.X * MtxAdaptMa.m02 + XYZ.Y * MtxAdaptMa.m12 + XYZ.Z * MtxAdaptMa.m22;

		X1 *= Ad / As;
		Y1 *= Bd / Bs;
		Z1 *= Cd / Cs;

		X2 = X1 * MtxAdaptMaI.m00 + Y1 * MtxAdaptMaI.m10 + Z1 * MtxAdaptMaI.m20;
		Y2 = X1 * MtxAdaptMaI.m01 + Y1 * MtxAdaptMaI.m11 + Z1 * MtxAdaptMaI.m21;
		Z2 = X1 * MtxAdaptMaI.m02 + Y1 * MtxAdaptMaI.m12 + Z1 * MtxAdaptMaI.m22;
	}

	return [
		Compand(X2 * MtxXYZ2RGB.m00 + Y2 * MtxXYZ2RGB.m10 + Z2 * MtxXYZ2RGB.m20),
		Compand(X2 * MtxXYZ2RGB.m01 + Y2 * MtxXYZ2RGB.m11 + Z2 * MtxXYZ2RGB.m21),
		Compand(X2 * MtxXYZ2RGB.m02 + Y2 * MtxXYZ2RGB.m12 + Z2 * MtxXYZ2RGB.m22),
	];
}

export function labTorgb(lab) {
	GetRefWhite(3);
	GetRGBModel(14);
	GetGamma(3);
	GetAdaptation(AdaptationMethod);
	const xyz = labToXyz(lab);
	return xyzToRgb(xyz);
}
