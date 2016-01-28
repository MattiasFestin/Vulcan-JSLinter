'use strict';

module.exports = [
    function (o, state, err) {
        if (o.type === 'FunctionExpression' && o.id === null) {
            err.push({
                file: o.__file__,
                loc: o.loc,
                text: 'A anonymous function should be named.',
                desc: 'When an exception is thrown then the name of the function is in the call stack. Which makes debugging easier, especialy for asyncronious code.',
                score: 100
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
                        text: '\'use strict\' should be used.',
                        desc: '[TODO]',
                        score: 100
                    });
                } else {
                    if (state.isStrict) {
                        err.push({
                            file: o.__file__,
                            loc: firstStatement.loc,
                            text: '\'use strict\' should not be nested. This line has no effect, it only takes up space and is confusing.',
                            desc: '[TODO]',
                            score: 100
                        });
                    } else {
                        state.isStrict = true;
                    }
                }
            }
        }
    }
];
