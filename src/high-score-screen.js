function HighScoreScreen(newRecord) {
    
    this.newRecord = newRecord;
        
    this.scoreText = game.add.group();
    
    this.wallSprites = new Array();
    
    this.show = function (oldState) {
        var text = "Rick's Best Walls";
        if (this.newRecord !== -1) {
            text = 'New record!';
        }
        this.titleText = MakeCenteredLabel(windowWidth / 2, windowHeight * 0.1, text, mediumTextFont, '#FF0000');
        this.brickFallSound = game.add.audio('brickfall');
        
        var scores = JSON.parse(localStorage.getItem('Scores'));
        
        this.scores = scores;
        
        this.helpText = MakeCenteredLabel(windowWidth / 2, windowHeight * 0.2, 'Press SPACE for menu', smallTextFont, '#FF0000');
        
        game.input.keyboard.addKeyCapture(Phaser.Keyboard.SPACEBAR);
        this.playKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        this.playKey.onDown.add(playKeyPressed, this);
        
        game.input.onDown.add(playKeyPressed, this);
        
        //make the physical stuff
        this.ground = makeGround();
        this.waterLeft = makeWaterLeft();
        this.waterRight = makeWaterRight();

        var startX = lerp(wallRightX, wallLeftX, 0.15);
        var endX = windowWidth - startX;
        this.dx = (startX - endX) / 2;
        
        this.x = startX;

        this.nextMiniWall = scores.length - 1;
    };
    
    this.setNewState = function(newState) {
        this.newState = newState;
        this.newState.backdropTween.onComplete.add(this.destroy, this);

    }

    this.hide = function (newState) {
        game.input.onDown.remove(playKeyPressed, this);
        game.input.keyboard.removeKey(Phaser.Keyboard.SPACEBAR);
        game.input.keyboard.removeKeyCapture(Phaser.Keyboard.SPACEBAR);
    };
    
    this.destroy = function() {
        this.scoreText.destroy();
        this.helpText.destroy();
        this.titleText.destroy();

        this.ground.body = null;
        this.ground.destroy();
        this.waterLeft.destroy();
        this.waterRight.destroy();

        for (var i = 0; i < this.wallSprites.length; i++) {
            this.wallSprites[i].body = null;
            this.wallSprites[i].destroy();
        }
    };

    this.fallDist = windowHeight - brickHeight;
    
    this.update = function (delta) {
        for (var i = 0; i < this.wallSprites.length; i++) {
            var sprite = this.wallSprites[i];
            
            if (sprite.body.y > sprite.startY + this.fallDist) {
                sprite.body.y = sprite.startY + this.fallDist;
                sprite.body.gravity.y = 0;
                sprite.body.moves = false;
                
                if (sprite.handleFallEvent) {
                    //play a noise for falling on the ground!
                    //maybe throw up some dust particles!
                    
                    //show height number
                    var heightText = '' + sprite.wallHeight + 'm';
                    
                    this.scoreText.add(MakeLabel(sprite.body.x, bottomBounds - (brickHeight + 1 + sprite.wallHeight * 3) - 24 * 2, heightText, smallTextFont, '#000000', false));
                    
                    this.nextMiniWall = sprite.lane - 1;
                    
                    playSound(this.brickFallSound);
                    sprite.handleFallEvent = false; //don't do this repeatedly, please

                    //throw up some particles
                    var leftEmitter = game.add.emitter(sprite.x, sprite.startY + this.fallDist, 100);
                    var rightEmitter = game.add.emitter(sprite.x + sprite.width, sprite.startY + this.fallDist, 100);

                    var minSpeedX = 20;
                    var maxSpeedX = 150;

                    var minSpeedY = 20;
                    var maxSpeedY = 100;

                    leftEmitter.minParticleSpeed.x = -maxSpeedX;
                    leftEmitter.maxParticleSpeed.x = -minSpeedX;
                    leftEmitter.minParticleSpeed.y = -minSpeedY;
                    leftEmitter.maxParticleSpeed.y = -maxSpeedY;

                    rightEmitter.minParticleSpeed.x = minSpeedX;
                    rightEmitter.maxParticleSpeed.x = maxSpeedX;
                    rightEmitter.minParticleSpeed.y = -minSpeedY;
                    rightEmitter.maxParticleSpeed.y = -maxSpeedY;

                    leftEmitter.gravity = gravity / 6;
                    rightEmitter.gravity = gravity / 6;

                    leftEmitter.makeParticles('dirtparticle');
                    rightEmitter.makeParticles('dirtparticle');

                    //  The first parameter sets the effect to "explode" which means all particles are emitted at once
                    //  The second gives each particle a 500ms lifespan
                    //  The third is ignored when using burst/explode mode
                    //  The final parameter (10) is how many particles will be emitted in this single burst
                    leftEmitter.start(true, 500, null, 4);
                    rightEmitter.start(true, 500, null, 4);
                }
            }
        }
        
        if (this.nextMiniWall !== -1) {
            this.makeMiniWall(this.x, this.nextMiniWall, this.scores[this.nextMiniWall], this.nextMiniWall == this.newRecord);
            this.x -= this.dx;
            
            this.nextMiniWall = -1;
        }
    };
    
    this.render = function () {
    };
    
    this.makeMiniWall = function (x, lane, height, newRecord) {
        x = x - 61 / 2; //place them by center

        console.log('Making x: ' + x);

        var y = topBounds - 1;
        var sprite = game.add.sprite(x, y, 'rowdivider');
        game.physics.arcade.enable(sprite);
        sprite.body.gravity.y = gravity;
        sprite.body.allowCollision = false;
        sprite.startY = sprite.body.y;
        sprite.handleFallEvent = true;
        sprite.wallHeight = height;
        sprite.lane = lane;
        y -= 1;
        this.wallSprites[this.wallSprites.length] = sprite;

        for (var i = 0; i < height; i++) {
            if (i % 2 == 0) {
                sprite = game.add.sprite(x, y, 'normalrow');
                sprite.frame = Math.floor(Math.random() * 5);
            } else {
                sprite = game.add.sprite(x, y, 'offsetrow');
                sprite.frame = Math.floor(Math.random() * 5);
            }
            game.physics.arcade.enable(sprite);
            this.wallSprites[this.wallSprites.length] = sprite;
            sprite.body.gravity.y = gravity;
            sprite.body.allowCollision = false;
            sprite.startY = sprite.body.y;
            y -= 1;

            sprite = game.add.sprite(x, y, 'rowdivider');
            game.physics.arcade.enable(sprite);
            sprite.body.gravity.y = gravity;
            sprite.body.allowCollision = false;
            this.wallSprites[this.wallSprites.length] = sprite;
            sprite.startY = sprite.body.y;
            y -= 2;
        }
        
        if (newRecord) {
            var miniWallWidth = game.cache.getImage('rowdivider').width;
            
            y += 2; //tie up the loop's loose end
            y -= rickHeight;
            x += miniWallWidth / 2;
            x -= rickWidth / 2;
            var rick = game.add.sprite(x, y, 'rick');
            game.physics.arcade.enable(rick);
            rick.frame = 0; //stand left
            rick.startY = rick.body.y;
            rick.body.gravity.y = gravity;
            
            this.wallSprites[this.wallSprites.length] = rick;
        }
    }
    
}

function playKeyPressed() {
    setState(new MainMenu());
}

