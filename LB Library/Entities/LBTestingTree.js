LBTestingTree = function (gameInstance, Tx, Ty, graph) {
    LBSprite.call(this, gameInstance, Tx, Ty, graph);
    gameInstance.objectmap[Tx][Ty].push(this);
}

LBTestingTree.prototype = Object.create(LBSprite.prototype);
LBTestingTree.prototype.constructor = LBTestingTree;