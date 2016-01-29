'use strict';

var _ = require('lodash'),
	t = require('traverse');

var scrubb = function scrubbFn (o) {
	return t(o).map(function (x) {
    	if (this.circular) {
    		this.remove();
    	}
	});
};

var clone = _.cloneDeep;


var memberExprToArr = function memberExprToArrFn(o) {
	var value = [];
	if (o.type === 'MemberExpression') {
		value.push(memberExprToArrFn(o.object));
		value.push(memberExprToArrFn(o.property));
	} else if (o.type === 'Identifier') {
		value.push(o.name);
	}

	return _.flattenDeep(value);
};

var memberExprToStr = function memberExprToStrFn(o) {
	return memberExprToArr(o).join('.');
};

var traverse = function traverseFn(node, func, opt) {
	opt = opt || {};
	if (node) {
		opt.state = node.__state__ || opt.state || {};
		node.__file__ = node.__file__ || opt.fileSrc;

		func.call(this, node, opt.state, opt.err);
		node.__state__ = opt.state;

		var eachChild = function(optChild) {
			return function (childNode) {
				if (childNode) {
					childNode.__parent__ = node;
				}
				traverseFn(childNode, optChild.func, {
					err: opt.err,
					fileSrc: optChild.fileSrc,
					state: optChild.node.__state__
				});
			};
		};

		for (var key in node) {
			if (node.hasOwnProperty(key) && !key.match(/^(__|loc$|errors$|comments$|range$)/)) {
				var child = node[key];
				if (typeof child === 'object' && child !== null) {

					if (Array.isArray(child)) {
						child.forEach(eachChild({
							func: func,
							fileSrc: opt.fileSrc,
							node: node
						}));
					} else {
						if (child) {
							child.__parent__ = node;
						}
						traverseFn(child, func, {
							err: opt.err,
							fileSrc: opt.fileSrc,
							state: node.__state__
						});
					}
				}
			}
		}
	}
};

var findChild = function (o, type) {
	var value = false;

	var c = clone(o);
	if (c) {
		c.__parent__ = undefined;
	}

	c = scrubb(c);
	traverse(c, function (x) {
		if (x && x.type === type) {
			value = true;
		}
	});

	return value;
};

module.exports = {
	clone: clone,
	scrubb: scrubb,
	traverse: traverse,
	findChild: findChild,
	memberExprToArr: memberExprToArr,
	memberExprToStr: memberExprToStr
};