LBBaseAI = function (gameInstance, Tx, Ty, graph) {
    LBSprite.call(this, gameInstance, Tx, Ty, graph);

    this.cMovement = new LBMovementComponent(this);
    this.cSnapping = new LBSnappingComponent(this);
    this.cCollidingMovement = new LBCollidingMovementComponent(this);
    this.path = [];

}

LBBaseAI.prototype = Object.create(LBSprite.prototype);
LBBaseAI.prototype.constructor = LBBaseAI;