BaseInteractableObject = function (game, x, y, graph, callback) {
    BaseWorldObject.call(this, game, x, y, graph);

    //Proprietà
    this.callback = callback;
}

BaseInteractableObject.prototype = Object.create(BaseWorldObject.prototype);
BaseInteractableObject.prototype.constructor = BaseInteractableObject;

BaseInteractableObject.prototype.update = function () {
	if (this.overlap(this.gameInstance.playerInstance)) {
		console.log('touched');
		this.callback();
	}
}