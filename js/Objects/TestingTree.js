TestingTree = function (game, x, y, graph) {
    BaseInteractableObject.call(this, game, x, y, graph, this.callbackPlayerCollision);

    //Proprietà

    game.phaserGame.add.existing(this);
}

TestingTree.prototype = Object.create(BaseInteractableObject.prototype);
TestingTree.prototype.constructor = TestingTree;

TestingTree.prototype.callbackPlayerCollision = function () {
	this.destroy();
}