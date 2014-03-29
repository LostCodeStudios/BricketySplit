function Wall(width) {
    
    this.width = width;
    this.height = 0;
    this.currentRow = 1;
    this.bottomShowingRow = 1;
    
    //Lane management
    this.lanes = new Array(width);
    
    //Brick containment
    this.bricks = new Array();

    this.rightHalfBrickFallen = false;
    
    for (var i = 0; i <= width; i++) {
        this.lanes[i] = 0; //each lane starts with height 0
    }
    
    this.isRowOffset = function (row) {
        return row % 2 == 1;
    };
    
    this.isOffset = function (lane) {
        return this.lanes[lane] % 2 == 1;
    };
    
    this.supportingLane = function (lane) {
        return this.isOffset(lane) ? lane - 1 : lane + 1;
    };
    
    this.addBrick = function (lane, brick) {
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
    
    this.rowCompleted = function () {
        if (this.isRowComplete) {
            this.isRowComplete = false;
            return true;
        }
        
        return false;
    };
    
    this.rowFinishedCurrent = function(row) {
        for (var i = 0; i <= this.width; i++) {
            if (!(this.lanes[i] == row)) return false;
        }
        
        return true;
    };
    
    this.lowestLane = function() {
        var lowest = 0;
        
        for (var i = 0; i <= this.width; i++) {
            if (this.lanes[i] < lowest) {
                lowest = this.lanes[i];
            }
        }
        
        return lowest;
    };
    
    this.canBrickFall = function (lane) {    
        if (this.lanes[lane] == 0 && lane < this.width) {
            return true;
        }
        
        var supportingLane = this.supportingLane(lane);

        if (supportingLane < 0) {
            return true;
        }
        
        return (this.lanes[supportingLane] >= this.lanes[lane]);
    };
    
    this.nextLane = function () {
        var lane;
        
        do {
            lane = Math.floor(Math.random() * (this.width + 1));
        } while (!this.canBrickFall(lane));
        
        return lane;
    };
}