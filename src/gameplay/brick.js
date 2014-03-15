function Brick(lane, offset) {
    var width = 64;
    var height = 32;
    
    var bodyWidthMargin = 6;
    var bodyHeightMargin = 0;
    
    var x = width + lane * width;
    
    if (offset) {
        x += width / 2;
    }
    
    var y = -height;
    
    this.sprite = game.add.sprite(x, y, 'brick');
    this.sprite.body.setRectangle(width - bodyWidthMargin, height - bodyHeightMargin, bodyWidthMargin / 2, bodyHeightMargin / 2);
    this.sprite.body.x = x;
    this.sprite.body.y = y;
    this.sprite.body.gravity.y = gravity;
}