function Brick(lane, offset, wallWidth) {
    var width = game.cache.getImage('brick').width;
    var height = game.cache.getImage('brick').height;
    
    var bodyWidthMargin = 1;
    var bodyHeightMargin = 0;
    
    var x = width + lane * width;
    
    if (offset) {
        x -= width / 2;
    }
    
    var y = -height;
    
    if (offset && lane == 0 || lane == wallWidth) {
        //half brick
        width /= 2;
        
        if (lane == 0) x += width;
        
        this.sprite = game.add.sprite(x, y, 'halfbrick');
        this.sprite.body.setRectangle(width - bodyWidthMargin, height - bodyHeightMargin, bodyWidthMargin / 2, bodyHeightMargin / 2);
        this.sprite.body.x = x;
        this.sprite.body.y = y;
        this.sprite.body.gravity.y = gravity;
    } else {
        this.sprite = game.add.sprite(x, y, 'brick');
        this.sprite.body.setRectangle(width - bodyWidthMargin, height - bodyHeightMargin, bodyWidthMargin / 2, bodyHeightMargin / 2);
        this.sprite.body.x = x;
        this.sprite.body.y = y;
        this.sprite.body.gravity.y = gravity;
    }
}