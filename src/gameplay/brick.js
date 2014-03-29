var brickWidthMargin = 1;

function Brick(lane, offset, wall, difficulty) {
    var wallWidth = wall.width;
    
    var x = wallLeftX + lane * brickWidth;
    
    if (offset) {
        x -= brickWidth / 2;
    }
    
    var y = topBounds -  brickHeight;
    
    if (offset && lane == 0 || lane == wallWidth) {
        //half brick     
        if (lane == 0) x += brickWidth / 2;
        
        this.sprite = game.add.sprite(x, y, 'halfbrick');
        game.physics.enable(this.sprite, Phaser.Physics.ARCADE);
    } else {
        this.sprite = game.add.sprite(x, y, 'brick');
        game.physics.enable(this.sprite, Phaser.Physics.ARCADE);
    }
    
    this.sprite.body.x += brickWidthMargin;
    this.sprite.body.width -= brickWidthMargin * 2;
    
    this.sprite.body.gravity.y = lerp(minBrickGravity, maxBrickGravity, difficulty);
        
    this.sprite.fallSound = game.add.audio('brickfall');
    this.sprite.isBrick = true;

    this.lane = lane;
    this.row = wall.lanes[lane] + 1;
    this.sprite.brick = this;
}