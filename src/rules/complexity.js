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
			var maintainabilityPoints = Math.round((100-report.maintainability) * 50);

			err.push({
				file: o.__file__,
				loc: o.loc,
				type: 'halstead',
				text: 'Halstead effort på "' + Math.round(report.effort) + '".',
				desc: 'Anger tid som behöver läggas på underhålla komplexiteten. (Baserad på statistisk analys av frekvensen av nedlagd tid, antal buggar och komplexitet).',
				score: halsteadPoints,
				value: report.effort|0,
				noPlace: true
			});
			err.push({
				file: o.__file__,
				loc: o.loc,
				type: 'cyclomatic',
				text: 'Cyclomatiskkomplexitet på "' + Math.round(report.cyclomatic) + '".',
				desc: 'Anger antal kodvägar ("branchingfactor") på koden. Koden blir svår att ha en metal modell om för hög.',
				score: cyclomaticPoints,
				value: report.cyclomatic|0,
				noPlace: true
			});

			err.push({
				file: o.__file__,
				loc: o.loc,
				type: 'maintainability',
				text: 'Maintainability på "' + Math.round(report.maintainability) +'" [1-100].',
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
				text: 'En fil bör inte ha mer än 350 rader.',
				desc: 'Bryt isär filen till fler mindre filer.',
				score: 500
			});
		}
	}
];