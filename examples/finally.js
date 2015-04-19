(function wrapper() {
	'use strict';
	try {
		badFn();
	} catch (e) {
		custom_log(e);
	} finally {
		return;
	}
});