var gravity = 10;

function World() {
    
    var wallWidth = 8;
    
    makeGround(this);
    
    this.wall = new Wall(wallWidth);
    
    this.bricks = game.add.group();
    
    this.destroy = function () {
        bricks.destroy();
    };
    
    this.update = function (delta) {
        
    }
    
}

function makeGround(world) {
    var groundWidth = 640;
    var groundHeight = 32;
    
    var x = 0;
    var y = windowHeight - groundHeight;
    
    world.ground = game.add.sprite(x, y, 'ground');
    world.ground.body.immovable = true;
}