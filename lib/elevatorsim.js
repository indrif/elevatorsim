#!/usr/bin/env node
"use strict";

var ElevatorSystem = require("./elevatorsystem"),
    Stats = require("./stats");

var log = [],
    options = {};

exports = module.exports = {
    simulate: function(Scenario, AI, options) {
        // Initialize elevator system with the given ai and scenario
        var stats = new Stats(options);
        var ai = new AI(stats, options);
        var scenario = new Scenario(stats, options);
        var system = new ElevatorSystem(
            ai,
            scenario.getElevatorSetup(stats, options),
            options
        );

        // Go through scenario
        var tick = 1;
        while(true) {
            // Get current system state
            var systemState = system.getState();

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

            // Increase time
            tick++;
        }

        return stats.getResult();
    }
};
