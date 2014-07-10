var _ = require("underscore");

function Elevator(id, floor, floorCount, timePerFloor, timeOpenClose, stats, options) {
    var handler = null,
        pushedButtonsInside = [],
        travelers = [],
        ticksLeft = 0,
        state = "still",
        movingToFloor = null,
        self = this;

    this.getState = function() {
        return {
            floor: floor,
            floorCount: floorCount,
            ticksLeft: ticksLeft,
            state: state,
            timePerFloor: timePerFloor,
            timeOpenClose: timeOpenClose,
            movingToFloor: movingToFloor,
            pushedButtons: [].concat(pushedButtonsInside),
            travelers: _.map(travelers, function(item) {
                return {
                    to: item.getToFloor(),
                    from: item.getFromFloor(),
                    id: item.getId()
                };
            })
        };
    };

    this.getId = function() {
        return id;
    };

    this.getFloor = function() {
        return floor;
    };

    this.getMovingToFloor = function() {
        return movingToFloor;
    };

    this.addTraveler = function(traveler) {
        travelers.push(traveler);
        traveler.onEnterElevator(self);
    };

    this.startMovingToFloor = function(v) {
        ticksLeft = timePerFloor;
        movingToFloor = v;
        state = "moving";
    };

    this.pushButton = function(button) {
        if (!_.contains(pushedButtonsInside, button)) {
            pushedButtonsInside.push(button);
        }
    };

    this.onTick = function(system, elevatorOpened) {
        _.each(travelers, function(item) {
            item.onTick();
        });

        switch (state) {
            case "moving":
                ticksLeft--;
                if (ticksLeft === 0) {
                    if (movingToFloor - floor > 0) {
                        floor++;
                        ticksLeft = timePerFloor;
                    } else if (movingToFloor - floor < 0) {
                        floor--;
                        ticksLeft = timePerFloor;
                    } else {
                        state = "openclose";
                        ticksLeft = timeOpenClose;

                        // Remove this floor from pushedButtons if it exists
                        pushedButtonsInside = _.without(pushedButtonsInside, floor);
                    }
                }
                break;
            case "openclose":
                ticksLeft--;
                if (ticksLeft === 0) {
                    // Unload containing travelers going to this floor
                    var partitions = _.partition(travelers, function(item) {
                        return item.getToFloor() === floor;
                    });
                    _.each(partitions[0], function(item) {
                        stats.onTravelerUnloaded(item);
                    });
                    travelers = partitions[1];

                    // Load new people
                    elevatorOpened(this);

                    state = "still";
                }
                break;
        }
    };
}

exports = module.exports = Elevator;
