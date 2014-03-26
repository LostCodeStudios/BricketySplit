var windowWidth = 800;
var windowHeight = 480;

var wallWidth = 6;

var gravity = 1600;
var brickGravity = 1000;
var cameraSpeed = 32;
var fullDifficultyTime = 5 * 60 * 1000;
                      // ^Time it takes for the game to reach full difficulty, in minutes
var scrollStartRows = 3;

var brickHeight = 32;
var brickWidth = 96;

var rickWidth = 16;
var rickHeight = 24;

var ENEMY_LEFT = 0;
var ENEMY_RIGHT = 1;
var ENEMY_BOTTOM = 2;

var enemyMinSpeed = 64;
var enemyMaxSpeed = 256;

var groundHeight = 32;

var brickFallDelay = 2500; //2.5 seconds till bricks start falling

var arrowDownHeight = 48;

var laserSpeed = 800;

var buttonWidth = 52;
var buttonHeight = 48;

var touchButtonY = windowHeight - buttonHeight - 4;

var moveLeftButtonX = 24;
var moveRightButtonX = 24 + buttonWidth + 4;
var jumpButtonX = windowWidth - 24 - buttonWidth;