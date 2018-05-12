const CanvasImage = require('./canvas').default;
const dat         = require('dat.gui');

var canvasroot;
var displayCanvas = document.createElement("canvas");
var sourceImage = './heic0307g.jpg';

var imageManipulator = new CanvasImage( displayCanvas, sourceImage );

var config = {
    transformation: 'color',
    red: 0,
    green: 0,
    blue: 0,
    alpha: 255
};

window.onload = function () {
    canvasroot = document.getElementById("root");
    canvasroot.appendChild(displayCanvas);

    var gui = new dat.GUI({name: 'Picture Controls'});

    gui.add(config, 'transformation', 
        [
            'original',
            'color'
        ])
        .onFinishChange(function (value) {
            var args = Object.assign({}, config, {
                transformation: value
            });

            imageManipulator.transform( args );
    });

    gui.add(config, 'red').min(-255).max(255).step(1)
        .onChange(function (value) {
            var args = Object.assign({}, config, {
                red: value
            });
            
            imageManipulator.transform(args);
        });
    gui.add(config, 'green').min(-255).max(255).step(1)
        .onChange(function (value) {
            var args = Object.assign({}, config, {
                green: value
            });
            imageManipulator.transform(args);
        });
    gui.add(config, 'blue').min(-255).max(255).step(1)
        .onChange(function (value) {
            var args = Object.assign({}, config, {
                blue: value
            });

            imageManipulator.transform(args);
        });
    gui.add(config, 'alpha').min(0).max(255).step(1)
        .onChange(function (value) {
            var args = Object.assign({}, config, {
                alpha: value
            });

            imageManipulator.transform(args);
        });
}

// Number.prototype.clamp = function() {
//     return Math.min(Math.max(this, 0), 255);
// };
