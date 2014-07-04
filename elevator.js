define(["underscore"], function (_) {
	return function(id, floor, floorCount, timePerFloor, timeOpenClose, stats) {
		var handler = null,
			pushedButtonsInside = [],
			travelers = [],
			ticksLeft = 0,
			state = "still",
			movingToFloor = null,
			self = this;

		this.getState = function() {
			return {
				floor: floor,
				floorCount: floorCount,
				ticksLeft: ticksLeft,
				state: state,
				timePerFloor: timePerFloor,
				timeOpenClose: timeOpenClose,
				movingToFloor: movingToFloor,
				pushedButtons: [].concat(pushedButtonsInside),
				travelers: _.map(travelers, function(item) {
					return {
						to: item.getToFloor(),
						from: item.getFromFloor(),
						id: item.getId()
					};
				})
			};
		};

		this.getId = function() {
			return id;
		}

		this.getFloor = function() {
			return floor;
		};

		this.getMovingToFloor = function() {
			return movingToFloor;
		};

		this.addTraveler = function(traveler) {
			travelers.push(traveler);
			traveler.onEnterElevator(self);
		};

		this.startMovingToFloor = function(v) {
			console.log("Initiate moving elevator " + id + " from " + floor + " to " + v);
			ticksLeft = timePerFloor;
			movingToFloor = v;
			state = "moving";
		};

		this.pushButton = function(button) {
			if (!_.contains(pushedButtonsInside, button)) {
				pushedButtonsInside.push(button);
			}
		};

		this.onTick = function(system, elevatorOpened) {
			_.each(travelers, function(item) {
				item.onTick();
			});
			switch (state) {
				case "moving":
					ticksLeft--;
					if (ticksLeft == 0) {
						if (movingToFloor - floor > 0) {
							floor++;
							console.log("Moving elevator " + id + " up to " + floor);
							ticksLeft = timePerFloor;
						} else if (movingToFloor - floor < 0) {
							floor--;
							console.log("Moving elevator " + id + " down to " + floor);
							ticksLeft = timePerFloor;
						} else {
							state = "openclose";
							console.log("Opening elevator " + id + " at " + floor);
							ticksLeft = timeOpenClose;

							// Remove this floor from pushedButtons if it exists
							pushedButtonsInside = _.without(pushedButtonsInside, floor);
						}
					}
					break;
				case "openclose":
					ticksLeft--;
					if (ticksLeft == 0) {
						// Unload containing travelers going to this floor
						var partitions = _.partition(travelers, function(item) {
							return item.getToFloor() === floor;
						});
						_.each(partitions[0], function(item) {
							console.log("Unload traveler " + item.getId() + " at " + floor + " that waited for " + item.getWaitedTime() + " ticks and that was in the elevator for " + item.getGoingTime() + " ticks.");
							stats.onTravelerUnloaded(item);
						});
						travelers = partitions[1];

						// Load new people
						elevatorOpened(this);

						// Report still
						console.log("Elevator " + id + " is now standing still.");
						state = "still";
					}
					break;
			}
		};
	}
});
