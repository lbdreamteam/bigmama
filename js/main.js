eurecaClient = new Eureca.Client();
eurecaClient.ready(function (proxy) {
    eurecaServer = proxy;
});
//eurecaClient.exports.authentication = function () {
//    //console.warn(URL_params);
//    //eurecaServer.sendAuth(URL_params['uId']);
//}


gameInstance = new LBGame(800, 600, 2500, 600, 32, true, true, Phaser.AUTO, 5)

function preload() {
    //TODO: spostare il caricamento delle immagini all'interno dei vari states
    gameInstance.loadImage('tree', 'assets/tree.png');
    gameInstance.loadImage('player', 'assets/player.png');

    gameInstance.setVisibilityChangeHandlers();
}

function create() {
    gameInstance.phaserGame.physics.startSystem(Phaser.Physics.ARCADE);
    gameInstance.cDepth.depthGroup = gameInstance.phaserGame.add.group(undefined, undefined, true);

    gameInstance.phaserGame.state.add('testRoom', GameState, true);
}