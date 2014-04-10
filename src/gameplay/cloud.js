var cloudNum = 4;

var minCloudSpeed = 10;
var maxCloudSpeed = 30;

var minCloudX = windowWidth / 4;
var maxCloudX = windowWidth - minCloudX;
var maxCloudSpacingX = (maxCloudX - minCloudX) / cloudNum * 2;
var minCloudSpacingX = maxCloudSpacingX / 8;

var minCloudY = 5;
var maxCloudY = windowHeight / 7;
var maxCloudSpacingY = (maxCloudY - minCloudY) / cloudNum * 2;
var minCloudSpacingY = maxCloudSpacingY / 8;


function Cloud(x, y) {
	this.sprite = game.add.sprite(x, y, 'cloud');

	game.physics.arcade.enable(this.sprite);
	this.sprite.body.gravity.y = 0;

	this.sprite.body.velocity.x = randPos(minCloudSpeed, maxCloudSpeed);

	this.destroy = function () {
		this.sprite.body = null;
		this.sprite.destroy();
	};

	this.update = function () {
		if (this.sprite.body.x > windowWidth) {
			//off to the right
			this.sprite.body.x = -this.sprite.width; //so wrap to the other side!
		}
	};
}

function makeClouds(world) {
	world.clouds = new Array();

	var xPositions = new Array();

	var xPos = minCloudX;
	for (var i = 0; i < cloudNum; i++) {
		xPos += randPos(minCloudSpacingX, maxCloudSpacingX);

		xPositions[i] = xPos; //choose the x positions
	}

	var yPositions = new Array();

	var yPos = minCloudY;
	for (var i = 0; i < cloudNum; i++) {
		yPos += randPos(minCloudSpacingY, maxCloudSpacingY);

		yPositions[i] = yPos; //choose the y positions
	}

	for (var i = 0; i < cloudNum; i++) {
		//make a cloud with random xPos, yPos

		var xIdx = randInt(xPositions.length);
		var yIdx = randInt(yPositions.length);

		world.clouds[i] = new Cloud(xPositions[xIdx], yPositions[yIdx]);

		xPositions.splice(xIdx, 1); //remove the used positions to avoid repetition
		yPositions.splice(yIdx, 1);
	}
}

function updateClouds(world) {
	for (var i = 0; i < world.clouds.length; i++) {
		var cloud = world.clouds[i];
		cloud.update();
	}
}

function destroyClouds(world) {
	for (var i = 0; i < world.clouds.length; i++) {
		var cloud = world.clouds[i];
		cloud.destroy();
	}
}