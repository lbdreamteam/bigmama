﻿TestingTree = function (game, x, y, graph) {
    BaseStaticObject.call(this, game, x, y, graph);
    //Proprietà

    game.phaserGame.add.existing(this);
    game.depthGroup.add(this);
    game.objectmap[Math.floor(x/game.movementGridSize)][Math.floor((y+this.height-1)/game.movementGridSize)].push(this);
}

TestingTree.prototype = Object.create(BaseStaticObject.prototype);
TestingTree.prototype.constructor = TestingTree;

TestingTree.prototype.update = function () {
    BaseStaticObject.prototype.update.call(this);
}