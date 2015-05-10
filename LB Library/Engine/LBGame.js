LBGame = function (width, height, worldWidth, worldHeight, movementGridSize, movementInEightDirections, overlap, renderer, mapMovementH, mapMovementH0, parent, state, transparent, antialias, physicsConfig) {

    //Definizione parametri opzionali
    width = width || 800;
    height = height || 600;
    movementGridSize = movementGridSize || 32;
    movementInEightDirections = movementInEightDirections || false;
    if (overlap === undefined) { overlap = true }
    renderer = renderer || Phaser.AUTO;
    parent = parent || '';
    state = state || { preload: preload, create: this.gameSetup };
    transparent = transparent || false;
    if (antialias === undefined) { antialias = true }
    physicsConfig = physicsConfig || null;
    mapMovementH = mapMovementH || 0;
    mapMovementH0 = mapMovementH0 || 0;

    //Proprietà
    this.phaserGame = new Phaser.Game(width, height, renderer, parent, state, transparent, antialias, physicsConfig);
    this.movementGridSize = movementGridSize;
    this.movementInEightDirections = movementInEightDirections;
    this.world = { width: worldWidth, height: worldHeight };
    this.playerSpawnPoint = {};
    this.privateHandlers = new LBPrivateHandlers();

    //Depth
    this.cDepth = new LBDepthComponent(this);

    //Overlap
    this.overlap = overlap;
    if (this.overlap){
        this.objectmap = [];
        for (var i=0; i < worldWidth/this.movementGridSize; i++)
        {
            this.objectmap[i]=[];
            for (var j=0; j < worldHeight/this.movementGridSize; j++)
                this.objectmap[i][j]=[];
        }    
        this.maxSpriteHeight = 0;
        this.maxSpriteWidth = 0;
        this.maxTileDown = 0;                           //Massima distanza (in tile) da controllare verso il basso
        this.maxTileSide = 0;                           //Massima distanza (in tile) da controllare lateralmente
        this.xLength = this.objectmap.length;           //Dimensione x (in tile) della mappa
        this.yLength = this.objectmap[0].length;        //Dimensione y (in tile) della mappa
    }

    //Pixel-perfect collision
    this.cPpc = new LBPixelPerfectCollisionComponent(this);

    //Hitbox
    this.spritePixelMatrix = {};

    //Worker
    this.clientsList = {};
    this.otherPlayersW = new LBOtherPlayerWorkerClass('LB Library/Engine/Connections/LBOtherPlayersWorker.js', null, null);

    //Griglia per lo spostamento
    this.mapMovementMatrix = mapMovementH ? this.createMovementMap(mapMovementH, mapMovementH0) : null;
    console.log('MAP: ');
    console.log(this.mapMovementMatrix);
}

LBGame.prototype = Object.create(Object);
LBGame.prototype.constructor = LBGame;

//Crea la mappa dei punti di snap per i baricentri degli oggetti nel modo tile-based
LBGame.prototype.createMovementMap = function (h, h0) {
    var map = {},
        zeroY = this.phaserGame.height - h0 - (h * this.movementGridSize);
    for (var column = 1; column <= Math.floor(this.phaserGame.width / this.movementGridSize) ; column++) {
        map[column] = {};
        for (var row = 1; row <= h; row++) map[column][row] = { x: (column * this.movementGridSize) - (this.movementGridSize / 2), y: zeroY + (row * this.movementGridSize) - (this.movementGridSize / 2) };
    }
    return map;
}

//Carica un'immagine, con tutto ciò che ne consegue
LBGame.prototype.loadImage = function (cacheName, path) {
    gameInstance.phaserGame.load.image(cacheName, path);
    gameInstance.phaserGame.load.onLoadStart.add(function () { console.log('Partito'); });
    gameInstance.phaserGame.load.onLoadComplete.add(function () {
        if (gameInstance.overlap) {
            //Modifica le dimensioni di maxSpriteWidth e Heigth
            var image = gameInstance.phaserGame.cache.getImage(cacheName);
            if (image.height > gameInstance.maxSpriteHeight) gameInstance.maxSpriteHeight = image.height;
            if (image.width > gameInstance.maxSpriteWidth) gameInstance.maxSpriteWidth = image.width;
            gameInstance.maxTileDown = Math.floor(gameInstance.maxSpriteHeight / gameInstance.movementGridSize) + 2;
            gameInstance.maxTileSide = Math.floor(gameInstance.maxSpriteWidth / gameInstance.movementGridSize) + 1;
        }
        //Crea la matrice dei pixel intera (la aggiunge a spritePixelMatrix)

        if (!gameInstance.spritePixelMatrix[cacheName]) {
            gameInstance.spritePixelMatrix[cacheName] = gameInstance.createPixelMatrix(cacheName);

        }//gameInstance.loadSpritePixelMatrix(cacheName);
        //Carica la matrice dei pixel spezzata, se non esiste copia quella intera (la aggiunge a spriteCollisionMatrix)
        if (!gameInstance.cPpc.spriteCollisionMatrix[cacheName])
            gameInstance.loadCollisionPixelMatrix(cacheName, path);
    });
    console.log('done ' + cacheName);
}

