LBBaseStaticObject = function (game, x, y, graph) {
    LBBaseWorldObject.call(this, game, x, y, graph);

    //Proprietà
}

LBBaseStaticObject.prototype = Object.create(LBBaseWorldObject.prototype);
LBBaseStaticObject.prototype.constructor = LBBaseStaticObject;

LBBaseStaticObject.prototype.update = function () {

}