var expect = require("chai").expect;

describe("elevatorsystem", function () {
	var elevatorsystem, traveler, ai, elevator;
	beforeEach(function () {
		ai = {
			onFloorCalled: function () {},
			onTick: function () {}
		};
		traveler = {
			getToFloor: function () {return 1; },
			getFromFloor: function () {return 0; },
			getId: function () {return "id"; },
			onEnterElevator: function () {}
		};
		elevator = {
			addTraveler: function () {},
			getState: function () {},
			getFloor: function () {
				return 0;
			},
			onTick: function () {}
		};
		var ElevatorSystemClass = require("../lib/elevatorsystem");
		elevatorsystem = new ElevatorSystemClass(ai, [elevator]);
	});
	it("should return its state", function () {
		var state = elevatorsystem.getState();
		expect(state.callingFloors.length).to.equal(0);
		expect(state.elevators.length).to.equal(1);
	});
	it("should call ai when traveler is added on new floor", function (done) {
		ai.onFloorCalled = function (state, floor) {
			expect(floor).to.equal(0);
			done();
		};
		elevatorsystem.addTraveler(traveler);
	});
	it("should not call ai when traveler is added on already calling floor", function () {
		elevatorsystem.addTraveler(traveler);
		ai.onFloorCalled = function (state, floor) {
			expect(floor).to.equal(0);
			throw Error("fail");
		};
		elevatorsystem.addTraveler(traveler);
	});
	it("should send state to ai", function (done) {
		ai.onFloorCalled = function (state, floor) {
			expect(state.callingFloors.length).to.equal(1);
			done();
		};
		elevatorsystem.addTraveler(traveler);
	});
	it("should tick elevators", function (done) {
		elevator.onTick = function () {
			done();
		};
		elevatorsystem.onTick();
	});
	it("should tick travelers waiting", function (done) {
		traveler.onTick = function () {
			done();
		};
		elevatorsystem.addTraveler(traveler);
		elevatorsystem.onTick();
	});
	it("should tick ai", function (done) {
		ai.onTick = function () {
			done();
		};
		elevatorsystem.onTick();
	});
	it("should send state to elevators", function (done) {
		elevator.onTick = function (state) {
			expect(state).to.include.keys("callingFloors");
			done();
		};
		elevatorsystem.onTick();
	});
	it("should start moving elevator", function (done) {
		elevator.startMovingToFloor = function (floor) {
			expect(floor).to.equal(1);
			done();
		};
		elevatorsystem.startMovingElevator(0, 1);
	});
	it("should transfer travelers when elevator opens", function () {
		elevatorsystem.addTraveler(traveler);
		var state = elevatorsystem.getState();
		expect(state.callingFloors[0]).to.equal(0);

		elevatorsystem.onElevatorOpened(elevator);
		state = elevatorsystem.getState();
		expect(state.callingFloors.length).to.equal(0);
	});
});
