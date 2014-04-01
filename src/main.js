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
    //load world sprites
    game.load.image('ground', 'assets/sprites/ground.png');
    game.load.spritesheet('water', 'assets/sprites/water.png', 112, 24);

    //load brick sprites
    game.load.image('brick', 'assets/sprites/brick2.png');
    game.load.image('halfbrick', 'assets/sprites/halfbrick3.png');

    //load enemy sprites
    game.load.image('enemy', 'assets/sprites/enemy.png');
    game.load.image('enemyblue', 'assets/sprites/enemyblue.png');
    game.load.image('enemyorange', 'assets/sprites/enemyorange.png');

    game.load.image('ufo', 'assets/sprites/ufo2.png');
    game.load.image('laser', 'assets/sprites/laser.png');

    //load the player sprite
    game.load.spritesheet('rick', 'assets/sprites/rick6.png', rickWidth, rickHeight);

    //load particles
    game.load.image('waterparticle', 'assets/particles/waterparticle.png');
    game.load.image('smallparticle', 'assets/particles/smallparticle2.png');
    game.load.image('bigparticle', 'assets/particles/bigparticle2.png');
    game.load.image('brickparticle', 'assets/particles/brickparticle2.png');
    game.load.image('dirtparticle', 'assets/particles/dirtparticle.png')

    //load high score screen assets
    game.load.image('rowdivider', 'assets/sprites/rowdivider4.png');
    game.load.spritesheet('normalrow', 'assets/sprites/normalrow4.png', 61, 2);
    game.load.spritesheet('offsetrow', 'assets/sprites/offsetrow4.png', 61, 2);

    //load tutorial assets
    game.load.image('arrowdown', 'assets/tutorial/arrowdown2.png');
    game.load.image('zbutton', 'assets/tutorial/zbutton2.png');
    
    var arrowKeyWidth = 48, arrowKeyHeight = 48;
    
    game.load.spritesheet('leftarrowkey', 'assets/tutorial/leftarrow2.png', arrowKeyWidth, arrowKeyHeight);
    game.load.spritesheet('rightarrowkey', 'assets/tutorial/rightarrow2.png', arrowKeyWidth, arrowKeyHeight);

    //load UI elements
    game.load.spritesheet('leftarrow', 'assets/ui/leftarrowbutton.png', buttonWidth, buttonHeight);
    game.load.spritesheet('rightarrow', 'assets/ui/rightarrowbutton.png', buttonWidth, buttonHeight);
    game.load.spritesheet('uparrow', 'assets/ui/uparrowbutton.png', buttonWidth, buttonHeight);
    game.load.image('scoreline', 'assets/ui/scoreline2.png');
    game.load.image('backdrop', 'assets/ui/brickbackdrop.png');
    game.load.image('loadingscreen', 'assets/ui/loadingscreen2.png');

    //load sounds
    game.load.audio('jump', 'assets/sounds/Jump56.wav', true);
    game.load.audio('brickfall', 'assets/sounds/Hit_Hurt135.wav', true);
    game.load.audio('squish', 'assets/sounds/Randomize167.wav', true);
    game.load.audio('laser', 'assets/sounds/Laser_Shoot66.wav', true);
    game.load.audio('death', 'assets/sounds/Explosion22.wav', true);
    game.load.audio('splash', 'assets/sounds/Splash3.wav');

    if (!localStorage.getItem('Scores') || resetScores) {
        var scores = [ 100, 50, 15 ];
        
        localStorage.setItem('Scores', JSON.stringify(scores));
    }
    
    tutorial = !localStorage.getItem('TutorialComplete');
    
    if (resetScores) tutorial = true;
    
    if (skipTutorial) tutorial = false;
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
    loadingScreen = game.add.sprite(0, 0, 'loadingscreen');

    game.time.events.add(Phaser.Timer.SECOND, start, this);
    
}

function onInputUp() {
    game.input.x = -1;
    game.input.y = -1;
}

function start() {
    loadingScreen.destroy();

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

var updateState = true;
function update() {
    
    if (!started) return;
    
    currentTime = game.time.now;
    var delta = currentTime - lastTime;
    
    if (delta <= frameTime && updateState) state.update(delta);
    
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
    var oldState = state;
    if (state) {
        state.hide(newState);
    }
    
    resetWorldBounds();

    newState.show(state);
    state = newState;
}