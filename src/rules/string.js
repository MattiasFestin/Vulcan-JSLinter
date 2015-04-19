module.exports = [
	function (o, state, err) {
		if (o.type === 'Literal' && o.raw[0] === '"') {
			err.push({
				file: o.__file__,
				loc: o.loc,
				text: 'Enkel citattecken \' ska användas istället för dubbel \"',
				desc: 'Så all kod är konsikvent. Och enkelcitattecken är enklare att skriva.',
				score: 8
			});
		}
	},

	// function (o, state, err) {
	// 	if (o.type === 'Literal' && o.raw.match('\n')) {
	// 		err.push({
	// 			file: o.__file__,
	// 			loc: o.loc,
	// 			text: 'Multiline sträng ska ej användas.',
	// 			desc: 'En buggig ES5 feature, breakar då om ett tekcen bakom "\\" (t.e.x. whitespace)',
	// 			score: 900
	// 		});
	// 	}
	// }
];