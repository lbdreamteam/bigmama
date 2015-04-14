LBButton = function (gameInstance, x, y, graph, callback, callbackContext, overFrame, outFrame, downFrame, upFrame) {

    Phaser.Button.call(this, gameInstance.phaserGame, x, y, graph, callback, callbackContext, overFrame, outFrame, downFrame, upFrame);

    gameInstance.phaserGame.add.existing(this);

}

LBButton.prototype = Object.create(Phaser.Button.prototype);
LBButton.prototype.constructor = LBButton;