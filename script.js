(function() {
	var lastTime = 0, vendors = ['webkit', 'moz'];
	for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
		window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
		window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame'] || window[vendors[x]+'CancelRequestAnimationFrame'];
	}
	if (!window.requestAnimationFrame)
		window.requestAnimationFrame = function(callback, element) {
			var currTime = new Date().getTime();
			var timeToCall = Math.max(0, 16 - (currTime - lastTime));
			var id = window.setTimeout(function() { callback(currTime + timeToCall); }, timeToCall);
			lastTime = currTime + timeToCall;
			return id;
		};
	if (!window.cancelAnimationFrame)
		window.cancelAnimationFrame = function(id) {
			clearTimeout(id);
		};
})();

var ctx = document.getElementById('canvas').getContext('2d'),
	scrolling = document.getElementById('scrolling'),
	display = document.getElementById('display'),
	twilight = [],
	character = {},
	score, failed, floor;

var pipes = {
	elmts: [],
	positions: [],
	remove: function () {
		if (this.elmts.length) {
			scrolling.removeChild(this.elmts.shift());
			this.positions.shift();
		}
	},
	add: function () {
		var p = document.createElement('img'),
			pos = Math.random() * 200 + 45 | 0;
		p.src = 'img/pipes.png';
		p.style.position = 'relative';
		p.style.top = -pos + 'px';
		this.elmts.push(scrolling.appendChild(p));
		this.positions.push(pos);
	}
};

for (var i = 0; i < 8; i++) {
	twilight[i] = new Image();
	twilight[i].src = 'img/' + i + '.png';
}
twilight.fail = new Image();
twilight.fail.src = 'img/fail.png';

function draw(frame) {
	if (frame >= 144) {
		display.innerHTML = ++score;
		frame = 0;
		pipes.remove();
	}
	if (!floor)	requestAnimationFrame(function () { draw(failed ? frame : frame + 2) });
	if (frame % 144 === 0) {
		pipes.add();
	}
	if (character.pos < 0) {
		character.spd = 0;
	}
	if (character.pos >= 360) {
		failed = true;
		floor = true;
		character.acc = 0;
		character.spd = 0;
		character.pos = 360;
	}
	else if (frame > 62 && (character.pos + pipes.positions[1] < 290 || character.pos + pipes.positions[1] > 386)) {
		failed = true;
	}
	character.spd += character.acc;
	character.pos += character.spd;
	ctx.clearRect(0, 0, 288, 386);
	ctx.drawImage(twilight[failed ? 'fail' : frame >> 2 & 7], 52, character.pos);
	scrolling.style.left = (-144 - frame) + 'px';
}

function gameStart() {
	character = {pos: 178, spd: 0, acc: 65 / 192};
	display.innerHTML = score = 0;
	failed = false;
	floor = false;
	while (pipes.elmts.length !== 0) {
		pipes.remove();
	}
	pipes.add();
	pipes.elmts[0].style.visibility = 'hidden';
	draw(-144);
}

window.onkeydown = function (e) {
	if (e.keyCode === 82) {
		gameStart();
	}
	else if (!failed) {
		character.spd = -5;
	}
};

gameStart();
