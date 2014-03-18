var brickWidthMargin = 1;
    
function Brick(lane, offset, wallWidth) {
    var width = game.cache.getImage('brick').width;
    var height = game.cache.getImage('brick').height;
    
    var x = width + lane * width;
    
    if (offset) {
        x -= width / 2;
    }
    
    var y = topBounds - height;
    
    if (offset && lane == 0 || lane == wallWidth) {
        //half brick
        width /= 2;
        
        if (lane == 0) x += width;
        
        console.log('Sprite position (' + x + ', ' + y + ')');
        this.sprite = game.add.sprite(x, y, 'halfbrick');
        game.physics.enable(this.sprite, Phaser.Physics.ARCADE);
    } else {
        console.log('Sprite position (' + x + ', ' + y + ')');
        this.sprite = game.add.sprite(x, y, 'brick');
        game.physics.enable(this.sprite, Phaser.Physics.ARCADE);
    }
    
    this.sprite.body.x += brickWidthMargin;
    this.sprite.body.width -= brickWidthMargin * 2;
    this.sprite.body.gravity.y = gravity;
    
    console.log('Sprite position: ' + this.sprite.position.x);
    console.log('Body position: ' + this.sprite.body.x);
}