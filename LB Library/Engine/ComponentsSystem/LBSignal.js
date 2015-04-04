LBSignal = function (name, parentComponent) {
    Phaser.Signal.call(this);

    this.name = name;
    this.parentComponent = parentComponent;
}

LBSignal.prototype = Object.create(Phaser.Signal.prototype);
LBSignal.prototype.constructor = LBSignal;