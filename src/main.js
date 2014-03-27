var backgroundColor = '#00FFFF';

var game = new Phaser.Game(windowWidth, windowHeight, Phaser.AUTO, '', { preload: preload, create: create, update: update, render: render });

var currentTime;
var lastTime;

var state;

var mobile = false;

var topBounds = 0;
var bottomBounds = windowHeight;

var tutorial;

var started = false;

function preload() {
    //load sprites
    game.load.image('ground', 'assets/sprites/ground.png');
    game.load.image('brick', 'assets/sprites/brick.png');
    game.load.image('halfbrick', 'assets/sprites/halfbrick.png');
    game.load.image('enemy', 'assets/sprites/enemy.png');
    game.load.image('scoreline', 'assets/sprites/scoreline2.png');
    game.load.image('rowdivider', 'assets/sprites/rowdivider2.png');
    game.load.image('normalrow', 'assets/sprites/normalrow.png');
    game.load.image('offsetrow', 'assets/sprites/offsetrow.png');
    game.load.image('ufo', 'assets/sprites/ufo.png');
    game.load.image('laser', 'assets/sprites/laser.png');
    game.load.image('enemyblue', 'assets/sprites/enemyblue.png');
    game.load.image('enemyorange', 'assets/sprites/enemyorange.png');
    game.load.image('smallparticle', 'assets/sprites/smallparticle.png');
    game.load.image('bigparticle', 'assets/sprites/bigparticle.png');
    game.load.spritesheet('rick', 'assets/sprites/rick.png', 16, 24);
    
    //load tutorial assets
    game.load.image('arrowdown', 'assets/tutorial/arrowdown.png');
    game.load.image('zbutton', 'assets/tutorial/zbutton.png');
    
    var arrowKeyWidth = 48, arrowKeyHeight = 48;
    
    game.load.spritesheet('leftarrowkey', 'assets/tutorial/leftarrow.png', arrowKeyWidth, arrowKeyHeight);
    game.load.spritesheet('rightarrowkey', 'assets/tutorial/rightarrow.png', arrowKeyWidth, arrowKeyHeight);

    //load UI elements
    game.load.spritesheet('leftarrow', 'assets/ui/leftarrowbutton.png', buttonWidth, buttonHeight);
    game.load.spritesheet('rightarrow', 'assets/ui/rightarrowbutton.png', buttonWidth, buttonHeight);
    game.load.spritesheet('uparrow', 'assets/ui/uparrowbutton.png', buttonWidth, buttonHeight);
    
    //load sounds
    game.load.audio('jump', 'assets/sounds/Jump56.wav', true);
    game.load.audio('brickfall', 'assets/sounds/Hit_Hurt135.wav', true);
    game.load.audio('squish', 'assets/sounds/Randomize167.wav', true);
    game.load.audio('laser', 'assets/sounds/Laser_Shoot66.wav', true);
    
    if (!localStorage.getItem('Scores') || resetScores) {
        var scores = [ 100, 50, 15 ]; //100 50 20                                TODO finalize these & disable resetScores
        
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
    game.time.events.add(Phaser.Timer.SECOND, start, this);
    
}

function onInputUp() {
    game.input.x = -1;
    game.input.y = -1;
}

function start() {
    console.log('Starting');
    started = true;
    
    game.stage.backgroundColor = backgroundColor;
    game.physics.startSystem(Phaser.Physics.ARCADE);
    
    updateWorldBounds();
    
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
    
    if (alwaysMobile) {
        mobile = true;
    }
    
    lastTime = 0;
    
    console.log('Wall x: ' + wallLeftX);
    setState(new MainMenu());
}

function update() {
    
    if (!started) return;
    
    currentTime = game.time.now;
    var delta = currentTime - lastTime;
    
    if (delta <= frameTime) state.update(delta);
    
    lastTime = currentTime;
    
}

function render() {
    
    if (!started) return;
    state.render();
    
    if (debugPhysics) game.world.forEach(physicsDebugCallback, null, true);
    
}

function physicsDebugCallback (sprite) {
    if (sprite.body) game.debug.body(sprite);
}

function setState(newState) {
    if (state) {
        state.hide(newState);
    }
    
    resetWorldBounds();
    state = newState;
    state.show();
}