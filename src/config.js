//debug flags

    var resetScores = false; //                              TODO IT WOULD BE WAY BAD TO LEAVE THIS ENABLED
    var alwaysMobile = false;   //                      TODO do not leave this enabled
    var debugPhysics = false;
    var resetSound = false;
    var debugState = false;
    var debugTime = false;

//end debug flags

var backgroundColor = '#000000';

var titleColor = '#FFFFFF';

var menuEasing = Phaser.Easing.Linear.None;

var skyTextColor = '#480000';

//fonts

    var titleFont = '72px Bangers';
    var smallTextFont = '24px Bangers';
    var mediumTextFont = '36px Bangers';

//end fonts

//enemy spawn pattern

    var minWaveEnemyDifficulty = 0.25;               //TODO raise this
    var waveEnemyChance = 0.1;                     //TODO tweak this

    var maxUFOs = 5;

    var minUFODifficulty = 0.1; //0.1                     //TODO make this higher

    var ufoChance = 0.2;                        //TODO tweak this

//end enemy spawn pattern

var fps = 10;
var deltaCap = 1 / 20; //sec?
var frameTime = deltaCap * 1000;

var windowWidth = 800;
var windowHeight = 480;

var brickHeight = 32;
var brickWidth = 96;

var brickSprites = 3;
var halfBrickSprites = 3;

var wallWidth = 6;
var wallLeftX = (windowWidth - brickWidth * wallWidth) / 2;
var wallRightX = windowWidth - wallLeftX;

var gravity = 1600;

var minBrickGravity = 750;
var maxBrickGravity = 1500;

var cameraSpeed = 32;
var fullDifficultyTime = 10 * 60 * 1000;
                      // ^Time it takes for the game to reach full difficulty, in minutes
var scrollStartRows = 3;

var rickWidth = 19;
var rickHeight = 24;

var enemyMinSpeed = 64;
var enemyMaxSpeed = 256;

var groundHeight = 32;

var brickFallDelay = 2500; //2.5 seconds till bricks start falling

var arrowDownHeight = 48;

var laserSpeed = 800;

var buttonWidth = 104;
var buttonHeight = 96;

var touchButtonY = windowHeight - buttonHeight - 4;

var moveLeftButtonX = 24;
var moveRightButtonX = 24 + buttonWidth + 4;
var jumpButtonX = windowWidth - 24 - buttonWidth;

var jumpKeys = [ Phaser.Keyboard.Z, Phaser.Keyboard.X, Phaser.Keyboard.SPACEBAR, Phaser.Keyboard.UP, Phaser.Keyboard.CONTROL ];