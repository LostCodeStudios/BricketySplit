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
    
    var centerX, centerY;
    
    if (side === 0) {
        centerX = brickWidth();
        centerY = windowHeight + 3 * height / 2;
    }
    
    if (side === 1) {
        centerX = brickWidth() + wallWidth * brickWidth();
        centerY = windowHeight + 3 * height / 2;
    }
    
    this.sprite = game.add.sprite(centerX - width / 2, centerY - height / 2, 'enemy');
    game.physics.enable(this.sprite, Phaser.Physics.ARCADE);
    
    this.direction = ENEMY_UP;
    this.side = side;
    
    this.update = function () {
        switch (this.direction) {
        case ENEMY_LEFT:
            this.sprite.body.velocity.x = -speed;
            this.sprite.body.velocity.y = 0;
            break;
        case ENEMY_UP:
            this.sprite.body.velocity.x = 0;
            this.sprite.body.velocity.y = -speed;
            break;
        case ENEMY_RIGHT:
            this.sprite.body.velocity.x = speed;
            this.sprite.body.velocity.y = 0;
            break;
        case ENEMY_DOWN:
            this.sprite.body.velocity.x = 0;
            this.sprite.body.velocity.y = speed;
            break;
        }
    };
}