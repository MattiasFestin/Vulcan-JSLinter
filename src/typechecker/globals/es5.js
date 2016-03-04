var _ = require('lodash'),
    extend = function (o1, o2) {
        'use strict';
        return _.extend(Object.freeze(o1), o2);
    },

    //Global javascript scope
    globals = Object.freeze({
        __type__: globals,

        //values
        Infinity: {__type__: [globals.Number]},
        NaN: {__type__: [globals.Number]},
        undefined: {__type__: globals.undefined},
        null: {__type__: ['*']},

        //functions
        isFinite: {from: [{__type__: [globals.Number]}], to: {__type__: [globals.Boolean]}, __type__: [globals.Function]},
        isNaN: {from: [{__type__: [globals.Number]}], to: {__type__: [globals.Boolean]}, __type__: [globals.Function]},
        parseFloat: {from: [{__type__: [globals.String]}], to: {__type__: [globals.Number]}, __type__: [globals.Function]},
        parseInt: {from: [{__type__: [globals.String]}, {__type__: [globals.Number], optional: true}], to: {__type__: [globals.Number]}, __type__: [globals.Function]},
        decodeURI: {from: [{__type__: [globals.String]}], to: {__type__: [globals.String]}, __type__: [globals.Function]},
        decodeURIComponent: {from: [{__type__: [globals.String]}], to: {__type__: [globals.String]}, __type__: [globals.Function]},
        encodeURIComponent: {from: [{__type__: [globals.String]}], to: {__type__: [globals.String]}, __type__: [globals.Function]},
        escape: {from: [{__type__: [globals.String]}], to: {__type__: [globals.String]}, __type__: [globals.Function]},
        unescape: {from: [{__type__: [globals.String]}], to: {__type__: [globals.String]}, __type__: [globals.Function]},

        //Fundemental objects
        Object: {
            __type__: {from: [], to: {__type__: [globals.Object]}, __type__: [globals.Function]},
            __prototype__: {
                constructor: {from: [], to: {__type__: [globals.Object]}, __type__: [globals.Function]},
                hasOwnProperty: {from: [{__type__: [globals.String]}], to: {__type__: [globals.Boolean]}, __type__: [globals.Function]},
                isPrototypeOf:  {from: [{__type__: [globals.Object]}], to: {__type__: [globals.Boolean]}, __type__: [globals.Function]},
                propertyIsEnumerable:  {from: [{__type__: [globals.String]}], to: {__type__: [globals.Boolean]}, __type__: [globals.Function]},
                toLocaleString: {from: [], to: {__type__: [globals.String]}, __type__: [globals.Function]},
                toString: {from: [], to: {__type__: [globals.String]}, __type__: [globals.Function]},
                valueOf: {from: [], to: {__type__: [globals.Object]}, __type__: [globals.Function]}
            },
            assign: {from: [{__type__: [globals.Object], rest: true}], to: {__type__: [globals.Object]}, __type__: [globals.Function]},
            //TODO add support for property object
            create: {from: [{__type__: [globals.Object]}, {__type__: [globals.Object]}], to: {__type__: [globals.Object]}, __type__: [globals.Function]},
            defineProperty: {from: [{__type__: [globals.Object]}, {__type__: [globals.String]}, {__type__: [globals.Object]}], to: {__type__: [globals.Object]}, __type__: [globals.Function]},
            defineProperties: {from: [{__type__: [globals.Object]}, {__type__: [globals.Object]}], to: {__type__: [globals.Object]}, __type__: [globals.Function]},
            freeze: {from: [{__type__: [globals.Object]}, {__type__: [globals.Object]}], to: {__type__: [globals.Object]}, __type__: [globals.Function]},
            getOwnPropertyDescriptor: {from: [{__type__: [globals.Object]}, {__type__: [globals.String]}], to: {__type__: [globals.Object]}, __type__: [globals.Function]},
            getOwnPropertyNames: {from: [{__type__: [globals.Object]}, {__type__: [globals.String]}], to: {__type__: [[globals.String]]}, __type__: [globals.Function]},
            //getOwnPropertySymbols: {from: [{__type__: 'Object'}, {__type__: [globals.String]}], to: ['Symbol[]'], __type__: [globals.Function]},
            getPrototypeOf: {from: [{__type__: [globals.Object]}], to: {__type__: [globals.Object]}, __type__: [globals.Function]},
            //is:
            isExtensible: {from: [{__type__: [globals.Object]}], to: {__type__: [globals.Boolean]}, __type__: [globals.Function]},
            isFrozen: {from: [{__type__: [globals.Object]}], to: {__type__: [globals.Boolean]}, __type__: [globals.Function]},
            isSealed: {from: [{__type__: [globals.Object]}], to: {__type__: [globals.Boolean]}, __type__: [globals.Function]},
            keys: {from: [{__type__: [globals.Object]}], to: {__type__: [[globals.String]]}, __type__: [globals.Function]},
            length: [globals.Number],
            preventExtensions: {from: [{__type__: [globals.Object]}], to: {__type__: [globals.Object]}, __type__: [globals.Function]},
            seal: {from: [{__type__: [globals.Object]}], to: {__type__: [globals.Object]}, __type__: [globals.Function]},
            //setPrototypeOf
        },

        Function: {
            __type__: {from: [], to: {__type__: [globals.Function]}, __type__: [globals.Function]},
            length: [globals.Number],
            name: [globals.String],
            displayName: [globals.String],

            //[TODO]
            // proto__type__: {
            //     _proto_: globals.Object.prototype
            //     // apply()
            //     // bind()
            //     // call()
            //     // toString()
            // }
        },

        Boolean: {
            __type__: {from: [], to: {__type__: [globals.Error]}, __type__: [globals.Function]},
            __prototype__: globals.Function,

            length: [globals.Number]
        },

        Error: {
            __type__: {from: [], to: {__type__: [globals.Error]}, __type__: [globals.Function]},
            __prototype__: extend(globals.Function, {
                _proto_: globals.Object,
                message: [globals.String],
                lineNumber: [globals.Number],
                columnNumber: [globals.Number],
                stack: [globals.String],

                toString: {from: [], to: {__type__: [globals.String]}, __type__: [globals.Function]},
            })
        },

        EvalError: {
            __type__: {from: [], to: {__type__: [globals.EvalError]}, __type__: [globals.Function]},
            __prototype__: globals.Error.prototype
        },

        RangeError: {
            __type__: {from: [], to: {__type__: [globals.RangeError]}, __type__: [globals.Function]},
            __prototype__: globals.Error.prototype
        },

        ReferenceError: {
            __type__: {from: [], to: {__type__: [globals.ReferenceError]}, __type__: [globals.Function]},
            __prototype__: globals.Error.prototype
        },

        SyntaxError: {
            __type__: {from: [], to: {__type__: [globals.SyntaxError]}, __type__: [globals.Function]},
            __prototype__: globals.Error.prototype
        },

        TypeError: {
            __type__: {from: [], to: {__type__: [globals.TypeError]}, __type__: [globals.Function]},
            __prototype__: globals.Error.prototype
        },

        URIError: {
            __type__: {from: [], to: {__type__: [globals.URIError]}, __type__: [globals.Function]},
            __prototype__: globals.Error.prototype
        },

        Number: {
            __type__: {from: [], to: {__type__: [globals.Number]}, __type__: [globals.Function]},
            // EPSILON: [globals.Number],
            // MAX_SAFE_INTEGER : [globals.Number],
            MAX_VALUE : [globals.Number],
            MIN_VALUE : [globals.Number],
            NaN: [globals.Number],
            NEGATIVE_INFINITY: [globals.Number],
            POSITIVE_INFINITY: [globals.Number],

            __prototype__: {
                toExponential: {from: [], to: {__type__: [globals.String]}, __type__: [globals.Function]},
                toFixed: {from: [], to: {__type__: [globals.String]}, __type__: [globals.Function]},
                toLocaleString: {from: [], to: {__type__: [globals.String]}, __type__: [globals.Function]},
                toPrecision: {from: [], to: {__type__: [globals.String]}, __type__: [globals.Function]},
                toString: {from: [], to: {__type__: [globals.String]}, __type__: [globals.Function]},
                valueOf: {from: [], to: {__type__: [globals.Number]}, __type__: [globals.Function]},
            },

            // isNaN: {from: [], to: {__type__: [globals.Boolean]}, __type__: [globals.Function]},
            // isFinite: {from: [], to: {__type__: [globals.Boolean]}, __type__: [globals.Function]},
            // isInteger: {from: [], to: {__type__: [globals.Boolean]}, __type__: [globals.Function]},
            // isSafeInteger: {from: [], to: {__type__: [globals.Boolean]}, __type__: [globals.Function]},
            // parseFloat: {from: [{__type__: [globals.String]}], to: {__type__: [globals.Number]}, __type__: [globals.Function]},
            // parseInt: {from: [{__type__: [globals.String]}, {__type__: [globals.Number], optional: true}], to: {__type__: [globals.Number]}, __type__: [globals.Function]}
        },

        Math: {
            E: [globals.Number],
            LN2: [globals.Number],
            LN10: [globals.Number],
            LOG2E: [globals.Number],
            LOG10E: [globals.Number],
            PI: [globals.Number],
            SQRT1_2: [globals.Number],
            SQRT2: [globals.Number],

            abs: {from: [{__type__: [globals.Number]}], to: {__type__: [globals.Number]}, __type__: [globals.Function]},
            acos: {from: [{__type__: [globals.Number]}], to: {__type__: [globals.Number]}, __type__: [globals.Function]},
            //acosh: {from: [{__type__: [globals.Number]}], to: {__type__: [globals.Number]}, __type__: [globals.Function]},
            asin: {from: [{__type__: [globals.Number]}], to: {__type__: [globals.Number]}, __type__: [globals.Function]},
            asinh: {from: [{__type__: [globals.Number]}], to: {__type__: [globals.Number]}, __type__: [globals.Function]},
            atan: {from: [{__type__: [globals.Number]}], to: {__type__: [globals.Number]}, __type__: [globals.Function]},
            //atanh: {from: [{__type__: [globals.Number]}], to: {__type__: [globals.Number]}, __type__: [globals.Function]},
            atanv2: {from: [{__type__: [globals.Number]},{__type__: [globals.Number]}], to: {__type__: [globals.Number]}, __type__: [globals.Function]},
            cos: {from: [{__type__: [globals.Number]}], to: {__type__: [globals.Number]}, __type__: [globals.Function]},
            //clz32
            //cbrt
            exp: {from: [{__type__: [globals.Number]},{__type__: [globals.Number]}], to: {__type__: [globals.Number]}, __type__: [globals.Function]},
            //expm1
            floor: {from: [{__type__: [globals.Number]}], to: {__type__: [globals.Number]}, __type__: [globals.Function]},
            //fround
            //hypot
            //imul
            log: {from: [{__type__: [globals.Number]}], to: {__type__: [globals.Number]}, __type__: [globals.Function]},
            // log10: {from: [{__type__: [globals.Number]}], to: {__type__: [globals.Number]}, __type__: [globals.Function]},
            // log1p: {from: [{__type__: [globals.Number]}], to: {__type__: [globals.Number]}, __type__: [globals.Function]},
            // log2: {from: [{__type__: [globals.Number]}], to: {__type__: [globals.Number]}, __type__: [globals.Function]},
            max: {from: [{__type__: [globals.Number], rest: true}], to: {__type__: [globals.Number]}, __type__: [globals.Function]},
            min: {from: [{__type__: [globals.Number], rest: true}], to: {__type__: [globals.Number]}, __type__: [globals.Function]},

            pow: {from: [{__type__: [globals.Number]},{__type__: [globals.Number]}], to: {__type__: [globals.Number]}, __type__: [globals.Function]},

            random: {from: [], to: {__type__: [globals.Number]}, __type__: [globals.Function]},
            round: {from: [{__type__: [globals.Number]}], to: {__type__: [globals.Number]}, __type__: [globals.Function]},

            //sign: {from: [{__type__: [globals.Number]}], to: {__type__: [globals.Number]}, __type__: [globals.Function]},
            sin: {from: [{__type__: [globals.Number]}], to: {__type__: [globals.Number]}, __type__: [globals.Function]},
            //sinh: {from: [{__type__: [globals.Number]}], to: {__type__: [globals.Number]}, __type__: [globals.Function]},
            sqrt: {from: [{__type__: [globals.Number]}], to: {__type__: [globals.Number]}, __type__: [globals.Function]},
            tan: {from: [{__type__: [globals.Number]}], to: {__type__: [globals.Number]}, __type__: [globals.Function]},
            //tanh: {from: [{__type__: [globals.Number]}], to: {__type__: [globals.Number]}, __type__: [globals.Function]},
            //trunc: {from: [{__type__: [globals.Number]}], to: {__type__: [globals.Number]}, __type__: [globals.Function]}
        },

        Date: {
            __type__: [
                {from: [{__type__: globals.Number}], to: {__type__: [globals.Date]}, __type__: [globals.Function]},
                {from: [{__type__: globals.String}], to: {__type__: [globals.Date]}, __type__: [globals.Function]},
                {from: [{__type__: globals.Number},{__type__: globals.Number},{__type__: globals.Number, optional: true},{__type__: globals.Number, optional: true},{__type__: globals.Number, optional: true},{__type__: globals.Number, optional: true},{__type__: globals.Number, optional: true}], to: {__type__: [globals.Date]}, __type__: [globals.Function]},
            ]
        }
    }),

    __operators__ = Object.freeze({
        precedence: [
            'expr.GroupingExpression',
            'expr.MemberExpression',
            'expr.NewExpression_w_args',
            'expr.CallExpression',
            'expr.NewExpression_wo_args',
            'unary_post.++',
            'unary_post.++',
            'unary_pre.!',
            'unary_pre.~',
            'unary_pre.+',
            'unary_pre.-',
            'unary_pre.typeof',
            'unary_pre.void',
            'unary_pre.delete',
            'binary.*',
            'binary./',
            'binary.%',
            'binary.+',
            'binary.-',
            'binary.<<',
            'binary.>>',
            'binary.<<<',
            'binary.<',
            'binary.<=',
            'binary.>',
            'binary.>=',
            'binary.in',
            'binary.instanceof',
            'binary.==',
            'binary.!=',
            'binary.===',
            'binary.!==',
            'binary.&',
            'binary.^',
            'binary.|',
            'binary.&&',
            'binary.||',
            'assignment.=',
            'assignment.+=',
            'assignment.-=',
            'assignment.*=',
            'assignment./=',
            'assignment.%=',
            'assignment.<<=',
            'assignment.>>=',
            'assignment.>>>=',
            'assignment.&=',
            'assignment.^=',
            'assignment.|=',
            //'yeild',
            //'spread',
            'expr.SequenceExpression'
        ],
        unaryPre: {
            '+': [globals.Number],
            '-': [globals.Number],
            '~': [globals.Number],
            '!': [globals.Boolean],
            '++': [globals.Number],
            '--': [globals.Number],
            'delete': [globals.Boolean],
            'typeof': [globals.String],
            'void': [globals.undefined]
        },
        unaryPost: {
            '++': [globals.Number],
            '--': [globals.Number]
        },
        binary: {
            '+': [globals.Number, globals.String],
            '-': [globals.Number],
            '*': [globals.Number],
            '/': [globals.Number],
            '%': [globals.Number],
            '&': [globals.Number],
            '|': [globals.Number],
            '^': [globals.Number],
            '<<': [globals.Number],
            '>>': [globals.Number],
            '>>>': [globals.Number],
            '&&': ['*'],
            '||': ['*'],
            'in': [globals.Boolean],
            'instanceof': [globals.Boolean],
            '==': [globals.Boolean],
            '!=': [globals.Boolean],
            '===': [globals.Boolean],
            '!==': [globals.Boolean],
            '>': [globals.Boolean],
            '<': [globals.Boolean],
            '>=': [globals.Boolean],
            '<=': [globals.Boolean]
        },

        assignment: {
            '=': ['*'],
            '+=': [globals.Number, globals.String],
            '-=': [globals.Number],
            '*=': [globals.Number],
            '/=': [globals.Number],
            '%=': [globals.Number],
            '<<=': [globals.Number],
            '>>=': [globals.Number],
            '>>>=': [globals.Number],
            '&=': [globals.Number],
            '|=': [globals.Number],
            '^=': [globals.Number]
        }
    });

module.exports = {
    globals: Object.create(globals),
    __operators__: Object.create(__operators__)
};
