var backgroundColor = '#00FFFF';

var game = new Phaser.Game(windowWidth, windowHeight, Phaser.AUTO, '', { preload: preload, create: create, update: update, render: render });

var currentTime;
var lastTime;

var state;

var mobile = false;

var topBounds = 0;
var bottomBounds = windowHeight;

var resetScores = true; //                              TODO IT WOULD BE WAY BAD TO LEAVE THIS HERE

var tutorial;

function preload() {
    game.load.image('ground', 'assets/ground.png');
    game.load.image('brick', 'assets/brick.png');
    game.load.image('halfbrick', 'assets/halfbrick.png');
    game.load.image('enemy', 'assets/enemy.png');
    game.load.image('scoreline', 'assets/scoreline2.png');
    game.load.image('rowdivider', 'assets/rowdivider2.png');
    game.load.image('normalrow', 'assets/normalrow.png');
    game.load.image('offsetrow', 'assets/offsetrow.png');
    game.load.image('arrowdown', 'assets/arrowdown.png');
    game.load.image('zbutton', 'assets/zbutton.png');
    game.load.image('arrowbuttons', 'assets/arrowbuttons.png');
    game.load.spritesheet('rick', 'assets/rick.png', 16, 24);
    
    game.load.audio('jump', 'assets/Jump56.wav', true);
    game.load.audio('brickfall', 'assets/Hit_Hurt135.wav', true);
    game.load.audio('squish', 'assets/Randomize167.wav', true);
    
    if (!localStorage.getItem('Scores') || resetScores) {
        var scores = [ 100, 50, 4 ]; //100 50 20                                TODO it would be way bad to leave this here
        
        localStorage.setItem('Scores', JSON.stringify(scores));
    }
    
    tutorial = !localStorage.getItem('TutorialComplete');
    
    if (resetScores) tutorial = true;
}

function updateWorldBounds () {
    game.world.setBounds(0, topBounds, windowWidth, windowHeight);
}

function pushWorldBoundsUp (amount) {
    topBounds -= amount;
    bottomBounds -= amount;
    updateWorldBounds();
}

function resetWorldBounds () {
    topBounds = 0;
    bottomBounds = windowHeight;
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
    
    resetWorldBounds();
    state = newState;
    state.show();
}