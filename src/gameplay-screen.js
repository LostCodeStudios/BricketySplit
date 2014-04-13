function GameplayScreen(skipIntro) {
    this.skipIntro = skipIntro;
}

GameplayScreen.prototype.gameOverWaitTime = 2000;
GameplayScreen.prototype.newRecord = -1;

GameplayScreen.prototype.quickRestart = function () {
    this.destroyNextFrame = true;
};

GameplayScreen.prototype.show = function (oldState) {
    this.world = new World(this.skipIntro);
    this.gameOverTimer = 0;
};

GameplayScreen.prototype.hide = function (newState) {

};

GameplayScreen.prototype.transitionOff = function() {
    updateState = false; 
   // console.log('Transitioning off');

    this.transitioning = true;

    screenToDestroy = this;
    tweener = game.add.sprite(-800, topBounds, 'backdrop');
    var tween = game.add.tween(tweener).to({x: 800}, 1250, menuEasing, true);

    tween.onUpdateCallback(this.tweenUpdate);
    tween.onComplete.add(endGameOverTween, null);
};

GameplayScreen.prototype.destroy = function (quickRestarting) {
    this.world.destroy();
    this.gameOverText.destroy();

    if (this.quickRestartEnabled) {
        this.quickRestartButton.destroy();
        this.quickRestartText.destroy();

        if (!mobile) {
            this.rkey.onDown.remove(this.quickRestart, this);
        }
    }

    if (!quickRestarting) {
        //set the new state, "this" context REQUIRED
        //console.log(this.gameOverText.text + 'xxx');
        if (this.gameOverText.text === 'TRY AGAIN  ') {
            //console.log('Making a new gameplay screen');
            setState(new GameplayScreen(screenToDestroy.skipIntro));
        } else {
            //console.log('Making a new high score screen');
            setState(new HighScoreScreen(screenToDestroy.newRecord));
        }
    }
};

GameplayScreen.prototype.tweenUpdate = function () {
   // console.log('Updating tween');

    if (tweener.x > 0 && !tweener.halfway) {
        //more than halfway
        tweener.halfway = true;

        //this will set a new state
        screenToDestroy.destroy(false);

        tweener.bringToTop();
    } else if (tweener.halfway) {
        //push to front to cover new stuff
        tweener.bringToTop();
    }
};

GameplayScreen.prototype.update = function (delta) {
    this.world.update(delta);

    if (this.destroyNextFrame) {
        this.destroy(true);
        setState(new GameplayScreen(this.skipIntro));
    }
    
    if (this.world.gameOver()) {           
        if (!this.gameOverText) {
            var text = (tutorial() ? 'TRY AGAIN' : 'GAME OVER');
            this.gameOverText = MakeCenteredLabel(windowWidth / 2, windowHeight * 0.3, text, mediumTextFont, skyTextColor);
            this.gameOverText.fixedToCamera = true;
            this.skipIntro = this.world.elapsedTime > tutorialBrickFallDelay;
            
            //also check for a high score
            var scores = JSON.parse(localStorage.getItem('Scores'));
            for (var i = 0; i < scores.length; i++) {
                if (this.world.wall.height > scores[i]) {
                    //it's a high score!!!!!!!!
                    for (var j = scores.length - 2; j >= i; j--) {
                        scores[j + 1] = scores[j]; //bump over the old ones
                    }
                    
                    scores[i] = this.world.wall.height; //CROWN THE VICTOR
                    this.newRecord = i;
                    
                    localStorage.setItem('Scores', JSON.stringify(scores));
                    break;
                }
            }

            if (!tutorial() && this.newRecord === -1) {
                this.quickRestartEnabled = true;

                //enable quick restart
                this.quickRestartText = MakeCenteredLabel(windowWidth * 0.5, windowHeight * 0.4, 'Quick Restart', smallTextFont, skyTextColor);
                this.quickRestartText.fixedToCamera = true;

                if (mobile) {
                    this.quickRestartButton = game.add.button(windowWidth * 0.35, windowHeight * 0.4 - 12, 'rbutton', this.quickRestart, this, 1, 0, 2);

                } else {
                    this.quickRestartButton = game.add.sprite(windowWidth * 0.35, windowHeight * 0.4 - 12, 'rkey');
                    this.rkey = game.input.keyboard.addKey(Phaser.Keyboard.R);
                    this.rkey.onDown.add(this.quickRestart, this);
                }

                this.quickRestartButton.fixedToCamera = true;
            }
        }
        
        this.gameOverTimer += delta;

        if (this.gameOverTimer >= this.gameOverWaitTime && !this.transitioning) {
            this.transitionOff();
        }
    }
};

GameplayScreen.prototype.render = function () {
    
};

function endGameOverTween() {
    tweener.destroy();
    updateState = true;
}