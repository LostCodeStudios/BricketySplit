//TODO the Main menu is 100% temporary

function MainMenu() {
    
    var titleX1 = windowWidth * 0.45;
    var titleY1 = windowHeight * 0.1;
    var title1 = 'Brickety  ';
    
    var titleX2 = windowWidth * 0.5;
    var titleY2 = titleY1 + 72;
    var title2 = 'Split  ';

    var playButtonX = 96;
    var playButtonY = 224;
    
    var scoreButtonX = 384;
    var scoreButtonY = 288;

    var optionsButtonX = 48;
    var optionsButtonY = 320;

    var creditsButtonX = 700;
    var creditsButtonY = 30;

    this.show = function(oldState) {
        if (oldState) {
            this.oldState = oldState;

            //transition on from above
            this.backdrop = game.add.sprite(0, -windowHeight, 'backdrop');

            this.backdropTween = game.add.tween(this.backdrop).to({y: 0}, 500, menuEasing, true);
            this.backdropTween.onComplete.add(this.tweenFinishedCallback, this);

            if (oldState instanceof HighScoreScreen) oldState.setNewState(this);

            this.titleText1 = game.add.text(titleX1, titleY1 - windowHeight, title1, new Style(titleFont, titleColor, true));
            this.titleText1.anchor.set(0.5, 0);
            game.add.tween(this.titleText1).to({y: titleY1}, 500, menuEasing, true);

            this.titleText2 = game.add.text(titleX2, titleY2 - windowHeight, title2, new Style(titleFont, titleColor, true));
            this.titleText1.anchor.set(0.5, 0);
            game.add.tween(this.titleText2).to({y: titleY2}, 500, menuEasing, true);

            this.playButton = game.add.button(playButtonX, playButtonY - windowHeight, 'playbutton', playKeyPressed, this, 1, 0, 2);
            game.add.tween(this.playButton).to({y: playButtonY}, 500, menuEasing, true);

            this.scoreButton = game.add.button(scoreButtonX, scoreButtonY - windowHeight, 'scorebutton', scoreButtonPressed, this, 1, 0, 2);
            game.add.tween(this.scoreButton).to({y: scoreButtonY}, 500, menuEasing, true);

            this.optionsButton = game.add.button(optionsButtonX, optionsButtonY - windowHeight, 'optionsbutton', optionsButtonPressed, this, 1, 0, 2);
            game.add.tween(this.optionsButton).to({y: optionsButtonY}, 500, menuEasing, true);

            this.creditsButton = game.add.button(creditsButtonX, creditsButtonY - windowHeight, 'creditsbutton', creditsButtonPressed, this, 1, 0, 2);
            game.add.tween(this.creditsButton).to({y: creditsButtonY}, 500, menuEasing, true);

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
            this.scoreButton = game.add.button(scoreButtonX, scoreButtonY, 'scorebutton', scoreButtonPressed, this, 1, 0, 2);
            this.optionsButton = game.add.button(optionsButtonX, optionsButtonY, 'optionsbutton', optionsButtonPressed, this, 1, 0, 2);

            this.creditsButton = game.add.button(creditsButtonX, creditsButtonY, 'creditsbutton', creditsButtonPressed, this, 1, 0, 2);

            AddLabelShadow(this.titleText1, 10, 10, '#000000', 7);
            AddLabelShadow(this.titleText2, 10, 10, '#000000', 7);

        }
    
    };
    
    this.tweenFinishedCallback = function () {
        this.oldState.destroy();
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
        
        this.scoreButton.inputEnabled = false;
        game.add.tween(this.scoreButton).to({y: scoreButtonY - windowHeight}, 500, menuEasing, true);

        this.creditsButton.inputEnabled = false;
        game.add.tween(this.creditsButton).to({y: creditsButtonY - windowHeight}, 500, menuEasing, true);

        this.optionsButton.inputEnabled = false;
        game.add.tween(this.optionsButton).to({y: optionsButtonY - windowHeight}, 500, menuEasing, true);
    };

    this.destroy = function() {
        this.titleText1.destroy();
        this.titleText2.destroy();
        this.backdrop.destroy();
        this.playButton.destroy();
        this.scoreButton.destroy();
        this.creditsButton.destroy();
        this.optionsButton.destroy();
    };
    
    function playKeyPressed() {
        setState(new GameplayScreen());
    };
    
    function scoreButtonPressed() {
        setState(new HighScoreScreen(-1));
    };

    function creditsButtonPressed() {
        //roll credits
        setState(new CreditsScreen());
    };

    function optionsButtonPressed() {
        //open the options menu
        setState(new OptionsScreen());
    };

    this.update = function (delta) {
        
    };
    
    this.render = function () {
        
    };
    
}