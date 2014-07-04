require([
	"elevatorsystem",
	"stats",
	"scenario/scenario1",
	"ai/daniel"
	], function(ElevatorSystem, Stats, scenario, AI) {

	// Initialize elevator system with the given ai and scenario
	var stats = new Stats();
	var system = new ElevatorSystem(
		new AI(),
		scenario.getElevatorSetup(stats),
		stats
	);
	console.log("Elevator system initialized");

	// Go through scenario
	var tick = 1;
	while(true) {
		// Log a new tick group
		console.group("=== TICK " + tick + " ===");

		// Get current system state
		var systemState = system.getState();
		console.log("System state:", systemState);

		// Check if scenario is finished
		if (scenario.isFinished(tick, systemState)) {
			break;
		}

		// Advance the scenario
		scenario.onTick(tick, system);

		// Advance the elevator system
		system.onTick();

		// Collect stats
		stats.onTick(systemState);

		// End tick group
		console.groupEnd();

		// Increase time
		tick++;
	}

	stats.onEnd();
});
