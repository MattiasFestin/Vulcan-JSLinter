'use strict';
var escomplex = require('escomplex');
var mozWalker = require('escomplex-ast-moz');
var _ = require('lodash');

module.exports = [
    function (o, state, err) {
        if (o.type === 'Program') {
            var report = escomplex.analyse(o, mozWalker, {
                forin: true,
                trycatch: true,
                newmi: true
            });

            var cyclomaticPoints = Math.max(0, Math.round(Math.pow(report.cyclomatic/3, 2)*100-81));
            var halsteadPoints = Math.round(report.effort);
            var maintainabilityPoints = Math.floor((100-report.maintainability) * 50);

            err.push({
                file: o.__file__,
                loc: o.loc,
                type: 'halstead',
                text: 'Halstead effort of "' + Math.round(report.effort) + '".',
                desc: 'Gives the estimated time that is needed to maintain the level of complexity. (Based on statistical analysis of frequensy of amount of time, number of bugs and complexity).',
                score: halsteadPoints,
                value: report.effort|0,
                noPlace: true
            });
            err.push({
                file: o.__file__,
                loc: o.loc,
                type: 'cyclomatic',
                text: 'Cyclomatisc complexitet of "' + Math.round(report.cyclomatic) + '".',
                desc: 'Gives the number of code paths or branchingfactor of the code. If too high then the code is hard to maintain a mental model of.',
                score: cyclomaticPoints,
                value: report.cyclomatic|0,
                noPlace: true
            });

            err.push({
                file: o.__file__,
                loc: o.loc,
                type: 'maintainability',
                text: 'Maintainability of "' + Math.round(report.maintainability) +'" [1-100].',
                desc: '',
                score: maintainabilityPoints,
                value: report.maintainability|0,
                noPlace: true
            });
        }
    },

    function (o, state, err) {
        if (o.loc && o.loc.start.line > 350 && !state.isTooLong) {
            state.isTooLong = true;

            err.push({
                file: o.__file__,
                loc: o.loc,
                text: 'A file should not have more then 350 lines of code..',
                desc: 'Seperate the logic to smaller functions that can be reused and split them to seperate files.',
                score: 500
            });
        }
    }
];
