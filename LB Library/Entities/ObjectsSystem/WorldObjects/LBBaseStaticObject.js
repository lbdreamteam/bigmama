LBBaseStaticObject = function (gameInstance, Tx, Ty, graph) {
    LBBaseWorldObject.call(this, gameInstance, Tx, Ty, graph);

    //Proprietà
}

LBBaseStaticObject.prototype = Object.create(LBBaseWorldObject.prototype);
LBBaseStaticObject.prototype.constructor = LBBaseStaticObject;

LBBaseStaticObject.prototype.update = function () {

}