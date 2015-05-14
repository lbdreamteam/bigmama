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
    var gameFont = new LBFont('small');
    console.log('Istanziato font');

    //Aggiunge al game una stringa di prova,il / fa andare a capo il testo
    var gmText = new LBText(gameFont, 'ANDARE/A/CAPO/E^/SWAG', 300, 100, 30,60);
    
}

GameState.prototype.update = function () {

}