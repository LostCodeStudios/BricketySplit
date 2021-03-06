function randPos(min, max) {
    var dif = max - min;
    
    return min + Math.random() * dif;
}

function randInt(max) {
	return Math.floor(Math.random() * max);
}

function lerp(min, max, progress) {
    var dif = max - min;
    
    return min + progress * dif;
}

function percent(chance) {
    return Math.random() < chance;
}

var soundVolume = 1;
var volumeInc = 0.2;

function loadSoundVolume() {
	if (localStorage.getItem('volume') === null) {
		localStorage.setItem('volume', '1.0');
	}

	soundVolume = parseFloat(localStorage.getItem('volume'));
}

var particles = true;

function loadParticleSettings() {
	if (localStorage.getItem('particles') === null) {
		var enabled = (mobile ? 'false' : 'true');

		localStorage.setItem('particles', enabled);
	}

	particles = localStorage.getItem('particles') === 'true';
}

function enableParticles() {
	localStorage.setItem('particles', 'true');
	particles = true;
}

function disableParticles() {
	localStorage.setItem('particles', 'false');
	particles = false;
}

function setSoundVolume(volume) {
	localStorage.setItem('volume', '' + volume);

	soundVolume = volume;
}

function incVolume() {
	setSoundVolume(strip(soundVolume + volumeInc));
}

function decVolume() {
	setSoundVolume(strip(soundVolume - volumeInc));
}

function playSound(sound) {
    sound.play('', 0, soundVolume);
}

function strip(number) {
	return (parseFloat(number.toPrecision(2)));
}