var Pixel = function(x, y, maxSpeed, maxSize) {
	this.x = x;
	this.y = y;
	this.speed = Math.max(Math.random() * maxSpeed, 1);
	this.size = Math.max(Math.random() * maxSize, 5)
}

Pixel.prototype.reset = function(x, y, maxSpeed, maxSize) {
	Pixel.apply(this, arguments);
	return this
}

var PixelFactory = {

	getRandomPixel: function(w, h, maxSpeed, maxSize) {
		var coords = PixelFactory.getRandomPosition(w, h);
		return new Pixel(coords.x, coords.y, maxSpeed, maxSize)
	},

	getRandomPosition: function(w, h) {
		return {
			x: Math.floor(Math.random() * w),
			y: Math.floor(Math.random() * h)
		};
	}
}

var PixelDisplay = function(numPixels, maxPixelSpeed, maxPixelSize) {
	var self = this;

	this.pixelShape = 'square';
	this.travelStyle = 'down';
	this.numPixels = numPixels || 100;
	this.pixelMaxSpeed = maxPixelSpeed || 5;
	this.pixelMaxSize = maxPixelSize || 10;

	this.canvasElem = document.createElement('canvas');
	this.bufferCanvasElem = document.createElement('canvas');
	// this.backgroundCanvasElem = document.createElement('canvas');
	this.canvas = this.canvasElem.getContext('2d');
	this.buffer = this.bufferCanvasElem.getContext('2d');

	this.width;
	this.height;

	this.LivePixels = [];

	this.sourceImageUrl = 'charlie.png';
	this.imageSample = new Image();
	this.pixels = [];
	this.imageData;
	this.counter = 0;

	this.imageSample.onload = function(){
		self.height = this.height;
		self.width = this.width;
		console.log(PixelDisplay)

		self.canvasElem.height = self.bufferCanvasElem.height = this.height;
		self.canvasElem.width = self.bufferCanvasElem.width = this.width;
		self.render();
	}

	this.travelStyles = {
		'up': function(pixel) {
			pixel.y -= pixel.speed;
		},
		'down': function(pixel) {
			pixel.y += pixel.speed;
		},
		'left': function (pixel) {
			pixel.x -= pixel.speed;
		},
		'right': function (pixel) {
			pixel.x += pixel.speed;
		},
		'random': function (pixel) {
			var direction = Math.ceil(Math.random() * 4);
			switch(direction){
				case 1:
					pixel.y -= pixel.speed;
					// pixel.y -= Math.random() * self.speed;
					break;
				case 2:
					pixel.y += pixel.speed;
					// pixel.y += Math.random() * self.speed;
					break;
				case 3:
					pixel.x -= pixel.speed;
					// pixel.x -= Math.random() * self.speed;
					break;
				case 4:
					pixel.x += pixel.speed;
					// pixel.x += Math.random() * self.speed;
					break;
			}
		}
	}

	this.pixelShapes = {
		'circle': function(pixel){
			self.buffer.beginPath();
			self.buffer.fillStyle = self.getColor(pixel.x, pixel.y);
			self.buffer.arc(pixel.x, pixel.y, pixel.size, 0, Math.PI * 2, false);
			self.buffer.fill();
		},
		'square': function(pixel){
			self.buffer.fillStyle = self.getColor(pixel.x, pixel.y);
			self.buffer.fillRect(pixel.x, pixel.y, pixel.size, pixel.size);
		},
		// 'spinline': function (pixel) {
		// 	var tx = this.x, ty = this.y;
		// 	buffer.strokeStyle = getOgColor(this.x, this.y);
		// 	buffer.beginPath();
		// 	buffer.moveTo(this.x, this.y);
		// 	tx += Math.cos(mine.angle % 360) * pixel.speed;
		// 	ty += -Math.sin(mine.angle % 360) * pixel.speed;
		// 	buffer.lineTo(tx, ty);
		// 	buffer.lineWidth = this.r;
		// 	buffer.closePath();
		// },
		'hline': function (pixel) {
			var tx = pixel.x, ty = pixel.y;
			self.buffer.strokeStyle = self.getColor(pixel.x, pixel.y);
			self.buffer.beginPath();
			self.buffer.moveTo(pixel.x, pixel.y);
			tx += pixel.size;
			self.buffer.lineTo(tx, ty);
			self.buffer.lineWidth = pixel.speed;
			self.buffer.closePath();
			self.buffer.stroke();
		},
		'vline': function (pixel) {
			var tx = pixel.x, ty = pixel.y;
			self.buffer.strokeStyle = self.getColor(pixel.x, pixel.y);
			self.buffer.beginPath();
			self.buffer.moveTo(pixel.x, pixel.y);
			ty += pixel.size;
			self.buffer.lineTo(tx, ty);
			self.buffer.lineWidth = pixel.speed;
			self.buffer.stroke();
		},
		'zoom': function (pixel) {
			// self.buffer.drawImage(self.canvasElem,
						self.buffer.drawImage(self.imageSample,
				pixel.x,
				pixel.y,
				Math.max(pixel.size / 2, 5), Math.max(pixel.size / 2, 5),
				pixel.x, pixel.y,
				Math.max(pixel.size, 10), Math.max(pixel.size, 10));
		}
	}
}

