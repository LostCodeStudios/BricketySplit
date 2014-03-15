function Wall(width) {
    
    this.height = 0;
    
    //Lane management
    this.lanes = new Array(width);
    
    for (var i = 0; i < width; i++) {
        this.lanes[i] = 0; //each lane starts with height 0
    }
    
    this.isOffset = function (lane) {
        return this.lanes[lane] % 2 == 1;
    }
    
    this.supportingLane = function (lane) {
        return this.isOffset(lane) ? lane + 1 : lane - 1;
    }
    
    this.addBrick = function (lane) {
        console.log('Dropping brick in lane ' + lane);
        
        this.lanes[lane]++;
        
        if (this.lanes[lane] > this.height) {
            //height increased
            this.height++;
        }
    }
    
    this.canBrickFall = function (lane) {
        console.log('Checking if brick can spawn in lane ' + lane);
        console.log('The lane is ' + (this.isOffset(lane) ? 'offset' : 'normal'));
        
        if (this.lanes[lane] == 0) {
            return true;
        }
        
        var supportingLane = this.supportingLane(lane);

        console.log('    Supporting lane: ' + supportingLane);
        
        if (supportingLane < 0 || supportingLane == this.lanes.length) {
            return true;
        }

        console.log('    supporting lane height: ' + this.lanes[supportingLane]);
        console.log('    this lane height: ' + this.lanes[lane]);
        
        return (this.lanes[supportingLane] >= this.lanes[lane]);
    }
    
    this.nextLane = function () {
        var lane;
        
        do {
            lane = Math.floor(Math.random() * this.lanes.length);
        } while (!this.canBrickFall(lane));
        
        return lane;
    }
}