define(function() {
	return function() {
		var timeline = [];
		var travelers = [];
		var self = this;

		console.info("Stats collection enabled");

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
			console.group("STATS");
			console.log("Min wait time:", minWaited, "Max wait time:", maxWaited);
			console.log("Min going time:", minGoing, "Max going time:", maxGoing);
			//console.log(timeline);
			console.groupEnd();
		}
	};
});