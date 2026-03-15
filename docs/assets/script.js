// The IIFE creates window.Color as { default: ColorClass }
// Reassign to the actual class for direct usage
window.Color = window.Color.default;

// Global chain state for the chain builder
var chainState = {
	color: null,
	steps: [],
};

// Initialize on page load
document.addEventListener("DOMContentLoaded", () => {
	initializeConstructorExamples();
	initializeColorModels();
	initializeChannelGetters();
	updateModelExamples();
	updateChainExamples();
	updateLightnessExamples();
	updateSaturationExamples();
	updateRotateExamples();
	updateMixing();
	updateAccessibility();
	updateOutput();
	updateChainDemo();
	updateColorModelExamples();
	resetChain();
	setupEventListeners();
});

function setupEventListeners() {
	// Input changes
	document
		.getElementById("model-base-color")
		.addEventListener("input", updateModelExamples);
	document.getElementById("chain-base").addEventListener("input", function() {
		updateChainExamples();
		updateLightnessExamples();
		updateSaturationExamples();
		updateRotateExamples();
	});
	document.getElementById("channel-color").addEventListener("input", updateChannelGetters);
	document
		.getElementById("output-color")
		.addEventListener("input", updateOutput);
	document.getElementById("chain-input").addEventListener("input", resetChain);
	document.getElementById("color-model-input").addEventListener("input", updateColorModelExamples);

	// WCAG inputs
	document
		.getElementById("wcag-fg")
		.addEventListener("input", updateAccessibility);
	document
		.getElementById("wcag-bg")
		.addEventListener("input", updateAccessibility);

	// Mixing inputs
	document.getElementById("mix-color1").addEventListener("input", updateMixing);
	document.getElementById("mix-color2").addEventListener("input", updateMixing);
	document.getElementById("mix-weight").addEventListener("input", function () {
		document.getElementById("mix-weight-value").textContent = this.value;
		updateMixing();
	});

	// Sliders
	document
		.getElementById("lighten-amount")
		.addEventListener("input", function () {
			document.getElementById("lighten-value").textContent = this.value;
			updateLightnessExamples();
		});

	document
		.getElementById("saturate-amount")
		.addEventListener("input", function () {
			document.getElementById("saturate-value").textContent = this.value;
			updateSaturationExamples();
		});

	document
		.getElementById("rotate-amount")
		.addEventListener("input", function () {
			document.getElementById("rotate-value").textContent = this.value + "°";
			updateRotateExamples();
		});
}

// ==================== CONSTRUCTOR EXAMPLES ====================

function initializeConstructorExamples() {
	// String examples
	const stringExamples = [
		{ input: '"#ff6b6b"', color: new Color("#ff6b6b") },
		{ input: '"#4CAF50"', color: new Color("#4CAF50") },
		{ input: '"rgb(255, 99, 71)"', color: new Color("rgb(255, 99, 71)") },
		{
			input: '"rgba(255, 99, 71, 0.8)"',
			color: new Color("rgba(255, 99, 71, 0.8)"),
		},
		{ input: '"hsl(280, 100%, 50%)"', color: new Color("hsl(280, 100%, 50%)") },
		{
			input: '"hsla(280, 100%, 50%, 0.6)"',
			color: new Color("hsla(280, 100%, 50%, 0.6)"),
		},
	];

	const stringContainer = document.getElementById("string-examples");
	stringExamples.forEach(({ input, color }) => {
		try {
			stringContainer.appendChild(createColorDisplay(input, color.hex()));
		} catch (e) {
			stringContainer.appendChild(
				createColorDisplay(input, `Error: ${e.message}`),
			);
		}
	});

	// Hex examples
	const hexContainer = document.getElementById("hex-examples");
	const hexExamples = [
		{ input: "0xFF6B6B", color: new Color(0xff6b6b) },
		{ input: "0x4CAF50", color: new Color(0x4caf50) },
		{ input: '"#4287f5"', color: new Color("#4287f5") },
	];
	hexExamples.forEach(({ input, color }) => {
		try {
			hexContainer.appendChild(createColorDisplay(input, color.hex()));
		} catch (e) {
			hexContainer.appendChild(
				createColorDisplay(input, `Error: ${e.message}`),
			);
		}
	});

	// Array examples
	const arrayContainer = document.getElementById("array-examples");
	const arrayExamples = [
		{ input: "[255, 107, 107]", color: new Color([255, 107, 107]) },
		{ input: "[255, 107, 107, 0.8]", color: new Color([255, 107, 107, 0.8]) },
		{
			input: "{ r: 255, g: 107, b: 107 }",
			color: new Color({ r: 255, g: 107, b: 107 }),
		},
	];
	arrayExamples.forEach(({ input, color }) => {
		try {
			arrayContainer.appendChild(createColorDisplay(input, color.hex()));
		} catch (e) {
			arrayContainer.appendChild(
				createColorDisplay(input, `Error: ${e.message}`),
			);
		}
	});
}

