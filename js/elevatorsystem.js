define(["elevator"], function(Elevator) {
	return function(logic, elevators) {
		var self = this;
		var travelers = [];
		this.addTraveler = function(traveler) {
			var floorsCalling = _.map(travelers, function(item) {
				return item.getFromFloor();
			});
			if (!_.contains(floorsCalling, traveler.getFromFloor())) {
				travelers.push(traveler);
				logic.onFloorCalled(self.getState(), traveler.getFromFloor());
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
			console.log("Start moving elevator " + index + " from " + elevator.getFloor() + " to " + toFloor);
			elevator.startMovingToFloor(toFloor);
		};
		this.onTick = function() {
			logic.onTick(self.getState(), self.startMovingElevator);

			// Then tick each traveler
			_.each(travelers, function(item) {
				item.onTick();
			});

			// Tick each elevator first
			_.each(elevators, function(item) {
				item.onTick(self.getState(), self.onElevatorOpened);
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