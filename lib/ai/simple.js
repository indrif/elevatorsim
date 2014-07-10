var _ = require("underscore");

function AI(options) {
    var floorsCalling = [];

    /**
     * Returns an elevator index to an elevator that is currently free for work (still).
     * Returns null if no free elevator was found.
     *
     * @param state System state.
     */
    var getFreeElevator = function(state) {
        var freeIndex = null;

        _.each(state.elevators, function(item, index) {
            if (item.state === "still") {
                freeIndex = index;
            }
        });

        return freeIndex;
    };

    this.onTick = function(systemState, moveToFloorCallback) {
        if (floorsCalling.length > 0) {
            var freeElevator = getFreeElevator(systemState);
            if (freeElevator !== null) {
                moveToFloorCallback(freeElevator, floorsCalling.pop());
            }
        } else {
            _.each(systemState.elevators, function(item, index) {
                if (item.state == "still") {
                    // See if we have a pushed button
                    var pushedButtons = item.pushedButtons;
                    if (pushedButtons.length > 0) {
                        moveToFloorCallback(index, pushedButtons.pop());
                    }
                }
            });
        }
    };

    /**
     * A traveler pushed a button on a floor that was not already pushed.
     */
    this.onFloorCalled = function(systemState, floor) {
        floorsCalling.push(floor);
    };

    /**
     * Floor button pushed by a traveler inside the elevator.
     */
    this.onFloorPushed = function(systemState, elevatorIndex, floor) {

    };
}

exports = module.exports = AI;
