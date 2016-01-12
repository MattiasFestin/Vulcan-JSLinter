'use strict';
module.exports = [
    // function (o, state, err) {
    //  if (o.type === 'IfStatement' && o.test.type === 'AssignmentExpression') {
    //      err.push({
    //          file: o.__file__,
    //          loc: o.loc,
    //          text: 'Tilldelning ska ej finnas i condition i if/else if.',
    //          desc: 'Koden blir svår att läsa och lätt att misstolka! Om du ville tilldela värdet gör det innan denna rad. Annars använd YODA expression istället!',
    //          score: 900
    //      });
    //  }
    // },

    // function (o, state, err) {
    //  if (o.type === 'SwitchStatement' && o.discriminant.type === 'AssignmentExpression') {
    //      err.push({
    //          file: o.__file__,
    //          loc: o.loc,
    //          text: 'Tilldelning ska ej finnas i condition i switch.',
    //          desc: 'Koden blir svår att läsa och lätt att misstolka! Om du ville tilldela värdet gör det innan denna rad. Annars använd YODA expression istället!',
    //          score: 9000
    //      });
    //  }
    // },

    // function (o, state, err) {
    //  if (o.type === 'WhileStatement' && o.test.type === 'AssignmentExpression') {
    //      err.push({
    //          file: o.__file__,
    //          loc: o.loc,
    //          text: 'Tilldelning ska ej finnas i condition i while.',
    //          desc: 'Koden blir svår att läsa och lätt att misstolka! Om du ville tilldela värdet gör det innan denna rad. Annars använd YODA expression istället!',
    //          score: 9000
    //      });
    //  }
    // },

    function (o, state, err) {
        if (o.type === 'ForStatement' || o.type === 'DoWhileStatement') {
            err.push({
                file: o.__file__,
                loc: o.loc,
                text: 'Den enda tillåtna loop typen är WHILE.',
                desc: 'De andra looptyperna är svårare att läsa och är while-loopar med extra syntax. Använd .forEach, .map, .filter, .reduce funktionerna för array:er istället.',
                score: 100
            });
        }
    },

    function (o, state, err) {
        if (o.type === 'ContinueStatement') {
            err.push({
                file: o.__file__,
                loc: o.loc,
                text: 'Continue ska inte användas.',
                desc: 'Använd if satser som omsluter logiken istället. Koden blir "hoppig" och svår att följa med continue.',
                score: 1000
            });
        }
    },

    function (o, state, err) {
        if (o.type === 'BlockStatement' && o.body.length === 0) {
            err.push({
                file: o.__file__,
                loc: o.loc,
                text: 'Tomma kodblock ska ej förekomma.',
                desc: 'Om det är en if/else-if sats, så negera logiken, och ta bort blocket. Annars om syfte saknas så ta bort detta block!.',
                score: 1000
            });
        }
    }
];
