import {hslToRgb, rgbToHsl} from "../src/color-utils/hsl";

/** the unit used as a color type (e.g. "number", "percent", "degrees"...) */
export type FormatOptions = Record<
    string,
    {
        radix?: number;
        min?: number;
        max?: number;
        suffix?: string;
        decimalPlaces?: number;
        formatter?: (value: number) => number;
    }
>;

function detectAlpha(model: string) {
    return model.endsWith('a')
}

function removeAlpha(model: string) {
    return model.slice(0, -1)
}

function formatValue(value: string, channelsValuesArray: number[]): string {
    const [channel, formaName ] = value.split(":")
    if (channel === "A") {
        // the alpha channel is always normalized to 1, we just need to return it
        return channelsValuesArray[3].toString()
    }

    const channelID = Number(channel)
    let newValue: number | string = channelsValuesArray[channelID - 1];
    const formatter = formatOptions[formaName];
    if (formatter?.min && newValue < formatter.min) {
        newValue = formatter.min;
    }

    if (formatter?.max && newValue > formatter.max) {
        newValue = formatter.max;
    }

    if (formatter?.decimalPlaces) {
        newValue = Number(newValue).toFixed(formatter.decimalPlaces);
    }

    if (formatter?.radix && formatter?.radix !== 10) {
        newValue = newValue.toString(formatter.radix);
    }

    return formatter?.suffix !== undefined ? `${newValue}${formatter.suffix}` : newValue.toString();
}

function extractOptions(input: string, channelValues: number[]):string {
    const regex = /\[([^\]]+)\]/g;
    let result = input;

    for (const match of input.matchAll(regex)) {
        const formattedValue = formatValue(match[1], channelValues);
        result = result.replaceAll(match[0], formattedValue);
    }

    return result;
}

export type FORMAT = keyof FormatOptions;
export const formatOptions: FormatOptions = {
    string: {},
    INT8: {
        min: 0,
        max: 255,
        decimalPlaces: 0,
    },
    hex: {
        radix: 16,
        min: 0,
        max: 255,
        decimalPlaces: 0,
    },
    NORMALIZED: {
        min: 0,
        max: 1,
        decimalPlaces: 4
    },
    float16: {
        min: 0,
        max: 100,
        decimalPlaces: 2,
    },
    PERCENT: {
        min: 0,
        max: 100,
        suffix: "%",
        decimalPlaces: 0,
    },
    DEGREE: {
        min: 0,
        max: 360,
        suffix: "deg",
        decimalPlaces: 0,
    },
};

const formats = {
    hex: "#[1:HEX][2:HEX][3:HEX]",
    hexAlpha: "#[1:HEX][2:HEX][3:HEX][A:HEX]",
    default: "[1:INT8], [2:INT8], [3:INT8]",
    defaultAlpha: "[1:INT8], [2:INT8], [3:INT8], [A:NORMALIZED]",
    hsl: "[1:DEGREE], [2:PERCENT], [3:PERCENT]",
    hslAlpha: "[1:DEGREE], [2:PERCENT], [3:PERCENT], [A:NORMALIZED]",
    modern: "[1:DEGREE] [2:PERCENT] [3:PERCENT]",
    modernAlpha: "[1:DEGREE] [2:PERCENT] [3:PERCENT] / [A:NORMALIZED]"
}

const converters ={
    rgb: {
        channels: ["r", "g", "b"],
        mod: {
            hsl: (current: Test) => rgbToHsl({r: current._r, g: current._g, b: current._b})
        },
        format: {
            default: formats.default,
            alpha: formats.defaultAlpha,
        }
    },
    hsl: {
        channels: ["h", "s", "l"],
        mod: {
            rgb: (current: Test) => hslToRgb({h: current._h, s: current._s, l: current._l})
        },
        format: {
            default: formats.hsl,
            alpha: formats.hslAlpha,
        }
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


    getModelByChannel(channel: string) {
        for (const model of Object.keys(converters)) {
            if (converters[model].channels.includes(channel)) {
                return model;
            }
        }
        // if the color mode is not found, throw an error
        throw new Error( `Channel ${channel} not found in models` );
    }

    getFullModel(): string {
        return !this._alphaEnabled ? this._model : `${this._model}a`;
    }

    getChannelValues() {
        const channelValues = converters[this._model].channels.map((channel: string) => {
            return this[`_${channel}`];
        })

        // add the alpha channel if needed
        if (this._alphaEnabled) {
            channelValues.push(this._A);
        }

        return channelValues
    }

	toString() {
        // get the string with the markup to follow
        const format = converters[this._model].format[this._alphaEnabled ? "alpha" : "default"];
        // rgba
        const colorMode = this.getFullModel();
        // [100,20,30]
        const channelValues = this.getChannelValues()


        return `${colorMode}(${extractOptions(format, channelValues)})`;
	}
}

for (const channel of channels) {
	const propertyName = `_${channel}`;

    // set the color value for each channel
	Test.prototype[`${channel}`] = function (this: Test, value?: number) {
        // convert the color to the new model not in the current model
        /** @type {string} colorMode - the color mode is the same as the model without alpha */
        // check if the channel is in the current color mode otherwise convert the color to the new model
        if (channel !== "A" && !converters[this._model].channels.includes( channel )) {
            // get the color mode for the channel from the model
            const colorMode = this.getModelByChannel( channel );
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

for (const model of modelsWithAlpha) {
	Test.prototype[`${model}`] = setGet;

    /** @type {string} colorMode - the color mode is the same as the model without alpha */
    let currentModel: string = model;

    // check if the alpha is enabled and store it
    const alphaEnabled = detectAlpha(model);
    if (alphaEnabled) {
        // remove the alpha channel from the model
        currentModel = removeAlpha(model)
    }

    /**
     * set and get the color in the new model
     * @param value
     */
	function setGet(this: Test, value?: number[]) {

        // Handle model change
		if (currentModel !== this._model) {
            // convert the color to the new model
			const newColor = converters[this._model].mod[currentModel](this);
            // set the new color
            for (let i = 0; i < currentModel.length; i++) {
                this[`_${currentModel[i]}`] = newColor[currentModel[i]];
            }
            // set the new color model (i.e. "hsl")
            this._model = currentModel;
            // set the alpha status
            this._alphaEnabled = alphaEnabled;
		}

        // setter
		if (value !== undefined) {
            // for each channel set the value
			for (let i = 0; i < currentModel.length; i++) {
				this[`_${currentModel[i]}`] = value[i];
			}
            if (alphaEnabled) {
                this._A = value[3];
            }
			return this;
		}

		// getter
		const v = [];
        // for each channel get the value
		for (let i = 0; i < currentModel.length; i++) {
			v.push(this[`_${currentModel[i]}`]);
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
