LBBaseObject = function (gameInstance, Tx, Ty, graph) {
    LBBaseEntity.call(this, gameInstance, Tx, Ty, graph);

    //Proprietà
}

LBBaseObject.prototype = Object.create(LBBaseEntity.prototype);
LBBaseObject.prototype.constructor = LBBaseObject;