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
    .demand("l")
    .alias("l", "logger")
    .describe("l", "Select a logger to use")
    .alias("r", "randomseed")
    .describe("r", "Random seed to use for seeded scenarios")
    .argv;

// Start
requirejs([
    "elevatorsystem",
    "stats",
    argv.scenario,
    argv.ai,
    argv.logger
    ], function(ElevatorSystem, Stats, Scenario, AI, Logger) {

    // Initialize elevator system with the given ai and scenario
    var logger = new Logger();
    var stats = new Stats(logger, argv);
    var ai = new AI(logger, argv);
    var scenario = new Scenario(logger, argv);
    var system = new ElevatorSystem(
        ai,
        scenario.getElevatorSetup(stats),
        logger,
        stats,
        argv
    );
    logger.log("Elevator system initialized");

    // Go through scenario
    var tick = 1;
    while(true) {
        // Log a new tick group
        logger.info("=== TICK " + tick + " ===");

        // Get current system state
        var systemState = system.getState();
        logger.log("System state: " + JSON.stringify(systemState));

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
        logger.log("");

        // Increase time
        tick++;
    }

    logger.log("");
    stats.onEnd();
});
