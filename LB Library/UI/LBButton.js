LBButton = function (style, text, x, y, callback) {

    if (callback == null) { callback = function () { };}


    this.b_style = style;
    this.b_text_temp;
    this.b_text = text;
    this.b_x = x;
    this.b_y = y;
    this.b_callback = callback;
    this.b_down = false;
    this.b_over = false;
    this.base_sprite = gameInstance.phaserGame.add.sprite(this.b_x, this.b_y, this.b_style);
    this.base_sprite.inputEnabled = true;
   
    this.create();
}

LBButton.prototype = Object.create(Object);
LBButton.prototype.constructor = LBButton;

LBButton.prototype.create = function () { 
    this.stateHandler(this.b_down, this.b_over);
    this.base_sprite.events.onInputUp.add(this.b_callback, this);
}

LBButton.prototype.stateHandler = function (down, over) {

    this.base_sprite.events.onInputDown.add(function (down) { down = true; }, gameInstance.phaserGame);
    this.base_sprite.events.onInputOver.add(function (over) { over = true; }, gameInstance.phaserGame);
    this.base_sprite.events.onInputOut.add(function (over) { over = false; }, gameInstance.phaserGame);
    this.base_sprite.events.onInputUp.add(function (down) { down = false;  }, gameInstance.phaserGame);
}

LBButton.prototype.frameHandler = function () {

  
}

LBButton.prototype.textHandler = function () {
    if (typeof this.b_text === 'object') {

        //Gestire dimensione/posizione del testo che è già un oggetto

    }
    else {
         this.b_text_temp = new LBText(null, this.b_text, this.b_x, this.b_y, null, null, '#000000')
    }
}



