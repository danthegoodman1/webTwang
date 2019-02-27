if (process.argv.length < 3) {
	console.log("Username required");
	process.exit();
}


const serverURL = 'http://192.168.1.26:8080'
const serialPath = '/dev/cu.usbmodem14101'


const SerialPort = require('serialport')
const Readline = require('@serialport/parser-readline')
const port = new SerialPort(serialPath, { baudRate: 9600 })

var io = require('socket.io-client');
var socket = io.connect(serverURL, {reconnect: true});

const parser = new Readline()
port.pipe(parser)

socket.on('connect', function (s) {
    console.log('Connected!');
    // socket.emit("update_username", { 
    // 	username: process.argv[2],
    // 	// hardware: true
    // })
});

parser.on('data', (line) => {
	// console.log(line);
	let command = line.split(":");
	if (command[0] == 'a') {
		// Update Angle
		socket.emit("update_angle", { angle: command[1] });
	} else if (command[0] == 's') {
		// Shake Detected
		console.log("SHAKE");
		socket.emit("shake", { magnitude: command[1] });
	}
});