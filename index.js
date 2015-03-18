'use strict';

var jest = require('jest-cli'),
    gutil = require('gulp-util'),
    through = require('through2');

module.exports = function (options) {
    options = options || {};
    return through.obj(function (file, enc, cb) {
        options.rootDir = options.rootDir || file.path;

        var cliOptions = {config: options};
        for(var i = 0, j = process.argv.length; i < j; i++) {
            if(process.argv[i].indexOf('--name=') === 0) {
                var value = process.argv[i].substring('--name='.length);
                cliOptions.testPathPattern = new RegExp(value);
            }
        }

        jest.runCLI(cliOptions, options.rootDir, function (success) {
            if(!success) {
                cb(new gutil.PluginError('gulp-jest', { message: "Tests Failed" }));
            } else {
                cb();
            }
        }.bind(this));
    });
};
