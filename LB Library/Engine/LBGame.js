LBGame = function (width, height, movementGridSize, movementInEightDirections, renderer, parent, state, transparent, antialias, physicsConfig) {

    //Definizione parametri opzionali
    if (typeof width === 'undefined') { width = 800 }
    if (typeof height === 'undefined') { height = 600 }
    if (typeof movementGridSize === 'undefined') { movementGridSize = 32 }
    if (typeof movementInEightDirections === 'undefined') { movementInEightDirections = false }
    if (typeof renderer === 'undefined') { renderer = Phaser.AUTO }
    if (typeof parent === 'undefined') { parent = '' }
    if (typeof state === 'undefined') { state = {preload: preload, create: this.eurecaClientSetup} }
    if (typeof transparent === 'undefined') { transparent = false }
    if (typeof antialias === 'undefined') { antialias = true }
    if (typeof physicsConfig === 'undefined') { physicsConfig = null }



    //Proprietà
    this.phaserGame = new Phaser.Game(width, height, renderer, parent, state, transparent, antialias, physicsConfig);
    this.movementGridSize = movementGridSize;
    this.movementInEightDirections = movementInEightDirections;
    

    //Depth
    this.depthGroup/* = this.phaserGame.add.group()*/;
    this.objectmap = [];
    for (var i=0;i<width/32;i++)
    {
        this.objectmap[i]=[];
        for (var j=0; j<height/32; j++)
            this.objectmap[i][j]=[];
    }
    this.maxSpriteHeight = 0;
    this.maxSpriteWidth = 0;

    //Worker
    this.clientsList = {};
    this.otherPlayersW = new Worker('LB Library/Engine/Connections/LBOtherPlayersWorker.js');
    this.otherPlayersW.addEventListener('message', function (e) {
        if (e.data.event) {
            switch (e.data.event) {
                case 'pushPosition': onPushPosition(e.data.params); break;
                //case 'connect': onOtherPlayerConnect(e.data.params); break;
            }
        }
        else console.log('Worker said: ' + e.data);
    }, false);
}

LBGame.prototype = Object.create(Object);
LBGame.prototype.constructor = LBGame;

LBGame.prototype.loadImage = function (cacheName, path) {
    var gameInstance = this;
    gameInstance.phaserGame.load.image(cacheName, path);
    gameInstance.phaserGame.load.onLoadComplete.add(function () {
        var image = gameInstance.phaserGame.cache.getImage(cacheName);
        if (image.height > gameInstance.maxSpriteHeight) gameInstance.maxSpriteHeight = image.height;
        if (image.width > gameInstance.maxSpriteWidth) gameInstance.maxSpriteWidth = image.width;
    });
}

LBGame.prototype.eurecaClientSetup = function () { //funzione richiamata dal create del gioco
    eurecaClient = new Eureca.Client();

    eurecaClient.ready(function (proxy) {
        eurecaServer = proxy;
    });

    /************ FUNZIONI DISPONIBILI LATO SERVER ************/
    eurecaClient.exports.createGame = function (id, x, y) {
        myId = id;
        create(x, y);
        gameInstance.otherPlayersW.postMessage({ event: 'init', params: myId }); //inizializza il worker
    }

    eurecaClient.exports.updatePlayer = function (x, y, callId) {
        player.updatePosition(x, y, callId);
    };

    eurecaClient.exports.updateOtherPlayers = function (posTable) {
        OtherPlayersManager.Update(posTable);
    };

    eurecaClient.exports.onOtherPlayerConnect = function (id, x, y) {
        OtherPlayersManager.OnConnect(id, x, y);
    };

    eurecaClient.exports.onOtherPlayerDisconnect = function (id) {
        OtherPlayersManager.OnDisconnect(id);
    };

    eurecaClient.exports.spawnOtherPlayers = function (posTable) {
        OtherPlayersManager.Spawn(posTable);
    };
}

var onPushPosition = function (params) {
    if (!params.client || !params.pointer) console.log('ERROR at onPushPosition: params are not set correctly.')
    else {
        //console.log('Started ' + params.pointer.x);
        gameInstance.clientsList[params.client].cMovement.update(
            params.pointer,
            function (_agent, input) {
                gameInstance.otherPlayersW.postMessage({ event: 'startMoving', params: params.client });
            },
            function (_agent) {
                gameInstance.otherPlayersW.postMessage({ event: 'requestPosition', params: params.client });
            },
            null,
            175,
            Phaser.Easing.Linear.None,
            false);
    }
};