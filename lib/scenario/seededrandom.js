var _ = require("underscore"),
    Chance = require("chance"),
    seedrandom = require("seedrandom"),
    Elevator = require("../elevator"),
    Traveler = require("../traveler");

var isEmptyState = function (systemState) {
    var elevatorsBusy = _.filter(systemState.elevators, function(item) {
        return item.state !== "still" || item.pushedButtons.length > 0 || item.travelers.length > 0;
    });
    return systemState.callingFloors.length === 0 && elevatorsBusy.length === 0;
};

function Scenario(options) {
    var id = 1;
    var seed = (options.randomseed) ? options.randomseed : new Date().getTime();
    var rng = seedrandom(seed, {global: true});
    var chance = new Chance(seed);
    var floorCount = chance.integer({min: 2, max: 20});

    function getName() {
        return chance.name({prefix: true}) + " (" + (id++) + ")";
    }

    this.isFinished = function(currentTick, systemState) {
        // End if more than 50 ticks have passed or if the system state is empty after 3 ticks
        return currentTick > 20;
    };

    this.getElevatorSetup = function(stats) {
        var elevators = [];
        var numElevators = chance.integer({min: 1, max: 5});

        for (var i = 0; i < numElevators; i++) {
            elevators.push(new Elevator(
                "HISS " + i,
                chance.integer({min:0, max: floorCount}),
                floorCount,
                chance.integer({min: 1, max: 2}),
                chance.integer({min: 1, max: 2}),
                stats
            ));
        }

        return elevators;
    };

    this.onTick = function(tick, system) {
        if (chance.bool() === true) {
            var num = chance.integer({min: 1, max: 3});

            for (var i = 0; i < num; i++) {
                var floors = Array.apply(null, {length: floorCount}).map(Number.call, Number);
                system.addTraveler(new Traveler(
                    getName(),
                    chance.pick(floors),
                    chance.pick(floors)
                ));
            }
        }
    };
}

exports = module.exports = Scenario;
