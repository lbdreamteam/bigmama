//http://kvazars.com/littera/  generatore font

LBFont = function (scale, italic, bold) {
    if (scale == undefined || (scale != "small" && scale != "medium" && scale != "large")) { scale = "small"; }
    if (italic == undefined) { italic = false; }
    if (bold == undefined) { bold = false; }

    this.scale = scale; //Grandezza del carattere (small, medium, large)
    this.italic = italic;
    this.bold = bold;

    this.char_ASCII = []; //Array dei caratteri ascii
    this.f_width = [];
    this.f_height = [];
    this.f_x = [];
    this.f_y = [];
    this.single_char_data = []; //Contiene ImageData
    this.rect = [];
    this.bmd = []; //BitmapData
    this.pixels = [];

    this.img =  gameInstance.phaserGame.cache.getImage('font_table_' + this.scale);

    this.fullimgdata = {};

    this.rgba = [];

    this.base_rgba = {
        r:0,
        g:0,
        b:0,
        a:0
    }

    this.create();
}

LBFont.prototype = Object.create(Object);
LBFont.prototype.constructor = LBFont;

LBFont.prototype.create = function () {

    //Set degli array
    this.loadFontProps(this.char_ASCII, "id");
    this.loadFontProps(this.f_width, "width");
    this.loadFontProps(this.f_height, "height");
    this.loadFontProps(this.f_x, "x");
    this.loadFontProps(this.f_y, "y");
    this.imageHandler(this.fullimgdata);
}

LBFont.prototype.loadFontProps = function (arr, attribute) {
    //Viene caricato il documento XML del font
    xml = new XMLHttpRequest;
    xml.open("GET", "assets/font_" + this.scale + "/font.xml", false);
    xml.send();
    xmlDoc = xml.responseXML;

    count = xmlDoc.getElementsByTagName('chars')[0].getAttribute('count');

    for (i = 0; i <= count; i++) {
        arr[i] = xmlDoc.getElementsByTagName('char')[i].getAttribute(attribute);

    }
}

LBFont.prototype.imageHandler = function (imgdata) {


    var font_img = gameInstance.phaserGame.cache.getImage('font_table_' + this.scale);

    var font_bitmap = gameInstance.phaserGame.add.bitmapData(font_img.width, font_img.height);
     


    font_bitmap.addToWorld();

    font_bitmap.draw(font_img, 0, 0);

    var base_rectangle = new Phaser.Rectangle(0, 0, this.img.width, this.img.height);

    imgdata = font_bitmap.getPixels(base_rectangle);

    this.setRGBAProp(this.rgba);
    
    this.getPixelColor(this.rgba, imgdata);

    this.setPixelColor(this.rgba, imgdata);

    console.log(imgdata);
    font_bitmap.ctx.putImageData(imgdata, 0, 0);

    for (var i = 0; i < this.char_ASCII.length - 1; i++)
        this.getPixels(font_img, font_bitmap, i);

    //font_bitmap.clear();

    for (var i = 0; i < this.char_ASCII.length - 1; i++)
        this.createChar( i);

  
}

LBFont.prototype.getPixels = function (im, bmd, count) {
    
    this.rect[count] = new Phaser.Rectangle(this.f_x[count], this.f_y[count], this.f_width[count], this.f_height[count]);
    this.single_char_data[count] = bmd.getPixels(this.rect[count]);
}

LBFont.prototype.createChar = function (count) {
   
    this.bmd[count] = gameInstance.phaserGame.make.bitmapData(this.rect[count].width,this.rect[count].height);
    this.bmd[count].ctx.putImageData(this.single_char_data[count], 0, 0);
    gameInstance.phaserGame.cache.addBitmapData(this.char_ASCII[count], this.bmd[count]);
}

LBFont.prototype.setRGBAProp = function (rgba) {


    console.log("lenght:" + this.img.width * this.img.height);

    for (i = 0; i < this.img.width * this.img.height; i++) {
        rgba[i] = this.base_rgba;
    }
}

LBFont.prototype.getPixelColor = function (rgba,fullimgdata) {


    var count = 0;

    for (var j = 0; j < this.img.width * this.img.height ; j += 4) {

        rgba[count].r = fullimgdata.data[j];
        rgba[count].g = fullimgdata.data[j + 1];
        rgba[count].b = fullimgdata.data[j + 2];
        rgba[count].a = fullimgdata.data[j + 3];
        count++;
    }
}

LBFont.prototype.setPixelColor = function (rgba, fullimgdata) {

    for (var i = 0; i < this.img.width * this.img.height; i++) {
        if (rgba[i].r != 47) {
            rgba[i].r = 4;
            rgba[i].g = 5;
            rgba[i].b = 45;
        }
    }

    var count = 0;

    for (var j = 0; j < this.img.width * this.img.height*4; j += 4) {

        fullimgdata.data[j] = rgba[count].r;
        fullimgdata.data[j + 1] = rgba[count].g;
        fullimgdata.data[j + 2] = rgba[count].b;
        fullimgdata.data[j + 3] = rgba[count].a;
        count++;
    }
}