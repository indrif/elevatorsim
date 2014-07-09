define(["underscore", "traveler", "elevator"], function(_, Traveler, Elevator) {
    var id = 1;
    var Chance = require("chance");
    var chance = new Chance(1);

    function getName() {
        return chance.name({prefix: true}) + " (" + (id++) + ")";
    }

    function isEmptyState(systemState) {
        var elevatorsBusy = _.filter(systemState.elevators, function(item) {
            return item.state !== "still" || item.pushedButtons.length > 0 || item.travelers.length > 0;
        });
        return systemState.callingFloors.length === 0 && elevatorsBusy.length === 0;
    }

    return function(logger, options) {
        this.isFinished = function(currentTick, systemState) {
            // End if more than 50 ticks have passed or if the system state is empty after 3 ticks
            return currentTick > 50 || (currentTick > 3 && isEmptyState(systemState));
        };

        this.getElevatorSetup = function(stats) {
            return [
                new Elevator("HISS 1", 2, 12, 1, 6, logger, stats),
                new Elevator("HISS 2", 2, 12, 1, 6, logger, stats)
            ];
        };

        this.onTick = function(tick, system) {
            switch (tick) {
                case 1:
                    system.addTraveler(new Traveler(getName(), 0, 5, logger));
                    break;
                case 2:
                    system.addTraveler(new Traveler(getName(), 0, 4, logger));
                    break;
                case 3:
                    system.addTraveler(new Traveler(getName(), 3, 6, logger));
                    break;
            }
        };
    };
});
