LBBullet = function (gameInstance, Tx, Ty, graph, facing, damage, range, speed) {

    LBSprite.call(this, gameInstance, Tx, Ty, graph);

    this.damage = damage;

    this.cShootable = new LBShootableComponent(this, facing, speed, range);
}

LBBullet.prototype = Object.create(LBSprite.prototype);
LBBullet.prototype.constructor = LBBullet;