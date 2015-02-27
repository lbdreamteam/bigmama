BaseEntity = function (gameInstance, x, y, graph) {
    Phaser.Sprite.call(this, gameInstance.phaserGame, x, y, graph);

    //Proprietà
    this.gameInstance = gameInstance;
    this.movementGridSize = gameInstance.movementGridSize;
    this.gameInstance.depthGroup.add(this);
}

BaseEntity.prototype = Object.create(Phaser.Sprite.prototype);
BaseEntity.prototype.constructor = BaseEntity;
