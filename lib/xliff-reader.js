'use strict';

var fs = require('fs'),
    path = require('path'),
    xml2js = require('xml2js');

module.exports = function(filepath) {
    var promise = new Promise(function(resolve, reject) {
        fs.readFile(filepath, function(err, content) {
            if (err) {
                return reject(err);
            }

            xml2js.parseString(content.toString(), function(err, data) {
                if (err) {
                    return reject(err);
                }

                var file = data.xliff.file[0];
                var transUnits = file.body[0]['trans-unit'];

                var obj = {
                    sourceLanguage: file.$['source-language'],
                    transUnits: [],
                    filename: path.basename(filepath)
                };

                if (file.$.hasOwnProperty('target-language')) {
                    obj.targetLanguage = file.$['target-language'];
                }

                transUnits.forEach(function (transUnit) {
                    var unit = {
                        id: transUnit.$.id,
                        source: transUnit.source[0]
                    };

                    if (transUnit.hasOwnProperty('target')) {
                        unit.target = transUnit.target[0];
                    }

                    obj.transUnits.push(unit);
                });

                resolve(obj);
            });
        });
    });

    return promise;
};
