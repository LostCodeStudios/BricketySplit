var windowWidth = 640;
var windowHeight = 480;

var backgroundColor = '#00FFFF';

var game = new Phaser.Game(windowWidth, windowHeight, Phaser.AUTO, '', { preload: preload, create: create, update: update, render: render });

var currentTime;
var lastTime;

var state;

var mobile = false;

var topBounds = 0;
var bottomBounds = windowHeight;

function preload() {
    game.load.image('ground', 'assets/ground.png');
    game.load.image('brick', 'assets/brick.png');
    game.load.image('halfbrick', 'assets/halfbrick.png');
    game.load.spritesheet('rick', 'assets/rick.png', 16, 24);
}

function updateWorldBounds () {
    game.world.setBounds(0, topBounds, windowWidth, windowHeight);
}

function pushWorldBoundsUp (amount) {
    topBounds -= amount;
    bottomBounds -= amount;
    updateWorldBounds();
}

function create() {
    
    game.stage.backgroundColor = backgroundColor;
    
    updateWorldBounds();
    
    setState(new MainMenu());
    
    if (!game.device.desktop) {
        mobile = true;
        
        game.stage.fullScreenScaleMode = Phaser.StageScaleMode.SHOW_ALL;
        game.stage.scale.setShowAll();
        game.stage.scale.pageAlignHorizontally = true;
        game.stage.scale.pageAlignVeritcally = true;
        game.stage.scale.refresh();
        
        window.addEventListener('resize', function(event) {
            resizeGame();
        });
        
        var resizeGame = function () {
            game.stage.scale.setShowAll();
            game.stage.scale.refresh();
        }
    }
    
    lastTime = 0;
    
}

function enterIncorrectOrientation() {
}

function leaveIncorrectOrientation() {
}

function update() {
    
    currentTime = game.time.now;
    var delta = currentTime - lastTime;
    
    state.update(delta);
    
    lastTime = currentTime;
    
}

function render() {
    
    state.render();
    
}

function setState(newState) {
    if (state) {
        state.hide(newState);
    }
    
    state = newState;
    state.show();
}