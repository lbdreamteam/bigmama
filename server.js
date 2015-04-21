var express = require('express'),
    app = express(),
    http = require('http'),
    server = http.createServer(app);
    clc = require('cli-color');

app.use(express.static(__dirname));

/************ VARIABILI GLOBALI ************/
var clients = {},
    EurecaServer = require('eureca.io').EurecaServer,
    eurecaServer = new EurecaServer({ allow: ['serverHandler', 'authentication'] }),
    callsCounter = 0,
    calls = {},
    posTable = { oldPos: {}, nowPos: {} },
    states = { counter: 0, times: {}, pos: {} },
    nowConnected = {},
    nowUpdating = {},
    t = 0;

eurecaServer.attach(server);
t = Date.now();

var updateInterval = setInterval(function () {
    posTable.oldPos = JSON.parse(JSON.stringify(posTable.nowPos));
    //for (var client in nowConnected) {
    //    //notifica
    //    for (var other in clients) if (other != client) clients[other].remote.onOtherPlayerConnect(client, posTable.oldPos[client], posTable.nowPos[client]);
    //    //fa lo spawn
    //    clients[client].remote.spawnOtherPlayers(posTable);
    //    delete nowConnected[client];
    //}
    //var updatingPos = getUpdatingPos();
    //for (var client in nowUpdating) clients[client].remote.updateOtherPlayers(updatingPos);
    nowUpdating = JSON.parse(JSON.stringify(clients));
}, 100);

var getUpdatingPos = function () {
    var updatingPos = {};
    for (var client in nowUpdating) updatingPos[client] = posTable.nowPos[client];
    return updatingPos;
}

/************ EURECA - ON CONNECT ************/
eurecaServer.onConnect(function (conn) {
    console.log('New Client asking for connection... --Id=%s ', conn.id, conn.remoteAddress);
    var remote = eurecaServer.getClient(conn.id);
    remote.authentication();
    console.log('Requiring authentication to ' + conn.id +'...');
    //clients[conn.id] = { id: conn.id, remote: remote, state: { x: 1, y: 1 } };
    //posTable.nowPos[conn.id] = clients[conn.id].state;
    //remote.serverHandler({ event: 'createGame', params: { id: conn.id, Tx: clients[conn.id].state.x, Ty: clients[conn.id].state.y } });
    //nowConnected[conn.id] = Date.now();
    //console.log(nowUpdating[conn.id]);
    //delete nowUpdating[conn.id]; //Questa riga credo sia inutile
});

eurecaServer.exports.sendAuth = function (uId) {
    console.log('Received authentication for player ' + uId + ' at ' + Date.now() + '...verifing...');
    var req = http.request({
        host: 'localhost',
        port: '8080',
        path: '/api/auth/' + uId + '/istanza',
        method: 'GET'
    }, function (res) {
        res.on('data', function (chunk) {
            if (JSON.parse(chunk).response) console.log(clc.green(uId + ' Authorized'))
            else console.log(clc.red(uId + ' failed authentication!'));
        });
    });
    req.end();
}

/************ EURECA - ON DISCONNECT ************/
eurecaServer.onDisconnect(function (conn) {
    console.log('Client disconnected ', conn.id);
    var removeId = clients[conn.id].id;
    delete clients[conn.id];
    //delete nowUpdating[conn.id];
    delete posTable.oldPos[conn.id];
    delete posTable.nowPos[conn.id];
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
        function sendInput(increment, clientId, callId) {
            console.log(increment);
            clients[clientId].state.x += increment.x;
            clients[clientId].state.y += increment.y;
            calls[callsCounter] = clients[clientId].state;
            posTable.nowPos[clientId] = clients[clientId].state;
            callsCounter++;
            clients[clientId].remote.updatePlayer(clients[clientId].state.x, clients[clientId].state.y, callId);

            console.log('Count: '+ callsCounter + ' for client: ' + clientId + ' at: ' + clients[clientId].state.x + '   ' + clients[clientId].state.y + ' time: ' + Date.now());
        };

        return {
            SendInput: sendInput
        };
    }());

    return {
        Player : player
    };
}());

server.listen(process.env.PORT || 8001);