// ==================== MODEL EXAMPLES ====================

function updateModelExamples() {
	const baseColorInput = document.getElementById("model-base-color").value;
	const container = document.getElementById("model-examples");

	try {
		const color = new Color(baseColorInput);

		container.innerHTML = `
                    <div class="grid">
                        <div class="card">
                            <h4>rgb()</h4>
                            <div class="code-block">${JSON.stringify(color.rgb())}</div>
                        </div>
                        <div class="card">
                            <h4>hsl()</h4>
                            <div class="code-block">${JSON.stringify(color.hsl())}</div>
                        </div>
                        <div class="card">
                            <h4>hex()</h4>
                            <div class="code-block">"${color.hex()}"</div>
                        </div>
                        <div class="card">
                            <h4>hexa()</h4>
                            <div class="code-block">"${color.hexa()}"</div>
                        </div>
                        <div class="card">
                            <h4>Channels</h4>
                            <div class="code-block">
                                red: ${color.red()}<br>
                                green: ${color.green()}<br>
                                blue: ${color.blue()}<br>
                                alpha: ${color.alpha()}
                            </div>
                        </div>
                        <div class="card">
                            <h4>Preview</h4>
                            <div style="width: 100%; height: 60px; background: ${color.hex()}; border-radius: 8px; border: 2px solid #333;"></div>
                        </div>
                    </div>
                `;
	} catch (e) {
		container.innerHTML = `<div class="warning">Error: ${e.message}</div>`;
	}
}

// ==================== CHANNEL GETTERS ====================

function initializeChannelGetters() {
	const colorInput = document.getElementById("channel-color").value;
	const color = new Color(colorInput);
	const container = document.getElementById("channel-getters-display");

	container.innerHTML = `
                <div class="grid">
                    <div class="card">
                        <h4>RGB Getters</h4>
                        <div class="code-block">
                            red(): ${color.red()}<br>
                            green(): ${color.green()}<br>
                            blue(): ${color.blue()}<br>
                            alpha(): ${color.alpha()}
                        </div>
                    </div>
                    <div class="card">
                        <h4>HSL Getters</h4>
                        <div class="code-block">
                            hue(): ${color.hue()}<br>
                            saturationl(): ${color.saturationl()}<br>
                            lightness(): ${color.lightness()}
                        </div>
                    </div>
                    <div class="card">
                        <h4>HSV Getters</h4>
                        <div class="code-block">
                            saturationv(): ${color.saturationv()}<br>
                            value(): ${color.value()}
                        </div>
                    </div>
                    <div class="card">
                        <h4>HWB Values</h4>
                        <div class="code-block">
                            h: ${color.hwb().h}<br>
                            w: ${color.hwb().w}<br>
                            b: ${color.hwb().b}
                        </div>
                    </div>
                    <div class="card">
                        <h4>CMYK Getters</h4>
                        <div class="code-block">
                            cyan(): ${color.cmyk().c}<br>
                            magenta(): ${color.cmyk().m}<br>
                            yellow(): ${color.cmyk().y}<br>
                            black(): ${color.cmyk().k}
                        </div>
                    </div>
                    <div class="card">
                        <h4>State Checks</h4>
                        <div class="code-block">
                            isDark(): ${color.isDark()}<br>
                            isLight(): ${color.isLight()}<br>
                            luminosity(): ${color.luminosity().toFixed(4)}
                        </div>
                    </div>
                </div>
            `;
}

