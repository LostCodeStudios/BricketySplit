function HighScoreScreen(newRecord) {
    
    this.newRecord = newRecord;
        
    this.scoreText = new Array();
    
    this.wallSprites = new Array();
    
    this.show = function () {
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
        makeGround();
        
        var startX = windowWidth - 61 - windowWidth / 5;
        this.dx = windowWidth / 4;
        
        this.x = startX;
        
        this.nextMiniWall = scores.length - 1;
    };
    
    this.hide = function () {
        game.world.removeAll();
        
        game.input.onDown.remove(playKeyPressed, this);
        game.input.keyboard.removeKey(Phaser.Keyboard.SPACEBAR);
        game.input.keyboard.removeKeyCapture(Phaser.Keyboard.SPACEBAR);
    };
    
    this.fallDist = windowHeight - brickHeight;
    
    this.update = function (delta) {
        for (var i = 0; i < this.wallSprites.length; i++) {
            var sprite = this.wallSprites[i];
            
            if (sprite.body.y > sprite.startY + this.fallDist) {
                sprite.body.y = sprite.startY + this.fallDist;
                sprite.body.gravity.y = 0;
                sprite.body.immovable = true;
                
                if (sprite.handleFallEvent) {
                    //play a noise for falling on the ground!
                    //maybe throw up some dust particles!
                    
                    //show height number
                    var heightText = '' + sprite.wallHeight + 'm';
                    
                    MakeLabel(sprite.body.x, bottomBounds - (brickHeight + 1 + sprite.wallHeight * 3) - 24 * 2, heightText, smallTextFont, '#000000', false);
                    
                    this.nextMiniWall = sprite.lane - 1;
                    
                    playSound(this.brickFallSound);
                    sprite.handleFallEvent = false; //don't do this repeatedly, please
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
            } else {
                sprite = game.add.sprite(x, y, 'offsetrow');
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

