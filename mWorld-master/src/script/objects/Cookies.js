var DraggableObject = require('./DraggableObject');
var GLOBAL = require('../global.js');
//var NumberRepresentation = require('./representations/NumberRepresentation.js');
var EventSystem = require('../pubsub.js');

module.exports = Cookies;

Cookies.prototype = Object.create(DraggableObject.prototype);
Cookies.prototype.constructor = Cookies;

function Cookies (game, number, options) {

    if (typeof options.keepDown === 'undefined' || options.keepDown === null) {
        //options.keepDown = true;
    }

    this.background = options.background.slice(0, 6) + number + options.background.slice(7);
    this.spriteKey = options.spriteKey;
    this.spriteFrame = options.spriteFrame;

    //alert('final '+options.background +);
    //alert(this.background +' id: ' + options.id);
    if (typeof this.background === 'undefined') {
        this.background = options.background.slice(0, 6) + number + options.background.slice(7);

    }
    options.background = this.background;
    options.id += 1;
    this.id = options.id;
    this.idName = options.idName;
   DraggableObject.call(this, game, options); // Parent constructor.

   this.vertical = options.vertical;
   if (typeof this.vertical === 'undefined' || this.vertical === null) {
        this.vertical = true;
   }

    this.setDirection(!this.vertical);

    this.min = options.min || null;
    this.max = options.max || null;
    this._number = 0;
    this.number = number;
    this._clicker = options.onClick;


    this.onClick = function () {
        //EventSystem.publish(GLOBAL.EVENT.numberPress, [this.number, GLOBAL.NUMBER_REPRESENTATION.numbers]);
        if (this._clicker) {
            this._clicker(this.number);

        }
    };

    return this;

}

Object.defineProperty(Cookies.prototype, 'number', {
    get: function () {
        return this._number;
    },
    set: function (value) {
        /* Check boundaries */
        if (this.min && value < this.min) { value = this.min; }
        if (this.max && value > this.max) { value = this.max; }
        if (value === this._number) { return; }

        this._number = value;

        this.updateGraphics(value);
    }
});

Cookies.prototype.updateGraphics = function (num) {
    /* Remove old graphics. */
    if (this.children.length > 1) {
        this.removeBetween(1, this.children.length-1, true);
    }

    if(this.idName !== 'finalDragObject') {
        this.bg.frame = num + 8;
    }

    this.setSize();
    this.reset();
};


Cookies.prototype.calcOffset = function (offset) {
    var t = {
        x: 0,
        y: 0,
        o: this.size/offset
    };

    if (this.background) { // Probably square looking button.
        t.x = t.o*2;
        t.y = t.o*2;
    } else if (this.direction) { /* Up/Down */
        t.x = t.o*1.8;
        t.y = t.o*(this._number >= 0 ? 3.3 : 1);
    } else { /* Left/Right */
        t.x = t.o*(this._number >= 0 ? 1 : 3.3);
        t.y = t.o*2;
    }

    t.o *= 4;
    return t;
};


Cookies.prototype.setSize = function (size) {
    DraggableObject.prototype.setSize.call(this, size || this.size);

    // If the button should expand horizontally it will be rotated.
    // So we always want to change height, not width.
    //this.bg.height *= this.GLOBAL.NUMBER_REPRESENTATION.numbers.length;

    return this;
};

Cookies.prototype.setDirection = function (val) {
    this.direction = val;
    if (val) {
        this.bg.rotation = -Math.PI/2;
        this.bg.y += this.bg.width;
        this.bg.adjusted = this.bg.width;
    } else {
        this.bg.rotation = 0;
        this.bg.y -= this.bg.adjusted || 0;
    }

    if (this.number) {
        this.updateGraphics(this.number);
    }

    return this;
};