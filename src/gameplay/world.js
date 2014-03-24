
function World() {
    
    this.ground = makeGround();
    this.rick = new Rick(this);
    this.bricks = game.add.group();
    this.enemies = game.add.group();
    this.wall = new Wall(wallWidth);
    this.canBrickFall = true;
    this.heightText = MakeLabel(0, 0, '', '32px Arial', '#ff0000');
    this.boundsToPush = 0;
    this.rowsScrolled = 0;
    
    this.currentPhase = 0;
    
    this.elapsedTime = 0;
    this.difficulty = 0;
    
    var scores = JSON.parse(localStorage.getItem('Scores'));
    for (var i = 0; i < scores.length; i++) {
        var score = scores[i];
        var y = windowHeight - brickHeight - score * brickHeight;
        game.add.sprite(0, y, 'scoreline');
        
        MakeLabel(0, y - 24, '  ' + score + 'm', '24px Arial', '#000000', false);
    }
    
    this.destroy = function () {
        game.world.removeAll();
    };
    
    this.gameOver = function () {
        return this.rick.dead;
    };
    
    this.update = function (delta) {
        this.elapsedTime += delta;
        
        this.difficulty += delta / fullDifficultyTime;
        this.difficulty = Math.min(this.difficulty, 1);
        
        var brickDelay = (tutorial ? tutorialBrickFallDelay : brickFallDelay);
        
        if (this.elapsedTime >= brickDelay && this.canBrickFall && !this.rick.dead) {
            var lane = this.wall.nextLane();
            
            var brick = new Brick(lane, this.wall.isOffset(lane), this.wall);
            this.fallingBrick = brick;
            
            this.wall.addBrick(lane);
            this.canBrickFall = false;
        }
        
        if (this.gameOver()) {
            //Handle game over
            this.endPhase(this.currentPhase);
            this.currentPhase = -1;
        }
        
        game.physics.arcade.collide(this.rick.sprite, this.ground);
        game.physics.arcade.collide(this.rick.sprite, this.bricks);
        
        if (!this.rick.dead) {
            game.physics.arcade.overlap(this.rick.sprite, this.enemies, this.enemyRickCollision, null, this);
        }
       
        if (this.fallingBrick) { //there is a reason for this
            game.physics.arcade.overlap(this.rick.sprite, this.fallingBrick.sprite, rickCollisionCallback, null, this);
        }
        if (this.fallingBrick) { //there is a reason for this
            game.physics.arcade.collide(this.fallingBrick.sprite, this.bricks, this.brickCollisionCallback, processBrickCollision, this);
        }
        if (this.fallingBrick) { //there is a reason for this
            game.physics.arcade.collide(this.fallingBrick.sprite, this.ground, this.brickCollisionCallback, processBrickCollision, this);
        }
        
        //after the first two rows are finished, start pushing the camera up
        if (this.wall.rowCompleted() && this.wall.currentRow > scrollStartRows && !this.rick.dead) {
            this.boundsToPush += brickHeight;
            this.rowsScrolled++;
            if (this.rowsScrolled > 1) {
                this.wall.bottomShowingRow++;
            }
            
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
                    enemy = new Enemy(randEnemySource(), this.difficulty);
                }
                
                this.enemies.add(enemy.sprite);
            }
        }
        
        if (this.boundsToPush > 0) {
            var sec = delta / 1000;
            
            pushWorldBoundsUp(sec * cameraSpeed);
            this.boundsToPush -= sec * cameraSpeed;
        }
        
        this.rick.update();
        
        if (tutorial) {
            this.updateTutorial();
        }
    };
    
    this.brickCollisionCallback = function (brick, other) {        
        this.fallingBrick = null;
        this.bricks.add(brick);

        brick.body.x -= brickWidthMargin;
        brick.body.width += brickWidthMargin * 2;
        brick.body.immovable = true;
        brick.body.gravity.y = 0;
        this.canBrickFall = true; //one brick falling at a time
        
        brick.fallSound.play();
        
    };
    
    this.enemyRickCollision = function (rick, enemy) {
        this.rick.die();
    };
    
    this.rickCenterX = function () {
        return this.rick.sprite.x + this.rick.sprite.width / 2;
    };
    
    this.friendCenterX = function () {
        return this.followingEnemy.sprite.x + this.followingEnemy.sprite.width / 2;
    };
    
    this.updateTutorial = function () {
        
        if (this.currentPhase == 1) {
            this.arrow.x = this.rickCenterX();
            this.arrow.y = this.rick.sprite.y - arrowDownHeight;
            
            if (this.label) this.label.destroy();
            this.label = MakeCenteredLabel(this.rickCenterX(), this.rick.sprite.y - arrowDownHeight - tutorialTextSize, tutorialText[1], tutorialFont, '#000000', false);
        }
        
        if (this.currentPhase == enemySpawnPhase + 1) {
            this.arrow.x = this.friendCenterX();
            this.arrow.y = this.followingEnemy.sprite.y - arrowDownHeight;
            
            if (this.warningLabel) this.warningLabel.destroy();
            this.warningLabel = MakeCenteredLabel(this.friendCenterX(), this.followingEnemy.sprite.y - arrowDownHeight - tutorialTextSize, 'Avoid "friends"', tutorialFont, '#000000', false);
        }
        
        if (this.currentPhase != enemySpawnPhase && this.elapsedTime >= timeTill(this.currentPhase + 1)) {
            this.endPhase(this.currentPhase);
            
            this.currentPhase++;
            
            this.startPhase(this.currentPhase);
        }
        
    };
    
    this.startPhase = function (phase) {
        if (phase == 1) {
            this.arrow = game.add.sprite(this.rickCenterX(), this.rick.sprite.y - arrowDownHeight, 'arrowdown');
            this.arrow.anchor.set(0.5, 0);
        }
        
        if (phase == 2) {
            this.label = MakeCenteredLabel(windowWidth * 0.45, windowHeight * 0.5, tutorialText[2], tutorialFont, '#000000', true);
            this.button = game.add.sprite(windowWidth * 0.6, windowHeight * 0.5, 'zbutton');
        }
        
        if (phase == 3) {
            this.label = MakeCenteredLabel(windowWidth * 0.45, windowHeight * 0.5, tutorialText[3], tutorialFont, '#000000', true);
            this.button = game.add.sprite(windowWidth * 0.6, windowHeight * 0.5, 'arrowbuttons');
        }
        
        if (phase >= 4) {
            this.label = MakeCenteredLabel(windowWidth * 0.5, windowHeight * 0.5, tutorialText[phase], tutorialFont, '#000000', true);
        }
        
        if (phase == enemySpawnPhase + 1) {
            this.arrow = game.add.sprite(this.friendCenterX(), this.followingEnemy.sprite.y - arrowDownHeight, 'arrowdown');
            this.arrow.anchor.set(0.5, 0);
        }
    };
    
    this.endPhase = function (phase) {
        if (phase == 1) {
            this.label.destroy();
            this.arrow.destroy();
        }
        
        if (phase == 2) {
            this.label.destroy();
            this.button.destroy();
        }
        
        if (phase == 3) {
            this.label.destroy();
            this.button.destroy();
        }
        
        if (phase >= 4) {
            this.label.destroy();
        }
        
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
    
}

function processBrickCollision() {
    return true;
}

function rickCollisionCallback(rick, other) {
    
    if (other === this.fallingBrick.sprite) {
        //check if Rick was crushed
        var rickCenterX = rick.body.x + rick.body.width / 2
        
        var forgivingness = 10;
        
        if (other.body.y < rick.body.y + forgivingness) {
            if (rick.body.touching.down) {
                this.rick.die();
            } else {
                rick.body.velocity.x = 0;
                rick.body.velocity.y = other.body.velocity.y;
            }
        }
    }
}

function makeGround() {
    var groundWidth = 640;
    var groundHeight = 32;
    
    var x = 0;
    var y = windowHeight - groundHeight;
    
    var ground = game.add.sprite(x, y, 'ground');
    game.physics.enable(ground, Phaser.Physics.ARCADE);
    ground.body.immovable = true;
    
    return ground;
}