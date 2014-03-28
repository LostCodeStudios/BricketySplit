var tutorialFont = '24px Bangers';
var tutorialTextSize = 24;

var tutorialTextX = windowWidth / 2;
var tutorialTextY = windowHeight / 3;

var tutorialText = [
    "",
    "This is Rick!",
    "",
    "Rick can jump!", // [Z]
    "",
    "He can run, too. He's pretty fast!", // [<>]
    "",
    
    "Rick builds walls, but the bricks fall by themselves.", //bricks start falling
    "",
    "It's the easiest job in the world! He just has to watch his head.",
    "",
    "Sometimes Rick's friends stop by.",    //enemy spawns from the right
    "",
    "Rick makes more friends as his wall gets taller.",
    "",

    "Rick likes to measure his improvement.",   //rick sees the first wall record
    "",
    "Rick could do this forever!"   //rick passes the first wall record
];

var pauseTime = 200;
var rickFallTime = 750;

var tutorialTimes = [
    rickFallTime,
    2500,
    pauseTime,
    5000,
    pauseTime,
    5000,
    pauseTime,
    
    4000,
    pauseTime,
    5000,
    Infinity,       //this one ends when the first enemy spawns
    5000,
    pauseTime,
    5500,
    pauseTime,
    
    5000,
    pauseTime,
    5000,
    pauseTime,
    4000
];

var introPhase = 1;
var jumpPhase = 3;
var runPhase = 5;
var brickFallPhase = 7;
var enemySpawnPhase = 10;
var lastPhase = 17;

var postEnemySpawnPhaseTime = 0;
function timeTill(phase) {
    var time = 0;
    
    if (phase <= enemySpawnPhase) {
        for (var i = 0; i < phase; i++) {
            time += tutorialTimes[i];
        }
    } else {
        time = postEnemySpawnPhaseTime;
        
        for (var i = enemySpawnPhase + 1; i < phase; i++) {
            time += tutorialTimes[i];
        }
    }
    
    return time;
}
         
 var tutorialBrickFallDelay = timeTill(brickFallPhase);