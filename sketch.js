var canvas = document.createElement('canvas');
var ctx = canvas.getContext('2d');
var pixels = [];
var imageLoaded = false;
var imageData = [];

var img = new Image();
// img.onload =
// img.addEventListener( 'load', 
// }, false );

// img.addEventListener( 'error', function() {

// }, false );

img.src = './assets/heic0307g.jpg';
img.onload = load_image;
img.onerror = function(){ alert( img.src + ' failed' ); }

function load_image(){
	canvas.getContext('2d').drawImage( img, 0, 0 );
	temp = canvas.getContext('2d').getImageData( 0, 0, img.width, img.height );
	imageOptions.data = temp.data;
	DrawPixelsToCanvas( canvas, pixels, pixelOptions );
}

var imageOptions = {
	height: 800,
	width:  800,
	data: new Uint8ClampedArray( this.height * this.width * 4 )
}

var factoryOptions = {
	numberOfPixels: 50,
	xMax: imageOptions.height,
	yMax: imageOptions.width,
	maxSpeed: 5,
	size: 40 // in pixels ;)
}

var PixelFactory = {

	GetPixel: function( xMax, yMax, maxSpeed, size ) {
		var coords = PixelFactory.RandomPosition( xMax, yMax);
		var speed = Math.max( Math.random() * maxSpeed, 1 );
		// var size = Math.max( Math.random() * maxSize, 5 )
		return new Pixel( coords.x, coords.y, speed, size )
	},

	RandomPosition: function( xMax, yMax ) {
		return {
			x: Math.floor(Math.random() * xMax),
			y: Math.floor(Math.random() * yMax)
		};
	}
}

var Pixel = function( x, y, speed, size ) {
	this.x = x;
	this.y = y;
	this.speed = speed;
	this.size = size;
	this.reset = function() {
		Pixel.apply(this, arguments);
	}
}

function GeneratePixels( pixelList, options )
{
	for(var i = 0; i < options.numberOfPixels; i++){
		pixelList.push( PixelFactory.GetPixel( options.xMax, options.yMax, options.maxSpeed, options.size ) )
	}
}

function DrawImageToCanvas( image, canvas, options )
{
	canvas.width  = image.width;
	canvas.height = image.height;
	canvas.getContext('2d').drawImage( image, 0, 0 );
	imageLoaded = true;
}

var pixelOptions = {
	shape: 'round'
}

function DrawPixelsToCanvas( canvas, pixels, options )
{
	var drawPixel;
	var ctx = canvas.getContext('2d');
	switch(options.shape)
	{
		case 'round':
			drawPixel = DrawRoundPixel;
			// drawPixel = function( ctx, pixel ){
			// 	DrawRoundPixel( ctx, pixel )
			// }
			break;
	}
	for(var i = 0; i < pixels.length; i++){
		drawPixel( ctx, pixels[i] );
	}
}

function DrawRoundPixel( ctx, pixel)
{
	ctx.beginPath();
	ctx.fillStyle = ImageColorAt( pixel.x, pixel.y ); //"rgb(154,24,98)"
	ctx.arc( pixel.x, pixel.y, pixel.size, 0, Math.PI * 2, false );
	ctx.fill();
}

function ImageColorAt( x, y )
{
	var base = ( Math.floor(x) + Math.floor(y) * imageOptions.width ) * 4;
	var c = {
		r: imageOptions.data[base + 0],
		g: imageOptions.data[base + 1],
		b: imageOptions.data[base + 2],
		a: imageOptions.data[base + 3]
	};

	return "rgb(" + c.r + "," + c.g + "," + c.b + ")";
}

function AddNodeToDOM( parent, child )
{
	parent.appendChild( child );
}

AddNodeToDOM( document.body, canvas );

//var image = LoadImage( canvas, './assets/heic0307g.jpg', imageOptions );
GeneratePixels( pixels, factoryOptions );
DrawPixelsToCanvas( canvas, pixels, pixelOptions );

requestAnimationFrame(loop);

function loop() {
	requestAnimationFrame(loop);
}
