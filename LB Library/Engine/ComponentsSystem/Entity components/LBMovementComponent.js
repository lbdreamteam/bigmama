LBMovementComponent = function (agent, canExit) {
    LBBaseComponent.call(this, agent, LBLibrary.ComponentsTypes.Movement);

    this.isMoving = false;
    this.canExit = canExit || false;

    this.createSignal('startMoving');
    this.createSignal('endMoving');
    this.createSignal('outOfMap');
    this.createParameters( { isMoving : this.isMoving } );
    //this.sendUpdate(function() {console.log('Movement Component'); } , ['direction'], ['isMoving']);
}

LBMovementComponent.prototype = Object.create(LBBaseComponent.prototype);
LBMovementComponent.prototype.constructor = LBMovementComponent;

//funzione per muovere l'agent
LBMovementComponent.prototype.move = function (target, duration, onStartFunction, onCompleteFunction, increment, ease, autoStart, delay, repeat, yoyo) {
    if (!gameInstance.mapMovementMatrix[target.y] || !gameInstance.mapMovementMatrix[target.y][target.x])
        this.fireSignal('outOfMap');
    else
    {
        var pixelTarget = gameInstance.mapMovementMatrix[target.y][target.x].G;
        
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

        var tween = gameInstance.phaserGame.add.tween(this.agent);

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
            initPoint = { x: this.agent.x, y: this.agent.y };
            this.isMoving = true;
            this.componentsManager.Parameters['isMoving'] = this.isMoving;
            onStartFunction(this.agent, increment);
            this.fireSignal('startMoving');
            gameInstance.cDepth.depthSort(this.agent, target);
        }.bind(this));

        tween.onComplete.add(function () {
            onCompleteFunction(this.agent);
            this.fireSignal('endMoving');
            this.agent.currentTile = target;
            this.isMoving = false;
            this.componentsManager.Parameters['isMoving'] = this.isMoving;
        }.bind(this));

        tween.start();
    }
}