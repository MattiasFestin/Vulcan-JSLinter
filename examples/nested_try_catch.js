var d;
try {
	(function myClosureFn() {
		'use strict';
		try {
			d();
		} catch (e) {
			d();
		}
	}());
} catch (e) {
	d();
}