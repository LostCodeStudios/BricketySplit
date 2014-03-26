var ufoY = windowHeight * 0.1;
var ufoSpeed = 100;
var minUFOStopTime = 2500;
var maxUFOStopTime = 5000;

var minUFOStopX = wallLeftX;
var maxUFOStopX = wallRightX;
var ufoShotDelay = 250;

function UFO(world, difficulty) {
    this.world = world;
    
    var source = percent(0.5); //false: left, true: right
    this.source = source;
    
    var width = game.cache.getImage('ufo').width;
    var height = game.cache.getImage('ufo').height;
    
    var x, y;
    x = (source ? windowWidth : -width);
    y = topBounds + ufoY;
    
    this.sprite = game.add.sprite(x, y, 'ufo');
    
    this.sprite.isUFO = true;
    
    game.physics.arcade.enable(this.sprite);
    this.sprite.body.velocity.x = (source ? -ufoSpeed: ufoSpeed);
    
    this.stopX = randPos(minUFOStopX, maxUFOStopX);
    this.stopTime = lerp(minUFOStopTime, maxUFOStopTime, difficulty);
    this.stopped = false;
    
    this.update = function (delta) {
        if (!this.stopped) {
            
            if (!this.source) {
                //from the left
                if (this.sprite.x + this.sprite.width / 2 >= this.stopX && !this.stopped) {
                    this.sprite.x = this.stopX - this.sprite.width / 2;
                    this.stopped = true;
                    
                    this.sprite.body.velocity.x = 0;
                    
                    this.shotTimer = 0;
                }
            } else {
                //from the right
                if (this.sprite.x + this.sprite.width / 2 <= this.stopX && !this.stopped) {
                    this.sprite.x = this.stopX - this.sprite.width / 2;
                    this.stopped = true;
                    
                    this.sprite.body.velocity.x = 0;
                    
                    this.shotTimer = 0;
                }
            }
            
        } else {
            //manage stop

            if (this.stopTime <= 0) {
                this.sprite.body.velocity.x = (this.source ? -ufoSpeed : ufoSpeed);
            } else {
            
                this.stopTime -= delta;
                this.shotTimer += delta;
            
                if (this.shotTimer >= ufoShotDelay) {
                    //TODO fire a shot down
                    this.world.spawnLaser(this.sprite.x + this.sprite.width / 2, this.sprite.y + this.sprite.height);
                    
                    this.shotTimer -= ufoShotDelay;
                }
            }
            
        }
    };
}