LBDepthComponent = function (agent) {
    LBBaseComponent.call(this, agent);

    this.depthGroup;
    this.maxZ = 100;    //Da cambiare
}

LBDepthComponent.prototype = Object.create(LBBaseComponent.prototype);
LBDepthComponent.prototype.constructor = LBDepthComponent;

//Funzione per ordinare gli oggetti nell'ordine di rendering
//utilizza character e target per capire se il player si sta muovendo e in quale direzione
//character è l'entity che si sta muovendo, target è il punto verso cui si sta muovendo
LBDepthComponent.prototype.depthSort = function (character, target){
    if (target === undefined || character === undefined) this.depthGroup.customSort(this.depthSortHandler.bind(this));
    else if (target.y > character.y) this.depthGroup.customSort(this.downDepthSortHandler.bind(this));
    else if (target.y < character.y) this.depthGroup.customSort(this.upDepthSortHandler.bind(this));
    else this.depthGroup.customSort(this.depthSortHandler.bind(this));
}

//Utilizzato da group.customSort per ordinare una coppia di oggetti
LBDepthComponent.prototype.depthSortHandler = function (a, b){
    if (this.totalDepth(a) > this.totalDepth(b)) return 1;
    else if (this.totalDepth(a) === this.totalDepth(b)) return 0;
    else return -1;
}

//Come depthSortHandler solo che considera un oggetto in movimento verso il basso come al punto di arrivo
LBDepthComponent.prototype.downDepthSortHandler = function (a, b){
    return this.depthSortHandler(this.moveDepth(a,1),this.moveDepth(b,1));
}

//Come depthSortHandler solo che considera un oggetto in movimento verso l'alto come al punto di arrivo
LBDepthComponent.prototype.upDepthSortHandler = function (a, b){
    return this.depthSortHandler(this.moveDepth(a,-1),this.moveDepth(b,-1));
}

//Se un oggetto si sta muovendo lo sposta nella direzione indicata, altrimenti lo lascia invariato
//direction: 1 down, -1 up
LBDepthComponent.prototype.moveDepth = function (a, direction){
    return result = {
        y: a.cMovement != undefined ? (a.cMovement.isMoving ? a.y + 32 * direction : a.y) : a.y,
        zDepth: a.zDepth,
        height: a.height,
        anchor: a.anchor
    }
}

//Calcola la profondità(con cui va ordinato) di un generico oggetto con una coordinata y ed eventualmente una zDepth
LBDepthComponent.prototype.totalDepth = function (a){
    if (a.zDepth === undefined) return (a.y + (1 - a.anchor.y) * a.height) * this.maxZ;
    else return (a.y + (1 - a.anchor.y) * a.height) * this.maxZ + a.zDepth;
}