/**********************************************************************************/
/*                                                                                */
/*                                   LIBRARIES                                    */
/*                                                                                */
/**********************************************************************************/

var fs = require('fs');
var ts = require('gulp-typescript');
var del = require('del');
var opn = require('opn');
var rev = require('gulp-rev');
var zip = require('gulp-zip');
var gulp = require('gulp');
var path = require('path');
var csso = require('gulp-csso');
var sass = require('gulp-sass');
var merge = require('merge2');
var watch = require('gulp-watch');
var karma = require('karma').Server;
var rename = require('gulp-rename');
var useref = require('gulp-useref');
var filter = require('gulp-filter');
var uglify = require('gulp-uglify');
var tslint = require('gulp-tslint');
var minify = require('gulp-minify');
var connect = require('gulp-connect');
var wiredep = require('wiredep').stream;
var typedoc = require('gulp-typedoc');
var cleanCss = require('gulp-clean-css');
var livereload = require('gulp-livereload');
var revReplace = require('gulp-rev-replace');

var paths = {
    ts: ['./ts/**/*.ts'],
    js: ['./www/**/*.js'],
    sass: ['./scss/**/*.scss'],
    images: ['./www/img/**/*'],
    useref: ['./www/*.html', '!./www/index.html'],
    index: ['./www/index.html'],
    templates: ['./www/templates/**/*.html']
};

/**********************************************************************************/
/*                                                                                */
/*                                     TASKS                                      */
/*                                                                                */
/**********************************************************************************/

gulp.task('zip', gulp.series(_zip));
gulp.task('sass', gulp.series(_sass));
gulp.task('bower', gulp.series(_bower));
gulp.task('watch', gulp.series(_watch));
gulp.task('tslint', gulp.series(_tslint));
gulp.task('useref', gulp.series(_useref));
gulp.task('scratch', gulp.series(_scratch));
gulp.task('typedoc', gulp.series(_typedoc));
gulp.task('copyFonts', gulp.series(_copyFonts));
gulp.task('copyImages', gulp.series(_copyImages));
gulp.task('templateCache', gulp.series(_templateCache));

gulp.task('ts', gulp.series('tslint', _ts));
gulp.task('deploy', gulp.series('ts', 'sass', 'copyImages', 'copyFonts', _useref, 'templateCache'));
gulp.task('hook', gulp.series('deploy', _hook));
gulp.task('serve', gulp.series('deploy', _serve));
gulp.task('minify', gulp.series('hook', _minify));
gulp.task('build', gulp.series('minify', _build));
gulp.task('browser', gulp.series('serve', _browser));

gulp.task('test', gulp.series('scratch', 'ts', _test));
gulp.task('default', gulp.series('scratch', 'browser', 'watch'));

/**********************************************************************************/
/*                                                                                */
/*                                     HOOKS                                      */
/*                                                                                */
/**********************************************************************************/

function _typedoc() {
    return gulp
        .src(paths.ts)
        .pipe(typedoc({
            out: 'docs/',
            name: 'battleship2.0-client',
            module: 'commonjs',
            target: 'es5',
            hideGenerator: true,
            excludeExternals: true,
            includeDeclarations: true
        }));
}

