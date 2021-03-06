var waveEnemyMidY = windowHeight / 2;
var waveEnemyAmp = windowHeight / 4;
var waveEnemySpeed = 350;

function WaveEnemy() {
    var width = game.cache.getImage('enemyorange').width / 2;
    
    this.source = percent(0.5);
    this.sin = percent(0.5);
    
    var color = (this.sin ? 'blue' : 'orange');
    
    var x = (this.source ? windowWidth : -width);
    
    this.sprite = game.add.sprite(x, 0, 'enemy' + color);
    this.sprite.animations.add('normal', [0, 1], 2, true);
    this.sprite.animations.play('normal');
    this.sprite.smoothed = false;
    
    game.physics.arcade.enable(this.sprite);
    this.sprite.body.velocity.x = (this.source ? -waveEnemySpeed : waveEnemySpeed);
    
    this.sprite.isWaver = true;
}

WaveEnemy.prototype.update = function () {
    var x;
    if (!this.source) {
        //from the left
        x = (this.sprite.x / windowWidth) * 4 * Math.PI;

    } else {
        //from the right
        x = (4 * Math.PI) - ((this.sprite.x / windowWidth) * 4 * Math.PI);
    }
    //console.log('Waver X: ' + x);
    
    var y;
    if (this.sin) {
        y = topBounds + waveEnemyMidY + Math.sin(x) * waveEnemyAmp;
    } else {
        y = topBounds + waveEnemyMidY + Math.cos(x) * waveEnemyAmp;
    }
    
    this.sprite.body.y = y;
};  