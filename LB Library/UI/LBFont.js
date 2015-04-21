LBFont = function (scale, italic, bold) {
    if (scale == undefined || ( scale != "h1" && scale != "h2" && scale != "h3")) { scale = "h1"; }
    if (italic == undefined) { italic = false; }
    if (bold == undefined) { bold = false; }

    this.scale = scale; //Grandezza del carattere (h1, h2, h3)
    this.italic = italic;
    this.bold = bold;

    this.char = []; //Array dei caratteri ascii
    this.fwidth = []; 
    this.fheight = []; 
    this.fx = [];
    this.fy = [];

    //TODO: non va da solo il create
    this.create();
}

LBFont.prototype = Object.create(Object);
LBFont.prototype.constructor = LBFont;

LBFont.prototype.create = function () {
    
    //Set degli array
    LBFont.prototype.fillArray(this.char, "id");
    LBFont.prototype.fillArray(this.fwidth, "width");
    LBFont.prototype.fillArray(this.fheight, "height");
    LBFont.prototype.fillArray(this.fx, "x");
    LBFont.prototype.fillArray(this.fy, "y");
    LBFont.prototype.imageHandler();

}



LBFont.prototype.fillArray = function (arr, attribute) {
    //Viene caricato il documento XML del font
    xml = new XMLHttpRequest;
    xml.open("GET", "assets/font.xml", false);
    xml.send();
    xmlDoc = xml.responseXML;

    count = xmlDoc.getElementsByTagName('chars')[0].getAttribute('count');

    for (i = 0; i <= count; i++)
    {
        arr[i] = xmlDoc.getElementsByTagName('char')[i].getAttribute(attribute);
        //console.log(arr[i]);
    }
}

LBFont.prototype.imageHandler = function () {

    gameInstance.phaserGame.load.image('font_table', 'assets/font.png');
    var im = gameInstance.phaserGame.cache.getImage('font_table');
    var rect = new Phaser.Rectangle(this.fx[0], this.fy[0], this.fwidth[0], this.fheight[0]);
    console.log(im.width);
    console.log(im.height);
    var bm = new Phaser.BitmapData(gameInstance.phaserGame, 'bitmap_font', im.width, im.height);

    
}