function updateChannelGetters() {
	initializeChannelGetters();
}

// ==================== CHAIN EXAMPLES ====================

function updateChainExamples() {
	const baseColorInput = document.getElementById("chain-base").value;
	const container = document.getElementById("chain-examples");

	try {
		const base = new Color(baseColorInput);

		container.innerHTML = `
                    <div class="grid">
                        <div class="card">
                            <h4>Original</h4>
                            ${createColorCardContent(base.hex())}
                        </div>
                        <div class="card">
                            <h4>.lighten(0.3)</h4>
                            ${createColorCardContent(base.lighten(0.3).hex())}
                        </div>
                        <div class="card">
                            <h4>.darken(0.3)</h4>
                            ${createColorCardContent(new Color(baseColorInput).darken(0.3).hex())}
                        </div>
                        <div class="card">
                            <h4>.saturate(0.5)</h4>
                            ${createColorCardContent(new Color(baseColorInput).saturate(0.5).hex())}
                        </div>
                        <div class="card">
                            <h4>.desaturate(0.5)</h4>
                            ${createColorCardContent(new Color(baseColorInput).desaturate(0.5).hex())}
                        </div>
                        <div class="card">
                            <h4>.grayscale()</h4>
                            ${createColorCardContent(new Color(baseColorInput).grayscale().hex())}
                        </div>
                        <div class="card">
                            <h4>.rotate(90)</h4>
                            ${createColorCardContent(new Color(baseColorInput).rotate(90).hex())}
                        </div>
                        <div class="card">
                            <h4>.invert()</h4>
                            ${createColorCardContent(new Color(baseColorInput).invert().hex())}
                        </div>
                    </div>
                `;
	} catch (e) {
		container.innerHTML = `<div class="warning">Error: ${e.message}</div>`;
	}
}

function updateLightnessExamples() {
	const amount = parseFloat(document.getElementById("lighten-amount").value);
	const container = document.getElementById("lightness-examples");
	const baseColor = document.getElementById("chain-base").value;
	const base = new Color(baseColor);

	container.innerHTML = `
                <div class="grid">
                    <div class="card">
                        <h4>Original</h4>
                        ${createColorCardContent(base.hex())}
                    </div>
                    <div class="card">
                        <h4>lighten(${amount})</h4>
                        ${createColorCardContent(base.lighten(amount).hex())}
                    </div>
                    <div class="card">
                        <h4>darken(${amount})</h4>
                        ${createColorCardContent(new Color(baseColor).darken(amount).hex())}
                    </div>
                </div>
            `;
}

function updateSaturationExamples() {
	const amount = parseFloat(document.getElementById("saturate-amount").value);
	const container = document.getElementById("saturation-examples");
	const baseColor = document.getElementById("chain-base").value;
	const base = new Color(baseColor);

	container.innerHTML = `
                <div class="grid">
                    <div class="card">
                        <h4>Original</h4>
                        ${createColorCardContent(base.hex())}
                    </div>
                    <div class="card">
                        <h4>saturate(${amount})</h4>
                        ${createColorCardContent(base.saturate(amount).hex())}
                    </div>
                    <div class="card">
                        <h4>desaturate(${amount})</h4>
                        ${createColorCardContent(new Color(baseColor).desaturate(amount).hex())}
                    </div>
                </div>
            `;
}

