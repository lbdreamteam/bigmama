LBButton = function (style, text, x, y, callback) {

    this.b_style = style;
    this.b_text = text;
    this.b_x = x;
    this.b_y = y;
    this.b_callback = callback;
    this.b_down = false;
    this.b_over = false;
    this.base_sprite = gameInstance.phaserGame.add.sprite(this.b_x, this.b_y, this.b_style);

    this.create();
}

LBButton.prototype = Object.create(Object);
LBButton.prototype.constructor = LBButton;

LBButton.prototype.create = function () {
    if (this.base_sprite.events.onInputDown.active) {
        console.log('Click');
    }
}

LBButton.prototype.eventHandler = function () {
    
}

LBButton.prototype.update = function () {

}