PixelDisplay.prototype.getTravelStyle = function (style) {
	return self.travelStyles[style]
}

PixelDisplay.prototype.updatePixels = function () {
	var i,
		pixel,
		newPosition;

	for(i =0; i < this.numPixels; i++){
		pixel = this.LivePixels[i];
		if(this.isOnScreen(pixel)){
			this.travelStyles[this.travelStyle](pixel);
			this.pixelShapes[this.pixelShape](pixel);
		}else{
			newPosition = PixelFactory.getRandomPosition(this.width, this.height);
			pixel.reset(newPosition.x, newPosition.y, this.pixelMaxSpeed, this.pixelMaxSize);
		}// end if else
	}//end For loop
	this.canvas.drawImage(this.bufferCanvasElem, 0, 0);
}

PixelDisplay.prototype.getColor = function(x, y) {
	var base = (Math.floor(x) + Math.floor(y) * this.width) * 4;
	var c = {
		r: this.pixels[base + 0],
		g: this.pixels[base + 1],
		b: this.pixels[base + 2],
		a: this.pixels[base + 3]
	};

	return "rgb(" + c.r + "," + c.g + "," + c.b + ")";
}

PixelDisplay.prototype.isOnScreen = function(pixel){
	return (pixel.x >= 0 - this.pixelMaxSize) &&
			(pixel.y >= 0 - this.pixelMaxSize) &&
			(pixel.x <= this.width + this.pixelMaxSize) &&
			(pixel.y <= this.height + this.pixelMaxSize);
}

PixelDisplay.prototype.chooseFile = function(){
	document.getElementById('filepicker').click();
}


PixelDisplay.prototype.loop = function () {
	requestAnimationFrame(this.loop.bind(this));
	this.updatePixels();
}

PixelDisplay.prototype.render = function(){
	this.buffer.imageSmoothingEnabled = false;
	this.buffer.mozImageSmoothingEnabled = false;
	this.buffer.webkitImageSmoothingEnabled = false;
	this.buffer.msImageSmoothingEnabled = false;

	this.canvas.drawImage(this.imageSample, 0, 0);
	this.imageData = this.canvas.getImageData(0, 0, this.width, this.height);
	this.pixels = this.imageData.data;
	this.buffer.drawImage(this.imageSample, 0, 0);

	for(var i = 0; i < this.numPixels; i++){
		this.LivePixels.push(PixelFactory.getRandomPixel(this.width, this.height, this.pixelMaxSpeed, this.pixelMaxSize));
	}

	this.loop();

	document.getElementById('canvas').appendChild(this.canvasElem);
}

PixelDisplay.prototype._init = function () {
	this.imageSample.src = this.sourceImageUrl || 'charlie.png';
}
