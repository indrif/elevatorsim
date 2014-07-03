define(function() {
	var floorsCalling = [];

	function getFreeElevator(state) {
		var freeIndex = null;
		_.each(state.elevators, function(item, index) {
			if (item.state === "still") {
				freeIndex = index;
			}
		});
		return freeIndex;
	}

	return {
		onTick: function(systemState, moveToFloorCallback) {
			console.log("System state:", systemState);
			if (floorsCalling.length > 0) {
				var freeElevator = getFreeElevator(systemState);
				if (freeElevator !== null) {
					moveToFloorCallback(freeElevator, floorsCalling.pop());
				}
			} else {
				_.each(systemState.elevators, function(item, index) {
					if (item.state == "still") {
						// See if we have a pushed button
						var pushedButtons = item.pushedButtons;
						if (pushedButtons.length > 0) {
							moveToFloorCallback(index, pushedButtons.pop());
						}
					}
				});
			}
		},
		/**
		 * A traveler pushed a button on a floor that was not already pushed.
		 */
		onFloorCalled: function(systemState, floor) {
			console.log("Floor calling: ", floor);
			floorsCalling.push(floor);
		},

		/**
		 * Floor button pushed by a traveler inside the elevator.
		 */
		onFloorPushed: function(systemState, elevatorIndex, floor) {

		}
	};
});