function updateRotateExamples() {
	const degrees = parseInt(document.getElementById("rotate-amount").value);
	const container = document.getElementById("rotate-examples");
	const baseColor = document.getElementById("chain-base").value;
	const base = new Color(baseColor);

	container.innerHTML = `
                <div class="grid">
                    <div class="card">
                        <h4>Original</h4>
                        ${createColorCardContent(base.hex())}
                    </div>
                    <div class="card">
                        <h4>rotate(${degrees})</h4>
                        ${createColorCardContent(base.rotate(degrees).hex())}
                    </div>
                    <div class="card">
                        <h4>rotate(${degrees * 2})</h4>
                        ${createColorCardContent(new Color(baseColor).rotate(degrees * 2).hex())}
                    </div>
                </div>
            `;
}

// ==================== MIXING ====================

function updateMixing() {
	const color1Input = document.getElementById("mix-color1").value;
	const color2Input = document.getElementById("mix-color2").value;
	const weight = parseFloat(document.getElementById("mix-weight").value);
	const container = document.getElementById("mixing-display");

	try {
		const color1 = new Color(color1Input);
		const color2 = new Color(color2Input);
		const mixed = new Color(color1Input).mix(color2, weight);

		container.innerHTML = `
                    <div class="grid">
                        <div class="card">
                            <h4>Color 1 (100%)</h4>
                            ${createColorCardContent(color1.hex())}
                        </div>
                        <div class="card">
                            <h4>Mixed (${Math.round((1 - weight) * 100)}% / ${Math.round(weight * 100)}%)</h4>
                            ${createColorCardContent(mixed.hex())}
                        </div>
                        <div class="card">
                            <h4>Color 2 (100%)</h4>
                            ${createColorCardContent(color2.hex())}
                        </div>
                    </div>
                    <div class="code-block">
const color1 = new Color("${color1Input}");
const color2 = new Color("${color2Input}");
const mixed = color1.mix(color2, ${weight});
// Result: ${mixed.hex()}
                    </div>
                `;
	} catch (e) {
		container.innerHTML = `<div class="warning">Error: ${e.message}</div>`;
	}
}

// ==================== ACCESSIBILITY ====================

function updateAccessibility() {
	const fgInput = document.getElementById("wcag-fg").value;
	const bgInput = document.getElementById("wcag-bg").value;
	const container = document.getElementById("wcag-display");

	try {
		const fg = new Color(fgInput);
		const bg = new Color(bgInput);
		const contrast = fg.contrast(bg);
		const level = fg.level(bg);

		container.innerHTML = `
                    <div class="grid">
                        <div class="card">
                            <h4>Text Preview</h4>
                            <div style="background: ${bg.hex()}; color: ${fg.hex()}; padding: 20px; border-radius: 8px; font-size: 18px;">
                                The quick brown fox jumps over the lazy dog.
                            </div>
                        </div>
                        <div class="card">
                            <h4>WCAG Metrics</h4>
                            <div class="code-block">
Contrast Ratio: ${contrast.toFixed(2)}:1<br>
WCAG Level: ${level || "Fail"}<br>
<br>
Foreground:<br>
  hex: ${fg.hex()}<br>
  luminosity: ${fg.luminosity().toFixed(4)}<br>
  isDark: ${fg.isDark()}<br>
<br>
Background:<br>
  hex: ${bg.hex()}<br>
  luminosity: ${bg.luminosity().toFixed(4)}<br>
  isDark: ${bg.isDark()}
                            </div>
                        </div>
                    </div>
                `;
	} catch (e) {
		container.innerHTML = `<div class="warning">Error: ${e.message}</div>`;
	}
}

// ==================== OUTPUT METHODS ====================

