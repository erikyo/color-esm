import Color from "./index.js";
// https://www.w3.org/TR/css-color-5/#typedef-color
// color spaces <hex-color>
//               <rgb()> | <rgba()> |
//               <hsl()> | <hsla()> | <hwb()>  |
//               <lab()> | <lch()>  | <oklab()> | <oklch()> |
//               <color()>
import {fromRgb} from "./color-functions/rgb.js";

export function red(r = 255) {
    return new Color({ r });
}

export function green(g = 255) {
    return new Color({ g });
}

export function blue(b = 255) {
    return new Color({ b });
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
