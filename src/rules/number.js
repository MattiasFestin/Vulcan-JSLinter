'use strict';
module.exports = [
    function (o, state, err) {
        if (o.type === 'UpdateExpression' && ['++', '--'].indexOf(o.operator) > -1) {
            if (o.__parent__.type === 'WhileStatement') {
                err.push({
                    file: o.__file__,
                    loc: o.loc,
                        text: o.operator[0] + '= should be used instead in the begining or end of the loop. Use these comparison operators instead: (dvs: <, <=, ===, >=, >, !==)',
                    desc: 'Removes the problem of choosing wrong order of operations because of pre/post increment/decrement.',
                    score: 100
                });
            } else {
                err.push({
                    file: o.__file__,
                    loc: o.loc,
                    text: o.operator[0] + '= should be used instead.',
                    desc: 'Removes the problem of choosing wrong order of operations because of pre/post increment/decrement.',
                    score: 80
                });
            }
        }
    }
];
