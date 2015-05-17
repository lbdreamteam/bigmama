﻿gameInstance = new LBGame(800, 600, 2500, 600, 48, true, true, Phaser.AUTO, 5)

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