define(["underscore", "traveler", "elevator"], function(_, Traveler, Elevator) {
    var Chance = require("chance");
    var seedrandom = require("seedrandom");
    var maxFloors = 12;
    var maxTravelerPeak = 10;

    function isEmptyState(systemState) {
        var elevatorsBusy = _.filter(systemState.elevators, function(item) {
            return item.state !== "still" || item.pushedButtons.length > 0 || item.travelers.length > 0;
        });
        return systemState.callingFloors.length === 0 && elevatorsBusy.length === 0;
    }

    function getRandomCount(currentTick, maxAtTime, devTime, maxCount) {
        if (currentTick >= maxAtTime - devTime && currentTick <= maxAtTime + devTime) {
            if (currentTick == maxAtTime) {
                return maxCount;
            } else if (currentTick < maxAtTime) {
                return maxCount - parseInt(((maxAtTime - currentTick) / devTime) * maxCount);
            } else if (currentTick > maxAtTime) {
                return maxCount - parseInt(((currentTick - maxAtTime) / devTime) * maxCount);
            }
        } else {
            return 0;
        }
    }

    function getName() {
        return chance.name();
    }

    return function(options) {
        var seed = (options.randomseed) ? options.randomseed : +Date();
        var rng = seedrandom(seed, {global: true});
        var chance = new Chance(seed);

        this.isFinished = function(currentTick, systemState) {
            // End if more than 50 ticks have passed or if the system state is empty after 3 ticks
            return currentTick > 30 && isEmptyState(systemState);
        };

        this.getElevatorSetup = function(stats) {
            return [
                new Elevator("HISS 1", 0, maxFloors, 2, 3, stats),
                new Elevator("HISS 2", 0, maxFloors, 2, 3, stats),
                new Elevator("HISS 3", 0, maxFloors, 2, 3, stats)
            ];
        };

        this.onTick = function(tick, system) {
            // 10 per hour
            // Around 10 = morning
            // Around 90 = dinner
            var morningCount = getRandomCount(tick, 10, 5, maxTravelerPeak);
            var dinnerCount = getRandomCount(tick, 90, 5, maxTravelerPeak);
            for(var i = 0; i < morningCount + dinnerCount; i++) {
                system.addTraveler(new Traveler(getName(), 0, 2 + parseInt(Math.random() * (maxFloors - 2))));
            }
            if (tick > 15 && tick < 95) {
                // Random spawn travelers during the day
                var count = parseInt(Math.random() * 2);
                for(i = 0; i < count; i++) {
                    var from = parseInt(Math.random() * maxFloors);
                    var to = parseInt(Math.random() * maxFloors);
                    if (to === from) {
                        to = (from + 1) % maxFloors;
                    }
                    system.addTraveler(new Traveler(getName(), from, to));
                }
            }
        };
    };
});
