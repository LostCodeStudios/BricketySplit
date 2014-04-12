function OptionsScreen() {
	this.ground = makeGround();
	this.waterLeft = makeWaterLeft();
	this.waterRight = makeWaterRight();
	this.clouds = makeClouds();

	this.titleText = MakeCenteredLabel(windowWidth / 2, windowHeight * 0.1, 'Options', '48px Bangers', skyTextColor);
    this.brickFallSound = game.add.audio('brickfall');

	var menuButtonX = 600;
    var menuButtonY = 40;

    this.menuButton = game.add.button(menuButtonX, menuButtonY, 'menubutton', playKeyPressed, this, 1, 0, 2);

    var tutorialTextX = windowWidth * 0.5;
    var tutorialTextY = windowHeight * 0.3;

    this.tutorialText = MakeCenteredLabel(tutorialTextX, tutorialTextY, 'Tutorial: ', smallTextFont, skyTextColor);

    var tutorialButtonX = windowWidth * 0.55;
    var tutorialButtonY = windowHeight * 0.28;

    this.checkBoxFilled = game.add.button(tutorialButtonX, tutorialButtonY, 'filledcheckbox', boxEmptied, this, 1, 0, 2);
    this.checkBoxEmpty = game.add.button(tutorialButtonX, tutorialButtonY, 'emptycheckbox', boxFilled, this, 1, 0, 2);

    if (tutorial()) {
    	this.checkBoxEmpty.kill();
    } else {
    	this.checkBoxFilled.kill();
    }

    this.soundText = MakeCenteredLabel(windowWidth / 2, windowHeight * 0.5, 'Sound Volume', smallTextFont, skyTextColor);

    var soundButtonX = windowWidth * 0.58;
    var soundButtonUpY = windowHeight * 0.68;
    var soundButtonDownY = windowHeight * 0.81;

    this.soundUpButton = game.add.button(soundButtonX, soundButtonUpY, 'plusbutton', soundUpPressed, this, 1, 0, 2);
    this.soundDownButton = game.add.button(soundButtonX, soundButtonDownY, 'minusbutton', soundDownPressed, this, 1, 0, 2);

    this.volumeBricks = new Array();

    this.brickX = windowWidth * 0.5 - brickWidth / 2;
    this.brickY = windowHeight - groundHeight - brickHeight;

	this.show = function (oldState) {
		//load current settings

		//place bricks for sound volume
		var bricks = soundVolume / volumeInc;

		for (var i = 0; i < bricks; i++) {
			var brick = game.add.sprite(this.brickX, this.brickY, 'brick');

			this.volumeBricks.push(brick);

			this.brickY -= brickHeight;
		}
	};

	this.hide = function (newState) {
		this.menuButton.inputEnabled = false;
		this.checkBoxEmpty.inputEnabled = false;
		this.checkBoxFilled.inputEnabled = false;
	};

	this.destroy = function () {
		this.ground.body = null;
		this.ground.destroy();
		this.waterLeft.destroy();
		this.waterRight.destroy();
		this.titleText.destroy();
		this.menuButton.destroy();
		this.soundText.destroy();
		this.soundUpButton.destroy();
		this.soundDownButton.destroy();

		for (var i = 0; i < this.volumeBricks.length; i++) {
			this.volumeBricks[i].destroy();
		}

		this.checkBoxFilled.destroy();
		this.checkBoxEmpty.destroy();
		this.tutorialText.destroy();
		this.clouds.destroy();

	};

	this.update = function (delta) {

	};

	this.render = function () {

	};

	function playKeyPressed() {
        setState(new MainMenu());
    };

    function soundUpPressed() {
    	if (soundVolume < 1) {
    		//console.log('Increasing volume from ' + soundVolume);

    		incVolume();

    		//console.log('New sound volume: ' + soundVolume);

    		//add a brick to the stack
    		var brick = game.add.sprite(this.brickX, this.brickY, 'brick');

			this.volumeBricks.push(brick);

			this.brickY -= brickHeight;
    	}

    	playSound(this.brickFallSound); //give the player a taste
    };

    function soundDownPressed() {
    	if (soundVolume > 0) {
    		//console.log('Tried to subtract from ' + soundVolume);

    		decVolume();

    		//console.log('new value: ' + soundVolume);

			//remove a brick from the stack
			var brick = this.volumeBricks.pop();

			brick.destroy();

			this.brickY += brickHeight;
    	}

    	playSound(this.brickFallSound); //give the player a taste
    };

    function boxFilled() {
    	localStorage.setItem('tutorialEnabled', 'true');
    	this.checkBoxEmpty.kill();
    	this.checkBoxFilled.revive();

    	//console.log('Enabled the tutorial');
    };

    function boxEmptied() {
    	localStorage.setItem('tutorialEnabled', 'false');
    	this.checkBoxFilled.kill();
    	this.checkBoxEmpty.revive();

    	//console.log('disabled the tutorial');
    };

}