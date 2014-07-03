var totalWaitTime = 0;
var totalGoingTime = 0;

require(["elevatorsystem", "scenario/scenario1", "logic/daniel"], function(ElevatorSystem, scenario, Logic1) {
	var system = new ElevatorSystem(Logic1);
	console.log("Elevator system initialized");
	for(var i = 1; i <= scenario.maxTicks; i++) {
		console.group("=== TICK " + i + " ===");
		scenario.onTick(i, system);
		console.groupEnd();
	}

	console.log("Total waiting time: " + totalWaitTime);
	console.log("Total going time: " + totalGoingTime);
});
