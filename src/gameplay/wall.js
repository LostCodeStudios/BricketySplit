function Wall(width) {
    
    //Lane management
    this.lanes = new Array(width);
    
    for (var i = 0; i < width; i++) {
        this.lanes[i] = 0; //each lane starts with height 0
    }
    
    this.isOffset = function (lane) {
        return this.lanes[lane] % 2 == 1;
    }
    
    this.supportingLane = function (lane) {        
        return isOffset(this.lanes[lane]) ? lane - 1 : lane + 1;
    }
    
    this.addBrick = function (lane) {
        ++this.lanes[lane];
    }
    
    this.canBrickFall = function (lane) {
        if (this.lanes[lane] == 0) {
            return true;
        }
        
        var supportingLane = this.supportingLane(lane);

        if (supportingLane < 0 || supportingLane == this.lanes.length) {
            return true;
        }

        return (this.lanes[supportingLane] >= this.lanes[lane]);
    }
    
    this.row = 0; //the first row
}