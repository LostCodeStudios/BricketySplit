function Wall(width) {
    
    this.width = width;
    
    //Lane management
    this.lanes = new Array(width);
    
    //Brick containment
    this.bricks = new Array();
    
    for (var i = 0; i <= width; i++) {
        this.lanes[i] = 0; //each lane starts with height 0
    }
}

Wall.prototype.height = 0;
Wall.prototype.currentRow = 1;
Wall.prototype.bottomShowingRow = 1;
Wall.prototype.rightHalfBrickFallen = false;

Wall.prototype.isRowOffset = function (row) {
    return row % 2 == 1;
};

Wall.prototype.isOffset = function (lane) {
    return this.lanes[lane] % 2 == 1;
};

Wall.prototype.supportingLane = function (lane) {
    return this.isOffset(lane) ? lane - 1 : lane + 1;
};

Wall.prototype.addBrick = function (lane, brick) {
    if (this.bricks.length <= this.lanes[lane]) {
        this.bricks[this.bricks.length] = new Array(this.width); //add a new row to the brick array if necessary
    }

    this.bricks[this.lanes[lane]][lane] = brick; //store the brick in a 2D array.

    this.lanes[lane]++;

    if (lane == this.width - 1 && this.isOffset(lane)) {
        this.lanes[this.width]++;
    }
    
    var rowComplete = true;
    for (var i = 0; i <= this.width; i++) {
        if (this.lanes[i] < this.currentRow) {
            rowComplete = false;
        }
    }
    if (rowComplete) {
        this.isRowComplete = true;
        this.currentRow++;
    }
    
    if (this.lanes[lane] > this.height) {
        //height increased
        this.height++;
    }
};

Wall.prototype.rowCompleted = function () {
    if (this.isRowComplete) {
        this.isRowComplete = false;
        return true;
    }
    
    return false;
};

Wall.prototype.rowFinishedCurrent = function(row) {
    for (var i = 0; i <= this.width; i++) {
        if (this.lanes[i] < row) {
           // console.log('Lane ' + i + 'is not filled');
            return false;
        }
    }
    
    return true;
};

Wall.prototype.lowestLane = function() {
    var lowest = 0;
    
    for (var i = 0; i <= this.width; i++) {
        if (this.lanes[i] < lowest) {
            lowest = this.lanes[i];
        }
    }
    
    return lowest;
};

Wall.prototype.canBrickFall = function (lane) {    
    if (this.lanes[lane] == 0 && lane < this.width) {
        return true;
    }
    
    var supportingLane = this.supportingLane(lane);

    if (supportingLane < 0) {
        return true;
    }
    
    return (this.lanes[supportingLane] >= this.lanes[lane]);
};

Wall.prototype.nextLane = function () {
    var lane;
    
    do {
        lane = Math.floor(Math.random() * (this.width + 1));
    } while (!this.canBrickFall(lane));
    
    return lane;
};