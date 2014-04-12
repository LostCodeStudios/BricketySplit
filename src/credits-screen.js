function CreditsScreen() {
	this.ground = makeGround();
	this.leftWater = makeWaterLeft();
	this.rightWater = makeWaterRight();
	this.brickSound = game.add.audio('brickfall');
	this.clouds = makeClouds();

    var menuButtonX = 620;
    var menuButtonY = 30;

    this.menuButton = game.add.button(menuButtonX, menuButtonY, 'menubutton', playKeyPressed, this, 1, 0, 2);

	this.show = function (oldState) {
		this.elapsedTime = 0;
		this.shown = true;
		this.creditsFallen = false;
	};

	this.hide = function (newState) {
		this.menuButton.inputEnabled = false;
	};

	this.destroy = function () {
		//console.log('destroying the credits screen');

		this.ground.body = null;
		this.ground.destroy();

		this.leftWater.body = null;
		this.leftWater.destroy();

		this.rightWater.body = null;
		this.rightWater.destroy();

		this.credits.body = null;
		this.credits.destroy();

		this.menuButton.destroy();
		this.clouds.destroy();
	};

	this.update = function (delta) {
		this.elapsedTime += delta;

		if (this.shown) {
			if (this.elapsedTime >= 550) {
				if (!this.creditsFallen) {
					this.creditsFallen = true;

					this.credits = game.add.sprite(wallLeftX, -windowHeight, 'credits');
					game.physics.arcade.enable(this.credits);
					this.credits.body.gravity.y = minBrickGravity;
				}
			}
		}

		if (!this.fallen) {
			game.physics.arcade.collide(this.credits, this.ground, null, this.creditsCollisionCallback, this);
		}
	};

	this.render = function () {

	};

	this.creditsCollisionCallback = function (credits, ground) {
		credits.body.gravity.y = 0;
		this.fallen = true;

		if (particles) {

			//throw up some particles
			var leftEmitter = game.add.emitter(wallLeftX, windowHeight - groundHeight, 100);
	        var rightEmitter = game.add.emitter(wallRightX, windowHeight - groundHeight, 100);

	        var minSpeedX = 20;
	        var maxSpeedX = 150;

	        var minSpeedY = 20;
	        var maxSpeedY = 100; 

	        leftEmitter.minParticleSpeed.x = -maxSpeedX;
	        leftEmitter.maxParticleSpeed.x = -minSpeedX;
	        leftEmitter.minParticleSpeed.y = -maxSpeedY;
	        leftEmitter.maxParticleSpeed.y = -minSpeedY;

	        rightEmitter.minParticleSpeed.x = minSpeedX;
	        rightEmitter.maxParticleSpeed.x = maxSpeedX;
	        rightEmitter.minParticleSpeed.y = -maxSpeedY;
	        rightEmitter.maxParticleSpeed.y = -minSpeedY;

	        leftEmitter.gravity = gravity / 6;
	        rightEmitter.gravity = gravity / 6;

	        var particleKey = 'dirtparticle';

	        leftEmitter.makeParticles(particleKey);
	        rightEmitter.makeParticles(particleKey);

	        //  The first parameter sets the effect to "explode" which means all particles are emitted at once
	        //  The second gives each particle a 500ms lifespan
	        //  The third is ignored when using burst/explode mode
	        //  The final parameter (10) is how many particles will be emitted in this single burst
	        leftEmitter.start(true, 1000, null, 25);
	        rightEmitter.start(true, 1000, null, 25);
	    }

        // and play a sound
        playSound(this.brickSound);
	};

	function playKeyPressed() {
		setState(new MainMenu());
	};

}