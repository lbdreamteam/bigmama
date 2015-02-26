TestingTree = function (game, x, y, graph) {
    BaseStaticObject.call(this, game, x, y, graph);
    //Proprietà

    game.phaserGame.add.existing(this);
    game.depthGroup.add(this);
    objectmap[Math.floor(x/game.movementGridSize)][Math.floor((y+this.height)/game.movementGridSize)].push(this);
}

TestingTree.prototype = Object.create(BaseStaticObject.prototype);
TestingTree.prototype.constructor = TestingTree;