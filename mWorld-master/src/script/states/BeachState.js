var SuperState = require('./SuperState.js');
//var backend = require('../backend.js');
var GLOBAL = require('../global.js');
var LANG = require('../language.js');
//var EventSystem = require('../pubsub.js');
//var Counter = require('../objects/Counter.js');
var Cover = require('../objects/Cover.js');
var Menu = require('../objects/Menu.js');
var WaterCan = require('../objects/WaterCan.js');

module.exports = BeachState;

BeachState.prototype = Object.create(SuperState.prototype);
BeachState.prototype.constructor = BeachState;


/**
 * The beach of the game.
 * This is where the player uses the water from the sessions.
 */
function BeachState () {}

/* Phaser state function */
BeachState.prototype.preload = function() {
    if (!this.cache._sounds[this.game.player.agent.prototype.id + 'Speech']) {
        this.load.audio(this.game.player.agent.prototype.id + 'Speech', LANG.SPEECH.AGENT.speech);
    }
    if (!this.cache._sounds.gardenMusic) {
        this.load.audio('gardenMusic', ['audio/garden/music.m4a', 'audio/garden/music.ogg', 'audio/garden/music.mp3']);
    }
    if (!this.cache._images.garden) {
        this.load.atlasJSONHash('garden', 'img/garden/atlas.png', 'img/garden/atlas.json');
    }


};

BeachState.prototype.create = function () {
    // Add music
    this.add.music('gardenMusic', 0.2, true).play();

    // Add background
    this.add.sprite(0, 0, 'garden', 'bg');

    // Add sign to go to next scenario
    //var sure = false;
    var sign = this.add.sprite(750, 100, 'garden', 'sign');
    sign.inputEnabled = true;
    sign.events.onInputDown.add(function () {
        // This happens either on local machine or on "trial" version of the game.
        if (typeof Routes === 'undefined' || Routes === null) {
            this.game.state.start(GLOBAL.STATE.scenario, true, false);
            return;
        }


        var t = new TimelineMax();
        t.addCallback(function () {
            disabler.visible = true;
        });
        /*var scen = backend.getScenario();
        if (scen) {
            t.addSound(agent.speech, agent, 'letsGo');
            t.addCallback(function () {
                this.game.state.start(GLOBAL.STATE[scen.subgame], true, false, scen);
            }, null, null, this);
        }*/
        t.addCallback(function () {
            disabler.visible = false;
        });
    }, this);

    var startPos = 200;
    var height = (this.world.height - startPos)/3;
    var agent = this.game.player.createAgent();
    agent.scale.set(0.2);
    agent.x = -100;
    agent.y = startPos + height - agent.height/2;
    this.world.add(agent);
    //var currentMove = null;

    /* Add the water can */
    this.world.add(new WaterCan(this.game));
    //var firstWatering = true;

    /* Add disabler. */
    var disabler = new Cover(this.game, '#ffffff', 0);
    this.world.add(disabler);

    /* Add the menu */
    this.world.add(new Menu(this.game));

    this.startGame = function () {
        var t = new TimelineMax().skippable();
        t.add(agent.move({ x: this.world.centerX }, 3));
        t.addLabel('sign');
        t.add(agent.wave(1, 1));
        t.addCallback(agent.eyesFollowObject, 'sign', [sign], agent);
        t.addSound(agent.speech, agent, 'gardenSign', 'sign');
        t.addCallback(function () {
            agent.eyesStopFollow();
            disabler.visible = false;
        }, null, null, this);
    };
};

