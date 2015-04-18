var otherPlayersManager = (function () {

    var onConnect = function (id, oldPos, nowPos) {
        gameInstance.clientsList[id] = new LBOtherPlayer(gameInstance, oldPos.x, oldPos.y, 'player', id);
        console.log('Manager Said: --ONCONNECT --New OtherPlayer --Spawn: ' + oldPos.x + ';' + oldPos.y + ' --NowPos: ' + nowPos.x + ';' + nowPos.y);
        gameInstance.otherPlayersW.worker.postMessage({ event: 'connect', params: { id: id, oldPos: oldPos, nowPos: nowPos } });
    }

    var onDisconnect = function (id) {
        gameInstance.clientsList[id].kill();
        gameInstance.otherPlayersW.worker.postMessage({ event: 'disconnect', params: id });
    };

    var update = function (nowPos) {
        gameInstance.otherPlayersW.worker.postMessage({ event: 'update', params: nowPos });
    };

    var spawn = function (posTable) {
        for (var client in posTable.oldPos) {
            if (client != myId) {
                gameInstance.clientsList[client] = new LBOtherPlayer(gameInstance, posTable.oldPos[client].x, posTable.oldPos[client].y, 'player', client);
                console.log('Manager Said: --ONSPAWN --New OtherPlayer --Spawn: ' + posTable.oldPos[client].x + ';' + posTable.oldPos[client].y + ' --NowPos: ' + posTable.nowPos[client].x + ';' + posTable.nowPos[client].y);
                gameInstance.otherPlayersW.worker.postMessage({ event: 'connect', params: { id: client, oldPos: { x: posTable.oldPos[client].x, y: posTable.oldPos[client].y }, nowPos: { x: posTable.nowPos[client].x, y: posTable.nowPos[client].y } } });
            }
        }
    };

    return {
        onConnect: onConnect,
        onDisconnect: onDisconnect,
        update: update,
        spawn: spawn
    };
}());