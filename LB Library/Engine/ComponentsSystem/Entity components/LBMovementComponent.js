LBMovementComponent = function (agent, canExit) {
    LBBaseComponent.call(this, agent, LBLibrary.ComponentsTypes.Movement);

    this.isMoving = false;
    this.canExit = canExit || false;

    this.createSignal('startMoving');
    this.createSignal('endMoving');
    this.createSignal('outOfMap');
    this.createParameters( { isMoving : false } );
    //this.sendUpdate(function() {console.log('Movement Component'); } , ['direction'], ['isMoving']);
}

LBMovementComponent.prototype = Object.create(LBBaseComponent.prototype);
LBMovementComponent.prototype.constructor = LBMovementComponent;

LBMovementComponent.prototype.move = function (target, onStartFunction, onCompleteFunction, increment, duration, ease, autoStart, delay, repeat, yoyo) {

    if (!gameInstance.mapMovementMatrix[target.x] || !gameInstance.mapMovementMatrix[target.x][target.y])
        this.fireSignal('outOfMap');
    else
    {
        var component = this,
            pixelTarget = gameInstance.mapMovementMatrix[target.x][target.y];
    
        //Definizione parametri opzionali
        if (!onStartFunction) { onStartFunction = function () { } }
        if (!onCompleteFunction) { onCompleteFunction = function () { } }
        //if (typeof increment === 'undefined' || !input) { input = 'null' }
        duration = duration || 100;
        ease = ease || Phaser.Easing.Default;
        autoStart = autoStart || false;
        delay = delay || 0;
        repeat = repeat || 0;
        yoyo = yoyo || false;

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
}