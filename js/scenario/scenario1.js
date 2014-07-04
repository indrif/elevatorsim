define(["traveler", "elevator"], function(Traveler, Elevator) {
	var id = 1;
	var chance = new Chance(1);

	function getName() {
		return chance.name({prefix: true}) + " (" + (id++) + ")";
	}

	function isEmptyState(systemState) {
		var elevatorsBusy = _.filter(systemState.elevators, function(item) {
			return item.state !== "still" || item.pushedButtons.length > 0 || item.travelers.length > 0;
		});
		return systemState.callingFloors.length == 0 && elevatorsBusy.length == 0;
	}

	return {
		isFinished: function(currentTick, systemState) {
			// End if more than 50 ticks have passed or if the system state is empty after 3 ticks
			return currentTick > 50 || (currentTick > 3 && isEmptyState(systemState));
		},
		getElevatorSetup: function(stats) {
			return [
				//new Elevator("HISS 1", 2, 12, 1, 6),
				new Elevator("HISS 2", 2, 12, 1, 6, stats)
			];
		},
		onTick: function(tick, system) {
			switch (tick) {
				case 1:
					system.addTraveler(new Traveler(getName(), 0, 5));
					break;
				case 2:
					system.addTraveler(new Traveler(getName(), 0, 4));
					break;
				case 3:
					system.addTraveler(new Traveler(getName(), 3, 6));
					break;
			}
		}
	};
});