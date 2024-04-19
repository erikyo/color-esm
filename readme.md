Chainable color module using modern js 

// Example usage:
const color1 = Color.fromString('rgb(255, 255, 255)');
const color2 = Color.fromObject({ r: 255, g: 255, b: 255 });
const color3 = Color.rgb(255, 255, 255);
const color4 = Color.rgbArray([255, 255, 255]);

console.log(color1); // Outputs: Color { color: { r: 255, g: 255, b: 255, a: 1 } }
console.log(color2); // Outputs: Color { color: { r: 255, g: 255, b: 255, a: 1 } }
console.log(color3); // Outputs: Color { color: { r: 255, g: 255, b: 255, a: 1 } }
console.log(color4); // Outputs: Color { color: { r: 255, g: 255, b: 255, a: 1 } }
