LBBaseEntity = function (gameInstance, Tx, Ty, graph) {
    
    var Rx = Tx * gameInstance.movementGridSize - gameInstance.movementGridSize / 2,
        Ry = Ty * gameInstance.movementGridSize - gameInstance.movementGridSize / 2;
    console.log(graph + ' ' + Rx + ';' + Ry);
    Phaser.Sprite.call(this, gameInstance.phaserGame, Rx, Ry, graph);

    //Proprietà
    this.currentTile = { x: Tx, y: Ty };
    this.gameInstance = gameInstance;
    this.movementGridSize = gameInstance.movementGridSize;
    this.componentsManager = new LBComponentsManager();
}

LBBaseEntity.prototype = Object.create(Phaser.Sprite.prototype);
LBBaseEntity.prototype.constructor = LBBaseEntity;