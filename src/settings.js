export default function Settings( _gui ){
    this.gui = _gui;
}

Settings.prototype.reset = function() {
    // console.log('resetting gui');
    for (var i in this.gui.__controllers) {
        this.gui.__controllers[i].remove();
    }
}

Settings.prototype.createGUI = function(config) {
    CreateColorControls(this.gui, config);
    CreateRainControls(this.gui, config);
}

function CreateColorControls( gui, config ){
    var set = gui.addFolder('Color Settings');
    set.add(config, 'red').min(-255).max(255).step(1)
        .onChange(function (value) {
            var args = Object.assign({}, config, {
                red: value
            });
            config.cb(args);
        });
    set.add(config, 'green').min(-255).max(255).step(1)
        .onChange(function (value) {
            var args = Object.assign({}, config, {
                green: value
            });
            config.cb(args);
        });
    set.add(config, 'blue').min(-255).max(255).step(1)
        .onChange(function (value) {
            var args = Object.assign({}, config, {
                blue: value
            });
            config.cb(args);
        });
    set.add(config, 'alpha').min(0).max(255).step(1)
        .onChange(function (value) {
            var args = Object.assign({}, config, {
                alpha: value
            });
            config.cb(args);
        });
    set.open();
}

function CreateRainControls(gui, config) {
    var set = gui.addFolder('Rain Settings');
    var setconfig = config['rain'];
    set.add(config, 'rain');
    set.add(config, 'rainsize').min(1).max(128).step(1)
        .onChange(function (value) {
            var args = Object.assign({}, config, {
                rainsize: value
            });
            config.cb(args);
        });
    set.add(config, 'rainnumber').min(1).max(1000).step(1)
        .onChange(function (value) {
            var args = Object.assign({}, config, {
                rainnumber: value
            });
            config['raindrops'] = '';
            config.cb(args);
        });
    set.open();
}