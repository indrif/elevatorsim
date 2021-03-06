function Traveler(id, fromFloor, toFloor) {
    var waited = 0,
        going = 0,
        state = "waiting";

    this.onTick = function() {
        switch (state) {
            case "waiting":
                waited++;
                break;
            case "going":
                going++;
                break;
        }
    };

    this.getWaitedTime = function() {
        return waited;
    };

    this.getGoingTime = function() {
        return going;
    };

    this.getFromFloor = function() {
        return fromFloor;
    };

    this.getToFloor = function() {
        if (state == "going") {
            return toFloor;
        }
    };

    this.getId = function() {
        return id;
    };

    this.onEnterElevator = function(elevator) {
        state = "going";
        elevator.pushButton(toFloor);
    };
}

exports = module.exports = Traveler;
