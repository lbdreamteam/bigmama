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
}

LBGame.prototype = Object.create(Phaser.Game);
LBGame.prototype.constructor = LBGame;