LBShootingComponent = function (agent) {
    LBBaseComponent.call(this, agent, LBLibrary.ComponentsTypes.Shooting);
    
    //PROPS
    this.lastShot = 0;
}

LBShootingComponent.prototype = Object.create(LBBaseComponent.prototype);
LBShootingComponent.prototype.constructor = LBShootingComponent;

LBShootingComponent.prototype.shoot = function () {

    var component = this;

    //console.log(Date.now() - this.lastShot);
    if (Date.now() - this.lastShot >= this.agent.weapon.rate) {
        if (this.agent.weapon.currentBullets > 0) {
            this.lastShot = Date.now();
            this.agent.weapon.currentBullets--;

            var bullet = new LBBullet(gameInstance, this.agent.currentTile.x, this.agent.currentTile.y, this.agent.weapon.bulletsGraph, this.agent.facing, this.agent.weapon.damage, this.agent.weapon.range, this.agent.weapon.speed);
        }
        else console.log('colpi esauriti');

    }
}