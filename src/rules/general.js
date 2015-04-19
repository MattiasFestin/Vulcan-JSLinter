'use strict';
module.exports = [
	function (o, state, err) {
		if (o.type === 'Program' && o.body.length === 0) {
			err.push({
				file: o.__file__,
				loc: o.loc,
				text: 'Tomma javascript filer ska ej förekomma.',
				desc: 'Det orsakar tidsslöseri när man navigerar runnt i koden.',
				score: 9000
			});
		}
	},

	// function (o, state, err) {
	// 	if (o.type === 'BinaryExpression' && o.operator === '==') {
	// 		err.push({
	// 			file: o.__file__,
	// 			loc: o.loc,
	// 			text: '=== ska användas.',
	// 			desc: 'För att == typkonverterar värdena. === kontrollerar värde och datatyp',
	// 			score: 90
	// 		});
	// 	}
	// },

	// function (o, state, err) {
	// 	if (o.type === 'BinaryExpression' && o.operator === '!=') {
	// 		err.push({
	// 			file: o.__file__,
	// 			loc: o.loc,
	// 			text: '!== ska användas.',
	// 			desc: 'För att != typkonverterar värdena. !== kontrollerar värde och datatyp',
	// 			score: 90
	// 		});
	// 	}
	// },

	// function (o, state, err) {
	// 	var directCall = o.type === 'CallExpression' && o.callee.name === 'eval',
	// 		windowIdentifyerCall = o.__parent__.type === 'CallExpression' && o.type === 'MemberExpression' && o.object.name === 'window' && o.property.type === 'Identifier' && o.property.name === 'eval',
	// 		windowLiteralCall = o.__parent__.type === 'CallExpression' && o.type === 'MemberExpression' && o.object.name === 'window' && o.property.type === 'Literal' && o.property.value === 'eval';

	// 	if (directCall || windowIdentifyerCall || windowLiteralCall) {
	// 		err.push({
	// 			file: o.__file__,
	// 			loc: o.loc,
	// 			text: 'eval ska ej användas.',
	// 			desc: 'För att den är en säkerhetsrisk. Den behöver aldrig användas, formulera om problemet! Och den tar bort alla optimiseringar i js motorn.',
	// 			score: 900
	// 		});
	// 	}
	// },

	// function (o, state, err) {
	// 	if (o.type === 'WithStatement') {
	// 		err.push({
	// 			file: o.__file__,
	// 			loc: o.loc,
	// 			text: 'with ska ej användas.',
	// 			desc: 'Den är en källa till buggar. Och den tar bort alla optimiseringar i js motorn.',
	// 			score: 900
	// 		});
	// 	}
	// },

	// function (o, state, err) {
	// 	var validTypes = ['string', 'number', 'object', 'function', 'undefined'],
	// 		dir = '',
	// 		op = {
	// 			left: 'right',
	// 			right: 'left'
	// 		},
	// 		type = 'nothing';
	// 	if (o.type === 'BinaryExpression' && ['===', '!==='].indexOf(o.operator) > -1) {
	// 		if (o.left.type === 'UnaryExpression' && o.left.operator === 'typeof') {
	// 			dir = 'left';
	// 		} else if (o.right.type === 'UnaryExpression' && o.right.operator === 'typeof') {
	// 			dir = 'right';
	// 		}
	// 	}

	// 	if (dir) {
	// 		if (o[op[dir]].type === 'Literal') {
	// 			if (validTypes.indexOf(o[op[dir]].value) === -1) {
	// 				err.push({
	// 					file: o.__file__,
	// 					loc: o.loc,
	// 					text: 'typeof bör endast användas med följande typer: "' + validTypes.join('","') + '"',
	// 					desc: 'Denna satts kommer alltid annars att ge samma boolean värde',
	// 					score: 5000
	// 				});
	// 			} else if (o[op[dir]].value === 'undefined') {
	// 				err.push({
	// 					file: o.__file__,
	// 					loc: o.loc,
	// 					text: 'typeof bör ej användas med undefined',
	// 					desc: 'Använd ' + o[dir].argument.name + ' ' + o.operator + ' undefined istället',
	// 					score: 1000
	// 				});
	// 			}
	// 		}
	// 	}
	// },

	function (o, state, err) {
		if (o.type === 'BinaryExpression' && ['===', '!==', '<', '<=', '>', '>='].indexOf(o.operator) > -1 && o.left.type === 'Literal' && o.right.type === 'Literal') {
			err.push({
				file: o.__file__,
				loc: o.loc,
				text: o.operator + ' ska inte användas mellan två literära datatyper',
				desc: o.left.value + ' ' + o.operator + ' ' + o.right.value + ' kommer alltid procducera samma boolean värde',
				score: 900
			});
		}
	},

	function (o, state, err) {
		if (o.type === 'Program' && o.body[0] && o.body[0].type === 'ExpressionStatement' && o.body[0].expression.value === 'use strict') {
			state.isStrict = true;

			err.push({
				file: o.__file__,
				loc: o.loc,
				text: '"use strict" bör endast användas i funktions context och inte per js fil.',
				desc: 'Pga vid minifiering så slutar "use strict" fungera. Eller så kan "use strict" slå till på tredjeparts kod som är crap.',
				score: 5
			});
		}
	},

	// function (o, state, err) {
	// 	if (o.type === 'SequenceExpression') {
	// 		err.push({
	// 			file: o.__file__,
	// 			loc: o.loc,
	// 			text: 'Kommaoperator ska ej användas.',
	// 			desc: 'Pga förvirring vad den gör. Bryt upp uttrycket i flera rader istället.',
	// 			score: 90
	// 		});
	// 	}
	// },

	// function (o, state, err) {
	// 	if (o.type === 'BinaryExpression' && o.operator.match(/=/) && o.left.type === 'Literal' && o.right.type !== 'Literal') {
	// 		err.push({
	// 			file: o.__file__,
	// 			loc: o.loc,
	// 			text: 'YODA expressions bör ej användas.',
	// 			desc: 'Pga förvirring vad den gör. YODA expressions används i språk med dubbel likamed för att förhinda vid en typo att man tilldelar en variabel. I javascript så minimeras detta med trippel likamed. Samt att denna linter ger error om man försöker tilldela ett värde i en condition i en if/else-if sats.',
	// 			score: 9
	// 		});
	// 	}
	// },

	// function (o, state, err) {
	// 	if (o.type === 'ConditionalExpression') {
	// 		err.push({
	// 			file: o.__file__,
	// 			loc: o.loc,
	// 			text: 'Ternary operatorn ska ej användas.',
	// 			desc: 'Pga läsbarhet och kodkvalitet. Speciellt med nästlade ternarys så blir koden helt oläsbar. Använd if/else istället med assignment.',
	// 			score: 90
	// 		});
	// 	}
	// },

	// function (o, state, err) {
	// 	if (o.type === 'DebuggerStatement' && !state.devMode) {
	// 		err.push({
	// 			file: o.__file__,
	// 			loc: o.loc,
	// 			text: 'Debugger ska ej användas.',
	// 			desc: 'Pga ger buggar i äldre webbläsare. (Enable:a devMode för att använda)',
	// 			score: 900
	// 		});
	// 	}
	// },

	// function (o, state, err) {
	// 	if (o.type === 'Identifier' && o.name === 'console' && !state.devMode) {
	// 		if (o.__parent__.type !== 'MemberExpression' || o.__parent__.object.name === 'console' || o.__parent__.object.name === 'window') {
	// 			err.push({
	// 				file: o.__file__,
	// 				loc: o.loc,
	// 				text: 'console ska ej användas.',
	// 				desc: 'Pga ger buggar i äldre webbläsare. (Enable:a devMode för att använda)',
	// 				score: 900
	// 			});
	// 		}
	// 	}
	// },

	// function (o, state, err) {
	// 	if (o.type === 'LabeledStatement') {
	// 		err.push({
	// 			file: o.__file__,
	// 			loc: o.loc,
	// 			text: 'labels ska ej användas.',
	// 			desc: 'Ger upphov till buggar och svårläst kod',
	// 			score: 9000
	// 		});
	// 	}
	// },

	function (o, state, err) {
		if (o.type === 'TryStatement') {

			if (state.tryBlock) {
				err.push({
					file: o.__file__,
					loc: o.loc,
					text: 'Try-Catch block ska ej nästlas.',
					desc: 'Använd en Try-Catch så långt upp i call hiarkin som möjligt som fångar alla exceptions.',
					score: 500
				});
			}

			state.tryBlock = true;
		}
	},

	function (o, state, err) {
		if (o.type === 'TryStatement' && o.finalizer !== null) {
			err.push({
				file: o.__file__,
				loc: o.loc,
				text: 'finally ska aldrig användas.',
				desc: 'Kan ge upphov till extremt konstigt programflöde!',
				score: 9000
			});
		}
	}
];