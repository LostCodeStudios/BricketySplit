function Rick(world) {
    
    this.world = world;
    
    var width = rickWidth;
    var height = rickHeight;
    
    var x = windowWidth / 2 - width / 2;
    var y = topBounds - rickHeight; //fall from the top!
    
    var fps = 5;
    
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
        this.moveLeftButton = game.add.button(moveLeftButtonX, touchButtonY, 'leftarrow', null, null, 0, 0, 1);
        this.moveRightButton = game.add.button(moveRightButtonX, touchButtonY, 'rightarrow', null, null, 0, 0, 1);
        this.jumpButton = game.add.button(jumpButtonX, touchButtonY, 'uparrow', null, null, 0, 0, 1);
    
        this.moveLeftButton.onInputDown.add(moveLeftCallback, this);
        this.moveRightButton.onInputDown.add(moveRightCallback, this);
        this.jumpButton.onInputDown.add(jumpCallback, this);
    
        this.moveLeftButton.onInputUp.add(stopLeftCallback, this);
        this.moveRightButton.onInputUp.add(stopRightCallback, this);
        this.jumpButton.onInputUp.add(stopJumpCallback, this);
    
        this.moveLeftButton.fixedToCamera = true;
        this.moveRightButton.fixedToCamera = true;
        this.jumpButton.fixedToCamera = true;
        
        console.log('Made the buttons');
    } else {
        this.moveLeftKey = game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
        this.moveRightKey = game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
        
        this.moveLeftKey.onDown.add(moveLeftCallback, this);
        this.moveRightKey.onDown.add(moveRightCallback, this);
        
        this.moveLeftKey.onUp.add(stopLeftCallback, this);
        this.moveRightKey.onUp.add(stopRightCallback, this);
    }
    
    this.deathSound = game.add.audio('squish');
    this.facing = 'left';
    
    var moveSpeed = 300;
    var jumpSpeed = 375;
    
    this.destroy = function () {
        console.log('Destroying rick');
        
        this.sprite.body = null;
        this.sprite.destroy();
        
        if (mobile) {
            //destroy buttons            
            this.moveLeftButton.destroy();
            this.moveRightButton.destroy();
            this.jumpButton.destroy();
            
            console.log('destroying the buttons');
        }
    };
    
    this.die = function () {
        var emitter = game.add.emitter(this.sprite.x + this.sprite.width / 2, this.sprite.y + this.sprite.height, 100);
        emitter.gravity = gravity / 6;

        var maxSpeedX = 125;
        
        var minSpeedY = 20;
        var maxSpeedY = 180;

        emitter.minParticleSpeed.x = -maxSpeedX;
        emitter.maxParticleSpeed.x = maxSpeedX;

        emitter.minParticleSpeed.y = -maxSpeedY;
        emitter.maxParticleSpeed.y = -minSpeedY;

        emitter.makeParticles('smallparticle');
        //  The first parameter sets the effect to "explode" which means all particles are emitted at once
        //  The second gives each particle a 2000ms lifespan
        //  The third is ignored when using burst/explode mode
        //  The final parameter (10) is how many particles will be emitted in this single burst
        emitter.start(true, 1000, null, 30);
        
        emitter.makeParticles('bigparticle');
        emitter.start(true, 1000, null, 15);

        
        this.dead = true;
        this.destroy();
        
        playSound(this.deathSound);
    };
    
    this.update = function () {
        
        if (this.dead) return;
        
        if (this.sprite.body.touching.down && this.sprite.body.touching.up) {
            //crushed
            this.die();
            return;
        }
        
        this.jumping = false;
        if (!mobile) {
            //jump logic - take input from multiple keys
            for (var i = 0; i < jumpKeys.length; i++) {
                if (game.input.keyboard.isDown(jumpKeys[i])) {
                    this.jumping = true;
                    break;
                }
            }
        }

        if (mobile) {
            this.moveLeftButton.bringToTop();
            this.moveRightButton.bringToTop();
            this.jumpButton.bringToTop();
        }
        
        this.sprite.body.velocity.x = 0;
        
        if (this.movingLeft && this.sprite.x > 0 && !this.sprite.body.touching.up) {
            this.sprite.animations.play('walkLeft');
            this.facing = 'left';
            
            this.sprite.body.velocity.x = -moveSpeed;
        } else if (this.movingRight && this.sprite.x < windowWidth - width && !this.sprite.body.touching.up) {
            this.sprite.animations.play('walkRight');
            this.facing = 'right';
            
            this.sprite.body.velocity.x = moveSpeed;
        } else if (this.facing === 'left') {
            this.sprite.animations.play('standLeft');
        } else if (this.facing === 'right') {
            this.sprite.animations.play('standRight');
        }

        var pushOffAmount = 1;
        if (this.sprite.body.x <= wallLeftX - this.sprite.width && this.sprite.body.touching.down) {
            //he's stuck on the left edge of the wall! Push him off!
            this.sprite.body.x -= pushOffAmount;
            this.sprite.body.velocity.x = 0;
        }

        if (this.sprite.body.x >= wallRightX && this.sprite.body.touching.down) {
            //he's stuck on the right edge of the wall! Push him off!
            this.sprite.body.x += pushOffAmount;
            this.sprite.body.velocity.x = 0;
        }
        
        if (this.jumping && this.sprite.body.touching.down)
        {
            this.sprite.body.velocity.y = -jumpSpeed;
            playSound(this.jumpSound);
        }
        
        if (this.sprite.body.y > bottomBounds) {
            this.die();
        }
        
    };
    
}

function moveLeftCallback () {
    this.movingLeft = true;
    this.movingRight = false;
}

function moveRightCallback () {
    this.movingRight = true;
    this.movingLeft = false;
}

function stopLeftCallback () {
    this.movingLeft = false;
    
    this.movingRight = game.input.keyboard.isDown(Phaser.Keyboard.RIGHT);
}

 function stopRightCallback () {
    this.movingRight = false;
     
    this.movingLeft = game.input.keyboard.isDown(Phaser.Keyboard.LEFT);
};