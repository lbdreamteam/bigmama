LBGame = function (width, height, worldWidth, worldHeight, movementGridSize, createFunction, movementInEightDirections, overlap, renderer, parent, state, transparent, antialias, physicsConfig) {

    //Definizione parametri opzionali
    if (typeof width === 'undefined') { width = 800 }
    if (typeof height === 'undefined') { height = 600 }
    if (typeof movementGridSize === 'undefined') { movementGridSize = 32 }
    if (typeof movementInEightDirections === 'undefined') { movementInEightDirections = false }
    if (typeof overlap === 'undefined') {overlap = true }
    if (typeof renderer === 'undefined') { renderer = Phaser.AUTO }
    if (typeof parent === 'undefined') { parent = '' }
    if (typeof state === 'undefined') { state = { preload: preload, create: this.gameSetup } }
    if (typeof transparent === 'undefined') { transparent = false }
    if (typeof antialias === 'undefined') { antialias = true }
    if (typeof physicsConfig === 'undefined') { physicsConfig = null }

    //Proprietà
    this.phaserGame = new Phaser.Game(width, height, renderer, parent, state, transparent, antialias, physicsConfig);
    this.movementGridSize = movementGridSize;
    this.movementInEightDirections = movementInEightDirections;
    this.createFunction = createFunction;
    this.world = { width: worldWidth, height: worldHeight };

    //Depth
    this.depthGroup;
    this.overlap = overlap;
    if (overlap){
        this.objectmap = [];
        for (var i=0;i<worldWidth/this.movementGridSize;i++)
        {
            this.objectmap[i]=[];
            for (var j=0; j<worldHeight/this.movementGridSize; j++)
                this.objectmap[i][j]=[];
        }
    }
    this.maxSpriteHeight = 0;
    this.maxSpriteWidth = 0;

    //Pixel-perfect collision
    this.spriteCollisionMatrix = {};

    //Worker
    this.clientsList = {};
    this.otherPlayersW = new LBOtherPlayerWorkerClass('LB Library/Engine/Connections/LBOtherPlayersWorker.js', null, null);
}

LBGame.prototype = Object.create(Object);
LBGame.prototype.constructor = LBGame;

LBGame.prototype.loadImage = function (cacheName, path) {
    var gameInstance = this;
    gameInstance.phaserGame.load.image(cacheName, path);
    gameInstance.phaserGame.load.onLoadComplete.add(function () {
        //Modifica le dimensioni di maxSpriteWidth e Heigth
        var image = gameInstance.phaserGame.cache.getImage(cacheName);
        if (image.height > gameInstance.maxSpriteHeight) gameInstance.maxSpriteHeight = image.height;
        if (image.width > gameInstance.maxSpriteWidth) gameInstance.maxSpriteWidth = image.width;
        //Carica la matrice dei pixel, se non esiste ne crea una temporanea
        loadPixelMatrix(gameInstance, cacheName, path);
    });
}

//Funzione create privata del gioco, che richiamerà la funzione personale differente per ogni gioco
LBGame.prototype.preCreate = function () {
    gameInstance.phaserGame.world.setBounds(0, 0, gameInstance.world.width, gameInstance.world.height);
    gameInstance.depthGroup = gameInstance.phaserGame.add.group();
}

LBGame.prototype.postCreate = function () {
    depthSort(gameInstance);

}

LBGame.prototype.gameSetup = function () { //funzione richiamata dal create del gioco

    eurecaClient = new Eureca.Client();

    eurecaClient.ready(function (proxy) {
        eurecaServer = proxy;
    });

    /************ FUNZIONI DISPONIBILI LATO SERVER ************/
    eurecaClient.exports.createGame = function (id, x, y) {
        myId = id;
        gameInstance.preCreate();
        gameInstance.createFunction(x, y);
        gameInstance.postCreate();
        gameInstance.otherPlayersW.worker.postMessage({ event: 'init', params: myId }); //inizializza il worker
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

LBGame.prototype.setVisibilityChangeHandlers = function () {
    var gameInstance = this;
    gameInstance.phaserGame.onBlur.add(function () { console.log('Game blurred'); });
    gameInstance.phaserGame.onFocus.add(function () { console.log('Game focused'); });
}