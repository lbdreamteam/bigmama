var OtherPlayersManager = (function () {

    var positions = {};

    var onConnect = function (id, x, y) {
        clientsList[id] = new LBOtherPlayer(gameInstance, x, y, 'player', id);
        positions[id] = { counter: 0, isPending: false, pendingPositions: {}, lastPosition: { x: x, y: y } };
    };

    var onDisconnect = function (id) {
        clientsList[id].kill();
    };

    var update = function (positionsTable) {
        for (var client in positionsTable) {
            if (client != myId) {
                var clientPositions = positions[client];
                //otherPlayers.setItem(client, positionsTable[client]);
                //var tween = clientsList[client].game.add.tween(clientsList[client]).to({ x: positionsTable[client].state.x, y: positionsTable[client].state.y }, 100, Phaser.Easing.Linear.None, false, 0, 0, false);
                //tween.start();
                if (!clientsList[client].isMoving) {
                    clientsList[client].createTween(clientsList[client], { x: positionsTable[client].state.x, y: positionsTable[client].state.y }, null, null, null, 175, Phaser.Easing.Linear.None);
                }
                else {

                }
                //clientsList[client].x = positionsTable[client].state.x;
                //clientsList[client].y = positionsTable[client].state.y;
            }
        }
    };

    var spawn = function (positionsTable) {
        for (var client in positionsTable) {
            if (client != myId) {
                console.log('Connected: ' + client);
                //otherPlayers.setItem(client, positionsTable[client]);
                clientsList[client] = new OtherPlayer(gameInstance, positionsTable[client].state.x, positionsTable[client].state.y, 'player', client);
            }
        }
    }

    return {
        OnConnect: onConnect,
        OnDisconnect: onDisconnect,
        Update: update,
        Spawn: spawn
    };
}());