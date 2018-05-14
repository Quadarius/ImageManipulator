export default function ImageCanvas(canvas, src) {
	var context = canvas.getContext('2d');
	var img = new Image();
	var self = this;
	img.onload = function () {
		canvas.height = img.height;
		canvas.width = img.width;
		canvas.style.height = img.height + "px";
		canvas.style.width = img.width + "px";
		context.drawImage(img, 0, 0, img.width, img.height);
		self.original = self.getData();
		self.width = img.width;
		self.height = img.height;
		
	};
	self.context = context;
	self.image = img;
	self.image.src = src;
	
}

ImageCanvas.prototype.getData = function () {
	return this.context.getImageData(0, 0, this.image.width, this.image.height);
};

ImageCanvas.prototype.setData = function (data) {
	return this.context.putImageData(data, 0, 0);
};