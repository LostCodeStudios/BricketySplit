function Wall(width) {
    
    this.width = width;
    this.height = 0;
    this.currentRow = 1;
    
    //Lane management
    this.lanes = new Array(width);
    
    this.rightHalfBrickFallen = false;
    
    for (var i = 0; i <= width; i++) {
        this.lanes[i] = 0; //each lane starts with height 0
    }
    
    this.isOffset = function (lane) {
        return this.lanes[lane] % 2 == 1;
    };
    
    this.supportingLane = function (lane) {
        return this.isOffset(lane) ? lane - 1 : lane + 1;
    };
    
    this.addBrick = function (lane) {            
        this.lanes[lane]++;

        if (lane == this.width - 1 && this.isOffset(lane)) {
            this.lanes[this.width]++; console.log('increasing the edge lane height');//increment right edge lane
        }
        
        var rowComplete = true;
        for (var i = 0; i <= this.width; i++) {
            if (this.lanes[i] < this.currentRow) {
                rowComplete = false;
            }
        }
        if (rowComplete) {
            this.isRowComplete = true; console.log('A row was completed');
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
    }
    
    this.canBrickFall = function (lane) {    
        if (this.lanes[lane] == 0 && lane < this.width) {
            console.log('Dropping brick in lane ' + lane + ' because it will fall on the ground');
            return true;
        }
        
        var supportingLane = this.supportingLane(lane);

        if (supportingLane < 0) {
            console.log('Dropping brick in lane ' + lane + ' because it is in the first lane');
            return true;
        }
        
        return (this.lanes[supportingLane] >= this.lanes[lane]);
    };
    
    this.nextLane = function () {
        var lane;
        
        do {
            lane = Math.floor(Math.random() * (this.width + 1));
            console.log('Checking lane ' + lane);
        } while (!this.canBrickFall(lane));
        
        return lane;
    };
}