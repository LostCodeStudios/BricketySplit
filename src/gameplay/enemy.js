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
    var width = game.cache.getImage('enemy').width;
    var height = game.cache.getImage('enemy').height;
    
    var x, y;
    var velX, velY;
    
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
            velX = lerp(enemyMinSpeed, enemyMaxSpeed, difficulty) * -1;
            velY = 0;
            break;
    }
    
    this.sprite = game.add.sprite(x, y, 'enemy');
    this.sprite.smoothed = false;
    
    game.physics.arcade.enable(this.sprite);
    this.sprite.body.velocity.x = velX;
    this.sprite.body.velocity.y = velY;
}