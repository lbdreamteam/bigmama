LBMovementComponent = function (agent) {
    LBBaseComponent.call(this, agent, LBLibrary.ComponentsTypes.Movement);

    this.isMoving = false;

    this.createSignal('startMoving');
}

LBMovementComponent.prototype = Object.create(LBBaseComponent.prototype);
LBMovementComponent.prototype.constructor = LBMovementComponent;

LBMovementComponent.prototype.move = function (target, duration, onStartFunction, onCompleteFunction, increment, ease, autoStart, delay, repeat, yoyo) {

    var component = this,
        pixelTarget = gameInstance.mapMovementMatrix[target.y][target.x].G;
    
    //Definizione parametri opzionali
    if (typeof onStartFunction === 'undefined' || !onStartFunction) { onStartFunction = function () { } }
    if (typeof onCompleteFunction === 'undefined' || !onCompleteFunction) { onCompleteFunction = function () { } }
    //if (typeof increment === 'undefined' || !input) { input = 'null' }
    if (typeof duration === 'undefined') { duration = 100; }
    if (typeof ease === 'undefined') { ease = Phaser.Easing.Default; }
    if (typeof autoStart === 'undefined') { autoStart = false; }
    if (typeof delay === 'undefined') { delay = 0; }
    if (typeof repeat === 'undefined') { repeat = 0; }
    if (typeof yoyo === 'undefined') { yoyo = false; }

    var tween = gameInstance.phaserGame.add.tween(component.agent);

    tween.to(
        pixelTarget,
        duration,
        ease,
        autoStart,
        delay,
        repeat,
        yoyo
    );

    var initPoint = {};

    tween.onStart.add(function () {
        initPoint = { x: component.agent.x, y: component.agent.y };
        component.isMoving = true;
        onStartFunction(component.agent, increment);
        component.fireSignal('startMoving');
        gameInstance.cDepth.depthSort(component.agent, target);
    });

    tween.onComplete.add(function () {
        onCompleteFunction(component.agent);
        component.agent.currentTile = target;
        component.isMoving = false;
    });

    tween.start();
}