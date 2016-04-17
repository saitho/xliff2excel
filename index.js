'use strict';

var minimist = require('minimist');
var chalk = require('chalk');
var Promise = require('promise-es6').Promise;

var reader = require('./lib/xliff-reader.js');
var Writer = require('./lib/xlsx-writer.js');

var argv = minimist(process.argv.slice(2));

var xliffFiles = argv._;
var outputFile = argv.o || argv.output;

if (xliffFiles.length === 0) {
    return console.log(chalk.red.underline('Error') + ': Please specify at least one XLIFF file.');
}

if (outputFile.length === 0) {
    return console.log(chalk.red.underline('Error') + ': You must specify an output file.');
}

var writer = new Writer();

var promise = new Promise(function(resolve, reject) {
    var counter = 0;

    xliffFiles.forEach(function(xliffFile) {
        console.log('Parsing ' + chalk.underline(xliffFile));

        reader(xliffFile).then(function(data) {
            writer.add(data);
            counter++;
            if (counter === xliffFiles.length) {
                resolve();
            }
        }).catch(function(err) {
            console.log(chalk.underline.red('Error') + ': ' + err);
        });
    });

});

promise.then(function() {
    console.log('Writing ' + chalk.underline(outputFile));
    return writer.save(outputFile);
}).then(function() {
    console.log(chalk.green.underline('Success') + ': Saved ' + outputFile);
}).catch(function(err) {
    console.log(chalk.red.underline('Error') + ': ' + err);
});
