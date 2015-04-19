'use strict';
module.exports = [
	function (o, state, err) {
		if (o.type === 'UpdateExpression' && ['++', '--'].indexOf(o.operator) > -1) {
			if (o.__parent__.type === 'WhileStatement') {
				err.push({
					file: o.__file__,
					loc: o.loc,
					text: o.operator[0] + '= ska användas istället i slutet av loopen. Använd jämförelseoperator istället i test vilkoret!',
					desc: 'Pga att går inte göra fel med post/pre ökning. Minskar risken för out of bounds error i loopen.',
					score: 80
				});
			} else {
				err.push({
					file: o.__file__,
					loc: o.loc,
					text: o.operator[0] + '= ska användas istället.',
					desc: 'Pga att går inte göra fel med post/pre ökning. Samt det går enkelt ändra om ett annat antal ska ökas.',
					score: 80
				});
			}
		}
	}

	// function (o, state, err) {
	// 	if (o.type === 'CallExpression' && o.callee.name === 'parseInt' && o.arguments.length === 1) {
	// 		err.push({
	// 			file: o.__file__,
	// 			loc: o.loc,
	// 			text: 'Lägg till extra parameter för att ange vilken bas som ska användas (radix parameter)',
	// 			desc: 'Pga att om strängen har en inledande nolla så tolkas det som en oktal siffra.',
	// 			score: 80
	// 		});
	// 	}
	// },

	// function (o, state, err) {
	// 	if (o.type === 'BinaryExpression' && (o.left.name === 'NaN' || o.right.name === 'NaN')) {
	// 		err.push({
	// 			file: o.__file__,
	// 			loc: o.loc,
	// 			text: 'Om du vill utföra jämförelseoperator med NaN, använd "typeof x === \'number\' && isNaN(x)"',
	// 			desc: 'Pga att NaN inte går att jämföra mot. (isNaN typkonverterar automatiskt till ett nummer. Det är därför typeof kontrollen behövs vid användning av isNaN)',
	// 			score: 80
	// 		});
	// 	}
	// }
];