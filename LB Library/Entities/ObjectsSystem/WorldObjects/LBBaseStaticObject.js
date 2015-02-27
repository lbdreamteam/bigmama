BaseStaticObject = function (game, x, y, graph) {
    BaseWorldObject.call(this, game, x, y, graph);

    //Proprietà
}

BaseStaticObject.prototype = Object.create(BaseWorldObject.prototype);
BaseStaticObject.prototype.constructor = BaseStaticObject;

BaseStaticObject.prototype.update = function () {

}