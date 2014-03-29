
function World(skipIntro) {
    
    this.skipIntro = skipIntro;
    
    this.ground = makeGround();
    this.waterLeft = makeWaterLeft();
    this.waterRight = makeWaterRight();

    this.rick = new Rick(this);
    this.bricks = game.add.group();
    this.enemies = game.add.group();
    
    this.brickSprites = new Array();

    this.ufos = new Array();
    this.wavers = new Array();
    this.lasers = game.add.group();
    
    this.markers = game.add.group();

    this.wall = new Wall(wallWidth);
    this.canBrickFall = true;
    this.boundsToPush = 0;
    //this.rowsScrolled = 0;
    
    this.currentPhase = 0;
    
    this.elapsedTime = 0;
    this.difficulty = 0;
    
    this.laserSound = game.add.audio('laser');
    
    this.bottomBrickRow = 0; //for checking and removing

    var scores = JSON.parse(localStorage.getItem('Scores'));
    for (var i = 0; i < scores.length; i++) {
        var score = scores[i];
        var y = windowHeight - brickHeight - score * brickHeight;
        
        this.markers.add(game.add.sprite(0, y, 'scoreline'));
        
        this.markers.add(MakeLabel(0, y - 24, '  ' + score + 'm', smallTextFont, '#000000', false));
    }
    
    this.destroy = function () {
        if (this.ground) {
            this.ground.body = null;
            this.ground.destroy();
        }

        this.waterLeft.destroy();
        this.waterRight.destroy();

        for (var i = 0; i < this.brickSprites.length; i++) {
            this.brickSprites[i].sprite.body = null;
            this.brickSprites[i].sprite.destroy();
        }

        for (var i = 0; i < this.enemies.length; i++) {
            this.enemies.getAt(i).body = null;
            this.enemies.getAt(i).destroy();
        }

        for (var i = 0; i < this.ufos.length; i++) {
            this.ufos[i].sprite.body = null;
            this.ufos[i].sprite.destroy();
        }

        for (var i = 0; i < this.wavers.length; i++) {
            this.wavers[i].sprite.body = null;
            this.wavers[i].sprite.destroy();
        }

        for (var i = 0; i < this.lasers.length; i++) {
            this.lasers.getAt(i).body = null;
            this.lasers.getAt(i).destroy();
        }
        this.markers.destroy();
    };
    
    this.gameOver = function () {
        return this.rick.dead;
    };
    
    this.update = function (delta) {
        this.elapsedTime += delta;
        
        var brickDelay = (tutorial ? tutorialBrickFallDelay : brickFallDelay);
        
        if (this.elapsedTime >= brickDelay) {
            this.difficulty += delta / fullDifficultyTime;
            this.difficulty = Math.min(this.difficulty, 1);     //update difficulty after bricks start falling
        }
        
        if (this.elapsedTime >= brickDelay && this.canBrickFall && !this.rick.dead) {
            var lane = this.wall.nextLane();
            
            var brick = new Brick(lane, this.wall.isOffset(lane), this.wall, this.difficulty);
            this.fallingBrick = brick;

            this.brickSprites[this.brickSprites.length] = brick;
            
            this.wall.addBrick(lane, brick);
            this.canBrickFall = false;
        }
        
        if (this.gameOver()) {
            //Handle game over
            this.endPhase(this.currentPhase);
            this.currentPhase = -1;
        }
        
        if (!this.rick.dead) {
            game.physics.arcade.collide(this.rick.sprite, this.ground);
            game.physics.arcade.collide(this.rick.sprite, this.bricks);
        }
        
        for (var i = 0; i < this.enemies.length && !this.rick.dead; i++) {
            var enemy = this.enemies.getAt(i);
            game.physics.arcade.overlap(this.rick.sprite, enemy, this.enemyRickCollision, null, this);
        }
        
        for (var i = 0; i < this.lasers.length && !this.rick.dead; i++) {
            game.physics.arcade.overlap(this.lasers.getAt(i), this.rick.sprite, this.laserCollision, null, this);
        }
        
        for (var i = 0; !this.rick.dead && i < this.ufos.length; i++) {
            var ufo = this.ufos[i];

            game.physics.arcade.overlap(this.rick.sprite, ufo.sprite, this.enemyRickCollision, null, this);
        }
        
        for (var i = 0; !this.rick.dead && i < this.wavers.length; i++) {
            var waver = this.wavers[i];

            game.physics.arcade.overlap(this.rick.sprite, waver.sprite, this.enemyRickCollision, null, this);
        }
        
        if (!this.rick.dead && this.fallingBrick) { //there is a reason for this
            this.fallingBrick.sprite.body.immovable = true;
            game.physics.arcade.collide(this.rick.sprite, this.fallingBrick.sprite);
            this.fallingBrick.sprite.body.immovable = false;
        }
        for (var i = 0; i < this.bricks.length && this.fallingBrick; i++) { //there is a reason for this
            if (this.bricks.getAt(i).body) {
                game.physics.arcade.collide(this.fallingBrick.sprite, this.bricks.getAt(i), this.brickCollisionCallback, processBrickCollision, this);
            }
        }
        if (this.fallingBrick && this.ground) { //there is a reason for this
            game.physics.arcade.collide(this.fallingBrick.sprite, this.ground, this.brickCollisionCallback, processBrickCollision, this);
        }
        
        //after the first two rows are finished, start pushing the camera up
        if (this.wall.rowCompleted() && this.wall.currentRow > scrollStartRows && !this.rick.dead) {
            this.boundsToPush += brickHeight;
            
            if (this.wall.currentRow > scrollStartRows) {
                //spawn new enemy
                var enemy;
                
                if (this.currentPhase == enemySpawnPhase) {
                    enemy = new Enemy(ENEMY_RIGHT, this.difficulty);
                    
                    this.followingEnemy = enemy;
                    
                    postEnemySpawnPhaseTime = this.elapsedTime;
                    
                    this.endPhase(this.currentPhase);
                    this.currentPhase++;
                    this.startPhase(this.currentPhase);
                } else {
                    enemy = this.spawnEnemy();
                }
                
                if (!enemy.isUFO && !enemy.isWaver) {
                    this.enemies.add(enemy.sprite);
                }
            }
        }
        
        if (this.boundsToPush > 0) {
            var sec = delta / 1000;
            
            pushWorldBoundsUp(sec * cameraSpeed);
            this.boundsToPush -= sec * cameraSpeed;

            //check the bottom row of bricks to see if they need to be removed
            var i = 0;

            var brick = this.wall.bricks[this.bottomBrickRow][i];

            if (this.outOfBounds(brick.sprite)) {
                //remove the whole row
                do {
                    brick.sprite.body = null;
                    brick.sprite.destroy();
                    console.log('REMOVING A BRICK');

                    brick = this.wall.bricks[this.bottomBrickRow][i++]; //take the next brick to the right
                } while (brick);

                this.bottomBrickRow++;
            }
        }
        
        this.rick.update();
        
        if (this.ground) {
            if (this.ground.y >= bottomBounds - 1) {
                this.ground.body = null;
                this.ground.destroy();
                this.ground = null;
            }
        }
        
        for (var i = 0; i < this.ufos.length; i++) {
            this.ufos[i].update(delta);
        }
        
        for (var i = 0; i < this.wavers.length; i++) {
            this.wavers[i].update();
        }
        
        for (var i = this.ufos.length - 1; i >= 0; i--) {
            if (this.outOfBounds(this.ufos[i].sprite)) {
                this.ufos[i].sprite.body = null;
                this.ufos[i].sprite.destroy();
                
                //this.enemies.remove(this.ufos[i].sprite);
                
                this.ufos.splice(i, 1);
                
                console.log('REMOVED A UFO');
            }
        }
        
        for (var i = this.wavers.length - 1; i >= 0; i--) {
            if (this.outOfBounds(this.wavers[i].sprite)) {
                this.wavers[i].sprite.body = null;
                this.wavers[i].sprite.destroy();
                
                //this.enemies.remove(this.wavers[i].sprite);
                
                this.wavers.splice(i, 1);
            
                console.log('REMOVED A WAVER');
            }
        }
        
        for (var i = this.enemies.length - 1; i >= 0; i--) {
            if (this.outOfBounds(this.enemies.getAt(i))) {
                this.enemies.remove(this.enemies.getAt(i));
                console.log('REMOVED A FRIEND');
            }
        }
        
        for (var i = this.lasers.length - 1; i >= 0; i--) {
            if (this.outOfBounds(this.lasers.getAt(i))) {
                this.lasers.remove(this.lasers.getAt(i));
                console.log('REMOVED A LASER');
            }
        }
        
        if (tutorial) {
            this.updateTutorial();
        }
    };
    
    this.outOfBounds = function (sprite) {
        return sprite.x + sprite.width < 0 || sprite.x > windowWidth || sprite.y + sprite.height < topBounds || sprite.y > bottomBounds;
    };
    
    this.spawnEnemy = function () {
        if (this.difficulty < minUFODifficulty) {
            return new Enemy(randEnemySource(), this.difficulty)
        } else {
            if (percent(ufoChance) && !(this.ufos.length >= maxUFOs)) {
                //spawn a UFO sometimes, as long as we don't have too many
                var ufo = new UFO(this, this.difficulty)
                this.ufos[this.ufos.length] = ufo;
                return ufo;
            } else if (percent(waveEnemyChance)) {
                var waveEnemy = new WaveEnemy();
                this.wavers[this.wavers.length] = waveEnemy;
                return waveEnemy;
            }
            else {
                //spawn a "friend" others
                return new Enemy(randEnemySource(), this.difficulty);
            }
        }
    };
    
    this.brickCollisionCallback = function (brick, other) {        
        this.fallingBrick = null;

        brick.body.x -= brickWidthMargin;
        brick.body.width += brickWidthMargin * 2;
        brick.body.immovable = true;
        brick.body.moves = false;
        brick.body.gravity.y = 0;

        brick.x = brick.body.x;
        brick.y = brick.body.y; //the body may be about to be removed, 

        //so set the sprite's position to the body for the last time

        this.canBrickFall = true; //one brick falling at a time
        
        playSound(brick.fallSound);
        
        //throw up some particles
        var leftEmitter = game.add.emitter(brick.x, brick.y + brick.height, 100);
        var rightEmitter = game.add.emitter(brick.x + brick.width, brick.y + brick.height, 100);

        var minSpeedX = 20;
        var maxSpeedX = 150;

        var minSpeedY = 20;
        var maxSpeedY = 100; 

        leftEmitter.minParticleSpeed.x = -maxSpeedX;
        leftEmitter.maxParticleSpeed.x = -minSpeedX;
        leftEmitter.minParticleSpeed.y = -maxSpeedY;
        leftEmitter.maxParticleSpeed.y = -minSpeedY;

        rightEmitter.minParticleSpeed.x = minSpeedX;
        rightEmitter.maxParticleSpeed.x = maxSpeedX;
        rightEmitter.minParticleSpeed.y = -maxSpeedY;
        rightEmitter.maxParticleSpeed.y = -minSpeedY;

        leftEmitter.gravity = gravity / 6;
        rightEmitter.gravity = gravity / 6;

        var particleKey;

        if (other.isGround) {
            //dirt particles
        
            particleKey = 'dirtparticle';
        } else {
            //brick particles

            particleKey = 'brickparticle';
        }

        leftEmitter.makeParticles(particleKey);
        rightEmitter.makeParticles(particleKey);

        //  The first parameter sets the effect to "explode" which means all particles are emitted at once
        //  The second gives each particle a 500ms lifespan
        //  The third is ignored when using burst/explode mode
        //  The final parameter (10) is how many particles will be emitted in this single burst
        leftEmitter.start(true, 500, null, 4);
        rightEmitter.start(true, 500, null, 4);

        //merge bodies with the adjacent brick
        var lane = brick.brick.lane;

        if (lane < wallWidth) {
            if (this.wall.bricks[brick.brick.row - 1][lane + 1]) { //merge with the brick on the right if it exists
                brick.body.width += this.wall.bricks[brick.brick.row - 1][lane + 1].sprite.body.width;
                this.wall.bricks[brick.brick.row - 1][lane + 1].sprite.body = null;

                // console.log('Merged a brick to the right');
            }
        }
        if (lane > 0) {
            if (this.wall.bricks[brick.brick.row - 1][lane - 1]) {  //merge with the bricks on the left if it exists
                var leftBricksWidth;
                var i = 1;
                while (!this.wall.bricks[brick.brick.row - 1][lane - i].sprite.body) {
                    i++;
                }
                leftBricksWidth = this.wall.bricks[brick.brick.row - 1][lane - i].sprite.body.width;

                this.wall.bricks[brick.brick.row - 1][lane - i].sprite.body.width += brick.body.width;
                brick.body = null;

                // console.log('Merged bricks to the left');
            }
        }

        if (brick.body) {
            this.bricks.add(brick);
        }
    };
    
    this.enemyRickCollision = function (rick, enemy) {
        this.rick.die(RICK_DEATH_HIT);
    };
    
    this.laserCollision = function (laser, other) {
        this.rick.die();
    };
    
    this.rickCenterX = function () {
        return this.rick.sprite.body.x + this.rick.sprite.body.width / 2;
    };
    
    this.friendCenterX = function () {
        return this.followingEnemy.sprite.x + this.followingEnemy.sprite.width / 2;
    };
    
    this.updateTutorial = function () {
        
        if (this.skipIntro && this.elapsedTime >= brickFallDelay) {
            this.skipIntro = false;
            
            this.elapsedTime = timeTill(brickFallPhase);    //skip the first few tutorial messages if they saw them already
            this.currentPhase = brickFallPhase;
            
            this.startPhase(this.currentPhase);
        }
        
        if (this.currentPhase == introPhase) {

            this.arrow.x = this.rickCenterX();
            this.arrow.y = this.rick.sprite.y - arrowDownHeight - 5;
            
            if (this.label) this.label.destroy();
            this.label = MakeCenteredLabel(this.rickCenterX(), this.rick.sprite.y - arrowDownHeight - tutorialTextSize, tutorialText[1], tutorialFont, '#000000', false);
        }
        
        if (!this.rick.dead) { //these phases rely on the player being alive...
            if (this.currentPhase == jumpPhase) {
                this.button.x = this.rickCenterX();
                this.button.y = this.rick.sprite.y - this.button.height - 5;

                this.button.visible = this.rick.sprite.body.touching.down;
            }

            if (this.currentPhase == runPhase) {
                //move left/right arrowkey sprites, show pressed/not pressed

                var arrowKeyPadding = 32;

                this.buttonLeft.x = this.rick.sprite.x - this.buttonLeft.width - arrowKeyPadding;
                this.buttonLeft.frame = (this.rick.sprite.body.velocity.x < 0 ? 1 : 0);

                this.buttonRight.x = this.rick.sprite.x + this.rick.sprite.width + arrowKeyPadding;
                this.buttonRight.frame = (this.rick.sprite.body.velocity.x > 0 ? 1 : 0);

                this.buttonLeft.y = this.rick.sprite.y;
                this.buttonRight.y = this.rick.sprite.y;
            }
        }
        
        if (this.currentPhase == enemySpawnPhase + 1) {
            this.arrow.x = this.friendCenterX();
            this.arrow.y = this.followingEnemy.sprite.y - arrowDownHeight;
            
            if (this.warningLabel) this.warningLabel.destroy();
            this.warningLabel = MakeCenteredLabel(this.friendCenterX(), this.followingEnemy.sprite.y - arrowDownHeight - tutorialTextSize, 'Avoid "friends"', tutorialFont, '#000000', false);
        }
        
        if (!this.skipIntro && this.currentPhase != enemySpawnPhase && this.elapsedTime >= timeTill(this.currentPhase + 1)) {
            this.endPhase(this.currentPhase);
            
            this.currentPhase++;
            
            if (this.currentPhase <= lastPhase) {
                this.startPhase(this.currentPhase);
            }
        }
        
    };
    
    this.startPhase = function (phase) {
        if (phase == introPhase) {
            this.arrow = game.add.sprite(this.rickCenterX(), this.rick.sprite.y - arrowDownHeight, 'arrowdown');
            this.arrow.anchor.set(0.5, 0);
        }
        
        if (phase == jumpPhase) {
            this.button = game.add.sprite(-500, windowHeight * 0.5, 'zbutton');
            this.button.anchor.set(0.5, 0);
        }
        
        if (phase == runPhase) {
            this.buttonLeft = game.add.sprite(-500, windowHeight * 0.5, 'leftarrowkey');
            this.buttonRight = game.add.sprite(-500, 0, 'rightarrowkey');
            this.buttonLeft.anchor.set(0, 0.25);
            this.buttonRight.anchor.set(0, 0.25);
        }
        
        if (phase != introPhase) {
            this.label = MakeCenteredLabel(tutorialTextX, tutorialTextY, tutorialText[phase], tutorialFont, '#000000', true);
        }
        
        if (phase == enemySpawnPhase + 1) {
            this.arrow = game.add.sprite(this.friendCenterX(), this.followingEnemy.sprite.y - arrowDownHeight, 'arrowdown');
            this.arrow.anchor.set(0.5, 0);
        }
    };
    
    this.endPhase = function (phase) {
        if (phase == introPhase) {
            this.arrow.destroy();
        }
        
        if (phase == jumpPhase) {
            this.button.destroy();
        }
        
        if (phase == runPhase) {
            this.buttonLeft.destroy();
            this.buttonRight.destroy();
        }
        
        if (this.label) this.label.destroy();
        
        if (phase == enemySpawnPhase + 1) {
            this.followingEnemy = null;
            this.warningLabel.destroy();
            this.arrow.destroy();
        }
        
        if (phase == lastPhase) {
            tutorial = false;
            localStorage.setItem('TutorialComplete', 'You did it');
        }
    };
    
    this.spawnLaser = function(x, y) {
        var laser = game.add.sprite(x, y, 'laser');
        laser.anchor.set(0.5, 0);
        
        game.physics.arcade.enable(laser);
        laser.body.velocity.y = laserSpeed;
        
        playSound(this.laserSound);
        
        this.lasers.add(laser);
    };
    
}

function processBrickCollision() {
    return true;
}

function makeGround() {
    var groundHeight = 32;
    
    var x = wallLeftX;
    var y = windowHeight - groundHeight;
    
    var ground = game.add.sprite(x, y, 'ground');
    game.physics.enable(ground, Phaser.Physics.ARCADE);
    ground.body.moves = false;
    ground.body.immovable = true;
    
    ground.isGround = true;
    return ground;
}

function makeWaterLeft() {
    var waterHeight = 24;

    var x = 0;
    var y = windowHeight - waterHeight;

    var water = game.add.sprite(x, y, 'water');
    water.animations.add('normal', [0, 1], 1.25, true);
    water.animations.play('normal');
    water.fixedToCamera = true;

    return water;
}

function makeWaterRight() {
    var waterHeight = 24;

    var x = wallRightX;
    var y = windowHeight - waterHeight;

    var water = game.add.sprite(x, y, 'water');
    water.animations.add('normal', [1, 0], 1.25, true);
    water.animations.play('normal');
    water.fixedToCamera = true;

    return water;
}