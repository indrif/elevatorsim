var travelerId = 1;
function generateTravelerId() {
	return travelerId++;
}

// ElevatorLogic = function () {
// 	this.onNextFloor = function (elevator) {

// 	}
// }

Scenario = function () {
	this.triggerAtTime = function(time) {

	}
}

Elevator = function (jsLogicFile, scenario) {
	var floor = 0;
	var floorCount = 11;
	var speedSlow = 10;
	var speedFast = 4;
	var stopTime = 6;
	var travelersInside = [];
	var travelersOutside = [];
	var totalTime = 0;
	var state = "waiting";
	var elevator = this;

	// Setup worker
	var worker = new Worker(jsLogicFile);
	worker.addEventListener("message", function (e) {
		var data = e.data;
		console.info("<<< Elevator received action " + data.action + " with data: ", data);
		switch (data.action) {
			case "goto":
				if (state == "waiting") {
					gotoFloor(data.floor);
					return;
				}
			case "openclose":
				if (state == "waiting") {
					onStoppedAtFloor(floor);
					return;
				}
			case "test":
				break;
		}
		console.error("Cannot perform action " + data.action + " in state " + state);
	});

	this.onStart = function () {
		console.error("onStart not implemented");
	}

	function updateWorker() {
		var a = getJson();
		console.log(">>> Sending to worker: ", JSON.stringify(a));
		worker.postMessage(a);
	}

	function getJson() {
		return {
			speedSlow: speedSlow,
			speedFast: speedFast,
			stopTime: stopTime,
			floorCount: floorCount,
			floor: floor,
			state: state,
			travelersInside: _.map(travelersInside, function (item) {
				return item.toFloor;
			}),
			travelersOutside: _.map(travelersOutside, function (item) {
				return item.fromFloor;
			}),
			timeToFloor: getTimeToFloors()
		};
	}

	function getTimeToFloors() {
		return _.map(_.range(floorCount), function (item) {
			if (item === floor) {
				return 0;
			} else if (Math.abs(item - floor) === 1) {
				return speedSlow;
			} else {
				return speedSlow + speedFast * (Math.abs(item - floor) - 1);
			}
		});
	}

	function addTime(v) {
		state = "going";
		console.log("Add time " + v);
		for(var i = 1; i <= v; i++) {
			totalTime++;
			scenario.triggerAtTime(totalTime, elevator);
		}
		state = "waiting";
	}

	function gotoFloor(v) {
		var time = getTimeToFloors()[v];
		floor = v;
		addTime(time);
		updateWorker();
	}

	this.addTraveler = function (traveler) {
		console.log("New traveler waiting at floor " + traveler.fromFloor + " going to " + traveler.toFloor);
		travelersOutside.push(traveler);
		updateWorker();
	}

	this.getTotalTime = function () {
		return totalTime;
	}

	this.start = function () {
		this.onStart(this);
	}

	function onStoppedAtFloor(v) {
		console.log("Stopped at floor " + v);

		// Split travelers inside into those who will exit at this floor and all the others
		travelersInside = _.filter(travelersInside, function (item) {
			var willExit = item.toFloor === v;
			if (willExit) {
				console.log("Traveler " + item.id + " exited at floor " + v);
			}
			return !willExit;
		});

		// Every traveler waiting for the elevator on that floor can enter
		var partitions = _.partition(travelersOutside, function (item) {
			var willEnter = item.fromFloor === v;
			if (willEnter) {
				console.log("Traveler " + item.id + " entered at floor " + v);
			}
			return item.fromFloor === v;
		});
		travelersInside = travelersInside.concat(partitions[0]);
		travelersOutside = partitions[1];

		addTime(stopTime);
		updateWorker();
	}
}

Traveler = function (fromFloor, toFloor) {
	this.id = generateTravelerId();
	this.fromFloor = fromFloor;
	this.toFloor = toFloor;
}

var Scenario1 = function() {
	this.triggerAtTime = function(time, elevator) {
		switch (time) {
			case 2:
				elevator.addTraveler(new Traveler(4, 1));
				break;
		}
	}
}

var elevator = new Elevator("worker1.js", new Scenario1());
elevator.onStart = function (e) {
	e.addTraveler(new Traveler(0, 5));
}
elevator.start();
