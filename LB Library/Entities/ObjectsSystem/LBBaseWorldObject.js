LBBaseWorldObject = function (gameInstance, Tx, Ty, graph) {
    LBBaseObject.call(this, gameInstance, Tx, Ty, graph);

    //Proprietà
}

LBBaseWorldObject.prototype = Object.create(LBBaseObject.prototype);
LBBaseWorldObject.prototype.constructor = LBBaseWorldObject;