require([
	"elevatorsystem",
	"stats",
	"scenario/scenario1",
	"ai/daniel"
	], function(ElevatorSystem, Stats, scenario, AI) {

	// Initialize elevator system with the given ai and scenario
	var system = new ElevatorSystem(new AI(), scenario.getElevatorSetup());
	console.log("Elevator system initialized");

	// Go through scenario
	var stats = new Stats();
	for(var i = 1; i <= scenario.maxTicks; i++) {
		// Log a new tick group
		console.group("=== TICK " + i + " ===");

		// Get current system state
		var systemState = system.getState();
		console.log("System state:", systemState);

		// Advance the scenario
		scenario.onTick(i, system);

		// Advance the elevator system
		system.onTick();

		// Collect stats
		stats.onTick(systemState);

		// End tick group
		console.groupEnd();
	}

	stats.onEnd();
});
