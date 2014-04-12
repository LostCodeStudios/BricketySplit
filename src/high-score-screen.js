var scoreTitleTextY = windowHeight * 0.1

function HighScoreScreen(newRecord) {
    
    this.newRecord = newRecord;
        
    
    this.wallSprites = new Array();
    
    var menuButtonX = 600;
    var menuButtonY = 40;

    topOfScreenWallHeight = (windowHeight - groundHeight - 150) / 4;

    this.show = function (oldState) {
        var text = "Rick's Best Walls";
        if (this.newRecord !== -1) {
            text = 'New record!';
        }
        this.clouds = makeClouds();
        this.scoreText = game.add.group();
        this.titleText = MakeCenteredLabel(windowWidth / 2, scoreTitleTextY, text, '48px Bangers', skyTextColor);
        this.titleText.fixedToCamera = true;
        this.brickFallSound = game.add.audio('brickfall');
        
        var scores = JSON.parse(localStorage.getItem('Scores'));
        
        this.scores = scores;

        this.menuButton = game.add.button(menuButtonX, menuButtonY, 'menubutton', playKeyPressed, this, 1, 0, 2);
        this.menuButton.fixedToCamera = true;
        
        //make the physical stuff
        this.ground = makeGround();
        this.waterLeft = makeWaterLeft();
        this.waterRight = makeWaterRight();

        this.waterLeft.fixedToCamera = false;
        this.waterRight.fixedToCamera = false;

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
        this.menuButton.inputEnabled = false;
    };
    
    this.destroy = function() {
        this.scoreText.destroy();
        this.titleText.destroy();

        this.ground.body = null;
        this.ground.destroy();
        this.waterLeft.destroy();
        this.waterRight.destroy();
        this.clouds.destroy();

        this.menuButton.destroy();

        for (var i = 0; i < this.wallSprites.length; i++) {
            this.wallSprites[i].body = null;
            this.wallSprites[i].destroy();
        }
    };

    this.fallDist = windowHeight - brickHeight;
    this.boundsToPush = 0;

    this.update = function (delta) {
        var sec = delta / 1000;
        if (this.boundsToPush > 0) {
            var camSpeed = this.boundsToPush;

            pushWorldBoundsUp(camSpeed * sec);
            this.boundsToPush -= (camSpeed * sec);
        }

        for (var i = 0; i < this.wallSprites.length; i++) {
            var sprite = this.wallSprites[i];
            
            if (sprite.body.y > sprite.startY + this.fallDist) {
                sprite.body.y = sprite.startY + this.fallDist;
                sprite.body.gravity.y = 0;
                sprite.body.moves = false;
                
                if (sprite.handleFallEvent) {
                    
                    //show height number
                    var heightText = '' + sprite.wallHeight + 'm';
                    
                    if (sprite.wallHeight > topOfScreenWallHeight) {
                        var byHowMuch = sprite.wallHeight - topOfScreenWallHeight;

                        topOfScreenWallHeight += byHowMuch;

                        this.boundsToPush += 1 + byHowMuch * 3;
                    }


                    var scoreTextX = sprite.body.x;
                    var scoreTextY = windowHeight - (brickHeight + 1 + sprite.wallHeight * 3) - 24 * 2;
                    // console.log('score text x: ' + scoreTextX);
                    // console.log('Score text y: ' + scoreTextY);

                    var scoreText = game.add.text(scoreTextX, scoreTextY, heightText, {font: smallTextFont, fill:'#000000'});
                    //MakeLabel(scoreTextX, scoreTextY, heightText, smallTextFont, '#000000', false);
                    this.scoreText.add(scoreText);
                    
                    this.nextMiniWall = sprite.lane - 1;
                    
                    playSound(this.brickFallSound);
                    sprite.handleFallEvent = false; //don't do this repeatedly, please

                    //throw up some particles

                    if (particles) {
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

        //console.log('Making x: ' + x);

        var y = 0 - 1;
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
            sprite = game.add.sprite(x, y, 'smallrows');
            if (i % 2 == 0) {
                sprite.frame = 0;
            } else {
                sprite.frame = 1;
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
    
    function playKeyPressed() {
        setState(new MainMenu());
    };
}



