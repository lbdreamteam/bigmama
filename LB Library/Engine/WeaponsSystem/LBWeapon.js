LBWeapon = function (name, damage, range, bullets, rate, speed, bulletsGraph) {
    this.name = name;
    this.damage = damage;
    this.range = range;
    this.bullets = bullets;
    this.currentBullets = bullets;
    this.bulletsGraph = bulletsGraph;
    this.rate = rate;
    this.speed = speed;
}

LBWeapon.prototype = Object.create(Object);
LBWeapon.prototype.constructor = LBWeapon;