function _extractAttributes(script) {
    var attributes = {};
    var split = script.replace(/<script /, '').replace(/><\/script>/, '').split(' ');

    split.forEach(function (item) {
        var itemSplit = item.split('=');
        if (itemSplit.length <= 1) {
            return;
        }
        attributes[itemSplit[0]] = itemSplit[1].replace(/"/g, '');
    });

    return attributes;
}

function _templateCache(done) {
    var index = fs.readFileSync('./www/dist/index.html', 'utf8');
    var templates = index.replace(/[^]+<!-- templates -->/, '').replace(/<!-- endtemplates -->[^]+/, '').split('\n');
    var templateJs = '';

    templates.splice(0, 1);
    templates.splice(templates.length - 1, 1);

    templates.forEach(function (script, scriptIndex) {
        if (typeof script === 'string' && script.trim().length) {
            var attrs = _extractAttributes(script);
            var template = fs.readFileSync('./www/' + attrs.src, 'utf8').replace(/\n/g, '').replace(/"/g, '\\"');
            templateJs += 'bs.template.register("' + attrs.id + '", "' + template + '");';

            if (scriptIndex < templates.length - 1) {
                templateJs += '\n';
            }
        }
    });

    index = index.replace(/<!-- templates -->[^]+<!-- endtemplates -->/, '<script src="js/templates.js"></script>');

    fs.writeFileSync('./www/dist/js/templates.js', templateJs, 'utf8');
    fs.writeFileSync('./www/dist/index.html', index, 'utf8');

    done();
}

function _test(done) {
    return new karma({
        configFile: __dirname + '/karma.conf.js'
    }, done).start();
}

function _tslint() {
    return gulp.src(paths.ts)
        .pipe(tslint({
            formatter: 'verbose',
            configuration: 'tslint.json'
        }))
        .pipe(tslint.report({
            emitError: false
        }));
}

function _ts() {
    var tsResult = gulp.src(paths.ts)
        .pipe(ts({
            declaration: true,
            removeComments: false
        }));

    return merge(
        tsResult.dts.pipe(gulp.dest('./www/js/definitions')),
        tsResult.js.pipe(gulp.dest('./www/js/release'))
    );
}

function _minify() {
    var jsMinified =
        gulp.src('./www/dist/js/*.js')
            .pipe(minify({
                ext: {min: '.js'},
                noSource: true
            }))
            .pipe(gulp.dest('./www/dist/js'));

    var cssMinified =
        gulp.src('./www/dist/styles/*.css')
            .pipe(cleanCss({keepSpecialComments: 0}))
            .pipe(gulp.dest('./www/dist/styles'));

    return merge(jsMinified, cssMinified);
}

function _hook(done) {
    function endsWith(string, value) {
        return string.substring(string.length - value.length, string.length) === value;
    }

    var environment = (process.argv[3] || 'dev').replace(/--/g, ''),
        filePath = __dirname + '/www/dist/js',
        configFile = path.join('config', 'environments.json'),
        JSONConfigObject = JSON.parse(fs.readFileSync(configFile, 'utf8')),
        filesToReplace = Object.keys(JSONConfigObject.hooks),
        distFilenames = fs.readdirSync(filePath);

    console.log('[+] On environment:', environment);

    filesToReplace.forEach(
        function (filePatternToReplace) {

            var realFile = filePatternToReplace;

            for (var i = 0; i < distFilenames.length; ++i) {

                var pattern = new RegExp(filePatternToReplace),
                    filename = distFilenames[i];

                if (endsWith(filename, '.js') && pattern.test(filename)) {
                    realFile = filename;
                    break;
                }

            }

            var fullFileName = path.join(filePath, realFile);

            if (fs.existsSync(fullFileName)) {

                console.log('[+] Interpolating ', fullFileName);

                Object.keys(JSONConfigObject.hooks[filePatternToReplace]).forEach(
                    function (variable) {

                        var conf = JSONConfigObject.hooks[filePatternToReplace][variable],
                            obj = {

                                value: conf.environments[environment],
                                pattern: conf.pattern

                            };

                        console.log('[+] Working on:', variable, '=', obj.value);
                        _replaceStringInFile(fullFileName, obj.pattern, obj.value);

                    }
                );

            } else {
                console.error('[ERROR] MISSING:', fullFileName);
            }

        }
    );

    done();
}

function _replaceStringInFile(filename, toReplace, replaceWith) {
    var data = fs.readFileSync(filename, 'utf8'),
        result = _replace(data, toReplace, replaceWith);

    fs.writeFileSync(filename, result, 'utf8');
}

function _replace(data, from, to) {
    return data.replace(new RegExp(from, 'g'), to);
}

function _sass() {
    return gulp.src(paths.sass)
        .pipe(sass({errLogToConsole: true}))
        .pipe(gulp.dest('./www/css/'))
        .pipe(cleanCss())
        .pipe(rename({extname: '.min.css'}))
        .pipe(gulp.dest('./www/css/'))
        .pipe(livereload());
}

function _copyFonts() {
    var fontsBebasNeue =
        gulp.src(['./www/lib/bebas_neue/*+(Regular).{ttf,otf}'])
            .pipe(gulp.dest('./www/fonts/Bebas-Neue'))
            .pipe(gulp.dest('./www/css/fonts/Bebas-Neue'))
            .pipe(gulp.dest('./www/dist/fonts/Bebas-Neue'));

    return merge(fontsBebasNeue);
}

function _copyImages() {
    return gulp.src(paths.images)
        .pipe(gulp.dest('./www/css/img'))
        .pipe(gulp.dest('./www/dist/img'))
        .pipe(livereload());
}

function _useref() {
    var jsFilter = filter('./www/dist/tmp/**/*.js', {restore: true}),
        cssFilter = filter('./www/css/*.min.css', {restore: true}),
        indexHtmlFilter = filter(['**/*', '!**/*.html'], {restore: true});

    return gulp.src('www/*.html')
        .pipe(useref())             // Concatenate with gulp-useref
        .pipe(jsFilter)
        .pipe(uglify())             // Minify any javascript sources
        .pipe(jsFilter.restore)
        .pipe(cssFilter)
        .pipe(csso())               // Minify any CSS sources
        .pipe(cssFilter.restore)
        .pipe(indexHtmlFilter)
        .pipe(rev())                // Rename the concatenated files (but not index.html)
        .pipe(indexHtmlFilter.restore)
        .pipe(revReplace())         // Substitute in new filenames
        .pipe(gulp.dest('./www/dist'));
}

function _scratch(error, toDelete) {
    toDelete = toDelete || ['www/css', 'www/dist', 'www/fonts', 'www/js'];
    return del(toDelete);
}

function _build() {
    return _scratch(null, './www/dist/tmp/**')
        .then(_zip);
}

function _zip() {
    var timestamp = new Date().toJSON().substring(0, 20).replace(/-|:/g, '').replace('T', '_');
    return gulp.src('./www/dist/**')
        .pipe(zip('battleship_client_' + timestamp + 'zip'))
        .pipe(gulp.dest('./www/dist'));
}

function _watch(done) {
    livereload.listen({
        port: 35730
    });

    // gulp.watch(paths.index, gulp.series('deploy', _templateCache));
    gulp.watch(paths.templates, gulp.series('deploy'));
    gulp.watch(paths.ts, gulp.series('deploy'));
    gulp.watch(paths.sass, gulp.series(_sass));
    gulp.watch(paths.images, gulp.series(_copyImages));
    done();
}

function _bower() {
    return gulp.src('./www/index.html')
        .pipe(wiredep())
        .pipe(gulp.dest('./www'));
}

function _serve(done) {
    connect.server({livereload: true});
    done();
}

function _browser(done) {
    opn('http://localhost:8080/www/dist');
    done();
}
