// Setup requirej
var requirejs = require("requirejs");
requirejs.config({
	nodeRequire: require
});

// Load AI from first argument
var arguments = process.argv.slice(2);
var ai = arguments[0];
var scenario = arguments[1];

// Start
requirejs([
	"elevatorsystem",
	"stats",
	"scenario/" + scenario,
	"ai/" + ai
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
		console.log("=== TICK " + tick + " ===");

		// Get current system state
		var systemState = system.getState();
		console.log("System state: %s", JSON.stringify(systemState));

		// Collect stats
		stats.onTick(systemState);

		// Check if scenario is finished
		if (scenario.isFinished(tick, systemState)) {
			break;
		}

		// Advance the scenario
		scenario.onTick(tick, system);

		// Advance the elevator system
		system.onTick();

		// End tick group
		console.log("");

		// Increase time
		tick++;
	}

	console.log("");
	stats.onEnd();
});
