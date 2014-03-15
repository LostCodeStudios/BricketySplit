function MainMenu() {
    
    var titleX = width / 2;
    var titleY = height / 5;
    var titleFont = '32px Arial';
    var titleFill = '#FF0000';
    var title = 'Brickety Split';
    var titleText;
    
    var msgX = width / 2;
    var msgY = height / 2;
    var msgFont = '24px Arial';
    var msgFill = '#FF0000';
    var msg = 'Press SPACE to play.';
    var msgText;
    
    var playKey;
    
    this.show = function() {
        this.titleText = MakeCenteredLabel(titleX, titleY, title, titleFont, titleFill);
        this.msgText = MakeCenteredLabel(msgX, msgY, msg, msgFont, msgFill);
        
        game.input.keyboard.addKeyCapture(Phaser.Keyboard.SPACEBAR);
        this.playKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        this.playKey.onDown.add(playKeyPressed, this);
    };
    
    this.hide = function (newState) {
        this.titleText.destroy();
        this.msgText.destroy();
        
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