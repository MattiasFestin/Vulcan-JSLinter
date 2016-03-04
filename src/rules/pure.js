'use strict';
module.exports = [
    function (o, state, err) {
        if (o && state.__PURE__ && o.type === 'AssignmentExpression') {
            err.push({
                file: o.__file__,
                loc: o.loc,
                text: 'No assignment is allowed.',
                desc: '',
                score: Number.MAX_SAFE_INTEGER
            });
        }
    },
    function (o, state, err) {
        //[TODO] - Add support for un pure boxed functions
        if (state.__PURE__ && o && o.type && o.argument && o.type === 'ReturnStatement' && !(o.argument.type === 'CallExpression' && o.argument.callee.type === 'MemberExpression' && o.argument.callee.object.name === 'Object' && o.argument.callee.property.name === 'freeze')) {
            err.push({
                file: o.__file__,
                loc: o.loc,
                text: 'All return values, must be wrapped in Object.freeze.',
                desc: '',
                score: Number.MAX_SAFE_INTEGER
            });
        }
    },
    function (o, state, err) {
        //[TODO] - Dissalow non local variables

        if (o && state.__PURE__) {

        }
    }
];
