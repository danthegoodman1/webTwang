var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

server.listen(8080);

app.use('/', express.static('public'));

let clientPairs = [];

io.on('connection', function (socket) {
    console.log("Client Connected")
    
    socket.on('update_username', function (data) {
        // Pair up socket clients by given username. Only broadcast angle updates to appropriate clients.
        let clientPair = clientPairs.find((el) => {
            return el.username == data.username;
        });

        if (clientPair != null) {
            // Must create first half of client pair
            if (data.hardware) {
                // Controller
                clientPairs.append({
                    hardwareId: socket.id,
                    webId: null,
                    username: data.username,
                    webSocket: null,
                    hardwareSocket: socket
                });
            } else {
                // Web interface
                clientPairs.append({
                    hardwareId: null,
                    webId: socket.id,
                    username: data.username,
                    webSocket: socket,
                    hardwareSocket: null
                });
            }
        } else {
            // Other half of client pair already exists
            if (data.hardware) {
                // Controller
                clientPair.hardwareId = socket.id;
                clientPair.hardwareSocket = socket;
            } else {
                // Web interface
                clientPair.webId = socket.id;
                clientPair.webSocket = socket;
            }
        }
    });

    socket.on('update_angle', function (data) {
        // console.log("a:" + data.angle);

        // Passthrough to web client from clientPair
        let clientPair = clientPairs.find((el) => {
            return el.hardwareId == socket.id;
        });
        if (clientPair != null) {
            clientPair.webSocket.emit("update", data);
        }
        io.emit('update', data); // Debug
    });

    socket.on('shake', function (data) {
        // console.log("s:" + data.magnitude);

        // Passthrough to web client from clientPair
        let clientPair = clientPairs.find((el) => {
            return el.hardwareId == socket.id;
        });
        if (clientPair != null) {
            clientPair.webSocket.emit("update", data);
        }
        io.emit('update', data); // Debug
    });
});
