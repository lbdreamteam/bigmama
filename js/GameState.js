GameState = function () {
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

    gameInstance.phaserGame.camera.follow(gameInstance.clientsList[myId]);

    //Creazione istanza font
    var gameFont = new LBFont();
    console.log('Istanziato font');

    //Aggiunge al game una stringa di prova
    var gmText = new LBText(null, 'press space to shoot', 150, 0);
    
}

GameState.prototype.update = function () {

}