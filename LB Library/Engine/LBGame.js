LBGame = function (width, height, worldWidth, worldHeight, movementGridSize, movementInEightDirections, overlap, renderer, pHs, mapMovementH, mapMovementH0, parent, state, transparent, antialias, physicsConfig) {

    //Definizione parametri opzionali


    (typeof width != 'undefined') ? this.width = width : this.width = 640;
    (typeof height != 'undefined') ? this.height = height : this.height = 480;
    (typeof worldWidth != 'undefined' && typeof worldHeight != 'undefined') ? this.world = { width: worldWidth, height: worldHeight } : this.world = { width: this.width, height: this.height };;
    (typeof movementGridSize != 'undefined') ? this.movementGridSize = movementGridSize : this.movementGridSize = 32;
    (typeof movementInEightDirections != 'undefined') ? this.movementInEightDirections = movementInEightDirections : this.movementInEightDirections = false;


    (typeof overlap != 'undefined') ? overlap = overlap : overlap = true;
    (typeof renderer != 'undefined') ? renderer = renderer : renderer = Phaser.AUTO;
    //Gestire undefined pHs

    (typeof mapMovementH != 'undefined') ? this.mapMovementH = mapMovementH : this.mapMovementH = 5;
    (typeof mapMovementH0 != 'undefined') ? this.mapMovementH0 = mapMovementH0 : this.mapMovementH0 = 0; //Dichiarazione corretta del parametro opzionale


    (typeof parent != 'undefined') ? parent = parent : parent = '';
    (typeof state != 'undefined') ? state = state : state = { preload: preload };
    (typeof transparent != 'undefined') ? transparent = transparent : transparent = false;

    (typeof antialias != 'undefined') ? antialias = antialias : antialias = true;
    (typeof physicsConfig != 'undefined') ? physicsConfig = physicsConfig : physicsConfig = null;


    //Setting degli handlers
    this.privateHandlers = new LBPrivateHandlers();
    this.setHandlers(pHs);

    //Proprietà
    this.phaserGame = new Phaser.Game(width, height, renderer, parent, state, transparent, antialias, physicsConfig);


    this.playerSpawnPoint = {};
    this.serverPort;

    //Depth
    this.cDepth = new LBDepthComponent();

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
    this.cPpc = new LBPixelPerfectCollisionComponent();

    //Hitbox
    this.spritePixelMatrix = {};

    //Worker
    this.clientsList = {};
    this.otherPlayersW = new LBOtherPlayersWorkerModule(null, null);

    //Griglia per lo spostamento
    this.mapMovementMatrix = this.createMovementMap(this.mapMovementH, this.mapMovementH0);
    console.log('MAP: ');
    console.log(this.mapMovementMatrix);
}

LBGame.prototype = Object.create(Object);
LBGame.prototype.constructor = LBGame;

//Crea la mappa dei punti di snap per i baricentri degli oggetti nel modo tile-based
LBGame.prototype.createMovementMap = function (h, h0) {
    //NUOIVA VERSIONE COMPATIBILE CON A* <--CONTROLLARE TUTTI I RIFERIMENTI IN GIRO AL PROGETTO
    console.log(this.world.height, this.world.width, this.mapMovementH, this.mapMovementH0)

    var map = [],
        zeroY = this.world.height - h0 - (h * this.movementGridSize);

    for (var column = 0; column < Math.floor(this.world.width / this.movementGridSize); column++) {
        map[column] = [];
        for (var row = 0; row < h ; row++) {
            map[column][row] = { G: { x: (column + 1) * this.movementGridSize - (this.movementGridSize / 2), y: zeroY + (row + 1) * this.movementGridSize - (this.movementGridSize / 2) }, weight: 1 };
        }
    }

    //for (var row = 0; row < h; row++) {
    //    map[row] = [];
    //    for (var column = 0; column < Math.floor(this.phaserGame.width / this.movementGridSize) ; column++) map[row][column] = { G: { x: (column * this.movementGridSize) - (this.movementGridSize / 2), y: zeroY + (row * this.movementGridSize) - (this.movementGridSize / 2) }, weight: 1 };
    //}
    return map;
}

LBGame.prototype.loadFonts = function (fonts, callback) {
    console.log('%c--> LOADING FONTS <--', 'background: #99CDC9');
    callback = callback || null;
    var queue = fonts.slice();
    for (var iFont in fonts) {
        var currentFont = fonts[iFont];
        gameInstance.phaserGame.load.image(currentFont[0], currentFont[1]);
        console.log('%c++', 'color: #FF030D', 'Enqueued ' + currentFont[0]);
        gameInstance.phaserGame.load.onLoadComplete.add(function () {
            console.log('%c--', 'color: #7FFF00	', 'Completed loading font ' + queue[0][0]);
            queue.splice(0, 1);
            if (queue.length == 0) {
                console.log('%c --> FINISHED LOADING FONTS <--', 'background: #99CDC9');
                gameInstance.phaserGame.load.onLoadComplete.removeAll();
                if (!callback) return true;
                callback();
            }
        });
    }
}

LBGame.prototype.setHandlers = function (pHs) {

    console.log('Setting handlers...');

    eurecaClient.exports.serverHandler = function (args) {
        gameInstance.privateHandlers.callHandler(args.event, args.params);
    };
    for (var iHandler in pHs) {
        var currHandler = pHs[iHandler];
        this.privateHandlers.addHandler(currHandler.event, currHandler.params, currHandler.function);
    };

    console.log('...done');
}

LBGame.prototype.setVisibilityChangeHandlers = function () {
    var gameInstance = this;
    gameInstance.phaserGame.onBlur.add(function () { console.log('Game blurred'); });
    gameInstance.phaserGame.onFocus.add(function () { console.log('Game focused'); });
}