function updateOutput() {
	const colorInput = document.getElementById("output-color").value;
	const container = document.getElementById("output-display");

	try {
		const color = new Color(colorInput);

		container.innerHTML = `
                    <div class="grid">
                        <div class="card">
                            <h4>toString()</h4>
                            <div class="code-block">${color.toString()}</div>
                        </div>
                        <div class="card">
                            <h4>hex() / hexa()</h4>
                            <div class="code-block">
hex(): "${color.hex()}"<br>
hexa(): "${color.hexa()}"
                            </div>
                        </div>
                        <div class="card">
                            <h4>rgb() / hsl()</h4>
                            <div class="code-block">
rgb(): ${JSON.stringify(color.rgb())}<br>
hsl(): ${JSON.stringify(color.hsl())}
                            </div>
                        </div>
                        <div class="card">
                            <h4>toArray() / toObject()</h4>
                            <div class="code-block">
toArray(): ${JSON.stringify(color.toArray())}<br>
toObject(): ${JSON.stringify(color.toObject())}
                            </div>
                        </div>
                        <div class="card">
                            <h4>toJSON() / toValue()</h4>
                            <div class="code-block">
toValue(): ${color.toValue()}<br>
toJSON(): ${JSON.stringify(color.toJSON())}...
                            </div>
                        </div>
                        <div class="card">
                            <h4>Preview</h4>
                            <div style="width: 100%; height: 80px; background: ${color.hex()}; border-radius: 8px; border: 2px solid #333;"></div>
                        </div>
                    </div>
                `;
	} catch (e) {
		container.innerHTML = `<div class="warning">Error: ${e.message}</div>`;
	}
}

// ==================== CHAIN BUILDER ====================

function updateChainDemo() {
	const output = document.getElementById("chain-demo-output");
	const color = new Color("#4287f5")
		.lighten(0.2)
		.saturate(0.3)
		.rotate(30)
		.fade(0.2);

	output.innerHTML = `
                Result: <strong>${color.hex()}</strong><br>
                rgba: ${color.toString()}<br>
                <div style="width: 100%; height: 40px; background: ${color.hex()}; border-radius: 4px; margin-top: 10px; border: 2px solid #333;"></div>
            `;
}

function resetChain() {
	const input = document.getElementById("chain-input").value;
	chainState = {
		color: new Color(input),
		steps: [`new Color("${input}")`],
	};
	updateChainBuilder();
}

function addToChain(method, value) {
	const step = value !== undefined ? `.${method}(${value})` : `.${method}()`;
	chainState.steps.push(step);

	if (value !== undefined) {
		chainState.color = chainState.color[method](value);
	} else {
		chainState.color = chainState.color[method]();
	}

	updateChainBuilder();
}

function updateChainBuilder() {
	const output = document.getElementById("chain-builder-output");
	const preview = document.getElementById("chain-builder-preview");

	output.textContent = `Chain: ${chainState.steps.join("")}`;
	preview.innerHTML = `
                <div class="color-display" style="margin-top: 15px;">
                    <div class="color-box" style="background-color: ${chainState.color.hex()}"></div>
                    <div class="color-info">
                        <strong>Result:</strong> ${chainState.color.hex()}<br>
                        <strong>String:</strong> ${chainState.color.toString()}
                    </div>
                </div>
            `;
}

// ==================== COLOR MODELS ====================

