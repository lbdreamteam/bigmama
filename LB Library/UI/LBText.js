LBText = function (text, x, y) {
    //LBText usa il font di default del gioco, istanziato in GameState
    this.text = text;
    this.t_x = x;
    this.t_y = y;

    //this.create();
}

LBText.prototype = Object.create(Object);
LBText.prototype.constructor = LBText;

LBText.prototype.create = function () {

}