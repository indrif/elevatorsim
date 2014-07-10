#!/usr/bin/env node

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

var elevatorsim = require("./lib/elevatorsim");
var scenario = require(argv.s);
var ai = require(argv.a);

console.log(JSON.stringify(elevatorsim.simulate(scenario, ai, argv), null, 2));
