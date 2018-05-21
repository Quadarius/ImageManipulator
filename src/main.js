const ImageCanvas   = require('./imageCanvas').default;
const ListOfEffects = require('./effects/index').default;
const dat           = require('dat.gui');
const Settings      = require('./settings').default;

var canvasroot;
var canvas = document.createElement("canvas");
var sourceImage = './heic0307g.jpg';

var display = new ImageCanvas( canvas, sourceImage );
var color = ListOfEffects['color'];
var config = {
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

function generateParticles( number_of_particles, w, h ){
    let particles = [];
    for(let i = 0; i <= number_of_particles; i++) {
        var p = {
            x: Math.floor( Math.random() * w ),
            y: Math.floor( Math.random() * h )
        }
        particles.push(p);
    }
    return particles;
}

function updateDrops( drops, number, w, h ) {
    for (let i = 0; i <= number; i++) {
        drops[i].y += 10;
        if (drops[i].y > h) {
            drops[i].x = Math.floor(Math.random() * w);
            drops[i].y = 0;
        }
    }
    return drops;
}

function transformImage(args) {
    var newImageData = color(args, display.original, display.context);
    display.setData( newImageData );
};

var fps = 60;
var min_elapsed_time = (1000/60) * (60/fps) -(1000/60) * 0.5;
var previous_time = 0;
function update(time) {
    if( time - previous_time < min_elapsed_time ) {
        requestAnimationFrame(update);
        return;
    }
    previous_time = time;
    requestAnimationFrame(update);
    transformImage(config);
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


