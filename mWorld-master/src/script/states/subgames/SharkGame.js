var NumberGame = require('./NumberGame.js');
//var BeeFlightBee = require('./BeeFlightBee.js');
var SharkGameApe = require('./SharkGameApe.js');
var GLOBAL = require('../../global.js');
var LANG = require('../../language.js');
var util = require('../../utils.js');

module.exports = SharkGame;

SharkGame.prototype = Object.create(NumberGame.prototype);
SharkGame.prototype.constructor = SharkGame;
function SharkGame () {
    NumberGame.call(this); // Call parent constructor.
}

SharkGame.prototype.pos = {
    flowers: {
        start: 325, stopOffset: 0
    },
    home: {
        x: 110, y: 700
    },
    bee: {
        x: 120, y: 300,
        homeScale: 0.3,
        airScale: 0.8,
        flowerScale: 0.6
    },
    agent: {
        start: { x: 1200, y: 400 },
        stop: { x: 777, y: 360 },
        scale: 0.35
    }
};
SharkGame.prototype.preload = function () {
    this.load.audio('beeSpeech', LANG.SPEECH.beeflight.speech); // speech sheet
    this.load.audio('apeSpeech', LANG.SPEECH.sharkgame.speech);
    this.load.audio('beeMusic', ['audio/subgames/beeflight/music.m4a', 'audio/subgames/beeflight/music.ogg', 'audio/subgames/beeflight/music.mp3']);
    this.load.audio('apeIntro1',['audio/subgames/sharkgame/AhVadJag.mp3']);
    this.load.audio('apeSucces',['audio/subgames/sharkgame/EnKakaTill.mp3']);
    this.load.audio('apeWin',['audio/subgames/sharkgame/GladMojang.mp3']);
    this.load.audio('apeIntro2',['audio/subgames/sharkgame/JagVetInte.mp3']);
    this.load.audio('agentTry2',['audio/subgames/sharkgame/Jamenvisst.mp3']);
    this.load.audio('apeIntro4',['audio/subgames/sharkgame/Kakbit.mp3']);
    this.load.audio('agentTry',['audio/subgames/sharkgame/Kollapa.mp3']);
    this.load.audio('apeIntro3',['audio/subgames/sharkgame/Mackapar.mp3']);
    this.load.audio('apeMusic',['audio/subgames/sharkgame/music.mp3']);
    this.load.audio('apeFail',['audio/subgames/sharkgame/ProvaEnGangtill.mp3']);
    this.load.atlasJSONHash('ape', 'img/subgames/beeflight/atlas.png', 'img/subgames/beeflight/atlas.json');
    this.load.atlasJSONHash('shark', 'img/subgames/sharkgame/atlas.png', 'img/subgames/sharkgame/atlas.json');
    this.load.atlasJSONHash('apa', 'img/subgames/sharkgame/apa.png', 'img/subgames/sharkgame/apa.json');
    this.load.atlasJSONHash('numbers', 'img/objects/numbers.png', 'img/objects/numbers.json');
};

SharkGame.prototype.buttonColor = 0xface3d;

SharkGame.prototype.create = function () {
    // Setup additional game objects on top of NumberGame.init
  this.setupButtons({
       /* buttons: {
            x: 150,
            y: 25,
            size: this.world.width - 300
        },*/
        yesnos: {
            x: 150,
            y: 25,
            size: this.world.width - 300
        }
    });

   this.setUpDragObject({
       dragObject:{
           x: 100,
           y: 670,
           size: this.world.width - 300,
           dropPlaceX: 200,
           dropPlaceY: 200,
           id: 'dragObject'
       },
       goalObject:{
           x: 200,
           y: 200,
           size: this.world.width - 300,
           id: 'goalObject'
       },
       finalDragObject:{
           x: 200,
           y: 200,
           size: this.world.width - 300,
           dropPlaceX: -50,
           dropPlaceY: 500,
           id: 'finalDragObject'
       }
    });

    this.add.sprite(0, 0, 'shark', 'island.png', this.gameGroup);

    var cloud1 = this.gameGroup.create(-1000, 10, 'objects', 'cloud2');
    var cloud2 = this.gameGroup.create(-1000, 150, 'objects', 'cloud1');
    this.number1 = this.gameGroup.create(50, 200, 'numbers', '1.png');
    this.plus = this.gameGroup.create(120, 180, 'numbers', '+.png');
    this.number2 = this.gameGroup.create(150, 200, 'numbers', '1.png');
    this.equal = this.gameGroup.create(200, 200, 'numbers', '=.png');
    this.answer = this.gameGroup.create(250, 200, 'numbers', '10.png');
    this.number1.visible = false;
    this.plus.visible = false;
    this.number2.visible = false;
    this.equal.visible = false;
    this.answer.visible = false;
    //this.add.sprite(100, 100, 'apa', 'BeigePlupp.png', this.gameGroup);
    TweenMax.fromTo(cloud1, 380, { x: -cloud1.width }, { x: this.world.width, repeat: -1 });
    TweenMax.fromTo(cloud2, 290, { x: -cloud2.width }, { x: this.world.width, repeat: -1 });
    var home = this.add.sprite(this.pos.home.x, this.pos.home.y, 'shark', 'Shark_angry.png', this.gameGroup);
    home.anchor.set(0.5, 1);
    this.agent.thought.y += 100;
    this.gameGroup.bringToTop(this.agent);
    this.test = true;
    this.speech = util.createAudioSheet('apeSpeech', LANG.SPEECH.sharkgame.markers);

    // Setup bee
    this.ape = new SharkGameApe(this.game, 400, 550);
    this.ape.scale.set(this.pos.ape.homeScale);
    if (this.method === GLOBAL.METHOD.additionSubtraction) {
        this.ape.addThought(170, -75, this.representation[0], true);
        this.ape.thought.toScale = 0.7;
    }
    this.gameGroup.add(this.ape);
    this.correct = true;
    this.aggentTry = false;
    //this.speech = util.createAudioSheet('apetalk', LANG.SPEECH.sharkgame.markers);

    this.add.music('apeMusic', 0.1, true).play();


};

