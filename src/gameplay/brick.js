function Brick(lane, offset) {
    var brickWidth = 64;
    var brickHeight = 32;
    
    var x = width + lane * width;
    
    if (offset) {
        x += width / 2;
    }
    
    this.sprite = game.add.sprite(x, -height, 'brick');
    this.sprite.body.gravity = gravity;
}