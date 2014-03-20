var gravity = 600;
var cameraSpeed = 32;


function World() {
    
    var wallWidth = 5;
    
    this.ground = makeGround();
    
    this.rick = new Rick();
    
    this.bricks = game.add.group();
    this.fallingBricks = game.add.group();
    this.specialBricksShifted = false;
    
    this.wall = new Wall(wallWidth);
    
    this.canBrickFall = true;
    
    this.heightText = MakeLabel(0, 0, '', '32px Arial', '#ff0000');
    
    this.boundsToPush = 0;
    
    this.enemies = new Array();
    
    this.destroy = function () {
        this.fallingBrick.destroy();
        this.bricks.destroy();
        this.rick.destroy();
        this.heightText.destroy();
    };
    
    this.gameOver = function () {
        return this.rick.dead && this.wall.rowFinishedCurrent(this.wall.height);
    };
    
    this.update = function (delta) {
        if (!this.bricks) {
            console.log('Bricks group: ' + this.bricks);
        }
        
        this.elapsedTime += delta;
        
        this.heightText.text = 'Height: ' + this.wall.height + 'm';    
        
        if (this.canBrickFall && !this.rick.dead) {
            var lane = this.wall.nextLane();
            
            var brick = new Brick(lane, this.wall.isOffset(lane), this.wall.width, false);
            this.fallingBrick = brick;
            
            this.wall.addBrick(lane);
            this.canBrickFall = false;
        }
        
        if (this.rick.dead && !this.gameOver()) {
            //finish the wall and drop "GAME OVER"
            var height = this.wall.height;
            while (!this.wall.rowFinishedCurrent(height)) {
                var lane = this.wall.nextLane();
                if (this.wall.lanes[lane] == height) continue;
            
                var brick = new Brick(lane, this.wall.isOffset(lane), this.wall.width, true);
                
                brick.sprite.body.y -= brickHeight() * (height - this.wall.lowestLane());
                brick.sprite.body.y += brickHeight() * (height - this.wall.lanes[lane]);
                
                this.fallingBricks.add(brick.sprite);
                this.wall.addBrick(lane);
            }
        }
        
        game.physics.arcade.collide(this.enemies, this.bricks);
        
        game.physics.arcade.collide(this.rick.sprite, this.ground);
        game.physics.arcade.collide(this.rick.sprite, this.bricks);
        
       
        if (this.fallingBrick) { //there is a reason for this
            game.physics.arcade.overlap(this.rick.sprite, this.fallingBrick.sprite, rickCollisionCallback, null, this);
        }
        if (this.fallingBrick) { //there is a reason for this
            game.physics.arcade.collide(this.fallingBrick.sprite, this.bricks, this.brickCollisionCallback, processBrickCollision, this);
        }
        if (this.fallingBrick) { //there is a reason for this
            game.physics.arcade.collide(this.fallingBrick.sprite, this.ground, this.brickCollisionCallback, processBrickCollision, this);
        }
        
        if (!this.specialBricksShifted) {
            for (var i = this.fallingBricks.length - 1; i >= 0; i--) {
                var fallingBrick = this.fallingBricks.getAt(i);
                
                if (!fallingBrick) {
                    console.log('REMOVED AN UNDEFINED BRICK');
                    this.fallingBricks.remove(fallingBrick);
                }
            }
            
            game.physics.arcade.collide(this.fallingBricks, this.bricks, this.brickCollisionCallback, processBrickCollision, this);
            game.physics.arcade.collide(this.fallingBricks, this.ground, this.brickCollisionCallback, processBrickCollision, this);
            
            console.log('THIS NEXT THING HAPPENS');
        } else {
            console.log('THE SPECIAL BRICKS ARE ACTUALLY SHIFTED');
        }
        
        //after the first two rows are finished, start pushing the camera up
        if (this.wall.rowCompleted() && this.wall.currentRow > 2 && !this.rick.dead) {
            this.boundsToPush += brickHeight();
            
            console.log('Making an enemy!');
            this.enemies[this.wall.currentRow - 3] = new Enemy(this);
        }
        
        if (this.boundsToPush > 0) {
            var sec = delta / 1000;
            
            pushWorldBoundsUp(sec * cameraSpeed);
            this.boundsToPush -= sec * cameraSpeed;
        }
        
        for (var i = 0; i < this.enemies.length; i++) {
            this.enemies[i].update();
        }
        
        this.rick.update();
    };
    
    this.brickCollisionCallback = function (brick, other) {        
        this.fallingBrick = null;
        this.bricks.add(brick);

        
        if (!brick.special) {
            brick.body.x -= brickWidthMargin;
            brick.body.width += brickWidthMargin * 2;
        } else {
            console.log('A SPECIAL BRICK');
            if (!this.specialBricksShifted) {
                for (var i = 0; i < this.bricks.length; i++) {
                    var specialBrick = this.bricks.getAt(i);
                    
                    if (!specialBrick.special) {
                        continue;
                    }
                    
                    if (specialBrick) {
                        specialBrick.body.x -= brickWidthMargin;
                        specialBrick.body.width += brickWidthMargin * 2;
                    }
                }
                
//                for (var i = 0; i < this.specialBricks.length; i++) {
//                    var specialBrick = this.specialBricks[i];
//                    if (specialBrick) {
//                       
//                    }
//                }
            
                this.specialBricksShifted = true;
            }
            
            //this.fallingBricks.remove(brick);
        }
        
        brick.body.immovable = true;
        brick.body.gravity.y = 0;
        this.canBrickFall = true; //one brick falling at a time
        
        console.log('THIS HAPPENS');
    };
    
}

function processBrickCollision() {
    return true;
}

function enemyOverlapCallback(enemy, other) {
    
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