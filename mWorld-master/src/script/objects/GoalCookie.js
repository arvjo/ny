var GoalObject = require('./GoalObject');
var GLOBAL = require('../global.js');
//var NumberRepresentation = require('./representations/NumberRepresentation.js');
var EventSystem = require('../pubsub.js');

module.exports = GoalCookie;

GoalCookie.prototype = Object.create(GoalObject.prototype);
GoalCookie.prototype.constructor = GoalCookie;

function GoalCookie (game, number, options) {

    this.background = options.background.slice(0, 6) + number + '-mirror' + options.background.slice(7);
    this.spriteKey = options.spriteKey;
    this.spriteFrame = options.spriteFrame;
    //options.background = this.background;
    alert(this.background);
    if (typeof this.background === 'undefined') {
        this.background = 'Cookie6-mirror.png';
        alert('hej');
    }
    GoalObject.call(this, game, options); // Parent constructor.

    this.vertical = options.vertical;
    if (typeof this.vertical === 'undefined' || this.vertical === null) {
        this.vertical = true;
    }

    this.setDirection(!this.vertical);
    //alert('hej');
    this.min = options.min || null;
    this.max = options.max || null;

    this._number = 0;
    this.number = number;
    //alert('goalcookie number: '+ this.number);
    //alert('min: ' + this.min + 'max: ' + this.max + 'nummer: ' + this.number + '_nummer' + this._number);
    return this;

}

Object.defineProperty(GoalCookie.prototype, 'number', {
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

GoalCookie.prototype.updateGraphics = function (num) {
    /* Remove old graphics. */
   if (this.children.length > 1) {
        this.removeBetween(1, this.children.length-1, true);
   }
    this.number = 0;
    this.bg.frame = num-1;
    //this.setSize();

};


GoalCookie.prototype.calcOffset = function (offset) {
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

GoalCookie.prototype.setSize = function (size) {
    GoalObject.prototype.setSize.call(this, size || this.size);

    // If the button should expand horizontally it will be rotated.
    // So we always want to change height, not width.
    //this.bg.height *= this.GLOBAL.NUMBER_REPRESENTATION.numbers.length;

    return this;
};

GoalCookie.prototype.setDirection = function (val) {
    this.direction = val;
    //alert('hej: ' + val);
    if (val) {

        this.bg.rotation = -Math.PI / 2;
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