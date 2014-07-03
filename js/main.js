require(["elevatorsystem", "scenario/scenario1", "logic/daniel"], function(ElevatorSystem, scenario, Logic) {
	var system = new ElevatorSystem(new Logic(), scenario.getElevatorSetup());
	console.log("Elevator system initialized");
	for(var i = 1; i <= scenario.maxTicks; i++) {
		console.group("=== TICK " + i + " ===");
		console.log("System state:", system.getState());
		scenario.onTick(i, system);
		system.onTick();
		console.groupEnd();
	}
});