SharkGame.prototype.runNumber = function (number, simulate) {
    //var current = this.currentNumber-1;
    var sum = number + this.addToNumber;
    var result = simulate ? sum - this.currentNumber : this.tryNumber(number, this.addToNumber);

    this.disable(true);

    var t = new TimelineMax();
    if (GLOBAL.debug) { t.skippable(); }

    /* Correct :) */
    if (!result) {
        t.addCallback(function () {
            this.showWinObject();
        }, null, null, this);
        var temp = (10 - number);
        this.number1.frameName = number +'.png';
        this.number2.frameName = temp +'.png';
        this.number1.visible = true;
        this.plus.visible = true;
        this.number2.visible = true;
        this.equal.visible = true;
        this.answer.visible = true;
        this.atValue = 0;
        this.test = true;
        this.setRelativeTrue();
        /* Incorrect :( */
    } else {
        t.addSound(this.speech, this.ape, 'wrong');
        if(this.aggentTry === true){
            this.showNumbers();
        }
        this.test = false;
        this.setRelativeFalse();
        this.nextRound();

    }

    t.addCallback(this.updateRelative, null, null, this);
    return t;
};

SharkGame.prototype.win = function(){
    var t = new TimelineMax();
    this.number1.visible = false;
    this.plus.visible = false;
    this.number2.visible = false;
    this.equal.visible = false;
    this.answer.visible = false;
    t.skippable();
    t.addSound(this.speech, this.ape, 'correct');
    return t;
};

SharkGame.prototype.returnToStart = function (t) {
    this.atValue = 0;
    //alert('returnto  2');
};

SharkGame.prototype.modeIntro = function () {
    var t = new TimelineMax().skippable();
    //t.addSound('apeIntro1', this.ape);
    t.addSound(this.speech, this.ape, 'intro');
    t.addSound(this.speech, this.ape, 'shark');
    t.addSound(this.speech, this.ape, 'intro2');
    t.addSound(this.speech, this.ape, 'intro3');
    //t.add(util.fade(this.buttons, true), 'useButtons');
   // t.addCallback(this.buttons.highlight, 'flashButtons', [1], this.buttons);
    //t.addLabel('gotoStart', '+=0.5');
    //t.add(this.bee.moveTo.start(), 'gotoStart');


    //t.addSound(this.speech, this.bee, 'howToFind', 'gotoStart');
    t.addCallback(this.nextRound, null, null, this);
};

SharkGame.prototype.modePlayerDo = function (intro, tries) {
    if (tries > 0) {
        this.showNumbers();
    } else { // if intro or first try
        var t = new TimelineMax();
        if (intro) {
            t.skippable();

            if (this.instructions) {
                //t.addCallback(this.updateObjects, null, null, this);
                //t.add(this.doInstructions());
            } else {
                //t.add(this.newFlower());
            }
        }
        //t.addLabel('flashButtons', '+=0.5');
        t.addCallback(this.showNumbers, null, null, this);
       // t.addCallback(this.dragObject.highlightObject, 'flashButtons', [1], this.dragObject);
    }
};


SharkGame.prototype.modePlayerShow = function (intro, tries) {
    if (tries > 0) {
        this.showNumbers();
    } else { // if intro or first try
        var t = new TimelineMax();
        if (intro) {
            t.skippable();
            t.add(this.agent.moveTo.start());
            t.addSound(this.speech, this.ape, 'agentIntro');
            t.addSound(this.speech, this.ape, 'watch');
            //t.addSound('agentTry2', this.bee);
            //t.addLabel('agentIntro', '+=0.5');
            //t.add(this.agent.wave(3, 1), 'agentIntro');
            /*t.addSound(this.agent.speech, this.agent, 'beeIntro2', 'agentIntro');
            t.addCallback(this.agent.eyesFollowObject, 'agentIntro', [this.bee], this.agent);
            t.addSound(this.speech, this.bee, 'gettingHelp', '+=0.2');
            t.addSound(this.agent.speech, this.agent, 'beeIntro3', '+=0.2');
            t.addSound(this.speech, this.bee, 'youHelpLater', '+=0.2');*/
        }
        t.addCallback(this.showNumbers, null, null, this);
    }
};

SharkGame.prototype.modeAgentTry = function (intro, tries) {
    var t = new TimelineMax();
    this.agentTry = true;
    if (tries > 0) {
        //t.addSound(this.agent.speech, this.agent, 'tryAgain');
    } else { // if intro or first try
        if (intro) {
            t.skippable();
            t.addSound(this.speech, this.agent,'agentTry');
            t.addSound(this.speech, this.bee,'try');
        }
    }
    //this.dragObject = false;
    t.addCallback(this.showGoalObject, null, null, this);
    //alert('test: '+ this.test);
    if(this.test === true) {
        t.add(this.agentGuess(), '+=0.3');
        t.addCallback(this.showYesnos, null, null, this);
    }
    /*if (intro && this.instructionsAgent) {
        t.add(this.instructionYesNo(), '+=0.5');
    }*/

};
