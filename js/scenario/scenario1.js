define(["traveler", "elevator"], function(Traveler, Elevator) {
	return {
		maxTicks: 40,
		getElevatorSetup: function() {
			return [
				new Elevator("HISS 1", 2, 12, 1, 1, 6),
				new Elevator("HISS 2", 2, 12, 1, 1, 6)
			];
		},
		onTick: function(tick, elevators) {
			elevators.onTick();
			switch (tick) {
				case 1:
					elevators.addTraveler(new Traveler(0, 5));
					break;
				/*case 2:
					elevators.addTraveler(new Traveler(0, 4));
					break;*/
				case 2:
					elevators.addTraveler(new Traveler(3, 6));
					break;
			}
		}
	};
});