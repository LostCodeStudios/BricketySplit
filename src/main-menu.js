//TODO the Main menu is 100% temporary

function MainMenu() {
    
    var titleX1 = windowWidth * 0.45;
    var titleY1 = windowHeight * 0.2;
    var title1 = 'Brickety';
    
    var titleX2 = windowWidth * 0.6;
    var titleY2 = windowHeight * 0.35;
    var title2 = 'Split';
    
    var msgX = windowWidth * 0.5;
    var msgY = windowHeight * 0.7;
    var msg = 'Press SPACE to play.';
    
    this.show = function(oldState) {
        if (oldState) {
            //transition on from above
            this.backdrop = game.add.sprite(0, 0, 'backdrop');
            this.backdrop.y -= this.backdrop.height;

            game.add.tween(this.backdrop).to({y: 0}, 500, menuEasing, true);

            this.titleText1 = MakeCenteredLabel(titleX1, titleY1 - windowHeight, title1, titleFont, titleColor);
            game.add.tween(this.titleText1).to({y: titleY1}, 500, menuEasing, true);

            this.titleText2 = MakeCenteredLabel(titleX2, titleY2 - windowHeight, title2, titleFont, titleColor);
            game.add.tween(this.titleText2).to({y: titleY2}, 500, menuEasing, true);

            AddLabelShadow(this.titleText1, 10, 10, '#000000', 7);
            AddLabelShadow(this.titleText2, 10, 10, '#000000', 7);
        } else {
            //simply appear
            this.backdrop = game.add.sprite(0, 0, 'backdrop');

            this.titleText1 = MakeCenteredLabel(titleX1, titleY1, title1, titleFont, titleColor);
            this.titleText2 = MakeCenteredLabel(titleX2, titleY2, title2, titleFont, titleColor);

            AddLabelShadow(this.titleText1, 10, 10, '#000000', 7);
            AddLabelShadow(this.titleText2, 10, 10, '#000000', 7);

        }
    
        this.msgText = MakeCenteredLabel(msgX, msgY, msg, mediumTextFont, titleColor);
        
        game.input.keyboard.addKeyCapture(Phaser.Keyboard.SPACEBAR);
        this.playKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        this.playKey.onDown.add(playKeyPressed, this);
        
        game.input.onDown.add(playKeyPressed, this);
    };
    
    this.hide = function (newState) {
        //tween upwards
        var tween = game.add.tween(this.backdrop);
        tween.to({y: -this.backdrop.height}, 500, menuEasing, true);
        
        tween.onComplete.add(this.destroy, this);

        var y = this.titleText1.y - this.backdrop.height;
        game.add.tween(this.titleText1).to({y: y}, 500, menuEasing, true);

        y = this.titleText2.y - this.backdrop.height;
        game.add.tween(this.titleText2).to({y: y}, 500, menuEasing, true);

        y = this.msgText.y - this.backdrop.height;
        game.add.tween(this.msgText).to({y: y}, 500, menuEasing, true);

        game.input.onDown.remove(playKeyPressed, this);
        game.input.keyboard.removeKey(Phaser.Keyboard.SPACEBAR);
        game.input.keyboard.removeKeyCapture(Phaser.Keyboard.SPACEBAR);
    };

    this.destroy = function() {
        this.titleText1.destroy();
        this.titleText2.destroy();
        this.msgText.destroy();
        this.backdrop.destroy();
    };
    
    function playKeyPressed() {
        setState(new GameplayScreen());
    }
    
    this.update = function (delta) {
        
    };
    
    this.render = function () {
        
    };
    
}