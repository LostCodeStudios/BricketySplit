function Rick(world) {
    
    this.world = world;
    
    var width = rickWidth;
    var height = rickHeight;
    
    var groundHeight = 32;
    
    var x = windowWidth / 2 - width / 2;
    var y = bottomBounds - height - groundHeight;
    
    var fps = 3;
    
    this.sprite = game.add.sprite(x, y, 'rick');
    this.sprite.animations.add('walkLeft', [1, 0], fps, true);
    this.sprite.animations.add('standLeft', [0], fps, true);
    this.sprite.animations.add('walkRight', [3, 2], fps, true);
    this.sprite.animations.add('standRight', [2], fps, true);
    
    this.jumpSound = game.add.audio('jump');
    
    game.physics.enable(this.sprite, Phaser.Physics.ARCADE);
    
    //this.sprite.body.bounce.y = 0.00000000001;
    this.sprite.body.gravity.y = gravity;
    //this.sprite.body.collideWorldBounds = true;
    
    //input
    this.cursors = game.input.keyboard.createCursorKeys();
    
    var sideFraction = 1 / 4;
    this.touchDownEvent = function () {
        if (game.input.x < windowWidth * sideFraction) {
            if (!this.movingLeft) {
                this.movingLeft = true;
            } else {
                this.jumping = true;
            }
        } else if (game.input.x > 3 * windowWidth * sideFraction) {
            if (!this.movingRight) {
                this.movingRight = true;
            } else {
                this.jumping = true;
            }
        }
    };
    
    this.touchUpEvent = function () {
        if (game.input.activePointer.screenX < windowWidth * sideFraction) {
            if (this.movingLeft) {
                this.movingLeft = false;
            } else {
                this.jumping = false;
            }
        } else if (game.input.activePointer.screenX > windowWidth - windowWidth * sideFraction) {
            if (this.movingRight) {
                this.movingRight = false;
            } else {
                this.jumping = false;
            }
        }
    };
    
    if (mobile) {
        game.input.onDown.add(this.touchDownEvent, this);
        game.input.onUp.add(this.touchUpEvent, this);
    }
    
    this.deathSound = game.add.audio('squish');
    this.facing = 'left';
    
    var moveSpeed = 300;
    var jumpSpeed = 375;
    
    this.destroy = function () {
        this.sprite.destroy();
        game.input.onDown.remove(this.touchDownEvent, this);
        game.input.onUp.remove(this.touchUpEvent, this);
    };
    
    this.die = function () {
        this.dead = true;
        this.sprite.body = null;
        this.sprite.destroy();
        this.deathSound.play();
    };
    
    this.update = function () {
        
        if (this.dead) return;
        
        var bounceDist = gravity / 1500;
        if (this.sprite.body.touching.left) {
            this.sprite.body.y -= bounceDist;
        }
        
        if (this.sprite.body.touching.right) {
            this.sprite.body.y -= bounceDist;
        }
        
        this.sprite.body.velocity.x = 0;
        
        if (this.moveLeft() && this.sprite.x > 0) {
            this.sprite.animations.play('walkLeft');
            this.facing = 'left';
            
            this.sprite.body.velocity.x = -moveSpeed;
        } else if (this.moveRight() && this.sprite.x < windowWidth - width) {
            this.sprite.animations.play('walkRight');
            this.facing = 'right';
            
            this.sprite.body.velocity.x = moveSpeed;
        } else if (this.facing === 'left') {
            this.sprite.animations.play('standLeft');
        } else if (this.facing === 'right') {
            this.sprite.animations.play('standRight');
        }
        
        if (this.jump() && this.sprite.body.touching.down)
        {
            this.sprite.body.velocity.y = -jumpSpeed;
            this.jumpSound.play();
        }
        
        if (this.sprite.body.y > bottomBounds) {
            this.die();
        }
        
    };
    
    this.moveLeft = function () {
        if (mobile) {
            return this.movingLeft;
        } else {
            return this.cursors.left.isDown;
        }
    };
    
    this.moveRight = function () {
        if (mobile) {
            return this.movingRight;
        } else {
            return this.cursors.right.isDown;
        }
    };
    
    this.jump = function () {
        if (mobile) {
            return this.jumping;
        } else {
            return game.input.keyboard.isDown(Phaser.Keyboard.Z);
        }
    };
}