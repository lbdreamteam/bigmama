LBBaseInteractableObject = function (game, x, y, graph, callback) {
    LBBaseWorldObject.call(this, game, x, y, graph);

    //Proprietà
    this.callback = callback;
}

LBBaseInteractableObject.prototype = Object.create(LBBaseWorldObject.prototype);
LBBaseInteractableObject.prototype.constructor = LBBaseInteractableObject;

LBBaseInteractableObject.prototype.update = function () {
	if (this.overlap(this.gameInstance.playerInstance)) {
		console.log('touched');
		this.callback();
	}
}