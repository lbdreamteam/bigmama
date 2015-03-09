TestingTree = function (game, x, y, graph) {
    LBBaseStaticObject.call(this, game, x, y, graph);
    //Proprietà

    game.phaserGame.add.existing(this);
    game.depthGroup.add(this);
    if (game.overlap)
    	game.objectmap[Math.floor(x/game.movementGridSize)][Math.floor((y+this.height-1)/game.movementGridSize)].push(this);
}

TestingTree.prototype = Object.create(LBBaseStaticObject.prototype);
TestingTree.prototype.constructor = TestingTree;

TestingTree.prototype.update = function () {
    LBBaseStaticObject.prototype.update.call(this);
}