var gravity = 400;

function World() {
    
    var wallWidth = 8;
    
    this.ground = makeGround();
    this.bricks = game.add.group();
    
    this.wall = new Wall(wallWidth);
    
    this.canBrickFall = true;
    
    this.destroy = function () {
        this.fallingBrick.destroy();
        this.bricks.destroy();
    };
    
    this.update = function (delta) {
        this.elapsedTime += delta;
        
        if (this.canBrickFall) {
            var lane = this.wall.nextLane();
            this.wall.addBrick(lane);
            
            var brick = new Brick(lane, this.wall.isOffset(lane));
            this.fallingBrick = brick;
            
            this.canBrickFall = false;
        }
        
        if (this.fallingBrick) {
            game.physics.collide(this.fallingBrick.sprite, this.bricks, brickCollisionCallback, processBrickCollision, this);
        }
        if (this.fallingBrick) {
            game.physics.collide(this.fallingBrick.sprite, this.ground, brickCollisionCallback, processBrickCollision, this);
        }
    };
    
}

function processBrickCollision() {
    return true;
}

function brickCollisionCallback(brick, other) {
    this.fallingBrick = null;
    this.bricks.add(brick);
    
    brick.body.immovable = true;
    brick.body.gravity.y = 0;
    this.canBrickFall = true; //one brick falling at a time
}

function makeGround() {
    var groundWidth = 640;
    var groundHeight = 32;
    
    var x = 0;
    var y = windowHeight - groundHeight;
    
    var ground = game.add.sprite(x, y, 'ground');
    ground.body.immovable = true;
    
    return ground;
}