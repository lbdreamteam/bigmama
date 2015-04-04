LBOtherPlayerWorkerClass = function (path, listener, handlers) {
    this.worker = new Worker(path);

    if (typeof handlers === 'undefined' || !handlers) handlers = (function () {
        var onPushPositions = function (params) {
            if (!params.client || !params.pointer) console.log('ERROR at onPushPosition: params are not set correctly.')
            else {
                gameInstance.clientsList[params.client].cMovement.move(
                    { x: params.pointer.x * gameInstance.movementGridSize - gameInstance.movementGridSize / 2, y: params.pointer.y * gameInstance.movementGridSize - gameInstance.movementGridSize / 2},
                    function (_agent, input) {
                        gameInstance.clientsList[params.client].currentTile = params.pointer;
                        console.log('Worker Class said: New currentTile for ' + params.client + ' --Values: ' + params.pointer.x + ';' + params.pointer.y + ' --Pixels: ' + gameInstance.clientsList[params.client].x + ';' + gameInstance.clientsList[params.client].y);
                        gameInstance.otherPlayersW.worker.postMessage({ event: 'startMoving', params: params.client });
                    },
                    function (_agent) {
                        gameInstance.otherPlayersW.worker.postMessage({ event: 'requestPosition', params: params.client });
                    },
                    null,
                    175,
                    Phaser.Easing.Linear.None,
                    false);
            }
        };

        return {
            onPushPositions: onPushPositions
        };
    }());

    if (typeof listener === 'undefined' || !listener) listener = function (e) {
        if (e.data.event) {
            switch (e.data.event) {
                case 'pushPosition':
                    if (!handlers.onPushPositions) {
                        console.log('Handler onPushPosition is not defined');
                        return;
                    }
                    handlers.onPushPositions(e.data.params);
                    break;
            }
        }
        else console.log('Worker said: ' + e.data);
    };

    this.worker.addEventListener('message', listener, false);
};

LBOtherPlayerWorkerClass.prototype.constructor = LBOtherPlayerWorkerClass;