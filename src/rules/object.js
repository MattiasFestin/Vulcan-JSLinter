'use strict';

var astHelper = require('../util/astHelper.js');


module.exports  = [
	// function modifyNativePrototypesFn(o, state, err, text) {
	// 	var nativeObjects = ['Object', 'Array', 'Function', 'Number', 'RegExp', 'Boolean', 'Error', 'EvalError', 'InternalError', 'RangeError', 'ReferenceError', 'SyntaxError', 'TypeError', 'URIError'];

	// 	if (o.type === 'AssignmentExpression' && o.left.type === 'MemberExpression' && o.left.object.object && nativeObjects.indexOf(o.left.object.object.name) > -1 && o.left.object.property.name === 'prototype') {			
	// 		var path = astHelper.memberExprToStr(o.left);
	// 		err.push({
	// 			file: o.__file__,
	// 			loc: o.loc,
	// 			text: 'Native prototypes ska ej modifieras.',
	// 			desc: 'Kan ge kompabilitetsproblem mellan olika ramverk, samt framtida javascript versioner. Om du är säker på du håller på med. Lägg till en if sats som kontrollerar existensen runt isf. Ex: "if (' + path + ' === undefined) { ' + path + ' = ...; }"',
	// 			score: 9000
	// 		});
	// 	}
	// },

	// function nonDynamicPropertyLookup(o, state, err, text) {
	// 	if (o.type === 'MemberExpression' && o.computed) {
	// 		var dynamicAccess = astHelper.findChild(o.property, 'Identifier') || astHelper.findChild(o.property, 'MemberExpression');
	// 		if (!dynamicAccess) {
	// 			err.push({
	// 				file: o.__file__,
	// 				loc: o.loc,
	// 				text: 'Använd "dot notation" vid icke dynamiska "property lookups".',
	// 				desc: 'För att koden blir mer lättläst.',
	// 				score: 300
	// 			});
	// 		}
	// 	}
	// }
];