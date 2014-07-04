define(function() {
	return function() {
		var timeline = [];

		console.info("Stats collection enabled");

		this.onTick = function(systemState) {
			timeline.push(systemState);
		}

		this.onEnd = function() {
			console.info(JSON.stringify(timeline));
		}
	};
});