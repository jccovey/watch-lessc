#!/usr/bin/env node

var fs = require('fs');
var util = require('util');
var path = require('path');
var less = require('less');
var watch = require('watch');

var argv = require('optimist')
    .usage('Usage: {OPTIONS}')
    .wrap(80)
    .option('input', {
      alias: 'i',
      demand: 'i',
      desc: 'Specify input file to watch/compile.'
    })
    .option('directory', {
      alias: 'd',
      desc: 'Specify input directory to watch.'
    })
    .option('output', {
        alias: 'o',
        demand: 'o',
        desc: 'Specify output file path.'
    })
    .option('help', {
      alias: 'h',
      desc: 'Show this message'
    })
    .check(function(argv) {
      if (argv.help) {
        throw '';
      }
    }).argv;

var lessc = function(input, output){
    return function (e, data) {
        if (e) {
            console.log("lessc: " + e.message);
        }

        var parser = new(less.Parser)({
            paths: [path.dirname(input)],
            optimization: 0,
            filename: input
        });

        parser.parse(data, function (err, tree) {
            if (err) {
                less.writeError(err, options);
            } else {
                try {
                    var css = tree.toCSS({ compress: false });
                    if (output) {
                        var fd = fs.openSync(output, "w");
                        fs.writeSync(fd, css, 0, "utf8");
                    } else {
                        util.print(css);
                    }
                } catch (e) {
                    less.writeError(e, options);
                }
            }
        });
    };
};

var input_file = path.resolve(process.cwd(), argv.input);
var output_file = path.resolve(process.cwd(), argv.output);
var watch_directory = argv.directory ? path.resolve(process.cwd(), argv.directory): '';
console.log(input_file,output_file,watch_directory)
/**
 * Compiles the less files given by the input and ouput options
 */
function compileInput(){
    console.log((new Date()).toTimeString() + " watch-lessc: Updated: " + output_file);
    fs.readFile(input_file, 'utf-8', lessc(input_file, output_file));
}

/*
 * Check to see if we are watching a directory or just
 * a single file
 */
if (watch_directory){
    watch.watchTree(watch_directory, function(f, curr, prev){
        compileInput();
    });
} else {
    fs.watchFile(input_file, function(current, previous) {
        compileInput();
    });
}
