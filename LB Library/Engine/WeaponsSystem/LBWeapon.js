LBWeapon = function (name, damage, range, bullets, rate, bulletsGraph) {
    this.name = name;
    this.damage = damage;
    this.range = range;
    this.bullets = bullets;
    this.currentBullets = bullets;
    this.bulletsGraph = bulletsGraph;
    this.rate = rate;
}

LBWeapon.prototype = Object.create(Object);
LBWeapon.prototype.constructor = LBWeapon;