function HighScoreScreen(newRecord) {
    
    this.newRecord = newRecord;
    console.log('New record: ' + newRecord);
    
    this.scoreText = new Array();
    
    this.show = function () {
        this.titleText = MakeCenteredLabel(windowWidth / 2, windowHeight * 0.1, 'Best Walls', '32px Arial', '#FF0000');
        
        var scores = JSON.parse(localStorage.getItem('Scores'));
        var y = windowHeight / 3;
        for (var i = 0; i < scores.length; i++) {
            this.scoreText[i] = MakeLabel(windowWidth / 9, y, '' + (i + 1) + '. ' + scores[i] + 'm', '24px Arial', '#FF0000');
            
            if (this.newRecord == i) {
                this.scoreText[i].text = '*' + this.scoreText[i].text;
            }
            
            y += 32;
        }
        
        this.helpText = MakeCenteredLabel(windowWidth / 2, windowHeight * 0.7, 'Press SPACE for menu', '24px Arial', '#FF0000');
        
        game.input.keyboard.addKeyCapture(Phaser.Keyboard.SPACEBAR);
        this.playKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        this.playKey.onDown.add(playKeyPressed, this);
        
        game.input.onDown.add(playKeyPressed, this);
    };
    
    this.hide = function () {
        game.world.removeAll();
        
        game.input.onDown.remove(playKeyPressed, this);
        game.input.keyboard.removeKey(Phaser.Keyboard.SPACEBAR);
        game.input.keyboard.removeKeyCapture(Phaser.Keyboard.SPACEBAR);
    };
    
    this.update = function (delta) {
    };
    
    this.render = function () {
    };
    
}

function playKeyPressed() {
    setState(new MainMenu());
}