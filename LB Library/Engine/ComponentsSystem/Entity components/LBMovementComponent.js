LBMovementComponent = function (agent) {
    LBBaseComponent.call(this, agent, LBLibrary.ComponentsTypes.Movement);

    this.isMoving = false;

    this.createSignal('startMoving');
    this.createSignal('endMoving');
}

LBMovementComponent.prototype = Object.create(LBBaseComponent.prototype);
LBMovementComponent.prototype.constructor = LBMovementComponent;

LBMovementComponent.prototype.move = function (target, onStartFunction, onCompleteFunction, increment, duration, ease, autoStart, delay, repeat, yoyo) {

    var component = this,
        pixelTarget = gameInstance.mapMovementMatrix[target.x][target.y];
    
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

    tween.onStart.add(function () {
        component.isMoving = true;
        component.componentsManager.Parameters['isMoving'] = true;
        onStartFunction(component.agent, increment);
        component.fireSignal('startMoving');
        gameInstance.cDepth.depthSort(component.agent, target);
    });

    tween.onComplete.add(function () {
        onCompleteFunction(component.agent);
        component.fireSignal('endMoving');
        component.isMoving = false;
        component.componentsManager.Parameters['isMoving'] = false;
    });

    tween.start();
}

