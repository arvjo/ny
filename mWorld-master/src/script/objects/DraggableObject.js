var GLOBAL = require('../global.js');
//var NumberRepresentation = require('./representations/NumberRepresentation.js');
//var NumberGame = require('../states/BeachState.js');
var util = require('../utils.js');
module.exports = DraggableObject;

DraggableObject.prototype = Object.create(Phaser.Group.prototype);
DraggableObject.prototype.constructor = DraggableObject;
DraggableObject.prototype.buttonColor = GLOBAL.BUTTON_COLOR;

function DraggableObject (game, options) {
    Phaser.Group.call(this, game, null);
    options = options || {};
    //alert('x1:'+options.startPosX);
    this.x = options.x || 0;
    this.y = options.y || 0;
    this.startPosX = options.startPosX;
    this.startPosY = options.startPosY;
    this.color = options.color || this.buttonColor;
    this.try = 0;
    this.idName = options.idName;
    if (options.colorPressed) {
        this.colorPressed = options.colorPressed;
    } else {
        var col = Phaser.Color.getRGB(this.color);
        col.red -= col.red < 40 ? col.red : 40;
        col.green -= col.green < 40 ? col.green : 40;
        col.blue -= col.blue < 40 ? col.blue : 40;
        this.colorPressed = Phaser.Color.getColor(col.red, col.green, col.blue);
    }

    this.onClick = options.onClick;
    this.disabled = options.disabled || false;
    this.keepDown = options.keepDown || false;
    this.background = options.background;

    var background = options.background;
    if (typeof background === 'undefined') {
        background = 'button';
    }
    //alert(background + ' id: ' + options.id2);
    this.bg = this.create(0, 0, (background === null ? null : 'cookie'), background);

    this.bg.inputEnabled = true;
    this.bg.input.enableDrag(true,true);
    this.id = options.id;
    this.dropPlaceX = options.dropPlaceX;
    this.dropPlaceY = options.dropPlaceY;
    this.bg.events.onDragStop.add(stopDrag,this,options);
    this.bg.events.onDragStart.add(startDrag,this,options);
    //this.bg.events.
    //alert(this.drag);
   /* while(this.drag === true) {
        alert('hej');
        var x = this.game.input.mousePointer.x;
        var y = this.game.input.mousePointer.y;
        NumberRepresentation.updatePosition.call(this, x, y);
    }*/
   // while(!this.game.onInputUp) {

        //NumberRepresentation.updatePosition.call(this, x, y);
    //}
    //var click = game.add.audio('click');
    this.bg.events.onInputDown.add(function () {
        //alert('hej2');
        if (this.disabled || this.bg.tint === this.colorPressed) {
            return;
        }

        this.bg.tint = this.colorPressed;
        //click.play();


    }, this);



    this.reset();
    this.setSize(options.size || 75);
    return this;
}

function stopDrag(options){
    var x = this.game.input.x;
    var y = this.game.input.y;

    x = x-156;
    if(x > this.dropPlaceX -10 && x < this.dropPlaceX+ 80 && y > this.dropPlaceY -10 && y < this.dropPlaceY + 80) {
        //alert(this.id);


            if (this.onClick) {
                this.onClick();
            }

        if (this.idName !== 'finalDragObject') {
            //alert('test: ' + this.startPosY);
            if ( DraggableObject.try < 0) {
                options.x = this.dropPlaceX - (this.startPosX+ ((this.id-1) *113));
                options.y = this.dropPlaceY - this.startPosY;
            }
            else if(DraggableObject.try > 0){
                options.x = this.dropPlaceX - ((this.startPosX+ ((this.id-1) *113))+75);
                options.y = this.dropPlaceY - this.startPosY;
            }
            else{
                options.x = 1;
                options.y = 1;
            }
        }
        else{
            alert('hej');
            options.x = 1;
            options.y = 1;
        }
    }
    else{
        options.x = 1;
        options.y = 1;
    }
    this.reset();
}

function startDrag(options){
    //NumberRepresentation.updatePosition.call(this, options.x, options.y);
    /*while(!this.game.onInputUp) {
        //alert('hej');
        var x = this.game.input.mousePointer.x;
        var y = this.game.input.mousePointer.y;
        NumberRepresentation.updatePosition.call(this, x, y);
    }*/
    //NumberRepresentation.updatePosition.call(this, options.x, options.y);
}

DraggableObject.prototype.setSize = function (size) {
    this.size = size;
    this.bg.width = size;
    this.bg.height = size;
};

DraggableObject.prototype.setTry = function(num){
    DraggableObject.try = num;
};

DraggableObject.prototype.reset = function () {
    this.bg.tint = this.color;

};

DraggableObject.prototype.setDown = function () {
    this.bg.tint = this.colorPressed;
};

DraggableObject.prototype.highlight = function (duration, from) {
    from = typeof from === 'number' ? from : 1;
    return TweenMax.fromTo(this, 0.5, { alpha: from }, { alpha: 0 }).backForth(duration || 3);
};