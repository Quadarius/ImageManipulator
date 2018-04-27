/**
 * 
 */

var height = 600;
var width  = 800;

var canvasroot;

var source  = document.createElement("canvas");
var buff    = document.createElement("canvas");
var display = document.createElement("canvas");

var sourceImage = new Image();

function setCanvasDimensions( canvas, height, width ){
	canvas.style.height = height+"px";
	canvas.style.width  = width+"px";
}

function animateBuff() {
	display.getContext('2d').drawImage( img, 0, 0 );
}

function animate() {
	requestAnimitionFrame(animate);
	// update canvas
}

setCanvasDimensions(  source, height, width );
setCanvasDimensions(    buff, height, width );
setCanvasDimensions( display, height, width );

window.onload = function(){
	canvasroot = document.getElementById("root");
	canvasroot.appendChild(display);
}

sourceImage.onload = function(){
	publish( "imageUpdate", [sourceImage] );
}

subscribe( "imageUpdate", function(img){
	// source.getContext('2d').drawImage( img, 0, 0 );
	buff.getContext('2d').drawImage( img, 0, 0 );
	display.getContext('2d').drawImage( img, 0, 0 );
});

sourceImage.src = 'https://mdn.mozillademos.org/files/5397/rhino.jpg';

animate();