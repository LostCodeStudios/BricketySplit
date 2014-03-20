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
        x = brickWidth() - width;
        y = windowHeight + height;
    }
    
    if (side === 1) {
        x = brickWidth() + wallWidth * brickWidth();
        y = windowHeight + height;
    }
    
    this.sprite = game.add.sprite(x, y, 'enemy');
    game.physics.enable(this.sprite, Phaser.Physics.ARCADE);
    
    this.direction = ENEMY_UP;
    this.side = side;
    
    this.update = function () {
        switch (this.direction) {
        case ENEMY_LEFT:
            this.sprite.body.velocity.x = -speed;
            this.sprite.body.velocity.y = 0;
            this.sprite.body.gravity.x = 0;
            this.sprite.body.gravity.y = 1;
            break;
        case ENEMY_UP:
            this.sprite.body.velocity.x = 0;
            this.sprite.body.velocity.y = -speed;
            this.sprite.body.gravity.x = (this.side === 0 ? -1 : 1);
            this.sprite.body.gravity.y = 0;
            break;
        case ENEMY_RIGHT:
            this.sprite.body.velocity.x = speed;
            this.sprite.body.velocity.y = 0;
            this.sprite.body.gravity.x = 0;
            this.sprite.body.gravity.y = 1;
            break;
        case ENEMY_DOWN:
            this.sprite.body.velocity.x = 0;
            this.sprite.body.velocity.y = speed;
            this.sprite.body.gravity.x = (this.side === 0 ? 1 : -1);
            this.sprite.body.gravity.y = 0;
            break;
        }
        
        console.log('Doing logic!');
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