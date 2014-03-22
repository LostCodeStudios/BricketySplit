
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
        
        if (this.canBrickFall && !this.rick.dead) {
            var lane = this.wall.nextLane();
            
            var brick = new Brick(lane, this.wall.isOffset(lane), this.wall);
            this.fallingBrick = brick;
            
            this.wall.addBrick(lane);
            this.canBrickFall = false;
        }
        
        if (this.gameOver()) {
            //Handle game over
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
                var enemy = new Enemy(randEnemySource(), this.difficulty);
                
                this.enemies.add(enemy.sprite);
            }
        }
        
        if (this.boundsToPush > 0) {
            var sec = delta / 1000;
            
            pushWorldBoundsUp(sec * cameraSpeed);
            this.boundsToPush -= sec * cameraSpeed;
        }
        
        this.rick.update();
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