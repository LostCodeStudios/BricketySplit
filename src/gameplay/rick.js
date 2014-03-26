function Rick(world) {
    
    this.world = world;
    
    var width = rickWidth;
    var height = rickHeight;
    
    var x = windowWidth / 2 - width / 2;
    var y = topBounds - rickHeight; //fall from the top!
    
    var fps = 3;
    
    this.sprite = game.add.sprite(x, y, 'rick');
    this.sprite.animations.add('walkLeft', [1, 0], fps, true);
    this.sprite.animations.add('standLeft', [0], fps, true);
    this.sprite.animations.add('walkRight', [3, 2], fps, true);
    this.sprite.animations.add('standRight', [2], fps, true);
    
    this.jumpSound = game.add.audio('jump');
    
    game.physics.enable(this.sprite, Phaser.Physics.ARCADE);
    
    this.sprite.body.gravity.y = gravity;
    
    this.sprite.isRick = true;
    
    //input
    this.cursors = game.input.keyboard.createCursorKeys();
    
    var sideFraction = 1 / 4;
    
    if (mobile) {
        //add touch buttons
        this.moveLeftButton = game.add.button(moveLeftButtonX, touchButtonY, 'leftarrow', null, this, 0, 0, 1);
        this.moveRightButton = game.add.button(moveRightButtonX, touchButtonY, 'rightarrow', null, this, 0, 0, 1);
        this.jumpButton = game.add.button(jumpButtonX, touchButtonY, 'uparrow', null, this, 0, 0, 1);
    
        this.moveLeftButton.onInputDown.add(moveLeftCallback, this);
        this.moveRightButton.onInputDown.add(moveRightCallback, this);
        this.jumpButton.onInputDown.add(jumpCallback, this);
    
        this.moveLeftButton.onInputUp.add(stopLeftCallback, this);
        this.moveRightButton.onInputUp.add(stopRightCallback, this);
        this.jumpButton.onInputUp.add(stopJumpCallback, this);
    
        this.moveLeftButton.fixedToCamera = true;
        this.moveRightButton.fixedToCamera = true;
        this.jumpButton.fixedToCamera = true;
    } else {
        this.moveLeftKey = game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
        this.moveRightKey = game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
        this.jumpKey = game.input.keyboard.addKey(Phaser.Keyboard.Z);
        
        this.moveLeftKey.onDown.add(moveLeftCallback, this);
        this.moveRightKey.onDown.add(moveRightCallback, this);
        this.jumpKey.onDown.add(jumpCallback, this);
        
        this.moveLeftKey.onUp.add(stopLeftCallback, this);
        this.moveRightKey.onUp.add(stopRightCallback, this);
        this.jumpKey.onUp.add(stopJumpCallback, this);
    }
    
    this.deathSound = game.add.audio('squish');
    this.facing = 'left';
    
    var moveSpeed = 300;
    var jumpSpeed = 375;
    
    this.destroy = function () {
        this.sprite.destroy();
        
        if (mobile) {
            //destroy buttons
            this.moveLeftButton.destroy();
            this.moveRightButton.destroy();
            this.jumpButton.destroy();
        }
    };
    
    this.die = function () {
        this.dead = true;
        this.sprite.body = null;
        this.sprite.destroy();
        this.deathSound.play();
    };
    
    this.update = function () {
        
        if (this.dead) return;
        
        if (mobile) {
            this.moveLeftButton.bringToTop();
            this.moveRightButton.bringToTop();
            this.jumpButton.bringToTop();
        }
        
        var bounceDist = gravity / 3000;
        if (this.sprite.body.touching.left) {
            this.sprite.body.y -= bounceDist;
        }
        
        if (this.sprite.body.touching.right) {
            this.sprite.body.y -= bounceDist;
        }
        
        this.sprite.body.velocity.x = 0;
        
        if (this.movingLeft && this.sprite.x > 0) {
            this.sprite.animations.play('walkLeft');
            this.facing = 'left';
            
            this.sprite.body.velocity.x = -moveSpeed;
        } else if (this.movingRight && this.sprite.x < windowWidth - width) {
            this.sprite.animations.play('walkRight');
            this.facing = 'right';
            
            this.sprite.body.velocity.x = moveSpeed;
        } else if (this.facing === 'left') {
            this.sprite.animations.play('standLeft');
        } else if (this.facing === 'right') {
            this.sprite.animations.play('standRight');
        }
        
        if (this.jumping && this.sprite.body.touching.down)
        {
            this.sprite.body.velocity.y = -jumpSpeed;
            this.jumpSound.play();
        }
        
        if (this.sprite.body.y > bottomBounds) {
            this.die();
        }
        
    };
    
}

function moveLeftCallback () {
    this.movingLeft = true;
}

function moveRightCallback () {
    this.movingRight = true;
}

function jumpCallback () {
    this.jumping = true;
}

function stopLeftCallback () {
    this.movingLeft = false;
}

 function stopRightCallback () {
    this.movingRight = false;
};

function stopJumpCallback () {
    this.jumping = false;
};