var tutorialFont = '24px Bangers';
var tutorialTextSize = 24;

var tutorialTextX = windowWidth / 2;
var tutorialTextY = windowHeight / 3;

var tutorialText = [
    "",
    "This is Rick!",
    "Rick can jump!", // [Z]
    "He can run, too. He's pretty fast!", // [<>]

    "Rick builds walls, but the bricks fall by themselves.", //bricks start falling
    "It's the easiest job in the world! He just has to watch his head.",
    "",
    "Sometimes Rick's friends stop by.",    //enemy spawns from the right
    "Rick makes more friends the taller his wall gets.",

    "Rick likes to measure his improvement.",   //rick sees the first wall record
    "",
    "Rick could do this forever!"   //rick passes the first wall record
];

var tutorialTimes = [
    750,
    2500,
    5000,
    5000,
    
    4000,
    5000,
    Infinity,       //this one ends when the first enemy spawns
    5000,
    5500,
    
    5000,
    5000,
    4000
];

var jumpPhase = 2;
var runPhase = 3;
var brickFallPhase = 4;
var enemySpawnPhase = 6;
var lastPhase = 11;

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
         
 var tutorialBrickFallDelay = timeTill(4);