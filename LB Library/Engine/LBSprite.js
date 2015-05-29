LBSprite = function (gameInstance, Tx, Ty, graph) {

    var Rx = gameInstance.mapMovementMatrix[Ty][Tx].G.x,
        Ry = gameInstance.mapMovementMatrix[Ty][Tx].G.y;

    Phaser.Sprite.call(this, gameInstance.phaserGame, Rx, Ry, graph);
    
    //Proprietà
    this.currentTile = { x: Tx, y: Ty };
    this.facing = 'RIGHT';
    this.zDepth = 0;
    this.graph = graph;
    this.componentsManager = new LBComponentsManager();

    gameInstance.phaserGame.add.existing(this);
    //gameInstance.cDepth.depthGroup.add(this);
}

LBSprite.prototype = Object.create(Phaser.Sprite.prototype);
LBSprite.prototype.constructor = LBSprite;