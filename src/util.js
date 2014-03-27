function randPos(min, max) {
    var dif = max - min;
    
    return min + Math.random() * dif;
}

function lerp(min, max, progress) {
    var dif = max - min;
    
    return min + progress * dif;
}

function percent(chance) {
    return Math.random() < chance;
}

function playSound(sound) {
    sound.play('', 0, soundVolume);
}