var ENEMY_LEFT = 0;
var ENEMY_UP = 1;
var ENEMY_RIGHT = 2;

function nextEnemyLane(wall) {
    var min, max;
    min = 1;
    
    max = wall.isOffset(wall.bottomShowingRow) ? wall.width :  wall.width - 1;
    
    return min + Math.floor(Math.random() * (max + 1));
}

function Enemy(wall, lane) {
    var width = game.cache.getImage('enemy').width;
    var height = game.cache.getImage('enemy').height;
    
    var speed = 128;
    
    var lane = 1 + Math.floor(Math.random() * (wall.width - 1));
    
    this.wall = wall;
    this.lane = lane;
    
    var x = brickWidth() + brickWidth() * lane;
    if (wall.isOffset(lane)) {
        x -= brickWidth() / 2;
        this.offset = true;
    } else {
        this.offset = false;
    }
    
    this.wallWidth = wall.width;
    
    x -= width / 2; //center it
    var y = bottomBounds + height;
    
    this.sprite = game.add.sprite(x, y, 'enemy');
    game.physics.enable(this.sprite, Phaser.Physics.ARCADE);
    
    this.destroy = function () {
        this.sprite.destroy();
    };
    
    this.direction = ENEMY_UP;
    
    this.update = function () {
        //console.log('Starting logic');
        switch (this.direction) {
            case ENEMY_LEFT:
                if (this.sprite.body.x <= this.dest.x) {
                    //made it
                    this.sprite.body.x = this.dest.x;
                    
                    //console.log('Moving up a row');
                    this.dest.y -= brickHeight();
                    break;
                } else {
                    this.sprite.body.velocity.x = -speed;
                    this.sprite.body.velocity.y = 0;
                }
                break;
            case ENEMY_UP:
                if (this.sprite.body.y <= this.dest.y) {
                    //made it
                    
                    var laneAbove = this.offset ? this.lane - 1 : this.lane;
                    if (bottomBounds - this.sprite.body.y >= brickHeight() + this.wall.lanes[laneAbove] * brickHeight()) {
                        this.direction = ENEMY_UP;
                        this.dest.y = topBounds - height * 20; //go far up in case the camera catches it
                        //console.log('GIVING UP');
                    } else {
                        this.sprite.body.y = this.dest.y;

                        this.dest.x = this.pickXDest();
                    }
                    break;
                } else {
                    this.sprite.body.velocity.x = 0;
                    this.sprite.body.velocity.y = -speed;
                }
                break;
            case ENEMY_RIGHT:
                if (this.sprite.body.x > this.dest.x) {
                    //made it
                    this.sprite.body.x = this.dest.x;
                    
                    //console.log('Moving up a row');
                    this.dest.y -= brickHeight();
                    break;
                } else {
                    this.sprite.body.velocity.x = speed;
                    this.sprite.body.velocity.y = 0;
                }
                break;
        }
        
        if (this.sprite.body.x < this.dest.x) { //right
            this.direction = ENEMY_RIGHT;
        }
        if (this.sprite.body.y > this.dest.y) { //up
            this.direction = ENEMY_UP;
            this.offset = !this.offset;
        }
        if (this.sprite.body.x > this.dest.x) { //left
            this.direction = ENEMY_LEFT;
        }
    };
    
    this.pickXDest = function () {
        var min = 0;
        var max = this.wallWidth;
        
        if (this.offset) {
            min++;
            max++;
        }
        
        if (this.lane > min && this.lane < max) {
            //could go either way
            var dir = Math.floor(Math.random() * 2);
            if (dir == 0) {
                if (this.offset) {
                    this.lane--;
                }
                return this.sprite.body.x - brickWidth() / 2;
            } else {
                if (!this.offset) {
                    this.lane++;
                }
                return this.sprite.body.x + brickWidth() / 2;
            }
        } else if (this.lane == min) {
            if (!this.offset) {
                this.lane++;
            }
            return this.sprite.body.x + brickWidth() / 2;
        } else if (this.lane == max) {
            if (this.offset) {
                this.lane--;
            }
            return this.sprite.body.x - brickWidth() / 2;
        }
    };
    
    this.dest = { x: x, y: y - height / 2 };
    this.sprite.enemy = this;
    
}