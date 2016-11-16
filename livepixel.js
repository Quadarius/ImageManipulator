var livePixel = function (){
	var self = this;

	this.mode = '0'
	this.pixelshape = 'hline';
	this.travelstyle = 'down';
	this.trail = true;
	this.background = true;
	this.noiseScale = 200;
	this.noiseStrength = 32;
	this.reverse = false;

	this.numPixels = 300
	this.threshold = 128;
	this.init = function(){
		_init();
	}
	this.chooseFile = function(){
		document.getElementById('filepicker').click();
	}
	this.source = 'heic0307g.jpg';
	this.maxSize = 10;
	this.speed = 3;
	this.growthRate = 0;
	this.clear = function(){
		og.clearRect(0, 0, width, height);
	}

	var img = new Image(),
		ogImg = new Image(),
		height, width,
		source;

	var canvas = document.createElement('canvas'),
		og = canvas.getContext('2d');

	var sdCanvas = document.createElement('canvas'),
		sd = sdCanvas.getContext('2d');

	var pixels = [], imageData;
	var bitmap = [], bImageData;

	var livePixels = [];
	var counter = 0;

	function _init(){
		setup();
		// return canvas;
		document.getElementById('canvas').appendChild(canvas);
	}

	function setup(){
		livePixels = [];
		img.onload = function(){
			height = img.height;
			width = img.width;

			canvas.height = sdCanvas.height = height;
			canvas.width = sdCanvas.width = width;

			draw(this, self.mode);
		}

		img.src = ogImg.src = self.source || 'heic0307g.jpg';
	}

	function draw(img, mode){
		if(self.background){
			og.drawImage(ogImg, 0, 0);
		} else {
			og.rect(0, 0, width, height);
			og.fill()
		}
		sd.drawImage(ogImg, 0, 0);
		pixels = sd.getImageData(0, 0, width, height).data;
		bImageData = og.getImageData(0, 0, width, height);
		bImageData = threshold(bImageData);
		og.putImageData(bImageData, 0, 0);

		switch (mode){
			case '0':
				livePixel(img);
				break;

			default:
		}
	}


	function generatePixels(){
		for(var i = 0; i < self.numPixels; i++){
			livePixels.push(new Pixel(Math.random() * width, Math.random() * height));
		}
	}

	function threshold(px){
		 var d = px.data;
		for (var i=0; i<d.length; i+=4) {
			var r = d[i];
			var g = d[i+1];
			var b = d[i+2];
			var v = (0.2126*r + 0.7152*g + 0.0722*b >= self.threshold) ? 255 : 0;
			d[i] = d[i+1] = d[i+2] = v
		}

		return px;
	}

	function livePixel(im){
		generatePixels();
		createBitmap(im);
		loop();
	}

	function createBitmap(img) {
		var imageData = og.getImageData(0, 0, width, height);
		bitmap = threshold(imageData, 128).data;
	};

	function render() {
		if(!self.trail) {
			og.clearRect(0, 0, width, height);
			//og.drawImage(ogImg, 0, 0);
		};
		og.globalCompositeOperation = "darker";

		for (var i = 0; i < livePixels.length; i++) {
			livePixels[i].render();
		}
	};

	function loop(){
		requestAnimationFrame(loop);
		render();
	}

	function getColor(x, y) {
		var base = (Math.floor(x) + Math.floor(y) * width) * 4;
		var c = {
			r: bitmap[base + 0],
			g: bitmap[base + 1],
			b: bitmap[base + 2],
			a: bitmap[base + 3]
		};

		return "rgb(" + c.r + "," + c.g + "," + c.b + ")";
	};

	function getOgColor(x, y) {
		var base = (Math.floor(x) + Math.floor(y) * width) * 4;
		var c = {
			r: pixels[base + 0],
			g: pixels[base + 1],
			b: pixels[base + 2],
			a: pixels[base + 3]
		};

		return "rgb(" + c.r + "," + c.g + "," + c.b + ")";
	};

	function Pixel(x, y, c) {
		this.x = x;
		this.y = y;

		this.r = Math.random() * self.maxSize;
		this.angle = Math.random() * 360;
		this.grow = (this.r > self.maxSize/2 ? true : false);

		this.color = getOgColor(this.x, this.y);

		this.render = function () {
			var c = getColor(this.x, this.y);

			var onScreen = this.x >= 0 && this.x <= width &&
				this.y >= 0 && this.y <= height;

			var isBlack = c != "rgb(255,255,255)" && onScreen;

			if (onScreen) {
				// update the pixel size
				if(this.r >= self.maxSize){
					this.grow = false;
				}else if(this.r <= 0){
					this.grow = true;
				}
				if(this.grow){
					this.r += self.growthRate;
				}else{
					this.r -= self.growthRate;
				}

				// update the pixels position
				switch(self.travelstyle){
					case 'up':
						this.y -= self.speed;
						break;
					case 'down':
						this.y += self.speed;
						break;
					case 'left':
						this.x -= Math.random() * self.speed;
						break;
					case 'right':
						this.x += Math.random() * self.speed;
						break;
					case 'random':
						this.x = Math.random() * width;
						this.y = Math.random() * height;
						break;
				}

				// draw the pixel shape
				switch(self.pixelshape){
					case 'circle':
						og.fillStyle = getOgColor(this.x, this.y);
						og.beginPath();
						og.arc(this.x, this.y, this.r, 0, Math.PI * 2, false);
						og.fill();
						break;
					case 'square':
						og.fillStyle = getOgColor(this.x, this.y);
						og.beginPath();
						og.rect(this.x, this.y, this.r, this.r);
						og.fill();
						break;
					case 'spinline':
						var tx = this.x, ty = this.y;
						og.strokeStyle = getOgColor(this.x, this.y);
						og.beginPath();
						og.moveTo(this.x, this.y);
						tx += Math.cos(this.angle % 360) * self.speed;
						ty += -Math.sin(this.angle % 360) * self.speed;
						og.lineTo(tx, ty);
						og.lineWidth = this.r;
						og.stroke();
						this.angle += self.growthRate;
						break;
					case 'hline':
						var tx = this.x, ty = this.y;
						og.strokeStyle = getOgColor(this.x, this.y);
						og.beginPath();
						og.moveTo(this.x, this.y);
						tx += this.r;
						og.lineTo(tx, ty);
						og.lineWidth = self.speed;
						og.stroke();
						break;
					case 'vline':
						var tx = this.x, ty = this.y;
						og.strokeStyle = getOgColor(this.x, this.y);
						og.beginPath();
						og.moveTo(this.x, this.y);
						ty += this.r;
						og.lineTo(tx, ty);
						og.lineWidth = self.speed;
						og.stroke();
						break;
				}
			}else {
				if(this.x > width){
					this.x = 0;
				}else if(this.x < 0){
					this.x = width;
				}
				if(this.y > height){
					this.y = 0;
				}else if(this.y < 0){
					this.y = height;
				}
			}
		}
	}

}