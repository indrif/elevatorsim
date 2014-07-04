define(["elevator"], function(Elevator) {
	return function(ai, elevators, stats) {
		var self = this;
		var travelers = [];

		console.log("Elevator system initializing with " + elevators.length + " elevator(s):");
		_.each(elevators, function(item, index) {
			console.log("Elevator " + index, item.getState());
		});

		this.addTraveler = function(traveler) {
			var floorsCalling = _.map(travelers, function(item) {
				return item.getFromFloor();
			});
			travelers.push(traveler);
			if (!_.contains(floorsCalling, traveler.getFromFloor())) {
				ai.onFloorCalled(self.getState(), traveler.getFromFloor());
			}
		};
		this.getState = function(index) {
			var a = {
				callingFloors: _.map(travelers, function(item) {
					return item.getFromFloor();
				}),
				elevators: _.map(elevators, function(item) {
					return item.getState();
				})
			};
			if (index !== undefined) {
				a.yourIndex = index;
			}
			return a;
		};
		this.startMovingElevator = function(index, toFloor) {
			var elevator = elevators[index];
			elevator.startMovingToFloor(toFloor);
		};
		this.onTick = function() {
			// Tick each elevator first
			_.each(elevators, function(item) {
				item.onTick(self.getState(), self.onElevatorOpened);
			});

			// Let the custom ai do its part
			ai.onTick(self.getState(), self.startMovingElevator);

			// Then tick each traveler
			_.each(travelers, function(item) {
				item.onTick();
			});
		};
		this.onElevatorOpened = function(elevator) {
			var floor = elevator.getFloor();
			var newList = _.partition(travelers, function(item) {
				return item.getFromFloor() === floor;
			});
			var travelersToLoad = newList[0];
			_.each(travelersToLoad, function(item) {
				elevator.addTraveler(item);
			});
			travelers = newList[1];
		}
	};
});