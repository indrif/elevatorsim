/*jshint expr: true*/
var expect = require("chai").expect,
    Elevator = require("../lib/elevator");

describe("elevator", function () {
	var elevator, traveler, stats;

	function moveElevatorToFloor(elevator, floor) {
		var current = elevator.getState().floor;
		elevator.startMovingToFloor(floor);
		for(var floors = 0; floors <= Math.abs(floor - current); floors++) {
			for(var i = 2; i > 0; i--) {
				elevator.onTick();
			}
		}
	}

	beforeEach(function () {
		traveler = {
			getToFloor: function () {return 2; },
			getFromFloor: function () {return 0; },
			getId: function () {return "id"; },
			onEnterElevator: function () {},
			onTick: function () {}
		};
        stats = {
            onTravelerUnloaded: function() {},
            onTick: function() {}
        };
        elevator = new Elevator("id", 1, 10, 2, 3, stats);
	});
	it("should return its id", function () {
		expect(elevator.getId()).to.equal("id");
	});
	it("should return its floor", function () {
		expect(elevator.getFloor()).to.equal(1);
	});
	it("should return its state correctly", function () {
		var state = elevator.getState();
		expect(state.floor).to.equal(1);
		expect(state.floorCount).to.equal(10);
		expect(state.state).to.equal("still");
		expect(state.timePerFloor).to.equal(2);
		expect(state.timeOpenClose).to.equal(3);
	});
	it("should start moving to floor when told", function () {
		elevator.startMovingToFloor(2);
		var state = elevator.getState();
		expect(state.state).to.equal("moving");
		expect(state.movingToFloor).to.equal(2);
	});
	it("should register uniquely pushed button", function () {
		elevator.pushButton(2);
		var state = elevator.getState();
		expect(state.pushedButtons.length).to.equal(1);
		expect(state.pushedButtons).to.include(2);
		elevator.pushButton(2);
		expect(state.pushedButtons.length).to.equal(1);
	});
	it("should register travelers", function () {
		elevator.addTraveler(traveler);
		var state = elevator.getState();
		expect(state.travelers.length).to.equal(1);
		expect(state.travelers[0].to).to.equal(2);
		expect(state.travelers[0].from).to.equal(0);
		expect(state.travelers[0].id).to.equal("id");
	});
	it("should tick travelers inside", function (done) {
		traveler.onTick = function () {
			done();
		};
		elevator.addTraveler(traveler);
		elevator.onTick();
	});
	it("should move between floors when called", function () {
		var state;

		// Move down
		moveElevatorToFloor(elevator, 2);
		state = elevator.getState();
		expect(state.floor).to.equal(2);

		// Open close doors
		for(var i = 0; i < 3; i++) {
			elevator.onTick(null, function () {});
		}

		// Move up
		moveElevatorToFloor(elevator, 1);
		state = elevator.getState();
		expect(state.floor).to.equal(1);
	});
	it("should open on floor when moving finishes", function (done) {
		moveElevatorToFloor(elevator, 2);
		state = elevator.getState();
		expect(state.floor).to.equal(2);
		elevator.onTick();
		elevator.onTick();
		state = elevator.getState();
		expect(state.state).to.equal("openclose");

		// Wait for open to finish, then our callback should be invoked
		elevator.onTick(null, function () {
			done();
		});

		state = elevator.getState();
		expect(state.state).to.equal("still");
	});
	it("should keep track of travelers leaving", function (done) {
		elevator.addTraveler(traveler);
		stats.onTravelerUnloaded = function (item) {
			expect(item.getToFloor()).to.equal(2);
			done();
		};
		moveElevatorToFloor(elevator, 2);
		for(var i = 0; i < 6; i++) {
			elevator.onTick(null, function () {});
		}
	});
	it("should not reset ticksLeft when changing direction", function () {
		elevator.startMovingToFloor(2);
		elevator.onTick();
		elevator.startMovingToFloor(1);
		var state = elevator.getState();
		expect(state.ticksLeft).to.equal(1);
	});
	it("should throw error when trying to move while opening", function () {
		moveElevatorToFloor(elevator, 2);
		var testFunc = function () {
			elevator.startMovingToFloor(5);
		};
		expect(testFunc).to.throw(Error);
	});
});
