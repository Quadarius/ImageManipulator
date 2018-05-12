'use strict';

var gulp       = require('gulp');
var path       = require('path');

var browserify = require('browserify');
var watchify   = require('watchify');
var babelify   = require('babelify');
var merge      = require('utils-merge');
var source     = require('vinyl-source-stream');
var buffer     = require('vinyl-buffer');
var sourcemaps = require('gulp-sourcemaps');
var rename     = require('gulp-rename');

var deploy     = require('gulp-gh-pages');
var server     = require('browser-sync').create();
var del        = require('del');

const BUILD_DIR = path.resolve( __dirname, 'public' );
const APP_DIR   = path.resolve( __dirname, 'src' );

var paths = {
	entry: path.join( APP_DIR, 'main.js' ),
	output: {
		dir: BUILD_DIR,
		filename: 'app.js'
	},
	sourcemaps: path.resolve( __dirname, 'maps' ), 
	scripts:{
		src: './src/**/*.js',
		dest: BUILD_DIR
	},
	styles: {
		src: APP_DIR + '/**/*.css',
		dest: BUILD_DIR
	},
	images: {
		src: APP_DIR + '/**/*.{gif,png,jpg}',
		dest: path.join( BUILD_DIR, '/img' )
	},
	html: path.join( APP_DIR, 'index.html' ),
};

function serve(done) {
	server.init( {
		server: {
			baseDir: BUILD_DIR
		},
		notify: false,
	} );
	done();
}

function reload(done) {
	server.reload();
	done();
}

function bundle( bundler ) {
	return bundler.bundle()
		.pipe( source( paths.entry ) )
		.pipe( buffer() )
		.pipe( rename( paths.output.filename ) )
		.pipe( sourcemaps.init( { loadMaps: true } ) )
		.pipe( sourcemaps.write( paths.maps ) )
		.pipe( gulp.dest( paths.output.dir ) )
}

function compile_js() {
	var bundler = browserify( paths.entry )
		.transform( babelify, { presets: ['env'] } );

	return bundle( bundler );
}

function move_html() {
	return gulp.src( paths.html )
		.pipe( gulp.dest( BUILD_DIR ) )
}

function move_images() {
	return gulp.src( paths.images.src )
		.pipe( gulp.dest( BUILD_DIR ) )
}

function move_styles() {
	return gulp.src( paths.styles.src )
		.pipe( gulp.dest( BUILD_DIR ) )
}

// function watch() {
// 	var args = merge( watchify.args, { debug: true } );
// 	var bundler = watchify( browserify( paths.entry ).transform( babelify, { presets: ['env'] } ) );
// 	compile_js(bundler);

// 	bundler.on( 'update', function() {
// 		compile_js(bundler);
// 		server.reload();
// 	});
// 	gulp.watch( paths.html, reload );
// 	gulp.watch( paths.images.src, reload );
// 	// gulp.watch( paths.styles.src, reload );
// }

function watch() {
	gulp.watch( paths.scripts.src, gulp.series( compile_js, reload ) );
	gulp.watch( paths.html,        gulp.series( move_html, reload ) );
	gulp.watch( paths.images.src,  gulp.series( move_images, reload ) );
 	// gulp.watch( paths.styles.src,  gulp.series( move_styles, reload ) );
}

gulp.task( 'build', function(done) {
	move_html();
	move_images();
	// move_styles();
	compile_js();
	done();
});

gulp.task( 'watch', function(){
	watch();
});



gulp.task( 'clean', function( done ) {
	return del(['public'], done);
});

gulp.task('default', gulp.series( 'clean', 'build', serve, 'watch' ) );

/**
 * Push build to gh-pages
 */
gulp.task('deploy', function () {
	return gulp.src( BUILD_DIR )
		.pipe(deploy())
});