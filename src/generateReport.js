'use strict';
var colors = require('colors'),
	fs = require('fs'),
    path = require('path'),
    _ = require('lodash');

var square = function (x) {
    return x*x;
};

var typeFilterFn = function (type) {
    return function (f) {
        return f.type === type;
    };
};

var generate = function (err) {
    var dict = {};

    // console.log(err);

    //Sortera fel per fil
    err = _.chain(err)
    .sortBy(function (o) {
        return o.score;
    })
    .reverse();


    //Skapa upp gruppering
    err.forEach(function (e) {
        dict[e.file] = dict[e.file] || {};
        dict[e.file].file = path.relative(process.cwd(), e.file);
        dict[e.file].maxScore = Math.max((dict[e.file].maxScore || 0), e.score);
        dict[e.file].score = (dict[e.file].score || 0) + e.score;
        dict[e.file].errors = dict[e.file].errors || [];

        if (e.loc) {
            var data = fs.readFileSync(e.file, 'utf-8');
            e.code = data.split('\n')
                .splice(Math.max(e.loc.start.line-2, 0), e.loc.end.line - e.loc.start.line + 4)
                //.values()
                .join('\n');
        }

        dict[e.file].errors.push(e);

        dict[e.file].halstead = dict[e.file].halstead || _.chain(dict[e.file].errors)
            .filter(typeFilterFn('halstead'))
            .pluck('value')
            .sum() || null;

        dict[e.file].cyclomatic = dict[e.file].cyclomatic || _.chain(dict[e.file].errors)
            .filter(typeFilterFn('cyclomatic'))
            .pluck('value')
            .sum() || null;

        dict[e.file].maintainability = dict[e.file].maintainability || _.chain(dict[e.file].errors)
            .filter(typeFilterFn('maintainability'))
            .pluck('value')
            .sum() || null;

    })
    .value();

    //Sortera filerna
    var report = {
        files: _.chain(dict)
            .sortBy(function (o) {
                return o.score;
            })
            .reverse()
            .value(),

        maxScore: 0
    };

    report.nbrFiles = _.size(report.files);
    report.maxScore = _.max(_.pluck(report.files, 'score'));
    var errors = _.flatten(_.pluck(report.files, 'errors'));
    report.nbrErrors = _.size(errors);
    report.avgScore = _.chain(errors).pluck('score').sum() / report.nbrErrors;
    report.rmsScore = Math.sqrt(_.chain(errors).pluck('score').map(square).sum() / report.nbrErrors);


    report.halstead = Math.sqrt(_.chain(errors).filter(typeFilterFn('halstead')).pluck('value').map(square).sum().value() / report.nbrFiles);
    report.cyclomatic = Math.sqrt(_.chain(errors).filter(typeFilterFn('cyclomatic')).pluck('value').map(square).sum().value() / report.nbrFiles);
    report.maintainability = 100 * Math.sqrt(_.chain(errors).filter(typeFilterFn('maintainability')).pluck('value').map(function (x) {return x/100;}).map(square).sum().value() / report.nbrFiles);

    return report;
};

var print = function (program, report) {
    _.forEach(report.files, function (f, fk) {
        console.log('=-----------------------------------------------------='.bold.gray);
		
		//[TODO] get from .vulcanrc
		if (f.score >= program.enforce.quality.file.score) {
			console.log((f.file + '  (' + f.score + 'p)').bold.red);
		} else if (f.score >= program.enforce.quality.file.warn) {
			console.log((f.file + '  (' + f.score + 'p)').bold.yellow);
		} else {
			console.log((f.file + '  (' + f.score + 'p)').bold.green);
		}
        
        _.forEach(f.errors, function (e) {
			var msg = '';
			if (e.score >= 1000) {
				msg += ('(' + e.score + 'p) ').bold.red; 
			} else if (e.score >= 100) {
				msg += ('(' + e.score + 'p) ').bold.yellow;
			} else {
				msg += ('(' + e.score + 'p) ').bold.green;
			}
			
			
			msg += e.text.bold;
			
			msg += ' ' + ('[between line' + e.loc.start.line + ':' + e.loc.start.column + ' and line' + e.loc.end.line + ':' + e.loc.end.column + ']').underline.gray;
			msg += (program.verbose ? ' <' + e.desc + '>' : '').italic.blue;

            console.error(msg);
        });
        console.log('=-----------------------------------------------------='.bold.gray);
    });

    return report;
};


module.exports = {
    generate: generate,
    print: print
};
