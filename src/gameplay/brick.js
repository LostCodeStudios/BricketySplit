var brickWidthMargin = 1;

function brickWidth() {
    return game.cache.getImage('brick').width;
}

function brickHeight() {
    return game.cache.getImage('brick').height;
}

function Brick(lane, offset, wall) {
    var width = game.cache.getImage('brick').width;
    var height = game.cache.getImage('brick').height;
    var wallWidth = wall.width;
    
    var x = width + lane * width;
    
    if (offset) {
        x -= width / 2;
    }
    
    var y = topBounds - height;
    
    if (offset && lane == 0 || lane == wallWidth) {
        //half brick
        width /= 2;
        
        if (lane == 0) x += width;
        
        this.sprite = game.add.sprite(x, y, 'halfbrick');
        game.physics.enable(this.sprite, Phaser.Physics.ARCADE);
    } else {
        this.sprite = game.add.sprite(x, y, 'brick');
        game.physics.enable(this.sprite, Phaser.Physics.ARCADE);
    }
    
    this.sprite.body.x += brickWidthMargin;
    this.sprite.body.width -= brickWidthMargin * 2;
    this.sprite.body.gravity.y = gravity;
}