/************ CLIENT ************/
/************ VARIABILI GLOBALI ************/
var myId = 0,
    player;


//GIOCO
 gameInstance = new LBGame(800, 600, 32, true, Phaser.AUTO, '');

function preload() {
    gameInstance.loadImage('player', 'assets/player.png');
    gameInstance.loadImage('tree', 'assets/tree.png');
}

function create(x, y) {

    gameInstance.phaserGame.world.setBounds(0, 0, 2500, 600);

    gameInstance.phaserGame.stage.backgroundColor = '#1B7B0C';
    gameInstance.depthGroup = gameInstance.phaserGame.add.group();

    tree = new TestingTree(gameInstance, 70, 120, 'tree');
    tree2 = new TestingTree(gameInstance, 600, 310, 'tree');
    tree3 = new TestingTree(gameInstance, 450, 200, 'tree');
    tree4 = new TestingTree(gameInstance, 390, 32, 'tree');
    tree5 = new TestingTree(gameInstance, 650, 64, 'tree');
    tree6 = new TestingTree(gameInstance, 100, 300, 'tree');
    tree7 = new TestingTree(gameInstance, 140, 20, 'tree');
    tree8 = new TestingTree(gameInstance, 230, 200, 'tree');
    tree9 = new TestingTree(gameInstance, 400, 280, 'tree');
    player = new LBPlayer(gameInstance, x, y, 'player', myId, eurecaServer, eurecaClient);
    depthSort(gameInstance);       

    gameInstance.phaserGame.camera.follow(player);

    gameInstance.clientsList[myId] = player;
}