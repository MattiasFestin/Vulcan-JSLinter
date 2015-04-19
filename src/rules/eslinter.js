'use strict';
var linter = require('eslint').linter,
	CLIEngine = require('eslint').CLIEngine,
	_ = require('lodash');

var langFile = require('../config/eslint.json');

module.exports = function (code, filename, program, config, err) {
	var lintConfig = {
		envs: _.zipObject(program.env, _.range(program.env.length).map(function (x) { return true; })),
		rules: _.zipObject(_.keys(config), _.values(config).map(function (el) { return el.value || 2; }))
	};

	var messages = [];
	try {

		messages = linter.verify(code, lintConfig, filename);


		_.forEach(messages, function (m) {
			var o = {
				file: filename,
				text: m.message,
				desc: langFile[m.ruleId] && langFile[m.ruleId] .desc || '',
				loc: {
					start: 	{line: m.line, column: m.column},
					end: 	{line: m.line, column: m.column}
				},
				score: (langFile[m.ruleId] && langFile[m.ruleId].score && langFile[m.ruleId].score) || (m.fatal ? 0 : (m.severity * m.severity) * 500)
			};

			err.push(o);
		});
	} catch (e) {
		console.error('eslint error:', e.message + '\n' + e.stack);
	}
};