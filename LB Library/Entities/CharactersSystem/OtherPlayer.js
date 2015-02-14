OtherPlayer = function (gameInstance, x, y, graph, id) {
    BaseCharacter.call(this, gameInstance, x, y, graph);

    //Proprietà
    this.gameInstance = gameInstance; //Istanza del LBGame
    this.id = id;
    this.currentTile = { x: (x + (this.gameInstance.movementGridSize / 2)) / this.gameInstance.movementGridSize, y: (y + (this.gameInstance.movementGridSize / 2)) / this.gameInstance.movementGridSize };
    //Problemi da fixare: this.serverCalls = { calls: new HashTable(), callCounter: 0 };

    //Aggiunta dell'istanza al gioco
    this.gameInstance.phaserGame.add.existing(this);
}

OtherPlayer.prototype = Object.create(BaseCharacter.prototype);
OtherPlayer.prototype.constructor = OtherPlayer;