//Crea una matrice dei pixel dell'immagine chiamata cacheName
LBGame.prototype.createPixelMatrix = function (cacheName) {
    var im = gameInstance.phaserGame.cache.getImage(cacheName);
    var bm = new Phaser.BitmapData(gameInstance.phaserGame, cacheName + 'PixelMatrix', im.width, im.height);
    bm.draw(im);
    bm.update();
    var matrix = [];
    for (var i = 0; i < im.width; i++) {
        matrix[i] = [];
        for (var j = 0; j < im.height; j++) {
            matrix[i][j] = bm.getPixel(i, j).a > 0 ? 1 : 0;
        };
    };
    gameInstance.phaserGame.cache.removeBitmapData(cacheName + 'PixelMatrix')
    im = bm = undefined;
    return { topleft: { x: 0, y: 0 }, bottomright: { x: matrix.length, y: matrix[0].length }, matrix: matrix };
}
//Carica la matrice dei pixel dell'imagine con nome cacheName
LBGame.prototype.loadCollisionPixelMatrix = function (cacheName, path) {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
            gameInstance.cPpc.spriteCollisionMatrix[cacheName] = JSON.parse(xmlhttp.responseText);
            xmlhttp = undefined;
        }
        else if (xmlhttp.readyState === 4 && xmlhttp.status === 404) {
            console.log('ATTENTION: missing pixel matrix for the image ' + cacheName + '. A  temporary pixel matrix has been created, but its use may reduce performance');
            gameInstance.cPpc.spriteCollisionMatrix[cacheName] = [gameInstance.spritePixelMatrix[cacheName]];
            xmlhttp = undefined;
        }
    };
    //Prova ad aprire
    try {
        var jsonPath = path.substr(0, path.lastIndexOf('.')) + 'Matrix.json';
        xmlhttp.open("GET", jsonPath, true);
        xmlhttp.send();
    } catch (e) {
        xmlhttp.abort();
    }
}
/*
//Questa funzione fa in modo che neanche le persone stupide possano inizializzare trecento volte la stessa matrice
LBGame.prototype.loadSpritePixelMatrix = function (cacheName) {
    if (gameInstance.spritePixelMatrix[cacheName]) {
        return;
    }
    else gameInstance.spritePixelMatrix[cacheName] = gameInstance.createPixelMatrix(cacheName);
}*/



LBGame.prototype.gameSetup = function () { //funzione richiamata dal create del gioco    
    //TODO: chiamata di verifica credenziali all'api

    //JSON.get('https://ide.c9.io/apoteneggi/consequentiae/api/auth', function () { });

    //eurecaClient = new Eureca.Client();

    //eurecaClient.ready(function (proxy) {
    //    eurecaServer = proxy;
    //});

    //nuova funzione per gestire dialogo client-server
    eurecaClient.exports.serverHandler = function (args) {
        gameInstance.privateHandlers.callHandler(args.event, args.params);
    };

    gameInstance.privateHandlers.addHandler('createGame', ['id', 'Tx', 'Ty'], function (params) {
        console.log('Creating game');
        myId = params.id;
        gameInstance.playerSpawnPoint = { x: params.Tx, y: params.Ty };
        create();
        gameInstance.otherPlayersW.worker.postMessage({ event: 'init', params: myId }); //inizializza il worker
    });

    gameInstance.privateHandlers.addHandler('updatePlayer', ['x', 'y', 'callId'], function (params) {
        gameInstance.clientsList[myId].updatePosition(params.x, params.y, params.callId);
    });

    gameInstance.privateHandlers.addHandler('updateOtherPlayers', ['posTable'], function (params) {
        otherPlayersManager.update(params.posTable);
    });

    gameInstance.privateHandlers.addHandler('onOtherPlayerConnect', ['id', 'oldPos', 'nowPos'], function (params) {
        otherPlayersManager.onConnect(params.id, params.oldPos, params.nowPos);
    });

    gameInstance.privateHandlers.addHandler('onOtherPlayerDisconnect', ['id'], function (params) {
        otherPlayersManager.onDisconnect(params.id);
    });

    gameInstance.privateHandlers.addHandler('spawnOtherPlayers', ['posTable'], function (params) {
        otherPlayersManager.spawn(params.posTable);
    });
}

LBGame.prototype.setVisibilityChangeHandlers = function () {
    var gameInstance = this;
    gameInstance.phaserGame.onBlur.add(function () { console.log('Game blurred'); });
    gameInstance.phaserGame.onFocus.add(function () { console.log('Game focused'); });
}