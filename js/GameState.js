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

    tree = new TestingTree(gameInstance, 15, 10, 'tree');
    player = new LBPlayer(gameInstance, 5, 5, 'player', myId, eurecaServer, eurecaClient);

    gameInstance.phaserGame.camera.follow(player);

    gameInstance.clientsList[myId] = player;
    //LBState.prototype.create.call(this);
}

GameState.prototype.update = function () {
    //LBState.prototype.update.call(this);
}

GameState.prototype.callback = function () {
    gameInstance.phaserGame.state.add('level1', TestingRoom, true);
}