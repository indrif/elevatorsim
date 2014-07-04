define(["underscore", "traveler", "elevator"], function(_, Traveler, Elevator) {
    var id = 1;
    var Chance = require("chance");
    var chance = new Chance(1);
    var maxFloors = 12;

    function getName() {
        return chance.name() + " (" + (id++) + ")";
    }

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

    return {
        isFinished: function(currentTick, systemState) {
            // End if more than 50 ticks have passed or if the system state is empty after 3 ticks
            return /*currentTick > 50 || */(currentTick > 30 && isEmptyState(systemState));
        },
        getElevatorSetup: function(stats) {
            return [
                new Elevator("HISS 1", 0, maxFloors, 2, 3, stats),
                new Elevator("HISS 2", 0, maxFloors, 2, 3, stats),
                new Elevator("HISS 3", 0, maxFloors, 2, 3, stats)
            ];
        },
        onTick: function(tick, system) {
            // 20 per hour
            // Around 20 = morning
            // Around 180 = dinner
            var morningCount = getRandomCount(tick, 20, 10, 5);
            var dinnerCount = getRandomCount(tick, 180, 10, 5);
            for(var i = 0; i < morningCount + dinnerCount; i++) {
                system.addTraveler(new Traveler(getName(), 0, tick % maxFloors));
            }
        }
    };
});
