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

var resetScores = true; //                              TODO IT WOULD BE WAY BAD TO LEAVE THIS HERE

function preload() {
    game.load.image('ground', 'assets/ground.png');
    game.load.image('brick', 'assets/brick.png');
    game.load.image('halfbrick', 'assets/halfbrick.png');
    game.load.image('enemy', 'assets/enemy.png');
    game.load.spritesheet('rick', 'assets/rick.png', 16, 24);
    
    if (!localStorage.getItem('Scores') || resetScores) {
        var scores = [ 25, 20, 15, 10, 5 ];
        
        localStorage.setItem('Scores', JSON.stringify(scores));
    }
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
    game.physics.startSystem(Phaser.Physics.ARCADE);
    
    updateWorldBounds();
    
    setState(new MainMenu());
    
    if (!game.device.desktop) {
        mobile = true;
        
        game.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL;
        game.scale.setShowAll();
        game.scale.pageAlignHorizontally = true;
        game.scale.pageAlignVeritcally = true;
        game.scale.refresh();
        
        window.addEventListener('resize', function(event) {
            resizeGame();
        });
        
        var resizeGame = function () {
            game.scale.setShowAll();
            game.scale.refresh();
        }
        
        game.input.onUp.add(onInputUp, this);
    }
    
    lastTime = 0;
    
}

function onInputUp() {
    game.input.x = -1;
    game.input.y = -1;
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