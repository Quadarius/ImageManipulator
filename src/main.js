const ImageCanvas = require('./imageCanvas').default;
const Manipulator = require('./manipulators').default;
const dat         = require('dat.gui');
const Settings    = require('./settings').default;

var canvasroot;
var canvas = document.createElement("canvas");
var sourceImage = './heic0307g.jpg';

var display = new ImageCanvas( canvas, sourceImage );
var config = {
    transformation: 'rain',
    options: [
        'original',
        'color',
        'rain'
    ],
    cb: transformImage,
    width: display.width,
    height: display.height,
    red: 0,
    green: 0,
    blue: 0,
    alpha: 255,
    rain: false,
    raindrops: '',
    rainsize: 15,
    rainnumber: 5,
    rainspeed: 1
};

function setDrops(num){
    var drops = []
    for(let i = 0; i <= num; i++) {
        var d = {
            x: Math.floor(Math.random() * display.width),
            y: Math.floor(Math.random() * display.height)
        }
        drops.push(d);
    }
    config.raindrops = drops;
}

function updateDrops( drops, number, w, h ) {
    // console.log('updating');
    for (let i = 0; i <= number; i++) {
        drops[i].y += 10;
        if (drops[i].y > h) {
            drops[i].x = Math.floor(Math.random() * w);
            drops[i].y = 0;
        }
    }
    // return drops;
}
function transformImage(args) {
    // if( args['rain'] ) {
    if( '' === args.raindrops){
        setDrops(args.rainnumber);
    } else {
        // console.log(args.raindrops)
        if (args['rain']) {
            updateDrops(args.raindrops, args.rainnumber, display.width, display.height);
        }
    }
    // }
    
    var color = new Manipulator('color');
    var rain  = new Manipulator('rain');
    var newImageData = color(args, display.original, display.context);
    var rainImageData = rain(args, newImageData, display.original, display.context);
    display.setData(rainImageData);
};

function update() {
    requestAnimationFrame(update);
    var type = config['transformation'];
    // console.log(type);
    config.cb(config);
}

window.onload = function () {
    canvasroot = document.getElementById("root");
    canvasroot.appendChild(canvas);

    var gui = new dat.GUI({name: 'Picture Controls'});
    var folderName = "Settings";
    var settingsHelper = new Settings(gui);
    settingsHelper.createGUI(config);

    update();
}


