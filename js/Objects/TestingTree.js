TestingTree = function (gameInstanceInstance, Tx, Ty, graph) {
    LBBaseStaticObject.call(this, gameInstanceInstance, Tx, Ty, graph);
    //Proprietà

    gameInstance.phaserGame.add.existing(this);
    gameInstance.cDepth.depthGroup.add(this);
    
    this.graph = graph;
    this.cSnapping = new LBSnappingComponent(this);
    this.cCollidingMovement = new LBCollidingMovementComponent(this, 1, false, LBLibrary.ComponentsTypes.CollidingMovement);
    if (gameInstance.overlap)
        gameInstance.objectmap[Tx][Ty].push(this);
}

TestingTree.prototype = Object.create(LBBaseStaticObject.prototype);
TestingTree.prototype.constructor = TestingTree;

TestingTree.prototype.update = function () {
    LBBaseStaticObject.prototype.update.call(this);
}