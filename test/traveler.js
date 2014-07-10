/*jshint expr: true*/
var expect = require("chai").expect;

describe("traveler", function () {
	var traveler, elevator;
	beforeEach(function () {
		var TravelerClass = require("../lib/traveler");
		traveler = new TravelerClass("id", 0, 2);
		elevator = {
			pushButton: function () {},
			getId: function () { return ""; }
		};
	});
	it("should return its id", function () {
		expect(traveler.getId()).to.equal("id");
	});
	it("should return its from floor", function () {
		expect(traveler.getFromFloor()).to.equal(0);
	});
	it("should return its to floor when going", function () {
		traveler.onEnterElevator(elevator);
		expect(traveler.getToFloor()).to.equal(2);
	});
	it("should return undefined to floor when waiting", function () {
		expect(traveler.getToFloor()).to.be.undefined;
	});
	it("should measure its waiting time", function () {
		traveler.onTick();
		expect(traveler.getWaitedTime()).to.equal(1);
	});
	it("should push button when entering elevator", function (done) {
		elevator.pushButton = function (floor) {
			expect(floor).to.equal(2);
			done();
		};
		traveler.onEnterElevator(elevator);
	});
	it("should measure its going time when in elevator", function () {
		traveler.onEnterElevator(elevator);
		traveler.onTick();
		expect(traveler.getGoingTime()).to.equal(1);
	});
});
