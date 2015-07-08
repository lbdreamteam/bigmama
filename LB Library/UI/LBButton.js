LBButton = function (style, text, x, y, callback) {

    if (callback == null) { callback = function () { }; }

    this.b_style = style;
   

    this.b_x = x;
    this.b_y = y;

    this.b_callback = callback;
    this.b_down = false;
    this.b_over = false;

    Phaser.Sprite.call(this, gameInstance.phaserGame,this.b_x, this.b_y, this.b_style);
    gameInstance.phaserGame.add.existing(this);
    this.inputEnabled = true;
   
    this.b_text = new LBText(text.text_font, text.text, text.t_x, text.t_y, text.t_Wspacing, text.t_Hspacing, text.color);   // riistanzia il testo per farlo apparire sopra il bottone
    text.kill();                                                                                                 // da eliminare una volta gestito il Depth group                                                                                                                           

   

    this.create();
}

LBButton.prototype = Object.create(Phaser.Sprite.prototype);
LBButton.prototype.constructor = LBButton;

LBButton.prototype.create = function () {

    this.stateHandler(this.b_down, this.b_over);
    this.events.onInputUp.add(this.b_callback, this);
    this.textHandler();

}

LBButton.prototype.stateHandler = function (down, over) {

    this.events.onInputDown.add(function (down) { down = true; }, gameInstance.phaserGame);
    this.events.onInputOver.add(function (over) { over = true; }, gameInstance.phaserGame);
    this.events.onInputOut.add(function (over) { over = false; }, gameInstance.phaserGame);
    this.events.onInputUp.add(function (down) { down = false;  }, gameInstance.phaserGame);
}

LBButton.prototype.frameHandler = function () {

  
}

LBButton.prototype.textHandler = function () {

    if (typeof this.b_text === 'object') {

        //Gestire dimensione/posizione del testo che è già un oggetto

    }
    else {
        this.b_text = new LBText(new LBFont('small', false, false), this.b_text, this.b_x, this.b_y, 60, 60, 0x9966FF);
    }

    this.centerText(this.b_text);

}


LBButton.prototype.centerText = function(txt) {

    this.width = txt.width * 3 / 2;
    this.height = txt.height * 3 / 2;

    txt.anchor.x = 0.5;
    txt.anchor.y = 0.5;

    txt.x = this.b_x + this.width / 2;
    txt.y = this.b_y + this.height / 2;
}


