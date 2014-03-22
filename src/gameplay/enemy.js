var ENEMY_TOTAL_SOURCES = 4; //for randomization

//spawning bounds in terms of world bounds

var enemySideMinY = windowHeight * 0.5;
var enemySideMaxY = windowHeight * 0.6 - brickHeight;

var enemyBottomMinX = windowWidth * 0.2;
var enemyBottomMaxX = windowWidth - enemyBottomMinX;

function randEnemySource() {
    var rand = Math.floor(Math.random() * ENEMY_TOTAL_SOURCES);
    return rand === 3 ? rand - 1: rand; //make vertical as likely as horizontal
}

function randPos(min, max) {
    var dif = max - min;
    
    return min + Math.random() * dif;
}

function lerp(min, max, progress) {
    var dif = max - min;
    
    console.log('LERPING');
    console.log('Min: ' + min + ', Max: ' + max + ', Progress: ' + progress);
    
    console.log('Result: ' + (min + progress * dif));
    return min + progress * dif;
}

//difficulty from 0 to 1, ramps up enemy speed
function Enemy(source, difficulty) {
    var width = game.cache.getImage('enemy').width;
    var height = game.cache.getImage('enemy').height;
    console.log('Width: ' + width);
    console.log('Height: ' + height);
    
    console.log('Enemy max y: ' + enemySideMaxY);
    
    var x, y;
    var velX, velY;
    
    switch (source) {
        case ENEMY_LEFT:
            x = -width;
            y = randPos(enemySideMinY, enemySideMaxY);
            velX = lerp(enemyMinSpeed, enemyMaxSpeed, difficulty);
            velY = 0;
            break;
        case ENEMY_RIGHT:
            x = windowWidth;
            y = randPos(enemySideMinY, enemySideMaxY);
            velX = lerp(enemyMinSpeed, enemyMaxSpeed, difficulty) * -1;
            velY = 0;
            break;
        case ENEMY_BOTTOM:
            x = randPos(enemyBottomMinX, enemyBottomMaxX);
            y = bottomBounds;
            velX = 0;
            velY = lerp(enemyMinSpeed, enemyMaxSpeed, difficulty) * -1;
            break;
    }
    
    this.sprite = game.add.sprite(x, y, 'enemy');
    game.physics.arcade.enable(this.sprite);
    this.sprite.body.velocity.x = velX;
    this.sprite.body.velocity.y = velY;
    
    console.log('Spawned an enemy.');
    console.log('Enemy pos: (' + this.sprite.x + ', ' + this.sprite.y + ')');
    console.log('Enemy velocity: (' + velX + ', ' + velY + ')');
}