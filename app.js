#!/usr/bin/env node

var fs = require('fs');
var util = require('util');
var path = require('path');
var less = require('less');
var watch = require('watch');

var argv = require('optimist')
    .usage('Usage: {OPTIONS}')
	.boolean(['compress'])
    .wrap(80)
    .option('input', {
      alias: 'i',
      demand: 'i',
      desc: 'Specify input file to watch/compile.'
    })
    .option('paths', {
      alias: 'p',
      desc: 'Specify search paths for @import directives.',
	  default: []
    })
    .option('compress', {
      alias: 'c',
      desc: 'Minify CSS output.'
    })
    .option('filename', {
      alias: 'f',
      desc: 'Specify a filename, for better error messages.',
	  default: "'style.less'"
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

var lessc = function(lessInput, lessOutput){
	less.render(lessInput,{
      paths: argv.paths instanceof Array ? argv.paths : [argv.paths],  // Specify search paths for @import directives
      filename: argv.filename, // Specify a filename, for better error messages
      compress: argv.compress          // Minify CSS output
    },
	function(error, output) {
		if (!error) {
			var fd = fs.openSync(lessOutput, "w");
			fs.writeSync(fd, output.css, 0, "utf-8");
			console.info((new Date()).toTimeString() + " watcher-lessc: Write to file: " + output_file);
		} else {
			console.error((new Date()).toTimeString() + " watcher-lessc: Write error: " + error);
		}
	});
}					
less.logger.addListener({
    debug: function(msg) {
		console.debug(msg);
    },
    info: function(msg) {
		console.info(msg);
    },
    warn: function(msg) {
		console.warn(msg);
    },
    error: function(msg) {
		console.error(msg);
    }
});


var input_file = path.resolve(process.cwd(), argv.input);
var output_file = path.resolve(process.cwd(), argv.output);
var watch_directory = argv.directory ? path.resolve(process.cwd(), argv.directory): '';

console.log((new Date()).toTimeString() + " watcher-lessc: InputFile: "+input_file);
console.log((new Date()).toTimeString() + " watcher-lessc: OutputFile: "+ output_file);
/**
 * Compiles the less files given by the input and ouput options
 */
var compileInput = function (){
    console.log((new Date()).toTimeString() + " watcher-lessc: Updated: " + output_file);
    fs.readFile(input_file, 'utf-8',function(err,data){
		if(err){  
			console.log(data);  
		}else{  
			lessc(data,output_file);    
		}  
	});
}

/*
 * Check to see if we are watching a directory or just
 * a single file
 */
if (watch_directory){
	compileInput();
	console.log((new Date()).toTimeString() + " watcher-lessc: Start Watch Tree: " + watch_directory);
    watch.watchTree(watch_directory, function(f, current,previous){
		if(current==previous) return;
        compileInput();
    });
} else {
	compileInput();
	console.log((new Date()).toTimeString() + " watcher-lessc: Start Watch File: " + output_file);
    fs.watchFile(input_file, function(current, previous) {
		if(current==previous) return;
        compileInput();
    });
}
