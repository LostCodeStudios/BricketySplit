function Rick() {
    
    console.log('Making Rick!');
    
    var width = 16;
    var height = 24;
    
    var groundHeight = 32;
    
    var x = windowWidth / 2 - width / 2;
    var y = windowHeight - height - groundHeight;
    
    var fps = 3;
    
    this.sprite = game.add.sprite(x, y, 'rick');
    this.sprite.animations.add('walkLeft', [1, 0], fps, true);
    this.sprite.animations.add('standLeft', [0], fps, true);
    this.sprite.animations.add('walkRight', [3, 2], fps, true);
    this.sprite.animations.add('standRight', [2], fps, true);
    
    this.sprite.body.bounce.y = 0.00000000001;
    this.sprite.body.gravity.y = gravity;
    //this.sprite.body.collideWorldBounds = true;
    
    //input
    this.cursors = game.input.keyboard.createCursorKeys();
    
    this.facing = 'left';
    
    var moveSpeed = 200;
    var jumpSpeed = 250;
    
    this.destroy = function () {
        this.sprite.destroy();
    };
    
    this.die = function () {
        console.log('Rick died :(');
        this.dead = true;
        this.sprite.destroy();
    }
    
    this.update = function () {
        
        this.sprite.body.velocity.x = 0;
        
        if (this.cursors.left.isDown && !this.sprite.body.touching.left && this.sprite.x > 0) {
            this.sprite.animations.play('walkLeft');
            this.facing = 'left';
            
            this.sprite.body.velocity.x = -moveSpeed;
        } else if (this.cursors.right.isDown && !this.sprite.body.touching.right && this.sprite.x < windowWidth - width) {
            this.sprite.animations.play('walkRight');
            this.facing = 'right';
            
            this.sprite.body.velocity.x = moveSpeed;
        } else if (this.facing === 'left') {
            this.sprite.animations.play('standLeft');
        } else if (this.facing === 'right') {
            this.sprite.animations.play('standRight');
        }
        
        if (game.input.keyboard.justPressed(Phaser.Keyboard.Z) && this.sprite.body.touching.down)
        {
            this.sprite.body.velocity.y = -jumpSpeed;
        }
        
        if (this.sprite.body.y > bottomBounds) {
            this.die();
        }
        
    };
}