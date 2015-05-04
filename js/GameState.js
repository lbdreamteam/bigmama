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


    var font = new LBFont();

   
    var sp = gameInstance.phaserGame.add.sprite(150, 0, gameInstance.phaserGame.cache.getBitmapData(font.char[50]));
    console.log('Istanziato font');
}

GameState.prototype.update = function () {

}