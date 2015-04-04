LBOtherPlayer = function (gameInstance, x, y, graph, id) {
    LBBaseCharacter.call(this, gameInstance, x, y, graph, id, true);

    //Proprietà
    this.gameInstance = gameInstance; //Istanza del LBGame
    this.id = id;

    //Aggiunta dell'istanza al gioco
    this.gameInstance.phaserGame.add.existing(this);
}

LBOtherPlayer.prototype = Object.create(LBBaseCharacter.prototype);
LBOtherPlayer.prototype.constructor = LBOtherPlayer;

LBOtherPlayer.prototype.update = function () {
    this.updateDisplayedName();
}