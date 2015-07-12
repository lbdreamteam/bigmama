LBOtherPlayersWorkerModule = function (listener, handlers) {
    //Creazione del worker
    this.version = 'v0.0.2.2';
    this.workerPath = 'LB Library/Engine/Connections/LBOtherPlayersWorker.js';
    this.worker = new Worker(this.workerPath);
    this.handlers = {};

    //Definizione degli handler dei messaggi
    if (typeof handlers === 'undefined' || !handlers) this.handlers = {
        'onPushPositions': function (params) {
            if (!params.client || !params.pointer) return console.log('ERROR at onPushPosition: params are not set correctly.')
            gameInstance.clientsList[params.client].cMovement.move(
                { x: params.pointer.x, y: params.pointer.y },
                175,
                function (_agent, input) {
                    gameInstance.otherPlayersW.worker.postMessage({ event: 'startMoving', params: params.client });
                },
                function (_agent) {
                    console.log('WorkerModule:  New currentTile for ' + params.client + ' --Values: ' + params.pointer.x + ';' + params.pointer.y + ' --Pixels: ' + gameInstance.clientsList[params.client].x + ';' + gameInstance.clientsList[params.client].y);
                    gameInstance.otherPlayersW.worker.postMessage({ event: 'requestPosition', params: params.client });
                },
                null,
                Phaser.Easing.Linear.None,
                false);
        },
        'onInit': function (params) {
            eurecaServer.clientHandler({ event: 'setup', params: { id: myId } });
        }
    };

    //Definizione del listener ai messaggi (con inoltro agli handler)
    if (typeof listener === 'undefined' || !listener) listener = function (e) {
        if (e.data.event) {
            if (!this.handlers[e.data.event]) return console.log('OtherPlayersWorker error: ' + e.data.event + ' handler does not exists');
            console.log('OtherPlayersWorker said: ' + e.data.message);
            this.handlers[e.data.event](e.data.params);
        }
        else console.log('OtherPlayersWorker said: ' + e.data.message);
    }.bind(this);

    //Ascolto del worker
    this.worker.addEventListener('message', listener, false);

    console.log('%cLB oPsMngr ' + this.version, 'background: #222; color: #bada55');
};

LBOtherPlayersWorkerModule.prototype = Object.create(Object);
LBOtherPlayersWorkerModule.prototype.constructor = LBOtherPlayersWorkerModule;