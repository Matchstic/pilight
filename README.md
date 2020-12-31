# PiLight
 A HomeBridge-focused RGB light, controlled over HTTP

## Hardware

You will need:

- A Raspberry Pi (2B or newer, I used a Pi Zero W)
- A [Unicorn pHAT](https://shop.pimoroni.com/products/unicorn-phat)
- [optional] USB WiFi dongle for older hardware

## Setup

1. Make sure node.js is installed on your Pi (v11.9.0 was used in testing)
2. Clone this repo to some directory (e.g. `/home/pi/pilight`) on the Pi:

`git clone https://github.com/Matchstic/PiLight.git`

3. Install node modules:

`npm install`

4. Update `pilight.service` so that it points to the right directory for the `ExecStart` parameter.
5. Setup the service file:

```
sudo cp ./pilight.service /lib/systemd/system/
sudo systemctl enable pilight.service
sudo systemctl start pilight.service
```

6. Light service is now running

## HomeBridge

The endpoints exposed by this project should be consumed by HomeBridge, using the [homebridge-better-http-rgb](https://www.npmjs.com/package/homebridge-better-http-rgb) plugin.

On your device running HomeBridge:

1. Install the plugin:

`npm install -g homebridge-better-http-rgb`

2. Update accessory config with this:

```
"accessories": [
    {
        "accessory": "HTTP-RGB",
        "name": "Mood Light",
        "service": "Light",
        "switch": {
            "status": "http://<light-ip>:3000/power/status",
            "powerOn": "http://<light-ip>:3000/power/on",
            "powerOff": "http://<light-ip>:3000/power/off"
        },
        "brightness": {
            "status": "http://<light-ip>:3000/brightness",
            "url": "http://<light-ip>:3000/brightness/%s"
        },
        "color": {
            "status": "http://<light-ip>:3000/color",
            "url": "http://<light-ip>:3000/color/%s",
            "brightness": true
        }
    }
]
```

3. Restart HomeBridge
4. The light should now appear in the Home app
