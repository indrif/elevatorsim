/*
 * A traveler defines a person using the elevator. The traveler takes care of
 * calling the elevators and measure the time they wait and ride an elevator.
 */
define(function() {
	return function (id, fromFloor, toFloor, logger) {
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
			logger.log("Traveler " + id + " entered elevator " + elevator.getId() + " and pushed " + toFloor);
			elevator.pushButton(toFloor);
		};
	};
});
