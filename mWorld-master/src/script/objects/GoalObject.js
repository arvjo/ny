var GLOBAL = require('../global.js');
//var NumberRepresentation = require('./representations/NumberRepresentation.js');

module.exports = GoalObject;

GoalObject.prototype = Object.create(Phaser.Group.prototype);
GoalObject.prototype.constructor = GoalObject;
GoalObject.prototype.buttonColor = GLOBAL.BUTTON_COLOR;

function GoalObject (game, options) {
    Phaser.Group.call(this, game, null); //
    options = options || {};
    this.x = options.dropPlaceX || 0;
    this.y = options.dropPlaceY || 0;

    this.color = options.color || this.buttonColor;

    var col = Phaser.Color.getRGB(this.color);
    col.red -= col.red < 40 ? col.red : 40;
    col.green -= col.green < 40 ? col.green : 40;
    col.blue -= col.blue < 40 ? col.blue : 40;


    this.disabled = options.disabled || false;

    var background = options.background;
    //var background = 'cookie4.png';
    if (typeof background === 'undefined') {
        background = 'button';
    }
    //alert(background);
    this.bg = this.create(0, 0, (background === null ? null : 'cookie'), background);

    this.setSize(options.size || 75);
    return this;
}


GoalObject.prototype.setSize = function (size) {
    this.size = size;
    this.bg.width = size;
    this.bg.height = size;
};


GoalObject.prototype.highlight = function (duration, from) {
    from = typeof from === 'number' ? from : 1;
    return TweenMax.fromTo(this, 0.5, {alpha: from}, {alpha: 0}).backForth(duration || 3);
};

