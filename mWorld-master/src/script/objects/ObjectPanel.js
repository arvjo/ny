//var GLOBAL = require('../../global.js');
var Cookies = require('./Cookies.js');
var GoalCookie = require('./GoalCookie.js');

module.exports = ObjectPanel;

ObjectPanel.prototype = Object.create(Phaser.Group.prototype);
ObjectPanel.prototype.constructor = ObjectPanel;


function ObjectPanel (game, amount, options) {
    Phaser.Group.call(this, game, null); // Parent constructor.
    this.x = options.x || 0;
    this.y = options.y || 0;
    this.vertical = options.vertical || false;
    this.reversed = options.reversed || false;
    this.size = options.size || (this.vertical ? this.game.world.height : this.game.world.width);

    this.dropPlaceX = options.dropPlaceX;
    this.dropPlaceY = options.dropPlaceY;
    this.id = options.id;
    this.color = options.color;
    this.background = options.background;
    this.background = 'cookie4.png';

    this.maxObjectSize = options.maxObjectSize || 75;
    this.onClick = options.onClick;
    options.min = options.min || 1;
    this.setRange(options.min, options.max || (options.min + amount - 1));

    return this;
}

ObjectPanel.prototype._createObject = function () {
    this.removeAll(true);

    /* Calculate max button size. */
    var objectSize = this.size/this.amount;
    if (objectSize > this.maxObjectSize) {
        objectSize = this.maxObjectSize;
    }
    //alert(currentNumber);
    //var number = 10 - currentNumber;
    /* These options will be used when creating the buttons. */
    var objectOptions = {
        min: this.min,
        max: this.max,
        size: objectSize,
        background: this.background,
        color: this.color,
        vertical: !this.vertical,
        onClick: this.onClick,
        dropPlaceX: this.dropPlaceX,
        dropPlaceY: this.dropPlaceY,
        id: 0,
        idName: this.id,
        startPosX: this.x,
        startPosY: this.y
    };


    /* Set up the buttons that should be in the panel. */
    if(this.id === 'dragObject' ) {
        for (var i = this.min; i <= this.max; i++) {
            this.cookie = new Cookies(this.game, i, objectOptions);
            this.add(this.cookie);
        }
    }
    else if(this.id === 'goalObject') {
        this.goalCookie = new GoalCookie(this.game,6, objectOptions);
        this.add(this.goalCookie);
    }
    else{
        this.add(new Cookies(this.game,10, objectOptions));
    }
    /* Reverse the order of the buttons if needed. */
    if (this.reversed) { this.reverse(); }


    /* Calculate white space. */
    var widthLeft = this.size - objectSize*this.amount;
    var paddingSize = widthLeft/this.amount;
    if (paddingSize > objectSize/2) {
        paddingSize = objectSize/2;
    }
    var margin = (this.size - this.amount*objectSize - (this.amount - 1)*paddingSize)/2;
    var fullSize = paddingSize + objectSize;

    /* Set up the x and y positions. */
    var direction = this.vertical ? 'y' : 'x';
    for (var j = 0; j < this.length; j++) {
        this.children[j][direction] = margin + fullSize*j;
    }
};

ObjectPanel.prototype._updateObjects = function (currentNumber) {
    var rand = Math.round(Math.random()*10);
    var correct = currentNumber;
    var randIndex = Math.floor(Math.random()*3) ;
    var i = 0;
    if(this.cookie) {
        for (var key in this.children) {
            this.children[key].min = this.min;
            this.children[key].max = 9;
            if (i === randIndex) {
                //alert(key + ' : ' + correct);
                this.children[key].number = correct;
            }
            else {
                this.children[key].number = rand;
            }
            Cookies.prototype.updateGraphics.call(this.cookie, rand);
            rand = Math.round(Math.random() * 10);
            i++;
        }
        i = 0;
    }

    if(this.goalCookie) {
        GoalCookie.prototype.updateGraphics.call(this.goalCookie, 10-currentNumber);
    }
};

ObjectPanel.prototype.setRange = function (min, max,currentNumber) {
    this.min = min;
    this.max = max;
   // alert('blablalalasld: '+this.goalCookie);
    var oldAmount = this.amount || 0;
    // incrementalSteps have these buttons: (-) (number) (+) (ok)
    this.amount =  (this.max - this.min + 1);
    //alert(this.amount);
    if (this.amount !== oldAmount || this.length <= 0) {
        this._createObject();
    } else {
        this._updateObjects(currentNumber);
    }
};

ObjectPanel.prototype.reset = function () {
    for (var i = 0; i < this.length; i++) {
        this.children[i].reset();
    }
};

ObjectPanel.prototype.highlightObject = function (duration, from) {
    var t = new TimelineMax();
    for (var i = 0; i < this.length; i++) {
        t.add(this.children[i].highlightObject(duration, from), 0);
    }
    return t;
};

ObjectPanel.prototype.disable = function (value) {
    for (var i = 0; i < this.length; i++) {
        this.children[i].disabled = value;
    }
};