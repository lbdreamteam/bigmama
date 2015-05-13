LBShootingComponent = function (agent) {
    LBBaseComponent.call(this, agent, LBLibrary.ComponentsTypes.Shooting);
    
    //PROPS
    this.lastShot = 0;
}

LBShootingComponent.prototype = Object.create(LBBaseComponent.prototype);
LBShootingComponent.prototype.constructor = LBShootingComponent;

LBShootingComponent.prototype.shoot = function () {

    var component = this;

    console.log(Date.now() - this.lastShot);
    if (Date.now() - this.lastShot >= this.agent.weapon.rate) {
        if (this.agent.weapon.currentBullets > 0) {
            this.lastShot = Date.now();
            this.agent.weapon.currentBullets--;
            console.log('sparato');

            var bullet = gameInstance.phaserGame.add.sprite(this.agent.x, this.agent.y, this.agent.weapon.bulletsGraph);

            var tween = gameInstance.phaserGame.add.tween(bullet);

            tween.to(
                component.calculateTarget(),
                400,
                Phaser.Easing.Default,
                true
            );

            tween.onComplete.add(function () {
                bullet.kill();
            });
        }
        else console.log('colpi esauriti');

    }
}

LBShootingComponent.prototype.calculateTarget = function () {
    console.log(this.agent.facing);
    if (this.agent.facing == 'UP') {
        return { x: this.agent.x, y: this.agent.y - (this.agent.weapon.range * gameInstance.movementGridSize)};
    }
    else if (this.agent.facing == 'DOWN') {
        return { x: this.agent.x, y: this.agent.y + (this.agent.weapon.range * gameInstance.movementGridSize) };
    }
    else if (this.agent.facing == 'RIGHT') {
        return { x: this.agent.x + (this.agent.weapon.range * gameInstance.movementGridSize), y: this.agent.y };
    }
    else if (this.agent.facing == 'LEFT') {
        return { x: this.agent.x - (this.agent.weapon.range * gameInstance.movementGridSize), y: this.agent.y };
    }
    else if (this.agent.facing == 'UP-RIGHT') {
        return { x: this.agent.x + (this.agent.weapon.range * gameInstance.movementGridSize), y: this.agent.y - (this.agent.weapon.range * gameInstance.movementGridSize) };
    }
    else if (this.agent.facing == 'UP-LEFT') {
        return { x: this.agent.x - (this.agent.weapon.range * gameInstance.movementGridSize), y: this.agent.y - (this.agent.weapon.range * gameInstance.movementGridSize) };
    }
    else if (this.agent.facing == 'DOWN-RIGHT') {
        return { x: this.agent.x + (this.agent.weapon.range * gameInstance.movementGridSize), y: this.agent.y + (this.agent.weapon.range * gameInstance.movementGridSize) };
    }
    else if (this.agent.facing == 'DOWN-LEFT') {
        return { x: this.agent.x - (this.agent.weapon.range * gameInstance.movementGridSize), y: this.agent.y + (this.agent.weapon.range * gameInstance.movementGridSize) };
    }
}