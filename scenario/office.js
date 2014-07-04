define(["underscore", "traveler", "elevator"], function(_, Traveler, Elevator) {
    var Chance = require("chance");
    var seedrandom = require("seedrandom");
    var maxFloors = 4;

    function isEmptyState(systemState) {
        var elevatorsBusy = _.filter(systemState.elevators, function(item) {
            return item.state !== "still" || item.pushedButtons.length > 0 || item.travelers.length > 0;
        });
        return systemState.callingFloors.length == 0 && elevatorsBusy.length == 0;
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

    return function(options) {
        var seed = (options.randomseed) ? options.randomseed : +Date();
        var rng = seedrandom(seed, {global: true});
        var chance = new Chance(seed);

        function getName() {
            return chance.name();
        }

        this.isFinished = function(currentTick, systemState) {
            // End if more than 50 ticks have passed or if the system state is empty after 3 ticks
            return /*currentTick > 50 || */(currentTick > 30 && isEmptyState(systemState));
        }
        this.getElevatorSetup = function(stats) {
            return [
                new Elevator("HISS 1", 0, maxFloors, 2, 3, stats),
                new Elevator("HISS 2", 0, maxFloors, 2, 3, stats),
                new Elevator("HISS 3", 0, maxFloors, 2, 3, stats)
            ];
        }
        this.onTick = function(tick, system) {
            // 20 per hour
            // Around 20 = morning
            // Around 180 = dinner
            var morningCount = getRandomCount(tick, 20, 10, 5);
            var dinnerCount = getRandomCount(tick, 180, 10, 5);
            for(var i = 0; i < morningCount + dinnerCount; i++) {
                system.addTraveler(new Traveler(getName(), 0, 2 + parseInt(Math.random() * (maxFloors - 2))));
            }
            if (tick > 30 && tick < 170) {
                // Random spawn travelers during the day
                var count = parseInt(Math.random() * 2);
                for(var i = 0; i < count; i++) {
                    var from = parseInt(Math.random() * maxFloors);
                    var to = parseInt(Math.random() * maxFloors);
                    if (to === from) {
                        to = (from + 1) % maxFloors;
                    }
                    system.addTraveler(new Traveler(getName(), from, to));
                }
            }
        }
    };
});
