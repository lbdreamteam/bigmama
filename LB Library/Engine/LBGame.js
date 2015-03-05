LBGame = function (width, height, movementGridSize, movementInEightDirections, renderer, parent, state, transparent, antialias, physicsConfig) {

    //Definizione parametri opzionali
    if (typeof width === 'undefined') { width = 800 }
    if (typeof height === 'undefined') { height = 600 }
    if (typeof movementGridSize === 'undefined') { movementGridSize = 32 }
    if (typeof movementInEightDirections === 'undefined') { movementInEightDirections = false }
    if (typeof renderer === 'undefined') { renderer = Phaser.AUTO }
    if (typeof parent === 'undefined') { parent = '' }
    if (typeof state === 'undefined') { state = null }
    if (typeof transparent === 'undefined') { transparent = false }
    if (typeof antialias === 'undefined') { antialias = true }
    if (typeof physicsConfig === 'undefined') { physicsConfig = null }



    //Proprietà
    this.phaserGame = new Phaser.Game(width, height, renderer, parent, state, transparent, antialias, physicsConfig);
    this.movementGridSize = movementGridSize;
    this.movementInEightDirections = movementInEightDirections;
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