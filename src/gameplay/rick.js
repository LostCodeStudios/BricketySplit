var RICK_DEATH_SQUASH = 0;
var RICK_DEATH_SPLASH = 1;
var RICK_DEATH_HIT = 2;

var moveSpeed = 300;
var jumpSpeed = 375;

function Rick(world) {
    
    this.world = world;
    
    var x = windowWidth / 2 - rickWidth / 2;
    var y = topBounds - rickHeight; //fall from the top!
    
    var fps = 5;
    
    this.sprite = game.add.sprite(x, y, 'rick');
    this.sprite.smoothed = false;

    this.sprite.animations.add('walkLeft', [1, 0], fps, true);
    this.sprite.animations.add('standLeft', [0], fps, true);
    this.sprite.animations.add('walkRight', [3, 2], fps, true);
    this.sprite.animations.add('standRight', [2], fps, true);
    
    game.physics.enable(this.sprite, Phaser.Physics.ARCADE);
    
    this.sprite.anchor.set(2/19, 0);
    this.sprite.body.width -= 4; //remove padding
    this.sprite.body.gravity.y = gravity;
    
    this.sprite.isRick = true;
    
    //input
    this.cursors = game.input.keyboard.createCursorKeys();
    
    var sideFraction = 1 / 4;

    if (mobile) {
        //add touch buttons

        if (!tutorial()) {
            this.createMoveButtons();
            this.createJumpButton();
        }

    } else {
        this.moveLeftKey = game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
        this.moveRightKey = game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
        
        this.moveLeftKey.onDown.add(moveLeftCallback, this);
        this.moveRightKey.onDown.add(moveRightCallback, this);
        
        this.moveLeftKey.onUp.add(stopLeftCallback, this);
        this.moveRightKey.onUp.add(stopRightCallback, this);
    }

    this.facing = 'left';
    
}

Rick.prototype.createMoveButtons = function () {
    this.moveLeftButton = game.add.button(moveLeftButtonX, touchButtonY, 'leftarrow', null, null, 0, 0, 1);
    this.moveRightButton = game.add.button(moveRightButtonX, touchButtonY, 'rightarrow', null, null, 0, 0, 1);
    
    this.moveLeftButton.onInputDown.add(moveLeftCallback, this);
    this.moveRightButton.onInputDown.add(moveRightCallback, this);
    

    this.moveLeftButton.onInputUp.add(stopLeftCallback, this);
    this.moveRightButton.onInputUp.add(stopRightCallback, this);
    

    this.moveLeftButton.fixedToCamera = true;
    this.moveRightButton.fixedToCamera = true;
    
    this.moveButtonsCreated = true;


    //console.log('Made the buttons');
};

Rick.prototype.createJumpButton = function () {
    this.jumpButton = game.add.button(jumpButtonX, touchButtonY, 'uparrow', null, null, 0, 0, 1);
    this.jumpButton.onInputDown.add(jumpCallback, this);
    this.jumpButton.onInputUp.add(stopJumpCallback, this);
    this.jumpButton.fixedToCamera = true;

    this.jumpButtonCreated = true;
};

Rick.prototype.destroy = function () {
    //console.log('Destroying rick');
    
    this.sprite.body = null;
    this.sprite.destroy();
    
    if (mobile) {
        //destroy buttons

        if (this.moveButtonsCreated) {      
            this.moveLeftButton.destroy();
            this.moveRightButton.destroy();
        }

        if (this.jumpButtonCreated) {
            this.jumpButton.destroy();
        }
        
        //console.log('destroying the buttons');
    }
};

Rick.prototype.die = function (deathType) {
    if (deathType == RICK_DEATH_SQUASH || deathType == RICK_DEATH_HIT) {

        if (particles) {

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
        }

        
        if (deathType == RICK_DEATH_SQUASH) {
            playSound(squishSound);
        } else {
            playSound(deathSound);
        }
    } else {
        //handle a splash death
        if (particles) {
            var emitter = game.add.emitter(this.sprite.x + this.sprite.width / 2, bottomBounds, 100);
            emitter.gravity = gravity / 3;
            var maxSpeedX = 100;
            
            var minSpeedY = 70;
            var maxSpeedY = 300;

            emitter.minParticleSpeed.x = -maxSpeedX;
            emitter.maxParticleSpeed.x = maxSpeedX;

            emitter.minParticleSpeed.y = -maxSpeedY;
            emitter.maxParticleSpeed.y = -minSpeedY;

            emitter.makeParticles('waterparticle');
            //  The first parameter sets the effect to "explode" which means all particles are emitted at once
            //  The second gives each particle a 2000ms lifespan
            //  The third is ignored when using burst/explode mode
            //  The final parameter (10) is how many particles will be emitted in this single burst
            emitter.start(true, 1000, null, 30);
        }

        playSound(splashSound);
    }

    
    this.dead = true;
    this.destroy();
};

Rick.prototype.update = function () {
        
    if (this.dead) return;

    if (this.sprite.body.touching.down && this.sprite.body.touching.up) {
        //crushed
        this.die(RICK_DEATH_SQUASH);
        return;
    }

    if (!mobile) {
        this.jumping = false;
        //jump logic - take input from multiple keys
        for (var i = 0; i < jumpKeys.length; i++) {
            if (game.input.keyboard.isDown(jumpKeys[i])) {
                this.jumping = true;
                break;
            }
        }
    }

    if (mobile) {
        if (this.moveButtonsCreated) {
            this.moveLeftButton.bringToTop();
            this.moveRightButton.bringToTop();
        }

        if (this.jumpButtonCreated) {
            this.jumpButton.bringToTop();
        }
    }
    
    this.sprite.body.velocity.x = 0;
    
    if (this.movingLeft && this.sprite.x > 0 && !this.sprite.body.touching.up) {
        this.sprite.animations.play('walkLeft');
        this.facing = 'left';
        
        this.sprite.body.velocity.x = -moveSpeed;
    } else if (this.movingRight && this.sprite.x < windowWidth - rickWidth && !this.sprite.body.touching.up) {
        this.sprite.animations.play('walkRight');
        this.facing = 'right';
        
        this.sprite.body.velocity.x = moveSpeed;
    } else if (this.facing === 'left') {
        this.sprite.animations.play('standLeft');
    } else if (this.facing === 'right') {
        this.sprite.animations.play('standRight');
    }

    var pushOffAmount = 1;
    if (this.sprite.x <= wallLeftX - this.sprite.width && this.sprite.body.touching.down) {
        //he's stuck on the left edge of the wall! Push him off!
        this.sprite.body.x -= pushOffAmount;
        this.sprite.body.velocity.x = -pushOffAmount;

        this.jumping = false;
    }

    if (this.sprite.x >= wallRightX && this.sprite.body.touching.down) {
        //he's stuck on the right edge of the wall! Push him off!
        this.sprite.body.x += pushOffAmount;
        this.sprite.body.velocity.x = pushOffAmount;

        this.jumping = false;
    }
    
    if (this.jumping && this.sprite.body.touching.down)
    {
        this.sprite.body.velocity.y = -jumpSpeed;
        playSound(jumpSound);
    }
    
    if (this.sprite.body.y > bottomBounds + 30) {
        this.die(RICK_DEATH_SPLASH);
    }
    
};

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
}

function jumpCallback() {
    this.jumping = true;
}

function stopJumpCallback() {
    this.jumping = false;
}

