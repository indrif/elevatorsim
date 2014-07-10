#!/usr/bin/env node
"use strict";

var ElevatorSystem = require("./elevatorsystem"),
    Stats = require("./stats");

var log = [],
    options = {};

exports = module.exports = {
    simulate: function(Scenario, AI) {
        // Initialize elevator system with the given ai and scenario
        var stats = new Stats();
        var ai = new AI(stats);
        var scenario = new Scenario(stats);
        var system = new ElevatorSystem(
            ai,
            scenario.getElevatorSetup(stats)
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

        return stats.getTimeLine();
    }
};
