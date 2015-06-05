LBMovementComponent = function (agent, canExit) {
    LBBaseComponent.call(this, agent, LBLibrary.ComponentsTypes.Movement);

    this.isMoving = false;
    this.canExit = canExit || false;
    this.forceRespawn = false;
    this.respawnPoint = {};

    //SIGNALS
    this.createSignal('startMoving');
    this.createSignal('endMoving');
    this.createSignal('outOfMap');

    ///PARAMETERS
    this.createParameters( { 'isMoving' : false, 'tween' : null } );

    //this.sendUpdate(function() {console.log('Movement Component'); } , ['direction'], ['isMoving']);
}

LBMovementComponent.prototype = Object.create(LBBaseComponent.prototype);
LBMovementComponent.prototype.constructor = LBMovementComponent;

LBMovementComponent.prototype.move = function (target, duration, onStartFunction, onCompleteFunction, increment, ease, autoStart, delay, repeat, yoyo) {

    //Versione del componente di Ascari. Non sono riuscito a farla funzionare: da rivedere

    //if (!gameInstance.mapMovementMatrix[target.x] || !gameInstance.mapMovementMatrix[target.x][target.y])
    //    this.fireSignal('outOfMap');
    //else
    //{
    //    var component = this,
    //        pixelTarget = gameInstance.mapMovementMatrix[target.x][target.y];
    
    //    //Definizione parametri opzionali
    //    if (!onStartFunction) { onStartFunction = function () { } }
    //    if (!onCompleteFunction) { onCompleteFunction = function () { } }
    //    //if (typeof increment === 'undefined' || !input) { input = 'null' }
    //    duration = duration || 100;
    //    ease = ease || Phaser.Easing.Default;
    //    autoStart = autoStart || false;
    //    delay = delay || 0;
    //    repeat = repeat || 0;
    //    yoyo = yoyo || false;

    //    var tween = gameInstance.phaserGame.add.tween(component.agent);

    //    tween.to(
    //        pixelTarget,
    //        duration,
    //        ease,
    //        autoStart,
    //        delay,
    //        repeat,
    //        yoyo
    //    );

    //    tween.onStart.add(function () {
    //        component.isMoving = true;
    //        component.componentsManager.Parameters['isMoving'] = true;
    //        onStartFunction(component.agent, increment);
    //        component.fireSignal('startMoving');
    //        gameInstance.cDepth.depthSort(component.agent, target);
    //    });

    //    tween.onComplete.add(function () {
    //        onCompleteFunction(component.agent);
    //        component.fireSignal('endMoving');
    //        component.isMoving = false;
    //        component.agent.currentTile = target;
    //        component.componentsManager.Parameters['isMoving'] = false;
    //    });

    //    tween.start();
    //}

    console.log(this.agent, target);

    var component = this,
        pixelTarget = gameInstance.mapMovementMatrix[target.x][target.y].G;
    
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
        component.agent.currentTile = target;
        initPoint = { x: component.agent.x, y: component.agent.y };
        component.isMoving = true;
        component.updateParam('isMoving', true);
        onStartFunction(component.agent, increment);
        component.fireSignal('startMoving');
        gameInstance.cDepth.depthSort(component.agent, target);
    });

    tween.onComplete.add(function () {
        component.fireSignal('endMoving');
        if (component.forceRespawn){ 
            console.log('Forced respawn...');
            var G = gameInstance.mapMovementMatrix[component.respawnPoint.Tx][component.respawnPoint.Ty].G;
            component.agent.x = G.x;
            component.agent.y = G.y;
            component.forceRespawn = false;
            component.agent.currentTile = {x: component.respawnPoint.Tx, y: component.respawnPoint.Ty};
            console.log('...done');
        }
        if (component.agent.cCollidingMovement) {

        }
        onCompleteFunction(component.agent);
        component.isMoving = false;
        component.updateParam('isMoving', false);
    });

    this.updateParam('tween', tween);

    tween.start();

};

LBMovementComponent.prototype.setForceRespawn = function(respawnPoint) { //possibilità di un futuro callback
    this.forceRespawn = true;
    this.respawnPoint = respawnPoint;
};