function initializeColorModels() {
	const models = [
		{
			name: "Hex",
			example: "#ff6b6b",
			description: "3, 4, 6, or 8 digit hex values",
		},
		{
			name: "RGB",
			example: "rgb(255, 107, 107)",
			description: "Red, Green, Blue channels",
		},
		{
			name: "RGBA",
			example: "rgba(255, 107, 107, 0.8)",
			description: "RGB with alpha channel",
		},
		{
			name: "HSL",
			example: "hsl(0, 100%, 71%)",
			description: "Hue, Saturation, Lightness",
		},
		{
			name: "HSLA",
			example: "hsla(0, 100%, 71%, 0.8)",
			description: "HSL with alpha channel",
		},
		{
			name: "HWB",
			example: "hwb(0, 0%, 29%)",
			description: "Hue, Whiteness, Blackness",
		},
		{
			name: "LAB",
			example: "lab(50, 80, 60)",
			description: "CIELAB color space",
		},
		{
			name: "LCH",
			example: "lch(50, 100, 40)",
			description: "CIELCH color space",
		},
		{
			name: "OKLAB",
			example: "oklab(0.7, 0.1, 0.1)",
			description: "Oklab color space",
		},
		{
			name: "OKLCH",
			example: "oklch(0.7, 0.1, 40)",
			description: "Oklch color space",
		},
		{
			name: "XYZ",
			example: "xyz(41, 21, 2)",
			description: "CIE XYZ color space",
		},
		{
			name: "CMYK",
			example: "cmyk(0, 58, 58, 0)",
			description: "Cyan, Magenta, Yellow, Key",
		},
	];

	const container = document.getElementById("color-models");
	models.forEach((model) => {
		const card = document.createElement("div");
		card.className = "card";
		card.innerHTML = `
                    <h3>${model.name}</h3>
                    <div class="code-block">${model.example}</div>
                    <p>${model.description}</p>
                `;
		container.appendChild(card);
	});
}

function updateColorModelExamples() {
	const colorInput = document.getElementById("color-model-input").value;
	const container = document.getElementById("color-models");

	try {
		const color = new Color(colorInput);
		
		// Clear existing content
		container.innerHTML = '';
		
		// Create color conversion examples
		const conversions = [
			{ name: "Hex", value: color.hex() },
			{ name: "Hexa", value: color.hexa() },
			{ name: "RGB", value: JSON.stringify(color.rgb()) },
			{ name: "RGBA String", value: color.toString() },
			{ name: "HSL", value: JSON.stringify(color.hsl()) },
			{ name: "HSL String", value: color.hsl().string() },
			{ name: "HSV", value: JSON.stringify(color.hsv()) },
			{ name: "HSV String", value: color.hsv().string() },
			{ name: "HWB", value: JSON.stringify(color.hwb()) },
			{ name: "HWB String", value: color.hwb().string() },
			{ name: "CMYK", value: JSON.stringify(color.cmyk()) },
			{ name: "CMYK String", value: color.cmyk().string() },
			{ name: "Array", value: JSON.stringify(color.array()) },
			{ name: "Object", value: JSON.stringify(color.object()) },
			{ name: "Unit Array", value: JSON.stringify(color.unitArray()) },
			{ name: "Percent String", value: color.percentString() },
		];

		conversions.forEach((conversion) => {
			const card = document.createElement("div");
			card.className = "card";
			card.innerHTML = `
				<h4>${conversion.name}</h4>
				<div class="code-block">${conversion.value}</div>
				<div style="width: 100%; height: 40px; background: ${color.hex()}; border-radius: 4px; margin-top: 10px; border: 2px solid #333;"></div>
			`;
			container.appendChild(card);
		});
	} catch (e) {
		container.innerHTML = `<div class="warning">Error: ${e.message}</div>`;
	}
}

// ==================== UTILITIES ====================

function createColorDisplay(label, colorString) {
	const div = document.createElement("div");
	div.className = "color-display";

	const colorBox = document.createElement("div");
	colorBox.className = "color-box";

	try {
		colorBox.style.backgroundColor = colorString;
	} catch (e) {
		colorBox.style.backgroundColor = "#ccc";
	}

	const info = document.createElement("div");
	info.className = "color-info";
	info.innerHTML = `<strong>${label}:</strong> ${colorString}`;

	div.appendChild(colorBox);
	div.appendChild(info);
	return div;
}

function createColorCardContent(hex) {
	return `
                <div style="width: 100%; height: 60px; background: ${hex}; border-radius: 8px; border: 2px solid #333; margin-bottom: 10px;"></div>
                <div class="code" style="font-family: monospace; font-size: 0.9em;">${hex}</div>
            `;
}
