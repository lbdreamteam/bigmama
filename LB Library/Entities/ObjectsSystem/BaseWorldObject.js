BaseWorldObject = function (game, x, y, graph) {
    BaseObject.call(this, game, x, y, graph);

    //Proprietà
}

BaseWorldObject.prototype = Object.create(BaseObject.prototype);
BaseWorldObject.prototype.constructor = BaseWorldObject;