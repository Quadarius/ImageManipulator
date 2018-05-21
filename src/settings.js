export default function Settings( _gui ){
    this.gui = _gui;
}

Settings.prototype.reset = function() {
    for (var i in this.gui.__controllers) {
        this.gui.__controllers[i].remove();
    }
}

Settings.prototype.createGUI = function(config) {
    CreateColorControls(this.gui, config);
    // CreateRainControls(this.gui, config);
}

function CreateColorControls( gui, config ){
    var set = gui.addFolder('Color Settings');
    set.add(config, 'red').min(-255).max(255).step(1)
        .onChange(function (value) {
            var args = Object.assign({}, config, {
                red: value
            });
        });
    set.add(config, 'green').min(-255).max(255).step(1)
        .onChange(function (value) {
            var args = Object.assign({}, config, {
                green: value
            });
        });
    set.add(config, 'blue').min(-255).max(255).step(1)
        .onChange(function (value) {
            var args = Object.assign({}, config, {
                blue: value
            });
        });
    set.add(config, 'alpha').min(0).max(255).step(1)
        .onChange(function (value) {
            var args = Object.assign({}, config, {
                alpha: value
            });
        });
    set.open();
}

// function CreateRainControls(gui, config) {
//     var set = gui.addFolder('Rain Settings');
//     var setconfig = config['rain'];
//     set.add(config, 'rain');
//     set.add(config, 'rainsize').min(1).max(128).step(1)
//         .onChange(function (value) {
//             var args = Object.assign({}, config, {
//                 rainsize: value
//             });
//         });
//     set.add(config, 'rainnumber').min(1).max(1000).step(1)
//         .onChange(function (value) {
//             var args = Object.assign({}, config, {
//                 rainnumber: value
//             });
//         });
//     set.open();
// }