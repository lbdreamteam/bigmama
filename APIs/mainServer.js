var express = require('express')
  , app = express(app)
  , server = require('http').createServer(app);

app.use(express.static(__dirname));

/************ VARIABILI GLOBALI ************/
var clients = {},
    EurecaServer = require('eureca.io').EurecaServer,
    eurecaServer = new EurecaServer({ allow: 'serverHandler' }),
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
    for (var client in nowConnected) {
        //notifica
        for (var other in clients) if (other != client) clients[other].remote.onOtherPlayerConnect(client, posTable.oldPos[client], posTable.nowPos[client]);
        //fa lo spawn
        clients[client].remote.spawnOtherPlayers(posTable);
        delete nowConnected[client];
    }
    var updatingPos = getUpdatingPos();
    for (var client in nowUpdating) clients[client].remote.updateOtherPlayers(updatingPos);
    nowUpdating = JSON.parse(JSON.stringify(clients));
}, 100);

var getUpdatingPos = function () {
    var updatingPos = {};
    for (var client in nowUpdating) updatingPos[client] = posTable.nowPos[client];
    return updatingPos;
}

/************ EURECA - ON CONNECT ************/
eurecaServer.onConnect(function (conn) {
    console.log('New Client id=%s ', conn.id, conn.remoteAddress);
    console.log('ciao');
    var remote = eurecaServer.getClient(conn.id);
    console.log(remote);
    for (var p in remote) {
        console.log(remote[p]);
    }
    clients[conn.id] = { id: conn.id, remote: remote, state: { x: 1, y: 1 } };
    posTable.nowPos[conn.id] = clients[conn.id].state;
    remote.serverHandler({ event: 'createGame', params: { id: conn.id, Tx: clients[conn.id].state.x, Ty: clients[conn.id].state.y } });
    //remote.createGame(conn.id, clients[conn.id].state.x, clients[conn.id].state.y);
    nowConnected[conn.id] = Date.now();
    delete nowUpdating[conn.id];
});

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

        var tileSize = 48;
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