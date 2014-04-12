function GameplayScreen(skipIntro) {
    this.gameOverWaitTime = 2000;
    this.newRecord = -1;
    
    this.show = function (oldState) {
        this.world = new World(skipIntro);
        this.gameOverTimer = 0;
    };
    
    this.hide = function (newState) {

    };

    this.transitionOff = function() {
        updateState = false; 
       // console.log('Transitioning off');

        this.transitioning = true;

        screenToDestroy = this;
        tweener = game.add.sprite(-800, topBounds, 'backdrop');
        var tween = game.add.tween(tweener).to({x: 800}, 1250, menuEasing, true);

        tween.onUpdateCallback(this.tweenUpdate);
        tween.onComplete.add(endGameOverTween, null);
    };
    
    this.tweenUpdate = function () {
       // console.log('Updating tween');

        if (tweener.x > 0 && !tweener.halfway) {
            //more than halfway
            tweener.halfway = true;

            screenToDestroy.world.destroy();
        
            if (screenToDestroy.gameOverText) {
                screenToDestroy.gameOverText.destroy();
            }

            if (tutorial()) {
                setState(new GameplayScreen(screenToDestroy.skipIntro));
            } else {
                setState(new HighScoreScreen(screenToDestroy.newRecord));
            }

            tweener.bringToTop();
        } else if (tweener.halfway) {
            //push to front to cover new stuff
            tweener.bringToTop();
        }
    };

    this.update = function (delta) {
        this.world.update(delta);
        
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
            }
            
            this.gameOverTimer += delta;

            if (this.gameOverTimer >= this.gameOverWaitTime && !this.transitioning) {
                this.transitionOff();
            }
        }
    };
    
    this.render = function () {
        
    };
    
}

function endGameOverTween() {
    tweener.destroy();
    updateState = true;
}