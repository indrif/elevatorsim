/* Crap elevator system that moves completely randomly. Modeled around the Schibsted elevators. */
define(["underscore"], function(_) {
    var Chance = require("chance");
    var seedrandom = require("seedrandom");

    function getFreeElevators(elevators) {
        var freeIndices = [];
        _.each(elevators, function(item, index) {
            if (item.state === "still") {
                freeIndices.push(index);
            }
        });
        return freeIndices;
    }

    return function (options) {
        var seed = (options.randomseed) ? options.randomseed : new Date().getTime();
        var chance = new Chance(seed);

        this.onTick = function(systemState, moveToFloorCallback) {
            _.each(getFreeElevators(systemState.elevators), function(elevator) {
                moveToFloorCallback(elevator, chance.integer({min: 0, max: elevator.floorCount}));
            });
        };

        /**
         * A traveler pushed a button on a floor that was not already pushed.
         */
        this.onFloorCalled = function(systemState, floor) {
            console.log("Floor calling: ", floor);
        };

        /**
         * Floor button pushed by a traveler inside the elevator.
         */
        this.onFloorPushed = function(systemState, elevatorIndex, floor) {

        };
    };
});
