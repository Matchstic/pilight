const express = require('express');
const State = require('./state');
const PORT = 3000;

const state = new State();

let app = express();

// Current brightness
app.get('/brightness', (req, res) => {
    res.send('' + state.brightness);
});

// Set brightness
app.get('/brightness/:value', (req, res) => {
    state.brightness = req.params.value;
    res.send();
});

// Current colour
app.get('/color', (req, res) => {
    res.send(state.colour);
});

// Set colour
app.get('/color/:value', (req, res) => {
    state.colour = req.params.value;
    res.send();
});

// Current power status
app.get('/power/status', (req, res) => {
    res.send(state.power ? '1' : '0');
});

// Turn on
app.get('/power/on', (req, res) => {
    state.on();
    res.send();
});

// Turn off
app.get('/power/off', (req, res) => {
    state.off();
    res.send();
});

const server = app.listen(PORT, '0.0.0.0', function () {
    console.log('Server started on port ' + PORT);
});