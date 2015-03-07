LBMovementComponent = function (agent) {
    LBBaseComponent.call(this, agent);

    this.isMoving = false;
}

LBMovementComponent.prototype = Object.create(LBBaseComponent.prototype);
LBMovementComponent.prototype.constructor = LBMovementComponent;

LBMovementComponent.prototype.move = function (target, onStartFunction, onCompleteFunction, input, duration, ease, autoStart, delay, repeat, yoyo) {

    var component = this;
    
    //Definizione parametri opzionali
    if (typeof onStartFunction === 'undefined' || !onStartFunction) { onStartFunction = function () { } }
    if (typeof onCompleteFunction === 'undefined' || !onCompleteFunction) { onCompleteFunction = function () { } }
    if (typeof input === 'undefined' || !input) { input = 'null' }
    if (typeof duration === 'undefined') { duration = 100; }
    if (typeof ease === 'undefined') { ease = Phaser.Easing.Default; }
    if (typeof autoStart === 'undefined') { autoStart = false; }
    if (typeof delay === 'undefined') { delay = 0; }
    if (typeof repeat === 'undefined') { repeat = 0; }
    if (typeof yoyo === 'undefined') { yoyo = false; }

    var tween = component.agent.gameInstance.phaserGame.add.tween(component.agent);

    tween.to(
        target,
        duration,
        ease,
        autoStart,
        delay,
        repeat,
        yoyo
    );

    tween.onStart.add(function () {
        component.isMoving = true;
        onStartFunction(component.agent, input);
        depthSort(gameInstance, component.agent, target);
    });

    tween.onComplete.add(function () {
        onCompleteFunction(component.agent);
        component.isMoving = false;
    });

    tween.start();
}

