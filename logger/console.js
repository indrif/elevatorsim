define(function () {
	var colors = require("colors");

	return function () {
		this.info = function (s) {
			console.log(s.blue);
		};
		this.log = function (s) {
			console.log(s.white);
		};
		this.error = function (s) {
			console.log(s.red);
		};
		this.success = function (s) {
		};
	};
});
