#!/usr/bin/env node

// Setup requirejsnp
var requirejs = require("requirejs");
requirejs.config({
    nodeRequire: require
});

var argv = require("yargs")
    .usage("Usage: $0")
    .example("$0 --ai=simple --scenario=scenario1", "Run the simulation with the default options")
    .demand("a")
    .alias("a", "ai")
    .describe("a", "Select an AI to use")
    .demand("s")
    .alias("s", "scenario")
    .describe("s", "Select a scenario to run")
    .alias("r", "randomseed")
    .describe("r", "Random seed to use for seeded scenarios")
    .argv;

// Start
requirejs([
    "elevatorsystem",
    "stats",
    "scenario/" + argv.scenario,
    "ai/" + argv.ai
    ], function(ElevatorSystem, Stats, Scenario, AI) {

    // Initialize elevator system with the given ai and scenario
    var stats = new Stats(argv);
    var scenario = new Scenario(argv);
    var system = new ElevatorSystem(
        new AI(),
        scenario.getElevatorSetup(stats),
        stats,
        argv
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
