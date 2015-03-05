LBBaseInventoryObject = function (game, x, y, graph) {
    LBBaseObject.call(this, game, x, y, graph);

    //Proprietà
}

LBBaseInventoryObject.prototype = Object.create(LBBaseObject.prototype);
LBBaseInventoryObject.prototype.constructor = LBBaseInventoryObject;