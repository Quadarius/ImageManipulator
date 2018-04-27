var gulp = require('gulp');
var server = require('browser-sync').create();

var paths = {
	styles: {
		src: './**/*.css'
	},
	scripts: {
		src: './**/*.js',
		lib: './**/*.js'
	},
	html: './**/*.html'
};

function reload(done) {
	server.reload();
	done();
}

function serve(done) {
	server.init({
		server: {
			baseDir: "./"
		}
	});
	done();
}


function watch() {
	gulp.watch( paths.html, reload );
	gulp.watch( paths.styles.src, reload );
	gulp.watch( paths.scripts.src, reload );
}

gulp.task( 'default',
	gulp.series( serve, watch )
);