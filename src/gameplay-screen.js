function GameplayScreen() {
    this.gameOverWaitTime = 2000;
    this.newRecord = -1;
    
    this.show = function () {
        this.world = new World();
        this.gameOverTimer = 0;
    };
    
    this.hide = function (newState) {
        this.world.destroy();
        
        if (this.gameOverText) {
            this.gameOverText.destroy();
        }
    };
    
    this.update = function (delta) {
        this.world.update(delta);
        
        if (this.world.gameOver()) {           
            if (!this.gameOverText) {
                this.gameOverText = MakeCenteredLabel(windowWidth / 2, windowHeight * 0.3, 'GAME OVER', mediumTextFont, '#FF0000');
                
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
            
            if (this.gameOverTimer >= this.gameOverWaitTime) {
                setState(new HighScoreScreen(this.newRecord));
            }
        }
    };
    
    this.render = function () {
        
    };
    
}