LBBaseObject = function (game, x, y, graph) {
    LBBaseEntity.call(this, game, x, y, graph);

    //Proprietà
}

LBBaseObject.prototype = Object.create(LBBaseEntity.prototype);
LBBaseObject.prototype.constructor = LBBaseObject;