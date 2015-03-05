LBBaseEntity = function (gameInstance, x, y, graph) {
    Phaser.Sprite.call(this, gameInstance.phaserGame, x, y, graph);

    //Proprietà
    this.gameInstance = gameInstance;
    this.movementGridSize = gameInstance.movementGridSize;
    this.gameInstance.depthGroup.add(this);
}

LBBaseEntity.prototype = Object.create(Phaser.Sprite.prototype);
LBBaseEntity.prototype.constructor = LBBaseEntity;
