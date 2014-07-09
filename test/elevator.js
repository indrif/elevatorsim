var requirejs = require("requirejs");
requirejs.config({
    nodeRequire: require,
    baseUrl: "."
});

var expect = require("chai").expect;
var LoggerClass = requirejs("logger/silent");
var logger = new LoggerClass();

describe("elevator", function () {
	var elevator, traveler;
	beforeEach(function () {
		var ElevatorClass = requirejs("elevator");
		elevator = new ElevatorClass("id", 1, 10, 2, 3, logger);
		traveler = {
			getToFloor: function () {return 1; },
			getFromFloor: function () {return 0; },
			getId: function () {return "id"; },
			onEnterElevator: function () {}
		};
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
		expect(state.travelers[0].to).to.equal(1);
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
		elevator.startMovingToFloor(2);
		var state;
		for(var i = 2; i > 0; i--) {
			state = elevator.getState();
			expect(state.ticksLeft).to.equal(i);
			elevator.onTick();
		}
		state = elevator.getState();
		expect(state.floor).to.equal(2);
	});
	it("should open on floor when moving finishes", function (done) {
		elevator.startMovingToFloor(2);
		var state;
		for(var i = 2; i > 0; i--) {
			state = elevator.getState();
			expect(state.ticksLeft).to.equal(i);
			elevator.onTick();
		}
		state = elevator.getState();
		expect(state.floor).to.equal(2);
		elevator.onTick();
		elevator.onTick();
		state = elevator.getState();
		expect(state.state).to.equal("openclose");

		// Wait for open to finish, then our callback should be invoked
		elevator.onTick();
		elevator.onTick();
		elevator.onTick(null, function () {
			done();
		});

		state = elevator.getState();
		expect(state.state).to.equal("still");
	});
});
