function MainMenu() {
}

MainMenu.prototype.titleX1 = windowWidth * 0.45;
MainMenu.prototype.titleY1 = windowHeight * 0.1;
MainMenu.prototype.title1 = 'Brickety  ';

MainMenu.prototype.titleX2 = windowWidth * 0.5;
MainMenu.prototype.titleY2 = MainMenu.prototype.titleY1 + 72;
MainMenu.prototype.title2 = 'Split  ';

MainMenu.prototype.playButtonX = 96;
MainMenu.prototype.playButtonY = 224;

MainMenu.prototype.scoreButtonX = 384;
MainMenu.prototype.scoreButtonY = 288;

MainMenu.prototype.optionsButtonX = 48;
MainMenu.prototype.optionsButtonY = 320;

MainMenu.prototype.creditsButtonX = 700;
MainMenu.prototype.creditsButtonY = 30;

MainMenu.prototype.playKeyPressed = function () {
    setState(new GameplayScreen());
};

MainMenu.prototype.scoreButtonPressed = function () {
    setState(new HighScoreScreen(-1));
};

MainMenu.prototype.creditsButtonPressed = function () {
    //roll credits
    setState(new CreditsScreen());
};

MainMenu.prototype.optionsButtonPressed = function () {
    //open the options menu
    setState(new OptionsScreen());
};

MainMenu.prototype.show = function(oldState) {
    if (oldState) {
        this.oldState = oldState;

        //transition on from above
        this.backdrop = game.add.sprite(0, -windowHeight, 'backdrop');

        this.backdropTween = game.add.tween(this.backdrop).to({y: 0}, 500, menuEasing, true);
        this.backdropTween.onComplete.add(this.tweenFinishedCallback, this);

        if (oldState instanceof HighScoreScreen) oldState.setNewState(this);

        this.titleText1 = game.add.text(this.titleX1, this.titleY1 - windowHeight, this.title1, new Style(titleFont, titleColor, true));
        this.titleText1.anchor.set(0.5, 0);
        game.add.tween(this.titleText1).to({y: this.titleY1}, 500, menuEasing, true);

        this.titleText2 = game.add.text(this.titleX2, this.titleY2 - windowHeight, this.title2, new Style(titleFont, titleColor, true));
        this.titleText1.anchor.set(0.5, 0);
        game.add.tween(this.titleText2).to({y: this.titleY2}, 500, menuEasing, true);

        this.playButton = game.add.button(this.playButtonX, this.playButtonY - windowHeight, 'playbutton', this.playKeyPressed, this, 1, 0, 2);
        game.add.tween(this.playButton).to({y: this.playButtonY}, 500, menuEasing, true);

        this.scoreButton = game.add.button(this.scoreButtonX, this.scoreButtonY - windowHeight, 'scorebutton', this.scoreButtonPressed, this, 1, 0, 2);
        game.add.tween(this.scoreButton).to({y: this.scoreButtonY}, 500, menuEasing, true);

        this.optionsButton = game.add.button(this.optionsButtonX, this.optionsButtonY - windowHeight, 'optionsbutton', this.optionsButtonPressed, this, 1, 0, 2);
        game.add.tween(this.optionsButton).to({y: this.optionsButtonY}, 500, menuEasing, true);

        this.creditsButton = game.add.button(this.creditsButtonX, this.creditsButtonY - windowHeight, 'creditsbutton', this.creditsButtonPressed, this, 1, 0, 2);
        game.add.tween(this.creditsButton).to({y: this.creditsButtonY}, 500, menuEasing, true);

        AddLabelShadow(this.titleText1, 10, 10, '#000000', 7);
        AddLabelShadow(this.titleText2, 10, 10, '#000000', 7);
    } else {
        //simply appear
        this.backdrop = game.add.sprite(0, 0, 'backdrop');

        this.titleText1 = game.add.text(this.titleX1, this.titleY1, this.title1, new Style(titleFont, titleColor, true));
        this.titleText1.anchor.set(0.5, 0);
        this.titleText2 = game.add.text(this.titleX2, this.titleY2, this.title2, new Style(titleFont, titleColor, true));
        this.titleText1.anchor.set(0.5, 0);

        this.playButton = game.add.button(this.playButtonX, this.playButtonY, 'playbutton', this.playKeyPressed, this, 1, 0, 2);
        this.scoreButton = game.add.button(this.scoreButtonX, this.scoreButtonY, 'scorebutton', this.scoreButtonPressed, this, 1, 0, 2);
        this.optionsButton = game.add.button(this.optionsButtonX, this.optionsButtonY, 'optionsbutton', this.optionsButtonPressed, this, 1, 0, 2);

        this.creditsButton = game.add.button(this.creditsButtonX, this.creditsButtonY, 'creditsbutton', this.creditsButtonPressed, this, 1, 0, 2);

        AddLabelShadow(this.titleText1, 10, 10, '#000000', 7);
        AddLabelShadow(this.titleText2, 10, 10, '#000000', 7);

    }

};

MainMenu.prototype.tweenFinishedCallback = function () {
    this.oldState.destroy();
};

MainMenu.prototype.hide = function (newState) {
    //tween upwards
    var tween = game.add.tween(this.backdrop);
    tween.to({y: -this.backdrop.height}, 500, menuEasing, true);

    tween.onComplete.add(this.destroy, this);

    var y = this.titleText1.y - this.backdrop.height;
    game.add.tween(this.titleText1).to({y: y}, 500, menuEasing, true);

    y = this.titleText2.y - this.backdrop.height;
    game.add.tween(this.titleText2).to({y: y}, 500, menuEasing, true);

    this.playButton.inputEnabled = false;
    game.add.tween(this.playButton).to({y: this.playButtonY - windowHeight}, 500, menuEasing, true);
    
    this.scoreButton.inputEnabled = false;
    game.add.tween(this.scoreButton).to({y: this.scoreButtonY - windowHeight}, 500, menuEasing, true);

    this.creditsButton.inputEnabled = false;
    game.add.tween(this.creditsButton).to({y: this.creditsButtonY - windowHeight}, 500, menuEasing, true);

    this.optionsButton.inputEnabled = false;
    game.add.tween(this.optionsButton).to({y: this.optionsButtonY - windowHeight}, 500, menuEasing, true);
};

MainMenu.prototype.destroy = function() {
    this.titleText1.destroy();
    this.titleText2.destroy();
    this.backdrop.destroy();
    this.playButton.destroy();
    this.scoreButton.destroy();
    this.creditsButton.destroy();
    this.optionsButton.destroy();
};

MainMenu.prototype.update = function (delta) {
    
};

MainMenu.prototype.render = function () {
    
};