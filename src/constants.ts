/** A regex to match hex colors */
export const hexRegex: RegExp = /^#([\da-f]{3,8})/i;
/** A regex to match rgbString colors */
export const rgbRegex: RegExp = /^rgba?\(([^)]+)\)/i;
/** A regex to match hslString colors */
export const hslRegex: RegExp = /^hsla?\(([^)]+)\)/i;
/** A regex to match strings that are only valid numbers with and without decimals and the number can be negative and without the 0 in the beginning  */
export const isNumeric: RegExp = /^-?\d*\.?\d+$/i;
/** Remove comments from string */
export const stripComments: RegExp = /(\/\*[^*]*\*\/)|(\/\/[^*]*)/g;
