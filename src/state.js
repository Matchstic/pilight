const NUMBER_OF_LEDS = 32; // 32 leds in the Unicorn pHat

const strip = require('rpi-ws281x-native');
const fs = require('fs');
const path = require('path');

const STATE_PATH = path.resolve(__dirname, './state.json');

module.exports = class State {
    constructor() {
        this.leds = [
            0,0,0,0,0,0,0,0,
            0,0,0,0,0,0,0,0,
            0,0,0,0,0,0,0,0,
            0,0,0,0,0,0,0,0
        ];
        this.power_ = true;

        // Load last known state from disk, if possible
        if (fs.existsSync(STATE_PATH)) {
            const rawdata = fs.readFileSync(STATE_PATH);
            const parsed = JSON.parse(rawdata);

            this.brightness_ = parsed.brightness;
            this.colour_ = parsed.colour;
            this.power_ = parsed.power;
        } else {
            this.brightness_ = 0;
            this.colour_ = '000000';
        }

        // Set initial state
        if (this.power_)
            this.on();
    }

    get brightness() {
        return this.brightness_;
    }

    // Accepts number 0 to 100
    set brightness(value) {
        if (value > 100) value = 100;
        if (value < 0) value = 0;

        this.updateBrightness(value);

        this.brightness_ = value;
        this.flushState();
    }

    get colour() {
        return this.colour_;
    }

    // Accepts 6-digit hex string
    set colour(value) {
        this.updateColour(value);

        this.colour_ = value;
        this.flushState();
    }

    get power() {
        return this.power_;
    }

    on() {
        this.power_ = true;
        strip.init(NUMBER_OF_LEDS);

        this.updateColour(this.colour_);
        this.updateBrightness(this.brightness_);

        this.flushState();
    }

    off() {
        this.power_ = false;
        strip.reset();

        this.flushState();
    }

    updateBrightness(value) {
        // Convert to 255 range
        const parsed = parseInt(value);
        const scaled = Math.floor((parsed / 100) * 255);

        console.log('setting brightness', scaled);

        strip.setBrightness(scaled);
    }

    updateColour(value) {
        // Colour is expected to be grb, but we recieve rgb
        // Rotate middle bits around with string magic
        const fixed = value.slice(2, 4) + value.slice(0, 2) + value.slice(4, 6);

        console.log('setting colour', fixed);

        const hex = parseInt(fixed, 16);
        for (let i = 0; i < this.leds.length; i++) {
            this.leds[i] = hex;
        }

        strip.render(this.leds);
    }

    flushState() {
        const data = JSON.stringify({
            brightness: this.brightness_,
            colour: this.colour_,
            power: this.power_
        });

        fs.writeFileSync(STATE_PATH, data);
    }
}