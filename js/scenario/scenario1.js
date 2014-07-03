define(["traveler"], function(TravelerClass) {
	return {
		maxTicks: 40,
		onTick: function(tick, elevators) {
			elevators.onTick();
			switch (tick) {
				case 1:
					elevators.addTraveler(new TravelerClass(0, 5));
					break;
				/*case 2:
					elevators.addTraveler(new TravelerClass(0, 4));
					break;*/
				case 2:
					elevators.addTraveler(new TravelerClass(3, 6));
					break;
			}
		}
	};
});