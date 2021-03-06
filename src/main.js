#!/usr/bin/env node
'use strict';

//Global modules
var colors = require('colors'),
    program = require('commander'),
    esprima = require('esprima'),
    vinylfs = require('vinyl-fs'),
    _ = require('lodash'),
    fs = require('fs'),
    childProcess = require('child_process'),
    events = new (require('events').EventEmitter)();


//Local modules
var rules = [].concat(
        require('./rules/general.js'),
        require('./rules/function.js'),
        require('./rules/string.js'),
        require('./rules/number.js'),
        require('./rules/loop&controll.js'),
        require('./rules/object.js'),
        require('./rules/complexity.js'),
        require('./rules/pure.js')
    ),
    generateReport = require('./generateReport'),
    astHelper = require('./util/astHelper.js'),
    eslinter = require('./rules/eslinter.js');

//Local state
var err = [],
    report = {},
    eslintConfig = require('./config/eslint.json');


//Remove all disabled keys
_.forEach(eslintConfig, function (key, value) {
    if (_.isObject(value)) {
        delete eslintConfig[key];
    }
});


//CLI praser
program
    .version('0.0.1')
    .option('-c, --config [path]', 'The path of the vulcanrc file.')
    .option('-d, --dir [value]', 'Directories to search after js files.')
    .option('-o, --output [path]', 'Directory to write report.json file.')
    .option('-e, --env [value]', 'The runtime enveoroment for the javascript.')
    .option('-v, --verbose', 'Verbose output to console.')
    .option('-s, --summarary', 'Print only when enforced rules are broken.')
    .option('--dev', 'Developer mode, console and debugger is allowed.')
    .option('--pure', 'Pure mode.')
    .option('--watch', 'Watch the files.')
    .parse(process.argv);

program.env = program.env || ['browser'];

if (!Array.isArray(program.env)) {
    program.env = [program.env];
}


console.log('checking for rc file:', process.cwd());
if (fs.existsSync('.vulcanrc') && !program.dir) {
    console.log('found rc file!');
    _.extend(program, JSON.parse(fs.readFileSync('.vulcanrc', 'utf-8')));
}

//Load globals
// eslintConfig.globals = {};

program.dir = program.dir || './**/*.js';
program.dir = _.flatten([program.dir, '!node_modules/', '!bower_components/']);

var _program = program;

//Main function
var runner = function runnerFn(program) {
    program = program || _program;

    err = [];
    vinylfs.src(program.dir)
        .on('data', function onDataFn (file) {
            if (fs.statSync(file.path).isFile()) {
                var numberOfErrors = err.length;
                try {
                    var code = fs.readFileSync(file.path, 'utf-8');
                    var ast = esprima.parse(code, {
                        loc: true,
                        comment: true,
                        tolerant: true
                    });
                    if (ast) {
                        ast.__parent__ = {};
                    }

                    ast.errors.forEach(function (e) {
                        //Syntaxfel som inte går att parsa
                        err.push({
                            file: file.path,
                            loc: {
                                start: {lineNumber: NaN, column: e.column},
                                end: {lineNumber: NaN, column: e.column}
                            },
                            stack: e.stack,
                            text: 'SYNTAX ERROR',
                            desc: e.description,
                            score: Math.pow(2,50)
                        });
                    });
                    rules.forEach(function (fn) {
                        //Kör alla regler
                        astHelper.traverse(ast, fn, {
                            err: err,
                            fileSrc: file.path,
                            state: {
                                __PURE__: !!program.pure,
                                env: program.env,
                                devMode: program.dev
                            }
                        });
                    });

                    eslinter(code, file.path, program, eslintConfig, err);
                } catch (e) {
                    if (require.main === module) { console.error('SYNTAX ERROR:' + e + '\n' + e.stack); }
                    err.push({
                        file: file.path,
                        stack: e.stack,
                        loc: {
                            start: {lineNumber: NaN, column: e.column},
                            end: {lineNumber: NaN, column: e.column}
                        },
                        text: 'SYNTAX ERROR',
                        desc: e.description,
                        score: Math.pow(2,50)
                    });
                }

                if (numberOfErrors === err.length) {
                    err.push({
                        file: file.path,
                        score: 0
                    });
                }
                numberOfErrors = err.length;
            }

        })
        .on('end', function onEndFn () {
            report = generateReport.generate(err);

            var isValid = true;
            if (program.enforce && program.enforce.quality) {
                if (program.enforce.quality.file) {
                    isValid = isValid && !report.files.some(function (f) {
                        return f.score <= program.enforce.quality.file.score ||
                            f.maintainability <= program.enforce.quality.file.maintainability;
                    });
                }
            }

            if (require.main === module) {
                console.log('Generateing report...'.underline.gray);
                generateReport.print(program, report);
            } else {
                events.emit('report', report);
                if (!isValid) {
                    events.emit('error', 'Don\'t meet the standard that is enforced');
                }
            }

            if (program.output) {
                typeof program.output === 'string' ? program.output : './report.json';
                fs.writeFile(program.output, JSON.stringify(report, true, 4), 'utf-8');
            }

            if (!isValid && require.main === module && !program.watch) {
                console.log('Don\'t meet the standard that is enforced!'.bold.red.inverse);
                console.log('Exited with code 1');
                process.exit(1);
            }
        })
        .on('error', function onErrorFn (err) {
            if (require.main === module) { console.error(err); }
            events.emit('error', err);
        });
};

if (require.main === module) {
    //Run
    runner();

    //Output for unix interop
    events.on('error', function (e) {
        process.stderr.write(e);
    });
    events.on('report', function (r) {
        process.stdout.write(r);
    });
}

if (program.watch) {
    //Run runner if files changes
    vinylfs.watch(program.dir, runner);
}



module.exports = {
    run: runner,
    events: events
};
