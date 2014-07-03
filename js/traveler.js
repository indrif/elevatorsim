define(function() {
	var nextId = 1;
	return function (fromFloor, toFloor) {
		var waited = 0,
			going = 0,
			id = nextId++,
			state = "waiting";

		this.onTick = function() {
			switch (state) {
				case "waiting":
					waited++;
					totalWaitTime++;
					break;
				case "going":
					going++;
					totalGoingTime++;
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
		}

		this.getId = function() {
			return id;
		}

		this.onEnterElevator = function(elevator) {
			state = "going";
			console.log("Traveler " + id + " entered elevator and pushed " + toFloor);
			elevator.pushButton(toFloor);
		};
	}
});
