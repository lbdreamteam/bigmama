LBBaseWorldObject = function (game, x, y, graph) {
    LBBaseObject.call(this, game, x, y, graph);

    //Proprietà
}

LBBaseWorldObject.prototype = Object.create(LBBaseObject.prototype);
LBBaseWorldObject.prototype.constructor = LBBaseWorldObject;