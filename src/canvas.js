export default function CanvasImage(canvas, src) {
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
		
	};
	self.context = context;
	self.image = img;
	self.image.src = src;
}

CanvasImage.prototype.getData = function () {
	return this.context.getImageData(0, 0, this.image.width, this.image.height);
};

CanvasImage.prototype.setData = function (data) {
	return this.context.putImageData(data, 0, 0);
};

CanvasImage.prototype.transform = function (args) {
	var fn = transformations[ args['transformation'] ];

	var newImageData = fn.call(this, args, this.original, this.context);
	this.setData(newImageData);
};

var transformations = {
	original: function (args, originalImageData, context) {
		return originalImageData;
	},
	color: function (args, originalImageData, position) {
		const originalPixels = originalImageData.data;

		var newImageData = this.context.createImageData(originalImageData);
		var newPixels = newImageData.data;

		const length = newPixels.length;

		for (var position = 0; position < length; position += 4) {
			newPixels[position]     = (originalPixels[position + 0] + args['red']);
			newPixels[position + 1] = (originalPixels[position + 1] + args['green']);
			newPixels[position + 2] = (originalPixels[position + 2] + args['blue']);
			newPixels[position + 3] = args['alpha'];
		}

		return newImageData;
	},
}