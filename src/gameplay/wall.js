function Wall(width) {
    
    this.width = width;
    this.height = 0;
    
    //Lane management
    this.lanes = new Array(width);
    
    this.rightHalfBrickFallen = false;
    
    for (var i = 0; i < width; i++) {
        this.lanes[i] = 0; //each lane starts with height 0
    }
    
    this.isOffset = function (lane) {
        return this.lanes[lane] % 2 == 1;
    }
    
    this.supportingLane = function (lane) {
        return this.isOffset(lane) ? lane - 1 : lane + 1;
    }
    
    this.addBrick = function (lane) {
        if (lane == this.width) {
            this.rightHalfBrickFallen = true; console.log('The right half brick fell');
        }
        else {
            if (this.rightHalfBrickFallen && lane == this.width - 1 && !this.isOffset(lane)) {
                this.rightHalfBrickFallen = false; console.log('The right half brick can fall again');
            }
            
            this.lanes[lane]++;

            if (this.lanes[lane] > this.height) {
                //height increased
                this.height++;
            }
        }
    }
    
    this.canBrickFall = function (lane) {    
        if (this.lanes[lane] == 0 && lane < this.width) {
            return true;
        }
        
        var supportingLane = this.supportingLane(lane);

        if (supportingLane < 0) {
            return true;
        }
        
        if (lane == this.width && this.isOffset(lane - 1)) {
            console.log('Checking if the right half brick should fall');
            return !this.rightHalfBrickFallen;
        }
        
        if (lane == this.width - 1 && !this.isOffset(lane)) {
            return this.rightHalfBrickFallen;
        }
        
        return (this.lanes[supportingLane] >= this.lanes[lane]);
    }
    
    this.nextLane = function () {
        var lane;
        
        do {
            lane = Math.floor(Math.random() * (this.width + 1));
        } while (!this.canBrickFall(lane));
        
        return lane;
    }
}