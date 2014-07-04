define(["underscore"], function(_) {
	return function(options) {
		var timeline = [];
		var travelers = [];
		var self = this;

		console.log("Stats collection enabled");

		this.onTick = function(systemState) {
			timeline.push(systemState);
		}

		this.onTravelerUnloaded = function(traveler) {
			travelers.push({
				id: traveler.getId(),
				from: traveler.getFromFloor(),
				to: traveler.getToFloor(),
				waited: traveler.getWaitedTime(),
				going: traveler.getGoingTime()
			});
		}

		this.onEnd = function() {
			//console.info(JSON.stringify(timeline));
			var minWaited = _.min(_.map(travelers, function(item) {
				return item.waited;
			}));
			var maxWaited = _.max(_.map(travelers, function(item) {
				return item.waited;
			}));
			var minGoing = _.min(_.map(travelers, function(item) {
				return item.going;
			}));
			var maxGoing = _.max(_.map(travelers, function(item) {
				return item.going;
			}));
			console.log("STATS");
			console.log("Min wait time:", minWaited, "Max wait time:", maxWaited);
			console.log("Min going time:", minGoing, "Max going time:", maxGoing);
			console.log("Number of ticks:", timeline.length);
			console.log("");
		}
	};
});
