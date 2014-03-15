function GameplayScreen() {
    
    this.show = function () {
        this.world = new World();
    };
    
    this.hide = function (newState) {
        this.world.destroy();
    };
    
    this.update = function (delta) {
        this.world.update(delta);
    };
    
    this.render = function () {
        
    };
    
}