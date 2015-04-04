/************ CLIENT ************/
/************ VARIABILI GLOBALI ************/
var myId = 0,
    player;

//GIOCO
gameInstance = new LBGame(800, 600, 2500, 600, 32, true, true, Phaser.AUTO, '');

function preload() {
    gameInstance.loadImage('tree', 'assets/tree.png');
    gameInstance.loadImage('player', 'assets/player.png');

    gameInstance.setVisibilityChangeHandlers();
}

function create(x, y) {

    gameInstance.phaserGame.physics.startSystem(Phaser.Physics.ARCADE);
    gameInstance.cDepth.depthGroup = gameInstance.phaserGame.add.group(undefined, undefined, true);

    gameInstance.phaserGame.state.add('testRoom', GameState, true);
}