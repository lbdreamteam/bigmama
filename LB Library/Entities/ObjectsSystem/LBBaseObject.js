BaseObject = function (game, x, y, graph) {
    BaseEntity.call(this, game, x, y, graph);

    //Proprietà
}

BaseObject.prototype = Object.create(BaseEntity.prototype);
BaseObject.prototype.constructor = BaseObject;