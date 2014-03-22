var ENEMY_LEFT = 0;
var ENEMY_UP = 1;
var ENEMY_RIGHT = 2;
var ENEMY_DOWN = 3;

function Enemy(world) {
    var side = Math.floor(Math.random() * 2); //0: left, 1:right
    
    var width = game.cache.getImage('enemy').width;
    var height = game.cache.getImage('enemy').height;
    
    var speed = 128;
    
    var wallWidth = world.wall.width;
    
    var x, y;
    
    if (side === 0) {
        x = brickWidth - width;
        y = bottomBounds + height;
    }
    
    if (side === 1) {
        x = brickWidth + wallWidth * brickWidth;
        y = bottomBounds + height;
    }
    
    this.sprite = game.add.sprite(x, y, 'enemy');
    game.physics.enable(this.sprite, Phaser.Physics.ARCADE);
    
    this.direction = ENEMY_UP;
    this.side = side;
    
    this.update = function () {
        var grav = 20;
        
        switch (this.direction) {
        case ENEMY_LEFT:
                console.log('Direction left');
            this.sprite.body.velocity.x = -speed;
            this.sprite.body.velocity.y = grav;
            break;
        case ENEMY_UP:
                console.log('Direction up');
            this.sprite.body.velocity.x = (this.side === 0 ? grav : -grav);
            this.sprite.body.velocity.y = -speed;
            break;
        case ENEMY_RIGHT:
                console.log('Direction right');
            this.sprite.body.velocity.x = speed;
            this.sprite.body.velocity.y = grav;
            break;
        case ENEMY_DOWN:
                console.log('Direction down');
            this.sprite.body.velocity.x = (this.side === 0 ? -grav : grav);
            this.sprite.body.velocity.y = speed;
            break;
        }
        if (this.side === 0) {
            //coming from left
            if (this.sprite.body.touching.right) {
                this.direction = ENEMY_UP;
            } else if (this.direction === ENEMY_UP) {
                this.direction = ENEMY_RIGHT;
            }
            
            if (this.sprite.body.touching.down) {
                this.direction = ENEMY_RIGHT;
            } else if (this.direction === ENEMY_RIGHT) {
                ENEMY_DOWN;
            }
        }
        
        if (this.side === 1) {
            //coming from right
            if (this.sprite.body.touching.left) {
                this.direction = ENEMY_UP;
            } else if (this.direction === ENEMY_UP) {
                this.direction = ENEMY_LEFT;
            }
            
            if (this.sprite.body.touching.down) {
                this.direction = ENEMY_LEFT;
            } else if (this.direction === ENEMY_LEFT) {
                ENEMY_DOWN;
            }
        }
    };
}