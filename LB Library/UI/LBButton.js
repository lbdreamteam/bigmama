LBButton = function (style, text, x, y, callback) {

    this.b_style = style;
    this.b_text = text;
    this.b_x = x;
    this.b_y = y;
    this.b_callback = callback;
    this.b_state = 'out';
}

LBButton.prototype = Object.create(Object);
LBButton.prototype.constructor = LBButton;

LBButton.prototype.create = function () {

}

LBButton.prototype.eventHandler = function () {
    
}