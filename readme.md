# webTwang

## What is this?

A web version of the game twang (just google twang github), a 1 dimensional dungeon crawler game that we decided to make into a web interface instead of using ws2812b leds for the display. Uses the accelerometer on a circuit playground express, streams that over websocket to the server, then updates the web client to reflect the movement.

### Device Server

The server that sends the device data to the server

## Firmware

The firmware for the circuit playground express to send data out through serial

### webServerAndClient

The big ol' folder that uses nextjs and a custom global state manager plus a beautiful ui that I made to represent the game
