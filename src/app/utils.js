define([], function() {
	Tech.utils = new function() {
		this.getRandom = function(min, max) {
			return Math.random() * (max - min) + min;
		}
		this.degToRad = function (deg) {
			return deg * (Math.PI/180)
		}
	}
	return Tech.utils;
});