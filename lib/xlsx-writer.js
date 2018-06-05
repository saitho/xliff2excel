'use strict';

var exceljs = require('exceljs');

var Writer = function() {
    this.workbook = new exceljs.Workbook();

    return this;
};

Writer.prototype.add = function (data) {
    var sheet = this.workbook.addWorksheet(data.filename);
    var columns =  [
        { header: 'Id', key: 'id', width: 25 },
        { header: 'Note', key: 'note', width: 25 },
        { header: data.sourceLanguage.toUpperCase(), key: 'source', width: 64 }
    ];

    if (data.targetLanguage) {
        columns.push({
            header: data.targetLanguage.toUpperCase(),
            key: 'target',
            width: 64
        });
    }

    sheet.columns = columns;

    data.transUnits.forEach(function(transUnit) {
        var row = {
            id: transUnit.id,
            note: transUnit.note,
            source: transUnit.source,
        };

        if (data.targetLanguage) {
            row.target = transUnit.target;
        }

        sheet.addRow(row);
    });
};

Writer.prototype.save = function (filename) {
    return this.workbook.xlsx.writeFile(filename);
};

module.exports = Writer;
