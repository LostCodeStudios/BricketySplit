var ENEMY_TOTAL_SOURCES = 2; //for randomization
var ENEMY_LEFT = 0;
var ENEMY_RIGHT = 1;

//spawning bounds in terms of world bounds

var enemySideMinY = windowHeight * 0.5;
var enemySideMaxY = windowHeight * 0.6 - brickHeight;

function randEnemySource() {
    return Math.floor(Math.random() * ENEMY_TOTAL_SOURCES);
}

//difficulty from 0 to 1, ramps up enemy speed
function Enemy(source, difficulty) {
    var width = game.cache.getImage('enemy').width / 2;
    var height = game.cache.getImage('enemy').height;
    
    var x, y;
    var velX, velY;
    
    //console.log('Making enemy with source: ' + (source === ENEMY_LEFT ? 'left' : 'right'));

    switch (source) {
        case ENEMY_LEFT:
            x = -width;
            y = topBounds + randPos(enemySideMinY, enemySideMaxY);
            velX = lerp(enemyMinSpeed, enemyMaxSpeed, difficulty);
            velY = 0;
            break;
        case ENEMY_RIGHT:
            x = windowWidth;
            y = topBounds + randPos(enemySideMinY, enemySideMaxY);
            velX = -lerp(enemyMinSpeed, enemyMaxSpeed, difficulty);
            velY = 0;
            break;
    }
    
    // console.log('enemy x: ' + x);
    // console.log('enemy y: ' + y);
    // console.log('enemy velX: ' + velX);
    // console.log('enemy velY: ' + velY);

    this.sprite = game.add.sprite(x, y, 'enemy');
    this.sprite.animations.add('normal', [0, 1], 2, true);
    this.sprite.animations.play('normal');

    this.sprite.smoothed = false;
    
    game.physics.arcade.enable(this.sprite);
    this.sprite.body.velocity.x = velX;
    this.sprite.body.velocity.y = velY;
    this.sprite.enemy = this;
}