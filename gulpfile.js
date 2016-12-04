const sass = require('gulp-sass');
const gulp = require('gulp');
const sourcemaps = require('gulp-sourcemaps');
const babel = require('gulp-babel');
const concat = require('gulp-concat');
const plumber = require('gulp-plumber');
const uglify = require('gulp-uglify');
const autoprefixer = require('gulp-autoprefixer');

const sassFilePath = './stylesheets/*.scss';

gulp.task('sass', function(){
	gulp.src(sassFilePath)
			.pipe(plumber())
			.pipe(sourcemaps.init())
			.pipe(autoprefixer())
			.pipe(sass().on('error', sass.logError))
			.pipe(sourcemaps.write())
			.pipe(gulp.dest('./build'));
});

gulp.task('scripts-compiler', function(){
	gulp.src('scripts/*.js')
		.pipe(plumber())
		.pipe(sourcemaps.init())
		.pipe(babel({
			presets: ['es2015']
		}))
		.pipe(concat('all.js'))
		.pipe(uglify())
		.pipe(sourcemaps.write('.'))
		.pipe(gulp.dest('./build'))
});

gulp.task('default', function() {
	gulp.run('sass', 'scripts-compiler');

	gulp.watch('scripts/*.js', function(event) {
		gulp.run('scripts-compiler');
	});

	gulp.watch(sassFilePath, function() {
		gulp.run('sass');
	});
});