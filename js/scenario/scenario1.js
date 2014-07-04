define(["traveler", "elevator"], function(Traveler, Elevator) {
	return {
		isFinished: function(currentTick) {
			return currentTick > 12
		},
		getElevatorSetup: function() {
			return [
				//new Elevator("HISS 1", 2, 12, 1, 1, 6),
				new Elevator("HISS 2", 2, 12, 2, 3, 6)
			];
		},
		onTick: function(tick, system) {
			switch (tick) {
				case 1:
					system.addTraveler(new Traveler(0, 5));
					break;
				/*case 2:
					system.addTraveler(new Traveler(0, 4));
					break;*/
				case 2:
					//system.addTraveler(new Traveler(3, 6));
					break;
			}
		}
	};
});