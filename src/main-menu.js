//TODO the Main menu is 100% temporary

function MainMenu() {
    
    var titleFill = '#FF0000';
    
    var titleX1 = windowWidth * 0.45;
    var titleY1 = windowHeight * 0.2;
    var title1 = 'Brickety';
    
    var titleX2 = windowWidth * 0.6;
    var titleY2 = windowHeight * 0.35;
    var title2 = 'Split';
    
    var msgX = windowWidth / 2;
    var msgY = windowHeight / 2;
    var msgFill = '#FF0000';
    var msg = 'Press SPACE to play.';
    
    this.show = function() {
        this.titleText1 = MakeCenteredLabel(titleX1, titleY1, title1, titleFont, titleFill);
        this.titleText2 = MakeCenteredLabel(titleX2, titleY2, title2, titleFont, titleFill);
        
        this.msgText = MakeCenteredLabel(msgX, msgY, msg, mediumTextFont, msgFill);
        
        game.input.keyboard.addKeyCapture(Phaser.Keyboard.SPACEBAR);
        this.playKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        this.playKey.onDown.add(playKeyPressed, this);
        
        game.input.onDown.add(playKeyPressed, this);
    };
    
    this.hide = function (newState) {
        this.titleText1.destroy();
        this.titleText2.destroy();
        this.msgText.destroy();
        
        game.input.onDown.remove(playKeyPressed, this);
        game.input.keyboard.removeKey(Phaser.Keyboard.SPACEBAR);
        game.input.keyboard.removeKeyCapture(Phaser.Keyboard.SPACEBAR);
    };
    
    function playKeyPressed() {
        setState(new GameplayScreen());
    }
    
    this.update = function (delta) {
        
    };
    
    this.render = function () {
        
    };
    
}