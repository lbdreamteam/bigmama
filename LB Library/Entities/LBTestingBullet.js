LBTestingBullet = function (gameInstance, Tx, Ty, graph) {
    LBSprite.call(this, gameInstance, Tx, Ty, graph);

    this.cShootable = new LBShootableComponent(this, {x:1,y:0}, 10);
}

LBTestingBullet.prototype = Object.create(LBSprite.prototype);
LBTestingBullet.prototype.constructor = LBTestingBullet;