import { hslToRgb, rgbToHsl } from "../src/color-utils/hsl";

const formats = {
    default: "[MODEL]([INT8], [INT8], [INT8])",
    defaultAlpha: "[MODEL]([INT8], [INT8], [INT8], [NORM_FLOAT])",
    cylinder: "[MODEL]([RAD], [PERCENT], [PERCENT])",
    cylinderAlpha: "[MODEL]([RAD], [PERCENT], [PERCENT], [NORM_FLOAT])"
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

	constructor([r, g, b, a]: [number, number, number, number]) {
		this._r = r;
		this._g = g;
		this._b = b;
		this._A = a;
	}

	toString() {
        if (this._model.endsWith('a')) {
            return `rgba(${this._r}, ${this._g}, ${this._b}, ${this._A})`;
        }
        return `rgb(${this._r}, ${this._g}, ${this._b})`;
	}
}

for (const channel of channels) {
	const propertyName = `_${channel}`;

    // set the color value for each channel
	Test.prototype[`${channel}`] = function (this: Test, value?: number) {
        /** @type {string} colorMode - the color mode is the same as the model without alpha */
        // convert the color to the new model not in the current model
        const currentColorMode = this._model.endsWith('a') ? this._model.slice(0, -1) : this._model;
        if (channel !== "A" && !currentColorMode.split("").includes(channel)) {

            const colorMode = models.find( m => m.split("").includes(channel) );
            // set the color value for each channel
            // convert the color to the new model
            const newColor = converters[currentColorMode].mod[colorMode](this);
            // set the new color
            for (let i = 0; i < colorMode.length; i++) {
                this[`_${colorMode[i]}`] = newColor[colorMode[i]];
            }
            // set the new color model (i.e. "hsl")
            this._model = `${colorMode}a`;
        }
        // set the color value for each channel
		if (value !== undefined) {
			this[propertyName] = value;
            return this
		}
		return this[propertyName];
	};
}

for (const model of modelsWithAlpha) {
	Test.prototype[`${model}`] = setGet;

    /**
     * set and get the color in the new model
     * @param value
     */
	function setGet(this: Test, value?: number[]) {
        /** @type {string} colorMode - the color mode is the same as the model without alpha */
        let colorMode: string = model;

        // check if the current model has alpha and remove it
        let currentColorMode = this._model;
        if (currentColorMode.endsWith('a')) {
            currentColorMode = currentColorMode.slice(0, -1)
        };

        // check if the alpha is enabled and store it
        const hasAlpha = model.endsWith('a');
        if (hasAlpha) {
            // remove the alpha channel from the model
            colorMode = model.slice(0, -1);
        }


        // Handle model change
		if (colorMode !== currentColorMode) {
            // convert the color to the new model
			const newColor = converters[currentColorMode].mod[colorMode](this);
            // set the new color
            for (let i = 0; i < colorMode.length; i++) {
                this[`_${colorMode[i]}`] = newColor[colorMode[i]];
            }
            // set the new color model (i.e. "hsl")
            this._model = model;
		}

        // setter
		if (value !== undefined) {
            // for each channel set the value
			for (let i = 0; i < colorMode.length; i++) {
				this[`_${colorMode[i]}`] = value[i];
			}
            if (hasAlpha) {
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
        if (hasAlpha) {
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
});

export default Test;
