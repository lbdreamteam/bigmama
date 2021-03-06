﻿GameState = function () {
    LBState.call(this);
}

GameState.prototype = Object.create(LBState.prototype);
GameState.prototype.constructor = GameState;

GameState.prototype.preload = function () {
    //ISSUE: IL CARICAMENTO DELLE IMMAGINI DA QUESTA FUNZIONE NON FUNZIONA
}

GameState.prototype.create = function () {

    gameInstance.phaserGame.world.setBounds(0, 0, gameInstance.world.width, gameInstance.world.height);
    gameInstance.phaserGame.stage.backgroundColor = '#1B7B0C';

    this.add.existing(gameInstance.cDepth.depthGroup);

    gameInstance.clientsList[myId] = new LBPlayer(gameInstance, gameInstance.playerSpawnPoint.x, gameInstance.playerSpawnPoint.y, 'player');
    var tree = new LBTestingTree (gameInstance, 1, 1, 'tree');

    gameInstance.phaserGame.camera.follow(gameInstance.clientsList[myId]);


    gameInstance.phaserGame.time.advancedTiming = true;
    fpsText = gameInstance.phaserGame.add.text(10, 10, 'FPS: ' + gameInstance.phaserGame.time.fps);

    var testAI = new LBBaseAI(gameInstance, 8, 1, 'player');

    //Creazione istanza font
    var gameFont = new LBFont('small',false,false,157,176,78);
    console.log('Istanziato font');

    //Aggiunge al game una stringa di prova,il / fa andare a capo il testo
    var gmText = new LBText(gameFont, 'LB /rDEATH /rPIXEL', 300, 100, 60, 60, 0x9966FF);

}

var fpsText;

GameState.prototype.update = function () {
    fpsText.setText('FPS: ' + gameInstance.phaserGame.time.fps);
}