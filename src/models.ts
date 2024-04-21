import Color from "./index.ts";

import {fromRgb} from "./color-functions/rgb.ts";

export function red(r = 255) {
    this.r = r;
    return this;
}

export function green(g = 255) {
    this.g = g;
    return this;
}

export function blue(b = 255) {
    this.b = b;
    return this;
}

export function alpha(A = 1) {
    this.A = A;
    return this;
}

export function hex(colorString: string | undefined) {
    return new Color(colorString, "hex");
}

export function hexa(colorString: string | undefined) {
    return new Color(colorString, "hexa");
}

export function rgb(r?: string | number, g?: string | number, b?: string | number, a = 1) {
    return fromRgb([r, g, b, a]);
}

export function hsl(string: string | undefined) {
    return new Color(string, "hsl");
}

export function lab(string: string | undefined) {
    return new Color(string, "lab");
}

export function lch(string: string | undefined) {
    return new Color(string, "lch");
}

export function oklab(string: string | undefined) {
    return new Color(string, "oklab");
}

export function hwb(string: string | undefined) {
    return new Color(string, "hwb");
}

export function oklch(string: string | undefined) {
    return new Color(string, "oklch");
}

export function models(string: string | undefined) {
    return new Color(string, "color");
}
