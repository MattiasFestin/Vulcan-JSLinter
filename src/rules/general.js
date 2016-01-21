'use strict';
module.exports = [
    function (o, state, err) {
        if (o.type === 'Program' && o.body.length === 0) {
            err.push({
                file: o.__file__,
                loc: o.loc,
                text: 'Empty files should not exsist.',
                desc: 'They contribute to wasted time then navigating. Remove the file or put some logic or a TODO comment inside it.Det orsakar tidsslöseri när man navigerar runnt i koden. Ta bort fil eller byt filändelse.',
                score: 1000
            });
        }
    },

    function (o, state, err) {
        if (o.type === 'BinaryExpression' && ['===', '!==', '<', '<=', '>', '>=', '+', '-', '/', '*'].indexOf(o.operator) > -1 && o.left.type === 'Literal' && o.right.type === 'Literal') {
            err.push({
                file: o.__file__,
                loc: o.loc,
                text: o.operator + ' should not be used between two literal values.',
                desc: o.left.value + ' ' + o.operator + ' ' + o.right.value + ' will always produce the same value. Insert the value "' + eval(o.left.value + ' ' + o.operator + ' ' + o.right.value) + '" instead.',
                score: 1000
            });
        }
    },

    function (o, state, err) {
        if (o.type === 'Program' && o.body[0] && o.body[0].type === 'ExpressionStatement' && o.body[0].expression.value === 'use strict') {
            state.isStrict = true;

            err.push({
                file: o.__file__,
                loc: o.loc,
                text: '"use strict" should only be used in a function context and not js file context.',
                desc: 'Could produce bugs when concatinateing js files with 3:rd party code that is not ES5 strict complient.',
                score: 100
            });
        }
    },

    function (o, state, err) {
        if (o.type === 'TryStatement') {

            if (state.tryBlock) {
                err.push({
                    file: o.__file__,
                    loc: o.loc,
                    text: 'Try-Catch block should not be nested.',
                    desc: 'Use a single Try-Catch block at top of the call hiarchy in your application. This is where you handle your exceptions.',
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
                text: 'finally should never ever be used in JS!.',
                desc: 'Can give really strange program flow. Watch https://youtu.be/2pL28CcEijU?t=1294',
                score: 9000
            });
        }
    }
];
