'use strict';

var globals = require('./globals/es5.js'),
    state = {},
    strict = {
        array: false,
        member: true
    };

var traverse = function traverse(node, func, fileSrc, state) {
    state = state || {};

    node.__file__ = fileSrc;

    func(node, state, err);
    node.__state__ = state || {};//JSON.parse(JSON.stringify(state || {}));

    for (var key in node) {
        if (node.hasOwnProperty(key) && !key.match(/^(__|loc$)/)) {
            var child = node[key];
            if (typeof child === 'object' && child !== null) {

                if (Array.isArray(child)) {
                    child.forEach(function(childNode) {
						if (child) {
                        	childNode.__parent__ = node;
						}
                        traverse(childNode, func, fileSrc, node.__state__);
                    });
                } else {
					if (child) {
                    	child.__parent__ = node;
					}
                    traverse(child, func, fileSrc, node.__state__);
                }
            }
        }
    }
};

var resolveType = function resolveType (t1, t2) {
    t1 = t1 || ['*'];
    t2 = t2 || ['*'];

    var retVal = [];

    //[TODO] add prototype lookup in intersection

    if (_.contains(t1, '*')) {
        retVal = t2;
    } else if (_.contains(t2, '*')) {
        retVal = t1;
    } else {
        retVal = _.intersection(t1, t2);
    }

    return retVal;
};

//[TODO]
var parse = function parse(ast, state, fileSrc) {
    state = state || {};
    ast.__file__ = fileSrc || ast.__parent__.__file__;

    if (parse[ast.type]) {
        parse[ast.type](ast, state);
    }

    if (Array.isArray(ast)) {
        ast = ast.map(function (el) {
			if (el) {
            	el.__parent__ = ast;
			}
            parse(el, Object.create(state));
        });
    } else {
        Object.keys(ast)
            .filter(function (key) {
                return !key.match(/^(__|loc$|errors$|comments$|range$)/);
            })
            .forEach(function (key) {
                var child = ast[key];
				if (child) {
                	child.__parent__ = ast;
				}
                child = parse(child, Object.create(state));
                ast[key] = child;
            });
    }

    return ast.__type__;
};

parse.Literal = function (ast) {
    var type = eval(ast.value).constructor.name;
    ast.__type__ = globals[type] || globals[type[0].toUpperCase() + type.substr(1)];
};

parse.ArrayExpression = function (ast) {
    var firstEl;

    if (ast.elements.length > 0) {
        ast.elements.map(parse)
        firstEl = ast.elements[0];
        ast.__type__ = ast.elements.every(function (el) {
            return el.__type__ === firstEl.__type__;
        }) ? firstEl.__type__ : (strict.array ? [] : ['*']);
    } else {
        ast.__type__ = ['*'];
    }
};

parse.ObjectExpression = function (ast) {
    ast.__type__ = {__type__: globals.Object};
    _.forEach(ast.properties, function (p) {
        ast.__type__[p.key] = parse(p.value);
    });
};

parse.ThisExpression = function (ast) {
    //[TODO]
    ast.__type__ = [];
};

parse.SequenceExpression = function (ast) {
    ast.__type__ = parse(_.last(ast.expressions));
};

parse.ConditionalExpression = function (ast) {
    ast.__type__ = resolveType(parse(ast.consequent), parse(ast.alternate));
};

parse.Identifier = function (ast) {
    ast.__type__ = (name === 'window') ?
        globals :
        globals[ast.property.name] || [];
};

parse.MemberExpression = function (ast) {
    var retVal;
    if (ast.property.type === 'Literal') {
        ast.__type__ = parse(ast.object)[ast.property.value];
    } else {
        //[FIXME]
        console.error('Could not infere type');
        ast.__type__ = strict.member ? [] : ['*'];
    }
};

parse.AssignmentExpression = function (ast) {
    parse(ast.right);
    ast.left.__type__ = ast.right.__type__;
};

parse.BinaryExpression = function (ast, state) {
    ast.__type__ = resolveType(ast.__type__, globals.__operators__.binary[ast.operator]);
};

parse.UnaryExpression = function (ast, state) {
    ast.__type__ = resolveType(ast.__type__, globals.__operators__.unary[ast.operator]);
};

parse.CallExpression = function (ast) {
    ast.__type__ = resolveType(ast.__type__, globals.__operators__.binary[ast.operator]);
};

module.exports = parse;