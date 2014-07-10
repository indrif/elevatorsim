var _ = require("underscore");

function Stats() {
    var timeline = [];
    var travelers = [];
    var self = this;

    var mean = function(samples) {
        return _.reduce(samples, function(memo, num) {
            return memo + num;
        }, 0) / samples.length;
    };

    var variance = function(samples) {
        var m = mean(samples);
        return _.reduce(samples, function(memo, num) {
            return memo + Math.pow(num - m, 2);
        }, 0) / samples.length;
    };

    var stddev = function(samples) {
        return Math.sqrt(variance(samples));
    };

    var getWaitTimes = function() {
        return _.map(travelers, function(item) {
            return item.waited;
        });
    };

    var getTravellingTimes = function() {
        return _.map(travelers, function(item) {
            return item.going;
        });
    };

    this.onTick = function(systemState) {
        timeline.push(systemState);
    };

    this.onTravelerUnloaded = function(traveler) {
        travelers.push({
            id: traveler.getId(),
            from: traveler.getFromFloor(),
            to: traveler.getToFloor(),
            waited: traveler.getWaitedTime(),
            going: traveler.getGoingTime()
        });
    };

    this.getMinWait = function() {
        return _.min(getWaitTimes());
    };

    this.getMaxWait = function() {
        return _.max(getWaitTimes());
    };

    this.getMeanWait = function() {
        return mean(getWaitTimes());
    };

    this.getWaitVariance = function() {
        return variance(getWaitTimes());
    };

    this.getWaitStandardDeviation = function() {
        return stddev(getWaitTimes());
    };

    this.getMinTravelling = function() {
        return _.min(getTravellingTimes());
    };

    this.getMaxTravelling = function() {
        return _.max(getTravellingTimes());
    };

    this.getMeanTravelling = function() {
        return mean(getTravellingTimes());
    };

    this.getTravellingVariance = function() {
        return variance(getTravellingTimes());
    };

    this.getTravellingStandardDeviation = function() {
        return stddev(getTravellingTimes());
    };

    this.getTimeLine = function() {
        return timeline;
    };
}

exports = module.exports = Stats;
