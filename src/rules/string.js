'use strict';
module.exports = [
    function (o, state, err) {
        if (o.type === 'Literal' && o.raw[0] === '"') {
            err.push({
                file: o.__file__,
                loc: o.loc,
                text: 'Single qoute  \' should be used instead of double qoute \"',
                desc: 'All code should be consistent. And single qoute is easier to write. In js there is no diffrense between single and double qoute.',
                score: 100
            });
        }
    }
];
