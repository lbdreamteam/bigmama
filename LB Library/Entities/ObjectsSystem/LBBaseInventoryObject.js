BaseInventoryObject = function (game, x, y, graph) {
    BaseObject.call(this, game, x, y, graph);

    //Proprietà
}

BaseInventoryObject.prototype = Object.create(BaseObject.prototype);
BaseInventoryObject.prototype.constructor = BaseInventoryObject;