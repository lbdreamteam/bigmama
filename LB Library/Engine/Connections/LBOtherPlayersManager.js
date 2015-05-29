var otherPlayersManager = (function () {

    var onConnect = function (id, oldPos, nowPos) {
        console.log(oldPos);
        gameInstance.clientsList[id] = new LBOtherPlayer(gameInstance, oldPos.Tx, oldPos.Ty, 'player', id);
        console.log('Manager Said: --ONCONNECT --New OtherPlayer --Spawn: ' + oldPos.Tx + ';' + oldPos.Ty + ' --NowPos: ' + nowPos.Tx + ';' + nowPos.Ty);
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
                console.log('Spawning: ' + client);
                console.log(posTable);
                gameInstance.clientsList[client] = new LBOtherPlayer(gameInstance, posTable.oldPos[client].Tx, posTable.oldPos[client].Ty, 'player', client);
                console.log('Manager Said: --ONSPAWN --New OtherPlayer --Spawn: ' + posTable.oldPos[client].Tx + ';' + posTable.oldPos[client].Ty + ' --NowPos: ' + posTable.nowPos[client].Tx + ';' + posTable.nowPos[client].Ty);
                gameInstance.otherPlayersW.worker.postMessage({ event: 'connect', params: { id: client, oldPos: { x: posTable.oldPos[client].Tx, y: posTable.oldPos[client].Ty }, nowPos: { x: posTable.nowPos[client].Tx, y: posTable.nowPos[client].Ty } } });
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