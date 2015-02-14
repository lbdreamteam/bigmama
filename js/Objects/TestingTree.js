TestingTree = function (game, x, y, graph) {
    BaseStaticObject.call(this, game, x, y, graph);

    //Proprietà

    game.phaserGame.add.existing(this);
}

TestingTree.prototype = Object.create(BaseStaticObject.prototype);
TestingTree.prototype.constructor = TestingTree;