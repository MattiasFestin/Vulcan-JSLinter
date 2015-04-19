'use strict';

module.exports = [
	function (o, state, err) {
		if (o.type === 'FunctionExpression' && o.id === null) {
			err.push({
				file: o.__file__,
				loc: o.loc,
				text: 'En anonymfunktion bör vara namngiven.',
				desc: '[TODO]',
				score: 90
			});
		}
	},
	function (o, state, err) {
		if (o.type === 'FunctionExpression' && !state.isStrict) {
			var firstStatement = o.body && o.body.body && o.body.body[0];
			if (firstStatement) {
				if (firstStatement.type !== 'ExpressionStatement' || firstStatement.expression.type !== 'Literal' || firstStatement.expression.value !== 'use strict') {
					err.push({
						file: o.__file__,
						loc: firstStatement.loc,
						text: '\'use strict\' ska användas.',
						desc: '[TODO]',
						score: 90
					});
				} else {
					if (state.isStrict) {
						err.push({
							file: o.__file__,
							loc: firstStatement.loc,
							text: '\'use strict\' ska ej användas nästlad. Denna rad har ingen effekt, den utgör bara en förvirring.',
							desc: '[TODO]',
							score: 90
						});
					} else {
						state.isStrict = true;
					}
				}
			}
		}
	}
];