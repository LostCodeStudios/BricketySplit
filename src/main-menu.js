//TODO the Main menu is 100% temporary

function MainMenu() {
    
    var titleX1 = windowWidth * 0.45;
    var titleY1 = windowHeight * 0.1;
    var title1 = 'Brickety  ';
    
    var titleX2 = windowWidth * 0.5;
    var titleY2 = titleY1 + 72;
    var title2 = 'Split  ';

    var playButtonX = 192;
    var playButtonY = 224; //256 - 32;
    
    this.show = function(oldState) {
        if (oldState) {
            //transition on from above
            this.backdrop = game.add.sprite(0, -windowHeight, 'backdrop');

            this.backdropTween = game.add.tween(this.backdrop).to({y: 0}, 500, menuEasing, true);
            if (oldState instanceof HighScoreScreen) oldState.setNewState(this);

            this.titleText1 = game.add.text(titleX1, titleY1 - windowHeight, title1, new Style(titleFont, titleColor, true));
            this.titleText1.anchor.set(0.5, 0);
            game.add.tween(this.titleText1).to({y: titleY1}, 500, menuEasing, true);

            this.titleText2 = game.add.text(titleX2, titleY2 - windowHeight, title2, new Style(titleFont, titleColor, true));
            this.titleText1.anchor.set(0.5, 0);
            game.add.tween(this.titleText2).to({y: titleY2}, 500, menuEasing, true);

            this.playButton = game.add.button(playButtonX, playButtonY - windowHeight, 'playbutton', playKeyPressed, this, 1, 0, 2);
            game.add.tween(this.playButton).to({y: playButtonY}, 500, menuEasing, true);

            AddLabelShadow(this.titleText1, 10, 10, '#000000', 7);
            AddLabelShadow(this.titleText2, 10, 10, '#000000', 7);
        } else {
            //simply appear
            this.backdrop = game.add.sprite(0, 0, 'backdrop');

            this.titleText1 = game.add.text(titleX1, titleY1, title1, new Style(titleFont, titleColor, true));
            this.titleText1.anchor.set(0.5, 0);
            this.titleText2 = game.add.text(titleX2, titleY2, title2, new Style(titleFont, titleColor, true));
            this.titleText1.anchor.set(0.5, 0);

            this.playButton = game.add.button(playButtonX, playButtonY, 'playbutton', playKeyPressed, this, 1, 0, 2);

            AddLabelShadow(this.titleText1, 10, 10, '#000000', 7);
            AddLabelShadow(this.titleText2, 10, 10, '#000000', 7);

        }
    
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

        this.playButton.inputEnabled = false;
        game.add.tween(this.playButton).to({y: playButtonY - windowHeight}, 500, menuEasing, true);
        
    };

    this.destroy = function() {
        this.titleText1.destroy();
        this.titleText2.destroy();
        this.backdrop.destroy();
        this.playButton.destroy();
    };
    
    function playKeyPressed() {
        setState(new GameplayScreen());
    }
    
    this.update = function (delta) {
        
    };
    
    this.render = function () {
        
    };
    
}