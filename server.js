var express = require('express')
  , app = express(app)
  , server = require('http').createServer(app);

app.use(express.static(__dirname));

/************ VARIABILI GLOBALI ************/
var clients = {},
    EurecaServer = require('eureca.io').EurecaServer,
    eurecaServer = new EurecaServer({ allow: ['createGame', 'updatePlayer', 'updateOtherPlayers', 'onOtherPlayerConnect', 'onOtherPlayerDisconnect', 'spawnOtherPlayers'] });

eurecaServer.attach(server);

var updateInterval = setInterval(function () {
    for (var client in clients) {
        clients[client].remote.updateOtherPlayers(clients);
    }
}, 100);

/************ EURECA - ON CONNECT ************/
eurecaServer.onConnect(function (conn) {
    console.log('New Client id=%s ', conn.id, conn.remoteAddress);
    var remote = eurecaServer.getClient(conn.id);    clients[conn.id] = { id: conn.id, remote: remote, state: { x: 64, y: 64 } };
    remote.createGame(conn.id, clients[conn.id].state.x, clients[conn.id].state.y);
    remote.spawnOtherPlayers(clients);
    for (var client in clients) {
        console.log(clients[client].state.x);
        if (client != conn.id) {
            if (clients[client].remote) {
                clients[client].remote.onOtherPlayerConnect(conn.id, clients[conn.id].state.x, clients[conn.id].state.y);
            }
        }
    }
});

/************ EURECA - ON DISCONNECT ************/
eurecaServer.onDisconnect(function (conn) {
    console.log('Client disconnected ', conn.id);
    var removeId = clients[conn.id].id;
    delete clients[conn.id];

    for (var client in clients) {
        if (client != conn.id) {
            if (clients[client].remote) clients[client].remote.onOtherPlayerDisconnect(conn.id);
        }
    }
});

/************ CLIENT MANAGEMENT ************/
eurecaServer.exports.ClientManagement = (function () {

    /************ PLAYER MANAGEMENT ************/
    var player = (function () {

        var tileSize = 32;
        /************ PLAYER MANAGEMENT - SEND INPUT ************/
        function sendInput(input, clientId, callId) {
            switch (input) {
                case 'up':
                    clients[clientId].state.y -= tileSize;
                    break;
                case 'down':
                    clients[clientId].state.y += tileSize;
                    break;
                case 'right':
                    clients[clientId].state.x += tileSize;
                    break;
                case 'left':
                    clients[clientId].state.x -= tileSize;
                    break;
                case 'up-right':
                    clients[clientId].state.x += tileSize;
                    clients[clientId].state.y -= tileSize;
                    break;
                case 'up-left':
                    clients[clientId].state.x -= tileSize;
                    clients[clientId].state.y -= tileSize;
                    break;
                case 'down-right':
                    clients[clientId].state.x += tileSize;
                    clients[clientId].state.y += tileSize;
                    break;
                case 'down-left':
                    clients[clientId].state.x -= tileSize;
                    clients[clientId].state.y += tileSize;
                    break;
                case 'null':
                    break;
                default:
                    console.log('Qualcosa non ha funzionato nel rilevare l input');
                    break;
            }

            clients[clientId].remote.updatePlayer(clients[clientId].state.x, clients[clientId].state.y, callId);

            console.log('Count: '+ callId + ' - ' + clients[clientId].state.x + '   ' + clients[clientId].state.y);
        };

        return {
            SendInput: sendInput
        };
    }());

    return {
        Player : player
    };
}());

server.listen(process.env.PORT);