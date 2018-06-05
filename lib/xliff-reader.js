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
                var filename = (path.basename(filepath) || '');
                var transUnits = file.body[0]['trans-unit'];

                var obj = {
                    sourceLanguage: file.$['source-language'],
                    transUnits: [],
                    filename: filename.length > 31 ? filename.substring(31) : filename
                };

                if (file.$.hasOwnProperty('target-language')) {
                    obj.targetLanguage = file.$['target-language'];
                }

                (transUnits || []).forEach(function (transUnit) {
                    var unit = {
                        id: transUnit.$.id,
                        note: (transUnit.note || []).map(note => {
                            if (note.hasOwnProperty('_')) {
                                return note._;
                            } if (typeof note === 'string') {
                                return note;
                            } else {
                                return '';
                            }
                        }).join(';'),
                        source: transUnit.source[0]._ || transUnit.source[0]
                    };

                    if (transUnit.hasOwnProperty('target')) {
                        unit.target = transUnit.target[0]._ || transUnit.target[0];
                    }

                    obj.transUnits.push(unit);
                });

                resolve(obj);
            });
        });
    });

    return promise;
};
