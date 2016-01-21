'use strict';
module.exports = [
    function (o, state, err) {
        if (o.type === 'ForStatement' || o.type === 'DoWhileStatement') {
            err.push({
                file: o.__file__,
                loc: o.loc,
                text: 'The only permited loop type is while.',
                desc: 'The other loop types is hard to read. And they do the same as a while with more syntax. Use instead .forEach, .map, .filter, .reduce functions on the Array prototype instead.',
                score: 100
            });
        }
    },

    function (o, state, err) {
        if (o.type === 'ContinueStatement') {
            err.push({
                file: o.__file__,
                loc: o.loc,
                text: 'continue should not be used.',
                desc: 'Use a if statement that surounds the logic instead. The code becomes "jumpy" and hard to follow. It behaves almost like a GOTO which is BAD!',
                score: 1000
            });
        }
    },

    function (o, state, err) {
        if (o.type === 'BlockStatement' && o.body.length === 0) {
            err.push({
                file: o.__file__,
                loc: o.loc,
                text: 'Empty code blocs should not exsit.',
                desc: 'If it is a if/else-if where only else is used, then negate the statment and remove the else block. Otherwise it serves no purpose, remove it!',
                score: 1000
            });
        }
    }
];
