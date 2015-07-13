LBOtherPlayer = function (gameInstance, Tx, Ty, graph) {
    LBSprite.call(this, gameInstance, Tx, Ty, graph);

    //Props

    //Componenti
    if(gameInstance.overlap) this.cOverlap = new LBOverlapComponent(this);
    this.cMovement = new LBMovementComponent(this);
    this.cServerDrivenMovement = new LBServerDrivenMovementComponent(this);
    this.cSnapping = new LBSnappingComponent(this);
    this.cCollidingMovement = new LBCollidingMovementComponent(this);
}

LBOtherPlayer.prototype = Object.create(LBSprite.prototype);
LBOtherPlayer.prototype.constructor = LBOtherPlayer;