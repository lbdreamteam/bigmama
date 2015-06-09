LBBaseAI = function (gameInstance, Tx, Ty, graph) {
    LBSprite.call(this, gameInstance, Tx, Ty, graph);

    this.cMovement = new LBMovementComponent(this);
    this.cSnapping = new LBSnappingComponent(this);
    this.cCollidingMovement = new LBCollidingMovementComponent(this);
    this.cPathFinding = new LBPathFindingComponent(this, 'A*');

}

LBBaseAI.prototype = Object.create(LBSprite.prototype);
LBBaseAI.prototype.constructor = LBBaseAI;

LBBaseAI.prototype.update = function () {
    this.componentsManager.update();
}