import { hslToRgb, rgbToHsl } from "../src/color-utils/hsl";

const formats = {
    default: "[MODEL]([CH1:INT8], [CH2:INT8], [CH3:INT8])",
    defaultAlpha: "[MODEL]([CH1:INT8], [CH2:INT8], [CH3:INT8], [A:NORM_FLOAT])",
    cylinder: "[MODEL]([CH1:RAD], [CH2:PERCENT], [CH3:PERCENT])",
    cylinderAlpha: "[MODEL]([CH1:RAD], [CH2:PERCENT], [CH3:PERCENT], [A:NORM_FLOAT])"
}

const converters ={
    rgb: {
        channels: ["r", "g", "b"],
        mod: {
            hsl: (current: Test) => rgbToHsl({r: current._r, g: current._g, b: current._b})
        },
        format: formats.default,
        formatAlpha: formats.defaultAlpha,
    },
    hsl: {
        channels: ["h", "s", "l"],
        mod: {
            rgb: (current: Test) => hslToRgb({h: current._h, s: current._s, l: current._l})
        },
        format: formats.cylinder,
        formatAlpha: formats.cylinderAlpha,
    },
}

// collect Channels
const channels: Set<string> = new Set();
channels.add("A");
for (const model in converters) {
    for (const currentChannel of converters[model].channels) {
        channels.add( currentChannel );
    }
}

// collect models
const models = Object.keys(converters);
// the cloned array duplicating model and model + "a"
const modelsWithAlpha = [...models, ...models.map(m => `${m}a`)];

class Test {
    _r = 0;
    _g = 0;
    _b = 0;
    _h = 0;
    _s = 0;
    _l = 0;
    _A = 1;
	_model = "rgb";
    _alphaEnabled = true;

	constructor([r, g, b, a]: [number, number, number, number]) {
		this._r = r;
		this._g = g;
		this._b = b;
		this._A = a;
	}

	toString() {
        //TODO follow the model format in converters.[model].format
        const channels = converters[this._model].channels.map((channel, i) => {
            return this[`_${channel}`] + (this._model.startsWith('hsl') ? (i === 0 ? "deg" : "%") : "");
        })
        if (this._alphaEnabled) {
            return `${this._model}(${channels[0]}, ${channels[1]}, ${channels[2]}, ${this._A})`;
        }
        return `${this._model}(${channels[0]}, ${channels[1]}, ${channels[2]})`;
	}
}


function detectModel(channel: string) {
    for (const model in converters) {
        if (converters[model].channels.includes(channel)) {
            return model;
        }
    }
}

for (const channel of channels) {
	const propertyName = `_${channel}`;

    // set the color value for each channel
	Test.prototype[`${channel}`] = function (this: Test, value?: number) {
        // convert the color to the new model not in the current model
        /** @type {string} colorMode - the color mode is the same as the model without alpha */
        // check if the channel is in the current color mode otherwise convert the color to the new model
        if (channel !== "A" && !this._model.split("").includes(channel)) {
            // get the color mode for the channel from the model
            const colorMode = detectModel( channel );
            // if the color mode is not found, throw an error
            if (!colorMode) throw new Error( `Channel ${channel} not found in models` );
            // set the color value for each channel and convert the color to the new model
            const newColor = converters[this._model].mod[colorMode](this);
            // set the new value for each channel
            for (let i = 0; i < colorMode.length; i++) {
                this[`_${colorMode[i]}`] = newColor[colorMode[i]];
            }
            // set the new color model (i.e. "hsl")
            this._model = colorMode;
        }
        // set the color value for each channel
		if (value !== undefined) {
			this[propertyName] = value;
            return this
		}
		return this[propertyName];
	};
}

function detectAlpha(model: string) {
    return model.endsWith('a')
}

function removeAlpha(model: string) {
    return model.slice(0, -1)
}

for (const model of modelsWithAlpha) {
	Test.prototype[`${model}`] = setGet;

    /** @type {string} colorMode - the color mode is the same as the model without alpha */
    let colorMode: string = model;

    // check if the alpha is enabled and store it
    const alphaEnabled = detectAlpha(model);
    if (alphaEnabled) {
        // remove the alpha channel from the model
        colorMode = removeAlpha(model)
    }

    /**
     * set and get the color in the new model
     * @param value
     */
	function setGet(this: Test, value?: number[]) {

        // check if the current model has alpha and remove it
        const currentColorMode = this._alphaEnabled ? this._model : `${this._model}a`;

        // Handle model change
		if (colorMode !== this._model) {
            // convert the color to the new model
			const newColor = converters[currentColorMode].mod[colorMode](this);
            // set the new color
            for (let i = 0; i < colorMode.length; i++) {
                this[`_${colorMode[i]}`] = newColor[colorMode[i]];
            }
            // set the new color model (i.e. "hsl")
            this._model = colorMode;
		}

        // setter
		if (value !== undefined) {
            // for each channel set the value
			for (let i = 0; i < colorMode.length; i++) {
				this[`_${colorMode[i]}`] = value[i];
			}
            if (alphaEnabled) {
                this._A = value[3];
            }
			return this;
		}

		// getter
		const v = [];
        // for each channel get the value
		for (let i = 0; i < colorMode.length; i++) {
			v.push(this[`_${colorMode[i]}`]);
		}
        if (alphaEnabled) {
            v.push(this._A);
        }
		return v;
	}
}


Object.assign(Test.prototype, {
	lighten: function (this: Test, value: number) {
		if (this._model === "hsl") {
			this._l += value;
		} else {
			this._r += value;
			this._g += value;
			this._b += value;
		}
		return this;
	},
    darken: function (this: Test, value: number) {
        if (this._model === "hsl") {
            this._l -= value;
        } else {
            this._r -= value;
            this._g -= value;
            this._b -= value;
        }
        return this;
    }
});

export default Test;
